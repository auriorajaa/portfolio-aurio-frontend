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
import {
  BRUT,
  PublicShell,
  usePublicColors,
  BrutTag,
  DoodleAsterisk,
  DoodleRocket,
  DoodleSquiggle,
  StickerTape,
} from "../components/public/brutal";
import { Navbar } from "../components/public/Navbar";
import PublicLayout from "../components/layout/PublicLayout";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slug]);

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
      <PublicShell bg={BRUT.bg}>
        <Navbar isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="50vh">
          <Text fontFamily="spaceMono" fontSize="14.5px" fontWeight="700" color={BRUT.ink}>
            LOADING PROJECT...
          </Text>
        </Center>
      </PublicShell>
    );
  }

  if (!project) {
    return (
      <PublicShell bg={BRUT.bg}>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="description" content={description} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Navbar isDownloading={isDownloading} handleDownload={handleDownload} />
        <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} py={{ base: 12, md: 16 }}>
          <Button
            variant="brutOutline"
            size="sm"
            leftIcon={<ArrowLeft size={15} />}
            onClick={() => navigate("/")}
            mb={6}
          >
            Back to Portfolio
          </Button>
          <Flex align="center" gap={4}>
            <Text
              as="h1"
              fontFamily="bungee"
              fontSize={{ base: "30px", md: "40px" }}
              lineHeight="1.15"
              color={colors.heading}
            >
              Project not found
            </Text>
            <DoodleSquiggle width={90} color={colors.coral} display={{ base: "none", md: "block" }} />
          </Flex>
          <Text fontSize="16px" color={BRUT.inkSoft} mt={3}>
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

  const metaTags = [
    project.role && { label: project.role, tone: "mint" },
    project.period && { label: project.period, tone: "paper" },
    project.status && { label: project.status, tone: "blue" },
  ].filter(Boolean);

  return (
    <Box ref={pageRef}>
      <PublicLayout isDownloading={isDownloading} handleDownload={handleDownload}>
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
          variant="brutOutline"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "projects" } })}
          mb={8}
        >
          All Projects
        </Button>

        {/* Headline */}
        <Flex align="center" gap={2.5} flexWrap="wrap" mb={{ base: 5, md: 6 }}>
          {metaTags.map((tag) => (
            <BrutTag key={tag.label} tone={tag.tone}>
              {tag.label}
            </BrutTag>
          ))}
          {isFeatured && (
            <BrutTag tone="yellow">
              ★ featured
            </BrutTag>
          )}
        </Flex>

        <Text
          as="h1"
          fontFamily="bungee"
          fontSize={{ base: "30px", md: "46px" }}
          lineHeight="1.12"
          letterSpacing="0"
          color={colors.heading}
          maxW="900px"
          mb={4}
        >
          {project.title}
        </Text>
        <Flex align="center" gap={2} mb={{ base: 8, md: 9 }}>
          <DoodleRocket size={30} />
          <Text
            fontFamily="heading"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="600"
            color={colors.primaryDeep}

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
              variant="brutOutline"
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
              variant="brut"
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
            {/* Cover panel */}
            <Box
              className="page-frame"
              position="relative"
              border="2.5px solid"
              borderColor={colors.ink}
              borderRadius="12px"
              bg={colors.primarySoft}
              overflow="hidden"
              boxShadow={colors.shadowLg}
              mb={5}
              data-page-reveal
            >
              <Box
                aria-hidden="true"
                className="public-dots"
                position="absolute"
                top="14px"
                right="16px"
                w="110px"
                h="90px"
                opacity={0.5}
              />
              <Flex
                h={{ base: "300px", md: "540px" }}
                align="center"
                justify="center"
                p={{ base: 5, md: 8 }}
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
                    w="42px"
                    h="42px"
                    bg={colors.yellow}
                    border="2px solid #17181C"
                    color="#17181C"
                    borderRadius="6px"
                    boxShadow={colors.shadowXs}
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
                      borderRadius: "8px",
                      border: "2px solid #17181C",
                      background: "#FFFFFF",
                    }}
                  />
                ) : (
                  <Text color={BRUT.ink} fontFamily="spaceMono" fontSize="14px" fontWeight="700" textTransform="uppercase" letterSpacing=".1em">
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
                        variant="brutOutline"
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
                        variant="brutOutline"
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
                    <Text fontFamily="spaceMono" fontSize="13.5px" fontWeight="700" color={BRUT.ink}>
                      IMAGE {activeIndex + 1}/{galleryLength}
                    </Text>
                  </Flex>
                )}

                <Flex gap="10px" flexWrap="wrap">
                  {gallery.map((item, index) => (
                    <Box
                      key={item.id || item.url}
                      as="button"
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      w="76px"
                      border={index === activeIndex ? "2.5px solid #17181C" : "1.5px solid rgba(23,24,28,0.45)"}
                      borderBottom={index === activeIndex ? "4px solid #17181C" : "1.5px solid rgba(23,24,28,0.45)"}
                      borderRadius="6px"
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
                  bg={colors.yellowSoft}
                  border="2px solid"
                  borderColor={colors.ink}
                  borderRadius="12px"
                  boxShadow={colors.shadow}
                  p={{ base: 6, md: 8 }}
                  maxW="900px"
                  data-page-reveal
                >
                  <Flex align="center" gap={3} mb={5}>
                    <DoodleAsterisk size={18} color={colors.coralDeep} />
                    <Text
                      fontFamily="heading"
                      fontSize="22px"
                      fontWeight="700"
                      color={colors.heading}
                    >
                      Highlights
                    </Text>
                  </Flex>
                  <VStack align="stretch" spacing={3}>
                    {project.highlights.map((highlight) => (
                      <Flex key={highlight} gap={3} align="flex-start">
                        <Box
                          as="span"
                          w="9px"
                          h="9px"
                          borderRadius="2px"
                          bg={colors.primary}
                          border="1.5px solid"
                          borderColor={colors.ink}
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

          {/* Spec-sheet ticket */}
          <Box display={{ base: "none", lg: "block" }}>
            <Box
              position="sticky"
              top="110px"
              bg={colors.surface}
              border="2.5px solid"
              borderColor={colors.ink}
              borderRadius="10px"
              boxShadow={colors.shadowLg}
              p={6}
              data-page-reveal
            >
              <Flex align="center" gap={2} mb={5}>
                <Text
                  fontFamily="bungee"
                  fontSize="12px"
                  color={colors.primaryDeep}
                  letterSpacing=".04em"
                >
                  SPEC SHEET
                </Text>
                <Box flex="1" borderBottom="2px dashed rgba(23,24,28,0.3)" />
              </Flex>

              <VStack align="stretch" spacing={4}>
                {project.role && <FactRow label="Role" value={project.role} />}
                {project.period && <FactRow label="Period" value={project.period} />}
                {project.status && <FactRow label="Status" value={project.status} />}
                {project.tags?.length > 0 && (
                  <Box>
                    <FactLabel>Stack</FactLabel>
                    <Text fontFamily="spaceMono" fontSize="12.5px" color={colors.text} mt="6px" lineHeight="2">
                      {project.tags.join(" · ")}
                    </Text>
                  </Box>
                )}
              </VStack>

              <Text
                fontFamily="heading"
                fontSize="20px"
                fontWeight="600"
                color={colors.coralDeep}

                mt={6}
                mb={1}
              >
                got questions?
              </Text>
              <Button
                variant="brutCoral"
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

      {/* Full-size lightbox */}
      <Modal isOpen={zoomOpen} onClose={() => setZoomOpen(false)} size="6xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(23,24,28,0.72)" />
        <ModalContent
          position="relative"
          bg="#FFFFFF"
          border="2.5px solid #17181C"
          borderRadius="10px"
          boxShadow="10px 10px 0 rgba(23,24,28,0.9)"
          mx={4}
          overflow="visible"
          p={{ base: 3, md: 4 }}
        >
          <StickerTape
            w={72}
            h={18}
            color="rgba(255,210,63,0.85)"

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
            w="38px"
            h="38px"
            minW="38px"
            borderRadius="6px"
            border="2px solid #17181C"
            bg={BRUT.coral}
            color="#FFFFFF"
            boxShadow="2.5px 2.5px 0 rgba(23,24,28,0.9)"
            onClick={() => setZoomOpen(false)}
            _hover={{ bg: BRUT.coralDeep }}
            zIndex={3}
          />
          <ModalBody p={0}>
            {project?.title && galleryLength > 0 && (
              <Box>
                <Flex align="center" justify="space-between" gap={3} mb={3} pr={{ base: "46px", md: "52px" }}>
                  {hasGallery ? (
                    <HStack spacing={2}>
                      <Button
                        variant="brutOutline"
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
                        variant="brutOutline"
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
                  <Text fontFamily="spaceMono" fontSize="12.5px" fontWeight="700" color={BRUT.ink} letterSpacing=".14em" textTransform="uppercase">
                    {galleryLength > 1
                      ? `shot ${String(zoomIndex + 1).padStart(2, "0")} / ${String(galleryLength).padStart(2, "0")}`
                      : "full size"}
                  </Text>
                </Flex>

                <Box bg={colors.primarySoft} border="2px solid #17181C" borderRadius="8px" overflow="hidden">
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
                  <DoodleSquiggle width={48} color={colors.primary} />
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={colors.text}
                    noOfLines={1}
                  >
                    {(gallery[zoomIndex] || {}).alt || project.title}
                  </Text>
                  <DoodleSquiggle width={48} color={colors.primary} />
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      </PublicLayout>
    </Box>
  );
};

const FactLabel = ({ children }) => (
  <Text
    fontFamily="spaceMono"
    fontSize="10.5px"
    fontWeight="700"
    letterSpacing=".14em"
    textTransform="uppercase"
    color={BRUT.ink}
  >
    {children}
  </Text>
);

const FactRow = ({ label, value }) => (
  <Box pb={4} style={{ borderBottom: "2px dashed rgba(23,24,28,0.22)" }}>
    <FactLabel>{label}</FactLabel>
    <Text fontFamily="heading" fontSize="16px" fontWeight="600" color="#17181C" mt="5px">
      {value}
    </Text>
  </Box>
);

export default ProjectPage;
