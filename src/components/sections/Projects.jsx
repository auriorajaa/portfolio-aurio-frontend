import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  ExternalLink,
  Github,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Projects = () => {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData.projects || [];
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;

  // Get unique tags dynamically from all projects
  const allTags = projects.reduce((tags, project) => {
    project.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, []);

  // Show ALL + up to 3 most common tags (or all if less than 4)
  const essentialTags = ["ALL", ...allTags.slice(0, 3)];

  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (tag) => {
    setFilter(tag);
    setCurrentPage(1);
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="projects"
    >
      {/* Section Header */}
      <Box
        borderBottom="1px solid"
        borderColor="facebook.border"
        px={3}
        py={2}
        bg="facebook.gray"
      >
        <Flex align="center" gap={2} mb={2}>
          <FolderOpen size={14} color="#3b5998" />
          <Text fontSize="12px" fontWeight="bold" color="facebook.text">
            Projects
          </Text>
        </Flex>

        {/* Filter Tabs */}
        <HStack spacing={2}>
          {essentialTags.map((tag) => (
            <Button
              key={tag}
              size="xs"
              variant={filter === tag ? "facebook" : "facebookGray"}
              onClick={() => handleFilterChange(tag)}
              fontSize="10px"
              h="22px"
              px={3}
            >
              {tag.toUpperCase()}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Projects Grid - Photo Album Style */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
        {currentProjects.map((project, idx) => (
          <Box
            key={project.id}
            p={3}
            borderRight={{
              base: "none",
              md: idx % 2 === 0 ? "1px solid" : "none",
            }}
            borderBottom="1px solid"
            borderColor="facebook.border"
          >
            {/* Project Image */}
            <Box
              border="1px solid"
              borderColor="facebook.border"
              mb={2}
              overflow="hidden"
            >
              <Image
                src={project.image}
                alt={project.title}
                w="100%"
                h="150px"
                objectFit="cover"
              />
            </Box>

            {/* Project Info */}
            <VStack spacing={1} align="stretch">
              <Text fontSize="12px" fontWeight="bold" color="facebook.text">
                {project.title}
              </Text>
              <Text fontSize="11px" color="facebook.lightText" lineHeight="1.4">
                {project.description}
              </Text>

              {/* Tags */}
              <HStack spacing={1}>
                {project.tags.slice(0, 3).map((tag) => (
                  <Text key={tag} fontSize="10px" color="facebook.lightText">
                    #{tag}
                  </Text>
                ))}
              </HStack>

              {/* Links */}
              <HStack spacing={2} pt={1}>
                <Text
                  as="a"
                  href={project.github}
                  target="_blank"
                  fontSize="11px"
                  color="facebook.linkBlue"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Github size={11} /> Code
                </Text>
                {project.website && (
                  <Text
                    as="a"
                    href={project.website}
                    target="_blank"
                    fontSize="11px"
                    color="facebook.linkBlue"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <ExternalLink size={11} /> Demo
                  </Text>
                )}
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          borderTop="1px solid"
          borderColor="facebook.border"
          px={3}
          py={2}
          bg="facebook.gray"
        >
          <Flex justify="center" align="center" gap={3}>
            <Button
              size="xs"
              variant="facebookGray"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
              fontSize="10px"
              h="22px"
              px={2}
            >
              <ChevronLeft size={12} />
            </Button>

            <Text fontSize="11px" color="facebook.text">
              Page {currentPage} of {totalPages}
            </Text>

            <Button
              size="xs"
              variant="facebookGray"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              isDisabled={currentPage === totalPages}
              fontSize="10px"
              h="22px"
              px={2}
            >
              <ChevronRight size={12} />
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Projects;
