// src/components/admin/PortfolioDataManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  Button,
  Textarea,
  useToast,
  Heading,
  Text,
  Spinner,
  Center,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useRetroColors } from "../ui/retro";
import {
  getPortfolioData,
  updatePortfolioData,
  initializePortfolioData,
} from "../../services/portfolioService";
import {
  personalInfo,
  experienceData,
  projects,
  educationData,
  certificationsData,
  achievements,
  universityActivities,
} from "../../data/portfolioData";

const PortfolioDataManager = ({ onDataChange }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [editedData, setEditedData] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const colors = useRetroColors();

  const loadPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();

      if (data) {
        setPortfolioData(data);
        setEditedData(JSON.stringify(data, null, 2));
      } else {
        // Initialize with default data from portfolioData.js
        const defaultData = {
          personalInfo,
          experiences: experienceData,
          projects,
          education: educationData,
          certifications: certificationsData,
          achievements,
          activities: universityActivities,
        };
        setPortfolioData(defaultData);
        setEditedData(JSON.stringify(defaultData, null, 2));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  const handleInitialize = async () => {
    try {
      setSaving(true);
      const defaultData = {
        personalInfo,
        experiences: experienceData,
        projects,
        education: educationData,
        certifications: certificationsData,
        achievements,
        activities: universityActivities,
      };

      await initializePortfolioData(defaultData);
      onDataChange?.();

      toast({
        title: "Success",
        description: "Portfolio data initialized successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      loadPortfolioData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize portfolio data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const parsedData = JSON.parse(editedData);
      await updatePortfolioData(parsedData);
      onDataChange?.();

      toast({
        title: "Success",
        description: "Portfolio data updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setPortfolioData(parsedData);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to save portfolio data. Please check JSON format.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (portfolioData) {
      setEditedData(JSON.stringify(portfolioData, null, 2));
      toast({
        title: "Reset",
        description: "Changes discarded",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="facebook.blue" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2} color={colors.link}>
          Portfolio Data Management
        </Heading>
        <Text fontSize="sm" color={colors.muted}>
          Manage your portfolio information. This data will be displayed on your
          public portfolio page.
        </Text>
      </Box>

      {!portfolioData && (
        <Box
          p={6}
          bg={colors.panelAlt}
          border="1px solid"
          borderColor={colors.border}
        >
          <VStack spacing={3}>
            <Text fontWeight="bold" color={colors.link}>
              Portfolio data not initialized
            </Text>
            <Text fontSize="sm" color={colors.muted}>
              Click the button below to initialize portfolio data from your
              local portfolio file.
            </Text>
            <Button
              bg="facebook.blue"
              color="white"
              onClick={handleInitialize}
              isLoading={saving}
              loadingText="Initializing..."
              _hover={{ bg: "facebook.darkBlue" }}
            >
              Initialize Portfolio Data
            </Button>
          </VStack>
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={4}>
        <Box
          gridColumn={{ base: "auto", xl: "span 2" }}
          border="1px solid"
          borderColor={colors.border}
          bg={colors.panelBg}
        >
          <Box
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <Text fontSize="13px" fontWeight="bold">
              Edit Portfolio Data (JSON)
            </Text>
          </Box>
          <VStack spacing={4} align="stretch" p={3}>
            <Text fontSize="sm" color={colors.muted}>
              Edit the JSON data below. Make sure to maintain valid JSON format.
            </Text>

            <Textarea
              value={editedData}
              onChange={(e) => setEditedData(e.target.value)}
              fontFamily="monospace"
              fontSize="sm"
              minH="520px"
              placeholder="Portfolio data in JSON format"
              bg={colors.panelAlt}
            />

            <Stack direction={{ base: "column", md: "row" }} spacing={2}>
              <Button
                variant="facebook"
                onClick={handleSave}
                isLoading={saving}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                borderColor={colors.border}
              >
                Reset
              </Button>
              <Button
                variant="facebookGray"
                onClick={handleInitialize}
                isLoading={saving}
                loadingText="Reinitializing..."
              >
                Reinitialize from Local
              </Button>
            </Stack>
          </VStack>
        </Box>

        <Box border="1px solid" borderColor={colors.border} bg={colors.panelBg}>
          <Box
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border}
            bg={colors.headerBg}
          >
            <Text fontSize="13px" fontWeight="bold">
              Data Structure Reference
            </Text>
          </Box>
          <Box
            p={4}
            bg={colors.panelAlt}
            fontFamily="monospace"
            fontSize="sm"
            whiteSpace="pre-wrap"
            minH="520px"
          >
            {`{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "github": "string",
    "linkedin": "string",
    "location": "string",
    "bio": "string"
  },
  "experiences": [array of experience objects],
  "projects": [array of project objects],
  "education": [array of education objects],
  "certifications": [array of certification objects],
  "achievements": [array of achievement objects],
  "activities": [array of activity objects]
}`}
          </Box>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default PortfolioDataManager;
