import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

// ─────────────────────────────────────────────────────────────
// TUMBLE BLOCKS — the public design language.
// Modern neo-brutalism with a toybox spin: paper background,
// thick ink outlines, hard offset shadows (no blur!), chunky
// sticker shapes and playful micro-copy.
// ─────────────────────────────────────────────────────────────

export const BRUT = {
  // Paper + surfaces
  bg: "#FCF7EF",
  bgWash: "#FFF6E3",
  surface: "#FFFFFF",
  surfaceSoft: "#FFFBF2",

  // Ink
  ink: "#17181C",
  inkSoft: "#3A3B44",
  heading: "#17181C",
  text: "#3D3E46",
  muted: "#6E7079",

  // Brand accents
  primary: "#04A777",
  primaryDeep: "#027A57",
  primarySoft: "#CFF3E6",

  yellow: "#FFD23F",
  yellowSoft: "#FFF1BF",

  blue: "#38B6FF",
  blueDeep: "#0E74C7",
  blueSoft: "#DFF1FF",

  coral: "#FF6B6B",
  coralDeep: "#E14646",
  coralSoft: "#FFE4E4",

  lime: "#B4E33D",
  limeSoft: "#EFF9D4",
  limeDeep: "#5F7A00",

  // Hard shadows (the brutalist signature)
  shadowXs: "2px 2px 0 #17181C",
  shadow: "4px 4px 0 #17181C",
  shadowLg: "8px 8px 0 #17181C",

  onDark: "#FFFDF6",
  onDarkMuted: "rgba(255,253,246,0.62)",
  overlay: "rgba(23,24,28,0.82)",

  borderDashed: "rgba(23,24,28,0.35)",
};

export const usePublicColors = () => BRUT;

