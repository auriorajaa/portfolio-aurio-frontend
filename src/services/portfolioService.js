// src/services/portfolioService.js
import { ref, set, get, update } from "firebase/database";
import { database } from "../config/firebase";

const PORTFOLIO_PATH = "portfolio";

// Initialize portfolio data in Firebase
export const initializePortfolioData = async (data) => {
  try {
    const portfolioRef = ref(database, PORTFOLIO_PATH);
    await set(portfolioRef, data);
    return data;
  } catch (error) {
    console.error("Error initializing portfolio data:", error);
    throw error;
  }
};

// Get portfolio data
export const getPortfolioData = async () => {
  try {
    const portfolioRef = ref(database, PORTFOLIO_PATH);
    const snapshot = await get(portfolioRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    throw error;
  }
};

// Update personal info
export const updatePersonalInfo = async (personalInfo) => {
  try {
    const personalInfoRef = ref(database, `${PORTFOLIO_PATH}/personalInfo`);
    await update(personalInfoRef, personalInfo);
    return personalInfo;
  } catch (error) {
    console.error("Error updating personal info:", error);
    throw error;
  }
};

// Update experiences
export const updateExperiences = async (experiences) => {
  try {
    const experiencesRef = ref(database, `${PORTFOLIO_PATH}/experiences`);
    await set(experiencesRef, experiences);
    return experiences;
  } catch (error) {
    console.error("Error updating experiences:", error);
    throw error;
  }
};

// Update projects
export const updateProjects = async (projects) => {
  try {
    const projectsRef = ref(database, `${PORTFOLIO_PATH}/projects`);
    await set(projectsRef, projects);
    return projects;
  } catch (error) {
    console.error("Error updating projects:", error);
    throw error;
  }
};

// Update education
export const updateEducation = async (education) => {
  try {
    const educationRef = ref(database, `${PORTFOLIO_PATH}/education`);
    await set(educationRef, education);
    return education;
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
};

// Update certifications
export const updateCertifications = async (certifications) => {
  try {
    const certificationsRef = ref(database, `${PORTFOLIO_PATH}/certifications`);
    await set(certificationsRef, certifications);
    return certifications;
  } catch (error) {
    console.error("Error updating certifications:", error);
    throw error;
  }
};

// Update achievements
export const updateAchievements = async (achievements) => {
  try {
    const achievementsRef = ref(database, `${PORTFOLIO_PATH}/achievements`);
    await set(achievementsRef, achievements);
    return achievements;
  } catch (error) {
    console.error("Error updating achievements:", error);
    throw error;
  }
};

// Update activities
export const updateActivities = async (activities) => {
  try {
    const activitiesRef = ref(database, `${PORTFOLIO_PATH}/activities`);
    await set(activitiesRef, activities);
    return activities;
  } catch (error) {
    console.error("Error updating activities:", error);
    throw error;
  }
};

// Update skills
export const updateSkills = async (skills) => {
  try {
    const skillsRef = ref(database, `${PORTFOLIO_PATH}/skills`);
    await set(skillsRef, skills);
    return skills;
  } catch (error) {
    console.error("Error updating skills:", error);
    throw error;
  }
};

// Update entire portfolio data
export const updatePortfolioData = async (data) => {
  try {
    const portfolioRef = ref(database, PORTFOLIO_PATH);
    await update(portfolioRef, data);
    return data;
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    throw error;
  }
};
