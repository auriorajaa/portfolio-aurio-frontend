import React from "react";
import { Box, Flex, HStack, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { GraduationCap } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const educationData = portfolioData.education || [];
  const certificationsData = portfolioData.certifications || [];
  const allEducation = [...educationData, ...certificationsData];
  const colors = useRetroColors();

  return (
    <RetroPanel
      id="education"
      title="Education & Certifications"
      icon={GraduationCap}
      headerRight={<RetroBadge>{allEducation.length} records</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
        {allEducation.map((edu, idx) => (
          <Box
            key={`${edu.title}-${idx}`}
            px={3}
            py={3}
            borderRight={{ base: "none", lg: idx % 2 === 0 ? "1px solid" : "none" }}
            borderBottom="1px solid"
            borderColor={colors.borderSoft}
            bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
          >
            <Flex gap={3} align="start">
              <Box
                flexShrink={0}
                w="54px"
                h="54px"
                border="1px solid"
                borderColor={colors.border}
                bg={colors.panelBg}
                overflow="hidden"
              >
                {edu.logo && (
                  <Image src={edu.logo} alt={edu.title} w="100%" h="100%" objectFit="cover" />
                )}
              </Box>

              <Box flex="1" minW={0}>
                <HStack spacing={2} justify="space-between" align="start" mb={1}>
                  <Text fontSize="13px" fontWeight="bold" color={colors.text} noOfLines={2}>
                    {edu.title}
                  </Text>
                  <RetroBadge tone={edu.status === "Completed" ? "green" : "amber"}>
                    {edu.status || edu.type}
                  </RetroBadge>
                </HStack>
                <Text fontSize="12px" color={colors.link} fontWeight="bold" noOfLines={1}>
                  {edu.degree || edu.major}
                </Text>
                <Text fontSize="11px" color={colors.muted} mb={2}>
                  {edu.period} {edu.gpa || edu.score ? `/ GPA ${edu.gpa || edu.score}` : ""}
                </Text>
                <Text fontSize="12px" color={colors.text} lineHeight="1.45" noOfLines={3}>
                  {edu.description}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </RetroPanel>
  );
};

export default Education;
