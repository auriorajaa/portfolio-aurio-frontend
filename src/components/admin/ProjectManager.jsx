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
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import {
  getPortfolioData,
  updateProjects,
} from "../../services/portfolioService";
import ProjectForm from "./ProjectForm";
import Pagination from "../ui/Pagination";
import { normalizeProjects } from "../../utils/projectMedia";
import { RetroBadge, useRetroColors } from "../ui/retro";

const normalizeProjectOrder = (list) =>
  list.map((project, index) => ({
    ...project,
    order: index,
  }));

const ProjectManager = ({ openCreateSignal = 0, onDataChange }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [savingOrder, setSavingOrder] = useState(null);
  const projectsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const colors = useRetroColors();

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData();
      setProjects(normalizeProjects(data?.projects || []));
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

  useEffect(() => {
    if (openCreateSignal > 0) {
      handleCreate();
    }
    // eslint-disable-next-line
  }, [openCreateSignal]);

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
      const updated = normalizeProjectOrder(projects.filter((p) => p.id !== deleteId));
      await updateProjects(updated);
      setProjects(updated);
      onDataChange?.();
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
  const handleReorder = async (fromIndex, direction) => {
    const toIndex = fromIndex + direction;

    if (toIndex < 0 || toIndex >= projects.length) return;

    const movedProject = projects[fromIndex];
    const nextProjects = [...projects];
    [nextProjects[fromIndex], nextProjects[toIndex]] = [
      nextProjects[toIndex],
      nextProjects[fromIndex],
    ];

    const updated = normalizeProjectOrder(nextProjects);

    try {
      setSavingOrder(`${movedProject.id}-${direction < 0 ? "up" : "down"}`);
      await updateProjects(updated);
      setProjects(updated);
      onDataChange?.();
      toast({
        title: "Success",
        description: "Project order updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingOrder(null);
    }
  };

  const handleSave = async (projectData) => {
    try {
      let updated;
      if (selectedProject) {
        updated = projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...projectData,
                id: selectedProject.id,
                order: Number.isFinite(Number(selectedProject.order))
                  ? Number(selectedProject.order)
                  : p.order,
              }
            : p,
        );
      } else {
        const newProject = { ...projectData, id: Date.now(), order: projects.length };
        updated = [...projects, newProject];
      }

      updated = normalizeProjectOrder(updated);

      await updateProjects(updated);
      setProjects(updated);
      onDataChange?.();
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
        <Spinner size="lg" color="public.text" />
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
        <Text fontSize="16px">Total: {projects.length} projects</Text>
        {/* <Button
          leftIcon={<AddIcon boxSize={3} />}
          size="sm"
          variant="facebook"
          onClick={handleCreate}
          fontSize="15px"
          h="24px"
          px={2}
        >
          Add Project
        </Button> */}
      </HStack>

      {projects.length === 0 ? (
        <Box
          p={6}
          textAlign="center"
          borderRadius="14px"
          border="1px solid"
          borderColor="public.border"
        >
          <Text fontSize="16px" color="public.muted">
            No projects yet. Add your first project!
          </Text>
        </Box>
      ) : (
        <>
          <VStack spacing={0} align="stretch">
            {currentProjects.map((project, idx) => {
              const globalIndex = indexOfFirstProject + idx;

              return (
              <Box
                key={project.id}
                px={3}
                py={2}
                borderBottom={
                  idx !== currentProjects.length - 1 ? "1px solid" : "none"
                }
                borderColor={colors.borderSoft}
                bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
              >
                <HStack spacing={3} align="start">
                  {project.image && (
                    <Box
                      flexShrink={0}
                      w="60px"
                      h="60px"
                      border="1px solid"
                      borderColor="public.border"
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
                      fontSize="17px"
                      fontWeight="bold"
                      color="public.text"
                    >
                      {project.title}
                    </Text>
                    <Text fontSize="16px" noOfLines={1}>
                      {project.description}
                    </Text>
                    <Wrap spacing={1}>
                      <RetroBadge tone="amber">#{globalIndex + 1}</RetroBadge>
                      {project.tags?.slice(0, 4).map((tag) => (
                        <Tag
                          key={tag}
                          size="sm"
                          bg="public.surface"
                          color="public.text"
                          fontSize="12px"
                          borderRadius="14px"
                          fontWeight="normal"
                        >
                          {tag}
                        </Tag>
                      ))}
                      {project.gallery?.length > 0 && (
                        <RetroBadge tone="amber">
                          {project.gallery.length} media
                        </RetroBadge>
                      )}
                      {project.status && (
                        <RetroBadge tone="green">{project.status}</RetroBadge>
                      )}
                    </Wrap>
                  </VStack>
                  <HStack spacing={1}>
                    <IconButton
                      icon={<ArrowUpIcon boxSize={3} />}
                      size="sm"
                      variant="facebookGray"
                      onClick={() => handleReorder(globalIndex, -1)}
                      aria-label="Move up"
                      h="32px"
                      minW="32px"
                      isDisabled={globalIndex === 0 || Boolean(savingOrder)}
                      isLoading={savingOrder === `${project.id}-up`}
                    />
                    <IconButton
                      icon={<ArrowDownIcon boxSize={3} />}
                      size="sm"
                      variant="facebookGray"
                      onClick={() => handleReorder(globalIndex, 1)}
                      aria-label="Move down"
                      h="32px"
                      minW="32px"
                      isDisabled={globalIndex === projects.length - 1 || Boolean(savingOrder)}
                      isLoading={savingOrder === `${project.id}-down`}
                    />
                    <IconButton
                      icon={<EditIcon boxSize={3} />}
                      size="sm"
                      variant="facebookGray"
                      onClick={() => handleEdit(project)}
                      aria-label="Edit"
                      h="32px"
                      minW="32px"
                    />
                    <IconButton
                      icon={<DeleteIcon boxSize={3} />}
                      size="sm"
                      bg="#ffebee"
                      color="#d32f2f"
                      onClick={() => openDeleteDialog(project.id)}
                      aria-label="Delete"
                      h="32px"
                      minW="32px"
                      _hover={{ bg: "#ffcdd2" }}
                    />
                  </HStack>
                </HStack>
              </Box>
              );
            })}
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
          <AlertDialogContent borderRadius="24px">
            <AlertDialogHeader fontSize="17px" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody fontSize="16px">
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onCloseDelete}
                variant="facebookGray"
                fontSize="16px"
              >
                Cancel
              </Button>
              <Button
                variant="facebook"
                bg="#d32f2f"
                _hover={{ bg: "#b71c1c" }}
                onClick={handleDelete}
                ml={3}
                fontSize="16px"
              >
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
