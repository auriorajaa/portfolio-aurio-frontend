import React, { useMemo, useRef } from "react";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const About = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const personalInfo = portfolioData.personalInfo || {};
  const stats = useMemo(
    () => [
      ["Projects", portfolioData.projects?.length || 0],
      ["Work entries", portfolioData.experiences?.length || 0],
      // ["Public notes", "Live"],
    ],
    [portfolioData],
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-about-reveal]", {
        y: 18,
        autoAlpha: 0,
        duration: 0.62,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 76%",
          once: true,
        },
      });
      gsap.from("[data-about-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.85,
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
    <StudioSection id="about" eyebrow="Dossier" title="The bio sits like a caption, not a billboard.">
      <Grid ref={rootRef} templateColumns={{ base: "1fr", lg: ".42fr 1fr" }} gap={{ base: 8, lg: 12 }}>
        <VStack align="stretch" spacing={0} borderTop="1px solid" borderColor={colors.border}>
          {stats.map(([label, value]) => (
            <HStack
              data-about-reveal
              key={label}
              justify="space-between"
              py={5}
              borderBottom="1px solid"
              borderColor={colors.border}
            >
              <Text fontSize="15px" color={colors.muted}>
                {label}
              </Text>
              <Text fontSize="22px" fontWeight="800">
                {value}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Box>
          <Text data-about-reveal fontSize={{ base: "24px", md: "34px" }} lineHeight="1.22" fontWeight="700">
            {personalInfo.title || "Software Engineer"} working across APIs,
            content systems, product interfaces, and cloud workflows.
          </Text>
          <Box data-about-line h="1px" bg={colors.text} my={{ base: 6, md: 8 }} />
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <Text data-about-reveal fontSize="16px" lineHeight="1.76" color={colors.text}>
              {personalInfo.bio}
            </Text>
            <Text data-about-reveal fontSize="16px" lineHeight="1.76" color={colors.muted}>
              The site is arranged like a working desk: identity card, project
              grid, timeline, notes, and contact are close enough to scan, but
              each has its own weight on the page.
            </Text>
          </Grid>
        </Box>
      </Grid>
    </StudioSection>
  );
};

export default About;
