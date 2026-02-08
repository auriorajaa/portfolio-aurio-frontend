// src/components/admin/ExperienceForm.jsx
import React, { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ArrayInput from "../ui/ArrayInput";

const ExperienceForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    period: "",
    location: "",
    type: "Full-time",
    description: [],
    technologies: [],
    logo: "",
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOpen();
  };

  const confirmSave = () => {
    setLoading(true);
    onClose();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">
        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Company Name
          </FormLabel>
          <Input
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Company name"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
            Position
          </FormLabel>
          <Input
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Job title"
            size="md"
            fontSize="13px"
            borderRadius="2px"
          />
        </FormControl>

        <HStack spacing={3}>
          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Period
            </FormLabel>
            <Input
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              placeholder="e.g. Jan 2023 – Present"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>

          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Location
            </FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City or Remote"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <HStack spacing={3}>
          <FormControl isRequired flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Type
            </FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              size="md"
              fontSize="13px"
              borderRadius="2px"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Project-based">Project-based</option>
            </Select>
          </FormControl>

          <FormControl flex={1}>
            <FormLabel fontSize="13px" fontWeight="bold" mb={2}>
              Company Logo URL
            </FormLabel>
            <Input
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
              size="md"
              fontSize="13px"
              borderRadius="2px"
            />
          </FormControl>
        </HStack>

        <ArrayInput
          label="Key Responsibilities (Description Points)"
          value={formData.description}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, description: val }))
          }
          placeholder="Add a responsibility"
        />

        <ArrayInput
          label="Technologies Used"
          value={formData.technologies}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, technologies: val }))
          }
          placeholder="Add a technology"
        />

        <HStack spacing={3} pt={3}>
          <Button
            type="submit"
            variant="facebook"
            size="md"
            h="36px"
            fontSize="13px"
            flex={1}
            isLoading={loading}
          >
            Save
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              flex={1}
              size="md"
              h="36px"
              fontSize="13px"
              borderColor="facebook.border"
              borderRadius="2px"
            >
              Cancel
            </Button>
          )}
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="2px">
            <AlertDialogHeader fontSize="14px" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody fontSize="13px">
              Are you sure you want to save this experience?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                size="md"
                fontSize="13px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={confirmSave}
                ml={2}
                size="md"
                fontSize="13px"
                isLoading={loading}
              >
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </form>
  );
};

export default ExperienceForm;
