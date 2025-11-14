// src/components/sections/Achievements.js
import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Icon,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiAward, FiStar } from "react-icons/fi";
import AchievementCard from "../ui/AchievementCard";
import { achievements } from "../../data/portfolioData";

const MotionBox = motion(Box);

const Achievements = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.600", "brand.400");

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );

  const floatingAnimation = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  `;

  const blobOpacity = useColorModeValue(0.35, 0.18);

  return (
    <Box
      as="section"
      id="achievements"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Blobs */}
      <Box
        position="absolute"
        top="15%"
        left="5%"
        w={{ base: "200px", md: "350px" }}
        h={{ base: "200px", md: "350px" }}
        bgGradient="radial(circle, teal.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(70px)"
        animation={`${floatingAnimation} 20s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="10%"
        w={{ base: "180px", md: "300px" }}
        h={{ base: "180px", md: "300px" }}
        bgGradient="radial(circle, blue.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(65px)"
        animation={`${floatingAnimation} 18s ease-in-out infinite reverse`}
      />

      {/* Floating Award Icons */}
      <MotionBox
        position="absolute"
        top="20%"
        right="15%"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <Icon
          as={FiAward}
          boxSize={{ base: "40px", md: "60px" }}
          color={accentColor}
        />
      </MotionBox>

      <MotionBox
        position="absolute"
        bottom="25%"
        left="10%"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <Icon
          as={FiStar}
          boxSize={{ base: "35px", md: "50px" }}
          color={accentColor}
        />
      </MotionBox>

      <Container
        maxW="container.xl"
        px={{
          base: 4,
          sm: 6,
          md: 10,
          lg: 16,
          xl: 18,
        }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header with Stats */}
          <VStack spacing={6} textAlign="center" w="100%">
            {/* Main Title */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                color={textPrimary}
                fontWeight="bold"
                letterSpacing="-0.02em"
                mb={4}
              >
                Certifications & Achievements
              </Heading>
              <Text
                maxW="700px"
                mx="auto"
                color={textSecondary}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.8"
                px={{ base: 4, md: 0 }}
              >
                Recognition of my dedication to continuous learning and
                professional growth in the ever-evolving tech landscape
              </Text>
            </MotionBox>
          </VStack>

          {/* Achievements Grid */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            w="100%"
          >
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
              w="100%"
            >
              {achievements.map((achievement, index) => (
                <Box
                  key={achievement.id}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <AchievementCard achievement={achievement} />
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Achievements;
