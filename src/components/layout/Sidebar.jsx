import React from "react";
import { Box, VStack, Text, Link, Flex } from "@chakra-ui/react";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Activity,
  Mail,
  FolderOpen,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { icon: User, label: "Profile", href: "#hero" },
    { icon: Briefcase, label: "Experience", href: "#experience" },
    { icon: FolderOpen, label: "Projects", href: "#projects" },
    { icon: Award, label: "Skills", href: "#skills" },
    { icon: GraduationCap, label: "Education", href: "#education" },
    { icon: Activity, label: "Activities", href: "#activities" },
    { icon: Award, label: "Achievements", href: "#achievements" },
    { icon: Mail, label: "Contact", href: "#contact" },
  ];

  return (
    <Box
      position="sticky"
      top="60px" // Adjust this based on your Header's height
    >
      {/* Navigation */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="facebook.border"
        borderRadius="2px"
        mb={3}
      >
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
                borderBottom={
                  idx !== navItems.length - 1 ? "1px solid" : "none"
                }
                borderColor="facebook.border"
                _hover={{
                  bg: "facebook.paleBlue",
                }}
                cursor="pointer"
              >
                <item.icon size={14} color="#3b5998" />
                <Text fontSize="11px" fontWeight="bold" color="facebook.text">
                  {item.label}
                </Text>
              </Flex>
            </Link>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
