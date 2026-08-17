import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Link,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ExternalLink, Github, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { normalizeProjects } from "../../utils/projectMedia";
import ProjectShowcaseModal from "../ui/ProjectShowcaseModal";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const PAGE_SIZE = 8;

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
  const gridRef = useRef(null);

  // Build tag filter list
  const tags = projects.reduce((acc, p) => {
    p.tags.forEach((t) => { if (!acc.includes(t)) acc.push(t); });
    return acc;
  }, []);
  const filters = ["ALL", ...tags.slice(0, 5)];

  const filteredProjects =
    filter === "ALL" ? projects : projects.filter((p) => p.tags.includes(filter));

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const pagedProjects = filteredProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filter changes
  const handleFilter = (tag) => {
    setFilter(tag);
    setPage(1);
  };

  // Animate items on filter/page change
  useGSAP(
    () => {
      if (prefersReducedMotion() || !gridRef.current) return;
      gsap.from("[data-project-cell]", {
        y: 16,
        autoAlpha: 0,
        duration: 0.44,
        ease: "power3.out",
        stagger: 0.045,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          once: true,
        },
      });
    },
    { dependencies: [filter, page], scope: rootRef },
  );

  const openProject = (project) => {
    setSelectedProject(project);
    onOpen();
  };

  const goPage = (n) => {
    setPage(n);
    // Scroll grid into view smoothly
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <StudioSection
      id="projects"
      eyebrow="Selected work"
      title="A gallery wall for technical work."
      maxW="1320px"
    >
      <Box ref={rootRef}>
        {/* ── Header row ── */}
        <Flex
          justify="space-between"
          align={{ base: "start", md: "end" }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
          flexWrap="wrap"
        >
          <Text
            fontSize={{ base: "14px", md: "15px" }}
            color={colors.muted}
            maxW="420px"
            lineHeight="1.65"
          >
            Tap a project to expand the case study.
          </Text>

          {/* Filter pills */}
          <HStack spacing={1} flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
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

        {/* ── Project grid ── */}
        <Box ref={gridRef}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            }}
            gap={{ base: 4, md: "1px" }}
          >
            {pagedProjects.map((project, index) => (
              <ProjectCard
                key={project.id || project.slug}
                project={project}
                index={index}
                colors={colors}
                onClick={() => openProject(project)}
                // First card on desktop spans 2 cols for editorial feel
                featured={index === 0 && pagedProjects.length >= 3}
              />
            ))}

            {/* Empty state */}
            {pagedProjects.length === 0 && (
              <Box
                gridColumn="1 / -1"
                py={16}
                textAlign="center"
                bg={colors.surfaceAlt}
              >
                <Text fontSize="15px" color={colors.muted}>
                  No projects matching "{filter}"
                </Text>
              </Box>
            )}
          </Grid>
        </Box>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Flex
            justify="space-between"
            align="center"
            mt={8}
            pt={5}
            borderTop="1px solid"
            borderColor={colors.border}
          >
            {/* Page count label */}
            <Text fontSize="13px" color={colors.muted} letterSpacing=".02em">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredProjects.length)} of{" "}
              {filteredProjects.length}
            </Text>

            {/* Page dots + prev/next */}
            <HStack spacing={2}>
              <IconButton
                icon={<ChevronLeft size={15} />}
                aria-label="Previous page"
                variant="studioGhost"
                size="sm"
                isDisabled={page === 1}
                onClick={() => goPage(page - 1)}
              />

              <HStack spacing={1}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Box
                    key={n}
                    as="button"
                    onClick={() => goPage(n)}
                    w={n === page ? "20px" : "6px"}
                    h="6px"
                    bg={n === page ? colors.text : colors.border}
                    borderRadius="999px"
                    transition="all .22s ease"
                    _hover={{ bg: n === page ? colors.text : colors.muted }}
                    aria-label={`Page ${n}`}
                  />
                ))}
              </HStack>

              <IconButton
                icon={<ChevronRight size={15} />}
                aria-label="Next page"
                variant="studioGhost"
                size="sm"
                isDisabled={page === totalPages}
                onClick={() => goPage(page + 1)}
              />
            </HStack>
          </Flex>
        )}
      </Box>

      <ProjectShowcaseModal project={selectedProject} isOpen={isOpen} onClose={onClose} />
    </StudioSection>
  );
};

