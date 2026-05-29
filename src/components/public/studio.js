import React from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const useStudioColors = () => ({
  bg: useColorModeValue("#fafaf8", "#1e1e1e"),
  bgWash: useColorModeValue("#fafaf8", "#1e1e1e"),
  surface: useColorModeValue("#f3f3f0", "#2a2a2a"),
  surfaceSolid: useColorModeValue("#f3f3f0", "#2a2a2a"),
  surfaceAlt: useColorModeValue("#ffffff", "#242424"),
  text: useColorModeValue("#1a1a1a", "#eaeaea"),
  muted: useColorModeValue("#6f6f6a", "#b9b9b4"),
  border: useColorModeValue("#e2e2dd", "#3a3a3a"),
  borderSoft: useColorModeValue("#e8e8e2", "#343434"),
  primary: useColorModeValue("#2c2c2c", "#f5f5f2"),
  primaryDark: useColorModeValue("#1a1a1a", "#ffffff"),
  accent: useColorModeValue("#2c2c2c", "#eaeaea"),
  accentSoft: useColorModeValue("transparent", "transparent"),
  glow: useColorModeValue("rgba(0,0,0,0.04)", "rgba(0,0,0,0.18)"),
  overlay: useColorModeValue("rgba(26,26,26,.48)", "rgba(0,0,0,.72)"),
});

export const StudioPill = ({ children, tone = "primary", ...props }) => {
  const colors = useStudioColors();
  const toneMap = {
    primary: { bg: "transparent", color: colors.text, border: colors.border },
    accent: { bg: colors.surface, color: colors.text, border: colors.border },
    ghost: { bg: "transparent", color: colors.muted, border: colors.borderSoft },
  };
  const selected = toneMap[tone] || toneMap.primary;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      minH="28px"
      px={3}
      border="1px solid"
      borderColor={selected.border}
      borderRadius="0"
      bg={selected.bg}
      color={selected.color}
      fontSize="13px"
      fontWeight="500"
      lineHeight="1"
      {...props}
    >
      {children}
    </Box>
  );
};

export const StudioSection = ({
  id,
  eyebrow,
  title,
  children,
  align = "start",
  maxW = "1180px",
  ...props
}) => {
  const colors = useStudioColors();

  return (
    <Box
      as="section"
      id={id}
      maxW={maxW}
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 14, md: 20 }}
      color={colors.text}
      {...props}
    >
      {(eyebrow || title) && (
        <HStack
          data-studio-heading
          align="end"
          justify={align === "center" ? "center" : "space-between"}
          mb={{ base: 7, md: 10 }}
          gap={5}
          flexWrap="wrap"
        >
          <Box maxW="760px" textAlign={align}>
            {eyebrow && (
              <Text
                fontSize="13px"
                color={colors.muted}
                letterSpacing=".08em"
                textTransform="uppercase"
                mb={2}
              >
                {eyebrow}
              </Text>
            )}
            {title && (
              <Heading
                as="h2"
                fontSize={{ base: "30px", md: "42px" }}
                lineHeight="1.12"
                fontWeight="700"
                letterSpacing="0"
              >
                {title}
              </Heading>
            )}
          </Box>
          <Box
            data-heading-rule
            display={{ base: "none", md: "block" }}
            flex="1"
            h="1px"
            minW="120px"
            bg={colors.border}
            transformOrigin="left center"
          />
        </HStack>
      )}
      {children}
    </Box>
  );
};

export const SplitWords = ({ text, ...props }) => (
  <Box as="span" aria-label={text} {...props}>
    {text.split(" ").map((word, index) => (
      <Box
        as="span"
        className="split-word"
        aria-hidden="true"
        display="inline-block"
        overflow="hidden"
        mr="0.22em"
        key={`${word}-${index}`}
      >
        <Box as="span" className="split-word-inner" display="inline-block">
          {word}
        </Box>
      </Box>
    ))}
  </Box>
);
