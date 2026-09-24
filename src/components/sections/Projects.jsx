import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
} from "lucide-react";

import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import ProjectShowcaseModal from "../ui/ProjectShowcaseModal";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const PAGE_SIZE = 6;

const Projects = () => {
  const { portfolioData } = usePortfolio();

  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );

  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const colors = useStudioColors();
  const rootRef = useRef(null);

  // ─────────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────────

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

  // ─────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);

  const pagedProjects = filteredProjects.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleFilter = (tag) => {
    setFilter(tag);
    setPage(1);
  };

  // ─────────────────────────────────────────────
  // Animation
  // ─────────────────────────────────────────────

  useGSAP(
    () => {
      if (prefersReducedMotion() || !rootRef.current) return;

      gsap.from("[data-project-card]", {
        y: 16,
        autoAlpha: 0,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    {
      dependencies: [filter, page],
      scope: rootRef,
    },
  );

  // ─────────────────────────────────────────────
  // Open Project
  // ─────────────────────────────────────────────

  const openProject = (project) => {
    if (!project?.slug) return;

    setSelectedProject(project);
    onOpen();
  };

  // ─────────────────────────────────────────────
  // Pagination Navigation
  // ─────────────────────────────────────────────

  const goPage = (nextPage) => {
    setPage(nextPage);

    if (rootRef.current) {
      rootRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <StudioSection
      id="projects"
      eyebrow="Selected work"
      title="A wall of technical work."
      maxW="1320px"
    >
      <Box ref={rootRef}>
        {/* ─────────────────────────────────────────────
            Header
        ───────────────────────────────────────────── */}

        <Flex
          justify="space-between"
          align={{ base: "start", md: "end" }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
          flexWrap="wrap"
        >
          {/* Desktop description */}
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="15px"
            color={colors.muted}
            maxW="420px"
            lineHeight="1.65"
          >
            Every project, fully visible — image, story, and links. Tap a card
            for the full case study.
          </Text>

          {/* Mobile description */}
          <Text
            display={{ base: "block", md: "none" }}
            fontSize="13px"
            color={colors.muted}
          >
            Browse my selected projects below.
          </Text>

          {/* Filters */}
          <HStack
            spacing={1}
            flexWrap="wrap"
            justify={{ base: "flex-start", md: "flex-end" }}
          >
            {filters.map((tag) => (
              <Button
                key={tag}
                variant={filter === tag ? "studio" : "studioGhost"}
                size="sm"
                fontSize="12px"
                h="28px"
                px={3}
                onClick={() => handleFilter(tag)}
              >
                {tag}
              </Button>
            ))}
          </HStack>
        </Flex>

        {/* ─────────────────────────────────────────────
            Responsive Project Grid

            Mobile  : 1 column
            Tablet  : 2 columns
            Desktop : 3 columns
        ───────────────────────────────────────────── */}

        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          }}
          gap={{
            base: "16px",
            md: "20px",
            lg: "24px",
          }}
          alignItems="stretch"
        >
          {pagedProjects.map((project) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              colors={colors}
              onOpen={() => openProject(project)}
            />
          ))}
        </Box>

        {/* ─────────────────────────────────────────────
            Empty State
        ───────────────────────────────────────────── */}

        {filteredProjects.length === 0 && (
          <Box py={16} textAlign="center">
            <Text fontSize="15px" color={colors.muted}>
              No projects matching "{filter}"
            </Text>
          </Box>
        )}

        {/* ─────────────────────────────────────────────
            Pagination
        ───────────────────────────────────────────── */}

        {totalPages > 1 && (
          <Flex
            justify="space-between"
            align="center"
            mt={{ base: 6, md: 8 }}
            pt={5}
            borderTop="1px solid"
            borderColor={colors.border}
            flexWrap="wrap"
            gap={3}
          >
            {/* Page indicator */}
            <Text fontSize="13px" color={colors.muted}>
              {String(page).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </Text>

            {/* Page numbers - tablet / desktop */}
            <HStack
              spacing={1}
              display={{ base: "none", md: "flex" }}
            >
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((number) => (
                <Button
                  key={number}
                  variant="unstyled"
                  onClick={() => goPage(number)}
                  minW="32px"
                  h="32px"
                  px={2}
                  fontSize="13px"
                  fontWeight={number === page ? "800" : "500"}
                  color={
                    number === page ? colors.surfaceAlt : colors.muted
                  }
                  bg={number === page ? colors.text : "transparent"}
                  borderRadius="full"
                  transition="all .15s ease"
                  _hover={{
                    color: colors.text,
                    bg: colors.surface,
                  }}
                >
                  {number}
                </Button>
              ))}
            </HStack>

            {/* Prev / Next */}
            <HStack spacing={2}>
              <PaginationBtn
                onClick={() => page > 1 && goPage(page - 1)}
                disabled={page === 1}
                colors={colors}
                icon={<ChevronLeft size={15} />}
                label="Prev"
              />

              <PaginationBtn
                onClick={() =>
                  page < totalPages && goPage(page + 1)
                }
                disabled={page === totalPages}
                colors={colors}
                icon={<ChevronRight size={15} />}
                label="Next"
                iconRight
              />
            </HStack>
          </Flex>
        )}
      </Box>

      {/* ─────────────────────────────────────────────
          Project Modal
      ───────────────────────────────────────────── */}

      <ProjectShowcaseModal
        project={selectedProject}
        isOpen={isOpen}
        onClose={onClose}
      />
    </StudioSection>
  );
};

// ─────────────────────────────────────────────
// ProjectCard
// ─────────────────────────────────────────────

const ProjectCard = ({ project, colors, onOpen }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      data-project-card
      as="article"
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      minH={{
        base: "420px",
        md: "440px",
        lg: "460px",
      }}
      bg={colors.surfaceAlt}
      overflow="hidden"
      cursor={project.slug ? "pointer" : "default"}
      transition="border-color .18s ease, transform .18s ease"
      transform={{
        md: hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => project.slug && onOpen()}
    >
      {/* ─────────────────────────────────────────────
          Image
      ───────────────────────────────────────────── */}

      <Box
        w="100%"
        aspectRatio="16 / 10"
        bg={colors.surface}
        overflow="hidden"
        position="relative"
        sx={{
          "& .lazy-load-image-background": {
            width: "100% !important",
            height: "100% !important",
            display: "block !important",
          },
        }}
      >
        {project.image ? (
          <Box
            as={LazyLoadImage}
            src={project.image}
            alt={project.title}
            effect="opacity"
            threshold={220}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              filter: hovered
                ? "brightness(.95)"
                : "brightness(1)",
              transition:
                "transform .4s ease, filter .18s ease",
            }}
          />
        ) : (
          <Flex
            w="100%"
            h="100%"
            align="center"
            justify="center"
          >
            <Text
              fontSize="11px"
              color={colors.muted}
              letterSpacing=".06em"
              textTransform="uppercase"
            >
              No preview
            </Text>
          </Flex>
        )}
      </Box>

      {/* ─────────────────────────────────────────────
          Card Content
      ───────────────────────────────────────────── */}

      <Flex
        flex="1"
        direction="column"
        p={{
          base: "16px",
          md: "20px",
        }}
      >
        {/* Title */}
        <Text
          fontSize={{
            base: "16px",
            md: "18px",
            lg: "19px",
          }}
          fontWeight="800"
          lineHeight="1.3"
          letterSpacing="-.005em"
          noOfLines={2}
          minH="2.6em"
        >
          {project.title}
        </Text>

        {/* Period + Tags */}
        {(project.period || project.tags?.length > 0) && (
          <HStack
            spacing={2}
            mt={2}
            flexWrap="wrap"
          >
            {project.period && (
              <Text
                fontSize="12px"
                color={colors.muted}
              >
                {project.period}
              </Text>
            )}

            {project.period &&
              project.tags?.length > 0 && (
                <Text
                  fontSize="12px"
                  color={colors.border}
                >
                  —
                </Text>
              )}

            {project.tags?.length > 0 && (
              <Text
                fontSize="12px"
                color={colors.muted}
                noOfLines={1}
              >
                {project.tags.slice(0, 3).join(", ")}
              </Text>
            )}
          </HStack>
        )}

        {/* Description */}
        {project.description && (
          <Text
            fontSize="13.5px"
            color={colors.muted}
            lineHeight="1.6"
            mt={3}
            noOfLines={2}
            minH="3.2em"
          >
            {project.description}
          </Text>
        )}

        {/* Push actions to bottom */}
        <Box
          flex="1"
          minH="12px"
        />

        {/* Actions */}
        <ProjectActions
          project={project}
          colors={colors}
        />
      </Flex>
    </Box>
  );
};

