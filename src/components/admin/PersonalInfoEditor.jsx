// src/components/admin/PersonalInfoEditor.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  getPortfolioData,
  updatePersonalInfo,
} from "../../services/portfolioService";

const PersonalInfoEditor = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    github: "",
    linkedin: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const toast = useToast();

  // Fetch existing personal info on mount
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        setFetching(true);
        const data = await getPortfolioData();
        if (data?.personalInfo) {
          setFormData(data.personalInfo);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load personal information",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setFetching(false);
      }
    };

    loadPersonalInfo();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.title || !formData.bio) {
      toast({
        title: "Validation Error",
        description: "Name, title, email, and bio are required fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      await updatePersonalInfo(formData);
      toast({
        title: "Success",
        description: "Personal information updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update personal information",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="facebook.blue" />
      </Center>
    );
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3} align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Full Name
            </FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Professional Title
            </FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Software Engineer"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Email
            </FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              GitHub URL
            </FormLabel>
            <Input
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="https://github.com/username"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              LinkedIn URL
            </FormLabel>
            <Input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Location
            </FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              size="md"
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Bio
            </FormLabel>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief professional summary"
              rows={4}
              fontSize="13px"
              borderRadius="2px"
              _hover={{ borderColor: "facebook.blue" }}
              _focus={{
                borderColor: "facebook.blue",
                boxShadow: "0 0 0 1px #3b5998",
              }}
            />
          </FormControl>

          <Button
            type="submit"
            variant="facebook"
            isLoading={loading}
            loadingText="Saving..."
            size="md"
            fontSize="13px"
            mt={2}
          >
            Save Changes
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PersonalInfoEditor;
