import React from "react";
import {
  Box,
  Text,
  Flex,
  VStack,
  Wrap,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { Award } from "lucide-react";
import { skillsData } from "../../data/portfolioData";

const Skills = () => {
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  // const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");
  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="skills"
    >
      {/* Section Header */}
      <Flex
        borderBottom="1px solid"
        borderColor={borderColor}
        px={3}
        py={2}
        align="center"
        gap={2}
        bg={grayBg}
      >
        <Award size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold" color={textColor}>
          Skills & Expertise
        </Text>
      </Flex>

      {/* Skills Content */}
      <Box px={3} py={3}>
        <VStack spacing={3} align="stretch">
          {skillsData.map((category) => (
            <Box key={category.category}>
              <Text fontSize="13px" fontWeight="bold" color={textColor} mb={2}>
                {category.category}
              </Text>
              <Wrap spacing={1}>
                {category.skills.map((skill) => (
                  <Tag
                    key={skill}
                    size="md"
                    bg="facebook.paleBlue"
                    color="facebook.blue"
                    fontSize="12px"
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
