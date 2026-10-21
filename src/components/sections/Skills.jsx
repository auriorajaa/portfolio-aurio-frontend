import React from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { skillsData } from "../../data/portfolioData";
import {
  LAGOON,
  LagoonSection,
  DoodleLightning,
  DoodleRocket,
  DoodleCoffee,
  DoodlePaperPlane,
} from "../public/studio";

// Doodle mascots instead of stock icons: lightning for backend
// power, a rocket for shipping UI, coffee for Java, a paper plane
// for the tools that carry work out the door.
const CATEGORY_META = {
  Backend: { Doodle: DoodleLightning, dark: true, bg: "#0B3B39" },
  Frontend: { Doodle: DoodleRocket, dark: false, bg: LAGOON.surfaceTint },
  Java: { Doodle: DoodleCoffee, dark: false, bg: LAGOON.sunSoft },
  Tools: { Doodle: DoodlePaperPlane, dark: false, bg: LAGOON.coralSoft },
};

const FALLBACK_META = { Doodle: DoodlePaperPlane, dark: false, bg: LAGOON.surfaceTint };

const Skills = () => {
  return (
    <LagoonSection
      id="skills"
      eyebrow="04 / skills"
      title="Skills"
      description="The languages, frameworks, and tools I reach for when building things."
      headerAside={
        <Text
          className="public-mono"
          fontSize="13px"
          fontWeight="500"
          color={LAGOON.muted}
        >
          {skillsData.reduce((total, category) => total + category.skills.length, 0)} tools
        </Text>
      }
    >
      {/* One big wooden toy chest, slats and all */}
      <Box
        data-reveal
        position="relative"
        bg="#FFC857"
        border="2px solid #0B2F2F"
        borderRadius="18px"
        boxShadow="10px 10px 0 rgba(11,47,47,0.9)"
        p={{ base: 5, md: 7 }}
        pt={{ base: 7, md: 7 }}
        sx={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(11,47,47,0.08) 0px, rgba(11,47,47,0.08) 2px, transparent 2px, transparent 30px)",
        }}
      >
        {/* hinge plates on the lid */}
        <Box aria-hidden="true" position="absolute" top="12px" left="13px" w="16px" h="16px" bg="#0B4F4C" border="1.5px solid #0B2F2F" borderRadius="4px" />
        <Box aria-hidden="true" position="absolute" top="12px" right="13px" w="16px" h="16px" bg="#0B4F4C" border="1.5px solid #0B2F2F" borderRadius="4px" />
        {/* sticker on the front panel */}
        <Flex justify="center" position="absolute" top="-13px" left="0" right="0">
          <Box
            bg="#FFFFFF"
            border="1.5px solid #0B2F2F"
            borderRadius="6px"
            px={4}
            py="3px"
            boxShadow="2px 2px 0 rgba(11,47,47,0.85)"
          >
            <Text fontFamily="heading" fontSize="13px" fontWeight="800" letterSpacing=".08em" color={LAGOON.heading}>
              MY TOOLBOX
            </Text>
          </Box>
        </Flex>

        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
          gap={{ base: 5, md: 6 }}
          alignItems="stretch"
        >
          {skillsData.map((category, index) => {
            const meta = CATEGORY_META[category.category] || FALLBACK_META;
            const { Doodle } = meta;
            const isDark = meta.dark;

            return (
              <Box
                key={category.category}
                data-reveal
                position="relative"
                overflow="hidden"
                bg={meta.bg}
                border={isDark ? "2px solid #0B2F2F" : "1.5px solid #0B2F2F"}
                borderRadius="18px"
                p={{ base: 6, md: 8 }}
                transition="box-shadow .16s ease, transform .16s ease"
                _hover={{
                  boxShadow: "5px 5px 0 rgba(11,47,47,0.85)",
                  transform: "translate(-2px, -2px)",
                }}
              >
                {/* drawer slot instead of tape */}
                <Flex justify="center" position="relative" mb={{ base: 4, md: 5 }}>
                  <Box
                    w="46px"
                    h="11px"
                    borderRadius="999px"
                    bg={isDark ? "rgba(255,255,255,0.28)" : "rgba(11,47,47,0.16)"}
                    border="1.5px solid rgba(11,47,47,0.5)"
                  />
                </Flex>
                {isDark && (
                  <Box
                    aria-hidden="true"
                    className="public-dots-light"
                    position="absolute"
                    top="24px"
                    right="24px"
                    w="140px"
                    h="110px"
                    opacity={0.5}
                  />
                )}

                <Flex align="center" justify="space-between" mb={6} position="relative">
                  {/* Doodle mascot in a tilted sticker circle */}
                  <Flex
                    align="center"
                    justify="center"
                    w="52px"
                    h="52px"
                    borderRadius="full"
                    bg={isDark ? "rgba(255,255,255,0.12)" : "#FFFFFF"}
                    border="1.5px solid #0B2F2F"
                    boxShadow="2px 2px 0 #0B2F2F"
                    transform={`rotate(${index % 2 === 0 ? -5 : 5}deg)`}
                  >
                    <Doodle size={30} />
                  </Flex>
                  <Text
                    className="public-mono"
                    fontSize="13px"
                    fontWeight="500"
                    color={isDark ? "rgba(255,255,255,0.55)" : LAGOON.muted}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </Flex>

                <Text
                  fontFamily="heading"
                  fontSize={{ base: "24px", md: "28px" }}
                  fontWeight="700"
                  letterSpacing="-.03em"
                  color={isDark ? "#FFFFFF" : LAGOON.heading}
                  mb={5}
                  position="relative"
                >
                  {category.category}
                </Text>

                {/* Sticker sheet: every chip hangs on the page at its own
                  little angle, straightens up when you point at it */}
                <Flex gap={2} flexWrap="wrap" position="relative" rowGap={2}>
                  {category.skills.map((skill, i) => (
                    <Box
                      key={skill}
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      px="12px"
                      py="6px"
                      borderRadius="8px"
                      fontSize="14px"
                      fontWeight="600"
                      bg={isDark ? "rgba(255,255,255,0.10)" : "#FFFFFF"}
                      border={
                        isDark
                          ? "1px solid rgba(255,255,255,0.35)"
                          : `1.5px solid ${LAGOON.ink}`
                      }
                      color={isDark ? LAGOON.onDark : LAGOON.text}
                      cursor="default"
                      transition="transform .18s ease, background .16s ease, box-shadow .16s ease"
                      _hover={{
                        transform: "translateY(-2px) scale(1.05)",
                        bg: isDark ? "rgba(255,255,255,0.16)" : "#FFC857",
                        boxShadow: "2px 2px 0 rgba(11,47,47,0.85)",
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Flex>
              </Box>
            );
          })}
        </Grid>
      </Box>
    </LagoonSection>
  );
};

export default Skills;
