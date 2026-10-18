import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";

const Hero = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bio =
    personalInfo.bio ||
    "Software engineer focused on backend systems, REST APIs, and cloud workflows.";

  const sentences = bio.match(/[^.!?]+[.!?]+/g) || [bio];
  const headline = sentences[0].trim();
  const lead = sentences.slice(1).join(" ").trim() || headline;

  const place = personalInfo.location || "Jakarta";

  return (
    <Box
      as="section"
      id="hero"
      bg={colors.navyGradient}
      color={colors.onNavy}
      borderBottom="4px solid"
      borderColor={colors.navyDark}
    >
      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        pb={{ base: 12, md: 16 }}
      >
        {/* Edition strip */}
        <Flex
          justify="space-between"
          align="center"
          gap={4}
          pb={3}
          borderBottom="1px solid rgba(255,255,255,0.35)"
          fontSize="12px"
          fontWeight="700"
          letterSpacing=".14em"
          textTransform="uppercase"
          color="#c9dcf1"
        >
          <Text>{today}</Text>
          <Text display={{ base: "none", md: "block" }}>
            {[personalInfo.location]
              .filter(Boolean)
              .join(" · ") || "Software Engineer"}
          </Text>
        </Flex>

        {/* Masthead */}
        <Box
          textAlign="center"
          py={{ base: 7, md: 9 }}
          borderBottom="3px double rgba(255,255,255,0.5)"
        >
          <Heading
            as="h1"
            fontSize={{ base: "44px", md: "84px" }}
            fontWeight="800"
            lineHeight="1.05"
            letterSpacing="-.01em"
            textShadow="0 2px 4px rgba(9,24,42,0.45)"
          >
            {personalInfo.name || "Aurio Rajaa"}
          </Heading>
          <Text
            mt={3}
            fontSize={{ base: "12px", md: "14px" }}
            fontWeight="700"
            letterSpacing=".3em"
            textTransform="uppercase"
            color="#c9dcf1"
          >
            {personalInfo.title || "Software Engineer"}
          </Text>
        </Box>

        {/* Lead story */}
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" }}
          gap={{ base: 8, lg: 12 }}
          mt={{ base: 8, lg: 10 }}
          alignItems="start"
        >
          {/* Story photo — the face of the news */}
          <Box order={{ base: 2, lg: 2 }}>
            <Box
              bg="linear-gradient(180deg, #ffffff 0%, #e8eef5 100%)"
              p="12px"
              border="1px solid rgba(255,255,255,0.85)"
              boxShadow="inset 0 1px 0 #ffffff, 0 18px 40px rgba(9,24,42,0.5)"
            >
              <img
                src="/profilepic.png"
                alt={personalInfo.name || "Aurio Rajaa"}
                width="100%"
                height="100%"
                loading="eager"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  border: "1px solid #c9d6e4",
                }}
              />
            </Box>
            <Text
              mt={3}
              fontSize="14px"
              fontStyle="italic"
              lineHeight="1.6"
              color="#c9dcf1"
              textAlign="center"
            >
              {personalInfo.name || "Aurio Rajaa"} — photographed in {place}.
            </Text>
          </Box>

          {/* Headline + lead */}
          <Box order={{ base: 1, lg: 1 }}>
            <Heading
              as="h2"
              fontSize={{ base: "28px", md: "38px" }}
              fontWeight="700"
              lineHeight="1.25"
              textShadow="0 2px 3px rgba(9,24,42,0.4)"
              mb={4}
            >
              {headline}
            </Heading>
            <Box w="64px" h="3px" bg="#ffffff" opacity=".75" mb={5} />
            <Text
              fontSize={{ base: "17px", md: "19px" }}
              lineHeight="1.85"
              color="#dbe7f5"
              mb={8}
            >
              {lead}
            </Text>
            <Flex gap={3} flexWrap="wrap">
              <Button
                as={Link}
                href="#projects"
                variant="classicWhite"
                h="50px"
                px={8}
                fontSize="16px"
              >
                View Projects
              </Button>
              <Button
                as={Link}
                href="#contact"
                variant="classicOnDark"
                h="50px"
                px={8}
                fontSize="16px"
              >
                Contact Me
              </Button>
            </Flex>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Hero;
