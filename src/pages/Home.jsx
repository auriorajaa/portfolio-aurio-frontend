// src/pages/Home.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
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

  if (loading) {
    return null; // Or show a loading spinner
  }

  return (
    <Box>
      <Helmet>
        <title>
          {portfolioData.personalInfo.name} - {portfolioData.personalInfo.title}
        </title>
        <meta name="description" content={portfolioData.personalInfo.bio} />
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
