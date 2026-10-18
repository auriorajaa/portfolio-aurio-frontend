import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import { StudioSection, useStudioColors } from "../public/studio";

const PAGE_SIZE = 7;

const Projects = () => {
  const { portfolioData } = usePortfolio();

  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );

  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const colors = useStudioColors();
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const tags = projects.reduce((acc, project) => {
    project.tags.forEach((tag) => {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    });

    return acc;
  }, []);

  const filters = ["ALL", ...tags.slice(0, 5)];

  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((project) => project.tags.includes(filter));

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);

  const pagedProjects = filteredProjects.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const featured =
    filter === "ALL" && page === 1 && pagedProjects.length >= 4
      ? pagedProjects[0]
      : null;

  const gridProjects = featured ? pagedProjects.slice(1) : pagedProjects;

  const handleFilter = (tag) => {
    setFilter(tag);
    setPage(1);
  };

  const openProject = (project) => {
    if (!project?.slug) return;

    navigate(`/project/${project.slug}`);
  };

  const goPage = (nextPage) => {
    setPage(nextPage);

    if (rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <StudioSection id="projects" title="Projects">
      <Box ref={rootRef}>
        {/* Filter buttons */}
        <Flex gap={2} flexWrap="wrap" mb={{ base: 7, md: 9 }}>
          {filters.map((tag) => (
            <Button
              key={tag}
              variant={filter === tag ? "classic" : "classicOutline"}
              size="sm"
              fontSize="15px"
              h="36px"
              px={4}
              onClick={() => handleFilter(tag)}
            >
              {tag.toUpperCase()}
            </Button>
          ))}
        </Flex>

        {/* Lead project — front page banner with caption bar */}
        {featured && (
          <Box
            as="article"
            role="group"
            bg="#ffffff"
            border="1px solid"
            borderColor="#b9c9da"
            boxShadow="0 3px 10px rgba(18,58,99,0.12)"
            overflow="hidden"
            cursor={featured.slug ? "pointer" : "default"}
            transition="box-shadow .18s ease, border-color .18s ease"
            _hover={{ boxShadow: "0 10px 26px rgba(18,58,99,0.22)", borderColor: "#8fa9c4" }}
            onClick={() => featured.slug && openProject(featured)}
            mb={{ base: 8, md: 10 }}
          >
            <Box
              position="relative"
              aspectRatio={{ base: "16 / 10", md: "16 / 5" }}
              maxH="460px"
              bg={colors.surface}
              overflow="hidden"
            >
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Flex w="100%" h="100%" align="center" justify="center">
                  <Text fontSize="13px" color={colors.muted} textTransform="uppercase" letterSpacing=".05em">
                    No preview
                  </Text>
                </Flex>
              )}

              <Text
                as="span"
                position="absolute"
                top={4}
                left={4}
                bg="#ffffff"
                color={colors.heading}
                fontSize="12px"
                fontWeight="700"
                letterSpacing=".12em"
                textTransform="uppercase"
                px="12px"
                py="5px"
                border="1px solid"
                borderColor="#b9c9da"
                boxShadow="0 2px 5px rgba(9,24,42,0.25)"
              >
                Featured
              </Text>
            </Box>

            {/* Caption bar */}
            <Box bg={colors.navyGradient} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
              <Flex justify="space-between" align="flex-start" gap={6} flexWrap="wrap">
                <Box minW={0} flex="1 1 420px">
                  <Text
                    fontSize={{ base: "21px", md: "26px" }}
                    fontWeight="700"
                    lineHeight="1.3"
                    color="#ffffff"
                    noOfLines={2}
                    textShadow="0 1px 2px rgba(9,24,42,0.5)"
                  >
                    {featured.title}
                  </Text>

                  <Text fontSize="14px" color="#b9cde4" mt={2}>
                    {[featured.role, featured.period, featured.status]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>

                  {featured.description && (
                    <Text
                      fontSize={{ base: "15px", md: "16px" }}
                      lineHeight="1.7"
                      color="#dbe7f5"
                      mt={2}
                      noOfLines={2}
                    >
                      {featured.description}
                    </Text>
                  )}
                </Box>

                <Box pt={{ base: 1, md: 7 }}>
                  <ProjectActions project={featured} colors={colors} onDark />
                </Box>
              </Flex>
            </Box>
          </Box>
        )}

        {/* Wide horizontal grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
          gap={{ base: 6, md: 7 }}
          alignItems="stretch"
        >
          {gridProjects.map((project) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              colors={colors}
              onOpen={() => openProject(project)}
            />
          ))}
        </Box>

        {filteredProjects.length === 0 && (
          <Box py={14} textAlign="center">
            <Text fontSize="16px" color={colors.muted}>
              No projects matching "{filter}"
            </Text>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 2, md: 3 }}
            mt={{ base: 8, md: 10 }}
            pt={6}
            borderTop="1px solid"
            borderColor={colors.borderSoft}
            flexWrap="wrap"
          >
            <Button
              variant="classicOutline"
              size="sm"
              fontSize="15px"
              h="36px"
              isDisabled={page === 1}
              onClick={() => page > 1 && goPage(page - 1)}
            >
              ← Prev
            </Button>

            <HStack spacing={1}>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <Button
                    key={number}
                    variant={number === page ? "classic" : "classicOutline"}
                    size="sm"
                    fontSize="15px"
                    minW="36px"
                    h="36px"
                    px={2}
                    onClick={() => goPage(number)}
                  >
                    {number}
                  </Button>
                ),
              )}
            </HStack>

            <Button
              variant="classicOutline"
              size="sm"
              fontSize="15px"
              h="36px"
              isDisabled={page === totalPages}
              onClick={() => page < totalPages && goPage(page + 1)}
            >
              Next →
            </Button>
          </Flex>
        )}
      </Box>
    </StudioSection>
  );
};

const ProjectCard = ({ project, colors, onOpen }) => (
  <Box
    as="article"
    role="group"
    display={{ base: "flex", md: "grid" }}
    flexDirection="column"
    gridTemplateColumns={{ md: "44% minmax(0, 1fr)" }}
    bg="#ffffff"
    border="1px solid"
    borderColor="#b9c9da"
    boxShadow="0 2px 8px rgba(18,58,99,0.1)"
    overflow="hidden"
    cursor={project.slug ? "pointer" : "default"}
    transition="box-shadow .18s ease, border-color .18s ease"
    _hover={{
      boxShadow: "0 8px 18px rgba(18,58,99,0.18)",
      borderColor: "#8fa9c4",
    }}
    onClick={() => project.slug && onOpen()}
  >
    {/* Thumbnail — left half on wide screens */}
    <Box
      aspectRatio={{ base: "16 / 10", md: "auto" }}
      minH={{ md: "230px" }}
      bg={colors.surface}
      overflow="hidden"
      borderBottom={{ base: "1px solid", md: "none" }}
      borderRight={{ base: "none", md: "1px solid" }}
      borderColor={colors.borderSoft}
    >
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      ) : (
        <Flex w="100%" h="100%" minH={{ base: "180px", md: "230px" }} align="center" justify="center">
          <Text fontSize="12px" color={colors.muted} textTransform="uppercase" letterSpacing=".05em">
            No preview
          </Text>
        </Flex>
      )}
    </Box>

    {/* Content */}
    <Flex flex="1" direction="column" p={{ base: 5, md: 6 }}>
      <Text
        fontSize={{ base: "18px", md: "20px" }}
        fontWeight="700"
        lineHeight="1.35"
        color={colors.heading}
        noOfLines={2}
        transition="color .15s ease"
        _groupHover={{ color: colors.accent }}
      >
        {project.title}
      </Text>

      {(project.period || project.tags?.length > 0) && (
        <Text fontSize="14px" color={colors.muted} mt={1} noOfLines={1}>
          {[project.period, project.tags?.slice(0, 3).join(", ")]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      )}

      {project.description && (
        <Text fontSize="16px" lineHeight="1.7" color={colors.text} mt={3} noOfLines={3}>
          {project.description}
        </Text>
      )}

      <Box flex="1" minH="10px" />

      <ProjectActions project={project} colors={colors} />
    </Flex>
  </Box>
);

const ProjectActions = ({ project, colors, onDark = false }) => {
  if (!project.github && !project.website) {
    return null;
  }

  const linkProps = onDark
    ? {
      color: "#ffffff",
      textShadow: "0 1px 1px rgba(9,24,42,0.5)",
      _hover: { color: "#c9dcf1", textDecoration: "none" },
    }
    : {
      color: colors.accent,
      _hover: { color: colors.primaryDark, textDecoration: "none" },
    };

  return (
    <HStack spacing={4} mt={3} flexWrap="wrap" onClick={(event) => event.stopPropagation()}>
      {project.github && (
        <Link href={project.github} isExternal fontSize="15px" fontWeight="600" {...linkProps}>
          Source Code
        </Link>
      )}

      {project.website && (
        <Link href={project.website} isExternal fontSize="15px" fontWeight="600" {...linkProps}>
          Live Demo
        </Link>
      )}
    </HStack>
  );
};

export default Projects;
