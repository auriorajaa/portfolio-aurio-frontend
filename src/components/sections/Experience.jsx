import React, { useRef } from "react";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];
  const colors = useStudioColors();
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-exp-line]", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 76%", once: true },
      });
      gsap.from("[data-exp-item]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 76%", once: true },
      });
    },
    { scope: rootRef }
  );

  if (experienceData.length === 0) return null;

  return (
    <StudioSection id="experience" eyebrow="Timeline" title="Where I have worked.">
      <Box ref={rootRef} position="relative">
        {/* Vertical line */}
        <Box
          data-exp-line
          position="absolute"
          top={0}
          bottom={0}
          left={{ base: "19px", md: "23px" }}
          w="1px"
          bg={colors.borderSoft}
          zIndex={0}
        />

        <VStack align="stretch" spacing={0}>
          {experienceData.map((exp, index) => (
            <Grid
              data-exp-item
              key={exp.id || `${exp.company}-${index}`}
              templateColumns={{ base: "40px 1fr", md: "48px 1fr" }}
              gap={{ base: 4, md: 6 }}
              pb={{ base: 8, md: 10 }}
              _last={{ pb: 0 }}
            >
              {/* ── Left: dot + logo ── */}
              <Box display="flex" flexDirection="column" alignItems="center" position="relative" zIndex={1}>
                {/* Logo box (acts as the dot) */}
                <Box
                  w={{ base: "40px", md: "48px" }}
                  h={{ base: "40px", md: "48px" }}
                  bg={colors.bg}
                  border="1px solid"
                  borderColor={colors.borderSoft}
                  overflow="hidden"
                  flexShrink={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {exp.logo ? (
                    <LazyLoadImage
                      src={exp.logo}
                      alt={exp.company}
                      effect="opacity"
                      width="100%"
                      height="100%"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <Box w="8px" h="8px" borderRadius="full" bg={colors.muted} />
                  )}
                </Box>
              </Box>

              {/* ── Right: content ── */}
              <Box pt="10px" pb={{ base: 4, md: 6 }}>
                {/* Period */}
                <Text
                  fontSize="12px"
                  fontWeight="600"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  color={colors.accent}
                  mb={2}
                >
                  {exp.period}
                </Text>

                {/* Position + company */}
                <Text
                  fontSize={{ base: "20px", md: "26px" }}
                  fontWeight="800"
                  lineHeight="1.1"
                  letterSpacing="-0.02em"
                  mb={1}
                >
                  {exp.position}
                </Text>
                <Text fontSize="14px" color={colors.muted} mb={4}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Text>

                {/* Description */}
                {exp.description && (
                  <VStack align="stretch" spacing={2} mb={4}>
                    {(Array.isArray(exp.description)
                      ? exp.description.slice(0, 3)
                      : [exp.description]
                    ).map(
                      (line, i) =>
                        line && (
                          <Box key={i} display="flex" gap={3} alignItems="flex-start">
                            <Text fontSize={{ base: "14px", md: "15px" }} lineHeight="1.72" color={colors.muted}>
                              {line}
                            </Text>
                          </Box>
                        )
                    )}
                  </VStack>
                )}

                {/* Technologies */}
                {exp.technologies?.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap">
                    {exp.technologies.slice(0, 5).map((tech) => (
                      <Box
                        key={tech}
                        fontSize="11px"
                        fontWeight="600"
                        px={2}
                        py="3px"
                        border="1px solid"
                        borderColor={colors.borderSoft}
                        color={colors.muted}
                        letterSpacing="0.03em"
                      >
                        {tech}
                      </Box>
                    ))}
                  </HStack>
                )}
              </Box>
            </Grid>
          ))}
        </VStack>
      </Box>
    </StudioSection>
  );
};

export default Experience;