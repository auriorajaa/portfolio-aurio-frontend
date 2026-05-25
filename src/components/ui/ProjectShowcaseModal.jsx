import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Images,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { normalizeProject } from "../../utils/projectMedia";
import { RetroBadge, useRetroColors } from "./retro";

const ProjectShowcaseModal = ({ project, isOpen, onClose }) => {
  const colors = useRetroColors();
  const normalized = useMemo(() => normalizeProject(project || {}), [project]);
  const gallery = normalized.gallery || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] || gallery[0];
  const touchStartX = useRef(null);
  const activeThumbRef = useRef(null);

  // ── Zoom state ──
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
    setZoom({ scale: 1, x: 0, y: 0 });
  }, [project?.id, project?.slug]);

  useEffect(() => {
    setZoom({ scale: 1, x: 0, y: 0 });
  }, [activeIndex]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  if (!project) return null;

  const go = (direction) => {
    if (gallery.length === 0) return;
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return gallery.length - 1;
      if (next >= gallery.length) return 0;
      return next;
    });
  };

  // ── Zoom helpers ──
  const constrainZoom = (scale, x, y) => {
    if (!containerRef.current) return { scale, x, y };
    const rect = containerRef.current.getBoundingClientRect();
    if (scale <= 1) return { scale: 1, x: 0, y: 0 };
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const zoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ns = Math.min(zoom.scale + 0.6, 4);
    const r = ns / zoom.scale;
    setZoom(constrainZoom(ns, cx - (cx - zoom.x) * r, cy - (cy - zoom.y) * r));
  };

  const zoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ns = Math.max(zoom.scale - 0.6, 1);
    const r = ns / zoom.scale;
    setZoom(constrainZoom(ns, cx - (cx - zoom.x) * r, cy - (cy - zoom.y) * r));
  };

  const resetZoom = () => setZoom({ scale: 1, x: 0, y: 0 });

  // ── Mouse / wheel ──
  const handleWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = -e.deltaY * 0.002;
    const ns = Math.min(Math.max(zoom.scale + delta, 1), 4);
    if (Math.abs(ns - zoom.scale) < 0.01) return;
    const r = ns / zoom.scale;
    setZoom(constrainZoom(ns, mx - (mx - zoom.x) * r, my - (my - zoom.y) * r));
  };

  const handleDoubleClick = () => {
    if (zoom.scale > 1) resetZoom();
    else zoomIn();
  };

  const handleMouseDown = (e) => {
    if (zoom.scale > 1) {
      dragRef.current = { x: e.clientX - zoom.x, y: e.clientY - zoom.y };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setZoom(
      constrainZoom(
        zoom.scale,
        e.clientX - dragRef.current.x,
        e.clientY - dragRef.current.y
      )
    );
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  // ── Touch (swipe + pinch + pan) ──
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        scale: zoom.scale,
      };
      dragRef.current = null;
      touchStartX.current = null;
    } else if (e.touches.length === 1) {
      if (zoom.scale > 1) {
        dragRef.current = {
          x: e.touches[0].clientX - zoom.x,
          y: e.touches[0].clientY - zoom.y,
        };
        pinchRef.current = null;
        touchStartX.current = null;
      } else {
        pinchRef.current = null;
        dragRef.current = null;
        touchStartX.current = e.touches[0].clientX;
      }
    }
  };

  const handleTouchMove = (e) => {
    if (pinchRef.current && e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ns = Math.min(
        Math.max((dist / pinchRef.current.dist) * pinchRef.current.scale, 1),
        4
      );
      setZoom(constrainZoom(ns, zoom.x, zoom.y));
    } else if (dragRef.current && e.touches.length === 1) {
      e.preventDefault();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setZoom(
        constrainZoom(
          zoom.scale,
          e.touches[0].clientX - dragRef.current.x,
          e.touches[0].clientY - dragRef.current.y
        )
      );
    }
  };

  const handleTouchEnd = (e) => {
    if (pinchRef.current && e.touches.length === 0) {
      pinchRef.current = null;
      dragRef.current = null;
      touchStartX.current = null;
      return;
    }
    if (dragRef.current && e.touches.length === 0) {
      dragRef.current = null;
      touchStartX.current = null;
      return;
    }
    if (touchStartX.current === null || gallery.length < 2) {
      touchStartX.current = null;
      return;
    }
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 42) return;
    go(delta > 0 ? -1 : 1);
  };

  const renderGalleryStrip = () => {
    if (gallery.length <= 1) return null;

    return (
      <Box
        px={{ base: 2, md: 3 }}
        py={2}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={colors.border}
        bg={colors.panelBg}
        overflowX="auto"
        overflowY="hidden"
        maxW="100%"
        sx={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
          touchAction: "pan-x",
        }}
      >
        <Flex
          as="ul"
          listStyleType="none"
          m={0}
          p={0}
          gap={2}
          w="max-content"
          minW="100%"
        >
          {gallery.map((item, index) => {
            const thumb = item.thumbnail || item.url;

            return (
              <Box
                as="li"
                key={item.id}
                ref={index === activeIndex ? activeThumbRef : null}
                onClick={() => setActiveIndex(index)}
                w={{ base: "82px", md: "96px" }}
                h={{ base: "60px", md: "68px" }}
                flex="0 0 auto"
                border="1px solid"
                borderColor={
                  index === activeIndex ? colors.link : colors.borderSoft
                }
                bg={colors.panelAlt}
                cursor="pointer"
                scrollSnapAlign="start"
                display="grid"
                placeItems="center"
                overflow="hidden"
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={item.alt || item.title || normalized.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Images size={22} color={colors.link} />
                )}
              </Box>
            );
          })}
        </Flex>
      </Box>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "6xl" }}
      isCentered
    >
      <ModalOverlay bg="rgba(0,0,0,.78)" />
      <ModalContent
        borderRadius="0"
        overflow="hidden"
        m={{ base: 0, md: 4 }}
        w={{ base: "100vw", md: "calc(100vw - 32px)" }}
        maxW={{ base: "100vw", "2xl": "1280px" }}
        h={{ base: "100dvh", md: "auto" }}
        maxH={{ base: "100dvh", md: "calc(100dvh - 32px)" }}
      >
        <ModalHeader flexShrink={0}>
          <Flex align="center" justify="space-between" gap={3} pr={8}>
            <Box minW={0}>
              <Text fontSize="18px" fontWeight="bold" noOfLines={1}>
                {normalized.title}
              </Text>
              <Text fontSize="14px" color={colors.muted} noOfLines={1}>
                {normalized.role}{" "}
                {normalized.period ? `/ ${normalized.period}` : ""}{" "}
                {gallery.length > 1
                  ? `/ image ${activeIndex + 1} of ${gallery.length}`
                  : ""}
              </Text>
            </Box>
            <HStack spacing={1} display={{ base: "none", md: "flex" }}>
              <RetroBadge tone="green">{normalized.status}</RetroBadge>
              <RetroBadge tone="amber">{gallery.length || 1} images</RetroBadge>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton borderRadius="0" />
        <ModalBody p={0} flex="1" minH={0} overflowY="auto" overflowX="hidden">
          <Grid
            templateColumns={{ base: "1fr", "2xl": "minmax(0, 1fr) 320px" }}
            minH={0}
          >
            <VStack
              align="stretch"
              spacing={0}
              minW={0}
              borderRight={{ base: "none", "2xl": "1px solid" }}
              borderColor={colors.border}
            >
              <Box
                ref={containerRef}
                bg="#0b0f14"
                h={{
                  base: "min(100vw, 430px)",
                  md: "min(70vw, 560px)",
                  "2xl": "min(560px, calc(100dvh - 210px))",
                }}
                minH={{ base: "260px", md: "400px", "2xl": "360px" }}
                maxH={{ base: "430px", md: "560px" }}
                position="relative"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                touchAction="pan-y"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {active?.url ? (
                  <Image
                    src={active.url}
                    alt={active.alt || normalized.title}
                    display="block"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    objectPosition="center center"
                    mx="auto"
                    draggable={false}
                    userSelect="none"
                    style={{
                      transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
                      transformOrigin: "center center",
                      transition: dragRef.current
                        ? "none"
                        : "transform 0.15s ease-out",
                      cursor:
                        zoom.scale > 1
                          ? dragRef.current
                            ? "grabbing"
                            : "grab"
                          : "default",
                    }}
                  />
                ) : (
                  <Flex h="100%" align="center" justify="center" color="white">
                    <Text fontSize="16px">No showcase image available.</Text>
                  </Flex>
                )}

                {/* Zoom controls */}
                {active?.url && (
                  <HStack
                    position="absolute"
                    top={3}
                    right={3}
                    zIndex={3}
                    bg="rgba(0,0,0,0.65)"
                    backdropFilter="blur(4px)"
                    borderRadius="md"
                    px={2}
                    py={1}
                    spacing={1}
                  >
                    <Text
                      fontSize="11px"
                      color="white"
                      fontWeight="bold"
                      minW="36px"
                      textAlign="center"
                    >
                      {Math.round(zoom.scale * 100)}%
                    </Text>
                    <IconButton
                      icon={<ZoomIn size={15} />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "rgba(255,255,255,0.15)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomIn();
                      }}
                      aria-label="Zoom in"
                    />
                    <IconButton
                      icon={<ZoomOut size={15} />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "rgba(255,255,255,0.15)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomOut();
                      }}
                      aria-label="Zoom out"
                    />
                    <IconButton
                      icon={<RotateCcw size={15} />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "rgba(255,255,255,0.15)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetZoom();
                      }}
                      aria-label="Reset zoom"
                    />
                  </HStack>
                )}

                {gallery.length > 1 && (
                  <>
                    <IconButton
                      icon={<ChevronLeft size={18} />}
                      position="absolute"
                      left={{ base: 2, md: 3 }}
                      top="50%"
                      transform="translateY(-50%)"
                      size="sm"
                      h={{ base: "34px", md: "38px" }}
                      minW={{ base: "34px", md: "38px" }}
                      variant="facebookGray"
                      onClick={() => go(-1)}
                      aria-label="Previous image"
                      zIndex={2}
                    />
                    <IconButton
                      icon={<ChevronRight size={18} />}
                      position="absolute"
                      right={{ base: 2, md: 3 }}
                      top="50%"
                      transform="translateY(-50%)"
                      size="sm"
                      h={{ base: "34px", md: "38px" }}
                      minW={{ base: "34px", md: "38px" }}
                      variant="facebookGray"
                      onClick={() => go(1)}
                      aria-label="Next image"
                      zIndex={2}
                    />
                  </>
                )}
              </Box>

              {renderGalleryStrip()}
            </VStack>

            <VStack align="stretch" spacing={0} bg={colors.panelBg} minW={0}>
              <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                <Text fontSize="16px" lineHeight="1.5" color={colors.text}>
                  {normalized.description}
                </Text>
              </Box>

              {normalized.highlights?.length > 0 && (
                <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                  <Text
                    fontSize="14px"
                    fontWeight="bold"
                    mb={2}
                    color={colors.muted}
                  >
                    HIGHLIGHTS
                  </Text>
                  <VStack align="stretch" spacing={1}>
                    {normalized.highlights.map((highlight) => (
                      <HStack key={highlight} spacing={2} align="start">
                        <Box
                          mt="6px"
                          w="5px"
                          h="5px"
                          bg={colors.link}
                          flexShrink={0}
                        />
                        <Text fontSize="15px" color={colors.text}>
                          {highlight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                <Text
                  fontSize="14px"
                  fontWeight="bold"
                  mb={2}
                  color={colors.muted}
                >
                  STACK
                </Text>
                <HStack spacing={1} flexWrap="wrap">
                  {normalized.tags.map((tag) => (
                    <RetroBadge key={tag}>{tag}</RetroBadge>
                  ))}
                </HStack>
              </Box>

              <Box p={3}>
                <HStack spacing={2} flexWrap="wrap">
                  {active?.url && (
                    <Button
                      as={Link}
                      href={active.url}
                      isExternal
                      variant="facebook"
                      leftIcon={<Images size={14} />}
                      size="sm"
                      _hover={{ textDecoration: "none" }}
                    >
                      Open Image
                    </Button>
                  )}
                  {normalized.github && (
                    <Button
                      as={Link}
                      href={normalized.github}
                      isExternal
                      variant="facebookGray"
                      leftIcon={<Github size={14} />}
                      size="sm"
                      _hover={{ textDecoration: "none" }}
                    >
                      Code
                    </Button>
                  )}
                  {normalized.website && (
                    <Button
                      as={Link}
                      href={normalized.website}
                      isExternal
                      variant="facebookGray"
                      leftIcon={<ExternalLink size={14} />}
                      size="sm"
                      _hover={{ textDecoration: "none" }}
                    >
                      Live Demo
                    </Button>
                  )}
                </HStack>
              </Box>
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProjectShowcaseModal;
