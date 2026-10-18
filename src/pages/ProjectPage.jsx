import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import Header from "../components/layout/Header";
import { StudioPill, useStudioColors } from "../components/public/studio";
import { usePortfolio } from "../contexts/PortfolioContext";
import { normalizeProjects } from "../utils/projectMedia";
import {
  DEFAULT_AUTHOR,
  DEFAULT_IMAGE,
  SITE_NAME,
  absoluteUrl,
  createBreadcrumbSchema,
  createProjectSchema,
  truncate,
} from "../utils/seo";

const splitParagraphs = (text) => {
  if (!text) return [];
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.length > 0 ? blocks : [text.trim()];
};

const ProjectPage = ({ isDownloading, handleDownload }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const colors = useStudioColors();
  const { portfolioData, loading } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );
  const project = projects.find((item) => item.slug === slug);
  const canonicalUrl = absoluteUrl(`/project/${slug}`);
  const pageTitle = project
    ? `${project.title} | Project by ${DEFAULT_AUTHOR}`
    : `Project not found | ${SITE_NAME}`;
  const description = project
    ? truncate(project.description, 155)
    : "This project case study could not be found in Aurio Rajaa's portfolio.";
  const imageUrl = absoluteUrl(project?.image || DEFAULT_IMAGE);
  const gallery = project?.gallery || [];
  const galleryLength = gallery.length;
  const activeMedia = gallery[activeIndex];
  const hasGallery = galleryLength > 1;
  const descriptionParagraphs = useMemo(
    () => splitParagraphs(project?.description),
    [project?.description],
  );

  // Start at the top whenever the page opens or the slug changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slug]);

  const goPrev = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i - 1 + galleryLength) % galleryLength);
  }, [hasGallery, galleryLength]);

  const goNext = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + 1) % galleryLength);
  }, [hasGallery, galleryLength]);

  if (loading) {
    return (
      <Box minH="100vh" bg="#ffffff" color={colors.text}>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container maxW="1400px" px={{ base: 5, md: 10 }} py={12}>
          <Text fontSize="15px" color={colors.muted}>
            Loading project…
          </Text>
        </Container>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box minH="100vh" bg="#ffffff" color={colors.text}>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="description" content={description} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container maxW="1400px" px={{ base: 5, md: 10 }} py={{ base: 12, md: 16 }}>
          <Button
            variant="classicOutline"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => navigate("/")}
            mb={6}
          >
            Back to Portfolio
          </Button>
          <Text as="h1" fontSize={{ base: "26px", md: "32px" }} fontWeight="700" color={colors.heading} mb={3}>
            Project not found
          </Text>
          <Text fontSize="16px" color={colors.muted}>
            This project may have moved or is no longer published.
          </Text>
        </Container>
      </Box>
    );
  }

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Projects", item: "/#projects" },
    { name: project.title, item: `/project/${project.slug}` },
  ]);
  const projectSchema = createProjectSchema(project, canonicalUrl);

  return (
    <Box minH="100vh" bg="#ffffff" color={colors.text}>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />
        <meta name="author" content={DEFAULT_AUTHOR} />
        <meta
          name="keywords"
          content={[
            project.title,
            ...(project.tags || []),
            DEFAULT_AUTHOR,
            "software project",
            "portfolio",
          ].join(", ")}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:alt" content={`${project.title} project preview`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify(projectSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      </Helmet>

      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Container maxW="1400px" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 10 }} pb={{ base: 12, md: 16 }}>
        <Button
          variant="classicOutline"
          size="sm"
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate("/", { state: { scrollTo: "projects" } })}
          mb={6}
        >
          All Projects
        </Button>

        {/* Headline */}
        <Text
          as="h1"
          fontSize={{ base: "30px", md: "42px" }}
          fontWeight="700"
          lineHeight="1.25"
          color={colors.heading}
          mb={3}
        >
          {project.title}
        </Text>

        <Flex gap={2} flexWrap="wrap" mb={4}>
          <StudioPill>{project.role}</StudioPill>
          {project.period && <StudioPill>{project.period}</StudioPill>}
          {project.status && <StudioPill>{project.status}</StudioPill>}
          {project.tags?.map((tag) => (
            <StudioPill key={tag}>{tag}</StudioPill>
          ))}
        </Flex>

        <HStack spacing={3} flexWrap="wrap" mb={{ base: 6, md: 8 }}>
          {project.github && (
            <Button
              as={Link}
              href={project.github}
              isExternal
              variant="classicOutline"
              size="sm"
              leftIcon={<Github size={14} />}
            >
              Source Code
            </Button>
          )}
          {project.website && (
            <Button
              as={Link}
              href={project.website}
              isExternal
              variant="classic"
              size="sm"
              leftIcon={<ExternalLink size={14} />}
            >
              Visit Website
            </Button>
          )}
        </HStack>

        {/* Main image */}
        <Box
          border="1px solid"
          borderColor={colors.border}
          borderRadius="4px"
          bg={colors.surface}
          overflow="hidden"
          mb={3}
        >
          <Flex
            h={{ base: "280px", md: "460px" }}
            align="center"
            justify="center"
            p={{ base: 3, md: 4 }}
          >
            {activeMedia ? (
              <img
                src={activeMedia.url}
                alt={activeMedia.alt || `${project.title} project preview`}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Text color={colors.muted} fontSize="14px">
                No preview available
              </Text>
            )}
          </Flex>
        </Box>

        {/* Gallery controls + thumbnails */}
        {galleryLength > 0 && (
          <Box mb={{ base: 6, md: 8 }}>
            {hasGallery && (
              <Flex align="center" justify="space-between" gap={3} mb={3} flexWrap="wrap">
                <HStack spacing={2}>
                  <Button
                    variant="classicOutline"
                    size="sm"
                    leftIcon={<ChevronLeft size={14} />}
                    onClick={goPrev}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="classicOutline"
                    size="sm"
                    rightIcon={<ChevronRight size={14} />}
                    onClick={goNext}
                  >
                    Next
                  </Button>
                </HStack>
                <Text fontSize="14px" fontWeight="600" color={colors.muted}>
                  Image {activeIndex + 1} of {galleryLength}
                </Text>
              </Flex>
            )}

            {hasGallery && (
              <Flex gap={2} flexWrap="wrap">
                {gallery.map((item, index) => (
                  <Box
                    key={item.id || item.url}
                    as="button"
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    w="76px"
                    border={index === activeIndex ? "2px solid" : "1px solid"}
                    borderColor={index === activeIndex ? colors.accent : colors.border}
                    borderRadius="4px"
                    bg="#ffffff"
                    overflow="hidden"
                    p={0}
                    cursor="pointer"
                    aria-label={`Show image ${index + 1}`}
                  >
                    <img
                      src={item.thumbnail || item.url}
                      alt={item.alt || `${project.title} thumbnail ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        display: "block",
                        width: "100%",
                        aspectRatio: "4 / 3",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        )}

        {/* Write-up */}
        <Box>
          {descriptionParagraphs.length > 0 && (
            <VStack as="article" align="stretch" spacing={4} maxW="1400px">
              {descriptionParagraphs.map((paragraph, index) => (
                <Text
                  key={index}
                  as="p"
                  fontSize={{ base: "18px", md: "19px" }}
                  color={colors.text}
                  lineHeight="1.85"
                  align={"justify"}
                >
                  {paragraph}
                </Text>
              ))}
            </VStack>
          )}

          {project.highlights?.length > 0 && (
            <VStack
              align="stretch"
              spacing={2}
              mt={descriptionParagraphs.length > 0 ? 8 : 0}
              pt={descriptionParagraphs.length > 0 ? 6 : 0}
              borderTop={descriptionParagraphs.length > 0 ? "1px solid" : "none"}
              borderColor={colors.borderSoft}
              maxW="820px"
            >
              <Text fontSize="16px" fontWeight="700" color={colors.heading} mb={1}>
                Highlights
              </Text>
              {project.highlights.map((highlight) => (
                <Flex key={highlight} gap={2} align="flex-start">
                  <Box color={colors.muted} lineHeight="1.75" flexShrink={0}>
                    •
                  </Box>
                  <Text fontSize="17px" lineHeight="1.75" color={colors.text}>
                    {highlight}
                  </Text>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectPage;
