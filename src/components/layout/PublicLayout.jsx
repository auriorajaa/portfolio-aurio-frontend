import React from "react";
import { Box, Flex, Grid, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { Navbar } from "../public/Navbar";
import Contact from "../sections/Contact";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  BRUT,
  PublicShell,
  DoodleAsterisk,
  DoodlePaperPlane,
  DoodleStar,
} from "../public/brutal";

const FOOTER_LINKS = [
  { label: "Work", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Writing", href: "/#articles" },
];

const PublicLayout = ({ children, isDownloading, handleDownload }) => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const year = new Date().getFullYear();
  const name = personalInfo.name || "Aurio Rajaa";

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
      label: "Email",
      external: false,
    },
  ].filter(Boolean);


  return (
    <PublicShell display="flex" flexDirection="column">
      <Navbar isDownloading={isDownloading} handleDownload={handleDownload} />

      <Box as="main" flex="1">
        {children}
      </Box>

      {/* ── Footer: the ink panel at the end of the page ──────────── */}
      <Box
        as="footer"
        position="relative"
        overflow="hidden"
        bg={BRUT.ink}
        borderTop="2px solid"
        borderBottomColor={BRUT.ink}
        color={BRUT.onDark}
      >
        {/* Faint candy stripes on ink */}
        <Box
          aria-hidden="true"
          className="public-dots-light"
          position="absolute"
          inset={0}
          opacity={0.1}
          pointerEvents="none"
        />

        {/* Loose stickers pinned to the ink sheet */}
        <Box
          aria-hidden="true"
          position="absolute"
          right={{ base: "5%", md: "4%" }}
          top="36px"
          zIndex={2}
          pointerEvents="none"
          display={{ base: "none", md: "block" }}
        >
          <DoodleStar size={34} />
        </Box>

        <Box
          position="relative"
          maxW="1200px"
          mx="auto"
          px={{ base: 5, md: 8, lg: 10 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 30, md: 40 }}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1.25fr 0.75fr" }}
            gap={{ base: 12, lg: 14 }}
            alignItems="start"
          >
            {/* Contact */}
            <Box id="contact" position="relative">
              <Flex align="center" gap={3} mb={2}>
                <Box
                  bg={BRUT.coral}
                  border="2px solid"
                  borderColor={BRUT.onDark}
                  borderRadius="6px"
                  px={3}
                  py="4px"
                >
                  <Text
                    fontFamily="bungee"
                    fontSize="11px"
                    color="#FFFFFF"
                    lineHeight="1.4"
                  >
                    SEND MAIL
                  </Text>
                </Box>
                <DoodleAsterisk size={18} color={BRUT.yellow} />
              </Flex>
              <Box position="relative" display="inline-block">
                <DoodlePaperPlane
                  size={54}
                  position="absolute"
                  top="-22px"
                  left="-44px"
                  display={{ base: "none", lg: "block" }}
                />
                <Heading
                  as="h2"
                  fontFamily="bungee"
                  fontSize={{ base: "28px", md: "38px" }}
                  fontWeight="400"
                  lineHeight="1.15"
                  color={BRUT.onDark}
                  mt={2}
                  mb={3}
                >
                  LET&apos;S BUILD
                  <br />
                  <Text as="span" color={BRUT.primary}>
                    SOMETHING FUN.
                  </Text>
                </Heading>
              </Box>
              <Text
                fontSize="16px"
                lineHeight="1.75"
                color={BRUT.onDarkMuted}
                mb={7}
                maxW="520px"
              >
                My inbox is always open. Serve me a detail or two, and I
                usually reply within a day or two.
              </Text>

              <Box maxW={{ base: "100%", lg: "620px" }}>
                <Contact />
              </Box>
            </Box>

            {/* Links + socials */}
            <Grid
              templateColumns={{ base: "1fr 1fr" }}
              gap={{ base: 8, md: 10 }}
              pt={{ base: 2, lg: 6 }}
            >
              <Box>
                <Text
                  fontFamily="spaceMono"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing=".16em"
                  textTransform="uppercase"
                  color={BRUT.onDarkMuted}
                  mb={4}
                >
                  browse
                </Text>
                <VStack align="stretch" spacing={3}>
                  {FOOTER_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      fontFamily="heading"
                      fontSize="16px"
                      fontWeight="600"
                      color={BRUT.onDark}
                      display="inline-flex"
                      alignItems="center"
                      gap="8px"
                      w="fit-content"
                      transform="translateX(0)"
                      transition="all .15s ease"
                      _hover={{
                        color: BRUT.yellow,
                        textDecoration: "none",
                        transform: "translateX(4px)",
                      }}
                    >
                      <Box
                        as="span"
                        w="9px"
                        h="9px"
                        borderRadius="2px"
                        bg={BRUT.primary}
                        border="1px solid"
                        borderColor={BRUT.onDarkMuted}
                        flexShrink={0}
                      />
                      {item.label}
                    </Link>
                  ))}
                </VStack>
              </Box>

              <Box>
                <Text
                  fontFamily="spaceMono"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing=".16em"
                  textTransform="uppercase"
                  color={BRUT.onDarkMuted}
                  mb={4}
                >
                  elsewhere
                </Text>
                <VStack align="stretch" spacing={3} mb={7}>
                  {socials.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      isExternal={s.external}
                      fontFamily="heading"
                      fontSize="16px"
                      fontWeight="600"
                      color={BRUT.onDark}
                      display="inline-flex"
                      alignItems="center"
                      gap="8px"
                      w="fit-content"
                      transition="all .15s ease"
                      _hover={{
                        color: BRUT.yellow,
                        textDecoration: "none",
                        transform: "translateX(4px)",
                      }}
                    >
                      {s.icon}
                      {s.label}
                    </Link>
                  ))}
                </VStack>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom bar */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "flex-start", sm: "center" }}
            justify="space-between"
            gap={3}
            pt={{ base: 12, md: 14 }}
            position="relative"
            zIndex={3}
          >
            <Text
              fontFamily="spaceMono"
              fontSize="13px"
              fontWeight="700"
              color={BRUT.onDarkMuted}
            >
              © {year} {name}. Handmade in {personalInfo.location || "Jakarta"}.
            </Text>
            <Box
              as="button"
              type="button"
              display="inline-flex"
              alignItems="center"
              gap="7px"
              fontFamily="spaceMono"
              fontSize="12px"
              fontWeight="700"
              letterSpacing=".08em"
              textTransform="uppercase"
              color={BRUT.onDark}
              bg={BRUT.primary}
              border="2px solid"
              borderColor={BRUT.onDark}
              borderRadius="8px"
              boxShadow={`3px 3px 0 rgba(255,253,246,0.3)`}
              px={4}
              py="9px"
              cursor="pointer"
              _hover={{ transform: "translate(-2px, -2px)", boxShadow: "5px 5px 0 rgba(255,253,246,0.3)" }}
              transition="all .15s ease"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top
              <ArrowUp size={14} />
            </Box>
          </Flex>

          {/* Giant outlined wordmark */}
          <Box
            aria-hidden="true"
            position="relative"
            zIndex={2}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 0, md: 1 }}
            overflow="hidden"
          >
            <Text
              fontFamily="bungee"
              fontWeight="400"
              fontSize={{ base: "40px", md: "104px" }}
              lineHeight="0.95"
              whiteSpace="nowrap"
              textAlign="center"
              userSelect="none"
              color="transparent"
              sx={{
                WebkitTextStroke: "1.5px rgba(255,253,246,0.16)",
              }}
            >
              {name}
            </Text>
          </Box>
        </Box>
      </Box>
    </PublicShell>
  );
};

export default PublicLayout;
export { FOOTER_LINKS };
