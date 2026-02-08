import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { GraduationCap } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const educationData = portfolioData.education || [];
  const certificationsData = portfolioData.certifications || [];
  const allEducation = [...educationData, ...certificationsData];
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
      id="education"
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
        <GraduationCap size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold" color={textColor}>
          Education & Certifications
        </Text>
      </Flex>

      {/* Education Items */}
      <VStack spacing={0} align="stretch">
        {allEducation.map((edu, idx) => (
          <Box
            key={idx}
            px={3}
            py={3}
            borderBottom={
              idx !== allEducation.length - 1 ? "1px solid" : "none"
            }
            borderColor={borderColor}
          >
            <Flex gap={3}>
              <Box
                flexShrink={0}
                w="50px"
                h="50px"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Image
                  src={edu.logo}
                  alt={edu.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>

              <Box flex="1">
                <Text fontSize="14px" fontWeight="bold" color={textColor}>
                  {edu.title}
                </Text>
                <Text fontSize="13px" color={iconColor} mb={1}>
                  {edu.degree}
                </Text>
                <Text fontSize="13px" color={lightTextColor} mb={1}>
                  {edu.period} · GPA: {edu.gpa || edu.score}
                </Text>
                <Text
                  fontSize="13px"
                  color={textColor}
                  lineHeight="1.4"
                  noOfLines={2}
                >
                  {edu.description}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Education;
