import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Maximize2, X } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { LAGOON, LagoonSection, DoodleStar, DoodleTape } from "../public/studio";

const Gallery = () => {
  const { portfolioData } = usePortfolio();
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const achievements = useMemo(
    () =>
      (portfolioData.achievements || [])
        .filter((i) => i.image)
        .map((i) => ({
          title: i.title,
          caption: i.issuer,
          date: i.date,
          image: i.image,
          description: i.description || "",
          type: "Certificate",
        }))
        .reverse(),
    [portfolioData.achievements]
  );

  const activities = useMemo(
    () =>
      (portfolioData.activities || [])
        .filter((i) => i.image)
        .map((i) => ({
          title: i.title,
          caption: i.role || i.period,
          date: i.period,
          image: i.image,
          description: i.description || "",
          type: "Activity",
        }))
        .reverse(),
    [portfolioData.activities]
  );

  const openItem = (item) => {
    setSelected(item);
    setIsOpen(true);
  };

  const closeItem = () => setIsOpen(false);

  if (achievements.length === 0 && activities.length === 0) return null;

  return (
    <LagoonSection
      id="gallery"
      eyebrow="06 / gallery"
      title="Gallery"
      description="Certificates, activities, and snapshots from along the way."
    >
      <Box>
        {achievements.length > 0 && (
          <Box mb={{ base: 12, md: 16 }}>
            <GroupHeader count={achievements.length}>Achievements</GroupHeader>

            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              }}
              gap={{ base: 5, md: 6 }}
              alignItems="stretch"
            >
              {achievements.map((item, i) => (
                <DiplomaCard
                  key={`ach-${i}`}
                  item={item}
                  index={i}
                  onOpen={() => openItem(item)}
                />
              ))}
            </Grid>
          </Box>
        )}

        {activities.length > 0 && (
          <Box>
            <GroupHeader count={activities.length}>Activities</GroupHeader>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              }}
              gap={{ base: 5, md: 6 }}
              alignItems="stretch"
            >
              {activities.map((item, i) => (
                <ActivityCard
                  key={`act-${i}`}
                  item={item}
                  index={i}
                  onOpen={() => openItem(item)}
                />
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isOpen} onClose={closeItem} size="5xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(8,47,46,0.72)" />
        <ModalContent
          position="relative"
          bg="#FFFFFF"
          borderRadius="10px"
          border="2px solid"
          borderColor={LAGOON.ink}
          boxShadow="10px 10px 0 rgba(0,0,0,0.35)"
          mx={4}
          overflow="visible"
        >
          <ModalBody p={{ base: 3, md: 4 }} position="relative">
            {selected && (
              <Box>
                {/* corner tapes + round ink close, like the rest of the room */}
                <DoodleTape
                  w={66}
                  h={18}
                  color="rgba(255,200,87,0.85)"
                  rotation={-6}
                  top="-13px"
                  left="26px"
                  zIndex={2}
                />
                <DoodleTape
                  w={66}
                  h={18}
                  color="rgba(14,140,134,0.55)"
                  rotation={6}
                  top="-13px"
                  right="26px"
                  zIndex={2}
                />
                <IconButton
                  icon={<X size={15} />}
                  aria-label="Close"
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
                  onClick={closeItem}
                  _hover={{ bg: LAGOON.coralDeep }}
                  zIndex={2}
                />

                <Flex justify="space-between" align="flex-start" gap={3} mb={3} pr={{ base: "46px", md: "52px" }}>
                  <Text
                    fontFamily="heading"
                    fontSize={{ base: "17px", md: "19px" }}
                    fontWeight="800"
                    letterSpacing="-.02em"
                    color={LAGOON.heading}
                    noOfLines={2}
                  >
                    {selected.title}
                  </Text>
                  {selected.type && (
                    <Text
                      className="public-mono"
                      fontSize="10px"
                      fontWeight="600"
                      color={LAGOON.muted}
                      letterSpacing=".14em"
                      textTransform="uppercase"
                      flexShrink={0}
                      mt="5px"
                    >
                      {selected.type}
                    </Text>
                  )}
                </Flex>

                <Box
                  border="1.5px solid"
                  borderColor={LAGOON.ink}
                  borderRadius="10px"
                  overflow="hidden"
                  bg={LAGOON.surfaceTint}
                >
                  <img
                    src={selected.image}
                    alt={selected.title}
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: "56vh",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Box px={{ base: 2, md: 3 }} pt={4} pb={2}>
                  <Flex align="center" justify="space-between" gap={3} flexWrap="wrap">
                    {selected.caption ? (
                      <Text
                        className="public-hand"
                        fontSize="21px"
                        fontWeight="600"
                        color={LAGOON.primaryDark}
                        lineHeight="1.2"
                        transform="rotate(-0.6deg)"
                        noOfLines={2}
                      >
                        {selected.caption}
                      </Text>
                    ) : (
                      <span />
                    )}
                    {selected.date && (
                      <Text className="public-mono" fontSize="11px" color={LAGOON.muted}>
                        {selected.date}
                      </Text>
                    )}
                  </Flex>
                  {selected.description && (
                    <Text
                      fontSize="14.5px"
                      lineHeight="1.7"
                      color={LAGOON.text}
                      mt={2}
                      whiteSpace="pre-line"
                    >
                      {selected.description}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </LagoonSection>
  );
};

const GroupHeader = ({ children, count }) => (
  <Flex align="center" gap={3} mb={6} data-reveal>
    <DoodleStar size={22} transform="rotate(-12deg)" />
    <Text
      fontFamily="heading"
      fontSize={{ base: "22px", md: "26px" }}
      fontWeight="700"
      letterSpacing="-.02em"
      color={LAGOON.heading}
      flexShrink={0}
    >
      {children}
    </Text>
    <Box flex="1" h="2px" mt="10px" style={{ borderTop: "2px dashed #CFE8E4" }} />
    <Text
      className="public-mono"
      fontSize="13px"
      color={LAGOON.muted}
      flexShrink={0}
    >
      ({String(count).padStart(2, "0")})
    </Text>
  </Flex>
);

const Rosette = () => (
  <Box
    aria-hidden="true"
    position="absolute"
    top="-18px"
    right="16px"
    w="52px"
    h="64px"
    pointerEvents="none"
    zIndex={2}
  >
    <svg width="52" height="64" viewBox="0 0 52 64" fill="none" style={{ display: "block" }}>
      <rect x="11" y="32" width="9" height="21" rx="2" fill="#FF6B4A" stroke="#0B2F2F" strokeWidth="1.7" transform="rotate(9 15.5 42.5)" />
      <rect x="32" y="32" width="9" height="21" rx="2" fill="#FFC857" stroke="#0B2F2F" strokeWidth="1.7" transform="rotate(-9 36.5 42.5)" />
      <circle cx="26" cy="20" r="16" fill="#FFC857" stroke="#0B2F2F" strokeWidth="2.2" />
      <circle cx="26" cy="20" r="9.5" fill="#FFFFFF" stroke="#0B2F2F" strokeWidth="1.7" />
      <path d="M21.8 20.2l3 3.2 5.4-6.4" fill="none" stroke="#0B2F2F" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Box>
);

// Framed certificate: double border, dashed inner frame,
// rosette ribbon, handwritten signing line at the bottom.
const DiplomaCard = ({ item, index, onOpen }) => (
  <Box
    as="button"
    type="button"
    role="group"
    onClick={onOpen}
    display="flex"
    flexDirection="column"
    width="100%"
    textAlign="left"
    position="relative"
    bg="#FFFFFF"
    border="2px solid"
    borderColor={LAGOON.ink}
    borderRadius="10px"
    p={{ base: 5, md: 6 }}
    cursor="pointer"
    transition="box-shadow .16s ease, transform .16s ease"
    _hover={{
      transform: "translate(-2px, -2px)",
      boxShadow: "5px 5px 0 #0B2F2F",
    }}
  >
    <Rosette />
    <Box
      aria-hidden="true"
      position="absolute"
      top="10px"
      left="10px"
      right="10px"
      bottom="10px"
      border="1.5px dashed rgba(11,47,47,0.45)"
      borderRadius="5px"
      pointerEvents="none"
    />
    <Box position="relative" px={{ base: 2, md: 3 }} pt={2} pb={1} display="flex" flexDirection="column" flex="1" minW={0}>
      <Text
        className="public-mono"
        fontSize="10px"
        fontWeight="600"
        color={LAGOON.muted}
        letterSpacing=".14em"
        textTransform="uppercase"
      >
        certificate — no. {String(index + 1).padStart(2, "0")}
      </Text>
      <Text
        fontFamily="heading"
        fontSize="18px"
        fontWeight="800"
        lineHeight="1.3"
        letterSpacing="-.01em"
        color={LAGOON.heading}
        mt={2}
        noOfLines={2}
      >
        {item.title}
      </Text>
      {item.image && (
        <Box
          mt={3}
          border="1.5px solid"
          borderColor={LAGOON.ink}
          borderRadius="4px"
          overflow="hidden"
          aspectRatio="16 / 10"
          bg={LAGOON.surfaceTint}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      )}
      {item.description && (
        <Text fontSize="14px" lineHeight="1.65" color={LAGOON.text} mt={3} noOfLines={2}>
          {item.description}
        </Text>
      )}
      <Flex mt="auto" pt={4} align="flex-end" gap={3}>
        <Box flex="1" mb="8px" borderBottom="1.5px dashed rgba(11,47,47,0.55)" />
        <Text
          className="public-hand"
          fontSize="19px"
          fontWeight="600"
          color={LAGOON.primaryDark}
          lineHeight="1"
          transform="rotate(-2deg)"
          noOfLines={1}
        >
          {item.caption || "certified"}
        </Text>
      </Flex>
    </Box>
  </Box>
);

// Polaroid print: thick white mat, handwritten caption,
// hung slightly crooked with tape-worthy vibes.
const ActivityCard = ({ item, index, onOpen }) => (
  <Box
    as="button"
    type="button"
    role="group"
    onClick={onOpen}
    display="flex"
    flexDirection="column"
    width="100%"
    textAlign="center"
    bg="#FFFFFF"
    border="1.5px solid"
    borderColor={LAGOON.ink}
    borderRadius="14px"
    p={{ base: 5, md: 6 }}
    overflow="hidden"
    cursor="pointer"
    transition="box-shadow .16s ease, transform .16s ease"
    _hover={{
      transform: "translate(-2px, -2px)",
      boxShadow: "6px 6px 0 #0B2F2F",
    }}
  >
    {/* arched portrait window */}
    <Box
      position="relative"
      aspectRatio="4 / 3.4"
      w="86%"
      mx="auto"
      mb={5}
      overflow="hidden"
      border="1.5px solid"
      borderColor={LAGOON.ink}
      borderRadius="999px 999px 10px 10px"
      _groupHover={{ "& img": { transform: "scale(1.05)" } }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform .3s ease",
        }}
      />
      <Flex
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        bg="rgba(8,47,46,0.4)"
        opacity={0}
        transition="opacity .2s ease"
        _groupHover={{ opacity: 1 }}
      >
        <Flex
          align="center"
          gap="6px"
          bg="#FFFFFF"
          color={LAGOON.heading}
          fontSize="12.5px"
          fontWeight="700"
          px="14px"
          py="8px"
          borderRadius="999px"
          border="1.5px solid #0B2F2F"
        >
          <Maximize2 size={12} />
          View
        </Flex>
      </Flex>
      <Box
        position="absolute"
        top="9px"
        left="9px"
        px="8px"
        py="2px"
        bg="#FFFFFF"
        border="1.5px solid"
        borderColor={LAGOON.ink}
        borderRadius="999px"
        fontSize="11px"
        fontWeight="700"
        className="public-mono"
        color={LAGOON.heading}
      >
        {String(index + 1).padStart(2, "0")}
      </Box>
    </Box>

    <Text
      className="public-mono"
      fontSize="10px"
      fontWeight="600"
      color={LAGOON.muted}
      letterSpacing=".14em"
      textTransform="uppercase"
    >
      {item.date || "memories"}
    </Text>
    <Text
      fontFamily="heading"
      fontSize="18px"
      fontWeight="800"
      lineHeight="1.3"
      letterSpacing="-.01em"
      color={LAGOON.heading}
      mt={2}
      noOfLines={2}
    >
      {item.title}
    </Text>
    {(item.caption || item.description) && (
      <Text fontSize="13.5px" lineHeight="1.65" color={LAGOON.text} mt={2} noOfLines={2}>
        {item.caption || item.description}
      </Text>
    )}
    <Flex mt="auto" pt={4} justify="center">
      <Text
        display="inline-flex"
        alignItems="center"
        fontSize="13.5px"
        fontWeight="700"
        color={LAGOON.primaryDark}
        _groupHover={{ color: LAGOON.coralDeep }}
        transition="color .15s ease"
      >
        View →
      </Text>
    </Flex>

    {/* film sprockets */}
    <Flex justify="center" gap="7px" mt={3}>
      {[0, 1, 2].map((dot) => (
        <Box key={dot} w="8px" h="8px" borderRadius="2px" border="1.5px solid rgba(11,47,47,0.55)" />
      ))}
    </Flex>
  </Box>
);

export default Gallery;
