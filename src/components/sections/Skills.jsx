import React, { useEffect, useRef } from "react";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { skillsData } from "../../data/portfolioData";
import { StudioPill, StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const TICKER_TEXT = "API / CLOUD / INTERFACE / DATABASE / DOCUMENTS / ";
// Repeat enough times to fill any viewport width seamlessly
const REPEATS = 6;

const Skills = () => {
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const tickerRef = useRef(null);
  const tweenRef = useRef(null);

  // Infinite marquee — pure GSAP, no CSS animation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = tickerRef.current;
    if (!track) return;

    // Each child is one copy of the text; we measure the first child width
    const singleWidth = track.children[0]?.offsetWidth || 0;
    if (!singleWidth) return;

    // Start from x=0, animate to x=-singleWidth, then repeat seamlessly
    tweenRef.current = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -singleWidth,
        duration: 18,
        ease: "none",
        repeat: -1,
      }
    );

    return () => tweenRef.current?.kill();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray("[data-skill-row]").forEach((row, index) => {
        gsap.fromTo(
          row,
          { x: index % 2 === 0 ? -42 : 42, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.75,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              once: true,
            },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <StudioSection id="skills" eyebrow="Practice" title="What I use to shape the work.">
      <Box ref={rootRef} overflow="hidden">

        {/* ── Infinite marquee ticker ─────────────────────────── */}
        <Box
          overflow="hidden"
          mb={{ base: 8, md: 10 }}
          // Fade edges
          sx={{
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <Box
            ref={tickerRef}
            display="flex"
            whiteSpace="nowrap"
            willChange="transform"
          >
            {Array.from({ length: REPEATS }).map((_, i) => (
              <Text
                key={i}
                as="span"
                display="inline-block"
                flexShrink={0}
                fontSize={{ base: "46px", md: "84px" }}
                fontWeight="800"
                lineHeight="1"
                color={colors.border}
                userSelect="none"
                aria-hidden={i > 0 ? "true" : undefined}
              >
                {TICKER_TEXT}
              </Text>
            ))}
          </Box>
        </Box>

        {/* ── Skill rows ──────────────────────────────────────── */}
        <VStack align="stretch" spacing={0}>
          {skillsData.map((category, index) => (
            <Grid
              data-skill-row
              key={category.category}
              templateColumns={{ base: "1fr", md: ".42fr 1fr" }}
              gap={{ base: 4, md: 8 }}
              py={{ base: 6, md: 7 }}
              borderTop="1px solid"
              borderColor={colors.border}
            >
              <Text fontSize={{ base: "24px", md: "34px" }} fontWeight="700" lineHeight="1.05">
                {String(index + 1).padStart(2, "0")} / {category.category}
              </Text>
              <HStack spacing={3} flexWrap="wrap">
                {category.skills.map((skill) => (
                  <StudioPill key={skill} tone={index % 2 ? "accent" : "primary"}>
                    {skill}
                  </StudioPill>
                ))}
              </HStack>
            </Grid>
          ))}
        </VStack>
      </Box>
    </StudioSection>
  );
};

export default Skills;