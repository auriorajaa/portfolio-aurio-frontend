import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

// ─────────────────────────────────────────────────────────────
// Lagoon public design language.
// Cool, sunlit coastal palette: mist + white surfaces, deep teal
// ink, lagoon teal, coral and sun-yellow accents. No cream/pink.
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

// Adds the scoped public font/style hooks to <body> so portaled UI
// (modals, toasts) matches the public site without touching admin.
export const PublicShell = ({ children, className = "", ...props }) => {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.add("public-body");

    return () => document.body.classList.remove("public-body");
  }, []);

  return (
    <Box
      className={`public-shell ${className}`.trim()}
      bg={LAGOON.bg}
      color={LAGOON.text}
      minH="100vh"
      position="relative"
      {...props}
    >
      <SiteCursor />
      {children}
    </Box>
  );
};

const PILL_TONES = {
  aqua: {
    bg: LAGOON.surfaceTint,
    border: LAGOON.chipBorder,
    color: LAGOON.chipText,
  },
  coral: {
    bg: LAGOON.coralSoft,
    border: "#FFD2C7",
    color: "#9C3420",
  },
  sun: {
    bg: LAGOON.sunSoft,
    border: "#F5DE9F",
    color: "#775400",
  },
  outline: {
    bg: "#FFFFFF",
    border: LAGOON.border,
    color: LAGOON.text,
  },
  dark: {
    bg: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.22)",
    color: LAGOON.onDark,
  },
};

export const PublicPill = ({
  children,
  tone = "aqua",
  dot = false,
  dotColor,
  ...props
}) => {
  const palette = PILL_TONES[tone] || PILL_TONES.aqua;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap="7px"
      px="12px"
      py="5px"
      border="1px solid"
      borderColor={palette.border}
      bg={palette.bg}
      color={palette.color}
      borderRadius="999px"
      fontSize="13px"
      fontWeight="600"
      lineHeight="1.45"
      whiteSpace="nowrap"
      {...props}
    >
      {dot && (
        <Box
          as="span"
          w="7px"
          h="7px"
          borderRadius="full"
          bg={dotColor || LAGOON.primary}
          flexShrink={0}
        />
      )}
      {children}
    </Box>
  );
};

export const LagoonSection = ({
  id,
  eyebrow,
  title,
  description,
  tone = "white",
  maxW = "1200px",
  headerAside,
  children,
  ...props
}) => {
  const sectionRef = useGsapReveal({ selector: "[data-reveal]" });
  const isWash = tone === "wash";

  return (
    <Box
      as="section"
      id={id}
      ref={sectionRef}
      position="relative"
      overflow="hidden"
      bg={isWash ? LAGOON.bgWash : LAGOON.surface}
      py={{ base: 16, md: 24 }}
      {...props}
    >
      <Box
        position="relative"
        maxW={maxW}
        mx="auto"
        px={{ base: 5, md: 8, lg: 10 }}
      >
        {(eyebrow || title || description) && (
          <Flex
            data-reveal
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "flex-end" }}
            justify="space-between"
            gap={{ base: 6, md: 10 }}
            mb={{ base: 10, md: 14 }}
          >
            <Box maxW="780px">
              {eyebrow && (
                <Text
                  className="public-mono"
                  fontSize="13px"
                  fontWeight="500"
                  letterSpacing=".04em"
                  color={LAGOON.coralDeep}
                  mb={4}
                >
                  {eyebrow}
                </Text>
              )}
              {title && (
                <Heading
                  as="h2"
                  fontFamily="heading"
                  fontSize={{ base: "36px", md: "52px" }}
                  fontWeight="700"
                  lineHeight="1.05"
                  letterSpacing="-.035em"
                  color={LAGOON.heading}
                >
                  {title}
                </Heading>
              )}
              {description && (
                <Text
                  mt={5}
                  fontSize={{ base: "16px", md: "18px" }}
                  lineHeight="1.75"
                  color={LAGOON.muted}
                  maxW="640px"
                >
                  {description}
                </Text>
              )}
            </Box>
            {headerAside && <Box flexShrink={0}>{headerAside}</Box>}
          </Flex>
        )}

        {children}
      </Box>
    </Box>
  );
};

