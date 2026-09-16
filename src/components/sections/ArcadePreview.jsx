import React from "react";
import { Box, Button, Grid, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import {
  ArrowRight,
  Brain,
  Disc,
  Gamepad2,
  Grid2X2,
  Hammer,
  Hash,
  Rabbit,
  Route,
  Swords,
  Zap,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { StudioSection } from "../public/studio";

const PREVIEW_GAMES = [
  { label: "2048 Mini", icon: Grid2X2, color: "#ffca3a" },
  { label: "Snake", icon: Route, color: "#0bbfa0" },
  { label: "Pong", icon: Disc, color: "#ff9f68" },
  { label: "Tic-Tac-Toe", icon: Hash, color: "#00f5d4" },
  { label: "Rock Paper Scissors", icon: Swords, color: "#9b5de5" },
  { label: "Whac-a-Mole", icon: Hammer, color: "#8ac926" },
  { label: "Memory Match", icon: Brain, color: "#f15bb5" },
  { label: "Reaction Dodge", icon: Zap, color: "#00bbf9" },
  { label: "Endless Runner", icon: Rabbit, color: "#ff6b6b" },
];

const ArcadePreview = () => {
  return (
    <StudioSection
      id="arcade"
      eyebrow="Take a Break"
      title="Retro Arcade Cabinet"
      maxW="1180px"
    >
      <Box
        bg="#14182b"
        color="#ffffff"
        p={{ base: 5, md: 8 }}
        position="relative"
        overflow="hidden"
        border="3px solid"
        borderColor="#00f5d4"
        boxShadow="0 0 20px rgba(0,245,212,0.15)"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-50px"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="#f15bb5"
          opacity="0.5"
          filter="blur(25px)"
        />
        <Box
          position="absolute"
          right="120px"
          bottom="-75px"
          w="160px"
          h="160px"
          borderRadius="full"
          bg="#00bbf9"
          opacity="0.5"
          filter="blur(25px)"
        />
        <Grid
          position="relative"
          templateColumns={{ base: "1fr", lg: "1.15fr .85fr" }}
          gap={{ base: 7, lg: 10 }}
          alignItems="center"
        >
          <Box>
            <HStack spacing={2} mb={3}>
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="#00f5d4"
                boxShadow="0 0 8px #00f5d4"
              />
              <Text
                fontSize="12px"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing=".1em"
                color="#00f5d4"
              >
                9 Retro Games Active
              </Text>
            </HStack>
            <Text
              fontSize={{ base: "28px", sm: "36px", md: "44px" }}
              fontWeight="900"
              lineHeight="1.05"
              letterSpacing="-0.02em"
            >
              Need a quick reset?
            </Text>
            <Text
              mt={4}
              maxW="480px"
              fontSize={{ base: "14px", md: "15px" }}
              opacity=".85"
              lineHeight="1.6"
            >
              Take a breather between exploring projects. 8-bit sound effects, touch controls, haptics, and personal best tracking across 9 classic games.
            </Text>
            <HStack spacing={3} mt={6} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/arcade"
                bg="#00f5d4"
                color="#171717"
                fontWeight="900"
                _hover={{ bg: "#8ac926" }}
                rightIcon={<ArrowRight size={16} />}
                leftIcon={<Gamepad2 size={16} />}
              >
                Enter Arcade Cabinet
              </Button>
            </HStack>
          </Box>

          {/* Interactive Preview Marquee */}
          <Box
            bg="#1b2140"
            border="2px solid"
            borderColor="#ffca3a"
            p={{ base: 3, sm: 4, md: 5 }}
            transform={{ base: "none", md: "rotate(1.5deg)" }}
            boxShadow="0 8px 24px rgba(0,0,0,0.4)"
          >
            <Text fontSize="11px" fontWeight="900" color="#ffca3a" textTransform="uppercase" letterSpacing="0.08em" mb={3} textAlign="center">
              Arcade Lineup
            </Text>
            <SimpleGrid columns={3} gap={2}>
              {PREVIEW_GAMES.map((game) => {
                const Icon = game.icon;
                return (
                  <Box
                    key={game.label}
                    p={2.5}
                    bg="#242b4d"
                    border="1px solid"
                    borderColor={game.color}
                    textAlign="center"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={1.5}
                    transition="transform .15s ease"
                    _hover={{ transform: "scale(1.04)" }}
                  >
                    <Icon size={20} color={game.color} />
                    <Text fontSize="11px" fontWeight="800" color="#ffffff" noOfLines={1}>
                      {game.label}
                    </Text>
                  </Box>
                );
              })}
            </SimpleGrid>
            <Text mt={3} textAlign="center" fontSize="11px" color="#94a3b8">
              Zero install &bull; Instant play in your browser
            </Text>
          </Box>
        </Grid>
      </Box>
    </StudioSection>
  );
};

export default ArcadePreview;
