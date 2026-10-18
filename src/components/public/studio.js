import React from "react";
import { Box, Heading } from "@chakra-ui/react";

// ─────────────────────────────────────────────────────────────
// Classic campaign-era (2015) light palette.
// Navy header/footer bands, light-blue section tints, blue accents.
// Fixed values — the public site is light-only on purpose.
// Kept as a plain object so every consumer of useStudioColors()
// keeps working (arcade / playground / misc pages included).
// ─────────────────────────────────────────────────────────────

const CLASSIC = {
  bg: "#ffffff",
  bgWash: "#eef4fb",
  band: "#eef4fb",
  surface: "#f2f6fb",
  surfaceSolid: "#e8eff7",
  surfaceAlt: "#f8fafd",
  text: "#3b444d",
  heading: "#123a63",
  muted: "#68788a",
  border: "#d4dfea",
  borderSoft: "#e4ecf4",
  primary: "#1f5fa9",
  primaryDark: "#17497f",
  accent: "#1f5fa9",
  accentSoft: "#dbe9f8",
  glow: "rgba(18,58,99,0.08)",
  overlay: "rgba(9,24,42,0.65)",
  navy: "#123a63",
  navyDark: "#0d2b4a",
  heroBg: "#1c4f8a",
  onNavy: "#ffffff",
  onNavyMuted: "#b9cde4",
  white: "#ffffff",
  chipBlue: "#eaf2fb",
  chipBlueBorder: "#9fc0e4",
  chipBlueText: "#17497f",
  navyGradient: "linear-gradient(180deg, #1d5389 0%, #123a63 100%)",
  navyPanel: "linear-gradient(180deg, #1f5fae 0%, #123a63 100%)",
};

export const useStudioColors = () => CLASSIC;

// Small light-blue tag/chip. `tone` is accepted for compatibility.
export const StudioPill = ({ children, tone = "primary", ...props }) => {
  void tone;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="10px"
      py="4px"
      border="1px solid"
      borderColor={CLASSIC.border}
      borderRadius="3px"
      bg="linear-gradient(180deg, #ffffff 0%, #edf3fa 100%)"
      boxShadow="inset 0 1px 0 #ffffff, 0 1px 1px rgba(18,58,99,0.06)"
      color="#34506e"
      fontSize="14px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </Box>
  );
};

// Standard page section: boxed slab with side margins, gaps between
// sections, soft shadow. `band` paints the light-blue variant.
// `watermark` accepts an image URL rendered as a faded backdrop on the
// right side of the slab (ignored by screen readers).
export const StudioSection = ({
  id,
  eyebrow,
  title,
  children,
  band = false,
  maxW = "1400px",
  watermark,
  ...props
}) => {
  void eyebrow;

  return (
    <Box
      as="section"
      id={id}
      position="relative"
      overflow="hidden"
      bg={band ? CLASSIC.band : "#ffffff"}
      mx={{ base: "12px", md: "28px" }}
      my={{ base: "14px", md: "26px" }}
      border="1px solid"
      borderColor={band ? "#bfd3e8" : "#c3d3e4"}
      boxShadow="0 3px 12px rgba(18,58,99,0.1)"
      {...props}
    >
      {watermark && (
        <Box
          position="absolute"
          top="0"
          bottom="0"
          right="0"
          w={{ base: "60%", md: "42%" }}
          pointerEvents="none"
          aria-hidden="true"
        >
          <img
            src={watermark}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.09,
            }}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient={
              band
                ? "linear-gradient(90deg, #eef4fb 0%, rgba(238,244,251,0.5) 55%, rgba(238,244,251,0) 100%)"
                : "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0) 100%)"
            }
          />
        </Box>
      )}

      <Box
        position="relative"
        zIndex={1}
        maxW={maxW}
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 14, md: 20 }}
      >
        {title && (
          <Box
            mb={{ base: 8, md: 10 }}
            pb={4}
            borderBottom="1px solid"
            borderColor={band ? "#c9dbee" : CLASSIC.border}
          >
            <Heading
              as="h2"
              fontSize={{ base: "29px", md: "38px" }}
              fontWeight="700"
              lineHeight="1.25"
              color={CLASSIC.heading}
              letterSpacing="normal"
            >
              {title}
            </Heading>
            <Box
              w="86px"
              h="6px"
              mt={3}
              bg={CLASSIC.heading}
            />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
};

// Plain text renderer (no split/animation). Kept for API compatibility.
export const SplitWords = ({ text, ...props }) => (
  <Box as="span" {...props}>
    {text}
  </Box>
);
