// src/components/admin/PortfolioDataManager.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Textarea,
  useToast,
  Heading,
  Text,
  Spinner,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
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

const PortfolioDataManager = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [editedData, setEditedData] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
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
  };

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
        <Heading size="md" mb={2} color="facebook.blue">
          Portfolio Data Management
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Manage your portfolio information. This data will be displayed on your
          public portfolio page.
        </Text>
      </Box>

      {!portfolioData && (
        <Box
          p={6}
          bg="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <VStack spacing={3}>
            <Text fontWeight="bold" color="blue.700">
              Portfolio data not initialized
            </Text>
            <Text fontSize="sm" color="gray.600">
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

      <Accordion allowToggle defaultIndex={[0]}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Edit Portfolio Data (JSON)
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Edit the JSON data below. Make sure to maintain valid JSON
                format.
              </Text>

              <Textarea
                value={editedData}
                onChange={(e) => setEditedData(e.target.value)}
                fontFamily="monospace"
                fontSize="xs"
                minH="500px"
                placeholder="Portfolio data in JSON format"
                bg="gray.50"
              />

              <HStack>
                <Button
                  bg="facebook.blue"
                  color="white"
                  onClick={handleSave}
                  isLoading={saving}
                  loadingText="Saving..."
                  _hover={{ bg: "facebook.darkBlue" }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  borderColor="facebook.border"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={handleInitialize}
                  isLoading={saving}
                  loadingText="Reinitializing..."
                >
                  Reinitialize from Local
                </Button>
              </HStack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Data Structure Reference
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              fontFamily="monospace"
              fontSize="xs"
              whiteSpace="pre-wrap"
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default PortfolioDataManager;
