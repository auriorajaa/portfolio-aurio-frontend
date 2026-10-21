import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";

import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import { LAGOON, LagoonSection, DoodleTape, DoodleRocket } from "../public/studio";

const PAGE_SIZE = 7;

const Projects = () => {
  const { portfolioData } = usePortfolio();

  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );

  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

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
    <LagoonSection
      id="projects"
      eyebrow="02 / projects"
      title="Projects"
      description="Selected work from the past few years. Mostly backends, with some full-stack mixed in."
      headerAside={
        filteredProjects.length > 0 && (
          <Text
            className="public-mono"
            fontSize="13px"
            color={LAGOON.muted}
          >
            ({filteredProjects.length})
          </Text>
        )
      }
    >
      <Box ref={rootRef}>
        {/* Filter pills */}
        <Flex gap={2} flexWrap="wrap" mb={{ base: 8, md: 10 }} data-reveal>
          {filters.map((tag) => (
            <Button
              key={tag}
              variant={filter === tag ? "lagoon" : "lagoonOutline"}
              size="sm"
              fontSize="14px"
              h="38px"
              px={5}
              onClick={() => handleFilter(tag)}
            >
              {tag === "ALL" ? "All" : tag}
            </Button>
          ))}
        </Flex>

        {/* Featured project — split card */}
        {featured && (
          <Box
            as="article"
            role="link"
            tabIndex={featured.slug ? 0 : undefined}
            aria-label={featured.title}
            data-reveal
            bg="#FFFFFF"
            border="2px solid"
            borderColor={LAGOON.ink}
            borderRadius={{ base: "20px", md: "24px" }}
            boxShadow="6px 6px 0 #0B2F2F"
            overflow="hidden"
            cursor={featured.slug ? "pointer" : "default"}
            transition="box-shadow .18s ease, transform .18s ease"
            _hover={{
              boxShadow: "9px 9px 0 #0B2F2F",
              transform: "translate(-3px, -3px)",
            }}
            onClick={() => featured.slug && openProject(featured)}
            onKeyDown={(event) => {
              if (featured.slug && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                openProject(featured);
              }
            }}
            mb={{ base: 8, md: 10 }}
            position="relative"
          >
            <Box aria-hidden position="absolute" top="10px" left="10px" right="10px" bottom="10px" border="1.5px dashed rgba(11,47,47,0.3)" borderRadius="12px" pointerEvents="none" zIndex={1} />
            <DoodleTape
              w={96}
              h={24}
              color="rgba(255,200,87,0.85)"
              rotation={-5}
              top="-13px"
              left="36px"
              zIndex={2}
            />
            <Grid templateColumns={{ base: "1fr", lg: "1.05fr 0.95fr" }}>
              {/* Visual */}
              <Box
                position="relative"
                bg={LAGOON.surfaceTint}
                minH={{ base: "260px", lg: "400px" }}
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={{ base: 6, md: 10 }}
              >
                <Box
                  aria-hidden="true"
                  className="public-dots"
                  position="absolute"
                  top="24px"
                  right="24px"
                  w="120px"
                  h="100px"
                  opacity={0.6}
                />
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "16px",
                      transition: "transform .25s ease",
                    }}
                  />
                ) : (
                  <Flex w="100%" h="100%" align="center" justify="center">
                    <Text
                      fontSize="13px"
                      color={LAGOON.muted}
                      textTransform="uppercase"
                      letterSpacing=".08em"
                    >
                      No preview
                    </Text>
                  </Flex>
                )}

                <Box position="absolute" top={4} left={4}>
                  <Text
                    className="public-mono"
                    fontSize="13px"
                    fontWeight="500"
                    color={LAGOON.coralDeep}
                    bg="#FFFFFF"
                    border="1.5px solid"
                    borderColor={LAGOON.ink}
                    px="10px"
                    py="4px"
                    borderRadius="8px"
                  >
                    featured
                  </Text>
                </Box>
              </Box>

              {/* Content */}
              <Flex direction="column" p={{ base: 6, md: 10 }}>
                <Text
                  fontFamily="heading"
                  fontSize={{ base: "26px", md: "34px" }}
                  fontWeight="700"
                  lineHeight="1.12"
                  letterSpacing="-.03em"
                  color={LAGOON.heading}
                  noOfLines={2}
                >
                  {featured.title}
                </Text>

                <Text
                  fontSize="14px"
                  fontWeight="600"
                  color={LAGOON.muted}
                  mt={3}
                >
                  {[featured.role, featured.period, featured.status]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>

                {featured.description && (
                  <Text
                    fontSize={{ base: "15px", md: "16px" }}
                    lineHeight="1.75"
                    color={LAGOON.text}
                    mt={4}
                    noOfLines={3}
                  >
                    {featured.description}
                  </Text>
                )}

                {featured.tags?.length > 0 && (
                  <Text
                    fontSize="14px"
                    color={LAGOON.text}
                    mt={5}
                    noOfLines={1}
                  >
                    {featured.tags.join(" · ")}
                  </Text>
                )}

                <Box flex="1" minH="16px" />

                <Flex
                  align="center"
                  gap={4}
                  mt={6}
                  pt={5}
                  borderTop="1px solid"
                  borderColor={LAGOON.borderSoft}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Text
                    display="inline-flex"
                    alignItems="center"
                    gap="6px"
                    fontSize="15px"
                    fontWeight="700"
                    color={LAGOON.primaryDark}
                  >
                    View case study
                    <ArrowUpRight size={16} />
                  </Text>
                  <ProjectLinks project={featured} onDark={false} />
                </Flex>
              </Flex>
            </Grid>
          </Box>
        )}

        {/* Grid */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
          gap={{ base: 6, md: 7 }}
          alignItems="stretch"
        >
          {gridProjects.map((project, index) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              index={index}
              onOpen={() => openProject(project)}
            />
          ))}
        </Grid>

        {filteredProjects.length === 0 && (
          <Box
            py={12}
            textAlign="center"
            bg={LAGOON.surfaceAlt}
            border="1.5px dashed"
            borderColor={LAGOON.ink}
            borderRadius="16px"
          >
            <DoodleRocket size={44} mb={4} mx="auto" />
            <Text className="public-hand" fontSize="26px" fontWeight="600" color={LAGOON.primaryDeep} mb={1}>
              flew away already?
            </Text>
            <Text fontSize="16px" color={LAGOON.muted}>
              No projects matching &quot;{filter}&quot;, try another filter.
            </Text>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 2, md: 3 }}
            mt={{ base: 10, md: 12 }}
            flexWrap="wrap"
          >
            <Button
              variant="lagoonOutline"
              size="sm"
              w="44px"
              h="44px"
              px={0}
              aria-label="Previous page"
              isDisabled={page === 1}
              onClick={() => page > 1 && goPage(page - 1)}
            >
              <ChevronLeft size={17} />
            </Button>

            <HStack spacing={2}>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <Button
                    key={number}
                    variant={number === page ? "lagoon" : "lagoonOutline"}
                    size="sm"
                    fontSize="15px"
                    w="44px"
                    h="44px"
                    px={0}
                    aria-label={`Page ${number}`}
                    onClick={() => goPage(number)}
                  >
                    {number}
                  </Button>
                ),
              )}
            </HStack>

            <Button
              variant="lagoonOutline"
              size="sm"
              w="44px"
              h="44px"
              px={0}
              aria-label="Next page"
              isDisabled={page === totalPages}
              onClick={() => page < totalPages && goPage(page + 1)}
            >
              <ChevronRight size={17} />
            </Button>
          </Flex>
        )}
      </Box>
    </LagoonSection>
  );
};

