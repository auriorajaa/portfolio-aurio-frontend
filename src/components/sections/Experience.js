import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  keyframes,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import ExperienceCard from "../ui/ExperienceCard";
import { experienceData } from "../../data/portfolioData";

const Experience = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );

  return (
    <Box
      as="section"
      bgGradient={bgGradient}
      id="experience"
      py={{ base: 12, md: 16, lg: 20 }}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            textAlign="center"
            color={textPrimary}
            fontWeight="bold"
          >
            Work & Experience
          </Heading>
          <Text
            maxW="container.md"
            textAlign="center"
            color={textSecondary}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="tall"
            px={{ base: 4, md: 6, lg: 0 }}
          >
            My journey through various professional roles and internships that
            shaped my skills and career.
          </Text>

          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 5, md: 6 }}
            w="100%"
          >
            {experienceData.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                index={index}
                totalItems={experienceData.length}
              />
            ))}
          </SimpleGrid>

          {/* Empty state message */}
          {experienceData.length === 0 && (
            <Box textAlign="center" py={{ base: 6, md: 10 }}>
              <Text color={textSecondary} fontSize={{ base: "md", md: "lg" }}>
                Currently seeking internship opportunities.
                <Text as="span" color="brand.500" fontWeight="bold">
                  {" "}
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
