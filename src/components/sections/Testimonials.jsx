import React, { useMemo, useRef } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Testimonials = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const quotes = useMemo(() => {
    const experiences = portfolioData.experiences || [];
    const achievements = portfolioData.achievements || [];
    return [
      {
        quote: "Builds practical systems with the kind of clarity that makes complex work feel approachable.",
        source: experiences[0]?.company || "Collaborative project work",
      },
      {
        quote: "Comfortable moving between backend architecture, product interfaces, and cloud deployment details.",
        source: experiences[1]?.company || "Engineering practice",
      },
      {
        quote: achievements[0]?.title || "Recognized for cloud and AI computing work.",
        source: achievements[0]?.issuer || "Achievement archive",
      },
    ];
  }, [portfolioData.achievements, portfolioData.experiences]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from("[data-quote]", {
        y: 42,
        autoAlpha: 0,
        duration: 0.62,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <StudioSection id="testimonials" eyebrow="Signals" title="A few notes on the working style.">
      <Grid ref={rootRef} templateColumns={{ base: "1fr", lg: "1.2fr .8fr" }} gap={{ base: 5, md: 7 }}>
        <Box
          data-quote
          p={{ base: 6, md: 9 }}
          bg={colors.text}
          color={colors.bg}
          minH="320px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Text fontSize={{ base: "28px", md: "42px" }} lineHeight="1.08" fontWeight="700">
            "{quotes[0].quote}"
          </Text>
          <Text fontSize="15px" opacity={0.72}>
            {quotes[0].source}
          </Text>
        </Box>
        <Box display="grid" gap={{ base: 5, md: 7 }}>
          {quotes.slice(1).map((item) => (
            <Box
              data-quote
              key={item.quote}
              p={{ base: 5, md: 6 }}
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.borderSoft}
            >
              <Text fontSize="18px" lineHeight="1.62">
                "{item.quote}"
              </Text>
              <Text mt={4} fontSize="14px" color={colors.muted}>
                {item.source}
              </Text>
            </Box>
          ))}
        </Box>
      </Grid>
    </StudioSection>
  );
};

export default Testimonials;
