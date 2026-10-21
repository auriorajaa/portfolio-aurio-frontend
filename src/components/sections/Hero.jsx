import React, { useLayoutEffect, useRef } from "react";
import { Box, Container, Flex, HStack, Heading, Link, Text } from "@chakra-ui/react";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  LAGOON,
  Marquee,
  DoodleArrow,
  DoodleCoffee,
  DoodleSquiggle,
  DoodleStar,
  DoodleSun,
  DoodleTape,
} from "../public/studio";
import { Magnetic } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const STACK = [
  "Java",
  "Spring Boot",
  "React",
  "Node.js",
  "REST APIs",
  "MySQL",
  "Firebase",
  "Postman",
];

const Hero = ({ isDownloading, handleDownload }) => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const name = personalInfo.name || "Aurio Rajaa";
  const [firstName, ...rest] = name.split(" ");
  const heroRef = useRef(null);

  // Opening sketch: the left column rises line by line, the polaroid
  // swings in, and the doodles pop in like stickers.
  useLayoutEffect(() => {
    const scope = heroRef.current;
    if (!scope || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-rise]",
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out", stagger: 0.09, delay: 0.1 }
      );
      gsap.fromTo(
        "[data-hero-photo]",
        { y: 36, autoAlpha: 0, rotate: 7 },
        { y: 0, autoAlpha: 1, rotate: 0, duration: 0.9, ease: "back.out(1.4)", delay: 0.25 }
      );
      gsap.fromTo(
        "[data-hero-doodle]",
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(2.2)", stagger: 0.1, delay: 0.6 }
      );
      gsap.fromTo(
        "[data-hero-marquee]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.75 }
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

  return (
    <Box
      as="section"
      id="hero"
      position="relative"
      overflow="hidden"
      bg={LAGOON.surface}
      ref={heroRef}
    >
        <Container
          maxW="1200px"
          px={{ base: 5, md: 8, lg: 10 }}
          pt={{ base: 10, md: 16 }}
          pb={{ base: 12, md: 20 }}
          position="relative"
          zIndex={1}
        >
          <Flex
            direction={{ base: "column-reverse", lg: "row" }}
            align="center"
            gap={{ base: 12, lg: 14 }}
          >
            {/* Left: name, bio, actions */}
            <Box
              flex="1"
              minW={0}
              maxW={{ lg: "560px" }}
              textAlign={{ base: "center", lg: "left" }}
            >
              <Text
                className="public-hand"
                fontSize={{ base: "30px", md: "34px" }}
                fontWeight="600"
                color={LAGOON.coralDeep}
                transform="rotate(-2deg)"
                display="inline-block"
                mb={1}
                data-hero-rise
              >
                hi, I&apos;m
              </Text>

              <Heading
                as="h1"
                fontFamily="heading"
                fontSize={{ base: "44px", md: "72px" }}
                fontWeight="700"
                lineHeight="1.02"
                letterSpacing="-.04em"
                color={LAGOON.heading}
                data-hero-rise
              >
                {firstName}
                {rest.length > 0 && (
                  <>
                    {" "}
                    <Box as="span" color={LAGOON.primary}>
                      {rest.join(" ")}
                    </Box>
                  </>
                )}
                <Box as="span" color={LAGOON.coral}>
                  .
                </Box>
              </Heading>

              <Text
                className="public-mono"
                fontSize="14px"
                fontWeight="500"
                color={LAGOON.muted}
                mt={4}
                data-hero-rise
              >
                {personalInfo.title || "Software Engineer"}
                {" · "}
                <Box as="span" display="inline-flex" alignItems="center" gap="4px">
                  <MapPin size={13} />
                  {personalInfo.location || "Jakarta, Indonesia"}
                </Box>
              </Text>

              <Text
                mt={5}
                fontSize={{ base: "16px", md: "17px" }}
                lineHeight="1.8"
                color={LAGOON.muted}
                maxW="480px"
                mx={{ base: "auto", lg: "0" }}
                data-hero-rise
              >
                {personalInfo.bio ||
                  "I build clean backends and friendly interfaces. Currently studying computer science and making things for the web."}
              </Text>

              <Flex
                gap={3}
                mt={8}
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
                  gap="8px"
                  bg={LAGOON.primaryDeep}
                  border="2px solid #0B2F2F"
                  color="#FFFFFF"
                  fontWeight="700"
                  fontSize="15px"
                  px={6}
                  py="12px"
                  borderRadius="10px"
                  boxShadow="3px 3px 0 #0B2F2F"
                  transition="transform .16s ease, background .16s ease, box-shadow .16s ease"
                  _hover={{
                    bg: LAGOON.primary,
                    textDecoration: "none",
                    transform: "translate(-2px, -2px)",
                    boxShadow: "5px 5px 0 #0B2F2F",
                  }}
                >
                  See projects
                </Box>
                </Magnetic>
                <Magnetic pull={6}>
                <Box
                  as="button"
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  opacity={isDownloading ? 0.6 : 1}
                  cursor="pointer"
                  display="inline-flex"
                  alignItems="center"
                  gap="8px"
                  bg="#FFFFFF"
                  border="2px solid #0B2F2F"
                  color={LAGOON.heading}
                  fontWeight="700"
                  fontSize="15px"
                  px={6}
                  py="12px"
                  borderRadius="10px"
                  boxShadow="3px 3px 0 #0B2F2F"
                  transition="transform .16s ease, background .16s ease, box-shadow .16s ease"
                  _hover={{
                    bg: "#EAF7F4",
                    transform: "translate(-2px, -2px)",
                    boxShadow: "5px 5px 0 #0B2F2F",
                  }}
                >
                  <Download size={16} />
                  {isDownloading ? "Preparing..." : "Download CV"}
                </Box>
                </Magnetic>
                <Box
                  aria-hidden="true"
                  display={{ base: "none", md: "block" }}
                  position="absolute"
                  right="-6px"
                  bottom="52px"
                  data-hero-doodle
                >
                  <DoodleArrow width={64} transform="scaleY(-.6)" />
                </Box>
              </Flex>

              <HStack
                spacing={3}
                mt={8}
                justify={{ base: "center", lg: "flex-start" }}
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
                    w="44px"
                    h="44px"
                    borderRadius="10px"
                    border="2px solid"
                    borderColor={LAGOON.ink}
                    bg="#FFFFFF"
                    color={LAGOON.heading}
                    boxShadow="3px 3px 0 #0B2F2F"
                    transition="all .16s ease"
                    _hover={{
                      bg: LAGOON.sun,
                      textDecoration: "none",
                      transform: "translate(-2px, -2px)",
                      boxShadow: "5px 5px 0 #0B2F2F",
                    }}
                  >
                    <s.icon size={19} />
                  </Link>
                ))}
              </HStack>

              {/* Little fuel note */}
              <Flex align="center" gap={2} mt={7} justify={{ base: "center", lg: "flex-start" }} data-hero-rise>
                <DoodleCoffee size={34} />
                <Text
                  className="public-hand"
                  fontSize="22px"
                  fontWeight="600"
                  color={LAGOON.muted}
                  transform="rotate(-1deg)"
                >
                  fuelled by coffee
                </Text>
              </Flex>
            </Box>

            {/* Right: photo, taped on like a print */}
            <Box flexShrink={0} position="relative">
              <Box
                position="absolute"
                top="-30px"
                right="-34px"
                zIndex={0}
                data-hero-doodle
              >
                <DoodleSun size={86} transform="rotate(12deg)" />
              </Box>
              <Box
                position="absolute"
                bottom="-26px"
                left="-40px"
                zIndex={0}
                data-hero-doodle
              >
                <DoodleSquiggle width={120} transform="rotate(-6deg)" />
              </Box>

              <Box position="relative" zIndex={1} data-hero-photo>
                <Box
                  mx="auto"
                  w={{ base: "250px", md: "300px" }}
                  bg="#FFFFFF"
                  border="2px solid #0B2F2F"
                  borderRadius="18px"
                  boxShadow="6px 6px 0 #0B2F2F"
                  p="10px"
                  transform="rotate(2deg)"
                  transition="transform .25s ease"
                  _hover={{ transform: "rotate(0deg)" }}
                  position="relative"
                >
                  <DoodleTape
                    w={90}
                    h={22}
                    color="rgba(255,107,74,0.8)"
                    rotation={-6}
                    top="-20px"
                    left="34px"
                    zIndex={2}
                  />
                  <Box
                    overflow="hidden"
                    borderRadius="10px"
                    h={{ base: "280px", md: "330px" }}
                    bg={LAGOON.bgWash}
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
                </Box>
                <Text
                  className="public-hand"
                  fontSize="26px"
                  fontWeight="600"
                  color={LAGOON.primaryDeep}
                  textAlign="center"
                  transform="rotate(-2deg)"
                  mt={5}
                >
                  that&apos;s me
                </Text>
              </Box>

              <Box position="absolute" bottom="-8px" right="-18px" zIndex={2} data-hero-doodle>
                <DoodleStar size={34} transform="rotate(14deg)" />
              </Box>
            </Box>
          </Flex>
        </Container>

        {/* Tech stack ticker */}
        <Box position="relative" zIndex={1} data-hero-marquee>
          <Marquee items={STACK} bg="#FFFFFF" borderY="2px solid" borderColor={LAGOON.ink} />
        </Box>
      </Box>
  );
};

export default Hero;
