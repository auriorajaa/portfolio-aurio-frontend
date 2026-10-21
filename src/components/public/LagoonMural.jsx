import React from "react";
import { Box } from "@chakra-ui/react";

// MuralStrip: full-width hand-painted ocean bands that live ONLY
// in the gaps between sections -- and each band is a tiny cartoon.
// Pure CSS keyframes (see index.css "living lagoon") roll the
// waves, bob the boat, swim the fish, wag the shark tail and so
// on. Rule of the house: any element with an SVG transform
// attribute gets its animation on an INNER wrapper, so CSS motion
// never clobbers its position.
const INK = "#0B2F2F";
const LAGOON_BLUE = "#0E8C86";
const CORAL = "#FF6B4A";
const SUN = "#FFC857";
const DEEP = "#0B4F4C";
const WASH = "#D8F0EC";
const WHITE = "#FFFFFF";

const delay = (seconds) => ({ animationDelay: `${seconds}s` });
const duration = (seconds) => ({ animationDuration: `${seconds}s` });

const Bubbles = ({ x, y, r = 4, start }) => (
  <g className="mural-bubble" style={start ? delay(start) : undefined}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={LAGOON_BLUE} strokeWidth="2.4" />
    <circle cx={x + 10} cy={y - 10} r={r * 0.62} fill="none" stroke={LAGOON_BLUE} strokeWidth="2.2" />
    <circle cx={x - 9} cy={y - 8} r={r * 0.45} fill="none" stroke={LAGOON_BLUE} strokeWidth="2" />
  </g>
);

const Fish = ({ x, y, size = 20, color = CORAL, flip = false, motion, style }) => (
  <g transform={`translate(${x} ${y}) ${flip ? "scale(-1 1)" : ""}`}>
    <g className={motion} style={style}>
      <ellipse cx="0" cy="0" rx={size} ry={size * 0.6} fill={color} stroke={INK} strokeWidth="2.8" />
      <path
        d={`M ${-size} 0 L ${-size * 1.55} ${-size * 0.42} L ${-size * 1.42} 0 L ${-size * 1.55} ${size * 0.42} Z`}
        fill={color}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <circle cx={size * 0.42} cy={-size * 0.14} r={size * 0.1} fill={INK} />
      <path
        d={`M ${size * 0.16} ${size * 0.16} q ${size * 0.16} ${size * 0.13} ${size * 0.32} 0`}
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  </g>
);

// one long lazy wave that runs the full 1440 design width; drawn
// twice, offset one wavelength, so CSS drift can loop seamlessly
const wavePath = (y) =>
  `M -160 ${y} q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 -16 60 0 q 30 16 60 0 q 30 16 60 0`;

const FullWave = ({ y = 136, color = LAGOON_BLUE }) => (
  <g className="mural-wave">
    <path d={wavePath(y)} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    <path d={wavePath(y)} transform="translate(120 0)" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
  </g>
);

