import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";

const About = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();

  const facts = [
    personalInfo.location && { label: "Based in", value: personalInfo.location },
    { label: "Focus", value: "Backend systems, APIs & web applications" },
    personalInfo.title && { label: "Role", value: personalInfo.title },
    { label: "Response time", value: "Within 24–48 hours" },
  ].filter(Boolean);

  return (
    <StudioSection
      id="about"
      title="About"
      watermark="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=50"
    >
      {/* Full-width bio, set like editorial columns on wide screens */}
      {personalInfo.bio && (
        <Text
          fontSize={{ base: "17px", md: "18px" }}
          lineHeight="1.95"
          color={colors.text}
          sx={{
            columnCount: { base: 1, lg: 2 },
            columnGap: "56px",
            columnRule: `1px solid ${colors.border}`,
          }}
        >
          {personalInfo.bio}
        </Text>
      )}

      {/* Facts strip along the bottom */}
      <Grid
        templateColumns={{ base: "1fr 1fr", md: `repeat(${facts.length}, 1fr)` }}
        borderTop="3px solid"
        borderColor={colors.heading}
        mt={{ base: 10, md: 12 }}
      >
        {facts.map((fact, index) => (
          <Box
            key={fact.label}
            px={{ base: 4, md: 6 }}
            py={{ base: 5, md: 6 }}
            borderLeft={{
              base: index % 2 === 1 ? "1px solid" : "none",
              md: index === 0 ? "none" : "1px solid",
            }}
            borderTop={{
              base: index >= 2 ? "1px solid" : "none",
              md: "none",
            }}
            borderColor={colors.borderSoft}
          >
            <Text
              fontSize="12px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing=".1em"
              color={colors.muted}
              mb={1}
            >
              {fact.label}
            </Text>
            <Text fontSize={{ base: "15px", md: "17px" }} fontWeight="700" color={colors.heading}>
              {fact.value}
            </Text>
          </Box>
        ))}
      </Grid>
    </StudioSection>
  );
};

export default About;
