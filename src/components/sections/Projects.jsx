import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLink, FileText, FolderOpen, Github, Images } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import ProjectShowcaseModal from "../ui/ProjectShowcaseModal";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Projects = () => {
  const { portfolioData } = usePortfolio();
  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );
  const [filter, setFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const colors = useRetroColors();

  const allTags = projects.reduce((tags, project) => {
    project.tags.forEach((tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
    return tags;
  }, []);
  const filters = ["ALL", ...allTags.slice(0, 5)];
  const filteredProjects =
    filter === "ALL" ? projects : projects.filter((project) => project.tags.includes(filter));

  const openProject = (project) => {
    setSelectedProject(project);
    onOpen();
  };

  return (
    <RetroPanel
      id="projects"
      title="Project Showcase"
      icon={FolderOpen}
      headerRight={<RetroBadge tone="amber">{filteredProjects.length} records</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <Box px={3} py={2} borderBottom="1px solid" borderColor={colors.border}>
        <HStack spacing={2} flexWrap="wrap">
          {filters.map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant={filter === tag ? "facebook" : "facebookGray"}
              onClick={() => setFilter(tag)}
              fontSize="11px"
              h="24px"
              px={3}
            >
              {tag.toUpperCase()}
            </Button>
          ))}
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md:2, lg: 2 }} spacing={0}>
        {filteredProjects.map((project, idx) => {
          const firstMedia = project.gallery?.[0];
          // const hasPdf = project.gallery?.some((item) => item.type === "pdf");

          return (
            <Box
              key={project.id || project.slug}
              p={3}
              borderRight={{
                base: "none",
                lg: idx % 2 === 0 ? "1px solid" : "none",
              }}
              borderBottom="1px solid"
              borderColor={colors.borderSoft}
              bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
            >
              <Flex
                gap={3}
                align="stretch"
                direction={{ base: "column", sm: "column" }}
                h="100%"
              >
                <Box
                  w={{ base: "100%", sm: "100%" }}
                  flexShrink={0}
                  cursor="pointer"
                  onClick={() => openProject(project)}
                  position="relative"
                  overflow="hidden"
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      w="100%"
                      h={{ base: "170px", sm: "132px" }}
                      objectFit="cover"
                    />
                  ) : (
                    <Flex h="132px" align="center" justify="center">
                      <Images size={30} color="#8bb8e8" />
                    </Flex>
                  )}
                </Box>

                <VStack align="stretch" spacing={2} flex={1} minW={0} h="100%">
                  {/* Header section */}
                  <HStack justify="space-between" align="start" spacing={2}>
                    <Box minW={0}>
                      <Text
                        fontSize="14px"
                        fontWeight="bold"
                        color={colors.link}
                        noOfLines={1}
                      >
                        {project.title}
                      </Text>
                      <Text fontSize="11px" color={colors.muted} noOfLines={1}>
                        {project.role}{" "}
                        {project.period ? `/ ${project.period}` : ""}
                      </Text>
                    </Box>
                    <RetroBadge
                      tone={project.status === "Archived" ? "gray" : "green"}
                    >
                      {project.status}
                    </RetroBadge>
                  </HStack>

                  {/* 1. ONLY THE DESCRIPTION AREA GROWS */}
                  <Box flex={1}>
                    <Text
                      fontSize="12px"
                      color={colors.text}
                      lineHeight="1.45"
                      noOfLines={3}
                    >
                      {project.description}
                    </Text>

                    {project.highlights?.length > 0 && (
                      <Text
                        fontSize="11px"
                        color={colors.muted}
                        noOfLines={2}
                        mt={1}
                      >
                        {project.highlights[0]}
                      </Text>
                    )}
                  </Box>

                  {/* 2. THE BOTTOM CONTAINER (TAGS + BUTTONS) */}
                  {/* mt="auto" ensures this entire stack sits at the absolute bottom of the card */}
                  <VStack align="stretch" spacing={2} mt="auto" pt={2}>
                    <HStack spacing={1} flexWrap="wrap">
                      {project.tags.slice(0, 4).map((tag) => (
                        <RetroBadge key={tag}>{tag}</RetroBadge>
                      ))}
                    </HStack>

                    <HStack spacing={2} pt={1} flexWrap="wrap">
                      <Button
                        size="sm"
                        h="26px"
                        variant="facebook"
                        leftIcon={
                          firstMedia?.type === "pdf" ? (
                            <FileText size={13} />
                          ) : (
                            <Images size={13} />
                          )
                        }
                        onClick={() => openProject(project)}
                      >
                        View Case
                      </Button>
                      {project.github && (
                        <Button
                          as={Link}
                          href={project.github}
                          isExternal
                          size="sm"
                          h="26px"
                          variant="facebookGray"
                          leftIcon={<Github size={13} />}
                          _hover={{ textDecoration: "none" }}
                        >
                          Code
                        </Button>
                      )}
                      {project.website && (
                        <Button
                          as={Link}
                          href={project.website}
                          isExternal
                          size="sm"
                          h="26px"
                          variant="facebookGray"
                          leftIcon={<ExternalLink size={13} />}
                          _hover={{ textDecoration: "none" }}
                        >
                          Demo
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </Flex>
            </Box>
          );
        })}
      </SimpleGrid>

      <ProjectShowcaseModal
        project={selectedProject}
        isOpen={isOpen}
        onClose={onClose}
      />
    </RetroPanel>
  );
};

export default Projects;
