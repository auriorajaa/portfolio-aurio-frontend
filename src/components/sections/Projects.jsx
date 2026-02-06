import React, { useState } from "react";
import { Box, Text, Flex, Image, SimpleGrid, Button, HStack, VStack } from "@chakra-ui/react";
import { ExternalLink, Github, FolderOpen } from "lucide-react";
import { projects } from "../../data/portfolioData";

const Projects = () => {
  const [filter, setFilter] = useState("ALL");

  const essentialTags = ["ALL", "django", "react", "java"];
  const filteredProjects = filter === "ALL" 
    ? projects 
    : projects.filter(p => p.tags.includes(filter));

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
              onClick={() => setFilter(tag)}
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
        {filteredProjects.map((project, idx) => (
          <Box
            key={project.id}
            p={3}
            borderRight={{ base: "none", md: idx % 2 === 0 ? "1px solid" : "none" }}
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
    </Box>
  );
};

export default Projects;