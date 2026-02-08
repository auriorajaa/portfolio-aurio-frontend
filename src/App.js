import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { PortfolioProvider } from "./contexts/PortfolioContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ArticlePage from "./pages/ArticlePage";

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
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route
                path="/dashboard-secure-panel"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
