// src/pages/Home.jsx
import React from "react";
import { Box, Center, Grid, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Gallery from "../components/sections/Gallery";
import Articles from "../components/sections/Articles";
import ScrollBoat from "../components/public/ScrollSun";
// import MuralStrip from "../components/public/LagoonMural";
import { usePortfolio } from "../contexts/PortfolioContext";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  createPersonSchema,
  createWebsiteSchema,
} from "../utils/seo";

const Home = ({ isDownloading, handleDownload }) => {
  const { portfolioData, loading } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const location = useLocation();
  const canonicalUrl = absoluteUrl("/");
  const title = personalInfo.seoTitle || DEFAULT_TITLE;
  const description = personalInfo.seoDescription || personalInfo.bio || DEFAULT_DESCRIPTION;
  const imageUrl = absoluteUrl("/profilepic.png");
  const keywords = DEFAULT_KEYWORDS.join(", ");
  const personSchema = createPersonSchema(personalInfo);
  const websiteSchema = createWebsiteSchema();

  useLayoutEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
      // Bersihkan state biar tidak scroll ulang saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Land on the right section when arriving with a hash (e.g. /#projects
  // from an article or project page).
  useLayoutEffect(() => {
    if (loading || !location.hash) return;
    const el = document.getElementById(location.hash.replace("#", ""));
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [loading, location]);

  if (loading) {
    return (
      <Box minH="100vh" bg="#F5FBFB" position="relative">
        {/* Loading state drawn like the site itself: rising sun, wavy
            line, then paper skeletons instead of a spinner. */}
        <Box position="relative" maxW="820px" mx="auto" px={{ base: 6, md: 10 }} pt={{ base: 22, md: 34 }}>
          <Center mb={12} gap={4}>
            <Box
              as="span"
              className="spin"
              display="inline-flex"
              aria-hidden="true"
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="12" fill="#FFC857" stroke="#0B2F2F" strokeWidth="2.5" />
                <path
                  d="M32 13 V7 M32 51 V57 M13 32 H7 M51 32 H57 M19.7 19.7 L15.4 15.4 M44.3 19.7 L48.6 15.4 M19.7 44.3 L15.4 48.6 M44.3 44.3 L48.6 48.6"
                  stroke="#0B2F2F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Text className="public-hand" fontSize="30px" color="#0B4F4C">
              warming up the lagoon
            </Text>
          </Center>

          <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={6} mb={10}>
            <Skeleton
              startColor="#E3F4F1"
              endColor="#F5FBFB"
              height="340px"
              borderRadius="16px"
              border="1.5px solid #0B2F2F"
            />
            <Box pt={4}>
              <Skeleton
                startColor="#E3F4F1"
                endColor="#F5FBFB"
                height="36px"
                width="70%"
                mb={5}
                borderRadius="8px"
              />
              <SkeletonText
                startColor="#E3F4F1"
                endColor="#F5FBFB"
                spacing="4"
                skeletonHeight="4"
                noOfLines={6}
              />
            </Box>
          </Grid>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton
                key={i}
                startColor="#E3F4F1"
                endColor="#F5FBFB"
                height="220px"
                borderRadius="16px"
                border="1.5px solid #0B2F2F"
              />
            ))}
          </Grid>
        </Box>
        <ScrollBoat />
      </Box>
    );
  }

  return (
    <Box>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />
        <meta name="author" content={personalInfo.name || "Aurio Rajaa"} />
        <meta name="keywords" content={keywords} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:secure_url" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${personalInfo.name || "Aurio Rajaa"} profile photo`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:site" content="@auriorajaa" />
        <meta name="twitter:creator" content="@auriorajaa" />
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>

      <Layout isDownloading={isDownloading} handleDownload={handleDownload}>
        <Hero />
        <ScrollBoat />
        <About />
        {/* <MuralStrip variant="crab" /> */}
        <Projects />
        {/* <MuralStrip variant="school" /> */}
        <Experience />
        {/* <MuralStrip variant="shark" /> */}
        <Skills />
        {/* <MuralStrip variant="octo" /> */}
        <Education />
        {/* <MuralStrip variant="whale" /> */}
        <Gallery />
        {/* <MuralStrip variant="reef" /> */}
        <Articles />
      </Layout>
    </Box>
  );
};

export default Home;
