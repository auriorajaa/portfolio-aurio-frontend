// src/pages/Home.jsx
import React, { useLayoutEffect } from "react";
import { Box, Center, Grid, Skeleton, SkeletonText } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PublicLayout from "../components/layout/PublicLayout";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Gallery from "../components/sections/Gallery";
import Articles from "../components/sections/Articles";
import { PublicShell } from "../components/public/brutal";
import { usePortfolio } from "../contexts/PortfolioContext";
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
      // Clear state so we do not re-scroll on refresh.
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
      <PublicShell minH="100vh" bg="#FCF7EF" position="relative">
        <Box
          position="relative"
          maxW="820px"
          mx="auto"
          px={{ base: 6, md: 10 }}
          pt={{ base: 22, md: 34 }}
        >
          <Center mb={12} gap={4}>
            <Box as="span" className="spin" display="inline-flex" aria-hidden="true">
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 6 C 33 21, 36.5 25.5, 49 34 C 36.5 41, 33 45.5, 32 58 C 31 45.5, 27.5 41, 15 34 C 27.5 25.5, 31 21, 32 6 Z"
                  fill="#FFD23F"
                  stroke="#17181C"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Center>

          <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={6} mb={10}>
            <Skeleton
              startColor="#CFF3E6"
              endColor="#FFF1BF"
              height="340px"
              borderRadius="10px"
              border="2px solid #17181C"
            />
            <Box pt={4}>
              <Skeleton
                startColor="#CFF3E6"
                endColor="#FFF1BF"
                height="36px"
                width="70%"
                mb={5}
                borderRadius="6px"
                border="2px solid #17181C"
              />
              <SkeletonText
                startColor="#CFF3E6"
                endColor="#FFF1BF"
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
                startColor="#CFF3E6"
                endColor="#FFF1BF"
                height="220px"
                borderRadius="10px"
                border="2px solid #17181C"
              />
            ))}
          </Grid>
        </Box>
      </PublicShell>
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

      <PublicLayout isDownloading={isDownloading} handleDownload={handleDownload}>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Gallery />
        <Articles />
      </PublicLayout>
    </Box>
  );
};

export default Home;
