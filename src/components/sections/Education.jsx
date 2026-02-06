import React from "react";
import { Box, Text, Flex, Image, VStack } from "@chakra-ui/react";
import { GraduationCap } from "lucide-react";
import { educationData, certificationsData } from "../../data/portfolioData";

const Education = () => {
  const allEducation = [...educationData, ...certificationsData];

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="education"
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
        <GraduationCap size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
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
            borderBottom={idx !== allEducation.length - 1 ? "1px solid" : "none"}
            borderColor="facebook.border"
          >
            <Flex gap={3}>
              <Box
                flexShrink={0}
                w="50px"
                h="50px"
                border="1px solid"
                borderColor="facebook.border"
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
                <Text fontSize="12px" fontWeight="bold" color="facebook.text">
                  {edu.title}
                </Text>
                <Text fontSize="11px" color="facebook.linkBlue" mb={1}>
                  {edu.degree}
                </Text>
                <Text fontSize="11px" color="facebook.lightText" mb={1}>
                  {edu.period} · GPA: {edu.gpa || edu.score}
                </Text>
                <Text fontSize="11px" color="facebook.text" lineHeight="1.4" noOfLines={2}>
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