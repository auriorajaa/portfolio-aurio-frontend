import React from "react";
import { Box, Flex, Grid, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import Header from "./Header";
import Contact from "../sections/Contact";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  LAGOON,
  PublicShell,
  DoodleAsterisk,
  DoodleBoat,
  DoodleDuck,
  DoodleFish,
  DoodlePaperPlane,
  DoodleStar,
} from "../public/studio";

const FOOTER_LINKS = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Writing", href: "/#articles" },
];

const Layout = ({ children, isDownloading, handleDownload }) => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const year = new Date().getFullYear();
  const name = personalInfo.name || "Aurio Rajaa";

  const socials = [
    personalInfo.github && {
      href: personalInfo.github,
      icon: <Github size={16} />,
      label: "GitHub",
      external: true,
    },
    personalInfo.linkedin && {
      href: personalInfo.linkedin,
      icon: <Linkedin size={16} />,
      label: "LinkedIn",
      external: true,
    },
    personalInfo.email && {
      href: `mailto:${personalInfo.email}`,
      icon: <Mail size={16} />,
      label: "Email",
      external: false,
    },
  ].filter(Boolean);

  return (
    <PublicShell display="flex" flexDirection="column">
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Box as="main" flex="1">
        {children}
      </Box>

      {/* ── Footer / contact shore ─────────────────────────────── */}
      <Box
        as="footer"
        position="relative"
        overflow="hidden"
        bg={LAGOON.gradient}
        color={LAGOON.onDark}
      >
        {/* Decor: faint halftone dots, print style */}
        <Box
          aria-hidden="true"
          className="public-dots-light"
          position="absolute"
          inset={0}
          opacity={0.12}
          pointerEvents="none"
        />

        {/* Sea at the foot of the page: layered flat waves + paper
            boat + a couple of curious fish. */}
        <Box aria-hidden="true" position="absolute" bottom={0} left={0} right={0} pointerEvents="none" zIndex={1} h={{ base: "110px", md: "150px" }}>
          <svg
            viewBox="0 0 1440 190"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <path
              d="M0,90 C240,150 480,30 720,88 C960,146 1200,36 1440,92 L1440,190 L0,190 Z"
              fill="#0E6F69"
              opacity="0.55"
            />
            <path
              d="M0,130 C260,176 520,80 780,124 C1040,168 1240,92 1440,132 L1440,190 L0,190 Z"
              fill="#14A89A"
              opacity="0.45"
            />
          </svg>
        </Box>
        <Box aria-hidden="true" position="absolute" right={{ base: "6%", md: "12%" }} bottom={{ base: "64px", md: "84px" }} zIndex={2} pointerEvents="none">
          <DoodleBoat size={52} transform="rotate(-3deg)" />
        </Box>
        <Box aria-hidden="true" position="absolute" left={{ base: "8%", md: "14%" }} bottom={{ base: "26px", md: "34px" }} zIndex={2} pointerEvents="none">
          <DoodleFish size={30} transform="rotate(-4deg)" />
        </Box>
        <Box aria-hidden="true" position="absolute" left={{ base: "20%", md: "26%" }} bottom={{ base: "14px", md: "22px" }} zIndex={2} pointerEvents="none">
          <DoodleFish size={20} transform="rotate(3deg) scaleX(-1)" />
        </Box>
        <Box aria-hidden="true" position="absolute" right={{ base: "34%", md: "38%" }} bottom={{ base: "30px", md: "40px" }} zIndex={2} pointerEvents="none" display={{ base: "none", md: "block" }}>
          <DoodleStar size={30} transform="rotate(12deg)" />
        </Box>
        <Box aria-hidden="true" position="absolute" right={{ base: "10%", md: "26%" }} bottom={{ base: "30px", md: "46px" }} zIndex={2} pointerEvents="none" display={{ base: "none", md: "block" }}>
          <DoodleDuck size={34} transform="rotate(3deg)" />
        </Box>

        <Box
          position="relative"
          maxW="1200px"
          mx="auto"
          px={{ base: 5, md: 8, lg: 10 }}
          pt={{ base: 10, md: 16 }}
          pb={{ base: 34, md: 44 }}
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1.25fr 0.75fr" }}
            gap={{ base: 12, lg: 14 }}
            alignItems="start"
          >
            {/* Postcard / contact */}
            <Box id="contact" position="relative">
              <Box aria-hidden="true" position="absolute" top="-14px" right={{ base: "4px", md: "-8px" }}>
                <DoodleAsterisk size={22} color={LAGOON.sun} />
              </Box>
              <Box aria-hidden="true" position="absolute" top="-26px" left={{ base: "-8px", md: "-26px" }} zIndex={2} display={{ base: "none", sm: "block" }}>
                <DoodlePaperPlane size={64} transform="rotate(-10deg)" />
              </Box>
              <Text
                className="public-hand"
                fontSize={{ base: "28px", md: "32px" }}
                fontWeight="600"
                color={LAGOON.sun}
                transform="rotate(-2deg)"
                display="inline-block"
              >
                write me a postcard
              </Text>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize={{ base: "30px", md: "40px" }}
                fontWeight="700"
                lineHeight="1.1"
                letterSpacing="-.03em"
                color="#FFFFFF"
                mt={1}
                mb={3}
              >
                Have an idea? Let&apos;s talk.
              </Heading>
              <Text fontSize="16px" lineHeight="1.75" color={LAGOON.onDarkMuted} mb={7} maxW="520px">
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
                  className="public-mono"
                  fontSize="12px"
                  fontWeight="500"
                  letterSpacing=".08em"
                  color={LAGOON.onDarkMuted}
                  mb={4}
                >
                  browse
                </Text>
                <VStack align="stretch" spacing={2}>
                  {FOOTER_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      fontSize="15px"
                      fontWeight="600"
                      color={LAGOON.onDark}
                      _hover={{ color: "#FFFFFF", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </VStack>
              </Box>

              <Box>
                <Text
                  className="public-mono"
                  fontSize="12px"
                  fontWeight="500"
                  letterSpacing=".08em"
                  color={LAGOON.onDarkMuted}
                  mb={4}
                >
                  elsewhere
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
                      fontSize="15px"
                      fontWeight="600"
                      color={LAGOON.onDark}
                      _hover={{ color: "#FFFFFF", textDecoration: "none" }}
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
            pt={12}
            position="relative"
            zIndex={3}
          >
            <Text fontSize="14px" color={LAGOON.onDarkMuted}>
              © {year} {name}. Handmade in {personalInfo.location || "Jakarta"}.
            </Text>
            <HStack spacing={4}>
              <Box
                as="button"
                type="button"
                display="inline-flex"
                alignItems="center"
                gap="6px"
                fontSize="14px"
                fontWeight="600"
                color={LAGOON.onDarkMuted}
                bg="transparent"
                border="none"
                cursor="pointer"
                p={0}
                _hover={{ color: "#FFFFFF" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top
                <ArrowUp size={14} />
              </Box>
            </HStack>
          </Flex>

          {/* Giant watermark wordmark */}
          <Box
            aria-hidden="true"
            position="relative"
            zIndex={2}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 1, md: 2 }}
            overflow="hidden"
          >
            <Text
              fontFamily="heading"
              fontWeight="800"
              fontSize={{ base: "64px", md: "120px" }}
              lineHeight="0.9"
              letterSpacing="-.04em"
              textTransform="uppercase"
              color="rgba(255,255,255,0.08)"
              whiteSpace="nowrap"
              textAlign="center"
              userSelect="none"
            >
              {name}
            </Text>
          </Box>
        </Box>
      </Box>
    </PublicShell>
  );
};

export default Layout;
