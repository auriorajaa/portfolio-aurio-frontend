import React, { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowDown, Mail, QrCode } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { SplitWords, StudioPill, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Hero = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const badgeRef = useRef(null);
  const strapRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".split-word-inner", {
          yPercent: 105,
          duration: 0.85,
          stagger: 0.035,
        })
        .from(
          "[data-hero-reveal]",
          { y: 18, autoAlpha: 0, duration: 0.65, stagger: 0.06 },
          "-=0.35",
        )
        .from(
          badgeRef.current,
          { y: -28, autoAlpha: 0, duration: 0.8, ease: "power3.out" },
          "-=0.45",
        )
        .from(
          strapRef.current,
          { scaleY: 0, duration: 0.7, transformOrigin: "top center" },
          "-=0.62",
        );

      const rotateTo = gsap.quickTo(badgeRef.current, "rotation", { duration: 0.55, ease: "power3.out" });
      const xTo = gsap.quickTo(badgeRef.current, "x", { duration: 0.55, ease: "power3.out" });

      const onPointerMove = (e) => {
        const rect = rootRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        rotateTo(x * 4);
        xTo(x * 10);
      };

      const onPointerLeave = () => {
        rotateTo(0);
        xTo(0);
      };

      const root = rootRef.current;
      root.addEventListener("pointermove", onPointerMove);
      root.addEventListener("pointerleave", onPointerLeave);
      return () => {
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <Box
      ref={rootRef}
      as="section"
      id="hero"
      maxW="1320px"
      mx="auto"
      px={{ base: 4, md: 7 }}
      pt={{ base: "80px", md: 14 }}
      pb={{ base: "88px", md: 18 }}
      color={colors.text}
      position="relative"
      zIndex={0}
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0, .86fr) minmax(360px, .54fr)" }}
        gap={{ base: 10, lg: 12 }}
        alignItems="center"
      >
        <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
          <HStack data-hero-reveal spacing={3} flexWrap="wrap">
            <StudioPill>Portfolio / 2026</StudioPill>
            <Text fontSize="15px" color={colors.muted} fontWeight="500">
              {personalInfo.location || "Jakarta, Indonesia"}
            </Text>
          </HStack>

          <Heading
            as="h1"
            fontSize={{ base: "43px", md: "56px" }}
            lineHeight={{ base: ".99", md: "1.25" }} // .99 di mobile, lebih longgar di desktop agar tidak terpotong
            letterSpacing={{ base: "-0.02em", md: "normal" }} // -0.02em di mobile, normal di desktop
            fontWeight="800"
            maxW="860px"
          >
            <SplitWords
              text={
                `${personalInfo.name || "Aurio Rajaa"}. ` +
                "Software Engineer."
              }
            />
          </Heading>

          <Grid
            data-hero-reveal
            templateColumns={{ base: "1fr", md: ".34fr 1fr" }}
            gap={5}
            maxW="760px"
          >
            <Text fontSize="14px" color={colors.muted} textTransform="uppercase" letterSpacing=".08em" fontWeight="600">
              Overview
            </Text>
            <Text fontSize={{ base: "16px", md: "18px" }} lineHeight="1.7" color={colors.text}>
              {personalInfo.bio ||
                "Backend and web development, focused on code that is easy to maintain and actually ships."}
            </Text>
          </Grid>

          <HStack data-hero-reveal spacing={3} flexWrap="wrap" pt={2}>
            <Button
              as={Link}
              href="#projects"
              variant="studio"
              rightIcon={<ArrowDown size={16} />}
              _hover={{ textDecoration: "none" }}
            >
              View projects
            </Button>
            <Button
              as={Link}
              href={`mailto:${personalInfo.email}`}
              variant="studioGhost"
              leftIcon={<Mail size={16} />}
              _hover={{ textDecoration: "none", bg: colors.surfaceAlt }}
            >
              Contact
            </Button>
          </HStack>
        </VStack>

        {/* ── Responsive ID Badge Container ── */}
        <Flex
          justify={{ base: "center", lg: "flex-end" }}
          position="relative"
          minH={{ base: "540px", md: "620px" }}
          w="100%"
          isolation="isolate"  
        >
          {/* Assembly Wrapper: Mengunci sinkronisasi tali, klip, dan kartu dalam satu koordinat lebar */}
          <Box position="relative" w={{ base: "310px", md: "350px" }}>

            {/* Lanyard Straps Container (GSAP target) */}
            <Box
              ref={strapRef}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h={{ base: "182px", md: "222px" }}
              zIndex={0}
            >
              {/* MOBILE: Single Center Strap */}
              <Box
                display={{ base: "block", md: "none" }}
                position="absolute"
                top={0}
                left="50%"
                transform="translateX(-50%)"
                w="14px"
                h="100%"
                bg={colors.text}
                opacity={0.12}
              />

              {/* DESKTOP & TABLET: Left Strap */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                top={0}
                left="42px" // Center-point match: 42px + 6px (half width) = 48px
                w="12px"
                h="100%"
                bg={colors.text}
                opacity={0.12}
              />

              {/* DESKTOP & TABLET: Right Strap */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                top={0}
                right="42px" // Center-point match dari kanan: 48px
                w="12px"
                h="100%"
                bg={colors.text}
                opacity={0.12}
              />

              {/* ── Clips Attached to the bottom of the straps ── */}
              {/* MOBILE: Center Clip */}
              <Box
                display={{ base: "block", md: "none" }}
                position="absolute"
                bottom={0}
                left="50%"
                transform="translateX(-50%)"
                w="20px"
                h="10px"
                border="1px solid"
                borderColor={colors.border}
                bg={colors.surfaceAlt}
                borderRadius="3px"
                zIndex={2}
              />

              {/* DESKTOP & TABLET: Left Clip */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                bottom={0}
                left="40px" // Pas membungkus lubang pasak kiri (40px sampai 56px)
                w="16px"
                h="12px"
                border="1px solid"
                borderColor={colors.border}
                bg={colors.surfaceAlt}
                borderRadius="2px"
                zIndex={2}
              />

              {/* DESKTOP & TABLET: Right Clip */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                bottom={0}
                right="40px" // Pas membungkus lubang pasak kanan
                w="16px"
                h="12px"
                border="1px solid"
                borderColor={colors.border}
                bg={colors.surfaceAlt}
                borderRadius="2px"
                zIndex={2}
              />
            </Box>

            {/* ID Badge Card */}
            <Box
              ref={badgeRef}
              mt={{ base: "180px", md: "220px" }}
              w="100%" // Otomatis mengisi penuh lebar Assembly Wrapper
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="16px"
              boxShadow="0 24px 48px rgba(0,0,0,0.04)"
              position="relative"
              zIndex={1}
              style={{ transformOrigin: "50% -180px" }}
            >
              {/* MOBILE: Center Punch Hole */}
              <Box
                display={{ base: "block", md: "none" }}
                position="absolute"
                top="12px"
                left="50%"
                transform="translateX(-50%)"
                w="28px"
                h="5px"
                bg={colors.background || "transparent"}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="full"
                zIndex={10}
              />

              {/* DESKTOP & TABLET: Left Punch Hole */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                top="12px"
                left="40px"
                w="16px"
                h="5px"
                bg={colors.background || "transparent"}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="full"
                zIndex={10}
              />

              {/* DESKTOP & TABLET: Right Punch Hole */}
              <Box
                display={{ base: "none", md: "block" }}
                position="absolute"
                top="12px"
                right="40px"
                w="16px"
                h="5px"
                bg={colors.background || "transparent"}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="full"
                zIndex={10}
              />

              <Box p={5} pt={8}>
                {/* Profile Image Frame */}
                <Box
                  aspectRatio="1 / 1"
                  overflow="hidden"
                  borderRadius="10px"
                  bg={colors.surfaceAlt}
                  border="1px solid"
                  borderColor={colors.border}
                >
                  <LazyLoadImage
                    src="/profilepic.png"
                    alt={personalInfo.name || "Aurio Rajaa"}
                    effect="opacity"
                    visibleByDefault
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width="100%"
                    height="100%"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </Box>

                {/* Badge Identity Row */}
                <Flex justify="space-between" align="flex-end" mt={5}>
                  <Box>
                    <Text fontSize="22px" fontWeight="800" lineHeight="1.1" letterSpacing="-0.02em">
                      {personalInfo.name || "Aurio Rajaa"}
                    </Text>
                    <Text fontSize="13px" fontWeight="500" color={colors.muted} mt={1}>
                      {personalInfo.title || "Backend Engineer"}
                    </Text>
                  </Box>
                  <QrCode size={32} strokeWidth={1.5} color={colors.text} opacity={0.6} />
                </Flex>

                {/* Minimal Divider */}
                <Box w="100%" h="1px" bg={colors.border} my={4} opacity={0.6} />

                {/* Badge Footer Data */}
                <Flex justify="space-between" align="center">
                  <Text fontSize="10px" color={colors.muted} fontWeight="700" letterSpacing="0.08em">
                    ACCESS / ALL AREAS
                  </Text>
                  <Text fontSize="10px" color={colors.muted} fontFamily="mono">
                    ID: 2026-AR
                  </Text>
                </Flex>
              </Box>
            </Box>

          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default Hero;
