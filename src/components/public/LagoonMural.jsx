import React from "react";
import { Box } from "@chakra-ui/react";

// Illustrated pauses between portfolio chapters.
//
// How it stays responsive without ever distorting the creatures:
//  - Every scene is drawn in a fixed viewBox and scaled uniformly (never stretched),
//    so each animal keeps its proportions on any screen.
//  - Phone (< md) and desktop (>= md) have separate compositions. The strip's height
//    follows its width through the viewBox ratio, so nothing is cropped or overlaps.
//  - The sea floor and waves are plain CSS behind the SVG, so they span the full
//    width on ultra-wide screens while the scene stays centered.

const INK = "#0B2F2F";
const TEAL = "#0E8C86";
const DEEP = "#0B4F4C";
const LEAF = "#35B3A7";
const CORAL = "#FF6B4A";
const YELLOW = "#FFC857";
const MIST = "#D8F0EC";
const WHITE = "#FFFFFF";
const BLUE = "#5DB7CC";
const PURPLE = "#B48AD6";
const SAND = "#E3F4F1";
const SKY = "#F5FBFB";

const OUT = { stroke: INK, strokeLinejoin: "round", strokeLinecap: "round" };
const at = (x, y, s, flip = false) => `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;

// ---------------------------------------------------------------- sea floor
const waveTile = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='14' viewBox='0 0 72 14'><path d='M0 7Q18 -2 36 7T72 7' fill='none' stroke='${TEAL}' stroke-width='3'/></svg>`
)}")`;

const Floor = () => (
  <Box position="absolute" left={0} right={0} bottom={0} h="22%" bg={SAND}>
    <Box
      position="absolute" left={0} right={0} top="-7px" h="14px"
      backgroundImage={waveTile} backgroundRepeat="repeat-x" backgroundSize="72px 14px"
    />
    <Box
      position="absolute" left={0} right={0} top="45%" h="14px"
      backgroundImage={waveTile} backgroundRepeat="repeat-x" backgroundSize="72px 14px" backgroundPosition="36px 0"
    />
  </Box>
);

// ---------------------------------------------------------------- helpers
// Thick curved strokes with an ink outline. All outlines are drawn first so
// overlapping strokes merge into one clean shape.
const Tubes = ({ items, w }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    {items.map(([d], i) => <path key={`o${i}`} d={d} stroke={INK} strokeWidth={w + 5} />)}
    {items.map(([d, c], i) => <path key={`c${i}`} d={d} stroke={c} strokeWidth={w} />)}
  </g>
);

const Bubbles = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)} fill={WHITE} fillOpacity=".7" stroke={TEAL} strokeWidth="2.6">
    <circle cx="0" cy="0" r="8" />
    <circle cx="17" cy="-18" r="5.2" />
    <circle cx="-10" cy="-26" r="3.6" />
  </g>
);

const Seaweed = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <Tubes
      w={7}
      items={[
        ["M0 0 C-12 -18 12 -34 0 -54 C-9 -69 7 -80 4 -96", DEEP],
        ["M16 0 C28 -16 8 -30 20 -48 C28 -60 16 -70 22 -80", TEAL],
        ["M-16 0 C-26 -14 -14 -28 -24 -42", LEAF],
      ]}
    />
  </g>
);

// ---------------------------------------------------------------- creatures
const Star = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <path
      d="M0 -18 L5 -6.9 L17.1 -5.6 L8.1 2.6 L10.6 14.6 L0 8.5 L-10.6 14.6 L-8.1 2.6 L-17.1 -5.6 L-5 -6.9Z"
      fill={YELLOW} {...OUT} strokeWidth="3.4"
    />
    <circle cx="-3.6" cy="-1" r="1.5" fill={INK} />
    <circle cx="3.6" cy="-1" r="1.5" fill={INK} />
    <path d="M-2.5 3.5 Q0 5.5 2.5 3.5" fill="none" {...OUT} strokeWidth="1.6" />
  </g>
);

