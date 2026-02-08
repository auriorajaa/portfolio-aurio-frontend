// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Collapse,
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
} from "lucide-react";
import { logoutAdmin } from "../services/authService";
import ArticleEditor from "../components/admin/ArticleEditor";
import ArticleList from "../components/admin/ArticleList";
import PersonalInfoEditor from "../components/admin/PersonalInfoEditor";
import ExperienceManager from "../components/admin/ExperienceManager";
import ProjectManager from "../components/admin/ProjectManager";
import EducationManager from "../components/admin/EducationManager";
import AchievementManager from "../components/admin/AchievementManager";
import ActivityManager from "../components/admin/ActivityManager";

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
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
    >
      {/* Section Header */}
      <Flex
        borderBottom={isOpen ? "1px solid" : "none"}
        borderColor="facebook.border"
        px={3}
        py={2}
        align="center"
        justify="space-between"
        bg="facebook.gray"
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: "#eeeeee" }}
      >
        <HStack spacing={2}>
          <Icon size={14} color="#3b5998" />
          <Text fontSize="12px" fontWeight="bold" color="facebook.text">
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
    <Box minH="100vh" bg="#e9ebee" py={4}>
      <Box maxW="1000px" mx="auto" px={4}>
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={4}
          bg="white"
          border="1px solid"
          borderColor="facebook.border"
          borderRadius="2px"
          px={3}
          py={2}
        >
          <Text fontSize="13px" fontWeight="bold" color="facebook.blue">
            Admin Dashboard
          </Text>
          <HStack spacing={2}>
            <Button
              size="xs"
              variant="facebookGray"
              onClick={() => navigate("/")}
              fontSize="11px"
              h="24px"
            >
              View Portfolio
            </Button>
            <Button
              size="xs"
              bg="#dc3545"
              color="white"
              onClick={handleLogout}
              fontSize="11px"
              h="24px"
              _hover={{ bg: "#c82333" }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

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
