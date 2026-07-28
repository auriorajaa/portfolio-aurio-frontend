import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
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
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, X, ZoomIn, ZoomOut } from "lucide-react";
import { normalizeProject } from "../../utils/projectMedia";
import { useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

const ProjectShowcaseModal = ({ project, isOpen, onClose }) => {
  const colors = useStudioColors();
  const normalized = useMemo(() => normalizeProject(project || {}), [project]);
  const gallery = normalized.gallery || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const modalRef = useRef(null);
  const touchStartX = useRef(null);

  // ── Pinch zoom refs ──
  const pinchStartDist = useRef(null);
  const pinchStartZoom = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
    setZoom(1);
  }, [project?.id, project?.slug]);

  useEffect(() => {
    setZoom(1);
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") setZoom(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, activeIndex, zoom, gallery.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useGSAP(
    () => {
      if (!isOpen || !modalRef.current || prefersReducedMotion()) return;
      gsap.from(modalRef.current, { scale: 0.96, autoAlpha: 0, duration: 0.26, ease: "power2.out" });
      gsap.from("[data-modal-part]", { y: 14, autoAlpha: 0, duration: 0.38, ease: "power2.out", stagger: 0.04 });
    },
    { dependencies: [isOpen], scope: modalRef },
  );

  const go = useCallback((direction) => {
    if (gallery.length < 2) return;
    setActiveIndex((cur) => {
      const next = cur + direction;
      if (next < 0) return gallery.length - 1;
      if (next >= gallery.length) return 0;
      return next;
    });
  }, [gallery.length]);

  const close = useCallback(() => {
    if (prefersReducedMotion() || !modalRef.current) { onClose(); return; }
    gsap.to(modalRef.current, { scale: 0.98, autoAlpha: 0, duration: 0.18, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN));
  }, []);

  // ── Helpers for pinch ──
  const getPinchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ── Touch: swipe (1 finger) + pinch zoom (2 fingers) ──
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getPinchDistance(e.touches);
      pinchStartZoom.current = zoom;
      touchStartX.current = null;
      return;
    }
    if (zoom > 1) return; // allow native pan when zoomed
    touchStartX.current = e.touches[0].clientX;
  }, [zoom]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      e.preventDefault();
      const currentDist = getPinchDistance(e.touches);
      const scale = currentDist / pinchStartDist.current;
      const newZoom = Math.min(Math.max(pinchStartZoom.current * scale, ZOOM_MIN), ZOOM_MAX);
      setZoom(+(newZoom).toFixed(2));
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (pinchStartDist.current !== null) {
      pinchStartDist.current = null;
      pinchStartZoom.current = null;
      return;
    }
    if (touchStartX.current === null || zoom > 1) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 42) go(delta > 0 ? -1 : 1);
  }, [zoom, go]);

  // ── Wheel: Ctrl/Cmd + scroll = zoom (trackpad pinch gesture) ──
  const handleWheel = useCallback((e) => {
    const isZoomGesture = e.ctrlKey || e.metaKey;
    if (!isZoomGesture && zoom <= ZOOM_MIN) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.005;
    const newZoom = Math.min(Math.max(zoom + delta, ZOOM_MIN), ZOOM_MAX);
    setZoom(+(newZoom).toFixed(2));
  }, [zoom]);

  if (!project) return null;

  const isZoomed = zoom > 1;

  return (
    <Modal isOpen={isOpen} onClose={close} size="6xl" isCentered trapFocus scrollBehavior="inside">
      <ModalOverlay bg={colors.overlay} backdropFilter="blur(14px)" />
      <ModalContent
        ref={modalRef}
        bg={colors.surfaceAlt}
        color={colors.text}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="0"
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
        maxH={{ base: "calc(100dvh - 16px)", md: "90dvh" }}
        overflow="hidden"
        mx={{ base: 2, md: 4 }}
      >
        <ModalBody p={0} overflowY={{ base: "auto", lg: "hidden" }}>
          <Grid
            templateColumns={{ base: "1fr", lg: "minmax(0, 1.05fr) .95fr" }}
            maxH={{ lg: "90dvh" }}
          >

            {/* ── Image panel ── */}
            <Flex
              data-modal-part
              direction="column"
              minH={{ base: "38dvh", md: "70vh" }}
              maxH={{ base: "42dvh", md: "90dvh" }}
              bg={colors.surface}
              position="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Scrollable viewport */}
              <Box
                flex="1"
                overflow={isZoomed ? "auto" : "hidden"}
                pb="44px"
                position="relative"
                onWheel={handleWheel}
              >
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  width={isZoomed ? `${zoom * 100}%` : "100%"}
                  height={isZoomed ? `${zoom * 100}%` : "100%"}
                  minWidth={isZoomed ? `${zoom * 100}%` : "100%"}
                  minHeight={isZoomed ? `${zoom * 100}%` : "100%"}
                >
                  {gallery.map((item, i) => (
                    <Box
                      key={item.url || i}
                      position="absolute"
                      inset={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      style={{
                        opacity: i === activeIndex ? 1 : 0,
                        transition: "opacity 0.22s ease",
                        pointerEvents: i === activeIndex ? "auto" : "none",
                        zIndex: i === activeIndex ? 1 : 0,
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.alt || normalized.title}
                        loading={i === activeIndex ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === activeIndex ? "high" : "low"}
                        style={{
                          display: "block",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          width: "auto",
                          height: "auto",
                          objectFit: "contain",
                          userSelect: "none",
                          draggable: false,
                        }}
                        draggable={false}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* ── Bottom bar ── */}
              <HStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="44px"
                px={3}
                spacing={0}
                justify={gallery.length > 1 ? "space-between" : "flex-end"}
                bg={`${colors.surfaceAlt}F2`}
                backdropFilter="blur(10px)"
                borderTop="1px solid"
                borderColor={colors.border}
                zIndex={2}
              >
                {gallery.length > 1 && (
                  <HStack spacing={1}>
                    <IconButton
                      icon={<ChevronLeft size={16} />}
                      aria-label="Previous image"
                      variant="studioGhost"
                      size="sm"
                      onClick={() => go(-1)}
                    />
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      color={colors.muted}
                      minW="44px"
                      textAlign="center"
                      fontVariantNumeric="tabular-nums"
                      userSelect="none"
                    >
                      {activeIndex + 1} / {gallery.length}
                    </Text>
                    <IconButton
                      icon={<ChevronRight size={16} />}
                      aria-label="Next image"
                      variant="studioGhost"
                      size="sm"
                      onClick={() => go(1)}
                    />
                  </HStack>
                )}

                <HStack spacing={1}>
                  <IconButton
                    icon={<ZoomOut size={14} />}
                    aria-label="Zoom out"
                    variant="studioGhost"
                    size="sm"
                    isDisabled={zoom <= ZOOM_MIN}
                    onClick={handleZoomOut}
                  />
                  <Box
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    bg={isZoomed ? `${colors.muted}14` : "transparent"}
                    transition="background 0.2s"
                    minW="36px"
                    textAlign="center"
                    cursor={isZoomed ? "pointer" : "default"}
                    onClick={() => isZoomed && setZoom(1)}
                    title={isZoomed ? "Reset zoom" : undefined}
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={isZoomed ? colors.text : colors.muted}
                      fontVariantNumeric="tabular-nums"
                      userSelect="none"
                    >
                      {Math.round(zoom * 100)}%
                    </Text>
                  </Box>
                  <IconButton
                    icon={<ZoomIn size={14} />}
                    aria-label="Zoom in"
                    variant="studioGhost"
                    size="sm"
                    isDisabled={zoom >= ZOOM_MAX}
                    onClick={handleZoomIn}
                  />
                </HStack>
              </HStack>
            </Flex>

            {/* ── Info panel ── */}
            <VStack
              align="stretch"
              spacing={5}
              p={{ base: 5, md: 6 }}
              pb={{ base: 0, md: 6 }}
              overflowY={{ base: "visible", lg: "auto" }}
              minH={0}
            >
              <Flex data-modal-part justify="space-between" align="start" gap={4}>
                <Box flex="1" minW="0">
                  <Text fontSize="12px" color={colors.muted} textTransform="uppercase" letterSpacing=".08em" mb={1}>
                    {normalized.role} {normalized.period ? `/ ${normalized.period}` : ""}
                  </Text>
                  <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800" lineHeight="1.15">
                    {normalized.title}
                  </Text>
                </Box>
                <IconButton
                  icon={<X size={16} />}
                  aria-label="Close project"
                  variant="studioGhost"
                  onClick={close}
                  flexShrink={0}
                />
              </Flex>

              <Text data-modal-part fontSize={{ base: "14px", md: "15px" }} lineHeight="1.7" color={colors.text}>
                {normalized.description}
              </Text>

              {normalized.highlights?.length > 0 && (
                <VStack data-modal-part align="stretch" spacing={2} borderTop="1px solid" borderColor={colors.border} pt={4}>
                  {normalized.highlights.map((highlight) => (
                    <Text key={highlight} fontSize="14px" lineHeight="1.6" color={colors.muted}>
                      {highlight}
                    </Text>
                  ))}
                </VStack>
              )}

              <Text data-modal-part fontSize="13px" color={colors.muted}>
                {(normalized.tags || []).join(" / ")}
              </Text>

              <HStack
                data-modal-part
                spacing={3}
                flexWrap="wrap"
                position={{ base: "sticky", md: "static" }}
                bottom={0}
                bg={colors.surfaceAlt}
                borderTop={{ base: "1px solid", md: "none" }}
                borderColor={colors.border}
                mx={{ base: -5, md: 0 }}
                px={{ base: 5, md: 0 }}
                py={{ base: 4, md: 0 }}
                zIndex={2}
              >
                {normalized.github && (
                  <Button as={Link} href={normalized.github} isExternal variant="studioGhost" leftIcon={<Github size={14} />} _hover={{ textDecoration: "none" }}>
                    Source
                  </Button>
                )}
                {normalized.website && (
                  <Button as={Link} href={normalized.website} isExternal variant="studio" leftIcon={<ExternalLink size={14} />} _hover={{ textDecoration: "none" }}>
                    Live demo
                  </Button>
                )}
              </HStack>
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProjectShowcaseModal;
