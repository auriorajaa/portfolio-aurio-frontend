import React, { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

// Components
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
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
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

const App = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/CV_AurioRajaa.pdf";
      link.download = "CV_AurioRajaa.pdf";
      link.click();
      setIsDownloading(false);
      toast({
        title: "Download started",
        description: "Your resume is being downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  return (
    <Box position="relative">
      <Helmet>
        <title>
          {personalInfo.name} - {personalInfo.title}
        </title>
        <meta name="description" content={personalInfo.bio} />
        <meta
          name="keywords"
          content="software engineer, web development, react, django, java"
        />
        <meta name="author" content={personalInfo.name} />
      </Helmet>

      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Hero />
      <Education />
      {/* <About /> Non-active for now */}
      <Experience />
      <Projects />
      <Skills />
      <Activities />
      <Achievements />
      {/* <Articles /> Non-active for now */}
      <Contact />
      <ScrollToTopButton />
      <Footer />
    </Box>
  );
};

export default App;