// Toggles the scoped public font/style hooks on <body> so portaled
// UI (modals, toasts) matches the public site without touching admin.
export const PublicShell = ({ children, className = "", ...props }) => {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.body.classList.add("public-body");

    return () => document.body.classList.remove("public-body");
  }, []);

  return (
    <Box
      className={`public-shell ${className}`.trim()}
      bg={BRUT.bg}
      color={BRUT.text}
      minH="100vh"
      position="relative"
      {...props}
    >
      <SiteCursor />
      {children}
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// Brut section: full-bleed row with a numbered sticker header,
// chunky title, dashed separator and scroll reveal.
// tone: "paper" (warm base) | "white" (bright slab)
// ─────────────────────────────────────────────────────────────
const TONES = {
  paper: BRUT.bg,
  white: "#FFFFFF",
};

export const BrutSection = ({
  id,
  number,
  kicker,
  title,
  description,
  tone = "paper",
  maxW = "1200px",
  headerAside,
  children,
  ...props
}) => {
  const sectionRef = useGsapReveal({ selector: "[data-reveal]" });

  return (
    <Box
      as="section"
      id={id}
      ref={sectionRef}
      position="relative"
      overflow="hidden"
      bg={TONES[tone] || BRUT.bg}
      py={{ base: 12, md: 20 }}
      {...props}
    >
      <Box
        position="relative"
        maxW={maxW}
        mx="auto"
        px={{ base: 5, md: 8, lg: 10 }}
      >
        {(number || kicker || title || description) && (
          <Flex
            data-reveal
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "flex-end" }}
            justify="space-between"
            gap={{ base: 5, md: 10 }}
            mb={{ base: 9, md: 12 }}
          >
            <Box maxW="760px">
              <Flex align="center" gap={3} mb={4} flexWrap="wrap">
                {number && (
                  <Flex
                    align="center"
                    justify="center"
                    bg={BRUT.yellow}
                    border="2px solid"
                    borderColor={BRUT.ink}
                    px="10px"
                    py="3px"
                    borderRadius="6px"
                    boxShadow={BRUT.shadowXs}
                  >
                    <Text
                      fontFamily="bungee"
                      fontSize="13px"
                      lineHeight="1.2"
                      color={BRUT.ink}
                    >
                      {number}
                    </Text>
                  </Flex>
                )}
                {kicker && (
                  <Text
                    fontFamily="spaceMono"
                    fontSize="12px"
                    fontWeight="700"
                    letterSpacing=".18em"
                    textTransform="uppercase"
                    color={BRUT.muted}
                  >
                    {kicker}
                  </Text>
                )}
              </Flex>
              {title && (
                <Heading
                  as="h2"
                  fontFamily="heading"
                  fontSize={{ base: "38px", md: "54px" }}
                  fontWeight="700"
                  lineHeight="1.06"
                  letterSpacing="-.02em"
                  color={BRUT.heading}
                  m={0}
                >
                  {title}
                </Heading>
              )}
              {description && (
                <Text
                  mt={4}
                  fontSize={{ base: "16px", md: "17px" }}
                  lineHeight="1.8"
                  color={BRUT.muted}
                  maxW="620px"
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

// A chunky square-ish tag: Space Mono uppercase label on tinted
// paper with a hard mini shadow. Tones map to the accent orbit.
const TAG_TONES = {
  mint: { bg: BRUT.primarySoft, color: BRUT.ink },
  yellow: { bg: BRUT.yellowSoft, color: BRUT.ink },
  blue: { bg: BRUT.blueSoft, color: BRUT.ink },
  coral: { bg: BRUT.coralSoft, color: BRUT.ink },
  lime: { bg: BRUT.limeSoft, color: BRUT.ink },
  paper: { bg: BRUT.surfaceSoft, color: BRUT.ink },
  dark: { bg: BRUT.ink, color: BRUT.onDark },
};

export const BrutTag = ({
  children,
  tone = "mint",
  rotate = 0,
  dot = false,
  dotColor,
  ...props
}) => {
  const palette = TAG_TONES[tone] || TAG_TONES.mint;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap="6px"
      px="10px"
      py="4px"
      border="1.5px solid"
      borderColor={BRUT.ink}
      bg={palette.bg}
      color={palette.color}
      borderRadius="4px"
      fontFamily="spaceMono"
      fontSize="12px"
      fontWeight="700"
      letterSpacing=".08em"
      textTransform="uppercase"
      lineHeight="1.5"
      whiteSpace="nowrap"
      transform={rotate ? `rotate(${rotate}deg)` : undefined}
      {...props}
    >
      {dot && (
        <Box
          as="span"
          w="7px"
          h="7px"
          borderRadius="2px"
          bg={dotColor || BRUT.primary}
          flexShrink={0}
        />
      )}
      {children}
    </Box>
  );
};

// Marquee: a bold band where chunky words parade behind a
// star-shaped separator, pausing politely under the cursor.
export const Marquee = ({
  items = [],
  speed = 34,
  bg = BRUT.primary,
  color = "#FFFFFF",
  ...props
}) => {
  const row = (copy) => (
    <Flex
      key={copy}
      align="center"
      gap={{ base: 5, md: 8 }}
      pr={{ base: 5, md: 8 }}
      flexShrink={0}
      aria-hidden={copy === "b"}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${copy}-${item}-${index}`}>
          <Text
            as="span"
            fontFamily="bungee"
            fontSize={{ base: "16px", md: "19px" }}
            lineHeight="1.4"
            color="currentColor"
            whiteSpace="nowrap"
          >
            {item}
          </Text>
          <DoodleAsterisk size={14} color={BRUT.yellow} flexShrink={0} />
        </React.Fragment>
      ))}
    </Flex>
  );

  return (
    <Box
      overflow="hidden"
      position="relative"
      py={{ base: 3, md: 4 }}
      borderTop="2px solid"
      borderBottom="2px solid"
      borderColor={BRUT.ink}
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
// Sticker shapes: flat geometry with a thick ink outline —
// stickers peeled off a comic sheet and pressed onto the page.
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
    <path
      d="M32 4 L35.4 12.2 L43.4 8.6 L41.9 17.3 L50.8 16.8 L46.3 24 L55 26.5 L48.2 31.5 L55.3 36.7 L46.6 38.5 L49.2 47 L40.3 44.7 L40 53.6 L32.5 48.9 L28.3 56.8 L24.4 49.4 L17 54.4 L17.4 45.5 L8.6 48.2 L11.5 40 L3 36.8 L10.4 32 L4 26.2 L12.3 24.2 L8.9 15.9 L17.6 18 L17 9.1 L24.6 13.6 Z"
      fill={BRUT.yellow}
      stroke={BRUT.ink}
      strokeWidth="2.4"
      strokeLinejoin="round"
      transform="translate(32 32) scale(0.52) translate(-32 -32)"
    />
    <circle cx="32" cy="32" r="11" fill="#FFF1BF" stroke={BRUT.ink} strokeWidth="2.4" />
    <circle cx="28.6" cy="30.6" r="1.5" fill={BRUT.ink} />
    <circle cx="35.4" cy="30.6" r="1.5" fill={BRUT.ink} />
    <path d="M29 35 C 30.6 36.6, 33.4 36.6, 35 35" stroke={BRUT.ink} strokeWidth="1.7" strokeLinecap="round" fill="none" />
  </Box>
);

export const DoodleSquiggle = ({ width = 130, color = BRUT.coral, style, className, ...props }) => (
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

export const DoodleAsterisk = ({ size = 20, color = BRUT.coral, style, className, ...props }) => (
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
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </Box>
);

export const DoodleStar = ({ size = 26, color = BRUT.yellow, style, className, ...props }) => (
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
      stroke={BRUT.ink}
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
      stroke={BRUT.ink}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M52 25.5 L62.5 32.8 L55 41.5"
      stroke={BRUT.ink}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
);

export const DoodleUnderline = ({ width = "100%", color = BRUT.yellow, style, className, ...props }) => (
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
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </Box>
);

export const DoodleLightning = ({ size = 26, color = BRUT.yellow, style, className, ...props }) => (
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
    <path d="M17 2 L6 24 H14 L11 42 L25 18 H17.5 Z" fill={color} stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
  </Box>
);

export const DoodleHeart = ({ size = 32, color = BRUT.coral, style, className, ...props }) => (
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
    <path d="M20 33 C 8 24, 2 16, 2 10.5 C 2 5, 6.5 2, 11 2 C 15 2, 18.4 4.6, 20 8 C 21.6 4.6, 25 2, 29 2 C 33.5 2, 38 5, 38 10.5 C 38 16, 32 24, 20 33 Z" fill={color} stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
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
    <path d="M10 33 C 2.5 33, 2 22, 9.5 21 C 6.5 12, 16 6.5, 22.5 10.5 C 25 3, 38 2.5, 41 10.5 C 49 5.5, 57 12, 53.5 20 C 61.5 21, 61.5 33, 54 33 Z" fill="#FFFFFF" stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
    <circle cx="26" cy="20.5" r="1.7" fill={BRUT.ink} />
    <circle cx="38" cy="20.5" r="1.7" fill={BRUT.ink} />
    <path d="M28 25.5 C 30.4 28.4, 33.6 28.4, 36 25.5" stroke={BRUT.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="24.5" r="2.6" fill="rgba(255,180,194,0.8)" />
    <circle cx="44" cy="24.5" r="2.6" fill="rgba(255,180,194,0.8)" />
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
    <path d="M17 2 C 23 8, 25 16, 25 24 H9 C 9 16, 11 8, 17 2 Z" fill={BRUT.primary} stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
    <circle cx="17" cy="14" r="3.2" fill={BRUT.yellow} stroke={BRUT.ink} strokeWidth="1.9" />
    <path d="M9 24 L3.5 33 L9.5 31.5 Z" fill={BRUT.coral} stroke={BRUT.ink} strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M25 24 L30.5 33 L24.5 31.5 Z" fill={BRUT.coral} stroke={BRUT.ink} strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M13 30.5 C 12.5 34, 14 38.5, 17 41 C 20 38.5, 21.5 34, 21 30.5 Z" fill={BRUT.yellow} stroke={BRUT.ink} strokeWidth="1.9" strokeLinejoin="round" />
  </Box>
);

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
    <path d="M13 10 C 10.5 7, 15 5, 13 2" stroke={BRUT.coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M21 10 C 18.5 7, 23 5, 21 2" stroke={BRUT.coral} strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="16" width="24" height="22" rx="4" fill="#FFFFFF" stroke={BRUT.ink} strokeWidth="2.4" />
    <path d="M32 21 C 40 20, 40 30, 32 29" stroke={BRUT.ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <circle cx="16" cy="25" r="1.7" fill={BRUT.ink} />
    <circle cx="25" cy="25" r="1.7" fill={BRUT.ink} />
    <path d="M17 30.5 C 19 33, 23 33, 25 30.5" stroke={BRUT.ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </Box>
);

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
    <path d="M7.4 8.6 L1.6 10.4 L7.4 12.2 Z" fill={BRUT.coralDeep} stroke={BRUT.ink} strokeWidth="1.9" strokeLinejoin="round" />
    <ellipse cx="18" cy="22" rx="12.5" ry="9.5" fill={BRUT.yellow} stroke={BRUT.ink} strokeWidth="2.4" />
    <circle cx="12.5" cy="10" r="6.2" fill={BRUT.yellow} stroke={BRUT.ink} strokeWidth="2.4" />
    <circle cx="11.2" cy="8.2" r="1.4" fill={BRUT.ink} />
    <path d="M10 14 C 10 15, 11.8 15, 11.8 14" stroke={BRUT.ink} strokeWidth="1.4" fill="none" />
    <path d="M16.5 20 C 22.5 18.6, 26 22.6, 21 26" stroke={BRUT.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M6 33 Q 9 30.5 12 33 T 18 33 T 24 33 T 30 33" stroke={BRUT.primary} strokeWidth="1.8" strokeLinecap="round" fill="none" />
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
    <path d="M2 36 H8 M9 40 H14" stroke={BRUT.coral} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M4 22 L56 6 L30 30 Z" fill={color} stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M30 30 L56 6 L37 35 Z" fill={BRUT.blueSoft} stroke={BRUT.ink} strokeWidth="2.4" strokeLinejoin="round" />
  </Box>
);

// Comic-book burst: a jagged speech-bubble explosion. Loves 404s.
export const DoodleBoom = ({ size = 64, style, className, children, ...props }) => (
  <Box
    position="relative"
    display="inline-flex"
    style={style}
    className={className}
    {...props}
  >
    <Box
      as="svg"
      width={size}
      height={size * (60 / 68)}
      viewBox="0 0 68 60"
      fill="none"
      aria-hidden="true"
      display="block"
    >
      <path
        d="M34 2 L40 9 L49 4 L51 13 L61 12 L57 21 L66 26 L58 31 L65 39 L55 40 L58 49 L48 47 L47 57 L38 51 L34 58 L30 51 L21 57 L20 47 L10 49 L13 40 L3 39 L10 31 L2 26 L11 21 L7 12 L17 13 L19 4 L28 9 Z"
        fill={BRUT.coral}
        stroke={BRUT.ink}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M22 26 L26 33 M46 26 L42 33 M34 30 L34 40" stroke={BRUT.ink} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="34" cy="45" r="1.6" fill={BRUT.ink} />
    </Box>
    {children && (
      <Flex position="absolute" inset={0} align="center" justify="center" pb="10%">
        {children}
      </Flex>
    )}
  </Box>
);

// Sticky tape: a translucent strip for "sticking" cards to the page.
export const StickerTape = ({ w = 92, h = 26, color = "rgba(56,182,255,0.72)", rotation = 0, style, className, ...props }) => (
  <Box
    aria-hidden="true"
    position="absolute"
    w={w}
    h={h}
    borderRadius="1px"
    boxShadow="1px 2px 2px rgba(23,24,28,0.14)"
    backgroundImage={`repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0 7px, rgba(255,255,255,0) 7px 14px), ${color}`}
    style={{ transform: `rotate(${rotation}deg)`, ...style }}
    className={className}
    {...props}
  />
);

// ─────────────────────────────────────────────────────────────
// Cursor: a cartoon glove flashing the peace sign. The hotspot
// sits between the fingertips. Buttons trigger a boop; fields
// keep the native caret. Desktop + reduced-motion aware; it
// unmounts with PublicShell so admin keeps its native cursor.
// ─────────────────────────────────────────────────────────────
export const SiteCursor = () => {
  const arrowRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return undefined;

    const arrow = arrowRef.current;
    const ring = ringRef.current;
    if (!arrow) return undefined;

    document.documentElement.classList.add("cursor-fancy");

    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      gsap.set(arrow, { x, y });
      gsap.to(ring, { x, y, duration: 0.32, ease: "power2.out", overwrite: "auto" });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!arrow.dataset.shown) {
        arrow.dataset.shown = "1";
        gsap.set(arrow, { x, y });
        gsap.to(arrow, { opacity: 1, duration: 0.25, ease: "back.out(1.6)" });
        gsap.to(ring, { opacity: 1, duration: 0.35 });
      }
      queue();
    };

    const over = (event) => {
      const hit = event.target.closest(
        "a, button, [role='button'], label, summary, [data-cursor='grow']"
      );
      const text = event.target.closest("input, textarea, select, [contenteditable='true']");
      if (text) {
        gsap.to(arrow, { scale: 0.4, opacity: 0.25, duration: 0.25, overwrite: "auto" });
        gsap.to(ring, { scale: 0.6, opacity: 0, duration: 0.25, overwrite: "auto" });
      } else if (hit) {
        gsap.to(arrow, { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
        gsap.to(ring, { scale: 1.35, opacity: 1, duration: 0.3, overwrite: "auto" });
      } else {
        gsap.to(arrow, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" });
        gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.3, overwrite: "auto" });
      }
    };

    const press = () => {
      gsap.to(arrow, { scale: 0.74, duration: 0.12, overwrite: "auto" });
      gsap.to(ring, { scale: 0.7, duration: 0.12, overwrite: "auto" });
    };
    const release = () => {
      gsap.to(arrow, { scale: 1, duration: 0.35, ease: "back.out(2.4)", overwrite: "auto" });
      gsap.to(ring, { scale: 1, duration: 0.35, ease: "back.out(2.4)", overwrite: "auto" });
    };
    const hide = () => {
      gsap.to(arrow, { opacity: 0, duration: 0.2 });
      gsap.to(ring, { opacity: 0, duration: 0.2 });
    };
    const show = () => {
      if (!arrow.dataset.shown) return;
      gsap.to(arrow, { opacity: 1, duration: 0.2 });
      gsap.to(ring, { opacity: 0.55, duration: 0.2 });
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
      gsap.killTweensOf([arrow, ring]);
    };
  }, []);

  return (
    <>
      {/* Trailing ring: follows with a soft lag, grows over targets */}
      <Box
        ref={ringRef}
        aria-hidden="true"
        position="fixed"
        top="0"
        left="0"
        w="34px"
        h="34px"
        ml="-17px"
        mt="-17px"
        borderRadius="11px"
        border="2.5px dashed rgba(4,167,119,0.55)"
        opacity={0}
        pointerEvents="none"
        zIndex={2500}
        willChange="transform, opacity"
      />
      {/* The chunky arrow: emerald fill, thick ink outline, hard shadow */}
      <Box
        ref={arrowRef}
        aria-hidden="true"
        position="fixed"
        top="0"
        left="0"
        w="30px"
        ml="-7px"
        mt="-4px"
        opacity={0}
        pointerEvents="none"
        zIndex={2501}
        willChange="transform"
      >
        <svg width="30" height="34" viewBox="0 0 27 31" fill="none">
          {/* solid offset shadow */}
          <path
            d="M8 5 L8 24.4 L13.8 19.4 L17.1 29.2 L21.9 27.1 L18.5 17.7 L25.1 17 Z"
            fill="#17181C"
            transform="translate(2.6 2.6)"
          />
          {/* main arrow */}
          <path
            d="M8 5 L8 24.4 L13.8 19.4 L17.1 29.2 L21.9 27.1 L18.5 17.7 L25.1 17 Z"
            fill={BRUT.primary}
            stroke="#17181C"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* highlight facet */}
          <path
            d="M8 5 L8 11 L14.6 9.2 Z"
            fill="rgba(255,255,255,0.55)"
            stroke="none"
          />
        </svg>
      </Box>
    </>
  );
};

// Magnetic buttons: lean toward the pointer while hovered, spring
// back elastically on exit.
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
