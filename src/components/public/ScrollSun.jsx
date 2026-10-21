import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

// A doodle boat that sails down a dashed route on the right edge of
// the page as you read — start marked by a flag, finish by an X,
// like a treasure map. Still hidden below xl, and the boat bobs
// gently the whole way down.
const ScrollBoat = () => {
  const boatRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const boatEl = boatRef.current;

    const update = () => {
      const boat = boatRef.current;
      const rail = railRef.current;
      if (!boat || !rail) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const travel = rail.clientHeight - 34;
      gsap.set(boat, {
        y: progress * travel,
        rotate: -4 + progress * 8,
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (boatEl) gsap.killTweensOf(boatEl);
    };
  }, []);

  return (
    <Box
      aria-hidden="true"
      position="fixed"
      right="20px"
      top="12vh"
      zIndex={900}
      display={{ base: "none", xl: "block" }}
      pointerEvents="none"
    >
      {/* Dashed route (treasure-map line) */}
      <Box
        ref={railRef}
        h="62vh"
        w="0"
        style={{ borderLeft: "2.5px dashed rgba(11,47,47,0.4)" }}
        position="relative"
      >
        {/* Flag where the journey starts */}
        <Box position="absolute" top="-26px" left="-9px">
          <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
            <path d="M4 2 V28" stroke="#0B2F2F" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 3 L20 7.5 L5 12 Z" fill="#FF6B4A" stroke="#0B2F2F" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="4" cy="2.5" r="2" fill="#0B2F2F" />
          </svg>
        </Box>

        {/* The boat (hotspot rides the route) */}
        <Box
          ref={boatRef}
          position="absolute"
          top="0px"
          left="-18px"
          w="38px"
          pointerEvents="none"
        >
          <svg className="rail-boat" width="38" height="31" viewBox="0 0 50 40" fill="none">
            <path
              d="M6 24 C 8 32, 14 35.5, 23 35.5 C 32 35.5, 38 32, 40 24 Z"
              fill="#FF6B4A"
              stroke="#0B2F2F"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M24 23 V7" stroke="#0B2F2F" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M26 8 C 34 10, 36 16, 34.5 21 L26 21 Z"
              fill="#FFC857"
              stroke="#0B2F2F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M22 12 C 15 14, 14 18, 15.5 21 L22 21 Z"
              fill="#FFFFFF"
              stroke="#0B2F2F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        {/* X marks the spot at the end of the read */}
        <Box position="absolute" bottom="-4px" left="-13px">
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
            <path d="M6 4 L22 20 M22 4 L6 20" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="12" r="2" fill="#0B2F2F" />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

export default ScrollBoat;