// Faces right. `flip` mirrors it to face left.
const Fish = ({ x, y, s = 1, color = CORAL, flip = false }) => {
  const fin = color === YELLOW ? CORAL : YELLOW;
  return (
    <g transform={at(x, y, s, flip)}>
      <path d="M-20 0 L-43 -18 Q-36 0 -43 18Z" fill={fin} {...OUT} strokeWidth="3" />
      <path d="M-12 -10 Q-8 -34 16 -12Z" fill={fin} {...OUT} strokeWidth="3" />
      <path d="M-22 0 C-12 -21 14 -23 28 -5 Q32 0 28 5 C14 23 -12 21 -22 0Z" fill={color} {...OUT} strokeWidth="3" />
      <path d="M3 -14 Q9 0 3 14" fill="none" stroke={WHITE} strokeOpacity=".55" strokeWidth="4" />
      <path d="M-4 3 Q-14 14 -6 19 Q5 16 7 5Z" fill={fin} {...OUT} strokeWidth="2.6" />
      <path d="M14 -9 Q19 0 14 9" fill="none" {...OUT} strokeWidth="2.4" />
      <circle cx="21" cy="-4" r="4.4" fill={WHITE} {...OUT} strokeWidth="2.2" />
      <circle cx="22" cy="-4" r="2" fill={INK} />
      <path d="M28 3.5 Q25 6.5 21.5 5.5" fill="none" {...OUT} strokeWidth="2" />
    </g>
  );
};

const Claw = ({ x, r }) => (
  <g transform={`translate(${x} -24) rotate(${r})`}>
    <path d="M7.4 -11.9 A14 14 0 1 1 -7.4 -11.9 L0 -3Z" fill={CORAL} {...OUT} strokeWidth="3" />
  </g>
);

const Crab = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <g fill="none" {...OUT} strokeWidth="4.5">
      <path d="M-24 14 L-40 20 L-46 32 M-20 20 L-34 30 L-37 42 M-12 24 L-21 34 L-21 44" />
      <path d="M24 14 L40 20 L46 32 M20 20 L34 30 L37 42 M12 24 L21 34 L21 44" />
      <path d="M-26 3 Q-38 1 -41 -11 M26 3 Q38 1 41 -11" strokeWidth="5" />
      <path d="M-9 -6 V-17 M9 -6 V-17" />
    </g>
    <Claw x={-43} r={-15} />
    <Claw x={43} r={15} />
    <ellipse cx="0" cy="8" rx="31" ry="20" fill={CORAL} {...OUT} strokeWidth="3.4" />
    <path d="M-20 -1 Q-15 -8 -5 -9" fill="none" stroke={WHITE} strokeOpacity=".55" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="-9" cy="-22" r="6.5" fill={WHITE} {...OUT} strokeWidth="2.6" />
    <circle cx="9" cy="-22" r="6.5" fill={WHITE} {...OUT} strokeWidth="2.6" />
    <circle cx="-8" cy="-22" r="2.8" fill={INK} />
    <circle cx="10" cy="-22" r="2.8" fill={INK} />
    <path d="M-7 15 Q0 22 7 15" fill="none" {...OUT} strokeWidth="2.6" />
  </g>
);

// Faces right, tail flukes on the left, spout on top.
const Whale = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <path d="M7 -42 Q7 -58 -4 -66 M7 -42 Q7 -58 18 -66 M7 -42 V-64" fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
    <circle cx="-10" cy="-58" r="2.6" fill={TEAL} />
    <circle cx="24" cy="-58" r="2.6" fill={TEAL} />
    <path
      d="M-44 14 C-62 16 -72 2 -70 -12 C-82 -16 -90 -28 -88 -40 C-76 -38 -70 -34 -66 -28 C-62 -36 -54 -42 -46 -42 C-48 -30 -52 -20 -56 -12 C-52 -4 -48 0 -44 2Z"
      fill={BLUE} {...OUT} strokeWidth="4"
    />
    <path
      d="M-50 8 C-52 -22 -28 -40 6 -40 C42 -40 66 -22 66 4 C66 26 44 34 14 34 C-14 34 -40 30 -50 8Z"
      fill={BLUE} {...OUT} strokeWidth="4"
    />
    <path d="M-30 16 C-10 24 20 26 44 20 C54 17 58 12 60 8 C46 14 28 14 6 14 C-8 14 -22 13 -30 16Z" fill={MIST} />
    <path d="M12 12 C4 24 -8 28 -18 24 C-10 16 -2 10 8 6Z" fill="#3E9CB5" {...OUT} strokeWidth="3" />
    <circle cx="50" cy="1" r="5" fill={CORAL} fillOpacity=".5" />
    <circle cx="40" cy="-8" r="4.4" fill={INK} />
    <circle cx="41.4" cy="-9.4" r="1.4" fill={WHITE} />
    <path d="M45 9 Q53 16 61 8" fill="none" {...OUT} strokeWidth="3" />
  </g>
);

