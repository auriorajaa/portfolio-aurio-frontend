// src/components/admin/ProjectManager.jsx
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
  Image,
  Tag,
  Wrap,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateProjects,
} from "../../services/portfolioService";
import ProjectForm from "./ProjectForm";
import Pagination from "../ui/Pagination";

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setProjects(data?.projects || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProject(null);
    onOpen();
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    onOpen();
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    onOpenDelete();
  };

  const handleDelete = async () => {
    try {
      const updated = projects.filter((p) => p.id !== deleteId);
      await updateProjects(updated);
      setProjects(updated);
      toast({
        title: "Success",
        description: "Project deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onCloseDelete();
  };

  const handleSave = async (projectData) => {
    try {
      let updated;
      if (selectedProject) {
        updated = projects.map((p) =>
          p.id === selectedProject.id
            ? { ...projectData, id: selectedProject.id }
            : p,
        );
      } else {
        const newProject = { ...projectData, id: Date.now() };
        updated = [...projects, newProject];
      }

      await updateProjects(updated);
      setProjects(updated);
      onClose();
      toast({
        title: "Success",
        description: selectedProject
          ? "Project updated successfully"
          : "Project created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center py={6}>
        <Spinner size="lg" color="facebook.blue" />
      </Center>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontSize="11px" color="facebook.text">
          Total: {projects.length} projects
        </Text>
        <Button
          leftIcon={<AddIcon boxSize={3} />}
          size="xs"
          variant="facebook"
          onClick={handleCreate}
          fontSize="10px"
          h="22px"
          px={2}
        >
          Add Project
        </Button>
      </HStack>

      {projects.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          bg="white"
          borderRadius="2px"
          border="1px solid"
          borderColor="facebook.border"
        >
          <Text fontSize="11px" color="facebook.lightText">
            No projects yet. Add your first project!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={0} align="stretch">
            {currentProjects.map((project, idx) => (
              <Box
                key={project.id}
                px={3}
                py={2}
                bg="white"
                borderBottom={
                  idx !== currentProjects.length - 1 ? "1px solid" : "none"
                }
                borderColor="facebook.border"
              >
                <HStack spacing={3} align="start">
                  {project.image && (
                    <Box
                      flexShrink={0}
                      w="60px"
                      h="60px"
                      border="1px solid"
                      borderColor="facebook.border"
                      overflow="hidden"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                  )}
                  <VStack align="start" flex={1} spacing={1}>
                    <Text
                      fontSize="12px"
                      fontWeight="bold"
                      color="facebook.blue"
                    >
                      {project.title}
                    </Text>
                    <Text fontSize="11px" color="facebook.text" noOfLines={1}>
                      {project.description}
                    </Text>
                    <Wrap spacing={1}>
                      {project.tags?.slice(0, 4).map((tag) => (
                        <Tag
                          key={tag}
                          size="sm"
                          bg="facebook.paleBlue"
                          color="facebook.text"
                          fontSize="9px"
                          borderRadius="2px"
                          fontWeight="normal"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </Wrap>
                  </VStack>
                  <HStack spacing={1}>
                    <IconButton
                      icon={<EditIcon boxSize={3} />}
                      size="xs"
                      variant="facebookGray"
                      onClick={() => handleEdit(project)}
                      aria-label="Edit"
                      h="24px"
                      minW="24px"
                    />
                    <IconButton
                      icon={<DeleteIcon boxSize={3} />}
                      size="xs"
                      bg="#ffebee"
                      color="#d32f2f"
                      onClick={() => openDeleteDialog(project.id)}
                      aria-label="Delete"
                      h="24px"
                      minW="24px"
                      _hover={{ bg: "#ffcdd2" }}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedProject ? "Edit Project" : "Add Project"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ProjectForm
              data={selectedProject}
              onSave={handleSave}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProjectManager;
