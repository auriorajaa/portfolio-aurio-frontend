// src/components/arcade/HandAssets.jsx
import React from "react";
import { Box } from "@chakra-ui/react";

/**
 * Transparent, high-detail illustrated vector hand assets for Rock Paper Scissors.
 * Hand-drawn SVG geometry with knuckles, palm lines, finger contours, and arcade drop shadows.
 */

export const RockHand = ({ size = 84, color = "#ff6b6b", isShaking = false, ...props }) => (
  <Box
    w={`${size}px`}
    h={`${size}px`}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    animation={isShaking ? "rpsShake 0.28s ease-in-out infinite alternate" : undefined}
    sx={{
      "@keyframes rpsShake": {
        "0%": { transform: "translateY(-10px) rotate(-6deg)" },
        "100%": { transform: "translateY(10px) rotate(6deg)" },
      },
    }}
    {...props}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrist / Forearm */}
      <path
        d="M32 94 L32 78 C32 72 35 68 38 66 L38 52 C38 46 42 42 48 42 L62 42 C68 42 72 46 72 52 L72 66 C75 68 78 72 78 78 L78 94 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Fist Palm / Knuckle Mound */}
      <path
        d="M26 62 C24 54 26 44 32 38 C36 34 44 32 54 32 C64 32 72 36 76 42 C80 48 80 58 76 66 C72 74 64 78 52 78 C40 78 30 74 26 62 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Clenched Finger 1 (Index) */}
      <path
        d="M35 34 C35 24 45 22 48 28 L48 44 C45 46 38 44 35 34 Z"
        fill="rgba(255,255,255,0.3)"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Clenched Finger 2 (Middle) */}
      <path
        d="M48 28 C48 20 58 20 60 26 L60 44 C58 46 50 46 48 28 Z"
        fill="rgba(255,255,255,0.25)"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Clenched Finger 3 (Ring) */}
      <path
        d="M60 26 C60 21 68 22 71 28 L71 46 C68 48 62 48 60 26 Z"
        fill="rgba(255,255,255,0.2)"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Clenched Finger 4 (Pinky) */}
      <path
        d="M71 30 C71 26 78 28 79 34 L79 48 C76 50 72 50 71 30 Z"
        fill="rgba(255,255,255,0.15)"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Thumb Wrapped Across Front */}
      <path
        d="M26 50 C26 44 32 40 40 40 L58 44 C62 45 64 50 62 54 C60 58 54 60 48 60 L36 60 C30 60 26 56 26 50 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Thumb Crease & Knuckle Highlights */}
      <path d="M38 44 C42 47 48 48 54 47" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M42 56 L46 56" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 56 L56 56" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      {/* Fist Power Spark */}
      <circle cx="28" cy="30" r="3" fill="#ffffff" />
      <circle cx="76" cy="24" r="2" fill="#ffffff" />
    </svg>
  </Box>
);

export const PaperHand = ({ size = 84, color = "#00bbf9", isShaking = false, ...props }) => (
  <Box
    w={`${size}px`}
    h={`${size}px`}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    animation={isShaking ? "rpsShake 0.28s ease-in-out infinite alternate" : undefined}
    sx={{
      "@keyframes rpsShake": {
        "0%": { transform: "translateY(-10px) rotate(-6deg)" },
        "100%": { transform: "translateY(10px) rotate(6deg)" },
      },
    }}
    {...props}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrist */}
      <path
        d="M34 94 L34 76 C34 70 38 66 42 64 L42 54 L66 54 L66 64 C70 66 74 70 74 76 L74 94 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Palm Base */}
      <path
        d="M28 66 C26 56 30 48 38 46 L70 46 C76 48 80 56 78 66 C76 74 68 78 54 78 C38 78 30 74 28 66 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Thumb Extended */}
      <path
        d="M30 62 C22 56 16 48 18 40 C20 34 26 36 30 42 L38 52 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Finger 1 (Index) */}
      <path
        d="M36 48 L36 18 C36 12 43 12 43 18 L43 46 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Finger 2 (Middle) */}
      <path
        d="M45 46 L45 12 C45 6 52 6 52 12 L52 46 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Finger 3 (Ring) */}
      <path
        d="M54 46 L54 16 C54 10 61 10 61 16 L61 48 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Finger 4 (Pinky) */}
      <path
        d="M63 48 L63 24 C63 19 70 19 70 24 L70 54 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Finger Nail Highlights */}
      <path d="M38 18 C38 15 41 15 41 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M47 12 C47 9 50 9 50 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 16 C56 13 59 13 59 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M65 24 C65 21 68 21 68 24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      {/* Palm Life Lines */}
      <path d="M38 60 C44 64 52 65 60 62" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 66 C48 70 54 70 64 68" stroke="#171717" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  </Box>
);

export const ScissorsHand = ({ size = 84, color = "#ffca3a", isShaking = false, ...props }) => (
  <Box
    w={`${size}px`}
    h={`${size}px`}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    animation={isShaking ? "rpsShake 0.28s ease-in-out infinite alternate" : undefined}
    sx={{
      "@keyframes rpsShake": {
        "0%": { transform: "translateY(-10px) rotate(-6deg)" },
        "100%": { transform: "translateY(10px) rotate(6deg)" },
      },
    }}
    {...props}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrist */}
      <path
        d="M34 94 L34 76 C34 70 38 66 42 64 L42 54 L66 54 L66 64 C70 66 74 70 74 76 L74 94 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Palm Base */}
      <path
        d="M30 66 C28 56 32 48 40 46 L68 46 C74 48 78 56 76 66 C74 74 66 78 54 78 C38 78 32 74 30 66 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Scissors Blade 1: Index Finger Pointing Up-Left */}
      <path
        d="M40 50 L28 16 C26 10 33 8 36 13 L48 46 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Scissors Blade 2: Middle Finger Pointing Up-Right */}
      <path
        d="M49 46 L62 14 C65 9 72 11 70 17 L57 50 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Blade Highlights */}
      <path d="M31 18 L42 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M65 18 L55 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      {/* Folded Ring Finger */}
      <path
        d="M56 48 C62 48 66 52 66 58 C66 62 60 64 56 64 Z"
        fill="rgba(0,0,0,0.15)"
        stroke="#171717"
        strokeWidth="2.5"
      />
      {/* Folded Pinky Finger */}
      <path
        d="M66 54 C72 54 74 58 74 62 C74 66 70 68 66 68 Z"
        fill="rgba(0,0,0,0.2)"
        stroke="#171717"
        strokeWidth="2.5"
      />
      {/* Thumb Clamped Across the Folded Fingers */}
      <path
        d="M32 58 C32 50 38 46 48 48 C56 50 62 54 60 60 C58 64 50 66 42 66 C36 66 32 62 32 58 Z"
        fill={color}
        stroke="#171717"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M40 54 C44 56 50 56 54 55" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </Box>
);
