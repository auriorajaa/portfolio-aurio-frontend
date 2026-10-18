import React, { useMemo } from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();

  const allEducation = useMemo(
    () => [
      ...(portfolioData.education || []),
      ...(portfolioData.certifications || []),
    ],
    [portfolioData.education, portfolioData.certifications]
  );

  if (allEducation.length === 0) return null;

  return (
    <StudioSection
      id="education"
      title="Education & Certifications"
      watermark="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=50"
    >
      <VStack align="stretch" spacing={0}>
        {allEducation.map((edu, index) => {
          const scoreValue = edu.gpa || edu.score;
          const isLast = index === allEducation.length - 1;

          return (
            <Grid
              key={`${edu.title}-${index}`}
              templateColumns={{
                base: "1fr",
                md: "84px minmax(0, 1fr) 220px",
              }}
              gap={{ base: 4, md: 7 }}
              px={{ base: 3, md: 5 }}
              py={{ base: 7, md: 8 }}
              borderTop={index === 0 ? "2px solid" : "1px solid"}
              borderBottom={isLast ? "1px solid" : "none"}
              borderColor={index === 0 ? colors.heading : "#c6d7e8"}
              transition="background-color .16s ease"
              _hover={{ bg: "#f2f6fb" }}
            >
              {/* Logo */}
              <Box
                w={{ base: "64px", md: "84px" }}
                h={{ base: "64px", md: "84px" }}
                bg="#ffffff"
                border="1px solid"
                borderColor="#b9c9da"
                boxShadow="0 2px 5px rgba(18,58,99,0.12)"
                overflow="hidden"
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
                    fontSize="26px"
                    fontWeight="700"
                  >
                    {(edu.title || "?").charAt(0)}
                  </Flex>
                )}
              </Box>

              {/* Main details */}
              <Box minW={0}>
                <Text
                  fontSize={{ base: "19px", md: "22px" }}
                  fontWeight="700"
                  lineHeight="1.35"
                  color={colors.heading}
                >
                  {edu.title}
                </Text>

                {(edu.degree || edu.major) && (
                  <Text fontSize="15px" fontWeight="700" color={colors.accent} mt="2px">
                    {edu.degree || edu.major}
                  </Text>
                )}

                {edu.description && (
                  <Text
                    fontSize={{ base: "16px", md: "17px" }}
                    lineHeight="1.8"
                    color={colors.text}
                    mt={3}
                  >
                    {edu.description}
                  </Text>
                )}

                {edu.achievements?.length > 0 && (
                  <VStack align="stretch" spacing={2} mt={3}>
                    {edu.achievements.map((achievement, i) => (
                      <Flex key={i} gap={3} align="flex-start">
                        <Text fontSize="16px" lineHeight="1.75" color={colors.text}>
                          - {achievement}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </Box>

              {/* Meta column */}
              <VStack align={{ base: "flex-start", md: "stretch" }} spacing={2}>
                {edu.period && (
                  <Text fontSize="15px" fontWeight="700" color={colors.heading}>
                    {edu.period}
                  </Text>
                )}
                {(edu.status || edu.type) && (
                  <Box>
                    <BlueChip label={edu.status || edu.type} colors={colors} />
                  </Box>
                )}
                {scoreValue && (
                  <Box>
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      px="10px"
                      py="4px"
                      bg={colors.chipBlue}
                      border="1px solid"
                      borderColor={colors.chipBlueBorder}
                      boxShadow="inset 0 1px 0 #ffffff"
                      fontSize="14px"
                      fontWeight="700"
                      color={colors.chipBlueText}
                    >
                      GPA: {scoreValue}
                    </Box>
                  </Box>
                )}
                {edu.skills?.length > 0 && (
                  <Flex gap={2} flexWrap="wrap" pt={{ base: 1, md: 2 }}>
                    {edu.skills.map((skill, i) => (
                      <BlueChip key={i} label={skill} colors={colors} />
                    ))}
                  </Flex>
                )}
              </VStack>
            </Grid>
          );
        })}
      </VStack>
    </StudioSection>
  );
};

const BlueChip = ({ label, colors }) => (
  <Box
    as="span"
    display="inline-flex"
    alignItems="center"
    px="10px"
    py="4px"
    bg="linear-gradient(180deg, #ffffff 0%, #edf3fa 100%)"
    border="1px solid"
    borderColor={colors.border}
    boxShadow="inset 0 1px 0 #ffffff"
    fontSize="14px"
    fontWeight="600"
    color="#34506e"
  >
    {label}
  </Box>
);

export default Education;
