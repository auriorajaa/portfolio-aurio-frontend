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
import ActivityCard from "../ui/ActivityCard";
import { universityActivities } from "../../data/portfolioData";

const Activities = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  return (
    <Box
      as="section"
      bgGradient={bgGradient}
      id="activities"
      py={{ base: 12, md: 16, lg: 20 }}
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
            University Activities
          </Heading>
          <Text
            maxW="container.md"
            textAlign="center"
            color={textSecondary}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="tall"
            px={{ base: 4, md: 6, lg: 0 }}
          >
            My involvement in various activities at Polytechnic State of Jakarta
            has shaped my technical skills and leadership abilities.
          </Text>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            {universityActivities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Activities;
