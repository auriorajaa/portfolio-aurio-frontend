import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Calendar, X } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Gallery = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const lightboxRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const achievements = useMemo(
    () =>
      (portfolioData.achievements || [])
        .filter((i) => i.image)
        .map((i) => ({ title: i.title, caption: i.issuer, date: i.date, image: i.image, type: "Certificate" }))
        .reverse(),
    [portfolioData.achievements]
  );

  const activities = useMemo(
    () =>
      (portfolioData.activities || [])
        .filter((i) => i.image)
        .map((i) => ({ title: i.title, caption: i.role || i.period, image: i.image, type: "Activity" }))
        .reverse(),
    [portfolioData.activities]
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-gallery-item]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.56,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!isOpen || !lightboxRef.current || prefersReducedMotion()) return;
      gsap.from(lightboxRef.current, { scale: 0.97, autoAlpha: 0, duration: 0.22, ease: "power2.out" });
    },
    { dependencies: [isOpen, selected?.image] }
  );

  const openItem = (item) => { setSelected(item); setIsOpen(true); };
  const closeItem = () => setIsOpen(false);

  if (achievements.length === 0 && activities.length === 0) return null;

  return (
    <StudioSection id="gallery" eyebrow="Archive" title="Activities and others.">
      <VStack ref={rootRef} align="stretch" spacing={{ base: 12, md: 16 }}>

        {/* ── Achievements / Certificates ─────────────────────── */}
        {achievements.length > 0 && (
          <Box>
            {/* Sub-header */}
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              mb={6}
              pb={4}
              borderBottom="1px solid"
              borderColor={colors.borderSoft}
            >
              {/* <Award size={15} color={colors.accent} /> */}
              <Text
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={colors.muted}
              >
                Achievements & Certificates
              </Text>
              <Box
                ml="auto"
                fontSize="11px"
                fontWeight="600"
                color={colors.muted}
                px={2}
                py="2px"
                border="1px solid"
                borderColor={colors.borderSoft}
              >
                {achievements.length}
              </Box>
            </Box>

            {/* Certificate list — horizontal scroll on mobile */}
            <Box
              display="grid"
              gridTemplateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={{ base: 3, md: 4 }}
            >
              {achievements.map((item, i) => (
                <Box
                  data-gallery-item
                  as="button"
                  key={`ach-${i}`}
                  onClick={() => openItem(item)}
                  textAlign="left"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  display="flex"
                  flexDirection="column"
                  gap={0}
                  _hover={{ "& .gallery-img": { transform: "scale(1.04)" }, "& .gallery-title": { color: colors.accent } }}
                >
                  {/* Image */}
                  <Box
                    overflow="hidden"
                    bg={colors.surfaceAlt}
                    border="1px solid"
                    borderColor={colors.borderSoft}
                    mb={3}
                    aspectRatio="4/3"
                  >
                    <LazyLoadImage
                      src={item.image}
                      alt={item.title}
                      effect="opacity"
                      width="100%"
                      height="100%"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform .6s cubic-bezier(.2,.8,.2,1)",
                      }}
                      className="gallery-img"
                    />
                  </Box>

                  {/* Meta */}
                  <Text
                    className="gallery-title"
                    fontSize={{ base: "13px", md: "14px" }}
                    fontWeight="700"
                    lineHeight="1.3"
                    letterSpacing="-0.01em"
                    color={colors.text}
                    transition="color .15s ease"
                    noOfLines={2}
                    mb={1}
                  >
                    {item.title}
                  </Text>
                  <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    {item.caption && (
                      <Text fontSize="12px" color={colors.accent} fontWeight="600">
                        {item.caption}
                      </Text>
                    )}
                    {item.date && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Calendar size={10} color={colors.muted} />
                        <Text fontSize="11px" color={colors.muted}>{item.date}</Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Activities ───────────────────────────────────────── */}
        {activities.length > 0 && (
          <Box>
            {/* Sub-header */}
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              mb={6}
              pb={4}
              borderBottom="1px solid"
              borderColor={colors.borderSoft}
            >
              {/* <Box
                w="15px" h="15px" borderRadius="full"
                border="2px solid"
                borderColor={colors.accent}
                flexShrink={0}
              /> */}
              <Text
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.1em"
                textTransform="uppercase"
                color={colors.muted}
              >
                Activities & Involvement
              </Text>
              <Box
                ml="auto"
                fontSize="11px"
                fontWeight="600"
                color={colors.muted}
                px={2}
                py="2px"
                border="1px solid"
                borderColor={colors.borderSoft}
              >
                {activities.length}
              </Box>
            </Box>

            {/* Activity grid — larger, editorial */}
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={{ base: 4, md: 5 }}
            >
              {activities.map((item, i) => (
                <Box
                  data-gallery-item
                  as="button"
                  key={`act-${i}`}
                  onClick={() => openItem(item)}
                  textAlign="left"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  minH={{ base: "220px", md: "280px" }}
                  _hover={{ "& img": { transform: "scale(1.07)" }, "& .act-overlay": { opacity: 1 } }}
                >
                  <LazyLoadImage
                    src={item.image}
                    alt={item.title}
                    effect="opacity"
                    width="100%"
                    height="100%"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      position: "absolute",
                      inset: 0,
                      transition: "transform .7s cubic-bezier(.2,.8,.2,1)",
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    className="act-overlay"
                    position="absolute"
                    inset={0}
                    bg="linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 55%, transparent 100%)"
                    opacity={0.88}
                    transition="opacity .3s ease"
                  />
                  {/* Caption */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={{ base: 4, md: 5 }}
                    color="#fafaf8"
                  >
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      opacity={0.7}
                      mb={1}
                    >
                      {item.type}
                    </Text>
                    <Text
                      fontSize={{ base: "15px", md: "17px" }}
                      fontWeight="700"
                      lineHeight="1.25"
                      letterSpacing="-0.01em"
                      noOfLines={2}
                    >
                      {item.title}
                    </Text>
                    {item.caption && (
                      <Text fontSize="12px" opacity={0.65} mt={1}>
                        {item.caption}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        )}
      </VStack>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <Modal isOpen={isOpen} onClose={closeItem} size="4xl" isCentered>
        <ModalOverlay bg="rgba(0,0,0,.88)" backdropFilter="blur(12px)" />
        <ModalContent bg="transparent" boxShadow="none" mx={4}>
          <ModalBody p={0}>
            {selected && (
              <Box ref={lightboxRef} bg={colors.surfaceSolid} position="relative">
                {/* Close */}
                <IconButton
                  icon={<X size={16} />}
                  aria-label="Close"
                  position="absolute"
                  top={3}
                  right={3}
                  zIndex={2}
                  size="sm"
                  variant="studioGhost"
                  onClick={closeItem}
                />

                {/* Image */}
                <Box bg={colors.surfaceAlt} maxH="70vh" overflow="hidden">
                  <LazyLoadImage
                    src={selected.image}
                    alt={selected.title}
                    effect="opacity"
                    width="100%"
                    style={{
                      width: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>

                {/* Caption */}
                <Box
                  p={{ base: 4, md: 6 }}
                  borderTop="1px solid"
                  borderColor={colors.borderSoft}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box>
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={colors.accent}
                      mb={1}
                    >
                      {selected.type}
                    </Text>
                    <Text
                      fontSize={{ base: "17px", md: "20px" }}
                      fontWeight="800"
                      lineHeight="1.2"
                      letterSpacing="-0.02em"
                      color={colors.text}
                    >
                      {selected.title}
                    </Text>
                  </Box>
                  <Box textAlign={{ base: "left", md: "right" }}>
                    {selected.caption && (
                      <Text fontSize="14px" fontWeight="600" color={colors.text}>
                        {selected.caption}
                      </Text>
                    )}
                    {selected.date && (
                      <Box display="flex" alignItems="center" gap={1} justifyContent={{ md: "flex-end" }} mt={1}>
                        <Calendar size={11} color={colors.muted} />
                        <Text fontSize="12px" color={colors.muted}>{selected.date}</Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </StudioSection>
  );
};

export default Gallery;