import React from "react";
import { Box, Flex, Grid, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { Github, Linkedin, Mail } from "lucide-react";
import Header from "./Header";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";

const FOOTER_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Writing", href: "/#articles" },
  { label: "Contact", href: "/#contact" },
];

const Layout = ({ children, isDownloading, handleDownload, tinted = false }) => {
  const colors = useStudioColors();
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const year = new Date().getFullYear();

  const socials = [
    personalInfo.github && {
      href: personalInfo.github,
      icon: <Github size={15} />,
      label: "GitHub",
      external: true,
    },
    personalInfo.linkedin && {
      href: personalInfo.linkedin,
      icon: <Linkedin size={15} />,
      label: "LinkedIn",
      external: true,
    },
    personalInfo.email && {
      href: `mailto:${personalInfo.email}`,
      icon: <Mail size={15} />,
      label: personalInfo.email,
      external: false,
    },
  ].filter(Boolean);

  return (
    <Box
      minH="100vh"
      bg="#ffffff"
      color={colors.text}
      display="flex"
      flexDirection="column"
    >
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Box as="main" flex="1" bg={tinted ? "#c9d8ea" : "transparent"}>
        {children}
      </Box>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <Box
        as="footer"
        bg={colors.navy}
        color={colors.onNavy}
        borderTop="3px solid"
        borderColor={colors.accent}
      >
        <Box maxW="1400px" mx="auto" px={{ base: 5, md: 10 }} py={{ base: 10, md: 12 }}>
          <Grid
            templateColumns={{ base: "1fr", md: "1.3fr 1fr 1fr" }}
            gap={{ base: 8, md: 10 }}
          >
            {/* Identity */}
            <Box>
              <Text fontSize="21px" fontWeight="700" color={colors.onNavy} mb={2}>
                {personalInfo.name || "Aurio Rajaa"}
              </Text>
              <Text fontSize="15px" lineHeight="1.7" color={colors.onNavyMuted} maxW="360px">
                {personalInfo.title || "Software Engineer"}
                {personalInfo.location ? ` - ${personalInfo.location}` : ""} Building
                backend systems, APIs, and practical web products.
              </Text>
            </Box>

            {/* Site links */}
            <Box>
              <Text
                fontSize="14px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing=".08em"
                color="#ffffff"
                mb={3}
              >
                Browse
              </Text>
              <VStack align="stretch" spacing={2}>
                {FOOTER_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    fontSize="16px"
                    fontWeight="600"
                    color="#dbe7f5"
                    _hover={{ color: "#ffffff" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </VStack>
            </Box>

            {/* Contact */}
            <Box>
              <Text
                fontSize="14px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing=".08em"
                color="#ffffff"
                mb={3}
              >
                Get in Touch
              </Text>
              <VStack align="stretch" spacing={2}>
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    isExternal={s.external}
                    display="inline-flex"
                    alignItems="center"
                    gap="8px"
                    fontSize="16px"
                    fontWeight="600"
                    color="#dbe7f5"
                    _hover={{ color: "#ffffff" }}
                  >
                    {s.icon}
                    {s.label}
                  </Link>
                ))}
              </VStack>
            </Box>
          </Grid>
        </Box>

        {/* Bottom bar */}
        <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.16)">
          <Flex
            maxW="1400px"
            mx="auto"
            px={{ base: 5, md: 10 }}
            py={4}
            direction={{ base: "column", sm: "row" }}
            align="center"
            justify="space-between"
            gap={2}
          >
            <Text fontSize="14px" color={colors.onNavyMuted}>
              © {year} {personalInfo.name || "Aurio Rajaa"}. All rights reserved.
            </Text>
            <HStack spacing={4}>
              <Box
                as="button"
                type="button"
                fontSize="14px"
                fontWeight="600"
                color={colors.onNavyMuted}
                bg="transparent"
                border="none"
                cursor="pointer"
                p={0}
                _hover={{ color: "#ffffff", textDecoration: "underline" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top ↑
              </Box>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
