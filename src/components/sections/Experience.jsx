import React from "react";
import { Box, Text, Flex, Image, VStack, Wrap, Tag } from "@chakra-ui/react";
import { Briefcase } from "lucide-react";
import { experienceData } from "../../data/portfolioData";

const Experience = () => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="experience"
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
        <Briefcase size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
          Work Experience
        </Text>
      </Flex>

      {/* Experience Items */}
      <VStack spacing={0} align="stretch">
        {experienceData.map((exp, idx) => (
          <Box
            key={exp.id}
            px={3}
            py={3}
            borderBottom={idx !== experienceData.length - 1 ? "1px solid" : "none"}
            borderColor="facebook.border"
          >
            <Flex gap={3}>
              {/* Company Logo */}
              <Box
                flexShrink={0}
                w="50px"
                h="50px"
                border="1px solid"
                borderColor="facebook.border"
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
                <Text fontSize="12px" fontWeight="bold" color="facebook.text">
                  {exp.position}
                </Text>
                <Text fontSize="11px" color="facebook.linkBlue" mb={1}>
                  {exp.company}
                </Text>
                <Text fontSize="11px" color="facebook.lightText" mb={2}>
                  {exp.period} · {exp.location}
                </Text>
                <Text fontSize="11px" color="facebook.text" lineHeight="1.4" mb={2}>
                  {exp.description[0]}
                </Text>
                <Wrap spacing={1}>
                  {exp.technologies.slice(0, 5).map((tech) => (
                    <Tag
                      key={tech}
                      size="sm"
                      bg="facebook.paleBlue"
                      color="facebook.text"
                      fontSize="10px"
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