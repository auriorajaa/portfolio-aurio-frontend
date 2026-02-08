import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  Wrap,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { Briefcase } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];

  // Use admin-style colors
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="experience"
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
        <Briefcase size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold" color={textColor}>
          Work Experience
        </Text>
      </Flex>

      {/* Experience Items */}
      <VStack spacing={0} align="stretch">
        {[...experienceData].map((exp, idx) => (
          <Box
            key={exp.id}
            px={3}
            py={3}
            borderBottom={
              idx !== experienceData.length - 1 ? "1px solid" : "none"
            }
            borderColor={borderColor}
          >
            <Flex gap={3}>
              {/* Company Logo */}
              <Box
                flexShrink={0}
                w="50px"
                h="50px"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Image
                  src={exp.logo}
                  alt={exp.company}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Box>

              <Box flex="1">
                <Text fontSize="14px" fontWeight="bold" color={textColor}>
                  {exp.position}
                </Text>
                <Text fontSize="13px" color={iconColor} mb={1}>
                  {exp.company}
                </Text>
                <Text fontSize="13px" color={lightTextColor} mb={2}>
                  {exp.period} · {exp.location}
                </Text>
                <Text fontSize="13px" color={textColor} lineHeight="1.4" mb={2}>
                  {exp.description[0]}
                </Text>
                <Wrap spacing={1}>
                  {exp.technologies.slice(0, 5).map((tech) => (
                    <Tag
                      key={tech}
                      size="md"
                      bg="facebook.paleBlue"
                      color="facebook.blue"
                      fontSize="12px"
                      borderRadius="2px"
                      fontWeight="normal"
                    >
                      {tech}
                    </Tag>
                  ))}
                </Wrap>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Experience;
