// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Collapse,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  User,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Award,
  Activity,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { logoutAdmin } from "../services/authService";
import ArticleEditor from "../components/admin/ArticleEditor";
import ArticleList from "../components/admin/ArticleList";
import PersonalInfoEditor from "../components/admin/PersonalInfoEditor";
import ExperienceManager from "../components/admin/ExperienceManager";
import ProjectManager from "../components/admin/ProjectManager";
import EducationManager from "../components/admin/EducationManager";
import AchievementManager from "../components/admin/AchievementManager";
import ActivityManager from "../components/admin/ActivityManager";
import { usePortfolio } from "../contexts/PortfolioContext";
import { RetroBadge, useRetroColors } from "../components/ui/retro";

const AdminDashboard = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openSections, setOpenSections] = useState({
    personalInfo: true,
    experience: false,
    projects: false,
    education: false,
    achievements: false,
    activities: false,
    articles: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { portfolioData } = usePortfolio();
  const colors = useRetroColors();

  // Color mode values
  const bgColor = useColorModeValue("#cfd7e2", "#0f151d");
  const cardBg = colors.panelBg;
  const borderColor = colors.border;
  const textColor = colors.text;
  const headerBg = colors.headerBg;
  const hoverBg = colors.paleBlue;
  const iconColor = colors.link;

  const dashboardStats = [
    ["Projects", portfolioData.projects?.length || 0],
    ["Experience", portfolioData.experiences?.length || 0],
    ["Education", (portfolioData.education?.length || 0) + (portfolioData.certifications?.length || 0)],
    ["Awards", portfolioData.achievements?.length || 0],
    ["Activities", portfolioData.activities?.length || 0],
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedArticle(null);
    onOpen();
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    onOpen();
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    onViewOpen();
  };

  const handleSuccess = () => {
    onClose();
    setRefreshKey((prev) => prev + 1);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionBox = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    children,
    actionButton,
  }) => (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="0"
      mb={4}
      boxShadow={colors.shadow}
    >
      {/* Section Header */}
      <Flex
        borderBottom={isOpen ? "1px solid" : "none"}
        borderColor={borderColor}
        px={3}
        py={2}
        align="center"
        justify="space-between"
        bg={headerBg}
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: hoverBg }}
        boxShadow="inset 0 1px 0 rgba(255,255,255,.45)"
      >
        <HStack spacing={2}>
          <Icon size={16} color={iconColor} />
          <Text fontSize="14px" fontWeight="bold" color={textColor}>
            {title}
          </Text>
        </HStack>
        <HStack spacing={2}>
          {actionButton}
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </HStack>
      </Flex>

      {/* Section Content */}
      <Collapse in={isOpen} animateOpacity>
        <Box px={3} py={3}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <Box minH="100vh" bg={bgColor} py={4}>
      <Box maxW="1280px" mx="auto" px={{ base: 2, md: 4 }}>
        {/* Header */}
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={3}
          mb={4}
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="0"
          px={3}
          py={3}
          boxShadow={colors.shadow}
        >
          <HStack spacing={2}>
            <ShieldCheck size={18} color={iconColor} />
            <Box>
              <Text fontSize="15px" fontWeight="bold" color={iconColor}>
                Site Control Panel
              </Text>
              <Text fontSize="11px" color={colors.muted}>
                Firebase-authenticated portfolio management console
              </Text>
            </Box>
          </HStack>
          <HStack spacing={2}>
            <IconButton
              icon={
                colorMode === "light" ? <Moon size={14} /> : <Sun size={14} />
              }
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              variant="facebookGray"
              size="sm"
              h="32px"
              title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
            />
            <Button
              size="sm"
              variant="facebookGray"
              onClick={() => navigate("/")}
              fontSize="13px"
              h="32px"
            >
              View Portfolio
            </Button>
            <Button
              size="sm"
              bg="#dc3545"
              color="white"
              onClick={handleLogout}
              fontSize="13px"
              h="32px"
              _hover={{ bg: "#c82333" }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={2} mb={4}>
          {dashboardStats.map(([label, value]) => (
            <Box
              key={label}
              border="1px solid"
              borderColor={borderColor}
              bg={cardBg}
              p={2}
              boxShadow={colors.shadow}
            >
              <Text fontSize="10px" color={colors.muted} textTransform="uppercase">
                {label}
              </Text>
              <HStack spacing={2} justify="space-between">
                <Text fontSize="18px" fontWeight="bold" color={textColor}>
                  {value}
                </Text>
                <RetroBadge tone="green">Live</RetroBadge>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Personal Info Section */}
        <SectionBox
          title="Personal Information"
          icon={User}
          isOpen={openSections.personalInfo}
          onToggle={() => toggleSection("personalInfo")}
        >
          <PersonalInfoEditor />
        </SectionBox>

        {/* Experience Section */}
        <SectionBox
          title="Work Experience"
          icon={Briefcase}
          isOpen={openSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          <ExperienceManager />
        </SectionBox>

        {/* Projects Section */}
        <SectionBox
          title="Projects"
          icon={FolderOpen}
          isOpen={openSections.projects}
          onToggle={() => toggleSection("projects")}
        >
          <ProjectManager />
        </SectionBox>

        {/* Education Section */}
        <SectionBox
          title="Education & Certifications"
          icon={GraduationCap}
          isOpen={openSections.education}
          onToggle={() => toggleSection("education")}
        >
          <EducationManager />
        </SectionBox>

        {/* Achievements Section */}
        <SectionBox
          title="Achievements"
          icon={Award}
          isOpen={openSections.achievements}
          onToggle={() => toggleSection("achievements")}
        >
          <AchievementManager />
        </SectionBox>

        {/* Activities Section */}
        <SectionBox
          title="Activities"
          icon={Activity}
          isOpen={openSections.activities}
          onToggle={() => toggleSection("activities")}
        >
          <ActivityManager />
        </SectionBox>

        {/* Articles Section */}
        <SectionBox
          title="Articles"
          icon={FileText}
          isOpen={openSections.articles}
          onToggle={() => toggleSection("articles")}
          actionButton={
            <Button
              leftIcon={<AddIcon boxSize={3} />}
              size="xs"
              variant="facebook"
              onClick={(e) => {
                e.stopPropagation();
                handleCreateNew();
              }}
              fontSize="10px"
              h="22px"
              px={2}
            >
              New
            </Button>
          }
        >
          <ArticleList
            onEdit={handleEdit}
            onView={handleView}
            refresh={refreshKey}
          />
        </SectionBox>
      </Box>

      {/* Article Editor Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedArticle ? "Edit Article" : "Create New Article"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ArticleEditor
              article={selectedArticle}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Article Preview Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>{selectedArticle?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedArticle && (
              <Box>
                {selectedArticle.image && (
                  <Box mb={4}>
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </Box>
                )}
                <Box
                  dangerouslySetInnerHTML={{
                    __html: selectedArticle.description,
                  }}
                  sx={{
                    "& img": { maxW: "100%", h: "auto" },
                    "& p": { mb: 4 },
                    "& h1, & h2, & h3, & h4, & h5, & h6": { mb: 2, mt: 4 },
                  }}
                />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
