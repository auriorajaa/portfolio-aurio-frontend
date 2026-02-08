import React from "react";
import {
  Box,
  VStack,
  Text,
  Link,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
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
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const hoverBg = useColorModeValue("#d8dfea", "#3a3b3c");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");

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
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
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
                borderColor={borderColor}
                _hover={{
                  bg: hoverBg,
                }}
                cursor="pointer"
              >
                <item.icon size={16} color={iconColor} />
                <Text fontSize="13px" fontWeight="bold" color={textColor}>
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
