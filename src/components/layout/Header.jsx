import React, { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Download, Menu, X } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { LAGOON, Magnetic } from "../public/studio";

const NAV_ITEMS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Writing", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

const Header = ({ isDownloading, handleDownload }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};

  const name = personalInfo.name || "Aurio Rajaa";
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      px={{ base: 3, md: 6 }}
      pt={{ base: 3, md: 4 }}
      pointerEvents="none"
    >
      <Box
        maxW="1200px"
        mx="auto"
        pointerEvents="auto"
        bg="#FFFFFF"
        border="1.5px solid"
        borderColor={LAGOON.ink}
        borderRadius="16px"
        boxShadow={LAGOON.shadowSoft}
        overflow="hidden"
      >
        <Flex
          h={{ base: "62px", md: "70px" }}
          align="center"
          justify="space-between"
          gap={4}
          px={{ base: 4, md: 6 }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            display="flex"
            alignItems="center"
            gap={3}
            flexShrink={0}
            onClick={() => setMenuOpen(false)}
            _hover={{ textDecoration: "none" }}
            aria-label={`${name} home`}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="42px"
              h="42px"
              borderRadius="999px"
              bg={LAGOON.primaryDeep}
              color={LAGOON.onDark}
              border="1.5px solid"
              borderColor={LAGOON.ink}
              fontSize="15px"
              fontWeight="800"
              letterSpacing=".02em"
              position="relative"
              flexShrink={0}
            >
              {initials}
            </Box>
            <Box lineHeight="1.12">
              <Text
                fontFamily="heading"
                fontSize={{ base: "14px", sm: "17px" }}
                fontWeight="700"
                letterSpacing="-.02em"
                color={LAGOON.heading}
                whiteSpace="nowrap"
              >
                {name}
              </Text>
              <Text
                fontSize={{ base: "10px", sm: "12px" }}
                fontWeight="600"
                color={LAGOON.muted}
                whiteSpace="nowrap"
                mt="1px"
              >
                {personalInfo.title || "Software Engineer"}
              </Text>
            </Box>
          </Link>

          {/* Desktop nav */}
          <HStack
            as="nav"
            spacing={1}
            display={{ base: "none", lg: "flex" }}
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={`/${item.href}`}
                fontSize="15px"
                fontWeight="600"
                color={LAGOON.text}
                px={4}
                py="9px"
                borderRadius="8px"
                whiteSpace="nowrap"
                transition="background .15s ease, color .15s ease"
                _hover={{
                  color: LAGOON.primaryDeep,
                  bg: LAGOON.surfaceTint,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={2} flexShrink={0}>
            <Magnetic pull={5}>
              <Button
                variant="lagoonOutline"
                size="sm"
                h="42px"
                px={{ base: 3, md: 5 }}
                leftIcon={<Download size={15} />}
                onClick={handleDownload}
                isLoading={isDownloading}
                aria-label="Download CV"
                display={{ base: "none", sm: "inline-flex" }}
              >
                CV
              </Button>
            </Magnetic>
            <Magnetic pull={5} display={{ base: "none", md: "inline-block" }}>
              <Button
                as={Link}
                href="/#contact"
                variant="lagoonCoral"
                size="sm"
                h="42px"
                px={{ base: 4, md: 5 }}
                display={{ base: "none", md: "inline-flex" }}
                _hover={{ textDecoration: "none" }}
              >
                Let&apos;s talk
              </Button>
            </Magnetic>

            {/* Mobile menu toggle */}
            <Box
              as="button"
              type="button"
              display={{ base: "flex", lg: "none" }}
              alignItems="center"
              justifyContent="center"
              w="42px"
              h="42px"
              borderRadius="12px"
              border="1.5px solid"
              borderColor={LAGOON.ink}
              boxShadow="3px 3px 0 #0B2F2F"
              bg="#FFFFFF"
              color={LAGOON.heading}
              cursor="pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </Box>
          </HStack>
        </Flex>

        {/* Mobile menu */}
        {menuOpen && (
          <Box
            px={{ base: 4, md: 6 }}
            pb={5}
            pt={1}
            display={{ base: "block", lg: "none" }}
          >
            <Box borderTop="1px solid" borderColor={LAGOON.borderSoft} pt={3}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={`/${item.href}`}
                  display="flex"
                  alignItems="center"
                  justify="space-between"
                  py="13px"
                  px={3}
                  fontSize="17px"
                  fontWeight="600"
                  color={LAGOON.heading}
                  borderRadius="8px"
                  _hover={{
                    color: LAGOON.primary,
                    bg: LAGOON.surfaceTint,
                    textDecoration: "none",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <Box as="span" color={LAGOON.muted}>
                    →
                  </Box>
                </Link>
              ))}
              <Flex gap={3} mt={4}>
                <Button
                  variant="lagoon"
                  size="sm"
                  flex="1"
                  h="46px"
                  leftIcon={<Download size={15} />}
                  onClick={() => {
                    setMenuOpen(false);
                    handleDownload();
                  }}
                  isLoading={isDownloading}
                >
                  Download CV
                </Button>
                <Button
                  as={Link}
                  href="/#contact"
                  variant="lagoonCoral"
                  size="sm"
                  flex="1"
                  h="46px"
                  onClick={() => setMenuOpen(false)}
                  _hover={{ textDecoration: "none" }}
                >
                  Let&apos;s talk
                </Button>
              </Flex>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
