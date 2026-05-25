// src/contexts/PortfolioContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getPortfolioData } from "../services/portfolioService";
import {
  personalInfo as defaultPersonalInfo,
  experienceData as defaultExperiences,
  projects as defaultProjects,
  educationData as defaultEducation,
  certificationsData as defaultCertifications,
  achievements as defaultAchievements,
  universityActivities as defaultActivities,
} from "../data/portfolioData";

const PortfolioContext = createContext();
const FIREBASE_LOAD_TIMEOUT_MS = 4500;

const withTimeout = (promise, timeoutMs) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase portfolio load timed out")), timeoutMs),
    ),
  ]);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: defaultPersonalInfo,
    experiences: defaultExperiences,
    projects: defaultProjects,
    education: defaultEducation,
    certifications: defaultCertifications,
    achievements: defaultAchievements,
    activities: defaultActivities,
  });
  const [loading, setLoading] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const firebaseData = await withTimeout(
        getPortfolioData(),
        FIREBASE_LOAD_TIMEOUT_MS,
      );

      if (firebaseData) {
        setPortfolioData(firebaseData);
        setUseFirebase(true);
      } else {
        // Use default local data
        setUseFirebase(false);
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      // Fall back to default data
      setUseFirebase(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshPortfolioData = async () => {
    await loadPortfolioData();
  };

  const value = {
    portfolioData,
    loading,
    useFirebase,
    refreshPortfolioData,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
