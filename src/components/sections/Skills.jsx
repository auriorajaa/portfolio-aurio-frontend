import React from "react";
import { Box, Text, Flex, VStack, Wrap, Tag } from "@chakra-ui/react";
import { Award } from "lucide-react";
import { skillsData } from "../../data/portfolioData";

const Skills = () => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="skills"
    >
      {/* Section Header */}
      <Flex
        borderBottom="1px solid"
        borderColor="facebook.border"
        px={3}
        py={2}
        align="center"
        gap={2}
        bg="facebook.gray"
      >
        <Award size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
          Skills & Expertise
        </Text>
      </Flex>

      {/* Skills Content */}
      <Box px={3} py={3}>
        <VStack spacing={3} align="stretch">
          {skillsData.map((category) => (
            <Box key={category.category}>
              <Text
                fontSize="11px"
                fontWeight="bold"
                color="facebook.text"
                mb={2}
              >
                {category.category}
              </Text>
              <Wrap spacing={1}>
                {category.skills.map((skill) => (
                  <Tag
                    key={skill}
                    size="sm"
                    bg="facebook.paleBlue"
                    color="facebook.text"
                    fontSize="10px"
                    borderRadius="2px"
                    fontWeight="normal"
                  >
                    {skill}
                  </Tag>
                ))}
              </Wrap>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default Skills;