import React from "react";
import { Box, Grid, Link, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { LAGOON, DoodleAsterisk, DoodleHeart, DoodleTape } from "../public/studio";

const About = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};

  const facts = [
    personalInfo.location && { label: "based in", value: personalInfo.location },
    { label: "focus", value: "Backend systems, APIs & web apps" },
    { label: "reply time", value: "within 1-2 days" },
  ].filter(Boolean);

  return (
    <Box
      as="section"
      id="about"
      position="relative"
      bg={LAGOON.surface}
      py={{ base: 14, md: 20 }}
    >
      <Box maxW="1200px" mx="auto" px={{ base: 5, md: 8, lg: 10 }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }}
          gap={{ base: 10, lg: 16 }}
          alignItems="start"
        >
          {/* Left — heading */}
          <Box>
            <Text
              className="public-mono"
              fontSize="13px"
              fontWeight="500"
              letterSpacing=".04em"
              color={LAGOON.coralDeep}
              mb={4}
            >
              01 / about
            </Text>
            <Text
              fontFamily="heading"
              fontSize={{ base: "34px", md: "44px" }}
              fontWeight="700"
              lineHeight="1.1"
              letterSpacing="-.035em"
              color={LAGOON.heading}
            >
              A bit about me
            </Text>
            <Text
              className="public-hand"
              fontSize={{ base: "26px", md: "28px" }}
              fontWeight="600"
              color={LAGOON.primary}
              transform="rotate(-2deg)"
              display="inline-block"
              mt={3}
            >
              nice to meet you!
            </Text>
            <Box mt={5} display="inline-flex" alignItems="flex-end" gap={2}>
              <DoodleHeart size={24} />
              <DoodleAsterisk size={22} color={LAGOON.sun} />
            </Box>
          </Box>

          {/* Right — bio + facts */}
          <Box>
            {personalInfo.bio && (
              <Text
                fontSize={{ base: "17px", md: "19px" }}
                lineHeight="1.85"
                color={LAGOON.text}
                maxW="640px"
              >
                {personalInfo.bio}
              </Text>
            )}

            <Grid
              templateColumns={{ base: "1fr", sm: `repeat(${Math.min(facts.length, 3)}, 1fr)` }}
              gap={6}
              mt={10}
              position="relative"
            >
              <DoodleTape
                w={110}
                h={20}
                color="rgba(14,140,134,0.55)"
                rotation={2}
                top="-12px"
                left="46%"
                ml="-55px"
              />
              {facts.map((fact) => (
                <Box
                  key={fact.label}
                  borderTop="2px solid"
                  borderColor={LAGOON.ink}
                  pt={3}
                >
                  <Text
                    className="public-mono"
                    fontSize="12px"
                    fontWeight="500"
                    color={LAGOON.muted}
                    mb={1}
                  >
                    {fact.label}
                  </Text>
                  <Text fontSize="15px" fontWeight="700" color={LAGOON.heading}>
                    {fact.value}
                  </Text>
                </Box>
              ))}
            </Grid>

            <Link
              href="/#contact"
              display="inline-flex"
              alignItems="center"
              gap="8px"
              mt={10}
              position="relative"
              zIndex={1}
              fontSize="16px"
              fontWeight="700"
              color={LAGOON.primaryDark}
              _hover={{
                color: LAGOON.coralDeep,
                textDecoration: "none",
                gap: "12px",
              }}
              transition="all .16s ease"
            >
              Let&apos;s work together
              <ArrowRight size={16} />
            </Link>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
