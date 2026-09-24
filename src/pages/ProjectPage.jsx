import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
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

/*
  LAYOUT — single-column article/news flow, not a split hero+sidebar.

  Title and meta come first (like a headline + byline), then the hero
  image with its gallery thumbnails beside it on wide screens (below it
  on narrow ones), then the full write-up reads underneath as one
  continuous body — the description is never split or truncated.

  Controls (prev/next, counter, zoom) sit in a toolbar BELOW the image
  so they never cover the artwork. The hero image itself supports zoom
  in/out (buttons, Ctrl/Cmd + wheel, keyboard +/-/0, double-click) and
  drag-to-pan when zoomed in.

  The desktop thumbnail rail is height-locked to the hero image and
  scrolls internally, so a long gallery never stretches the page or
  pushes the article body down.
*/

// Splits a description into paragraphs on blank lines so a long write-up
// reads as proper paragraphs; a description with no blank lines still
// renders as a single paragraph, unchanged.
const splitParagraphs = (text) => {
  if (!text) return [];
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.length > 0 ? blocks : [text.trim()];
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.5;
const ZOOM_DOUBLE_CLICK = 2;

// Hero / rail height at lg and up. Fixed so the two columns always
// match and the grid row can't grow with the gallery length.
const HERO_H = { lg: "540px", xl: "580px" };

// Scrolls `el` into view *inside* `container` only — never touching
// the page's own scroll. This is what stops the whole page from
// jumping when the next/prev arrow lands on a thumbnail at the edge
// of the rail.
const scrollWithin = (container, el) => {
  if (!container || !el) return;
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  let deltaY = 0;
  if (eRect.top < cRect.top) deltaY = eRect.top - cRect.top;
  else if (eRect.bottom > cRect.bottom) deltaY = eRect.bottom - cRect.bottom;
  let deltaX = 0;
  if (eRect.left < cRect.left) deltaX = eRect.left - cRect.left;
  else if (eRect.right > cRect.right) deltaX = eRect.right - cRect.right;
  if (deltaY !== 0) container.scrollBy({ top: deltaY, behavior: "smooth" });
  if (deltaX !== 0) container.scrollBy({ left: deltaX, behavior: "smooth" });
};

const ProjectPage = ({ isDownloading, handleDownload }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const colors = useStudioColors();
  const { portfolioData, loading } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Active thumbnail refs (one per rail — desktop & mobile).
  const railActiveRef = useRef(null);
  const rowActiveRef = useRef(null);
  // The scrolling containers that actually clip the rails — we scroll
  // these directly so the page itself never moves.
  const railContainerRef = useRef(null);
  const rowContainerRef = useRef(null);

  const imageContainerRef = useRef(null);
  const dragStateRef = useRef(null);

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
  const galleryLength = project?.gallery?.length || 0;
  const activeMedia = project?.gallery?.[activeIndex];
  const hasGallery = galleryLength > 1;
  const hasActiveMedia = Boolean(activeMedia);
  const descriptionParagraphs = useMemo(
    () => splitParagraphs(project?.description),
    [project?.description],
  );

  // Selalu mulai dari atas saat halaman dibuka / slug berubah.
  // React Router (v6) mempertahankan scroll position saat pindah
  // route, jadi tanpa ini halaman detail bisa muncul di tengah page
  // (mewarisi posisi scroll dari halaman sebelumnya). Kita paksa
  // ke atas — sekali saat mount, dan sekali lagi setiap slug berganti
  // (mis. navigasi dari project A ke project B tanpa unmount).
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Gunakan behavior "auto" (instan) supaya terasa seperti halaman
    // baru, bukan animasi scroll yang aneh.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slug]);

  // Reset zoom & pan whenever the visible image changes — otherwise a
  // zoomed-in shot would carry its zoom level onto the next shot.
  useEffect(() => {
    setZoom(ZOOM_MIN);
    setPan({ x: 0, y: 0 });
    dragStateRef.current = null;
  }, [activeIndex, slug]);

  const goPrev = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i - 1 + galleryLength) % galleryLength);
  }, [hasGallery, galleryLength]);

  const goNext = useCallback(() => {
    if (!hasGallery) return;
    setActiveIndex((i) => (i + 1) % galleryLength);
  }, [hasGallery, galleryLength]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(ZOOM_MIN);
    setPan({ x: 0, y: 0 });
  }, []);

  // Clamp pan so a zoomed-in image can't be dragged entirely offscreen.
  useEffect(() => {
    if (zoom <= 1) {
      if (pan.x !== 0 || pan.y !== 0) setPan({ x: 0, y: 0 });
      return;
    }
    const el = imageContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = ((zoom - 1) * rect.width) / 2;
    const maxY = ((zoom - 1) * rect.height) / 2;
    setPan((p) => {
      const nx = Math.max(-maxX, Math.min(maxX, p.x));
      const ny = Math.max(-maxY, Math.min(maxY, p.y));
      if (nx === p.x && ny === p.y) return p;
      return { x: nx, y: ny };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // Keyboard: left/right cycle the gallery, +/-/0 control zoom.
  useEffect(() => {
    if (!hasGallery && !hasActiveMedia) return undefined;
    const handleKeyDown = (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (hasGallery) {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }
      if (hasActiveMedia) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          zoomIn();
        } else if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          zoomOut();
        } else if (e.key === "0") {
          e.preventDefault();
          resetZoom();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasGallery, hasActiveMedia, goPrev, goNext, zoomIn, zoomOut, resetZoom]);

  // Ctrl/Cmd + scroll wheel zooms the current image. Plain scroll is
  // left untouched so the page keeps scrolling normally.
  useEffect(() => {
    const el = imageContainerRef.current;
    if (!el || !hasActiveMedia) return undefined;
    const handleWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [hasActiveMedia, zoomIn, zoomOut]);

  // Keep the active thumbnail in view — but scroll *only inside its own
  // rail container*, never the page. Prevents the "page slides down a
  // bit" jump when landing on a thumbnail at the rail's edge.
  useEffect(() => {
    if (!hasGallery) return;
    scrollWithin(railContainerRef.current, railActiveRef.current);
    scrollWithin(rowContainerRef.current, rowActiveRef.current);
  }, [activeIndex, hasGallery]);

  // ── Drag-to-pan (only meaningful when zoom > 1) ──
  const handlePointerDown = useCallback(
    (e) => {
      if (zoom <= 1) return;
      if (e.button !== undefined && e.button !== 0) return;
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {
        /* noop */
      }
      dragStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pan.x,
        origY: pan.y,
      };
    },
    [zoom, pan.x, pan.y],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragStateRef.current) return;
      const el = imageContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxX = ((zoom - 1) * rect.width) / 2;
      const maxY = ((zoom - 1) * rect.height) / 2;
      const { startX, startY, origX, origY } = dragStateRef.current;
      const nx = Math.max(-maxX, Math.min(maxX, origX + (e.clientX - startX)));
      const ny = Math.max(-maxY, Math.min(maxY, origY + (e.clientY - startY)));
      setPan({ x: nx, y: ny });
    },
    [zoom],
  );

  const handlePointerUp = useCallback((e) => {
    if (!dragStateRef.current) return;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
    dragStateRef.current = null;
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) resetZoom();
    else setZoom(ZOOM_DOUBLE_CLICK);
  }, [zoom, resetZoom]);

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

  const zoomPercent = Math.round(zoom * 100);
  const isZoomed = zoom > 1;

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

      {/* Padding atas diset eksplisit di Container — bukan pakai
          <br /><br /> seperti sebelumnya. Ini memberi jarak yang
          konsisten dari header tanpa menggeser halaman ke bawah. */}
      <Container
        maxW="1240px"
        px={{ base: 5, md: 8 }}
        pt={{ base: 20, md: 28 }}
        pb={{ base: 12, md: 20 }}
      >
        <Button
          mb={{ base: 8, md: 10 }}
          variant="studioGhost"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "projects" } })}
        >
          Back to Projects
        </Button>

        {/* ── Headline + byline ── */}
        <VStack align="stretch" spacing={4} mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="11px"
            fontWeight="700"
            color={colors.muted}
            textTransform="uppercase"
            letterSpacing=".12em"
          >
            Case study
          </Text>

          <Text
            as="h1"
            fontSize={{ base: "36px", md: "52px", xl: "58px" }}
            fontWeight="800"
            lineHeight="1.05"
          >
            {project.title}
          </Text>

          <HStack spacing={2} flexWrap="wrap">
            <StudioPill>{project.role}</StudioPill>
            {project.period && <StudioPill tone="ghost">{project.period}</StudioPill>}
            {project.status && <StudioPill tone="ghost">{project.status}</StudioPill>}
            {project.tags?.map((tag) => (
              <StudioPill key={tag} tone="ghost">{tag}</StudioPill>
            ))}
          </HStack>

          <HStack spacing={3} flexWrap="wrap" pt={1}>
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

        {/* ── Hero media: main image + gallery. ── */}
        <Grid
          templateColumns={{ base: "1fr", lg: hasGallery ? "1fr 120px" : "1fr" }}
          gap={{ base: 3, lg: 3 }}
          alignItems="stretch"
          mb={{ base: 8, md: 10 }}
        >
          <VStack align="stretch" spacing={3}>
            <Box
              ref={imageContainerRef}
              position="relative"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              overflow="hidden"
              minH={{ base: "300px", md: "420px" }}
              h={HERO_H}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={{ base: 3, md: 6 }}
              cursor={isZoomed ? "grab" : "default"}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={hasActiveMedia ? handleDoubleClick : undefined}
              sx={{ touchAction: isZoomed ? "none" : "auto" }}
              _active={isZoomed ? { cursor: "grabbing" } : undefined}
              userSelect="none"
            >
              {activeMedia ? (
                <LazyLoadImage
                  key={activeMedia.id || activeMedia.url}
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
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: dragStateRef.current
                      ? "none"
                      : "transform .2s ease",
                    willChange: "transform",
                    pointerEvents: "none",
                  }}
                />
              ) : (
                <Box minH="300px" display="grid" placeItems="center" bg={colors.surface}>
                  <Text color={colors.muted}>No preview available</Text>
                </Box>
              )}
            </Box>

            {hasActiveMedia && (
              <HStack
                justify="space-between"
                align="center"
                spacing={3}
                flexWrap="wrap"
              >
                <HStack spacing={2} align="center">
                  {hasGallery && (
                    <>
                      <ToolbarIconButton
                        label="Previous image"
                        onClick={goPrev}
                        colors={colors}
                      >
                        <ChevronLeft size={18} />
                      </ToolbarIconButton>
                      <ToolbarIconButton
                        label="Next image"
                        onClick={goNext}
                        colors={colors}
                      >
                        <ChevronRight size={18} />
                      </ToolbarIconButton>
                      <Text
                        fontSize="12px"
                        fontWeight="700"
                        color={colors.muted}
                        ml={1}
                      >
                        {activeIndex + 1} / {galleryLength}
                      </Text>
                    </>
                  )}
                </HStack>

                <HStack spacing={2} align="center">
                  <ToolbarIconButton
                    label="Zoom out"
                    onClick={zoomOut}
                    colors={colors}
                    disabled={zoom <= ZOOM_MIN}
                  >
                    <ZoomOut size={18} />
                  </ToolbarIconButton>
                  <Text
                    fontSize="12px"
                    fontWeight="700"
                    color={colors.muted}
                    minW="44px"
                    textAlign="center"
                  >
                    {zoomPercent}%
                  </Text>
                  <ToolbarIconButton
                    label="Zoom in"
                    onClick={zoomIn}
                    colors={colors}
                    disabled={zoom >= ZOOM_MAX}
                  >
                    <ZoomIn size={18} />
                  </ToolbarIconButton>
                  <ToolbarIconButton
                    label="Reset zoom"
                    onClick={resetZoom}
                    colors={colors}
                    disabled={!isZoomed}
                  >
                    <RotateCcw size={16} />
                  </ToolbarIconButton>
                </HStack>
              </HStack>
            )}
          </VStack>

          {hasGallery && (
            <>
              <Box
                ref={railContainerRef}
                display={{ base: "none", lg: "flex" }}
                flexDirection="column"
                gap="6px"
                h={HERO_H}
                overflowY="auto"
                pr="4px"
                css={{
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: colors.border,
                    borderRadius: "3px",
                  },
                }}
              >
                {project.gallery.map((item, index) => (
                  <GalleryThumb
                    key={item.id || item.url}
                    ref={index === activeIndex ? railActiveRef : null}
                    item={item}
                    index={index}
                    active={index === activeIndex}
                    onSelect={() => setActiveIndex(index)}
                    colors={colors}
                    title={project.title}
                    aspect="4 / 3"
                  />
                ))}
              </Box>

              <Box
                ref={rowContainerRef}
                display={{ base: "block", lg: "none" }}
                overflowX="auto"
                overflowY="hidden"
                css={{
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { height: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: colors.border,
                    borderRadius: "3px",
                  },
                }}
              >
                <Grid
                  templateColumns={{
                    base: `repeat(${Math.min(galleryLength, 4)}, 1fr)`,
                    md: `repeat(${Math.min(galleryLength, 6)}, 1fr)`,
                  }}
                  gap={{ base: 2, md: 3 }}
                  minW="max-content"
                >
                  {project.gallery.map((item, index) => (
                    <GalleryThumb
                      key={item.id || item.url}
                      ref={index === activeIndex ? rowActiveRef : null}
                      item={item}
                      index={index}
                      active={index === activeIndex}
                      onSelect={() => setActiveIndex(index)}
                      colors={colors}
                      title={project.title}
                      aspect="4 / 3"
                      fixedWidth
                    />
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Grid>

        {/* ── Article body ── */}
        <Box maxW="1240px" mx="auto">
          {descriptionParagraphs.length > 0 && (
            <VStack as="article" align="stretch" spacing={5}>
              {descriptionParagraphs.map((paragraph, index) => (
                <Text
                  key={index}
                  as="p"
                  fontSize={{ base: "16px", md: "18px" }}
                  color={colors.text}
                  lineHeight="1.8"
                >
                  {paragraph}
                </Text>
              ))}
            </VStack>
          )}

          {project.highlights?.length > 0 && (
            <VStack
              align="stretch"
              spacing={3}
              mt={descriptionParagraphs.length > 0 ? 10 : 0}
              pt={descriptionParagraphs.length > 0 ? 8 : 0}
              borderTop={descriptionParagraphs.length > 0 ? "1px solid" : "none"}
              borderColor={colors.border}
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
                <HStack key={highlight} align="start" spacing={3}>
                  <Box w="5px" h="5px" mt="10px" borderRadius="full" bg={colors.muted} flexShrink={0} />
                  <Text fontSize="16px" lineHeight="1.75" color={colors.text}>
                    {highlight}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

// Compact square button used by the toolbar below the image.
const ToolbarIconButton = ({ children, label, onClick, colors, disabled }) => (
  <Box
    as="button"
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    disabled={disabled}
    w="36px"
    h="36px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    border="1px solid"
    borderColor={colors.border}
    bg={colors.surface}
    color={colors.text}
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.4 : 1}
    transition="background .15s ease, border-color .15s ease, transform .12s ease"
    _hover={
      disabled
        ? undefined
        : { bg: colors.surfaceAlt, borderColor: colors.text }
    }
    _active={disabled ? undefined : { transform: "scale(0.94)" }}
    _focusVisible={{
      outline: "2px solid",
      outlineColor: colors.accent,
      outlineOffset: "2px",
    }}
  >
    {children}
  </Box>
);

const GalleryThumb = React.forwardRef(
  (
    { item, index, active, onSelect, colors, title, aspect, fixedWidth },
    ref,
  ) => (
    <Box
      ref={ref}
      as="button"
      type="button"
      onClick={onSelect}
      border="1px solid"
      borderColor={active ? colors.text : colors.border}
      bg={colors.surfaceAlt}
      overflow="hidden"
      cursor="pointer"
      p={0}
      flexShrink={0}
      w={fixedWidth ? { base: "72px", md: "96px" } : undefined}
    >
      <LazyLoadImage
        src={item.thumbnail || item.url}
        alt={item.alt || `${title} thumbnail ${index + 1}`}
        effect="opacity"
        loading="lazy"
        decoding="async"
        width="100%"
        height="100%"
        style={{
          width: "100%",
          aspectRatio: aspect,
          objectFit: "contain",
          display: "block",
          background: colors.surface,
        }}
      />
    </Box>
  ),
);

export default ProjectPage;