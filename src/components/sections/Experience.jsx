import React from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  BRUT,
  BrutSection,
  BrutTag,
  DoodleLightning,
} from "../public/brutal";

// The quest log: employment dates ride on a full-width horizontal
// badge above each entry, so ranges like "Aug 2025 - Present"
// always sit on one line. The card itself is a ticket stub —
// dashed divider with round punch holes at both ends.
const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];

  if (experienceData.length === 0) return null;

  const BULLET_TINTS = ["yellowSoft", "blueSoft", "limeSoft", "coralSoft"];
  const TECH_TONES = ["mint", "blue", "lime"];
  const STUB_TONES = [BRUT.yellow, BRUT.primarySoft, BRUT.blueSoft];

  return (
    <BrutSection
      id="experience"
      number="02"
      kicker="the quest log"
      title="Experience"
      description="Missions where I shipped real things, pinned up in order like a run sheet."
      tone="paper"
      headerAside={
        <BrutTag tone="coral" dot dotColor={BRUT.coral}>
          {experienceData.length} RUNS LOGGED
        </BrutTag>
      }
    >
      <VStack align="stretch" spacing={{ base: 10, md: 11 }}>
        {experienceData.map((exp, index) => {
          const bullets = Array.isArray(exp.description)
            ? exp.description.slice(0, 3)
            : [exp.description].filter(Boolean);
          const isCurrent = /present/i.test(exp.period || "");
          const stub = STUB_TONES[index % STUB_TONES.length];

          return (
            <Box
              key={exp.id || `${exp.company}-${index}`}
              data-reveal
              maxW="940px"
              mx="auto"
              w="100%"
            >
              {/* Full-width horizontal date badge — never wraps */}
              <Flex
                align="center"
                gap={{ base: 3, md: 4 }}
                mb={5}
                flexWrap="nowrap"
              >
                <Flex
                  align="center"
                  justify="center"
                  w={{ base: "48px", md: "54px" }}
                  h={{ base: "48px", md: "54px" }}
                  bg={BRUT.ink}
                  borderRadius="8px"
                  boxShadow={BRUT.shadowXs}
                  flexShrink={0}
                >
                  <Text
                    fontFamily="bungee"
                    fontSize={{ base: "16px", md: "19px" }}
                    color={isCurrent ? BRUT.yellow : BRUT.primary}
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </Flex>

                <Flex
                  as="span"
                  align="center"
                  gap={2.5}
                  bg={isCurrent ? BRUT.yellow : BRUT.surface}
                  border="2.5px solid"
                  borderColor={BRUT.ink}
                  borderRadius="8px"
                  px={{ base: 4, md: 5 }}
                  py="10px"
                  minW={0}
                  boxShadow={BRUT.shadowXs}
                  flex="1"
                  overflowX="auto"
                  sx={{
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  <Text
                    fontFamily="spaceMono"
                    fontSize={{ base: "13px", md: "15px" }}
                    fontWeight="700"
                    color={BRUT.ink}
                    lineHeight="1.2"
                    whiteSpace="nowrap"
                    overflow="visible"
                    textOverflow="clip"
                    flexShrink={0}
                  >
                    {exp.period || "DATES NOT LOGGED"}
                  </Text>
                  {isCurrent && (
                    <Flex
                      align="center"
                      gap={1.5}
                      bg={BRUT.primary}
                      border="2px solid"
                      borderColor={BRUT.ink}
                      borderRadius="5px"
                      px="9px"
                      py="3px"
                      flexShrink={0}
                    >
                      <DoodleLightning size={11} />
                      <Text
                        fontFamily="spaceMono"
                        fontSize="11.5px"
                        fontWeight="700"
                        letterSpacing=".1em"
                        color="#FFFFFF"
                        whiteSpace="nowrap"
                      >
                        ON NOW
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>

              {/* Ticket stub card */}
              <Box
                position="relative"
                bg="#FFFFFF"
                border="3px solid"
                borderColor={BRUT.ink}
                borderRadius="12px"
                boxShadow={BRUT.shadow}
                transition="transform .2s ease, box-shadow .2s ease"
                overflow="visible"
                _hover={{
                  transform: "translate(-3px, -3px)",
                  boxShadow: "7px 7px 0 #17181C",
                }}
              >
                {/* Ticket head band */}
                <Flex
                  align="center"
                  gap={4}
                  bg={stub}
                  px={{ base: 5, md: 6 }}
                  pt={{ base: 5, md: 6 }}
                  pb={{ base: 5, md: 6 }}
                  borderBottom="2.5px dashed"
                  borderColor="rgba(23,24,28,0.45)"
                  position="relative"
                >
                  {/* Punch holes riding the dashed divider */}
                  <Box
                    aria-hidden="true"
                    position="absolute"
                    bottom="-13px"
                    left="-15px"
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={BRUT.bg}
                    border="2.5px solid"
                    borderColor={BRUT.ink}
                    zIndex={3}
                  />
                  <Box
                    aria-hidden="true"
                    position="absolute"
                    bottom="-13px"
                    right="-15px"
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={BRUT.bg}
                    border="2.5px solid"
                    borderColor={BRUT.ink}
                    zIndex={3}
                  />

                  {/* Company logo, large, in its bordered sticker frame */}
                  <Flex
                    w={{ base: "68px", sm: "80px", md: "88px" }}
                    h={{ base: "68px", sm: "80px", md: "88px" }}
                    flexShrink={0}
                    bg="#FFFFFF"
                    border="3px solid"
                    borderColor={BRUT.ink}
                    borderRadius="10px"
                    boxShadow="3px 3px 0 #17181C"
                    overflow="hidden"
                    align="center"
                    justify="center"
                  >
                    {exp.logo ? (
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        loading="lazy"
                        decoding="async"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <Text fontFamily="bungee" fontSize="26px" color={BRUT.primaryDeep}>
                        {(exp.company || "?").charAt(0)}
                      </Text>
                    )}
                  </Flex>

                  <Box minW={0} flex="1">
                    <Text
                      fontFamily="spaceMono"
                      fontSize="12px"
                      fontWeight="700"
                      letterSpacing=".14em"
                      textTransform="uppercase"
                      color={BRUT.ink}
                      whiteSpace="nowrap"
                    >
                      TICKET — NO. {String(index + 1).padStart(3, "0")}
                    </Text>
                    <Text
                      fontFamily="bungee"
                      fontSize={{ base: "16px", md: "19px" }}
                      color={BRUT.ink}
                      lineHeight="1.3"
                      mt="5px"
                      noOfLines={2}
                    >
                      {exp.position}
                    </Text>
                    <Text
                      fontFamily="heading"
                      fontSize={{ base: "15px", md: "16px" }}
                      fontWeight="700"
                      color={BRUT.ink}
                      mt="5px"
                      noOfLines={1}
                    >
                      {exp.company}
                    </Text>
                    {(exp.location || exp.type) && (
                      <Text
                        fontFamily="spaceMono"
                        fontSize="12.5px"
                        fontWeight="700"
                        letterSpacing=".06em"
                        textTransform="uppercase"
                        color={BRUT.ink}
                        mt="3px"
                        noOfLines={1}
                      >
                        {[exp.location, exp.type].filter(Boolean).join(" / ")}
                      </Text>
                    )}
                  </Box>
                </Flex>

                {/* Body: line items like boarding rows */}
                <Box px={{ base: 5, md: 7 }} pt={{ base: 5, md: 6 }} pb={{ base: 6, md: 7 }}>
                  {bullets.length > 0 && (
                    <VStack align="stretch" spacing={4} maxW="860px">
                      {bullets.map((line, i) => (
                        <Flex key={i} gap={3} align="flex-start" minW={0}>
                          <Box
                            as="span"
                            flexShrink={0}
                            mt="2px"
                            minW="26px"
                            h="20px"
                            borderRadius="4px"
                            bg={BRUT[BULLET_TINTS[i % BULLET_TINTS.length]]}
                            border="1.5px solid"
                            borderColor={BRUT.ink}
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="spaceMono"
                            fontSize="11px"
                            fontWeight="700"
                            color={BRUT.ink}
                          >
                            {i + 1}
                          </Box>
                          <Text
                            fontSize={{ base: "16px", md: "17px" }}
                            lineHeight="1.75"
                            color={BRUT.text}
                          >
                            {line}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}

                  {/* Footer: technologies */}
                  {exp.technologies?.length > 0 && (
                    <Flex
                      align="center"
                      gap={2}
                      flexWrap="wrap"
                      mt={6}
                      pt={5}
                      borderTop="2px dashed rgba(23,24,28,0.3)"
                    >
                      <Text
                        fontFamily="spaceMono"
                        fontSize="12px"
                        fontWeight="700"
                        letterSpacing=".14em"
                        textTransform="uppercase"
                        color={BRUT.ink}
                        flexShrink={0}
                        mr={1}
                      >
                        GEAR:
                      </Text>
                      {exp.technologies.slice(0, 6).map((tech, i) => (
                        <BrutTag key={tech} tone={TECH_TONES[i % TECH_TONES.length]}>
                          {tech}
                        </BrutTag>
                      ))}
                    </Flex>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </VStack>
    </BrutSection>
  );
};

export default Experience;