const SHARK_BODY =
  "M72 6 C60 -14 28 -28 -6 -26 C-28 -24 -42 -12 -56 -4 Q-70 -20 -90 -42 Q-86 -12 -72 2 Q-82 12 -88 28 Q-66 20 -54 10 C-40 18 -28 26 -6 26 C28 28 62 22 72 6Z";

// Faces right.
const Shark = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <path d="M22 -20 C14 -38 4 -52 -10 -64 C-12 -48 -14 -34 -18 -20Z" fill="#6FA3B5" {...OUT} strokeWidth="3.6" />
    <path d="M14 20 C8 34 -4 44 -18 48 C-14 36 -10 28 -6 20Z" fill="#6FA3B5" {...OUT} strokeWidth="3.6" />
    <path d={SHARK_BODY} fill="#8DB4C4" />
    <path d="M72 6 C62 22 28 28 -6 26 C-28 26 -40 18 -54 10 C-36 12 -14 17 6 17 C34 17 58 14 72 6Z" fill={WHITE} />
    <path d={SHARK_BODY} fill="none" {...OUT} strokeWidth="4" />
    <path d="M16 -10 Q12 0 16 10 M23 -11 Q19 0 23 11" fill="none" {...OUT} strokeWidth="2.4" />
    <circle cx="45" cy="-6" r="4" fill={INK} />
    <circle cx="46.3" cy="-7.3" r="1.3" fill={WHITE} />
    <path d="M64 8 Q52 17 38 11" fill="none" {...OUT} strokeWidth="2.6" />
  </g>
);

const TENTACLES = [
  "M-24 12 C-40 26 -58 26 -60 42 C-61 52 -52 56 -46 50",
  "M-8 16 C-12 36 -26 40 -24 56 C-23 66 -14 68 -10 62",
  "M8 16 C12 36 26 40 24 56 C23 66 14 68 10 62",
  "M24 12 C40 26 58 26 60 42 C61 52 52 56 46 50",
];

const Octopus = ({ x, y, s = 1 }) => (
  <g transform={at(x, y, s)}>
    <Tubes w={11} items={TENTACLES.map((d) => [d, PURPLE])} />
    <path
      d="M-34 10 C-42 -30 -22 -54 0 -54 C22 -54 42 -30 34 10 C28 22 -28 22 -34 10Z"
      fill={PURPLE} {...OUT} strokeWidth="3.5"
    />
    <circle cx="-6" cy="-41" r="3.5" fill="#CDB0E6" />
    <circle cx="8" cy="-34" r="2.6" fill="#CDB0E6" />
    <circle cx="-24" cy="-2" r="4.5" fill={CORAL} fillOpacity=".45" />
    <circle cx="24" cy="-2" r="4.5" fill={CORAL} fillOpacity=".45" />
    <circle cx="-13" cy="-14" r="8" fill={WHITE} {...OUT} strokeWidth="2.5" />
    <circle cx="13" cy="-14" r="8" fill={WHITE} {...OUT} strokeWidth="2.5" />
    <circle cx="-13" cy="-12" r="4" fill={INK} />
    <circle cx="13" cy="-12" r="4" fill={INK} />
    <circle cx="-11.7" cy="-13.4" r="1.3" fill={WHITE} />
    <circle cx="14.3" cy="-13.4" r="1.3" fill={WHITE} />
    <path d="M-7 2 Q0 9 7 2" fill="none" {...OUT} strokeWidth="2.7" />
  </g>
);

const PARTS = { fish: Fish, crab: Crab, whale: Whale, shark: Shark, octo: Octopus, star: Star, bubbles: Bubbles };

// ---------------------------------------------------------------- layouts
// Each item: [part, x, y, scale, extraProps]. The sea floor starts at ~78% of the height.
const F = (x, y, s, color = CORAL, flip = false) => ["fish", x, y, s, { color, flip }];
const B = (x, y, s = 1) => ["bubbles", x, y, s];