// ─────────────────────────────────────────────
// ProjectCard — two modes:
//   featured (index 0, desktop): tall image left + meta right, spans 2 cols
//   normal: image top, meta bottom — portrait card
// Mobile: always single column, image top, text bottom (block layout)
// ─────────────────────────────────────────────
const ProjectCard = ({ project, index, colors, onClick, featured }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      data-project-cell
      as="article"
      gridColumn={{ md: featured ? "span 2" : "span 1", xl: featured ? "span 2" : "span 1" }}
      bg={colors.surfaceAlt}
      cursor="pointer"
      position="relative"
      overflow="hidden"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      display="block"
      minH={{ base: "auto", md: featured ? "460px" : "320px" }}
    >
      {/* Image */}
      <Box
        w="100%"
        h={{ base: "200px", md: featured ? "320px" : "220px" }}
        overflow="hidden"
        position="relative"
      >
        {project.image ? (
          <Box
            as={LazyLoadImage}
            src={project.image}
            alt={project.title}
            effect="opacity"
            threshold={220}
            visibleByDefault={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
            width="100%"
            height="100%"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform .5s cubic-bezier(.25,.46,.45,.94)",
              filter: hovered ? "brightness(.92)" : "brightness(1)",
            }}
          />
        ) : (
          // No-image placeholder
          <Box
            w="100%"
            h="100%"
            bg={colors.surface}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="11px" color={colors.muted} letterSpacing=".06em" textTransform="uppercase">
              No preview
            </Text>
          </Box>
        )}

        {/* Index number — editorial detail */}
        <Text
          position="absolute"
          top={3}
          left={3}
          fontSize="11px"
          fontWeight="700"
          letterSpacing=".08em"
          color="rgba(255,255,255,.55)"
          display={{ base: "none", md: "block" }}
          userSelect="none"
        >
          {String(index + 1).padStart(2, "0")}
        </Text>
      </Box>

      {/* Meta */}
      <Flex
        direction="column"
        justify="space-between"
        flex={1}
        p={{ base: "14px 16px", md: 5 }}
        gap={{ base: 1, md: 3 }}
        borderTop={{ base: "none", md: "1px solid" }}
        borderColor={colors.border}
        minH={{ md: featured ? "140px" : "unset" }}
      >
        <Box>
          {/* Role / period */}
          <Text
            fontSize={{ base: "10px", md: "11px" }}
            color={colors.muted}
            textTransform="uppercase"
            letterSpacing=".08em"
            mb={{ base: "2px", md: 1 }}
            noOfLines={1}
          >
            {/* {project.role || project.tags?.[0]} */}
            {project.period ? ` · ${project.period}` : ""}
          </Text>

          {/* Title */}
          <Text
            fontSize={{ base: "17px", md: featured ? "22px" : "18px" }}
            fontWeight="800"
            lineHeight="1.1"
            letterSpacing="-.01em"
            noOfLines={{ base: 2, md: 3 }}
            transition="opacity .2s"
            opacity={hovered ? 0.72 : 1}
          >
            {project.title}
          </Text>

          {/* Description — only on desktop non-featured */}
          {!featured && (
            <Text
              display={{ base: "none", md: "-webkit-box" }}
              fontSize="13px"
              color={colors.muted}
              lineHeight="1.6"
              mt={2}
              noOfLines={2}
            >
              {project.description}
            </Text>
          )}

          {/* Description — featured desktop gets more */}
          {featured && (
            <Text
              display={{ base: "none", md: "-webkit-box" }}
              fontSize="14px"
              color={colors.muted}
              lineHeight="1.7"
              mt={2}
              noOfLines={3}
            >
              {project.description}
            </Text>
          )}
        </Box>

        {/* Bottom row — tags + links */}
        <Flex
          justify="space-between"
          align="center"
          mt={{ base: 0, md: 1 }}
          gap={2}
        >
          <Text
            fontSize={{ base: "10px", md: "12px" }}
            color={colors.muted}
            noOfLines={1}
            flex={1}
          >
            {(project.tags || []).slice(0, 3).join(" / ")}
          </Text>

          <HStack spacing={2} flexShrink={0} onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <Link href={project.github} isExternal aria-label={`${project.title} code`} color={colors.muted} _hover={{ color: colors.text }}>
                <Github size={14} />
              </Link>
            )}
            {project.website && (
              <Link href={project.website} isExternal aria-label={`${project.title} live demo`} color={colors.muted} _hover={{ color: colors.text }}>
                <ExternalLink size={14} />
              </Link>
            )}
            {project.slug && (
              <Link
                href={`/project/${project.slug}`}
                aria-label={`Open ${project.title} case study`}
                color={colors.muted}
                fontSize="12px"
                fontWeight="600"
                _hover={{ color: colors.text, textDecoration: "none" }}
              >
                Case study
              </Link>
            )}
            {/* Arrow hint on hover */}
            <Box
              color={colors.text}
              opacity={hovered ? 1 : 0}
              transform={hovered ? "translateX(0)" : "translateX(-4px)"}
              transition="all .2s ease"
              display={{ base: "none", md: "flex" }}
            >
              <ArrowRight size={14} />
            </Box>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Projects;
