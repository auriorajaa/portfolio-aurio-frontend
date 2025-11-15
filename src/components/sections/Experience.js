// src/components/sections/Experience.js
import React from "react";
import {
  Box,
  Container,
  HStack,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import ExperienceCard from "../ui/ExperienceCard";
import { experienceData } from "../../data/portfolioData";

const MotionBox = motion(Box);

const Experience = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  // Match Hero section gradient
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );

  return (
    <Box
      as="section"
      id="experience"
      bgGradient={bgGradient}
      py={{ base: 12, md: 16, lg: 20 }}
      position="relative"
      overflow="hidden"
      minH="100vh"
    >
      {/* Animated background orbs - matching Hero section */}
      <MotionBox
        position="absolute"
        top="10%"
        left="5%"
        w="200px"
        h="200px"
        bg="brand.500"
        opacity={0.1}
        borderRadius="full"
        filter="blur(40px)"
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        display={{ base: "none", md: "block" }}
      />
      <MotionBox
        position="absolute"
        bottom="10%"
        right="10%"
        w="150px"
        h="150px"
        bg="brand.500"
        opacity={0.1}
        borderRadius="full"
        filter="blur(40px)"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        display={{ base: "none", md: "block" }}
      />
      <MotionBox
        position="absolute"
        top="30%"
        right="15%"
        w="100px"
        h="100px"
        bg="brand.500"
        opacity={0.1}
        borderRadius="full"
        filter="blur(40px)"
        animate={{
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        display={{ base: "none", md: "block" }}
      />

      <Container
        maxW="container.xl"
        px={{ base: 4, md: 6, lg: 8 }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header */}
          <VStack spacing={4}>
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Heading
                as="h2"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                textAlign="center"
                color={textPrimary}
                fontWeight="bold"
              >
                Work & Experience
              </Heading>
            </MotionBox>
            <Text
              maxW="container.md"
              textAlign="center"
              color={textSecondary}
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="tall"
              px={{ base: 4, md: 6, lg: 0 }}
            >
              My professional journey through impactful roles and projects
            </Text>
            {/* Navigation Hint */}
            <MotionBox
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              w="100%"
            >
              <HStack
                spacing={2}
                color={textSecondary}
                fontSize={{ base: "xs", md: "sm" }}
                justify="center"
                bg={useColorModeValue("whiteAlpha.700", "blackAlpha.400")}
                px={{ base: 4, md: 6 }}
                py={{ base: 2.5, md: 3 }}
                borderRadius="full"
                backdropFilter="blur(10px)"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                maxW="fit-content"
                mx="auto"
                shadow="sm"
              >
                <MotionBox
                  animate={{ y: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FiChevronDown size={16} />
                </MotionBox>
                <Text fontWeight="500" textAlign="center">
                  Click timeline nodes to explore different experiences
                </Text>
              </HStack>
            </MotionBox>
          </VStack>

          {/* Timeline Experience Component */}
          {experienceData && experienceData.length > 0 ? (
            <ExperienceCard experiences={experienceData} />
          ) : (
            <Box textAlign="center" py={{ base: 6, md: 10 }}>
              <Text color={textSecondary} fontSize={{ base: "md", md: "lg" }}>
                Currently seeking internship opportunities.
                <Text as="span" color="brand.500" fontWeight="bold">
                  Available from June 2024.
                </Text>
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Experience;
