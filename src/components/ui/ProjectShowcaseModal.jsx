import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
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
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Github } from "lucide-react";
import { normalizeProject } from "../../utils/projectMedia";
import { RetroBadge, useRetroColors } from "./retro";

const ProjectShowcaseModal = ({ project, isOpen, onClose }) => {
  const colors = useRetroColors();
  const normalized = useMemo(() => normalizeProject(project || {}), [project]);
  const gallery = normalized.gallery || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] || gallery[0];

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,.78)" />
      <ModalContent borderRadius="0" overflow="hidden">
        <ModalHeader>
          <Flex align="center" justify="space-between" gap={3} pr={8}>
            <Box minW={0}>
              <Text fontSize="15px" fontWeight="bold" noOfLines={1}>
                {normalized.title}
              </Text>
              <Text fontSize="11px" color={colors.muted} noOfLines={1}>
                {normalized.role} {normalized.period ? `/ ${normalized.period}` : ""}
              </Text>
            </Box>
            <HStack spacing={1} display={{ base: "none", md: "flex" }}>
              <RetroBadge tone="green">{normalized.status}</RetroBadge>
              <RetroBadge tone="amber">{gallery.length || 1} media</RetroBadge>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton borderRadius="0" />
        <ModalBody p={0}>
          <Grid templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 300px" }}>
            <Box
              // bg="#0b0f14"
              minH={{ base: "280px", md: "520px" }}
              borderRight={{ base: "none", lg: "1px solid" }}
              borderColor={colors.border}
              position="relative"
            >
              {active?.type === "pdf" ? (
                <Flex
                  h={{ base: "280px", md: "520px" }}
                  align="center"
                  justify="center"
                  direction="column"
                  gap={3}
                  color="white"
                  textAlign="center"
                  px={6}
                >
                  <FileText size={52} />
                  <Text fontSize="15px" fontWeight="bold">
                    {active.title || "PDF Showcase"}
                  </Text>
                  <Text fontSize="12px" color="rgba(255,255,255,.72)">
                    Open the PDF to inspect the full design export.
                  </Text>
                  <Button
                    as={Link}
                    href={active.url}
                    isExternal
                    variant="facebook"
                    leftIcon={<ExternalLink size={14} />}
                    _hover={{ textDecoration: "none" }}
                  >
                    Open PDF
                  </Button>
                </Flex>
              ) : active?.url ? (
                <Image
                  src={active.url}
                  alt={active.alt || normalized.title}
                  w="100%"
                  h={{ base: "280px", md: "520px" }}
                  objectFit="contain"
                />
              ) : (
                <Flex h="320px" align="center" justify="center" color="white">
                  <Text fontSize="13px">No showcase media available.</Text>
                </Flex>
              )}

              {gallery.length > 1 && (
                <HStack
                  position="absolute"
                  bottom={3}
                  left="50%"
                  transform="translateX(-50%)"
                  spacing={2}
                >
                  <Button
                    size="sm"
                    h="28px"
                    minW="30px"
                    variant="facebookGray"
                    onClick={() => go(-1)}
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <Text
                    bg="rgba(0,0,0,.72)"
                    color="white"
                    border="1px solid rgba(255,255,255,.38)"
                    px={2}
                    h="28px"
                    display="flex"
                    alignItems="center"
                    fontSize="11px"
                    fontWeight="bold"
                  >
                    {activeIndex + 1} / {gallery.length}
                  </Text>
                  <Button
                    size="sm"
                    h="28px"
                    minW="30px"
                    variant="facebookGray"
                    onClick={() => go(1)}
                    aria-label="Next media"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </HStack>
              )}
            </Box>

            <VStack align="stretch" spacing={0} bg={colors.panelBg}>
              <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                <Text fontSize="13px" lineHeight="1.5" color={colors.text}>
                  {normalized.description}
                </Text>
              </Box>

              {normalized.highlights?.length > 0 && (
                <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                  <Text fontSize="11px" fontWeight="bold" mb={2} color={colors.muted}>
                    HIGHLIGHTS
                  </Text>
                  <VStack align="stretch" spacing={1}>
                    {normalized.highlights.map((highlight) => (
                      <HStack key={highlight} spacing={2} align="start">
                        <Box mt="6px" w="5px" h="5px" bg={colors.link} flexShrink={0} />
                        <Text fontSize="12px" color={colors.text}>
                          {highlight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              <Box p={3} borderBottom="1px solid" borderColor={colors.border}>
                <Text fontSize="11px" fontWeight="bold" mb={2} color={colors.muted}>
                  STACK
                </Text>
                <HStack spacing={1} flexWrap="wrap">
                  {normalized.tags.map((tag) => (
                    <RetroBadge key={tag}>{tag}</RetroBadge>
                  ))}
                </HStack>
              </Box>

              <Box
                p={3}
                borderBottom="1px solid"
                borderColor={colors.border}
                maxH="160px"
                overflowX="auto"
                sx={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "thin",
                }}
              >
                <HStack spacing={2} align="stretch">
                  {gallery.map((item, index) => (
                    <Box
                      key={item.id}
                      onClick={() => setActiveIndex(index)}
                      minW="76px"
                      h="58px"
                      border="1px solid"
                      borderColor={index === activeIndex ? colors.link : colors.borderSoft}
                      bg={colors.panelAlt}
                      cursor="pointer"
                      scrollSnapAlign="start"
                      display="grid"
                      placeItems="center"
                      overflow="hidden"
                    >
                      {item.type === "image" && item.url ? (
                        <Image src={item.url} alt={item.alt} w="100%" h="100%" objectFit="cover" />
                      ) : item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} w="100%" h="100%" objectFit="cover" />
                      ) : (
                        <FileText size={20} color={colors.link} />
                      )}
                    </Box>
                  ))}
                </HStack>
              </Box>

              <Box p={3}>
                <HStack spacing={2} flexWrap="wrap">
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
                      variant="facebook"
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
