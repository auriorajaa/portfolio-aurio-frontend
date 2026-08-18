import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./contexts/AuthContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ArticlePage from "./pages/ArticlePage";
import ProjectPage from "./pages/ProjectPage";
import Playground from "./pages/Playground";
import Arcade from "./pages/Arcade";
import NotFound from "./pages/NotFound";

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
    <Router>
      <AuthProvider>
        <PortfolioProvider>
          <Box>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    isDownloading={isDownloading}
                    handleDownload={handleDownload}
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/article/:slug"
                element={
                  <ArticlePage
                    isDownloading={isDownloading}
                    handleDownload={handleDownload}
                  />
                }
              />
              <Route
                path="/project/:slug"
                element={
                  <ProjectPage
                    isDownloading={isDownloading}
                    handleDownload={handleDownload}
                  />
                }
              />
              <Route
                path="/playground"
                element={
                  <Playground
                    isDownloading={isDownloading}
                    handleDownload={handleDownload}
                  />
                }
              />
              <Route
                path="/arcade"
                element={
                  <Arcade
                    isDownloading={isDownloading}
                    handleDownload={handleDownload}
                  />
                }
              />
              <Route
                path="/dashboard-secure-panel"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/503"
                element={
                  <NotFound
                    code="503"
                    title="Service unavailable"
                    message="The portfolio is temporarily unavailable. Please retry from the homepage."
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Analytics />
          </Box>
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
