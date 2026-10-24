import React, { useLayoutEffect, useRef } from "react";
import { Box, Flex, HStack, Heading, Link, Text } from "@chakra-ui/react";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  BRUT,
  BrutTag,
  Marquee,
  Magnetic,
  DoodleArrow,
  DoodleAsterisk,
  DoodleCoffee,
  DoodleSquiggle,
  StickerTape,
} from "../public/brutal";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const STACK = [
  "Java",
  "Spring Boot",
  "React",
  "Node.js",
  "Nest.js",
  "REST APIs",
  "SQL",
  "MongoDB",
];

// The hero carries everything: the big statement, the bio (the old
// About section rolled in), then straight to the loud CTA buttons.
// The photo lives in a chunky polaroid frame with stickers piled on.
const Hero = ({ isDownloading, handleDownload }) => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const name = personalInfo.name || "Aurio Rajaa";
  const [firstName, ...rest] = name.split(" ");
  const heroRef = useRef(null);

  // Press-and-go intro: text slides up line by line, the polaroid
  // swings in from the side, stickers pop onto the page.
  useLayoutEffect(() => {
    const scope = heroRef.current;
    if (!scope || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-rise]",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.1 }
      );
      gsap.fromTo(
        "[data-hero-photo]",
        { x: 60, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(1.6)", delay: 0.3 }
      );
      gsap.fromTo(
        "[data-hero-doodle]",
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.4)", stagger: 0.09, delay: 0.65 }
      );
      gsap.fromTo(
        "[data-hero-marquee]",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );
    }, scope);

    return () => ctx.revert();
  }, [personalInfo.name]);

  const socials = [
    personalInfo.github && { href: personalInfo.github, icon: Github, label: "GitHub" },
    personalInfo.linkedin && { href: personalInfo.linkedin, icon: Linkedin, label: "LinkedIn" },
    personalInfo.email && {
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      label: "Email",
    },
  ].filter(Boolean);

  const tintCycle = [BRUT.yellow, BRUT.primarySoft, BRUT.blueSoft, BRUT.coralSoft, BRUT.limeSoft];

  return (
    <Box
      as="section"
      id="hero"
      position="relative"
      overflow="hidden"
      bg={BRUT.bgWash}
      ref={heroRef}
    >
      {/* Blueprint grid keeps the workshop ruled-paper feel */}
      <Box
        aria-hidden="true"
        className="public-grid"
        position="absolute"
        inset={0}
        opacity={0.55}
        pointerEvents="none"
      />

      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 6, md: 8, lg: 10 }}
        pt={{ base: 12, md: 16 }}
        pb={{ base: 14, md: 22 }}
        position="relative"
        zIndex={1}
      >
        <Flex
          direction={{ base: "column-reverse", lg: "row" }}
          align="center"
          gap={{ base: 13, lg: 16 }}
        >
          {/* Left column: greeting, name, bio, loud CTAs, socials */}
          <Box flex="1" minW={0} maxW={{ lg: "620px" }} textAlign={{ base: "center", lg: "left" }}>

            {/* Name in Bungee — the chunky workshop signposting */}
            <Heading
              as="h1"
              fontFamily="bungee"
              fontSize={{ base: "clamp(38px, 10vw, 72px)", md: "clamp(52px, 6.5vw, 80px)" }}
              fontWeight="400"
              lineHeight="1"
              letterSpacing="0"
              color={BRUT.ink}
              data-hero-rise
            >
              {firstName.toUpperCase()}
              {rest.length > 0 && (
                <>
                  {" "}
                  <Box
                    as="span"
                    display="inline-block"
                    color={BRUT.primaryDeep}
                    sx={{
                      WebkitTextStroke: `1.5px ${BRUT.ink}`,
                      paintOrder: "stroke fill",
                    }}
                  >
                    {rest.join(" ").toUpperCase()}
                  </Box>
                </>
              )}
            </Heading>

            {/* Bio: rolled in from the old About section */}
            <Text
              mt={7}
              fontSize={{ base: "16px", md: "17.5px" }}
              lineHeight="1.85"
              color={BRUT.text}
              maxW="540px"
              mx={{ base: "auto", lg: "0" }}
              data-hero-rise
            >
              {personalInfo.bio ||
                "I build clean backends and friendly interfaces. Currently studying computer science and making things for the web."}
            </Text>

            {/* High-impact CTAs — the loud call to action */}
            <Flex
              gap={4}
              mt={{ base: 9, md: 10 }}
              flexWrap="wrap"
              justify={{ base: "center", lg: "flex-start" }}
              position="relative"
              data-hero-rise
            >
              <Magnetic pull={6}>
                <Box
                  as="a"
                  href="#projects"
                  display="inline-flex"
                  alignItems="center"
                  gap="10px"
                  bg={BRUT.primary}
                  border="3px solid"
                  borderColor={BRUT.ink}
                  color="#FFFFFF"
                  fontFamily="spaceMono"
                  fontWeight="700"
                  fontSize={{ base: "15px", md: "16px" }}
                  letterSpacing=".05em"
                  textTransform="uppercase"
                  px={{ base: 8, md: 9 }}
                  py={{ base: "17px", md: "18px" }}
                  borderRadius="10px"
                  boxShadow={BRUT.shadow}
                  transition="transform .16s ease, box-shadow .16s ease"
                  _hover={{
                    bg: BRUT.primaryDeep,
                    textDecoration: "none",
                    transform: "translate(-3px, -3px)",
                    boxShadow: BRUT.shadowLg,
                  }}
                >
                  See the work
                  <DoodleArrow width={38} />
                </Box>
              </Magnetic>

              <Magnetic pull={6}>
                <Box
                  as="button"
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  opacity={isDownloading ? 0.65 : 1}
                  cursor="pointer"
                  display="inline-flex"
                  alignItems="center"
                  gap="10px"
                  bg={BRUT.yellow}
                  border="3px solid"
                  borderColor={BRUT.ink}
                  color={BRUT.ink}
                  fontFamily="spaceMono"
                  fontWeight="700"
                  fontSize={{ base: "15px", md: "16px" }}
                  letterSpacing=".05em"
                  textTransform="uppercase"
                  px={{ base: 8, md: 9 }}
                  py={{ base: "17px", md: "18px" }}
                  borderRadius="10px"
                  boxShadow={BRUT.shadow}
                  transition="transform .16s ease, box-shadow .16s ease"
                  _hover={{
                    bg: "#FFDF6B",
                    transform: "translate(-3px, -3px)",
                    boxShadow: BRUT.shadowLg,
                  }}
                >
                  <Download size={18} strokeWidth={2.5} />
                  {isDownloading ? "Packing..." : "Get the CV"}
                </Box>
              </Magnetic>

              <Box
                aria-hidden="true"
                display={{ base: "none", md: "block" }}
                position="absolute"
                right="2px"
                top="-34px"
                data-hero-doodle
              >
                <DoodleSquiggle width={110} />
              </Box>
            </Flex>

            {/* Social squares: straight frames, tint on hover */}
            <HStack
              as="nav"
              spacing={3.5}
              mt={{ base: 10, md: 11 }}
              justify={{ base: "center", lg: "flex-start" }}
              aria-label="Social"
              data-hero-rise
            >
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  isExternal={!s.href.startsWith("mailto:")}
                  aria-label={s.label}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="52px"
                  h="52px"
                  border="2.5px solid"
                  borderColor={BRUT.ink}
                  bg="#FFFFFF"
                  color={BRUT.ink}
                  borderRadius="8px"
                  boxShadow={BRUT.shadowXs}
                  transition="all .16s ease"
                  _hover={{
                    bg: tintCycle[socials.indexOf(s) % tintCycle.length],
                    textDecoration: "none",
                    transform: "translate(-2px, -2px)",
                    boxShadow: BRUT.shadow,
                  }}
                >
                  <s.icon size={21} strokeWidth={2.2} />
                </Link>
              ))}
            </HStack>

            {/* Fuel note */}
            <Flex
              align="center"
              gap={2.5}
              mt={9}
              justify={{ base: "center", lg: "flex-start" }}
              data-hero-rise
            >
              <Flex
                align="center"
                justify="center"
                bg="#FFFFFF"
                border="2px solid"
                borderColor={BRUT.ink}
                borderRadius="6px"
                p="5px"
                boxShadow={BRUT.shadowXs}
              >
                <DoodleCoffee size={32} />
              </Flex>
              <Text
                fontFamily="heading"
                fontSize="15.5px"
                fontWeight="600"
                color={BRUT.inkSoft}
              >
                fuelled by iced coffee &amp; good playlists.
              </Text>
            </Flex>
          </Box>

          {/* Right column: chunky polaroid + sticker pile */}
          <Box flexShrink={0} position="relative" px={{ base: 3, md: 0 }} py={{ base: 4, md: 0 }}>

            <Box position="relative" zIndex={1} data-hero-photo mx="auto" w={{ base: "272px", md: "318px" }}>
              {/* THE polaroid: thick white frame, fat bottom lip, hard shadow */}
              <Box
                bg="#FFFFFF"
                border="3px solid"
                borderColor={BRUT.ink}
                borderRadius="14px"
                boxShadow="12px 12px 0 #17181C"
                p={{ base: "11px 11px 46px 11px", md: "13px 13px 56px 13px" }}
                position="relative"
                transition="transform .25s ease, box-shadow .25s ease"
                _hover={{
                  transform: "translate(-3px, -3px)",
                  boxShadow: "15px 15px 0 #17181C",
                }}
              >
                {/* tape across the top lip */}
                <StickerTape
                  w={104}
                  h={26}
                  color="rgba(255,210,63,0.78)"
                  top="-21px"
                  left="50%"
                  ml={-52}
                  zIndex={4}
                />

                <Box
                  overflow="hidden"
                  borderRadius="8px"
                  border="2px solid"
                  borderColor={BRUT.ink}
                  h={{ base: "306px", md: "348px" }}
                  bg={BRUT.bgWash}
                  position="relative"
                >
                  <Box
                    as="img"
                    src="/profilepic.png"
                    alt={name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="top"
                  />
                </Box>

                {/* polaroid caption, scribbled in the fat bottom lip */}
                <Flex
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  align="center"
                  justify={{ base: "center", md: "center" }}
                  px={4}
                  py="12px"
                  gap={2}
                >
                  <Text
                    fontFamily="bungee"
                    fontSize={{ base: "13px", md: "15px" }}
                    color={BRUT.primaryDeep}
                    sx={{ WebkitTextStroke: `0.5px ${BRUT.primaryDeep}` }}
                  >
                    FIG. 01 — THE AUTHOR
                  </Text>
                </Flex>
              </Box>

              {/* overlapping sticker cluster */}
              <Box
                position="absolute"
                top={{ base: "46px", md: "54px" }}
                left={{ base: "-24px", md: "-42px" }}
                zIndex={3}
                data-hero-doodle
              >
                <BrutTag tone="coral" boxShadow={BRUT.shadow}>
                  THAT&apos;S ME!
                </BrutTag>
              </Box>
              <Box
                position="absolute"
                bottom={{ base: "84px", md: "104px" }}
                right={{ base: "-30px", md: "-52px" }}
                zIndex={3}
                data-hero-doodle
                display={{ base: "none", sm: "block" }}
              >
                <BrutTag tone="lime" dot dotColor={BRUT.primary} boxShadow={BRUT.shadow}>
                  OPEN TO WORK
                </BrutTag>
              </Box>
              <Box
                position="absolute"
                bottom="-18px"
                left={{ base: "-6px", md: "-22px" }}
                zIndex={2}
                data-hero-doodle
                pointerEvents="none"
              >
                <DoodleAsterisk size={30} color={BRUT.blue} />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Marquee: the stack ticker */}
      <Box position="relative" zIndex={1} data-hero-marquee>
        <Marquee items={STACK} bg={BRUT.primary} color="#FFFFFF" speed={34} />
      </Box>
    </Box>
  );
};

export default Hero;