const DESKTOP = {
  size: [1100, 280],
  weeds: [[95, 264, 1], [1010, 268, 0.85]],
  reef: [
    ["whale", 230, 114, 1.05], B(410, 160), F(510, 92, 1.25), F(640, 148, 1, YELLOW, true),
    ["crab", 860, 196, 1.05], F(990, 95, 0.8, BLUE, true),
  ],
  crab: [
    F(170, 110, 1.2, YELLOW), B(330, 150), ["crab", 545, 192, 1.25],
    ["star", 760, 238, 1.3], F(930, 105, 1.15, CORAL, true),
  ],
  school: [
    F(200, 115, 1.3), F(345, 165, 1, YELLOW), F(500, 80, 1.15, BLUE),
    F(650, 145, 1.35), F(820, 95, 1, YELLOW), F(945, 168, 1.2, PURPLE), B(760, 200),
  ],
  shark: [
    F(230, 150, 0.9, YELLOW), B(330, 190), ["shark", 545, 112, 1.05],
    F(740, 100, 0.95), F(880, 160, 0.8, YELLOW), ["star", 700, 238, 1.2],
  ],
  octo: [
    ["octo", 300, 112, 1], B(460, 80), ["star", 520, 240, 1.3], F(600, 100, 1.1, YELLOW, true),
    F(720, 170, 0.8), ["whale", 890, 125, 0.9],
  ],
  whale: [
    F(200, 150, 1.1), B(340, 120), ["whale", 560, 120, 1.1],
    ["octo", 905, 120, 0.95], F(1030, 60, 0.8, YELLOW, true),
  ],
};

const MOBILE = {
  size: [390, 290],
  weeds: [[26, 264, 0.6], [366, 268, 0.5]],
  reef: [
    ["whale", 130, 100, 0.8], F(305, 85, 0.9, YELLOW), F(105, 178, 0.8),
    ["crab", 255, 196, 0.8], B(345, 150, 0.7),
  ],
  crab: [
    F(95, 85, 0.85, YELLOW), F(300, 105, 0.8, CORAL, true), B(60, 170, 0.7),
    ["crab", 195, 192, 1], ["star", 318, 240, 0.9],
  ],
  school: [
    F(95, 70, 1), F(245, 95, 0.85, YELLOW), F(150, 150, 0.95, BLUE),
    F(290, 180, 0.8, PURPLE), F(90, 198, 0.7, YELLOW), B(350, 110, 0.6),
  ],
  shark: [
    ["shark", 175, 105, 0.85], F(300, 110, 0.7), F(95, 190, 0.65, YELLOW),
    B(60, 150, 0.6), ["star", 300, 240, 0.9],
  ],
  octo: [
    ["octo", 110, 115, 0.8], F(270, 95, 0.85, YELLOW, true), ["whale", 265, 190, 0.65],
    ["star", 190, 240, 1], B(350, 150, 0.6),
  ],
  whale: [
    F(62, 100, 0.72), ["whale", 195, 120, 0.85], F(330, 75, 0.6, YELLOW, true),
    ["octo", 305, 195, 0.55], B(55, 185, 0.6),
  ],
};

const Scene = ({ variant, mobile = false }) => {
  const L = mobile ? MOBILE : DESKTOP;
  const [w, h] = L.size;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="presentation"
      focusable="false"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {L.weeds.map(([x, y, s]) => <Seaweed key={x} x={x} y={y} s={s} />)}
      {(L[variant] || L.reef).map(([part, x, y, s, extra], i) => {
        const Part = PARTS[part];
        return <Part key={i} x={x} y={y} s={s} {...extra} />;
      })}
    </svg>
  );
};

const MuralStrip = ({ variant = "reef" }) => (
  <Box
    aria-hidden="true"
    position="relative"
    bg={SKY}
    my={{ base: 0, md: "-2px" }}
    pointerEvents="none"
    zIndex={1}
    overflow="hidden"
    borderTop="1px solid rgba(11,47,47,0.08)"
    borderBottom="1px solid rgba(11,47,47,0.08)"
  >
    <Floor />
    <Box position="relative" mx="auto" w="100%" maxW={{ base: "520px", md: "1100px" }}>
      <Box display={{ base: "none", md: "block" }}><Scene variant={variant} /></Box>
      <Box display={{ base: "block", md: "none" }}><Scene variant={variant} mobile /></Box>
    </Box>
  </Box>
);

export default MuralStrip;