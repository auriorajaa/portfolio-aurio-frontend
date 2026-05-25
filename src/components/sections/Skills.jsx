import React from "react";
import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Award, Cpu } from "lucide-react";
import { skillDetails, skillsData } from "../../data/portfolioData";
import { RetroPanel, useRetroColors } from "../ui/retro";

const Skills = () => {
  const colors = useRetroColors();

  return (
    <RetroPanel
      id="skills"
      title="Skills & Expertise Matrix"
      icon={Award}
      bodyProps={{ p: 0 }}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
        {skillsData.map((category, idx) => (
          <Box
            key={category.category}
            p={3}
            borderRight={{ base: "none", md: idx % 2 === 0 ? "1px solid" : "none" }}
            borderBottom="1px solid"
            borderColor={colors.borderSoft}
            bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
          >
            <HStack spacing={2} mb={2}>
              <Cpu size={14} color={colors.link} />
              <Text fontSize="16px" fontWeight="bold" color={colors.text}>
                {category.category}
              </Text>
            </HStack>

            <VStack spacing={2} align="stretch">
              {category.skills.map((skill) => {
                const detail = skillDetails[skill];
                return (
                  <Box
                    key={skill}
                    border="1px solid"
                    borderColor={colors.borderSoft}
                    bg={colors.panelBg}
                    p={2}
                  >
                    <HStack spacing={2} justify="space-between" align="start">
                      <Text fontSize="15px" fontWeight="bold" color={colors.link}>
                        {skill}
                      </Text>
                      {/* {detail?.level && <RetroBadge tone="green">{detail.level}</RetroBadge>} */}
                    </HStack>
                    {detail?.description && (
                      <Text fontSize="14px" color={colors.muted} mt={1} lineHeight="1.4">
                        {detail.description}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </RetroPanel>
  );
};

export default Skills;
