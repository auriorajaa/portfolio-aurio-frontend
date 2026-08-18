import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Grid,
  HStack,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
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
  const activeMedia = project?.gallery?.[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [slug]);

  if (loading) {
    return (
      <Box minH="100vh" bg={colors.bg} color={colors.text}>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container maxW="1320px" px={{ base: 5, md: 8 }} py={16}>
          <Spinner color={colors.accent} />
        </Container>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box minH="100vh" bg={colors.bg} color={colors.text}>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="description" content={description} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container
          maxW="760px"
          px={{ base: 5, md: 8 }}
          py={{ base: 16, md: 24 }}
        >
          <VStack align="stretch" spacing={5}>
            <Button
              alignSelf="flex-start"
              variant="studioGhost"
              leftIcon={<ArrowLeft size={15} />}
              onClick={() => navigate("/")}
            >
              Back to Portfolio
            </Button>
            <Text
              as="h1"
              fontSize={{ base: "34px", md: "48px" }}
              fontWeight="800"
              lineHeight="1.05"
            >
              Project not found
            </Text>
            <Text color={colors.muted} fontSize="17px" lineHeight="1.7">
              This project may have moved or is no longer published.
            </Text>
          </VStack>
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
    <Box minH="100vh" bg={colors.bg} color={colors.text}>
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
        <meta
          property="og:image:alt"
          content={`${project.title} project preview`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify(projectSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbs)}
        </script>
      </Helmet>

      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Container maxW="1380px" px={{ base: 5, md: 8 }} py={{ base: 8, md: 14 }}>
        <br />
        <br />

        <Button
          mb={{ base: 8, md: 10 }}
          variant="studioGhost"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "projects" } })}
        >
          Back to Projects
        </Button>

        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0, 1.3fr) minmax(300px, .7fr)",
          }}
          gap={{ base: 10, lg: 14 }}
          alignItems="start"
        >
          <VStack align="stretch" spacing={4}>
            <Box
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              overflow="hidden"
              minH={{ base: "360px", md: "520px", xl: "650px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={{ base: 3, md: 6 }}
            >
              {activeMedia ? (
                <LazyLoadImage
                  src={activeMedia.url}
                  alt={activeMedia.alt || `${project.title} project preview`}
                  effect="opacity"
                  visibleByDefault
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width="100%"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  minH="320px"
                  display="grid"
                  placeItems="center"
                  bg={colors.surface}
                >
                  <Text color={colors.muted}>No preview available</Text>
                </Box>
              )}
            </Box>

            {project.gallery?.length > 1 && (
              <Grid
                templateColumns={{
                  base: "repeat(3, 1fr)",
                  md: "repeat(5, 1fr)",
                }}
                gap={{ base: 2, md: 3 }}
              >
                {project.gallery.map((item, index) => (
                  <Box
                    as="button"
                    key={item.id || item.url}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    border="1px solid"
                    borderColor={
                      index === activeIndex ? colors.text : colors.border
                    }
                    bg={colors.surfaceAlt}
                    overflow="hidden"
                    cursor="pointer"
                    p={0}
                  >
                    <LazyLoadImage
                      src={item.thumbnail || item.url}
                      alt={
                        item.alt || `${project.title} thumbnail ${index + 1}`
                      }
                      effect="opacity"
                      loading="lazy"
                      decoding="async"
                      width="100%"
                      height="100%"
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 10",
                        objectFit: "contain",
                        display: "block",
                        background: colors.surface,
                      }}
                    />
                  </Box>
                ))}
              </Grid>
            )}
          </VStack>

          <VStack
            align="stretch"
            spacing={{ base: 5, md: 6 }}
            position={{ lg: "sticky" }}
            top={{ lg: "104px" }}
            borderLeft={{ lg: "1px solid" }}
            borderColor={{ lg: colors.border }}
            pl={{ lg: 8 }}
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              color={colors.muted}
              textTransform="uppercase"
              letterSpacing=".12em"
            >
              Case study
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              <StudioPill>{project.role}</StudioPill>
              {project.period && (
                <StudioPill tone="ghost">{project.period}</StudioPill>
              )}
              {project.status && (
                <StudioPill tone="ghost">{project.status}</StudioPill>
              )}
            </HStack>

            <Text
              as="h1"
              fontSize={{ base: "40px", md: "58px", xl: "68px" }}
              fontWeight="800"
              lineHeight="1.02"
            >
              {project.title}
            </Text>

            <Text
              fontSize={{ base: "16px", md: "18px" }}
              color={colors.muted}
              lineHeight="1.75"
              textAlign="justify"
            >
              {project.description}
            </Text>

            {project.highlights?.length > 0 && (
              <VStack
                align="stretch"
                spacing={3}
                borderTop="1px solid"
                borderColor={colors.border}
                pt={5}
              >
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color={colors.muted}
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Highlights
                </Text>
                {project.highlights.map((highlight) => (
                  <Text key={highlight} fontSize="15px" lineHeight="1.7">
                    {highlight}
                  </Text>
                ))}
              </VStack>
            )}

            {project.tags?.length > 0 && (
              <HStack spacing={2} flexWrap="wrap">
                {project.tags.map((tag) => (
                  <StudioPill key={tag} tone="ghost">
                    {tag}
                  </StudioPill>
                ))}
              </HStack>
            )}

            <HStack spacing={3} flexWrap="wrap" pt={2}>
              {project.github && (
                <Button
                  as={Link}
                  href={project.github}
                  isExternal
                  variant="studioGhost"
                  leftIcon={<Github size={15} />}
                  _hover={{ textDecoration: "none" }}
                >
                  Source Code
                </Button>
              )}
              {project.website && (
                <Button
                  as={Link}
                  href={project.website}
                  isExternal
                  variant="studio"
                  leftIcon={<ExternalLink size={15} />}
                  _hover={{ textDecoration: "none" }}
                >
                  Visit Website
                </Button>
              )}
            </HStack>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProjectPage;
