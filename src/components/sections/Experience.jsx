import React from "react";
import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { Briefcase } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];
  const colors = useRetroColors();

  return (
    <RetroPanel
      id="experience"
      title="Work Experience Timeline"
      icon={Briefcase}
      headerRight={<RetroBadge>{experienceData.length} entries</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <VStack spacing={0} align="stretch">
        {experienceData.map((exp, idx) => (
          <Box
            key={exp.id || `${exp.company}-${idx}`}
            px={3}
            py={3}
            borderBottom={idx !== experienceData.length - 1 ? "1px solid" : "none"}
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
                display="grid"
                placeItems="center"
              >
                {exp.logo && (
                  <Image src={exp.logo} alt={exp.company} w="100%" h="100%" objectFit="contain" />
                )}
              </Box>

              <Box flex="1" minW={0}>
                <HStack spacing={2} justify="space-between" align="start" mb={1}>
                  <Box minW={0}>
                    <Text fontSize="14px" fontWeight="bold" color={colors.text} noOfLines={1}>
                      {exp.position}
                    </Text>
                    <Text fontSize="12px" color={colors.link} fontWeight="bold">
                      {exp.company}
                    </Text>
                  </Box>
                  {exp.type && <RetroBadge tone="green">{exp.type}</RetroBadge>}
                </HStack>

                <Text fontSize="11px" color={colors.muted} mb={2}>
                  {exp.period} {exp.location ? `/ ${exp.location}` : ""}
                </Text>

                <VStack spacing={1} align="stretch" mb={2}>
                  {(Array.isArray(exp.description) ? exp.description.slice(0, 3) : [exp.description]).map(
                    (line) =>
                      line && (
                        <HStack key={line} align="start" spacing={2}>
                          <Text fontSize="12px" color={colors.text} lineHeight="1.45">
                            {line}
                          </Text>
                        </HStack>
                      ),
                  )}
                </VStack>

                <HStack spacing={1} flexWrap="wrap">
                  {(exp.technologies || []).slice(0, 7).map((tech) => (
                    <RetroBadge key={tech}>{tech}</RetroBadge>
                  ))}
                </HStack>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </RetroPanel>
  );
};

export default Experience;
