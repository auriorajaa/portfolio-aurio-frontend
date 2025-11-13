// src/components/sections/Education.js
import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { educationData } from "../../data/portfolioData";
import TimelineItem from "../ui/TimelineItem";

const MotionBox = motion(Box);

const TimelineConnector = ({ isLast }) => {
  const connectorColor = useColorModeValue("gray.300", "gray.500");

  if (isLast) return null;

  return (
    <Box
      position="absolute"
      left={{ base: "19px", md: "50%" }}
      top="80px"
      bottom="-100px"
      width="2px"
      bg={connectorColor}
      transform={{ base: "none", md: "translateX(-50%)" }}
      zIndex={0}
    />
  );
};

const Education = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );
  return (
    <Box
      as="section"
      id="education"
      py={{ base: 16, md: 20, lg: 24 }}
      position="relative"
      overflow="hidden"
      bgGradient={bgGradient}
    >
      {/* Background Decoration */}
      <Box
        position="absolute"
        top="10%"
        right="-10%"
        width="400px"
        height="400px"
        bg={accentColor}
        opacity={0.05}
        borderRadius="full"
        filter="blur(100px)"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              color={textPrimary}
              fontWeight="bold"
              mb={4}
            >
              Education{" "}
              <Text as="span" color={accentColor}>
                Journey
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={useColorModeValue("gray.600", "gray.400")}
              maxW="2xl"
              mx="auto"
            >
              My academic path and continuous learning journey
            </Text>
          </MotionBox>

          {/* Timeline */}
          <Box w="full" position="relative">
            {educationData.map((item, index) => (
              <Box
                key={index}
                position="relative"
                w="full"
                mb={{ base: 12, md: 16 }}
              >
                <TimelineConnector
                  isLast={index === educationData.length - 1}
                />
                <TimelineItem item={item} index={index} />
              </Box>
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Education;
