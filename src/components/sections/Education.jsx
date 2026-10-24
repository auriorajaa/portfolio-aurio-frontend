import React, { useMemo } from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  BRUT,
  BrutSection,
  BrutTag,
  usePublicColors,
} from "../public/brutal";

// Student-ID checkpoint: each item is a playful ID card with a
// colored band, a serial number, a portrait frame and a stripe
// "barcode" footer. Band colors alternate sky blue / warm yellow.
const BAND_TONES = [
  { bg: BRUT.blue, fg: "#FFFFFF", accent: BRUT.ink },
  { bg: BRUT.yellow, fg: BRUT.ink, accent: BRUT.ink },
  { bg: BRUT.primary, fg: "#FFFFFF", accent: BRUT.ink },
];

const Education = () => {
  const { portfolioData } = usePortfolio();
  const colors = usePublicColors();

  const allEducation = useMemo(
    () => [
      ...(portfolioData.education || []),
      ...(portfolioData.certifications || []),
    ],
    [portfolioData.education, portfolioData.certifications]
  );

  if (allEducation.length === 0) return null;

  return (
    <BrutSection
      id="education"
      number="04"
      kicker="the student passes"
      title="Education"
      description="Degrees, programs, and bootcamps that shaped how I build."
      tone="paper"
    >
      {/* Bunting strip across the top */}
      <Box
        aria-hidden="true"
        position="relative"
        height="26px"
        mb={{ base: 2, md: 4 }}
        overflow="hidden"
        data-reveal
      >
        <Box position="absolute" top="0" left="0" right="0" borderBottom="2.5px dashed rgba(23,24,28,0.3)" />
        <Flex position="absolute" top="0" left="0" right="0" justifyContent="space-between" px={2}>
          {Array.from({ length: 14 }, (_, i) => (
            <Box
              key={i}
              w="0"
              h="0"
              borderLeft="10px solid transparent"
              borderRight="10px solid transparent"
              borderTop={`14px solid ${[BRUT.primary, BRUT.yellow, BRUT.blue][i % 3]}`}
              transform="translateY(1px)"
            />
          ))}
        </Flex>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
        gap={{ base: 8, md: 10 }}
        alignItems="stretch"
        data-reveal
      >
        {allEducation.map((edu, index) => {
          const band = BAND_TONES[index % BAND_TONES.length];
          const scoreValue = edu.gpa || edu.score;
          const isBootcamp = edu.type === "bootcamp";

          return (
            <Box
              key={`${edu.title}-${index}`}
              as="article"
              position="relative"
              display="flex"
              flexDirection="column"
              bg="#FFFFFF"
              border="3px solid"
              borderColor={BRUT.ink}
              borderRadius="12px"
              overflow="visible"
              boxShadow={BRUT.shadow}
              transition="box-shadow .16s ease, transform .16s ease"
              _hover={{
                transform: "translate(-2px, -2px)",
                boxShadow: "7px 7px 0 #17181C",
              }}
            >
              {/* ID band head */}
              <Flex
                align="center"
                justify="space-between"
                gap={3}
                bg={band.bg}
                px={{ base: 4, md: 5 }}
                py="12px"
                borderBottom="2.5px solid"
                borderColor={BRUT.ink}
                borderRadius="8px 8px 0 0"
              >
                <Flex align="center" gap={2} minW={0}>
                  <DoodleIdChip color={band.accent} />
                  <Text
                    fontFamily="bungee"
                    fontSize={{ base: "13px", md: "14px" }}
                    color={band.fg}
                    lineHeight="1.2"
                    whiteSpace="nowrap"
                  >
                    {isBootcamp ? "TRAINEE PASS" : "STUDENT ID"}
                  </Text>
                </Flex>
              </Flex>

              <Box px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }} pt={5} display="flex" flexDirection="column" flex="1">
                {/* Portrait frame + holder name */}
                <Flex gap={4} align="flex-start">
                  <Flex
                    w={{ base: "64px", md: "76px" }}
                    h={{ base: "64px", md: "76px" }}
                    flexShrink={0}
                    bg="#FFFFFF"
                    border="2.5px solid"
                    borderColor={BRUT.ink}
                    borderRadius="10px"
                    boxShadow="3px 3px 0 #17181C"
                    overflow="hidden"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {edu.logo ? (
                      <img
                        src={edu.logo}
                        alt={edu.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "9px",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <Text fontFamily="bungee" fontSize="22px" color={BRUT.primaryDeep}>
                        {(edu.title || "?").charAt(0)}
                      </Text>
                    )}
                  </Flex>

                  <Box minW={0} flex="1">
                    <Text
                      fontFamily="heading"
                      fontSize={{ base: "17px", md: "19px" }}
                      fontWeight="600"
                      lineHeight="1.3"
                      color={BRUT.ink}
                    >
                      {edu.title}
                    </Text>
                    {(edu.degree || edu.major) && (
                      <Text
                        fontFamily="spaceMono"
                        fontSize="13px"
                        fontWeight="700"
                        letterSpacing=".04em"
                        color={BRUT.ink}
                        mt="5px"
                      >
                        {[edu.degree, edu.major].filter(Boolean).join(" / ")}
                      </Text>
                    )}
                    <Flex gap={2} mt={2} flexWrap="wrap">
                      <BrutTag
                        tone={isBootcamp ? "yellow" : "mint"}
                        bg={isBootcamp ? BRUT.yellowSoft : BRUT.primarySoft}
                        color={BRUT.ink}
                        dot
                        dotColor={BRUT.primary}
                      >
                        {isBootcamp ? "bootcamp" : "degree"}
                      </BrutTag>
                      {edu.period && (
                        <BrutTag
                          bg={BRUT.primary}
                          color="#FFFFFF"
                          border="2px solid"
                          fontSize="10.5px"
                          whiteSpace="nowrap"
                        >
                          {edu.period}
                        </BrutTag>
                      )}
                    </Flex>
                  </Box>
                </Flex>

                {edu.description && (
                  <Text
                    fontSize={{ base: "16px", md: "16.5px" }}
                    lineHeight="1.7"
                    color={colors.text}
                    mt={4}
                  >
                    {edu.description}
                  </Text>
                )}

                {edu.achievements?.length > 0 && (
                  <VStack align="stretch" spacing={2.5} mt={4}>
                    {edu.achievements.map((achievement, i) => (
                      <Flex key={i} gap={3} align="flex-start">
                        <Flex
                          flexShrink={0}
                          align="center"
                          justify="center"
                          w="17px"
                          h="17px"
                          mt="3px"
                          bg="#FFFFFF"
                          border="1.5px solid"
                          borderColor={BRUT.ink}
                          borderRadius="4px"
                        >
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="2px"
                            bg={i % 2 === 0 ? colors.coral : colors.blue}
                          />
                        </Flex>
                        <Text fontSize="15.5px" lineHeight="1.65" color={colors.text}>
                          {achievement}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                )}

                <Box flex="1" minH="12px" />

                {/* Card foot: score chip + striped barcode strip */}
                <Flex
                  align="center"
                  gap={3}
                  rowGap={3}
                  flexWrap="wrap"
                  mt="auto"
                  pt={4}
                  borderTop="2px dashed"
                  borderColor={colors.borderDashed}
                >
                  {scoreValue && (
                    <Box
                      bg={colors.yellow}
                      border="2px solid"
                      borderColor={BRUT.ink}
                      borderRadius="8px"
                      px="12px"
                      py="5px"
                      boxShadow={BRUT.shadowXs}
                      flexShrink={0}
                    >
                      <Text
                        fontFamily="spaceMono"
                        fontSize="10.5px"
                        fontWeight="700"
                        color={BRUT.ink}
                        letterSpacing=".14em"
                        textTransform="uppercase"
                      >
                        {isBootcamp ? "final score" : "gpa"}
                      </Text>
                      <Text
                        fontFamily="bungee"
                        fontSize="18px"
                        color={BRUT.ink}
                        lineHeight="1.1"
                        mt="2px"
                      >
                        {scoreValue}
                      </Text>
                    </Box>
                  )}

                  {/* Barcode: staggered vertical ink bars */}
                  <Box
                    aria-hidden="true"
                    flex="1"
                    h="30px"
                    sx={{
                      background:
                        "repeating-linear-gradient(90deg, #17181C 0 3px, transparent 3px 6px, #17181C 6px 8px, transparent 8px 14px, #17181C 14px 15px, transparent 15px 20px, #17181C 20px 23px, transparent 23px 27px)",
                    }}
                    borderRadius="4px"
                    opacity={0.9}
                    minW="48px"
                  />

                  {edu.status && (
                    <Flex align="center" gap={1.5} flexShrink={0}>
                      <Box
                        w="7px"
                        h="7px"
                        borderRadius="full"
                        bg={/current/i.test(edu.status) ? BRUT.primary : BRUT.muted}
                        border="1.5px solid"
                        borderColor={BRUT.ink}
                      />
                      <Text
                        fontFamily="spaceMono"
                        fontSize="11px"
                        fontWeight="700"
                        letterSpacing=".08em"
                        textTransform="uppercase"
                        color={BRUT.ink}
                        whiteSpace="nowrap"
                      >
                        VALID
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </BrutSection>
  );
};

// Tiny lanyard chip: a small outlined square clipped to the band.
const DoodleIdChip = ({ color }) => (
  <Box
    aria-hidden="true"
    as="span"
    display="inline-block"
    w="14px"
    h="14px"
    borderRadius="4px"
    border="2px solid"
    borderColor={color}
    position="relative"
  >
    <Box
      position="absolute"
      top="-2px"
      left="50%"
      ml="-3px"
      w="6px"
      h="5px"
      borderRadius="2px 2px 0 0"
      bg={color}
    />
  </Box>
);

export default Education;