export const Marquee = ({
  items = [],
  speed = 34,
  color = LAGOON.heading,
  bg = "transparent",
  ...props
}) => {
  const row = (copy) => (
    <Flex
      key={copy}
      align="center"
      gap={{ base: 6, md: 9 }}
      pr={{ base: 6, md: 9 }}
      flexShrink={0}
      aria-hidden={copy === "b"}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${copy}-${item}-${index}`}>
          <Text
            as="span"
            fontFamily="heading"
            fontSize={{ base: "18px", md: "22px" }}
            fontWeight="600"
            letterSpacing="-.01em"
            color="currentColor"
            whiteSpace="nowrap"
          >
            {item}
          </Text>
          <DoodleAsterisk size={15} flexShrink={0} />
        </React.Fragment>
      ))}
    </Flex>
  );

  return (
    <Box
      overflow="hidden"
      position="relative"
      py={4}
      borderY="1px solid"
      borderColor={LAGOON.border}
      bg={bg}
      color={color}
      {...props}
    >
      <Flex
        className="marquee-track"
        w="max-content"
        align="center"
        style={{ animationDuration: `${speed}s` }}
      >
        {row("a")}
        {row("b")}
      </Flex>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// Hand-drawn doodles. Plain inline SVG with a wobbly ink stroke,
// like something sketched in the margin of a sketchbook.
// ─────────────────────────────────────────────────────────────
// Hand-drawn doodles. Plain inline SVG with a wobbly ink stroke,
// like something sketched in the margin of a sketchbook.
// ─────────────────────────────────────────────────────────────

export const DoodleSun = ({ size = 72, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    flexShrink={0}
    {...props}
  >
    <circle cx="32" cy="32" r="13" fill={LAGOON.sun} stroke={LAGOON.ink} strokeWidth="2.5" />
    <path
      d="M32 12 V5 M32 52 V59 M12 32 H5 M52 32 H59 M18.2 18.2 L13.4 13.4 M45.8 18.2 L50.6 13.4 M18.2 45.8 L13.4 50.4 M45.8 45.8 L50.6 50.6"
      stroke={LAGOON.ink}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Box>
);

export const DoodleSquiggle = ({ width = 130, color = LAGOON.coral, style, className, ...props }) => (
  <Box
    as="svg"
    width={width}
    height="14"
    viewBox="0 0 130 14"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M3 9 C 15 3, 27 11, 40 7 S 66 4, 78 8 S 108 10, 127 5"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  </Box>
);

export const DoodleAsterisk = ({ size = 20, color = LAGOON.coral, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    flexShrink={0}
    {...props}
  >
    <path
      d="M12 3 V21 M4.2 7.5 L19.8 16.5 M19.8 7.5 L4.2 16.5"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </Box>
);

export const DoodleStar = ({ size = 26, color = LAGOON.sun, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    flexShrink={0}
    {...props}
  >
    <path
      d="M13 2.5 C 13.8 8.2, 15.6 10.6, 23.5 13 C 15.6 15.4, 13.8 17.8, 13 23.5 C 12.2 17.8, 10.4 15.4, 2.5 13 C 10.4 10.6, 12.2 8.2, 13 2.5 Z"
      fill={color}
      stroke={LAGOON.ink}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Box>
);

export const DoodleArrow = ({ width = 72, style, className, ...props }) => (
  <Box
    as="svg"
    width={width}
    height="46"
    viewBox="0 0 72 46"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M5 5 C 12 28, 30 40, 62 33"
      stroke={LAGOON.ink}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M53 26.5 L62.5 32.8 L55.5 40.5"
      stroke={LAGOON.ink}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
);

export const DoodleUnderline = ({ width = "100%", color = LAGOON.coral, style, className, ...props }) => (
  <Box
    as="svg"
    width={width}
    height="12"
    viewBox="0 0 160 12"
    fill="none"
    preserveAspectRatio="none"
    style={style}
    className={className}
    aria-hidden="true"
    display="block"
    {...props}
  >
    <path
      d="M3 8 C 30 3, 60 10, 90 6 S 138 4, 157 7"
      stroke={color}
      strokeWidth="3.4"
      strokeLinecap="round"
    />
  </Box>
);

// ─────────────────────────────────────────────────────────────
// Little helpers for the interactive layer.
// ─────────────────────────────────────────────────────────────

// Paper boat that floats on the footer waves.
export const DoodleBoat = ({ size = 46, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * 0.8}
    viewBox="0 0 50 40"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 24 C 8 32, 14 35.5, 23 35.5 C 32 35.5, 38 32, 40 24 Z" fill={LAGOON.coral} stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M24 23 V7" stroke={LAGOON.ink} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M26 8 C 34 10, 36 16, 34.5 21 L26 21 Z" fill={LAGOON.sun} stroke={LAGOON.ink} strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 12 C 15 14, 14 18, 15.5 21 L22 21 Z" fill="#FFFFFF" stroke={LAGOON.ink} strokeWidth="2" strokeLinejoin="round" />
  </Box>
);

export const DoodleFish = ({ size = 26, color = "#8ADCD2", style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (20 / 30)}
    viewBox="0 0 30 20"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3 10 C 9 4.5, 18 4, 23 10 C 18 16, 9 15.5, 3 10 Z" fill={color} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M23 10 L28.5 5.5 L28.5 14.5 Z" fill={color} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="8.4" cy="9" r="1.5" fill={LAGOON.ink} />
  </Box>
);


// ── More cartoon props ─────────────────────────────────────────
// A growing cast of hand-drawn friends for empty corners, captions
// and section headers. Same rules every time: thick ink, flat
// fill, round joins — like the rest of the set.

export const DoodleCoffee = ({ size = 40, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (44 / 46)}
    viewBox="0 0 46 44"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M13 10 C 10.5 7, 15 5, 13 2" stroke={LAGOON.coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M21 10 C 18.5 7, 23 5, 21 2" stroke={LAGOON.coral} strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="16" width="24" height="22" rx="5" fill="#E3F4F1" stroke={LAGOON.ink} strokeWidth="2.2" />
    <path d="M32 21 C 40 20, 40 30, 32 29" stroke={LAGOON.ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="16" cy="25" r="1.7" fill={LAGOON.ink} />
    <circle cx="25" cy="25" r="1.7" fill={LAGOON.ink} />
    <path d="M17 30.5 C 19 33, 23 33, 25 30.5" stroke={LAGOON.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </Box>
);

export const DoodleLightning = ({ size = 26, color = LAGOON.sun, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (44 / 30)}
    viewBox="0 0 30 44"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M17 2 L6 24 H14 L11 42 L25 18 H17.5 Z" fill={color} stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
  </Box>
);

export const DoodleHeart = ({ size = 32, color = LAGOON.coral, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (36 / 40)}
    viewBox="0 0 40 36"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 33 C 8 24, 2 16, 2 10.5 C 2 5, 6.5 2, 11 2 C 15 2, 18.4 4.6, 20 8 C 21.6 4.6, 25 2, 29 2 C 33.5 2, 38 5, 38 10.5 C 38 16, 32 24, 20 33 Z" fill={color} stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
  </Box>
);

export const DoodleCloudFace = ({ size = 64, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (40 / 64)}
    viewBox="0 0 64 40"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M10 33 C 2.5 33, 2 22, 9.5 21 C 6.5 12, 16 6.5, 22.5 10.5 C 25 3, 38 2.5, 41 10.5 C 49 5.5, 57 12, 53.5 20 C 61.5 21, 61.5 33, 54 33 Z" fill="#FFFFFF" stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="26" cy="20.5" r="1.7" fill={LAGOON.ink} />
    <circle cx="38" cy="20.5" r="1.7" fill={LAGOON.ink} />
    <path d="M28 25.5 C 30.4 28.4, 33.6 28.4, 36 25.5" stroke={LAGOON.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="24.5" r="2.6" fill="rgba(255,107,74,0.5)" />
    <circle cx="44" cy="24.5" r="2.6" fill="rgba(255,107,74,0.5)" />
  </Box>
);

export const DoodlePaperPlane = ({ size = 54, color = "#FFFFFF", style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (44 / 60)}
    viewBox="0 0 60 44"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M2 36 H8 M9 40 H14" stroke={LAGOON.coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M4 22 L56 6 L30 30 Z" fill={color} stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M30 30 L56 6 L37 35 Z" fill="#D8F0EC" stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
  </Box>
);

export const DoodleRocket = ({ size = 34, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (46 / 34)}
    viewBox="0 0 34 46"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M17 2 C 23 8, 25 16, 25 24 H9 C 9 16, 11 8, 17 2 Z" fill="#FFFFFF" stroke={LAGOON.ink} strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="17" cy="14" r="3.2" fill={LAGOON.sun} stroke={LAGOON.ink} strokeWidth="1.8" />
    <path d="M9 24 L3.5 33 L9.5 31.5 Z" fill={LAGOON.coral} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M25 24 L30.5 33 L24.5 31.5 Z" fill={LAGOON.coral} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M13 30.5 C 12.5 34, 14 38.5, 17 41 C 20 38.5, 21.5 34, 21 30.5 Z" fill={LAGOON.sun} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
  </Box>
);

// Washi tape: a translucent strip of tape to "stick" cards to the
// page. Pure HTML/CSS so it can stretch to any width.
export const DoodleTape = ({ w = 92, h = 26, color = "rgba(255,107,74,0.8)", rotation = -4, style, className, ...props }) => (
  <Box
    aria-hidden="true"
    position="absolute"
    w={w}
    h={h}
    borderRadius="2px"
    boxShadow="1px 2px 2px rgba(11,47,47,0.12)"
    backgroundImage={`repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0 7px, rgba(255,255,255,0) 7px 14px), ${color}`}
    style={{ transform: `rotate(${rotation}deg)`, ...style }}
    className={className}
    {...props}
  />
);

// A little duck, floating idle somewhere on the page.
export const DoodleDuck = ({ size = 38, style, className, ...props }) => (
  <Box
    as="svg"
    width={size}
    height={size * (36 / 40)}
    viewBox="0 0 40 36"
    fill="none"
    style={style}
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M7.4 8.6 L1.6 10.4 L7.4 12.2 Z" fill={LAGOON.coralDeep} stroke={LAGOON.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <ellipse cx="18" cy="22" rx="12.5" ry="9.5" fill="#FFD34D" stroke={LAGOON.ink} strokeWidth="2.2" />
    <circle cx="12.5" cy="10" r="6.2" fill="#FFD34D" stroke={LAGOON.ink} strokeWidth="2.2" />
    <circle cx="11.2" cy="8.2" r="1.4" fill={LAGOON.ink} />
    <path d="M10 14 C 10 15, 11.8 15, 11.8 14" stroke={LAGOON.ink} strokeWidth="1.4" fill="none" />
    <path d="M16.5 20 C 22.5 18.6, 26 22.6, 21 26" stroke={LAGOON.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M6 33 Q 9 30.5 12 33 T 18 33 T 24 33 T 30 33" stroke={LAGOON.primary} strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </Box>
);

// Cursor: a doodle hand flashing the peace sign (two raised
// fingers, fist, coral sleeve) - unmistakably friendly. The hotspot
// sits between the two fingertips. Buttons get a boop: the hand
// squashes and springs back. Text fields keep the native caret.
// Desktop only, disabled for reduced motion, unmounts with
// PublicShell so the admin app keeps its native cursor.
export const SiteCursor = () => {
  const handRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return undefined;

    const hand = handRef.current;
    if (!hand) return undefined;

    document.documentElement.classList.add("cursor-fancy");

    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      gsap.set(hand, { x, y });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!hand.dataset.shown) {
        hand.dataset.shown = "1";
        gsap.set(hand, { x, y });
        gsap.to(hand, { opacity: 1, duration: 0.25, ease: "back.out(1.6)" });
      }
      queue();
    };

    const over = (event) => {
      const hit = event.target.closest(
        "a, button, [role='button'], label, summary, [data-cursor='grow']"
      );
      const text = event.target.closest("input, textarea, select, [contenteditable='true']");
      if (text) {
        gsap.to(hand, { scale: 0.5, opacity: 0.25, duration: 0.25, overwrite: "auto" });
      } else if (hit) {
        // Spread the fingers a little wider when offering.
        gsap.to(hand, { scale: 1.18, rotate: 8, opacity: 1, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
      } else {
        gsap.to(hand, { scale: 1, rotate: 0, opacity: 1, duration: 0.3, overwrite: "auto" });
      }
    };

    const press = () => {
      gsap.to(hand, { scale: 0.78, rotate: -6, duration: 0.14, overwrite: "auto" });
    };
    const release = () => {
      gsap.to(hand, { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(2.4)", overwrite: "auto" });
    };
    const hide = () => gsap.to(hand, { opacity: 0, duration: 0.2 });
    const show = () => {
      if (!hand.dataset.shown) return;
      gsap.to(hand, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      document.documentElement.classList.remove("cursor-fancy");
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      gsap.killTweensOf(hand);
    };
  }, []);

  return (
    <Box
      ref={handRef}
      aria-hidden="true"
      position="fixed"
      top="0"
      left="0"
      w="36px"
      ml="-13px"
      mt="-2px"
      opacity={0}
      pointerEvents="none"
      zIndex={2501}
      willChange="transform"
    >
      {/* Offset sticker shadow behind the fist */}
      <Box aria-hidden="true" position="absolute" top="35px" left="9px" zIndex={0}>
        <svg width="30" height="34" viewBox="0 0 30 36" fill="none">
          <rect x="2.4" y="12" width="19.5" height="14.5" rx="7" fill="rgba(11,47,47,0.26)" />
        </svg>
      </Box>
      <svg className="cursor-hand" width="34" height="40.4" viewBox="0 0 32 38" fill="none">
        {/* Two raised fingers, leaning apart: peace, never anything
            ruder - the lean keeps them reading as a friendly V */}
        <rect
          x="5.6"
          y="3.4"
          width="6.2"
          height="15.4"
          rx="3.1"
          transform="rotate(-6 8.7 11)"
          fill="#FFFFFF"
          stroke="#0B2F2F"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <rect
          x="13.6"
          y="1.6"
          width="6.2"
          height="17.2"
          rx="3.1"
          transform="rotate(2.5 16.7 10.2)"
          fill="#FFFFFF"
          stroke="#0B2F2F"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Fist */}
        <rect x="4.2" y="13.6" width="19.4" height="14" rx="7" fill="#FFFFFF" stroke="#0B2F2F" strokeWidth="1.9" strokeLinejoin="round" />
        {/* Thumb curve */}
        <path d="M5 18.4 C 6 17.2, 7.8 17.4, 8.3 18.8 C 8.6 19.8, 7.7 20.6, 6.8 20.3" stroke="#0B2F2F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* Knuckle lines */}
        <path d="M15.8 15 V18 M19.8 15.6 V18.6" stroke="#0B2F2F" strokeWidth="1.5" strokeLinecap="round" />
        {/* Sleeve */}
        <rect x="6.2" y="27" width="14" height="6.6" rx="2.2" fill={LAGOON.coralDeep} stroke="#0B2F2F" strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    </Box>
  );
};

// Magnetic attraction for buttons: the element leans toward the
// pointer while hovered, springs back elastically on exit.
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
