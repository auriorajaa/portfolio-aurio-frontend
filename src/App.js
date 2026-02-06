import React, { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

// Layout
import Layout from "./components/layout/Layout";

// Sections
import Hero from "./components/sections/Hero";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import Activities from "./components/sections/Activities";
import Achievements from "./components/sections/Achievements";
import Contact from "./components/sections/Contact";

// Data
import { personalInfo } from "./data/portfolioData";

const App = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const handleDownload = () => {
    setIsDownloading(true);
    
    const link = document.createElement("a");
    link.href = `${window.location.origin}/CV_AurioRajaa.pdf`;
    link.download = "CV_AurioRajaa.pdf";
    link.target = "_blank";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setIsDownloading(false);
      toast({
        title: "Download started",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 500);
  };

  return (
    <Box>
      <Helmet>
        <title>{personalInfo.name} - {personalInfo.title}</title>
        <meta name="description" content={personalInfo.bio} />
      </Helmet>

      <Layout isDownloading={isDownloading} handleDownload={handleDownload}>
        {/* Retro Facebook Timeline Style Layout */}
        <Hero />
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

export default App;