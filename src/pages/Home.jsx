// src/pages/Home.jsx
import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Experience from "../components/sections/Experience";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Gallery from "../components/sections/Gallery";
import Contact from "../components/sections/Contact";
import Articles from "../components/sections/Articles";
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

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" color="brand.700" />
      </Center>
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
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Gallery />
        <Articles />
        <Contact />
      </Layout>
    </Box>
  );
};

export default Home;
