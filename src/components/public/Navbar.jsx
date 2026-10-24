import React, { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Download, Menu, X } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { BRUT, Magnetic } from "./brutal";

const NAV_ITEMS = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Writing", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = ({ isDownloading, handleDownload }) => {
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
        bg={BRUT.surface}
        border="2px solid"
        borderColor={BRUT.ink}
        borderRadius="12px"
        boxShadow={BRUT.shadow}
        overflow="hidden"
      >
        <Flex
          h={{ base: "62px", md: "70px" }}
          align="center"
          justify="space-between"
          gap={3}
          px={{ base: 3.5, md: 6 }}
        >
          {/* Wordmark: initials block + name */}
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
            <Flex
              align="center"
              justify="center"
              w="44px"
              h="44px"
              bg={BRUT.primary}
              color="#FFFFFF"
              border="2px solid"
              borderColor={BRUT.ink}
              borderRadius="8px"
              boxShadow={BRUT.shadowXs}
              flexShrink={0}
              transition="transform .2s ease"
              _hover={{ transform: "translate(-2px, -2px)" }}
            >
              <Text fontFamily="bungee" fontSize="16px" lineHeight="1">
                {initials}
              </Text>
            </Flex>
            <Box lineHeight="1.1">
              <Text
                fontFamily="heading"
                fontSize={{ base: "15px", sm: "18px" }}
                fontWeight="600"
                color={BRUT.heading}
                whiteSpace="nowrap"
              >
                {name}
              </Text>
              <Text
                fontFamily="spaceMono"
                fontSize={{ base: "9px", sm: "10px" }}
                fontWeight="700"
                letterSpacing=".14em"
                textTransform="uppercase"
                color={BRUT.inkSoft}
                whiteSpace="nowrap"
                mt="2px"
              >
                {personalInfo.title || "Software Engineer"}
              </Text>
            </Box>
          </Link>

          {/* Desktop nav: chunky link chips */}
          <HStack
            as="nav"
            spacing="6px"
            display={{ base: "none", lg: "flex" }}
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={`/${item.href}`}
                fontFamily="spaceMono"
                fontSize="12px"
                fontWeight="700"
                letterSpacing=".1em"
                textTransform="uppercase"
                color={BRUT.heading}
                px={3}
                py="8px"
                border="2px solid transparent"
                borderRadius="6px"
                whiteSpace="nowrap"
                transition="all .14s ease"
                _hover={{
                  bg: index % 2 === 0 ? BRUT.yellow : BRUT.primarySoft,
                  borderColor: BRUT.ink,
                  boxShadow: BRUT.shadowXs,
                  transform: "translate(-1px, -1px)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={2} flexShrink={0}>
            <Magnetic pull={4} display={{ base: "none", sm: "inline-block" }}>
              <Button
                variant="brutOutline"
                size="sm"
                h="42px"
                px={{ base: 3, md: 4 }}
                leftIcon={<Download size={15} />}
                onClick={handleDownload}
                isLoading={isDownloading}
                aria-label="Download CV"
              >
                CV
              </Button>
            </Magnetic>
            <Magnetic pull={4} display={{ base: "none", md: "inline-block" }}>
              <Button
                as={Link}
                href="/#contact"
                variant="brutCoral"
                size="sm"
                h="42px"
                px={{ base: 4, md: 5 }}
                _hover={{ textDecoration: "none" }}
              >
                Let&apos;s talk
              </Button>
            </Magnetic>

            {/* Mobile menu toggle */}
            <Flex
              as="button"
              type="button"
              display={{ base: "flex", lg: "none" }}
              alignItems="center"
              justifyContent="center"
              w="44px"
              h="44px"
              bg={menuOpen ? BRUT.coral : BRUT.yellow}
              color={menuOpen ? "#FFFFFF" : BRUT.ink}
              borderRadius="8px"
              border="2px solid"
              borderColor={BRUT.ink}
              boxShadow={BRUT.shadowXs}
              cursor="pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              _hover={{ transform: "translate(-1px, -1px)", boxShadow: BRUT.shadow }}
              transition="all .14s ease"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Flex>
          </HStack>
        </Flex>

        {/* Mobile menu */}
        {menuOpen && (
          <Box
            px={{ base: 3.5, md: 6 }}
            pb={5}
            pt={2}
            display={{ base: "block", lg: "none" }}
            borderTop="2px dashed"
            borderColor="rgba(23,24,28,0.3)"
            mx={{ base: 1.5, md: 2 }}
          >
            {NAV_ITEMS.map((item, index) => {
              const tints = [BRUT.yellowSoft, BRUT.primarySoft, BRUT.blueSoft, BRUT.coralSoft, BRUT.limeSoft];
              return (
                <Link
                  key={item.href}
                  href={`/${item.href}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  py="12px"
                  px={3}
                  mt={2}
                  fontSize="17px"
                  fontWeight="600"
                  color={BRUT.heading}
                  bg={tints[index % tints.length]}
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="8px"
                  boxShadow={BRUT.shadowXs}
                  _hover={{
                    transform: "translate(-1px, -1px)",
                    boxShadow: BRUT.shadow,
                    textDecoration: "none",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <Box as="span" fontFamily="spaceMono" fontWeight="700" fontSize="12px">
                    0{index + 1}
                  </Box>
                </Link>
              );
            })}
            <Flex gap={3} mt={5}>
              <Button
                variant="brut"
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
                variant="brutCoral"
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
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
