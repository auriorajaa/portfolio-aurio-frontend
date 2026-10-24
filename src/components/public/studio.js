// src/components/public/studio.js
// LEGACY ONLY.
// The Lagoon public design was replaced by the Brut "Tumble Blocks"
// language (see src/components/public/brutal.js). This module now
// exists purely for code that is NOT part of the public pages:
// Arcade, Playground, the admin retro theme (retro.js), Login,
// ProtectedRoute and friends. Do not use it in new work.

import React, { useRef } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

// ─────────────────────────────────────────────────────────────
// Lagoon palette (kept so the old Header redirects users to the
// arcade with a sane look; public pages do not touch it).
// ─────────────────────────────────────────────────────────────

export const LAGOON = {
  bg: "#F5FBFB",
  bgWash: "#EAF7F4",
  surface: "#FFFFFF",
  surfaceAlt: "#F2FAF8",
  surfaceTint: "#E3F4F1",
  surfaceDeep: "#D8F0EC",

  text: "#365957",
  heading: "#0B2F2F",
  muted: "#6D8885",

  border: "#D7EAE7",
  borderSoft: "#E7F3F1",
  borderStrong: "#B9DDD7",

  primary: "#0E8C86",
  primaryDark: "#0B4F4C",
  primaryDeep: "#082F2E",
  accent: "#0E8C86",
  accentSoft: "#D2EEEA",

  coral: "#FF6B4A",
  coralDeep: "#C94224",
  coralSoft: "#FFE7E0",
  sun: "#FFC857",
  sunSoft: "#FFF1C9",
  success: "#149E7A",

  white: "#FFFFFF",
  onDark: "#E8F8F5",
  onDarkMuted: "#A6CDC7",
  overlay: "rgba(8,47,46,0.72)",

  glow: "rgba(11,47,47,0.08)",
  shadow: "5px 5px 0 #0B2F2F",
  shadowSoft: "3px 3px 0 #0B2F2F",
  shadowLift: "8px 8px 0 #0B2F2F",

  ink: "#0B2F2F",
  borderInk: "#0B2F2F",

  gradient: "#0B3B39",
  gradientSoft: "#FFFFFF",

  chip: "#E3F4F1",
  chipBorder: "#C8E9E4",
  chipText: "#0B4F4C",
};

export const usePublicColors = () => LAGOON;

// Magnetic hover: pulls a wrapper a few pixels toward the cursor and
// springs back on leave. Fine-pointer devices only.
export const Magnetic = ({ children, pull = 10, ...props }) => {
  const ref = useRef(null);

  const handleMove = (event) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: (dx / rect.width) * pull * 2,
      y: (dy / rect.height) * pull * 2,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
  };

  return (
    <Box
      ref={ref}
      display="inline-block"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// Legacy classic (2015) palette + primitives.
// Kept untouched for arcade/playground and other non-public code.
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
            <Box w="86px" h="6px" mt={3} bg={CLASSIC.heading} />
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
