import React from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioPill, StudioSection, useStudioColors } from "../public/studio";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];
  const colors = useStudioColors();

  if (experienceData.length === 0) return null;

  return (
    <StudioSection
      id="experience"
      title="Experience"
      watermark="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=50"
    >
      <VStack align="stretch" spacing={0}>
        {experienceData.map((exp, index) => {
          const bullets = Array.isArray(exp.description)
            ? exp.description.slice(0, 3)
            : [exp.description].filter(Boolean);

          const isLast = index === experienceData.length - 1;
          const isCurrent = /present/i.test(exp.period || "");

          return (
            <Grid
              key={exp.id || `${exp.company}-${index}`}
              templateColumns={{ base: "1fr", md: "210px minmax(0, 1fr)" }}
              gap={{ base: 3, md: 8 }}
              px={{ base: 3, md: 5 }}
              py={{ base: 7, md: 8 }}
              bg={index % 2 === 0 ? "transparent" : "transparent"}
              borderTop={index === 0 ? "2px solid" : "1px solid"}
              borderBottom={isLast ? "1px solid" : "none"}
              borderColor={index === 0 ? colors.heading : "#c6d7e8"}
              transition="background-color .16s ease, box-shadow .16s ease"
              _hover={{ bg: "#e2ecf8", boxShadow: `inset 4px 0 0 ${colors.accent}` }}
            >
              {/* Period column */}
              <Box>
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  letterSpacing=".18em"
                  color={colors.muted}
                  mb={1}
                >
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text
                  fontSize={{ base: "16px", md: "22px" }}
                  fontWeight="700"
                  color={colors.heading}
                  lineHeight="1.35"
                >
                  {exp.period || "—"}
                </Text>
                {isCurrent && (
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    mt={2}
                    px="9px"
                    py="3px"
                    bg={colors.chipBlue}
                    border="1px solid"
                    borderColor={colors.chipBlueBorder}
                    boxShadow="inset 0 1px 0 #ffffff"
                    fontSize="12px"
                    fontWeight="700"
                    color={colors.chipBlueText}
                  >
                    Current role
                  </Box>
                )}
                {(exp.location || exp.type) && (
                  <Text fontSize="13px" color={colors.muted} mt={2}>
                    {[exp.location, exp.type].filter(Boolean).join(" · ")}
                  </Text>
                )}
              </Box>

              {/* Details */}
              <Flex gap={{ base: 4, md: 5 }} align="flex-start" minW={0}>
                <Box
                  w={{ base: "56px", md: "64px" }}
                  h={{ base: "56px", md: "64px" }}
                  flexShrink={0}
                  bg="#ffffff"
                  border="1px solid"
                  borderColor={colors.border}
                  boxShadow="0 2px 5px rgba(18,58,99,0.12)"
                  overflow="hidden"
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
                        padding: "7px",
                        boxSizing: "border-box",
                        background: "#ffffff",
                      }}
                    />
                  ) : (
                    <Flex
                      w="100%"
                      h="100%"
                      align="center"
                      justify="center"
                      color={colors.heading}
                      fontSize="24px"
                      fontWeight="700"
                    >
                      {(exp.company || "?").charAt(0)}
                    </Flex>
                  )}
                </Box>

                <Box minW={0}>
                  <Text
                    fontSize={{ base: "19px", md: "23px" }}
                    fontWeight="700"
                    color={colors.heading}
                    lineHeight="1.3"
                  >
                    {exp.position}
                  </Text>

                  <Text fontSize="16px" fontWeight="700" color={colors.accent} mt="2px">
                    {exp.company}
                  </Text>

                  {bullets.length > 0 && (
                    <VStack align="stretch" spacing={2} mt={4} maxW="1000px">
                      {bullets.map((line, i) => (
                        <Flex key={i} gap={3} align="flex-start">
                          <Text
                            fontSize={{ base: "16px", md: "17px" }}
                            lineHeight="1.75"
                            color={colors.text}
                          >
                            {line}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}

                  {exp.technologies?.length > 0 && (
                    <Flex gap={2} flexWrap="wrap" mt={4}>
                      {exp.technologies.slice(0, 6).map((tech) => (
                        <StudioPill key={tech}>{tech}</StudioPill>
                      ))}
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Grid>
          );
        })}
      </VStack>
    </StudioSection>
  );
};

export default Experience;