const TOKEN_BANDS = [LAGOON.surfaceTint, LAGOON.bgWash, LAGOON.coralSoft, LAGOON.sunSoft];

// Collectible token card: colored head band, portrait window,
// inner collectors' frame, serial like "#001".
const ProjectCard = ({ project, index = 0, onOpen }) => (
  <Box
    as="article"
    role="link"
    tabIndex={project.slug ? 0 : undefined}
    aria-label={project.title}
    data-reveal
    display="flex"
    flexDirection="column"
    position="relative"
    bg="#FFFFFF"
    border="2px solid"
    borderColor={LAGOON.ink}
    borderRadius="18px"
    overflow="hidden"
    cursor={project.slug ? "pointer" : "default"}
    transition="box-shadow .18s ease, transform .18s ease"
    boxShadow="5px 5px 0 #0B2F2F"
    sx={{
      "&:hover .token-serial": { color: LAGOON.coralDeep },
      "&:hover .token-title": { color: LAGOON.primaryDeep },
    }}
    _hover={{
      boxShadow: "7px 7px 0 #0B2F2F",
      transform: "translate(-3px, -3px)",
    }}
    onClick={() => project.slug && onOpen()}
    onKeyDown={(event) => {
      if (project.slug && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onOpen();
      }
    }}
  >
    {/* collectors' inner frame */}
    <Box aria-hidden position="absolute" top="7px" left="7px" right="7px" bottom="7px" border="1.5px solid rgba(11,47,47,0.28)" borderRadius="12px" pointerEvents="none" zIndex={1} />

    {/* head band with the serial */}
    <Box
      position="relative"
      bg={TOKEN_BANDS[index % TOKEN_BANDS.length]}
      px={{ base: 5, md: 6 }}
      py={{ base: 4, md: 5 }}
      borderBottom="2px solid #0B2F2F"
    >
      <Flex align="center" justify="space-between" gap={3} mb={2}>
        <Text
          className="public-mono token-serial"
          fontSize="11px"
          fontWeight="600"
          color={LAGOON.muted}
          letterSpacing=".1em"
          transition="color .15s ease"
        >
          {"#"}{String(index + 1).padStart(3, "0")}
        </Text>
        <Box onClick={(event) => event.stopPropagation()}>
          <ProjectLinks project={project} />
        </Box>
      </Flex>
      <Text
        fontFamily="heading"
        fontSize={{ base: "20px", md: "23px" }}
        fontWeight="800"
        lineHeight="1.2"
        letterSpacing="-.02em"
        color={LAGOON.heading}
        noOfLines={2}
        className="token-title"
        transition="color .15s ease"
      >
        {project.title}
      </Text>
    </Box>

    {/* portrait window */}
    <Box
      position="relative"
      aspectRatio="16 / 10"
      bg="#FFFFFF"
      borderBottom="2px solid #0B2F2F"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={5}
      overflow="hidden"
    >
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transition: "transform .25s ease",
          }}
        />
      ) : (
        <Text
          fontSize="12px"
          color={LAGOON.muted}
          textTransform="uppercase"
          letterSpacing=".08em"
        >
          No preview
        </Text>
      )}
    </Box>

    {/* caption plate */}
    <Flex flex="1" direction="column" px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }}>
      {project.description && (
        <Text
          fontSize="15px"
          lineHeight="1.7"
          color={LAGOON.text}
          noOfLines={3}
        >
          {project.description}
        </Text>
      )}

      {project.tags?.length > 0 && (
        <Text className="public-mono" fontSize="11px" fontWeight="500" color={LAGOON.muted} mt={3} noOfLines={1}>
          {project.tags.slice(0, 4).join(" / ")}
        </Text>
      )}

      <Flex flex="1" minH="10px" />

      {(project.period || project.slug) && (
        <Flex
          align="center"
          justify="space-between"
          gap={3}
          pt={4}
          borderTop="1.5px dashed rgba(11,47,47,0.3)"
        >
          <Text className="public-mono" fontSize="11px" fontWeight="500" color={LAGOON.muted} noOfLines={1}>
            {project.period || ""}
          </Text>
          {project.slug && (
            <Text
              display="inline-flex"
              alignItems="center"
              gap="4px"
              fontSize="14px"
              fontWeight="700"
              color={LAGOON.primaryDeep}
              flexShrink={0}
            >
              View project
              <ArrowUpRight size={15} />
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  </Box>
);

const ProjectLinks = ({ project }) => {
  if (!project.github && !project.website) {
    return null;
  }

  return (
    <HStack spacing={3} flexShrink={0}>
      {project.github && (
        <Link
          href={project.github}
          isExternal
          aria-label={`${project.title} source code`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="34px"
          h="34px"
          borderRadius="999px"
          border="1.5px solid"
          borderColor={LAGOON.ink}
          color={LAGOON.text}
          transition="all .15s ease"
          _hover={{
            bg: LAGOON.heading,
            color: "#FFFFFF",
            borderColor: LAGOON.heading,
            textDecoration: "none",
          }}
        >
          <Github size={15} />
        </Link>
      )}

      {project.website && (
        <Link
          href={project.website}
          isExternal
          aria-label={`${project.title} live demo`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="34px"
          h="34px"
          borderRadius="999px"
          border="1.5px solid"
          borderColor={LAGOON.ink}
          color={LAGOON.text}
          transition="all .15s ease"
          _hover={{
            bg: LAGOON.heading,
            color: "#FFFFFF",
            borderColor: LAGOON.heading,
            textDecoration: "none",
          }}
        >
          <ExternalLink size={15} />
        </Link>
      )}
    </HStack>
  );
};

export default Projects;