// ─────────────────────────────────────────────
// Project Actions
// ─────────────────────────────────────────────

const ProjectActions = ({ project, colors }) => {
  if (
    !project.github &&
    !project.website &&
    !project.slug
  ) {
    return null;
  }

  return (
    <HStack
      spacing={2}
      mt={3}
      flexWrap="wrap"
      onClick={(event) => event.stopPropagation()}
    >
      {/* GitHub */}
      {project.github && (
        <TileAction
          href={project.github}
          icon={<Github size={13} />}
          label="Code"
          colors={colors}
        />
      )}

      {/* Website */}
      {project.website && (
        <TileAction
          href={project.website}
          icon={<ExternalLink size={13} />}
          label="Live"
          colors={colors}
        />
      )}

      {/* Detail */}
      {project.slug && (
        <TileAction
          href={`/project/${project.slug}`}
          icon={<ArrowUpRight size={13} />}
          label="Detail"
          colors={colors}
          primary
          external={false}
        />
      )}
    </HStack>
  );
};

// ─────────────────────────────────────────────
// Tile Action
// ─────────────────────────────────────────────

const TileAction = ({
  href,
  icon,
  label,
  colors,
  primary = false,
  external = true,
}) => (
  <Link
    href={href}
    isExternal={external}
    aria-label={label}
    display="inline-flex"
    alignItems="center"
    gap="5px"
    px="10px"
    h="28px"
    fontSize="12px"
    fontWeight="600"
    border="1px solid"
    borderColor={
      primary ? colors.text : colors.border
    }
    bg={primary ? colors.text : "transparent"}
    color={
      primary ? colors.surfaceAlt : colors.text
    }
    whiteSpace="nowrap"
    transition="all .15s ease"
    _hover={{
      textDecoration: "none",
      borderColor: colors.text,
      bg: primary
        ? colors.text
        : colors.surface,
    }}
  >
    {icon}

    <Text
      as="span"
      fontSize="11px"
      fontWeight="600"
    >
      {label}
    </Text>
  </Link>
);

// ─────────────────────────────────────────────
// Pagination Button
// ─────────────────────────────────────────────

const PaginationBtn = ({
  onClick,
  disabled,
  colors,
  icon,
  label,
  iconRight,
}) => (
  <HStack
    as="button"
    onClick={onClick}
    disabled={disabled}
    spacing={1}
    h="32px"
    px={3}
    fontSize="13px"
    fontWeight="700"
    border="1px solid"
    borderColor={colors.border}
    bg={
      disabled
        ? "transparent"
        : colors.surfaceAlt
    }
    color={
      disabled
        ? colors.border
        : colors.text
    }
    cursor={
      disabled ? "default" : "pointer"
    }
    opacity={disabled ? 0.6 : 1}
    transition="all .15s ease"
    _hover={
      disabled
        ? {}
        : {
          borderColor: colors.text,
        }
    }
  >
    {!iconRight && icon}

    <Text as="span">
      {label}
    </Text>

    {iconRight && icon}
  </HStack>
);

export default Projects;