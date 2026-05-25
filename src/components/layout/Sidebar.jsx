import React from "react";
import {
  Box,
  VStack,
  Text,
  Link,
  Flex,
  HStack,
  Image,
} from "@chakra-ui/react";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Mail,
  User,
} from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Sidebar = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useRetroColors();

  const navItems = [
    { icon: User, label: "Profile", href: "#hero" },
    { icon: BookOpen, label: "Articles", href: "#articles" },
    { icon: Briefcase, label: "Experience", href: "#experience" },
    { icon: FolderOpen, label: "Projects", href: "#projects" },
    { icon: Award, label: "Skills", href: "#skills" },
    { icon: GraduationCap, label: "Education", href: "#education" },
    { icon: Activity, label: "Activities", href: "#activities" },
    { icon: Award, label: "Awards", href: "#achievements" },
    { icon: Mail, label: "Contact", href: "#contact" },
  ];

  return (
    <Box position="sticky" top="54px">
      <RetroPanel title="User Card" bodyProps={{ p: 3 }} mb={3}>
        <VStack spacing={2} align="stretch">
          <Box
            border="1px solid"
            borderColor={colors.border}
            bg={colors.panelAlt}
            p={1}
          >
            <Image
              src="/profilepic.png"
              alt={personalInfo.name || "Aurio Rajaa"}
              w="100%"
              aspectRatio="1"
              objectFit="cover"
              objectPosition="center"
            />
          </Box>
          <Box>
            <Text fontSize="16px" fontWeight="bold" color={colors.text}>
              {personalInfo.name || "Aurio Rajaa"}
            </Text>
            <Text fontSize="14px" color={colors.muted} lineHeight="1.35">
              {personalInfo.title || "Software Engineer"}
            </Text>
          </Box>
          <HStack spacing={1} flexWrap="wrap">
            <RetroBadge>Jakarta</RetroBadge>
            <RetroBadge tone="green">Open</RetroBadge>
          </HStack>
        </VStack>
      </RetroPanel>

      <RetroPanel title="Directory">
        <VStack spacing={0} align="stretch">
          {navItems.map((item, idx) => (
            <Link
              key={item.label}
              href={item.href}
              _hover={{ textDecoration: "none" }}
            >
              <Flex
                align="center"
                gap={2}
                px={3}
                py={2}
                borderBottom={idx !== navItems.length - 1 ? "1px solid" : "none"}
                borderColor={colors.borderSoft}
                bg={idx % 2 === 0 ? "transparent" : colors.panelAlt}
                _hover={{
                  bg: colors.paleBlue,
                }}
                cursor="pointer"
              >
                <item.icon size={14} color={colors.link} />
                <Text fontSize="15px" fontWeight="bold" color={colors.text}>
                  {item.label}
                </Text>
              </Flex>
            </Link>
          ))}
        </VStack>
      </RetroPanel>
    </Box>
  );
};

export default Sidebar;
