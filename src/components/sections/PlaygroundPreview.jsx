import React from "react";
import { Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import {
  ArrowRight,
  Braces,
  Search,
  Trophy,
  Type,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { StudioSection, useStudioColors } from "../public/studio";

const items = [
  { label: "JSON Formatter", icon: Braces, note: "Clean structured data" },
  { label: "Text Analyzer", icon: Type, note: "Count words and lines" },
  { label: "Trivia Arena", icon: Trophy, note: "Play a quick quiz" },
];

const PlaygroundPreview = () => {
  const colors = useStudioColors();
  return (
    <StudioSection
      id="playground"
      eyebrow="Try something"
      title="A useful break from scrolling."
      maxW="1180px"
    >
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "minmax(0, 1.1fr) minmax(340px, .9fr)",
        }}
        gap={{ base: 6, lg: 10 }}
        alignItems="stretch"
      >
        <Box
          border="1px solid"
          borderColor={colors.border}
          bg={colors.surfaceAlt}
          p={{ base: 5, md: 7 }}
        >
          <Text
            fontSize={{ base: "28px", md: "42px" }}
            fontWeight="800"
            lineHeight="1.08"
          >
            Small tools for real tasks.
          </Text>
          <Text
            mt={4}
            maxW="560px"
            fontSize={{ base: "15px", md: "16px" }}
            color={colors.muted}
            lineHeight="1.7"
          >
            Format JSON, check text, find a movie, or play a quick quiz.
            Everything runs in the browser.
          </Text>
          <Button
            as={RouterLink}
            to="/playground"
            mt={7}
            variant="studio"
            rightIcon={<ArrowRight size={15} />}
          >
            Open the Playground
          </Button>
        </Box>
        <Box
          border="1px solid"
          borderColor={colors.border}
          bg={colors.surface}
          p={{ base: 4, md: 6 }}
          position="relative"
          overflow="hidden"
        >
          <HStack justify="space-between" mb={5}>
            <HStack spacing={2}>
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing=".08em"
              >
                Pick a tool
              </Text>
            </HStack>
            <Search size={15} />
          </HStack>
          <Box
            border="1px solid"
            borderColor={colors.border}
            bg={colors.surfaceAlt}
            p={4}
            transform="rotate(-2deg)"
          >
            <HStack justify="space-between" mb={4}>
              <HStack spacing={2}>
                <Braces size={16} />
                <Text fontSize="13px" fontWeight="700">
                  JSON Formatter
                </Text>
              </HStack>
              <Text fontSize="11px" color={colors.muted}>
                Ready
              </Text>
            </HStack>
            <Box h="9px" w="86%" bg={colors.border} mb={2} />
            <Box h="9px" w="62%" bg={colors.border} mb={2} />
            <Box h="9px" w="73%" bg={colors.border} />
          </Box>
          <Box
            mt={5}
            border="1px solid"
            borderColor={colors.border}
            bg={colors.surfaceAlt}
            p={4}
            transform="rotate(2deg)"
          >
            <Text fontSize="11px" color={colors.muted}>
              Runs locally
            </Text>
            <Text mt={1} fontSize="14px" fontWeight="700">
              Nothing is uploaded.
            </Text>
          </Box>
        </Box>
      </Grid>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={3}
        mt={3}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Box
              key={item.label}
              border="1px solid"
              borderColor={colors.border}
              bg={colors.surfaceAlt}
              p={4}
            >
              <HStack spacing={3}>
                <Icon size={17} />
                <Box>
                  <Text fontSize="13px" fontWeight="700">
                    {item.label}
                  </Text>
                  <Text mt={1} fontSize="12px" color={colors.muted}>
                    {item.note}
                  </Text>
                </Box>
              </HStack>
            </Box>
          );
        })}
      </Grid>
    </StudioSection>
  );
};

export default PlaygroundPreview;
