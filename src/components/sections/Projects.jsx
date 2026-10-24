import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";

import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import {
  BRUT,
  BrutSection,
  BrutTag,
  DoodleBoom,
  usePublicColors,
} from "../public/brutal";

const PAGE_SIZE = 7;

// Featured poster + alternating 7/5 columns: every row flips which
// side gets the wide slot, so the mosaic walks down the page.
const spanFor = (index, total) => {
  const row = Math.floor(index / 2);
  const leftSpan = row % 2 === 0 ? 7 : 5;
  const rightSpan = 12 - leftSpan;
  if (index === total - 1 && total % 2 === 1) {
    return { span: 12, col: 1 };
  }
  return index % 2 === 0
    ? { span: leftSpan, col: 1 }
    : { span: rightSpan, col: leftSpan + 1 };
};

const Projects = () => {
  const { portfolioData } = usePortfolio();
  const colors = usePublicColors();

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
    <BrutSection
      id="projects"
      number="01"
      kicker="from the workshop"
      title="Projects"
      description="Selected builds from the past few years. Mostly backends, with some full-stack mixed in."
      tone="white"
      headerAside={
        filteredProjects.length > 0 && (
          <BrutTag tone="yellow">
            {filteredProjects.length} SHIPPED
          </BrutTag>
        )
      }
    >
      <Box ref={rootRef}>
        {/* Filter chips: index tabs like sticker sheets */}
        <Flex gap={2} flexWrap="wrap" mb={{ base: 8, md: 10 }} data-reveal>
          {filters.map((tag, index) => {
            const active = filter === tag;
            const tint = [colors.yellow, colors.primarySoft, colors.blueSoft, colors.coralSoft, colors.limeSoft][index % 5];
            return (
              <Button
                key={tag}
                size="sm"
                h="38px"
                px={4}
                fontFamily="spaceMono"
                fontSize="12px"
                fontWeight="700"
                letterSpacing=".06em"
                textTransform="uppercase"
                borderRadius="6px"
                border="2px solid"
                borderColor={BRUT.ink}
                bg={active ? colors.primary : "#FFFFFF"}
                color={active ? "#FFFFFF" : colors.heading}
                boxShadow={BRUT.shadowXs}
                transition="all .15s ease"
                _hover={{
                  bg: active ? colors.primaryDeep : tint,
                  transform: "translate(-1px, -1px)",
                  boxShadow: BRUT.shadow,
                }}
                onClick={() => handleFilter(tag)}
              >
                {tag === "ALL" ? "All" : tag}
              </Button>
            );
          })}
        </Flex>

        {/* Featured project — big browser-window poster card */}
        {featured && (
          <Box
            as="article"
            role="link"
            tabIndex={featured.slug ? 0 : undefined}
            aria-label={featured.title}
            data-reveal
            mb={{ base: 10, md: 12 }}
            position="relative"
            cursor={featured.slug ? "pointer" : "default"}
            onClick={() => featured.slug && openProject(featured)}
            onKeyDown={(event) => {
              if (featured.slug && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                openProject(featured);
              }
            }}
          >
            <Box
              bg="#FFFFFF"
              border="2.5px solid"
              borderColor={BRUT.ink}
              borderRadius="10px"
              boxShadow={BRUT.shadowLg}
              transition="box-shadow .18s ease, transform .18s ease"
              _hover={{
                boxShadow: "10px 10px 0 #17181C",
                transform: "translate(-4px, -4px)",
              }}
            >
              {/* Browser chrome bar */}
              <Flex
                align="center"
                gap={3}
                bg={BRUT.ink}
                px={{ base: 4, md: 5 }}
                py="11px"
                borderBottom="2.5px solid"
                borderColor={BRUT.ink}
                borderRadius="7px 7px 0 0"
              >
                <Flex gap="6px" flexShrink={0} aria-hidden="true">
                  <Box w="11px" h="11px" borderRadius="full" bg={BRUT.coral} border="1.5px solid rgba(255,255,255,0.35)" />
                  <Box w="11px" h="11px" borderRadius="full" bg={BRUT.yellow} border="1.5px solid rgba(255,255,255,0.35)" />
                  <Box w="11px" h="11px" borderRadius="full" bg={BRUT.primary} border="1.5px solid rgba(255,255,255,0.35)" />
                </Flex>
                <Text
                  fontFamily="bungee"
                  fontSize={{ base: "12px", md: "14px" }}
                  color="#FFFFFF"
                  lineHeight="1.3"
                  noOfLines={1}
                  flex="1"
                  minW={0}
                >
                  {featured.title}
                </Text>
                <Text
                  fontFamily="spaceMono"
                  fontSize="11.5px"
                  fontWeight="700"
                  letterSpacing=".14em"
                  color="rgba(255,255,255,0.8)"
                  flexShrink={0}
                >
                  FEATURED.EXE
                </Text>
              </Flex>

              <Grid templateColumns={{ base: "1fr", lg: "1.05fr 0.95fr" }}>
                {/* Visual slab: halftone paper */}
                <Box
                  position="relative"
                  bg={colors.bgWash}
                  borderRight={{ base: "none", lg: "2px solid" }}
                  borderBottom={{ base: "2px solid", lg: "none" }}
                  borderColor={BRUT.ink}
                  minH={{ base: "250px", lg: "398px" }}
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
                    top="20px"
                    right="20px"
                    w="128px"
                    h="104px"
                    opacity={0.55}
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
                        borderRadius: "8px",
                        border: "2px solid",
                        borderColor: BRUT.ink,
                        background: "#FFFFFF",
                        transition: "transform .25s ease",
                      }}
                    />
                  ) : (
                    <Flex w="100%" h="100%" align="center" justify="center">
                      <DoodleBoom size={84}>
                        <Text fontFamily="bungee" fontSize="12px" color={BRUT.ink} mt={1}>
                          NO PREVIEW
                        </Text>
                      </DoodleBoom>
                    </Flex>
                  )}
                </Box>

                {/* Content */}
                <Flex direction="column" p={{ base: 6, md: 9 }} pb={{ base: 10, md: 14 }} position="relative">
                  <Text
                    fontFamily="heading"
                    fontSize={{ base: "26px", md: "33px" }}
                    fontWeight="600"
                    lineHeight="1.12"
                    color={BRUT.ink}
                    noOfLines={2}
                  >
                    {featured.title}
                  </Text>

                  {featured.description && (
                    <Text
                      fontSize={{ base: "16px", md: "17px" }}
                      lineHeight="1.75"
                      color={colors.text}
                      mt={4}
                      noOfLines={3}
                    >
                      {featured.description}
                    </Text>
                  )}

                  <Text
                    fontFamily="spaceMono"
                    fontSize="13.5px"
                    fontWeight="700"
                    color={BRUT.ink}
                    mt={4}
                  >
                    {[featured.role, featured.period, featured.status]
                      .filter(Boolean)
                      .join(" / ")}
                  </Text>

                  <Box flex="1" minH="20px" />

                  <Flex
                    align="center"
                    gap={5}
                    mt={6}
                    pt={5}
                    borderTop="2px dashed"
                    borderColor={colors.borderDashed}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Flex
                      align="center"
                      gap="7px"
                      bg={BRUT.primary}
                      border="2px solid"
                      borderColor={BRUT.ink}
                      borderRadius="6px"
                      px="13px"
                      py="7px"
                      boxShadow={BRUT.shadowXs}
                      transition="transform .15s ease, box-shadow .15s ease"
                      _hover={{ transform: "translate(-1px, -1px)", boxShadow: BRUT.shadow }}
                    >
                      <Text
                        fontFamily="spaceMono"
                        fontSize="12px"
                        fontWeight="700"
                        letterSpacing=".04em"
                        textTransform="uppercase"
                        color="#FFFFFF"
                      >
                        View case study
                      </Text>
                      <ArrowUpRight size={15} color="#FFFFFF" />
                    </Flex>
                    <ProjectLinks project={featured} />
                  </Flex>

                  {/* Tech sticker pills protruding past the bottom edge */}
                  {featured.tags?.length > 0 && (
                    <Flex
                      position={{ base: "static", lg: "absolute" }}
                      bottom={{ lg: "-15px" }}
                      left={{ lg: "34px" }}
                      gap={2}
                      flexWrap="wrap"
                      mt={{ base: 6, lg: 0 }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {featured.tags.slice(0, 3).map((tag, tagIndex) => (
                        <TechPill key={tag} label={tag} index={tagIndex} />
                      ))}
                    </Flex>
                  )}
                </Flex>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Grid: alternating wide/narrow rows of window cards */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(12, minmax(0, 1fr))" }}
          gap={{ base: 10, md: "56px 20px" }}
          alignItems="stretch"
        >
          {gridProjects.map((project, index) => {
            const { span, col } = spanFor(index, gridProjects.length);
            return (
              <ProjectCard
                key={project.id || project.slug}
                project={project}
                index={index}
                onOpen={() => openProject(project)}
                gridColumn={{ base: "auto", md: `${col} / span ${span}` }}
              />
            );
          })}
        </Grid>

        {filteredProjects.length === 0 && (
          <Box
            py={12}
            px={6}
            textAlign="center"
            bg={colors.bgWash}
            border="2px dashed"
            borderColor={BRUT.ink}
            borderRadius="10px"
            data-reveal
          >
            <DoodleBoom size={72} mx="auto">
              <Text fontFamily="bungee" fontSize="12px" color={BRUT.ink} mt={2}>
                POOF!
              </Text>
            </DoodleBoom>
            <Text
              fontFamily="bungee"
              fontSize={{ base: "20px", md: "24px" }}
              color={colors.primaryDeep}
              mt={4}
            >
              NOTHING HERE!
            </Text>
            <Text fontSize="16px" color={BRUT.inkSoft} mt={1}>
              No projects matching &quot;{filter}&quot;, try another filter.
            </Text>
          </Box>
        )}

        {/* Pagination: chunky square tokens */}
        {totalPages > 1 && (
          <Flex
            justify="center"
            align="center"
            gap={{ base: 2, md: 3 }}
            mt={{ base: 12, md: 14 }}
            flexWrap="wrap"
          >
            <Button
              size="sm"
              w="44px"
              h="44px"
              px={0}
              borderRadius="6px"
              border="2px solid"
              borderColor={BRUT.ink}
              bg="#FFFFFF"
              color={colors.heading}
              boxShadow={BRUT.shadowXs}
              _hover={{ bg: colors.yellowSoft, transform: "translate(-1px,-1px)", boxShadow: BRUT.shadow }}
              _disabled={{ opacity: 0.4, boxShadow: "none", transform: "none" }}
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
                    size="sm"
                    fontSize="14px"
                    w="44px"
                    h="44px"
                    px={0}
                    borderRadius="6px"
                    border="2px solid"
                    borderColor={BRUT.ink}
                    bg={number === page ? colors.primary : "#FFFFFF"}
                    color={number === page ? "#FFFFFF" : colors.heading}
                    fontFamily="spaceMono"
                    fontWeight="700"
                    boxShadow={number === page ? BRUT.shadow : BRUT.shadowXs}
                    _hover={{
                      bg: number === page ? colors.primaryDeep : colors.yellowSoft,
                      transform: "translate(-1px,-1px)",
                      boxShadow: BRUT.shadow,
                    }}
                    aria-label={`Page ${number}`}
                    onClick={() => goPage(number)}
                  >
                    {number}
                  </Button>
                ),
              )}
            </HStack>

            <Button
              size="sm"
              w="44px"
              h="44px"
              px={0}
              borderRadius="6px"
              border="2px solid"
              borderColor={BRUT.ink}
              bg="#FFFFFF"
              color={colors.heading}
              boxShadow={BRUT.shadowXs}
              _hover={{ bg: colors.yellowSoft, transform: "translate(-1px,-1px)", boxShadow: BRUT.shadow }}
              _disabled={{ opacity: 0.4, boxShadow: "none", transform: "none" }}
              aria-label="Next page"
              isDisabled={page === totalPages}
              onClick={() => page < totalPages && goPage(page + 1)}
            >
              <ChevronRight size={17} />
            </Button>
          </Flex>
        )}
      </Box>
    </BrutSection>
  );
};

