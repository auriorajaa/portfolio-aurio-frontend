import React, { useMemo, useRef } from "react";
import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BookOpen, Calendar, Star } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioPill, StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();
  const rootRef = useRef(null);

  const allEducation = useMemo(
    () => [
      ...(portfolioData.education || []),
      ...(portfolioData.certifications || []),
    ],
    [portfolioData.education, portfolioData.certifications]
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-education-item]", {
        y: 34,
        autoAlpha: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 74%",
          once: true,
        },
      });
    },
    { scope: rootRef }
  );

  if (allEducation.length === 0) return null;

  return (
    <StudioSection id="education" eyebrow="Learning" title="Degree">
      <VStack ref={rootRef} align="stretch" spacing={0}>
        {allEducation.map((edu, index) => {
          const isLast = index === allEducation.length - 1;
          const scoreValue = edu.gpa || edu.score;
          const hasAchievements = edu.achievements?.length > 0;
          const hasSkills = edu.skills?.length > 0;
          const hasDescription = !!edu.description;

          return (
            <Box
              data-education-item
              key={`${edu.title}-${index}`}
              borderTop="1px solid"
              borderBottom={isLast ? "1px solid" : "none"}
              borderColor={colors.borderSoft}
              py={{ base: 6, md: 8 }}
              // _hover={{ bg: colors.surface }}
              transition="background .18s ease"
            >
              <Grid
                templateColumns={{ base: "1fr", md: "200px 1fr" }}
                gap={{ base: 5, md: 10 }}
              >
                {/* ── Left: logo + meta ── */}
                <Box>
                  {/* Logo */}
                  <Box
                    w={{ base: "56px", md: "72px" }}
                    h={{ base: "56px", md: "72px" }}
                    overflow="hidden"
                    bg={colors.surfaceAlt}
                    border="1px solid"
                    borderColor={colors.borderSoft}
                    mb={4}
                    flexShrink={0}
                  >
                    {edu.logo ? (
                      <LazyLoadImage
                        src={edu.logo}
                        alt={edu.title}
                        effect="opacity"
                        width="100%"
                        height="100%"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        w="100%" h="100%"
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        <BookOpen size={20} color={colors.muted} />
                      </Box>
                    )}
                  </Box>

                  {/* Period */}
                  {edu.period && (
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Calendar size={12} color={colors.muted} />
                      <Text fontSize="12px" color={colors.muted} letterSpacing="0.02em">
                        {edu.period}
                      </Text>
                    </Box>
                  )}

                  {/* Status + score pills */}
                  <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                    {(edu.status || edu.type) && (
                      <StudioPill tone={edu.status === "Completed" ? "primary" : "accent"}>
                        {edu.status || edu.type}
                      </StudioPill>
                    )}
                    {scoreValue && (
                      <Box
                        display="flex" alignItems="center" gap={1}
                        px={2} py="3px"
                        border="1px solid"
                        borderColor={colors.borderSoft}
                        fontSize="11px"
                        fontWeight="700"
                        color={colors.accent}
                        letterSpacing="0.04em"
                      >
                        <Star size={10} />
                        {scoreValue}
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* ── Right: content ── */}
                <Box minW={0}>
                  {/* Institution */}
                  <Text
                    fontSize={{ base: "20px", md: "26px" }}
                    fontWeight="800"
                    lineHeight="1.1"
                    letterSpacing="-0.02em"
                    mb={1}
                  >
                    {edu.title}
                  </Text>

                  {/* Degree / major */}
                  {(edu.degree || edu.major) && (
                    <Text
                      fontSize={{ base: "14px", md: "15px" }}
                      color={colors.accent}
                      fontWeight="600"
                      letterSpacing="0.01em"
                      mb={3}
                    >
                      {edu.degree || edu.major}
                    </Text>
                  )}

                  {/* Description */}
                  {hasDescription && (
                    <Text
                      fontSize={{ base: "14px", md: "15px" }}
                      color={colors.muted}
                      lineHeight="1.7"
                      mb={4}
                      maxW="800px"
                    >
                      {edu.description}
                    </Text>
                  )}

                  {/* Achievements */}
                  {hasAchievements && (
                    <Box mb={4}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        mb={2}
                      >
                        {/* <Award size={13} color={colors.muted} /> */}
                        <Text
                          fontSize="11px"
                          fontWeight="700"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          color={colors.muted}
                        >
                          Achievements
                        </Text>
                      </Box>
                      <VStack align="stretch" spacing={1}>
                        {edu.achievements.map((a, i) => (
                          <Box
                            key={i}
                            display="flex"
                            alignItems="flex-start"
                            gap={2}
                          >
                            <Text
                              fontSize={{ base: "13px", md: "14px" }}
                              color={colors.text}
                              lineHeight="1.65"
                            >
                              - {a}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* Skills */}
                  {hasSkills && (
                    <Box>
                      <Text
                        fontSize="11px"
                        fontWeight="700"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color={colors.muted}
                        mb={2}
                      >
                        Skills covered
                      </Text>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {edu.skills.map((skill, i) => (
                          <Box
                            key={i}
                            fontSize="12px"
                            fontWeight="500"
                            px={3}
                            py="4px"
                            border="1px solid"
                            borderColor={colors.borderSoft}
                            color={colors.muted}
                            letterSpacing="0.02em"
                            _hover={{ borderColor: colors.accent, color: colors.text }}
                            transition="border-color .15s ease, color .15s ease"
                          >
                            {skill}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Box>
          );
        })}
      </VStack>
    </StudioSection>
  );
};

export default Education;