const STRIPS = {
  boat: {
    cast: (
      <>
        <circle cx="140" cy="40" r="13" fill={SUN} stroke={INK} strokeWidth="2.8" />
        <path d="M 131 40 h 18 M 140 31 v 18" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <g transform="translate(720 106)">
          <g className="mural-bob">
            <path d="M -30 0 L 30 0 L 20 22 L -20 22 Z" fill={CORAL} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M -3 1 L 0 -26 L 3 1 Z" fill={WHITE} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M 3 -26 L 22 -20 L 3 -13 Z" fill={SUN} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M -13 10 h 26" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </g>
        <Fish x={1010} y={112} size={13} color={LAGOON_BLUE} flip motion="mural-swim" style={duration(7.4)} />
        <Fish x={1052} y={94} size={11} color={SUN} motion="mural-swim" style={{ ...duration(6), ...delay(-2.6) }} />
        <Bubbles x={962} y={118} r={4} start={1.1} />
      </>
    ),
  },
  beach: {
    cast: (
      <>
        {/* sandy hill flowing right */}
        <path
          d="M 380 160 C 560 118, 900 112, 1120 138 C 1200 148, 1330 152, 1480 158 L 1480 200 L 380 200 Z"
          fill={SUN}
          transform="translate(0 12) scale(1 0.9)"
          opacity={0.92}
        />
        {/* palm leaning into the sea breeze */}
        <g transform="translate(1130 74)">
          <path d="M -3 74 C -10 40, -2 20, 6 2 C 9 -8, 16 -10, 24 -4" fill="none" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
          <g className="mural-frond">
            <path d="M 24 -4 C 46 -18, 70 -16, 82 -2 C 60 -10, 38 -8, 24 2 Z" fill={LAGOON_BLUE} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M 22 -2 C 2 -22, -22 -22, -32 -8 C -12 -13, 8 -10, 20 0 Z" fill={LAGOON_BLUE} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M 24 0 C 24 -24, 14 -38, -2 -42 C 4 -32, 8 -20, 12 -4 Z" fill={DEEP} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
          </g>
          <circle cx="16" cy="6" r="5" fill={SUN} stroke={INK} strokeWidth="2.4" />
        </g>
        {/* tiny crab scuttling along the sand */}
        <g transform="translate(690 126)">
          <g className="mural-crab">
            <ellipse cx="0" cy="8" rx="15" ry="10" fill={CORAL} stroke={INK} strokeWidth="2.8" />
            <path d="M -19 3 q -8 -10 -3 -15 M -14 6 q -12 -5 -10 -12" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M 19 3 q 8 -10 3 -15 M 14 6 q 12 -5 10 -12" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="-5" cy="6" r="2.2" fill={INK} />
            <circle cx="5" cy="6" r="2.2" fill={INK} />
          </g>
        </g>
        <Bubbles x={180} y={86} r={4} start={0.9} />
        <Bubbles x={240} y={110} r={3} start={3.4} />
      </>
    ),
    noWave: true,
  },
  school: {
    cast: (
      <>
        <Fish x={560} y={72} size={26} color={CORAL} motion="mural-swim" style={duration(6.6)} />
        <Fish x={636} y={112} size={18} color={LAGOON_BLUE} flip motion="mural-swim" style={{ ...duration(5.2), ...delay(-1.8) }} />
        <Fish x={700} y={58} size={16} color={SUN} motion="mural-swim-fast" style={delay(-0.7)} />
        <Fish x={968} y={122} size={14} color={DEEP} flip motion="mural-swim" style={{ ...duration(7.8), ...delay(-3) }} />
        <Bubbles x={480} y={104} r={4} />
        <Bubbles x={1046} y={80} r={4} start={2.2} />
        <Bubbles x={1092} y={116} r={3} start={4.6} />
      </>
    ),
  },
  shark: {
    cast: (
      <>
        <g transform="translate(940 86)">
          <g className="mural-glide">
            <path
              d="M -50 0 C -42 -24, -2 -32, 26 -18 C 36 -13, 42 -4, 38 4 C 28 15, -12 21, -36 11 C -50 6, -54 5, -50 0 Z"
              fill={WASH}
              stroke={INK}
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path d="M -12 -26 C -6 -44, 10 -47, 18 -31 C 5 -36, -5 -32, -12 -26 Z" fill={DEEP} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path className="mural-tail" d="M -47 2 L -62 -13 L -57 2 L -64 15 Z" fill={DEEP} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M 14 10 q 13 6 19 -3" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M 18 11.5 l 2 3.6 l 2 -3.6 l 2 3.6 l 2 -3.6 l 2 3.6 l 2 -3.6" fill="none" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="24" cy="-10" r="3.6" fill={INK} />
            <path d="M -20 -5 h 8 M -9 -6 h 8" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          </g>
        </g>
        {/* the fleeing snack squad */}
        <Fish x={560} y={114} size={12} color={LAGOON_BLUE} motion="mural-swim-fast" style={delay(-0.6)} />
        <Fish x={610} y={94} size={10} color={SUN} flip motion="mural-swim-fast" style={delay(-1.5)} />
        <Fish x={666} y={122} size={11} color={CORAL} motion="mural-swim-fast" style={delay(-2.4)} />
        <Bubbles x={420} y={84} r={4} />
        <Bubbles x={1300} y={112} r={3.6} start={3} />
      </>
    ),
  },
  garden: {
    cast: (
      <>
        <path className="mural-weed" d="M 300 150 C 288 110, 308 88, 296 48" fill="none" stroke={LAGOON_BLUE} strokeWidth="5.4" strokeLinecap="round" />
        <path className="mural-weed mural-weed-alt" d="M 372 152 C 388 118, 368 94, 382 52" fill="none" stroke={DEEP} strokeWidth="5.4" strokeLinecap="round" />
        <path className="mural-weed" style={{ ...duration(5.3), ...delay(-2) }} d="M 740 150 C 728 116, 746 92, 736 56" fill="none" stroke={LAGOON_BLUE} strokeWidth="5" strokeLinecap="round" />
        <path className="mural-weed mural-weed-alt" d="M 1088 150 C 1100 118, 1084 96, 1094 60" fill="none" stroke={DEEP} strokeWidth="5" strokeLinecap="round" />
        <g transform="translate(420 128)">
          <g className="mural-star">
            <path d="M 0 -21 L 6 -6 L 21 -6 L 9 4 L 13 19 L 0 9.6 L -13 19 L -9 4 L -21 -6 L -6 -6 Z" fill={SUN} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
          </g>
        </g>
        <g transform="translate(774 118)" opacity={0.9}>
          <g className="mural-star" style={{ ...duration(5.6), ...delay(-2.9) }}>
            <path d="M 0 -15 L 4.4 -4 L 15 -4 L 6.4 3 L 9.5 13.4 L 0 7 L -9.5 13.4 L -6.4 3 L -15 -4 L -4.4 -4 Z" fill={CORAL} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          </g>
        </g>
        <Bubbles x={1046} y={92} r={4} />
        <Bubbles x={220} y={70} r={3.4} start={2.8} />
      </>
    ),
  },
  octo: {
    cast: (
      <>
        <g transform="translate(560 74)">
          <g className="mural-jelly" style={duration(5.6)}>
            <path d="M -30 6 C -36 -28, -18 -44, 0 -44 C 18 -44, 36 -28, 30 6 C 28 12, -28 12, -30 6 Z" fill={CORAL} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <circle cx="-11" cy="-14" r="4.8" fill={WHITE} stroke={INK} strokeWidth="2.4" />
            <circle cx="-11" cy="-13" r="2.3" fill={INK} />
            <circle cx="11" cy="-14" r="4.8" fill={WHITE} stroke={INK} strokeWidth="2.4" />
            <circle cx="11" cy="-13" r="2.3" fill={INK} />
            <path d="M -7 0 q 7 7 14 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g className="mural-tent">
            <path
              d="M -24 10 C -32 38, -20 50, -30 74 M -8 12 C -10 44, 2 52, -3 78 M 12 12 C 16 46, 4 56, 12 80 M 28 10 C 36 38, 28 58, 36 78"
              fill="none"
              stroke={CORAL}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="-32" cy="77" r="4.6" fill="none" stroke={CORAL} strokeWidth="3.4" />
            <circle cx="-5" cy="81" r="4.6" fill="none" stroke={CORAL} strokeWidth="3.4" />
            <circle cx="14" cy="83" r="4.6" fill="none" stroke={CORAL} strokeWidth="3.4" />
            <circle cx="39" cy="81" r="4.6" fill="none" stroke={CORAL} strokeWidth="3.4" />
          </g>
        </g>
        <g transform="translate(1010 66)">
          <g className="mural-jelly" style={{ ...duration(4.2), ...delay(-1.6) }}>
            <path d="M -26 0 C -26 -26, 26 -26, 26 0 C 26 6, -26 6, -26 0 Z" fill={WASH} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M -14 -12 q 8 -7 14 -2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <circle cx="7" cy="-6" r="2.6" fill={INK} />
            <circle cx="-4" cy="-9" r="2.6" fill={INK} />
          </g>
          <g className="mural-tent" style={{ ...duration(5.4), ...delay(-2.2) }}>
            <path d="M -26 3 q 5 6 9 0 q 5 6 9 0 q 5 6 9 0 q 5 6 9 0 q 5 6 9 0" fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" />
            <path d="M -16 12 C -18 36, -8 44, -12 62 M 2 12 C 1 40, 9 48, 5 64 M 16 12 C 18 34, 10 48, 16 58" fill="none" stroke={CORAL} strokeWidth="2.8" strokeLinecap="round" />
          </g>
        </g>
        <Bubbles x={300} y={104} r={4} />
        <Bubbles x={1180} y={106} r={3.6} start={2.6} />
      </>
    ),
  },
  whale: {
    cast: (
      <>
        <g transform="translate(700 92) scale(0.94)">
          <g className="mural-bob" style={duration(8.5)}>
            <path
              d="M -54 0 C -52 -38, -6 -48, 27 -32 C 42 -25, 47 -11, 45 0 C 43 15, 26 25, 2 22 C -18 21, -39 23, -43 13 L -43 28 L -50 26 L -53 11 C -58 9, -58 6, -54 0 Z"
              fill={WASH}
              stroke={INK}
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
            <circle cx="-19" cy="-6" r="4.4" fill={INK} />
            <path d="M -4 5 q 10 9 21 2" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M 12 12 q 17 -6 28 4 q -12 13 -28 4" fill={CORAL} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M -44 11 q 21 7 41 7" fill="none" stroke={INK} strokeWidth="1.8" opacity="0.4" />
          </g>
          {/* the spout: anchored to the head, puffing on its own clock */}
          <g className="mural-spout" style={delay(0.8)}>
            <path d="M -7 -44 q 0 -13 4 -19" fill="none" stroke={LAGOON_BLUE} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M -12 -46 q -8 -9 -10 -15" fill="none" stroke={LAGOON_BLUE} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M -2 -46 q 10 -8 13 -15" fill="none" stroke={LAGOON_BLUE} strokeWidth="2.8" strokeLinecap="round" />
          </g>
        </g>
        <Fish x={330} y={106} size={13} color={LAGOON_BLUE} motion="mural-swim" style={duration(7)} />
        <Fish x={376} y={84} size={10} color={SUN} flip motion="mural-swim" style={{ ...duration(5.8), ...delay(-2.2) }} />
        <Bubbles x={250} y={96} r={4} />
        <Bubbles x={1150} y={110} r={4} start={1.8} />
      </>
    ),
  },
};

const MuralStrip = ({ variant = "boat" }) => {
  const cfg = STRIPS[variant] || STRIPS.boat;

  return (
    <Box
      aria-hidden="true"
      className="mural-strip"
      position="relative"
      h={{ base: "120px", md: "170px" }}
      my={{ base: "-14px", md: "-18px" }}
      pointerEvents="none"
      zIndex={1}
    >
      <Box
        as="svg"
        width="100%"
        height="100%"
        viewBox="0 0 1440 170"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", overflow: "visible" }}
      >
        {!cfg.noWave && <FullWave />}
        {cfg.cast}
      </Box>
    </Box>
  );
};

export const MuralStrip3D = MuralStrip;
export default MuralStrip;