// Tech sticker pill: tinted slab with an ink border, designed to
// overlap the card's bottom edge like a sticker slapped over it.
const PILL_TINTS = [
  { bg: BRUT.yellow, fg: "#FFFFFF" },
  { bg: BRUT.primary, fg: "#FFFFFF" },
  { bg: BRUT.blue, fg: "#FFFFFF" },
  { bg: BRUT.lime, fg: "#111827" },
  { bg: BRUT.primarySoft, fg: "#111827" },
];

const TechPill = ({ label, index }) => {
  const pill = PILL_TINTS[index % PILL_TINTS.length];

  return (
    <Text
      display="inline-flex"
      alignItems="center"
      bg={pill.bg}
      color={pill.fg}
      border="2.5px solid"
      borderColor={BRUT.ink}
      borderRadius="6px"
      px="11px"
      py="5px"
      boxShadow={BRUT.shadowXs}
      fontFamily="spaceMono"
      fontSize={{ base: "12px", md: "12.5px" }}
      fontWeight="700"
      letterSpacing=".06em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      maxW="100%"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {label}
    </Text>
  );
};

const ProjectCard = ({ project, index = 0, onOpen, gridColumn }) => {
  const colors = usePublicColors();

  return (
    <Box
      as="article"
      role="link"
      tabIndex={project.slug ? 0 : undefined}
      aria-label={project.title}
      data-reveal
      gridColumn={gridColumn}
      display="flex"
      flexDirection="column"
      position="relative"
      cursor={project.slug ? "pointer" : "default"}
      transition="box-shadow .18s ease, transform .18s ease"
      sx={{
        "&:hover .tile-title": { color: colors.primary },
      }}
      _hover={{
        transform: "translate(-3px, -3px)",
        "& .window-card": {
          boxShadow: "7px 7px 0 #17181C",
        },
      }}
      onClick={() => project.slug && onOpen()}
      onKeyDown={(event) => {
        if (project.slug && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <Box
        className="window-card"
        display="flex"
        flexDirection="column"
        flex="1"
        bg="#FFFFFF"
        border="2.5px solid"
        borderColor={BRUT.ink}
        borderRadius="10px"
        boxShadow={BRUT.shadow}
        transition="box-shadow .18s ease"
      >
        {/* Browser chrome bar */}
        <Flex
          align="center"
          gap={2.5}
          bg={BRUT.ink}
          px={{ base: 3.5, md: 4 }}
          py="10px"
          borderRadius="7px 7px 0 0"
        >
          <Flex gap="5px" flexShrink={0} aria-hidden="true">
            <Box w="9px" h="9px" borderRadius="full" bg={BRUT.coral} />
            <Box w="9px" h="9px" borderRadius="full" bg={BRUT.yellow} />
            <Box w="9px" h="9px" borderRadius="full" bg={BRUT.primary} />
          </Flex>
          <Text
            className="tile-title"
            fontFamily="bungee"
            fontSize={{ base: "13px", md: "14.5px" }}
            color="#FFFFFF"
            lineHeight="1.35"
            noOfLines={1}
            flex="1"
            minW={0}
            transition="color .15s ease"
          >
            {project.title}
          </Text>
          <Text
            fontFamily="spaceMono"
            fontSize="10.5px"
            fontWeight="700"
            letterSpacing=".12em"
            color="rgba(255,255,255,0.78)"
            flexShrink={0}
          >
            {String(index + 1).padStart(3, "0")}
          </Text>
        </Flex>

        {/* Image window */}
        <Box
          position="relative"
          aspectRatio="16 / 10"
          bg={colors.bgWash}
          borderBottom="2px solid"
          borderColor={BRUT.ink}
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
              fontFamily="spaceMono"
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
              letterSpacing=".1em"
            >
              No preview
            </Text>
          )}
          <Box onClick={(event) => event.stopPropagation()} position="absolute" top="10px" right="10px">
            <ProjectLinks project={project} />
          </Box>
        </Box>

        {/* Caption strip */}
        <Flex flex="1" direction="column" px={{ base: 5, md: 6 }} pt={{ base: 4, md: 5 }} pb={{ base: 6, md: 7 }}>
          <Heading
            as="h3"
            fontFamily="heading"
            fontSize={{ base: "20px", md: "22px" }}
            fontWeight="700"
            lineHeight="1.25"
            color={BRUT.ink}
            mb={2.5}
            noOfLines={2}
          >
            {project.title}
          </Heading>

          {project.description && (
            <Text
              fontSize="16px"
              lineHeight="1.7"
              color={colors.text}
              noOfLines={3}
            >
              {project.description}
            </Text>
          )}

          <Flex flex="1" minH="10px" />

          {(project.period || project.slug) && (
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              pt="14px"
              borderTop="2px dashed"
              borderColor={colors.borderDashed}
            >
              <Text
                fontFamily="spaceMono"
                fontSize="13px"
                fontWeight="700"
                color={BRUT.ink}
                noOfLines={1}
              >
                {project.period || ""}
              </Text>
              {project.slug && (
                <Flex
                  align="center"
                  gap="5px"
                  bg={BRUT.primary}
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="6px"
                  px="11px"
                  py="5px"
                  boxShadow={BRUT.shadowXs}
                  flexShrink={0}
                  transition="transform .15s ease, box-shadow .15s ease"
                  _hover={{ transform: "translate(-1px, -1px)", boxShadow: BRUT.shadow }}
                >
                  <Text
                    fontFamily="spaceMono"
                    fontSize="12.5px"
                    fontWeight="700"
                    letterSpacing=".04em"
                    textTransform="uppercase"
                    color="#FFFFFF"
                  >
                    View project
                  </Text>
                  <ArrowUpRight size={14} color="#FFFFFF" />
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Tech sticker pills protruding past the bottom edge */}
      {project.tags?.length > 0 && (
        <Flex
          position="absolute"
          bottom="-14px"
          left={{ base: "16px", md: "22px" }}
          gap={2}
          maxW={{ base: "calc(100% - 26px)", md: "calc(100% - 44px)" }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          sx={{ pointerEvents: "none" }}
        >
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <TechPill key={tag} label={tag} index={tagIndex} />
          ))}
        </Flex>
      )}
    </Box>
  );
};

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
          w="32px"
          h="32px"
          borderRadius="5px"
          border="1.5px solid"
          borderColor={BRUT.ink}
          bg="#FFFFFF"
          color={BRUT.ink}
          transition="all .15s ease"
          _hover={{
            bg: BRUT.ink,
            color: "#FFFFFF",
            textDecoration: "none",
            transform: "translate(-1px, -1px)",
          }}
        >
          <Github size={14} />
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
          w="32px"
          h="32px"
          borderRadius="5px"
          border="1.5px solid"
          borderColor={BRUT.ink}
          bg="#FFFFFF"
          color={BRUT.ink}
          transition="all .15s ease"
          _hover={{
            bg: BRUT.ink,
            color: "#FFFFFF",
            textDecoration: "none",
            transform: "translate(-1px, -1px)",
          }}
        >
          <ExternalLink size={14} />
        </Link>
      )}
    </HStack>
  );
};

export default Projects;
