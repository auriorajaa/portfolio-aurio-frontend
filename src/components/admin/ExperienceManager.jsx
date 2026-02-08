// src/components/admin/ExperienceManager.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  IconButton,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateExperiences,
} from "../../services/portfolioService";
import ExperienceForm from "./ExperienceForm";
import Pagination from "../ui/Pagination";

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadExperiences();
    // eslint-disable-next-line
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setExperiences(data?.experiences || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load experiences",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedExp(null);
    onOpen();
  };

  const handleEdit = (exp) => {
    setSelectedExp(exp);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      const updated = experiences.filter((exp) => exp.id !== id);
      await updateExperiences(updated);
      setExperiences(updated);
      toast({
        title: "Success",
        description: "Experience deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (expData) => {
    try {
      let updated;
      if (selectedExp) {
        // Update existing
        updated = experiences.map((exp) =>
          exp.id === selectedExp.id ? { ...expData, id: selectedExp.id } : exp,
        );
      } else {
        // Create new
        const newExp = { ...expData, id: Date.now() };
        updated = [...experiences, newExp];
      }

      await updateExperiences(updated);
      setExperiences(updated);
      onClose();
      toast({
        title: "Success",
        description: selectedExp
          ? "Experience updated successfully"
          : "Experience created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        status: "error",
        duration: 3000,
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

  // Pagination
  const totalPages = Math.ceil(experiences.length / experiencesPerPage);
  const startIndex = (currentPage - 1) * experiencesPerPage;
  const currentExperiences = experiences.slice(
    startIndex,
    startIndex + experiencesPerPage,
  );

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontSize="12px" fontWeight="bold">
          Work Experience ({experiences.length})
        </Text>
        <Button
          leftIcon={<AddIcon boxSize={2.5} />}
          variant="facebook"
          onClick={handleCreate}
          size="xs"
          h="24px"
          fontSize="10px"
        >
          Add Experience
        </Button>
      </HStack>

      {experiences.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          bg="white"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="11px" color="facebook.lightText">
            No experiences yet. Add your first experience!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={2} align="stretch" mb={3}>
            {currentExperiences.map((exp) => (
              <Box
                key={exp.id}
                px={3}
                py={2}
                bg="white"
                borderRadius="2px"
                border="1px solid"
                borderColor="facebook.border"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" flex={1} spacing={0.5}>
                    <Text
                      fontSize="12px"
                      fontWeight="bold"
                      color="facebook.blue"
                    >
                      {exp.position}
                    </Text>
                    <Text fontSize="11px">{exp.company}</Text>
                    <HStack
                      fontSize="10px"
                      color="facebook.lightText"
                      spacing={1.5}
                    >
                      <Text>{exp.period}</Text>
                      <Text>•</Text>
                      <Text>{exp.location}</Text>
                    </HStack>
                    <Badge
                      bg="facebook.paleBlue"
                      color="facebook.blue"
                      fontSize="9px"
                      px={2}
                      py={0.5}
                      borderRadius="2px"
                      mt={1}
                    >
                      {exp.type}
                    </Badge>
                  </VStack>
                  <HStack spacing={1}>
                    <IconButton
                      icon={<EditIcon boxSize={2.5} />}
                      size="xs"
                      h="22px"
                      variant="outline"
                      borderColor="facebook.border"
                      color="facebook.blue"
                      onClick={() => handleEdit(exp)}
                      aria-label="Edit"
                      _hover={{ bg: "facebook.paleBlue" }}
                    />
                    <IconButton
                      icon={<DeleteIcon boxSize={2.5} />}
                      size="xs"
                      h="22px"
                      variant="outline"
                      borderColor="facebook.border"
                      color="red.600"
                      onClick={() => handleDelete(exp.id)}
                      aria-label="Delete"
                      _hover={{ bg: "red.50" }}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedExp ? "Edit Experience" : "Add Experience"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ExperienceForm
              data={selectedExp}
              onSave={handleSave}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExperienceManager;
