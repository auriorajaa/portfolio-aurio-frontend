import React, { useState } from "react";
import { Box, Button, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Download, Github, Linkedin, Mail, MapPin, Menu, X } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Gallery", href: "#gallery" },
  { label: "Writing", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

const Header = ({ isDownloading, handleDownload }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();

  const utilityLinks = [
    personalInfo.github && {
      href: personalInfo.github,
      icon: <Github size={13} />,
      label: "GitHub",
      external: true,
    },
    personalInfo.linkedin && {
      href: personalInfo.linkedin,
      icon: <Linkedin size={13} />,
      label: "LinkedIn",
      external: true,
    },
  ].filter(Boolean);

  return (
    <Box as="header" position="sticky" top={0} zIndex={1000}>
      {/* Utility strip */}
      <Box
        bg={colors.navyDark}
        borderBottom="1px solid rgba(255,255,255,0.12)"
        display={{ base: "none", md: "block" }}
      >
        <Flex
          maxW="1400px"
          mx="auto"
          px={{ base: 5, md: 10 }}
          h="38px"
          align="center"
          justify="space-between"
          gap={4}
        >
          <HStack spacing={5} fontSize="13px" color={colors.onNavyMuted}>
            {personalInfo.email && (
              <Link
                href={`mailto:${personalInfo.email}`}
                display="inline-flex"
                alignItems="center"
                gap="6px"
                color={colors.onNavyMuted}
                fontWeight="600"
                _hover={{ color: "#ffffff", textDecoration: "none" }}
              >
                <Mail size={13} />
                {personalInfo.email}
              </Link>
            )}
            {personalInfo.location && (
              <Box as="span" display="inline-flex" alignItems="center" gap="6px" fontWeight="600">
                <MapPin size={13} />
                {personalInfo.location}
              </Box>
            )}
          </HStack>

          <HStack spacing={5} fontSize="13px">
            {utilityLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                isExternal={item.external}
                display="inline-flex"
                alignItems="center"
                gap="6px"
                color={colors.onNavyMuted}
                fontWeight="600"
                _hover={{ color: "#ffffff", textDecoration: "none" }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </HStack>
        </Flex>
      </Box>

      {/* Main nav bar */}
      <Box
        bg={colors.navyGradient}
        boxShadow="0 2px 6px rgba(9,24,42,0.35)"
      >
        <Flex
          maxW="1400px"
          mx="auto"
          px={{ base: 5, md: 10 }}
          h={{ base: "64px", md: "78px" }}
          align="center"
          justify="space-between"
          gap={4}
        >
          {/* Wordmark */}
          <Link
            href="/"
            display="block"
            flexShrink={0}
            onClick={() => setMenuOpen(false)}
            _hover={{ textDecoration: "none" }}
          >
            <Text
              fontSize={{ base: "20px", md: "25px" }}
              fontWeight="700"
              color="#ffffff"
              lineHeight="1.1"
              textShadow="0 1px 2px rgba(9,24,42,0.6)"
            >
              {personalInfo.name || "Aurio Rajaa"}
            </Text>
            <Text
              fontSize="12px"
              fontWeight="700"
              color={colors.onNavyMuted}
              letterSpacing=".14em"
              textTransform="uppercase"
              lineHeight="1.4"
              textShadow="0 1px 1px rgba(9,24,42,0.6)"
              display={{ base: "none", sm: "block" }}
            >
              {personalInfo.title || "Software Engineer"}
            </Text>
          </Link>

          {/* Desktop nav — chunky tab links */}
          <HStack as="nav" spacing={1} display={{ base: "none", lg: "flex" }}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={`/${item.href}`}
                fontSize="15px"
                fontWeight="700"
                color="#dbe7f5"
                whiteSpace="nowrap"
                px={3}
                py="9px"
                borderRadius="4px"
                border="1px solid transparent"
                textShadow="0 1px 1px rgba(9,24,42,0.5)"
                transition="background .15s ease, border-color .15s ease, color .15s ease"
                _hover={{
                  color: "#ffffff",
                  bg: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
                  borderColor: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={2} flexShrink={0}>
            <Button
              variant="classicWhite"
              size="sm"
              h="40px"
              px={5}
              fontSize="15px"
              leftIcon={<Download size={15} />}
              onClick={handleDownload}
              isLoading={isDownloading}
              display={{ base: "none", sm: "inline-flex" }}
            >
              Download CV
            </Button>

            {/* Mobile menu toggle */}
            <Box
              as="button"
              type="button"
              display={{ base: "flex", lg: "none" }}
              alignItems="center"
              justifyContent="center"
              w="42px"
              h="40px"
              border="1px solid"
              borderColor="rgba(255,255,255,0.45)"
              borderRadius="4px"
              bg="linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%)"
              color="#ffffff"
              cursor="pointer"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Box>
          </HStack>
        </Flex>
      </Box>

      {/* White base line */}
      <Box h="4px" bg="#ffffff" boxShadow="0 1px 0 rgba(9,24,42,0.15)" />

      {/* Mobile menu */}
      {menuOpen && (
        <Box
          display={{ base: "block", lg: "none" }}
          bg={colors.navyDark}
          borderTop="1px solid rgba(255,255,255,0.14)"
          boxShadow="0 8px 18px rgba(9,24,42,0.4)"
          px={5}
          pt={2}
          pb={5}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              display="block"
              py="12px"
              fontSize="16px"
              fontWeight="700"
              color="#dbe7f5"
              textShadow="0 1px 1px rgba(9,24,42,0.5)"
              borderBottom="1px solid"
              borderColor="rgba(255,255,255,0.14)"
              _hover={{ color: "#ffffff", textDecoration: "none" }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            variant="classicWhite"
            size="sm"
            w="100%"
            h="42px"
            mt={4}
            leftIcon={<Download size={15} />}
            onClick={() => {
              setMenuOpen(false);
              handleDownload();
            }}
            isLoading={isDownloading}
          >
            Download CV
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
