import React from "react";
import { Box, Text, Flex, Link } from "@chakra-ui/react";
import { useThemeToggle } from "../../hooks/useThemeToggle";
import { personalInfo } from "../../data/portfolioData";

const Footer = () => {
  const { border, secondary } = useThemeToggle();
  const currentYear = new Date().getFullYear();

  return (
    <Box borderTop="1px solid" borderColor={border} py={6}>
      <Flex
        maxW="600px"
        mx="auto"
        px={4}
        justify="center"
        align="center"
        direction="column"
        gap={2}
      >
        <Flex gap={4}>
          <Link href={personalInfo.github} isExternal fontSize="sm" fontWeight="600">
            GitHub
          </Link>
          <Link href={personalInfo.linkedin} isExternal fontSize="sm" fontWeight="600">
            LinkedIn
          </Link>
          <Link href={`mailto:${personalInfo.email}`} fontSize="sm" fontWeight="600">
            Email
          </Link>
        </Flex>
        <Text fontSize="xs" color={secondary}>
          © {currentYear} {personalInfo.name}
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;