import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github, X, ZoomIn } from "lucide-react";
import Header from "../components/layout/Header";
import Layout from "../components/layout/Layout";
import { LAGOON, DoodleAsterisk, DoodleRocket, DoodleTape, DoodleSquiggle, PublicShell, usePublicColors } from "../components/public/studio";
import { gsap, prefersReducedMotion } from "../utils/gsap";
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
  const colors = usePublicColors();
  const { portfolioData, loading } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const pageRef = useRef(null);

  const projects = useMemo(
    () => normalizeProjects(portfolioData.projects || []),
    [portfolioData.projects],
  );
  const project = projects.find((item) => item.slug === slug);
  const projectId = project?.id;
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
  const isFeatured =
    project?.featured === true || /featured/i.test(project?.status || "");
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

  // Settle-in reveal for the cover media once a project is in view.
  useLayoutEffect(() => {
    const scope = pageRef.current;
    if (!scope || !projectId || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-page-reveal]",
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.12 }
      );
    }, scope);
    return () => ctx.revert();
  }, [projectId]);

  const goPrev = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i - 1 + galleryLength) % galleryLength);
  }, [hasGallery, galleryLength]);

  const goNext = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + 1) % galleryLength);
  }, [hasGallery, galleryLength]);

  // Lightbox for viewing the shots full size
  const openZoom = useCallback((index) => {
    setZoomIndex(index);
    setZoomOpen(true);
  }, []);
  const zoomPrev = useCallback(() => {
    setZoomIndex((i) => (i - 1 + galleryLength) % galleryLength);
  }, [galleryLength]);
  const zoomNext = useCallback(() => {
    setZoomIndex((i) => (i + 1 + galleryLength) % galleryLength);
  }, [galleryLength]);

  if (loading) {
    return (
      <PublicShell bg="#FFFFFF">
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="50vh">
          <Text fontSize="15px" color={colors.muted}>
            Loading project...
          </Text>
        </Center>
      </PublicShell>
    );
  }

  if (!project) {
    return (
      <PublicShell bg="#FFFFFF">
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="description" content={description} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} py={{ base: 12, md: 16 }}>
          <Button
            variant="lagoonOutline"
            size="sm"
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => navigate("/")}
            mb={6}
          >
            Back to Portfolio
          </Button>
          <Text
            as="h1"
            fontFamily="heading"
            fontSize={{ base: "28px", md: "36px" }}
            fontWeight="700"
            letterSpacing="-.03em"
            color={colors.heading}
            mb={3}
          >
            Project not found
          </Text>
          <Text fontSize="16px" color={colors.muted}>
            This project may have moved or is no longer published.
          </Text>
        </Container>
      </PublicShell>
    );
  }

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Projects", item: "/#projects" },
    { name: project.title, item: `/project/${project.slug}` },
  ]);
  const projectSchema = createProjectSchema(project, canonicalUrl);

  const metaLine = [project.role, project.period, project.status]
    .filter(Boolean)
    .join(" / ");

  return (
    <Box ref={pageRef}>
      <Layout isDownloading={isDownloading} handleDownload={handleDownload}>
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

      <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 20 }}>
        <Button
          variant="lagoonOutline"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "projects" } })}
          mb={8}
        >
          All Projects
        </Button>

        {/* Headline */}
        <Flex align="center" gap={3} flexWrap="wrap" mb={4}>
          {metaLine && (
            <Text
              className="public-mono"
              fontSize="13px"
              fontWeight="500"
              color={colors.muted}
            >
              {metaLine}
            </Text>
          )}
          {isFeatured && (
            <Text
              className="public-mono"
              fontSize="13px"
              fontWeight="500"
              color={colors.coralDeep}
              display="inline-flex"
              alignItems="center"
              gap="6px"
            >
              <DoodleAsterisk size={14} />
              featured
            </Text>
          )}
        </Flex>

        <Text
          as="h1"
          fontFamily="heading"
          fontSize={{ base: "34px", md: "52px" }}
          fontWeight="700"
          lineHeight="1.05"
          letterSpacing="-.04em"
          color={colors.heading}
          maxW="900px"
          mb={3}
        >
          {project.title}
        </Text>
        <Flex align="center" gap={2} mb={8}>
          <DoodleRocket size={34} transform="rotate(-8deg)" />
          <Text
            className="public-hand"
            fontSize={{ base: "25px", md: "28px" }}
            fontWeight="600"
            color={colors.primary}
            transform="rotate(-1.2deg)"
          >
            built in the workshop
          </Text>
        </Flex>

        <HStack spacing={3} flexWrap="wrap" mb={{ base: 8, md: 10 }}>
          {project.github && (
            <Button
              as={Link}
              href={project.github}
              isExternal
              variant="lagoonOutline"
              size="sm"
              h="46px"
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
              variant="lagoon"
              size="sm"
              h="46px"
              leftIcon={<ExternalLink size={15} />}
              _hover={{ textDecoration: "none" }}
            >
              Visit Website
            </Button>
          )}
        </HStack>

        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 300px" }}
          gap={{ base: 10, lg: 12 }}
          alignItems="start"
        >
          {/* Main column */}
          <Box>
            {/* Main image */}
            <Box
              className="page-frame"
              position="relative"
              border="2px solid"
              borderColor={colors.ink}
              borderRadius="16px"
              bg={colors.surfaceTint}
              overflow="hidden"
              boxShadow="6px 6px 0 rgba(11,47,47,0.9)"
              mb={5}
              data-page-reveal
            >
              <DoodleTape
                w={92}
                h={22}
                color="rgba(255,200,87,0.85)"
                rotation={-4}
                top="-12px"
                left="48px"
                ml={-46}
                zIndex={2}
              />
              <DoodleTape
                w={74}
                h={20}
                color="rgba(255,107,74,0.75)"
                rotation={3}
                bottom="-10px"
                right="42px"
                ml={-37}
                zIndex={2}
              />
              <Flex
                h={{ base: "300px", md: "560px" }}
                align="center"
                justify="center"
                p={{ base: 4, md: 7 }}
                cursor="pointer"
                onClick={() => openZoom(activeIndex)}
                aria-label="Open image in full size"
              >
                {activeMedia && (
                  <Box
                    aria-hidden="true"
                    position="absolute"
                    top="14px"
                    right="14px"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg="#FFFFFF"
                    border="2px solid #0B2F2F"
                    color="#0B2F2F"
                    boxShadow="2px 2px 0 rgba(11,47,47,0.9)"
                    zIndex={2}
                    transition="transform .15s ease"
                    sx={{
                      ".page-frame:hover &": { transform: "scale(1.08)" },
                      cursor: "pointer",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      openZoom(activeIndex);
                    }}
                  >
                    <ZoomIn size={18} />
                  </Box>
                )}
                {activeMedia ? (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.alt || `${project.title} project preview`}
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "12px",
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
              <Box mb={{ base: 8, md: 10 }}>
                {hasGallery && (
                  <Flex align="center" justify="space-between" gap={3} mb={3} flexWrap="wrap">
                    <HStack spacing={2}>
                      <Button
                        variant="lagoonOutline"
                        size="sm"
                        w="40px"
                        h="40px"
                        px={0}
                        aria-label="Previous image"
                        onClick={goPrev}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="lagoonOutline"
                        size="sm"
                        w="40px"
                        h="40px"
                        px={0}
                        aria-label="Next image"
                        onClick={goNext}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </HStack>
                    <Text fontSize="14px" fontWeight="600" color={colors.muted}>
                      Image {activeIndex + 1} of {galleryLength}
                    </Text>
                  </Flex>
                )}

                <Flex gap={2} flexWrap="wrap">
                  {gallery.map((item, index) => (
                    <Box
                      key={item.id || item.url}
                      as="button"
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      w="76px"
                      border={index === activeIndex ? "2px solid #0B2F2F" : "1.5px solid #CFE8E4"}
                      borderColor={index === activeIndex ? "#0B2F2F" : "#CFE8E4"}
                      borderRadius="8px"
                      bg="#FFFFFF"
                      overflow="hidden"
                      p={0}
                      cursor="pointer"
                      aria-label={`Show image ${index + 1}`}
                      transition="border-color .15s ease"
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
              </Box>
            )}

            {/* Write-up */}
            <Box>
              {descriptionParagraphs.length > 0 && (
                <VStack as="article" align="stretch" spacing={4} maxW="900px">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <Text
                      key={index}
                      as="p"
                      fontSize={{ base: "17px", md: "18px" }}
                      color={colors.text}
                      lineHeight="1.85"
                    >
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              )}

              {project.highlights?.length > 0 && (
                <Box
                  mt={{ base: 8, md: 10 }}
                  bg={colors.surfaceAlt}
                  border="1.5px solid"
                  borderColor={colors.ink}
                  borderRadius="14px"
                  p={{ base: 6, md: 8 }}
                  maxW="900px"
                >
                  <Text
                    fontFamily="heading"
                    fontSize="20px"
                    fontWeight="700"
                    letterSpacing="-.02em"
                    color={colors.heading}
                    mb={4}
                  >
                    Highlights
                  </Text>
                  <VStack align="stretch" spacing={3}>
                    {project.highlights.map((highlight) => (
                      <Flex key={highlight} gap={3} align="flex-start">
                        <Box
                          w="7px"
                          h="7px"
                          borderRadius="full"
                          bg={colors.coral}
                          mt="9px"
                          flexShrink={0}
                        />
                        <Text fontSize="16px" lineHeight="1.7" color={colors.text}>
                          {highlight}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          </Box>

          {/* Facts sidebar */}
          <Box display={{ base: "none", lg: "block" }}>
            <Box
              position="sticky"
              top="110px"
              bg={colors.surfaceAlt}
              border="2px solid"
              borderColor={colors.ink}
              borderRadius="14px"
              boxShadow="5px 5px 0 rgba(11,47,47,0.9)"
              p={6}
            >
              <Text
                className="public-mono"
                fontSize="12px"
                fontWeight="500"
                color={colors.muted}
                mb={4}
              >
                spec sheet
              </Text>

              <VStack align="stretch" spacing={4}>
                {project.role && <FactRow label="Role" value={project.role} />}
                {project.period && <FactRow label="Period" value={project.period} />}
                {project.status && <FactRow label="Status" value={project.status} />}
                {project.tags?.length > 0 && (
                  <Box>
                    <FactLabel>Stack</FactLabel>
                    <Text fontSize="14px" color={LAGOON.text} mt="4px" lineHeight="1.8">
                      {project.tags.join(" · ")}
                    </Text>
                  </Box>
                )}
              </VStack>

              <Text
                className="public-hand"
                fontSize="25px"
                fontWeight="600"
                color={colors.coralDeep}
                transform="rotate(-1deg)"
                mt={6}
                mb={1}
              >
                got questions?
              </Text>
              <Button
                variant="lagoonCoral"
                w="100%"
                h="48px"
                mt={3}
                onClick={() => navigate("/#contact")}
              >
                Contact me
              </Button>
            </Box>
          </Box>
        </Grid>
      </Container>

      {/* Full-size peek: paper-framed lightbox */}
      <Modal isOpen={zoomOpen} onClose={() => setZoomOpen(false)} size="6xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(8,47,46,0.72)" />
        <ModalContent
          position="relative"
          bg="#FFFFFF"
          border="2px solid #0B2F2F"
          borderRadius="14px"
          boxShadow="10px 10px 0 rgba(11,47,47,0.9)"
          mx={4}
          overflow="visible"
          p={{ base: 3, md: 4 }}
        >
          <DoodleTape
            w={72}
            h={18}
            color="rgba(255,200,87,0.85)"
            rotation={-5}
            top="-11px"
            left="30px"
            zIndex={3}
          />
          <IconButton
            icon={<X size={15} />}
            aria-label="Close full-size view"
            position="absolute"
            top={{ base: "10px", md: "12px" }}
            right={{ base: "10px", md: "12px" }}
            w="36px"
            h="36px"
            minW="36px"
            borderRadius="full"
            border="2px solid #0B2F2F"
            bg={LAGOON.coral}
            color="#FFFFFF"
            boxShadow="2px 2px 0 rgba(11,47,47,0.9)"
            onClick={() => setZoomOpen(false)}
            _hover={{ bg: LAGOON.coralDeep }}
            zIndex={3}
          />
          <ModalBody p={0}>
            {project?.title && galleryLength > 0 && (
              <Box>
                <Flex align="center" justify="space-between" gap={3} mb={2.5} pr={{ base: "44px", md: "50px" }}>
                  {hasGallery ? (
                    <HStack spacing={2}>
                      <Button
                        variant="lagoonOutline"
                        size="sm"
                        w="36px"
                        h="36px"
                        px={0}
                        aria-label="Previous image"
                        onClick={zoomPrev}
                      >
                        <ChevronLeft size={15} />
                      </Button>
                      <Button
                        variant="lagoonOutline"
                        size="sm"
                        w="36px"
                        h="36px"
                        px={0}
                        aria-label="Next image"
                        onClick={zoomNext}
                      >
                        <ChevronRight size={15} />
                      </Button>
                    </HStack>
                  ) : (
                    <Box />
                  )}
                  <Text className="public-mono" fontSize="10px" fontWeight="600" color={LAGOON.muted} letterSpacing=".16em" textTransform="uppercase">
                    {galleryLength > 1
                      ? `shot no. ${String(zoomIndex + 1).padStart(2, "0")} / ${String(galleryLength).padStart(2, "0")}`
                      : "full size"}
                  </Text>
                </Flex>

                <Box bg={colors.surfaceTint} border="1.5px solid #0B2F2F" borderRadius="10px" overflow="hidden">
                  <img
                    src={(gallery[zoomIndex] || {}).url}
                    alt={(gallery[zoomIndex] || {}).alt || `${project.title} view ${zoomIndex + 1}`}
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: "72vh",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Flex align="center" justify="center" gap={3} mt={3}>
                  <DoodleSquiggle width={64} color={LAGOON.accent} />
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={colors.text}
                    noOfLines={1}
                  >
                    {(gallery[zoomIndex] || {}).alt || project.title}
                  </Text>
                  <DoodleSquiggle width={64} color={LAGOON.accent} />
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      </Layout>
    </Box>
  );
};

const FactLabel = ({ children }) => (
  <Text
    className="public-mono"
    fontSize="12px"
    fontWeight="500"
    color={LAGOON.muted}
  >
    {children}
  </Text>
);

const FactRow = ({ label, value }) => (
  <Box pb={4} style={{ borderBottom: "1.5px dashed rgba(11,47,47,0.3)" }}>
    <FactLabel>{label}</FactLabel>
    <Text fontSize="15px" fontWeight="700" color={LAGOON.heading} mt="3px">
      {value}
    </Text>
  </Box>
);

export default ProjectPage;
