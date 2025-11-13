import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import AchievementCard from "../ui/AchievementCard";
import { achievements } from "../../data/portfolioData";

const Achievements = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );

  return (
    <Box
      as="section"
      id="achievements"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
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
            Certifications & Achievements
          </Heading>
          <Text
            maxW="container.md"
            textAlign="center"
            color={textSecondary}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="tall"
            px={{ base: 4, md: 6, lg: 0 }}
          >
            Recognition of my dedication to continuous learning and professional
            growth.
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Achievements;
