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
import {
  BRUT,
  BrutSection,
  BrutTag,
  StickerTape,
} from "../public/brutal";

const Gallery = () => {
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { portfolioData } = usePortfolio();

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
    <BrutSection
      id="gallery"
      number="05"
      kicker="the photo wall"
      title="Gallery"
      description="Certificates, activities, and snapshots from along the way."
      tone="white"
    >
      <Box>
        {achievements.length > 0 && (
          <Box mb={{ base: 14, md: 16 }}>
            <GroupHeader count={achievements.length}>Award wall</GroupHeader>

            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              }}
              gap={{ base: 7, md: 8 }}
              alignItems="stretch"
            >
              {achievements.map((item, i) => (
                <MedalCard
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
              gap={{ base: 7, md: 8 }}
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

      {/* Lightbox: the print pinned back down on a bigger board */}
      <Modal isOpen={isOpen} onClose={closeItem} size="5xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(23,24,28,0.78)" />
        <ModalContent
          position="relative"
          bg="#FFFFFF"
          borderRadius="10px"
          border="3px solid"
          borderColor={BRUT.ink}
          boxShadow="12px 12px 0 rgba(23,24,28,0.45)"
          mx={{ base: 4, md: 6 }}
          overflow="visible"
        >
          <ModalBody p={{ base: 4, md: 5 }} position="relative">
            {selected && (
              <Box>
                <StickerTape
                  w={68}
                  h={18}
                  color="rgba(255,210,63,0.8)"
                  top="-12px"
                  left="26px"
                  zIndex={2}
                />
                <StickerTape
                  w={68}
                  h={18}
                  color="rgba(56,182,255,0.7)"
                  top="-12px"
                  right="26px"
                  zIndex={2}
                />
                <IconButton
                  icon={<X size={15} />}
                  aria-label="Close"
                  position="absolute"
                  top={{ base: "10px", md: "12px" }}
                  right={{ base: "10px", md: "12px" }}
                  w="38px"
                  h="38px"
                  minW="38px"
                  borderRadius="8px"
                  border="2.5px solid"
                  borderColor={BRUT.ink}
                  bg={BRUT.coral}
                  color="#FFFFFF"
                  boxShadow={BRUT.shadowXs}
                  onClick={closeItem}
                  _hover={{ bg: BRUT.coralDeep }}
                  zIndex={2}
                />

                <Flex justify="space-between" align="flex-start" gap={3} mb={4} pr={{ base: "48px", md: "56px" }}>
                  <Text
                    fontFamily="bungee"
                    fontSize={{ base: "13px", md: "16px" }}
                    color={BRUT.ink}
                    noOfLines={2}
                  >
                    {selected.title}
                  </Text>
                  <BrutTag tone="blue" flexShrink={0} mt="4px">
                    {selected.type}
                  </BrutTag>
                </Flex>

                <Box
                  border="2.5px solid"
                  borderColor={BRUT.ink}
                  borderRadius="8px"
                  overflow="hidden"
                  bg={BRUT.bgWash}
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
                        fontFamily="heading"
                        fontSize="17px"
                        fontWeight="700"
                        color={BRUT.ink}
                        noOfLines={2}
                      >
                        {selected.caption}
                      </Text>
                    ) : (
                      <span />
                    )}
                    {selected.date && (
                      <Text fontFamily="spaceMono" fontSize="12.5px" fontWeight="700" color={BRUT.ink}>
                        {selected.date}
                      </Text>
                    )}
                  </Flex>
                  {selected.description && (
                    <Text
                      fontSize="16px"
                      lineHeight="1.75"
                      color={BRUT.text}
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
    </BrutSection>
  );
};

const GroupHeader = ({ children, count }) => (
  <Flex align="center" gap={3} mb={8} data-reveal>
    <Text
      fontFamily="bungee"
      fontSize={{ base: "18px", md: "21px" }}
      color={BRUT.ink}
      flexShrink={0}
    >
      {children}
    </Text>
    <Box
      flex="1"
      mt="6px"
      borderTop="2px dashed rgba(23,24,28,0.3)"
    />
    <BrutTag tone="mint" flexShrink={0}>
      {String(count).padStart(2, "0")} PCS
    </BrutTag>
  </Flex>
);

// Medal badge icon: circle medal + twin ribbons, thick ink outline.
const MedalIcon = ({ ring, ribbon }) => (
  <svg width="100%" height="100%" viewBox="0 0 44 44" fill="none" style={{ display: "block" }}>
    <rect x="12" y="23" width="7.5" height="16" rx="2" fill={ribbon} stroke="#17181C" strokeWidth="2.2" />
    <rect x="24.5" y="23" width="7.5" height="16" rx="2" fill={ring} stroke="#17181C" strokeWidth="2.2" />
    <circle cx="22" cy="15" r="11" fill={ring} stroke="#17181C" strokeWidth="2.6" />
    <circle cx="22" cy="15" r="6.4" fill="#FFFFFF" stroke="#17181C" strokeWidth="2.2" />
    <path d="M19.4 15.2l2 2.2 3.6-4.2" fill="none" stroke="#17181C" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MEDAL_TONES = [
  { ring: BRUT.yellow, ribbon: BRUT.coral },
  { ring: BRUT.blue, ribbon: BRUT.yellow },
  { ring: BRUT.primary, ribbon: BRUT.coral },
];

const BAND_TONES = [BRUT.yellowSoft, BRUT.blueSoft, BRUT.limeSoft];

// Award card: clean, light, high-contrast container with a badge-style
// medal icon framed in its own bordered square — no dark surfaces.
const MedalCard = ({ item, index, onOpen }) => {
  const tones = MEDAL_TONES[index % MEDAL_TONES.length];
  const band = BAND_TONES[index % BAND_TONES.length];

  return (
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
      border="2.5px solid"
      borderColor={BRUT.ink}
      borderRadius="10px"
      overflow="hidden"
      cursor="pointer"
      transition="box-shadow .16s ease, transform .16s ease"
      boxShadow={BRUT.shadow}
      _hover={{
        transform: "translate(-3px, -3px)",
        boxShadow: "7px 7px 0 #17181C",
      }}
    >
      {/* Head band: serial + medal badge */}
      <Flex
        align="center"
        gap={3.5}
        bg={band}
        px={{ base: 4, md: 5 }}
        py={{ base: 3.5, md: 4 }}
        borderBottom="2.5px solid"
        borderColor={BRUT.ink}
      >
        <Flex
          w={{ base: "46px", md: "50px" }}
          h={{ base: "46px", md: "50px" }}
          flexShrink={0}
          bg="#FFFFFF"
          border="2px solid"
          borderColor={BRUT.ink}
          borderRadius="8px"
          boxShadow={BRUT.shadowXs}
          overflow="hidden"
          align="center"
          justify="center"
        >
          <MedalIcon ring={tones.ring} ribbon={tones.ribbon} />
        </Flex>
        <Box minW={0}>
          <Text
            fontFamily="spaceMono"
            fontSize="11.5px"
            fontWeight="700"
            color={BRUT.ink}
            letterSpacing=".14em"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            certificate — no. {String(index + 1).padStart(2, "0")}
          </Text>
          <Text
            fontFamily="bungee"
            fontSize={{ base: "14px", md: "16px" }}
            lineHeight="1.25"
            color={BRUT.ink}
            mt="3px"
            noOfLines={2}
          >
            {item.title}
          </Text>
        </Box>
      </Flex>

      {/* Print window */}
      <Box
        position="relative"
        aspectRatio="16 / 10"
        bg={BRUT.bgWash}
        borderBottom="2px dashed rgba(23,24,28,0.35)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        overflow="hidden"
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
            objectFit: "contain",
            transition: "transform .3s ease",
          }}
        />
        <Flex
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          bg="rgba(23,24,28,0.4)"
          opacity={0}
          transition="opacity .2s ease"
          _groupHover={{ opacity: 1 }}
        >
          <Flex
            align="center"
            gap="7px"
            bg={BRUT.yellow}
            color={BRUT.ink}
            fontFamily="spaceMono"
            fontSize="12px"
            fontWeight="700"
            letterSpacing=".08em"
            textTransform="uppercase"
            px="14px"
            py="8px"
            borderRadius="6px"
            border="2.5px solid"
            borderColor={BRUT.ink}
            boxShadow={BRUT.shadowXs}
          >
            <Maximize2 size={13} />
            View
          </Flex>
        </Flex>
      </Box>

      {/* Foot: signing line */}
      <Flex align="flex-end" gap={3} px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }}>
        <Box minW={0}>
          <Text
            fontFamily="heading"
            fontSize="15px"
            fontWeight="700"
            color={BRUT.ink}
            noOfLines={2}
          >
            {item.caption || "certified"}
          </Text>
          {item.date && (
            <Text
              fontFamily="spaceMono"
              fontSize="12px"
              fontWeight="700"
              color={BRUT.ink}
              mt="3px"
              noOfLines={1}
            >
              {item.date}
            </Text>
          )}
        </Box>
        <Box flex="1" mb="6px" borderBottom="2px dashed rgba(23,24,28,0.45)" />
        <Text
          fontFamily="bungee"
          fontSize="13px"
          color={tones.ring === BRUT.blue ? BRUT.blueDeep : BRUT.ink}
          whiteSpace="nowrap"
          flexShrink={0}
        >
          ✓
        </Text>
      </Flex>
    </Box>
  );
};

const TAPE_TONES = [
  "rgba(255,210,63,1)",
  "rgba(56,182,255,0.9)",
  "rgba(255,107,107,0.9)",
];

// Photo print: white mat, ink frame, straight tape on top.
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
    border="2.5px solid"
    borderColor={BRUT.ink}
    borderRadius="10px"
    px={{ base: 4, md: 5 }}
    pb={{ base: 4, md: 5 }}
    pt="24px"
    overflow="visible"
    cursor="pointer"
    transition="box-shadow .16s ease, transform .16s ease"
    boxShadow={BRUT.shadow}
    _hover={{
      transform: "translate(-2px, -2px)",
      boxShadow: "6px 6px 0 #17181C",
    }}
  >
    {/* tape */}
    <StickerTape
      w={74}
      h={20}
      color={TAPE_TONES[index % TAPE_TONES.length]}
      top="-13px"
      left="50%"
      ml={-37}
      zIndex={2}
    />

    {/* Photo window */}
    <Box
      position="relative"
      aspectRatio="4 / 3.4"
      w="100%"
      overflow="hidden"
      border="2px solid"
      borderColor={BRUT.ink}
      borderRadius="6px"
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
        bg="rgba(23,24,28,0.45)"
        opacity={0}
        transition="opacity .2s ease"
        _groupHover={{ opacity: 1 }}
      >
        <Flex
          align="center"
          gap="6px"
          bg={BRUT.yellow}
          color={BRUT.ink}
          fontFamily="spaceMono"
          fontSize="12px"
          fontWeight="700"
          letterSpacing=".08em"
          textTransform="uppercase"
          px="12px"
          py="7px"
          borderRadius="6px"
          border="2.5px solid"
          borderColor={BRUT.ink}
          boxShadow={BRUT.shadowXs}
        >
          <Maximize2 size={12} />
          VIEW
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
        borderColor={BRUT.ink}
        borderRadius="4px"
        fontFamily="spaceMono"
        fontSize="11px"
        fontWeight="700"
        color={BRUT.ink}
      >
        {String(index + 1).padStart(2, "0")}
      </Box>

      {/* scrim so overlay text never bleeds into light photos */}
      <Box
        aria-hidden="true"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        h="58%"
        pointerEvents="none"
        sx={{
          background:
            "linear-gradient(180deg, rgba(23,24,28,0) 0%, rgba(23,24,28,0.82) 100%)",
        }}
      />
      <Box
        position="absolute"
        bottom="10px"
        left="10px"
        right="10px"
        px="10px"
        py="5px"
        bg="rgba(23,24,28,0.94)"
        border="1.5px solid rgba(255,255,255,0.55)"
        borderRadius="6px"
        fontFamily="spaceMono"
        fontSize="12px"
        fontWeight="700"
        letterSpacing=".08em"
        textTransform="uppercase"
        color="#FFFFFF"
        noOfLines={1}
      >
        {item.date || "MEMORIES"}
      </Box>
    </Box>

    <Box mt={4} />
    <Text
      fontFamily="heading"
      fontSize="17px"
      fontWeight="600"
      lineHeight="1.3"
      color={BRUT.ink}
      mt={2}
      noOfLines={2}
    >
      {item.title}
    </Text>
    {(item.caption || item.description) && (
      <Text
        fontSize="14.5px"
        fontWeight="600"
        lineHeight="1.65"
        color={BRUT.ink}
        mt={2}
        noOfLines={2}
      >
        {item.caption || item.description}
      </Text>
    )}
    <Flex mt="auto" pt={4} justify="center">
      <Flex
        align="center"
        gap="6px"
        bg={BRUT.primary}
        border="2px solid"
        borderColor={BRUT.ink}
        borderRadius="6px"
        px="14px"
        py="7px"
        boxShadow={BRUT.shadowXs}
        transition="background .15s ease, transform .15s ease"
        _groupHover={{ bg: BRUT.primaryDeep, transform: "translate(-1px, -1px)" }}
      >
        <Text
          fontFamily="spaceMono"
          fontSize="12.5px"
          fontWeight="700"
          letterSpacing=".06em"
          textTransform="uppercase"
          color="#FFFFFF"
        >
          View
        </Text>
        <Text as="span" color="#FFFFFF" fontWeight="700" fontSize="13px" lineHeight="1">
          →
        </Text>
      </Flex>
    </Flex>
  </Box>
);

export default Gallery;
