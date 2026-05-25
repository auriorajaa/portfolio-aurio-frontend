import React from "react";
import { Box, Flex, HStack, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  Award,
  BookOpen,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Mail,
  User,
} from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroPanel, useRetroColors } from "../ui/retro";

const MobileNav = () => {
  const colors = useRetroColors();
  const navItems = [
    { icon: User, label: "Profile", href: "#hero" },
    { icon: BookOpen, label: "Articles", href: "#articles" },
    { icon: Briefcase, label: "Work", href: "#experience" },
    { icon: FolderOpen, label: "Projects", href: "#projects" },
    { icon: Award, label: "Skills", href: "#skills" },
    { icon: GraduationCap, label: "Edu", href: "#education" },
    { icon: Mail, label: "Contact", href: "#contact" },
  ];

  return (
    <Box
      display={{ base: "block", lg: "none" }}
      bg={colors.panelBg}
      borderBottom="1px solid"
      borderColor={colors.border}
      overflowX="auto"
      sx={{ scrollbarWidth: "thin" }}
    >
      <HStack spacing={0} minW="max-content">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} _hover={{ textDecoration: "none" }}>
            <HStack
              spacing={1}
              px={3}
              h="34px"
              borderRight="1px solid"
              borderColor={colors.borderSoft}
              color={colors.text}
              _hover={{ bg: colors.paleBlue }}
            >
              <item.icon size={12} color={colors.link} />
              <Text fontSize="14px" fontWeight="bold">
                {item.label}
              </Text>
            </HStack>
          </Link>
        ))}
      </HStack>
    </Box>
  );
};

const StatusRail = () => {
  const { portfolioData } = usePortfolio();
  const colors = useRetroColors();
  const personalInfo = portfolioData.personalInfo || {};
  const stats = [
    ["Projects", portfolioData.projects?.length || 0],
    ["Articles", "Live"],
    ["Experience", portfolioData.experiences?.length || 0],
    // [
    //   "Credentials",
    //   (portfolioData.education?.length || 0) + (portfolioData.certifications?.length || 0),
    // ],
    ["Awards", portfolioData.achievements?.length || 0],
  ];

  return (
    <Box position="sticky" top="54px">
      <RetroPanel title="Status Monitor" bodyProps={{ p: 3 }} mb={3}>
        <VStack spacing={2} align="stretch">
          <SimpleGrid columns={2} spacing={2}>
            {stats.map(([label, value]) => (
              <Box
                key={label}
                border="1px solid"
                borderColor={colors.borderSoft}
                bg={colors.panelAlt}
                p={2}
              >
                <Text fontSize="13px" color={colors.muted} textTransform="uppercase">
                  {label}
                </Text>
                <Text fontSize="18px" fontWeight="bold" color={colors.text}>
                  {value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </RetroPanel>

      <RetroPanel title="Contact Port" bodyProps={{ p: 3 }}>
        <VStack spacing={2} align="stretch">
          <Box>
            <Text fontSize="13px" color={colors.muted} textTransform="uppercase">
              Email
            </Text>
            <Link href={`mailto:${personalInfo.email}`} fontSize="15px" fontWeight="bold">
              {personalInfo.email}
            </Link>
          </Box>
          <Box>
            <Text fontSize="13px" color={colors.muted} textTransform="uppercase">
              Location
            </Text>
            <Text fontSize="15px" color={colors.text}>
              {personalInfo.location || "Jakarta, Indonesia"}
            </Text>
          </Box>
        </VStack>
      </RetroPanel>
    </Box>
  );
};

const Layout = ({ children, isDownloading, handleDownload }) => {
  const colors = useRetroColors();

  return (
    <Box minH="100vh" bg={colors.pageBg}>
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />
      <MobileNav />

      <Flex
        maxW="1280px"
        mx="auto"
        gap={3}
        px={{ base: 2, md: 3, xl: 4 }}
        py={3}
        align="flex-start"
      >
        <Box w="210px" flexShrink={0} display={{ base: "none", lg: "block" }}>
          <Sidebar />
        </Box>

        <Box flex="1" minW={0}>
          {children}
        </Box>

        <Box w="260px" flexShrink={0} display={{ base: "none", xl: "block" }}>
          <StatusRail />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
