import React, { useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { skillsData } from "../../data/portfolioData";
import {
  BRUT,
  BrutSection,
  BrutTag,
  DoodleLightning,
  DoodleRocket,
  DoodleCoffee,
  DoodlePaperPlane,
} from "../public/brutal";

// Category mascots sit in their sticker squares; every skill below
// becomes a cartoonish app icon: white tile, thick ink outline,
// official full-color brand SVG, solid drop shadow.
const CATEGORY_META = {
  Backend: { Doodle: DoodleLightning, bgTone: "ink" },
  Frontend: { Doodle: DoodleRocket, bgTone: "blue" },
  Java: { Doodle: DoodleCoffee, bgTone: "yellow" },
  Tools: { Doodle: DoodlePaperPlane, bgTone: "cream" },
};

const FALLBACK_META = { Doodle: DoodlePaperPlane, bgTone: "blue" };

const PANEL_STYLES = {
  ink: { bg: BRUT.ink, text: BRUT.onDark, sub: BRUT.onDarkMuted, border: BRUT.onDark },
  blue: { bg: BRUT.blueSoft, text: BRUT.ink, sub: BRUT.ink, border: BRUT.ink },
  yellow: { bg: BRUT.yellow, text: BRUT.ink, sub: BRUT.ink, border: BRUT.ink },
  cream: { bg: BRUT.bgWash, text: BRUT.ink, sub: BRUT.ink, border: BRUT.ink },
};

// Exact skill name -> Devicon folder (full-color official logos)
const DEVICON_MAP = {
  "spring boot rest api": "spring",
  "spring boot": "springboot",
  "spring framework": "spring",
  spring: "spring",
  nodejs: "nodejs",
  "node.js": "nodejs",
  node: "nodejs",
  nestjs: "nestjs",
  "nest.js": "nestjs",
  "react.js": "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  "core java": "java",
  java: "java",
  "git & github": "git",
  git: "git",
  github: "github",
  docker: "docker",
  "google cloud services": "googlecloud",
  "google cloud": "googlecloud",
  gcp: "googlecloud",
  javascript: "javascript",
  typescript: "typescript",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  mongodb: "mongodb",
  mysql: "mysql",
  postgresql: "postgresql",
  "postgres sql": "postgresql",
  redis: "redis",
  firebase: "firebase",
  hibernate: "hibernate",
  maven: "maven",
  gradle: "gradle",
  "vs code": "vscode",
  vscode: "vscode",
  postman: "postman",
  figma: "figma",
  linux: "linux",
  bash: "bash",
  kubernetes: "kubernetes",
};

// Simple Icons fallback slugs (brand-colored) when Devicon misses
const SIMPLE_MAP = {
  "rest apis": "openapiinitiative",
  "rest api": "openapiinitiative",
  "spring boot rest api": "springboot",
  "google cloud services": "googlecloud",
  "git & github": "git",
  ci: "githubactions",
  "ci/cd": "githubactions",
};

const normalize = (skill) => skill.toLowerCase().trim();

const deviconSlugFor = (skill) => {
  const key = normalize(skill);
  if (DEVICON_MAP[key]) return DEVICON_MAP[key];
  return key.replace(/&/g, "").replace(/\s+/g, "").replace(/\./g, "").replace(/-/g, "");
};

const simpleSlugFor = (skill) => {
  const key = normalize(skill);
  if (SIMPLE_MAP[key]) return SIMPLE_MAP[key];
  return key.replace(/\s+/g, "").replace(/\./g, "").replace(/-/g, "").replace(/&/g, "");
};

// Ordered candidate list: Devicon original -> Devicon plain ->
// Simple Icons brand color. The letter tile is the very last resort.
const iconSources = (skill) => {
  const dev = deviconSlugFor(skill);
  const simple = simpleSlugFor(skill);
  return [
    `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${dev}/${dev}-original.svg`,
    `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${dev}/${dev}-plain.svg`,
    `https://cdn.simpleicons.org/${simple}`,
  ];
};

const TILE_TINTS = [BRUT.yellowSoft, BRUT.blueSoft, BRUT.limeSoft, BRUT.primarySoft, BRUT.coralSoft];

// One app icon: official colored logo, letter tile only on failure,
// generous label slot so long names never clip.
const SkillTile = ({ skill, index }) => {
  const sources = iconSources(skill);
  const [sourceIndex, setSourceIndex] = useState(0);
  const tint = TILE_TINTS[index % TILE_TINTS.length];
  const src = sources[sourceIndex];
  const exhausted = sourceIndex >= sources.length;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="8px"
      bg="#FFFFFF"
      border="2px solid"
      borderColor={BRUT.ink}
      borderRadius="12px"
      boxShadow="3px 3px 0 #17181C"
      px="6px"
      pt="15px"
      pb="13px"
      minW={0}
      transition="transform .16s ease, box-shadow .16s ease"
      _hover={{
        transform: "translate(-2px, -2px)",
        boxShadow: "5px 5px 0 #17181C",
      }}
    >
      <Flex
        align="center"
        justify="center"
        w={{ base: "44px", md: "48px" }}
        h={{ base: "44px", md: "48px" }}
        flexShrink={0}
      >
        {exhausted || !src ? (
          <Text
            fontFamily="bungee"
            fontSize="18px"
            color={BRUT.ink}
            bg={tint}
            border="2px solid"
            borderColor={BRUT.ink}
            borderRadius="8px"
            w="40px"
            h="40px"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
          >
            {skill.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <Box
            as="img"
            src={src}
            alt={`${skill} logo`}
            loading="lazy"
            decoding="async"
            w={{ base: "38px", md: "42px" }}
            h={{ base: "38px", md: "42px" }}
            objectFit="contain"
            onError={() => setSourceIndex((current) => current + 1)}
          />
        )}
      </Flex>
      <Text
        fontFamily="heading"
        fontSize="12.5px"
        fontWeight="700"
        color={BRUT.ink}
        lineHeight="1.35"
        noOfLines={2}
        textAlign="center"
        w="100%"
      >
        {skill}
      </Text>
    </Flex>
  );
};

const Skills = () => {
  return (
    <BrutSection
      id="skills"
      number="03"
      kicker="power-ups & abilities"
      title="Skills"
      description="The languages, frameworks, and tools I reach for when building things."
      tone="white"
      headerAside={
        <BrutTag tone="mint" dot>
          {skillsData.reduce((total, category) => total + category.skills.length, 0)} IN THE PACK
        </BrutTag>
      }
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
        gap={{ base: 7, md: 8 }}
        alignItems="stretch"
      >
        {skillsData.map((category, index) => {
          const meta = CATEGORY_META[category.category] || FALLBACK_META;
          const { Doodle } = meta;
          const panel = PANEL_STYLES[meta.bgTone] || PANEL_STYLES.blue;

          return (
            <Box
              key={category.category}
              data-reveal
              position="relative"
              overflow="hidden"
              bg={panel.bg}
              border="2px solid"
              borderColor={BRUT.ink}
              borderRadius="10px"
              boxShadow={BRUT.shadow}
              p={{ base: 6, md: 7 }}
              transition="box-shadow .16s ease, transform .16s ease"
              _hover={{
                boxShadow: "7px 7px 0 #17181C",
                transform: "translate(-2px, -2px)",
              }}
            >
              {meta.bgTone === "ink" && (
                <Box
                  aria-hidden="true"
                  className="public-dots-light"
                  position="absolute"
                  top="22px"
                  right="22px"
                  w="140px"
                  h="110px"
                  opacity={0.45}
                />
              )}

              <Flex align="center" justify="space-between" mb={6} position="relative">
                <Flex
                  align="center"
                  justify="center"
                  w="54px"
                  h="54px"
                  bg="#FFFFFF"
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="8px"
                  boxShadow={BRUT.shadowXs}
                >
                  <Doodle size={32} />
                </Flex>
                <Text
                  fontFamily="bungee"
                  fontSize="13px"
                  color={panel.sub}
                  opacity={0.8}
                >
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </Flex>

              {/* Category title */}
              <Box position="relative" display="inline-block" mb="20px">
                <Text
                  fontFamily="bungee"
                  fontSize={{ base: "22px", md: "25px" }}
                  lineHeight="1.2"
                  color={panel.text}
                  sx={{ textTransform: "uppercase" }}
                  as="span"
                >
                  {category.category}
                </Text>
                {/* Underline slab peeking behind the word */}
                <Box
                  aria-hidden="true"
                  position="absolute"
                  bottom="0"
                  left="-6px"
                  right="-6px"
                  h="8px"
                  bg={meta.bgTone === "ink" ? BRUT.primary : BRUT.yellow}
                  border="1.5px solid"
                  borderColor={panel.border}
                  zIndex={-1}
                />
              </Box>

              {/* App-icon sheet */}
              <Grid
                templateColumns={{
                  base: "repeat(auto-fill, minmax(92px, 1fr))",
                  md: "repeat(auto-fill, minmax(100px, 1fr))",
                }}
                gap={{ base: 3.5, md: 4 }}
                position="relative"
                mt={4}
              >
                {category.skills.map((skill, skillIndex) => (
                  <SkillTile key={skill} skill={skill} index={skillIndex} />
                ))}
              </Grid>
            </Box>
          );
        })}
      </Grid>
    </BrutSection>
  );
};

export default Skills;
