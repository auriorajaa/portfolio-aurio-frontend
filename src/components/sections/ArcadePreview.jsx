import React from "react";
import { Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import { ArrowRight, Brain, Gamepad2, Grid2X2, Zap } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { StudioSection, useStudioColors } from "../public/studio";

const games = [
  { label: "2048 Mini", icon: Grid2X2, color: "#ffca3a" },
  { label: "Memory Match", icon: Brain, color: "#f15bb5" },
  { label: "Reaction Dodge", icon: Zap, color: "#00bbf9" },
];
const ArcadePreview = () => {
  const colors = useStudioColors();
  return (
    <StudioSection
      id="arcade"
      eyebrow="Take a break"
      title="Tiny games for Your Quick breaks."
      maxW="1180px"
    >
      <Box
        bg={colors.text}
        color={colors.surfaceAlt}
        p={{ base: 5, md: 8 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-50px"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="#f15bb5"
        />
        <Box
          position="absolute"
          right="120px"
          bottom="-75px"
          w="160px"
          h="160px"
          borderRadius="full"
          bg="#00bbf9"
        />
        <Grid
          position="relative"
          templateColumns={{ base: "1fr", lg: "1.15fr .85fr" }}
          gap={{ base: 7, lg: 10 }}
          alignItems="center"
        >
          <Box>
            <HStack spacing={2} mb={4}>
              <Text
                fontSize="12px"
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing=".1em"
              >
                Games Corner
              </Text>
            </HStack>
            <Text
              fontSize={{ base: "29px", md: "43px" }}
              fontWeight="800"
              lineHeight="1.05"
            >
              Need a quick reset?
            </Text>
            <Text
              mt={4}
              maxW="480px"
              fontSize="15px"
              opacity=".75"
              lineHeight="1.7"
            >
              Pick a tiny game, chase a score, and get back to your day.
            </Text>
            <Button
              as={RouterLink}
              to="/arcade"
              mt={7}
              bg={colors.surfaceAlt}
              color={colors.text}
              _hover={{ bg: "#ffca3a" }}
              rightIcon={<ArrowRight size={15} />}
            >
              Open the Arcade
            </Button>
          </Box>
          <Box
            bg="#1b2140"
            border="2px solid"
            borderColor="#ffca3a"
            p={{ base: 4, md: 6 }}
            transform={{ base: "none", md: "rotate(3deg)" }}
          >
            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 0].map(
                (value, index) => (
                  <Box
                    key={index}
                    aspectRatio="1"
                    display="grid"
                    placeItems="center"
                    bg={
                      value === 0
                        ? "#303858"
                        : [
                          "#fff4c2",
                          "#ffd166",
                          "#ff9f68",
                          "#ff6b6b",
                          "#f15bb5",
                          "#9b5de5",
                          "#5f6fff",
                          "#00bbf9",
                          "#00f5d4",
                          "#8ac926",
                          "#ffca3a",
                        ][Math.min(index, 10)]
                    }
                    color={index > 4 ? "#ffffff" : "#2b2540"}
                    fontSize={{ base: "10px", md: "13px" }}
                    fontWeight="800"
                  >
                    {value || ""}
                  </Box>
                ),
              )}
            </Grid>
            <Text mt={4} textAlign="center" fontSize="11px" color="#c5c9dd">
              Play different games.
            </Text>
          </Box>
        </Grid>
      </Box>
      {/* <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={3}
        mt={3}
      >
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Box
              key={game.label}
              border="2px solid"
              borderColor={game.color}
              bg={colors.surfaceAlt}
              p={4}
            >
              <HStack spacing={3}>
                <Box color={game.color}>
                  <Icon size={18} />
                </Box>
                <Text fontSize="13px" fontWeight="800">
                  {game.label}
                </Text>
              </HStack>
            </Box>
          );
        })}
      </Grid> */}
    </StudioSection>
  );
};
export default ArcadePreview;
