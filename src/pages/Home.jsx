// src/pages/Home.jsx
import React from "react";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import Experience from "../components/sections/Experience";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Activities from "../components/sections/Activities";
import Achievements from "../components/sections/Achievements";
import Contact from "../components/sections/Contact";
import Articles from "../components/sections/Articles";
import { usePortfolio } from "../contexts/PortfolioContext";

const Home = ({ isDownloading, handleDownload }) => {
  const { portfolioData, loading } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const canonicalUrl = "https://aurio.work/";
  const title =
    personalInfo.seoTitle ||
    `${personalInfo.name || "Aurio Rajaa"} - ${personalInfo.title || "Software Engineer"}`;
  const description =
    personalInfo.seoDescription ||
    personalInfo.bio ||
    "Aurio Rajaa is a software engineer from Jakarta focused on backend, cloud, and full-stack product systems.";
  const imageUrl = "https://aurio.work/profilepic.png";

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" color="retro.blue" />
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
        <meta
          name="keywords"
          content="Aurio Rajaa, aurio.work, Software Engineer, Backend Engineer, Spring Boot, Django REST Framework, React, Next.js, Google Cloud, Jakarta"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="aurio.work" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={`${personalInfo.name || "Aurio Rajaa"} profile photo`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: personalInfo.name || "Aurio Rajaa",
            url: canonicalUrl,
            image: imageUrl,
            jobTitle: personalInfo.title || "Software Engineer",
            description,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jakarta",
              addressCountry: "ID",
            },
            sameAs: [personalInfo.github, personalInfo.linkedin].filter(Boolean),
            knowsAbout: [
              "Spring Boot",
              "Django REST Framework",
              "React",
              "Next.js",
              "Google Cloud Platform",
              "Java",
              "TypeScript",
            ],
          })}
        </script>
      </Helmet>

      <Layout isDownloading={isDownloading} handleDownload={handleDownload}>
        <Hero />
        <Articles />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Activities />
        <Achievements />
        <Contact />
      </Layout>
    </Box>
  );
};

export default Home;
