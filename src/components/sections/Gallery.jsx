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
import { StudioSection, useStudioColors } from "../public/studio";

const Gallery = () => {
  const { portfolioData } = usePortfolio();
  const colors = useStudioColors();
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
    <StudioSection id="gallery" title="Gallery" band>
      <Box>
        {achievements.length > 0 && (
          <Box mb={{ base: 12, md: 16 }}>
            <GroupHeader colors={colors} count={achievements.length}>
              Achievements & Certificates
            </GroupHeader>

            {/* Ruled archive list */}
            <Box>
              {achievements.map((item, i) => (
                <CertificateRow
                  key={`ach-${i}`}
                  item={item}
                  index={i}
                  colors={colors}
                  onOpen={() => openItem(item)}
                />
              ))}
            </Box>
          </Box>
        )}

        {activities.length > 0 && (
          <Box>
            <GroupHeader colors={colors} count={activities.length}>
              Activities & Involvement
            </GroupHeader>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              }}
              gap={{ base: 6, md: 7 }}
              alignItems="stretch"
            >
              {activities.map((item, i) => (
                <ActivityCard
                  key={`act-${i}`}
                  item={item}
                  index={i}
                  colors={colors}
                  onOpen={() => openItem(item)}
                />
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isOpen} onClose={closeItem} size="5xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(9,24,42,0.8)" />
        <ModalContent
          bg="#ffffff"
          border="1px solid"
          borderColor={colors.border}
          mx={4}
          overflow="hidden"
        >
          <ModalBody p={0}>
            {selected && (
              <Box>
                <Flex
                  justify="space-between"
                  align="center"
                  px={5}
                  py={3}
                  bg={colors.navyGradient}
                  borderBottom="3px solid"
                  borderColor="#ffffff"
                >
                  <Text
                    fontSize="17px"
                    fontWeight="700"
                    color="#ffffff"
                    textShadow="0 1px 1px rgba(9,24,42,0.5)"
                    noOfLines={1}
                  >
                    {selected.title}
                  </Text>
                  <IconButton
                    icon={<X size={16} />}
                    aria-label="Close"
                    size="sm"
                    variant="classicWhite"
                    minW="30px"
                    h="30px"
                    onClick={closeItem}
                  />
                </Flex>

                <Box bg={colors.surface} p={{ base: 4, md: 6 }}>
                  <img
                    src={selected.image}
                    alt={selected.title}
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: "62vh",
                      objectFit: "contain",
                      margin: "0 auto",
                    }}
                  />
                </Box>

                <Box px={5} py={4}>
                  <Text fontSize="14px" color={colors.muted} mb={2}>
                    {[selected.type, selected.caption, selected.date].filter(Boolean).join(" · ")}
                  </Text>
                  {selected.description && (
                    <Text fontSize="16px" lineHeight="1.75" color={colors.text} whiteSpace="pre-line">
                      {selected.description}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </StudioSection>
  );
};

const GroupHeader = ({ children, count, colors }) => (
  <Flex align="center" gap={3} mb={6}>
    <Box w="34px" h="6px" bg={colors.accent} flexShrink={0} />
    <Text fontSize={{ base: "19px", md: "22px" }} fontWeight="700" color={colors.heading} flexShrink={0}>
      {children}
    </Text>
    <Box flex="1" h="1px" bg="#c6d7e8" />
    {typeof count === "number" && (
      <Box
        as="span"
        flexShrink={0}
        px="10px"
        py="3px"
        bg={colors.chipBlue}
        border="1px solid"
        borderColor={colors.chipBlueBorder}
        boxShadow="inset 0 1px 0 #ffffff"
        fontSize="12px"
        fontWeight="700"
        color={colors.chipBlueText}
      >
        {String(count).padStart(2, "0")} items
      </Box>
    )}
  </Flex>
);

const CertificateRow = ({ item, index, colors, onOpen }) => (
  <Box
    as="button"
    type="button"
    role="group"
    onClick={onOpen}
    display="grid"
    gridTemplateColumns={{
      base: "76px minmax(0, 1fr)",
      md: "52px 150px minmax(0, 1fr) 190px",
    }}
    gap={{ base: 4, md: 6 }}
    alignItems="center"
    w="100%"
    textAlign="left"
    px={{ base: 2, md: 4 }}
    py={{ base: 4, md: 5 }}
    borderTop={index === 0 ? "2px solid #c6d7e8" : "none"}
    borderBottom="1px solid #c6d7e8"
    bg="transparent"
    cursor="pointer"
    transition="background-color .16s ease, box-shadow .16s ease"
    _hover={{ bg: "#ffffff", boxShadow: `inset 4px 0 0 ${colors.accent}` }}
  >
    {/* Index */}
    <Text
      display={{ base: "none", md: "block" }}
      fontSize="13px"
      fontWeight="700"
      letterSpacing=".14em"
      color={colors.muted}
    >
      {String(index + 1).padStart(2, "0")}
    </Text>

    {/* Thumb */}
    <Box
      w={{ base: "76px", md: "150px" }}
      aspectRatio="4 / 3"
      bg="#ffffff"
      border="1px solid"
      borderColor="#b9c9da"
      boxShadow="0 2px 6px rgba(18,58,99,0.12)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      p={2}
      transition="box-shadow .16s ease"
      _groupHover={{ boxShadow: "0 7px 16px rgba(18,58,99,0.2)" }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </Box>

    {/* Title + issuer */}
    <Box minW={0}>
      <Text
        fontSize={{ base: "16px", md: "19px" }}
        fontWeight="700"
        color={colors.heading}
        lineHeight="1.4"
        noOfLines={2}
      >
        {item.title}
      </Text>
      {item.caption && (
        <Flex align="center" gap={2} mt="5px">
          <Text fontSize="14px" color={colors.muted} noOfLines={1}>
            {item.caption}
          </Text>
        </Flex>
      )}
    </Box>

    {/* Meta */}
    <Flex display={{ base: "none", md: "flex" }} direction="column" align="flex-end" gap={2}>
      <Text fontSize="15px" fontWeight="700" color={colors.accent} noOfLines={1}>
        {item.date}
      </Text>
      <Flex
        align="center"
        gap="5px"
        px="10px"
        py="4px"
        bg="linear-gradient(180deg, #ffffff 0%, #edf3fa 100%)"
        border="1px solid"
        borderColor={colors.border}
        boxShadow="inset 0 1px 0 #ffffff"
        fontSize="12px"
        fontWeight="700"
        color="#34506e"
        transition="background .15s ease, color .15s ease, border-color .15s ease"
        _groupHover={{
          bg: "linear-gradient(180deg, #2a6cb4 0%, #17497f 100%)",
          color: "#ffffff",
          borderColor: colors.primaryDark,
        }}
      >
        <Maximize2 size={12} />
        View
      </Flex>
    </Flex>
  </Box>
);

const ActivityCard = ({ item, index, colors, onOpen }) => (
  <Box
    as="button"
    type="button"
    role="group"
    onClick={onOpen}
    display="flex"
    flexDirection="column"
    textAlign="left"
    bg="#ffffff"
    border="1px solid"
    borderColor="#b9c9da"
    boxShadow="0 2px 8px rgba(18,58,99,0.1)"
    p={0}
    overflow="hidden"
    cursor="pointer"
    transition="transform .16s ease, box-shadow .16s ease, border-color .16s ease"
    _hover={{
      transform: "translateY(-3px)",
      boxShadow: "0 12px 24px rgba(18,58,99,0.22)",
      borderColor: "#8fa9c4",
    }}
  >
    <Box
      position="relative"
      aspectRatio="16 / 10"
      overflow="hidden"
      borderBottom="1px solid"
      borderColor={colors.borderSoft}
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
      <Box
        position="absolute"
        top="10px"
        left="10px"
        px="8px"
        py="2px"
        bg="rgba(255,255,255,0.94)"
        border="1px solid"
        borderColor="rgba(18,58,99,0.25)"
        boxShadow="0 1px 3px rgba(9,24,42,0.25)"
        fontSize="12px"
        fontWeight="700"
        color={colors.heading}
      >
        {String(index + 1).padStart(2, "0")}
      </Box>
    </Box>
    <Box px={5} py={4} flex="1" display="flex" flexDirection="column" minW={0}>
      {item.caption && (
        <Text
          as="span"
          alignSelf="flex-start"
          px="9px"
          py="3px"
          bg={colors.chipBlue}
          border="1px solid"
          borderColor={colors.chipBlueBorder}
          boxShadow="inset 0 1px 0 #ffffff"
          fontSize="13px"
          fontWeight="700"
          color={colors.chipBlueText}
          noOfLines={1}
          maxW="100%"
        >
          {item.caption}
        </Text>
      )}
      <Text
        fontSize="18px"
        fontWeight="700"
        lineHeight="1.4"
        color={colors.heading}
        mt={2}
        noOfLines={2}
      >
        {item.title}
      </Text>
      {item.description && (
        <Text fontSize="15px" lineHeight="1.7" color={colors.text} mt={2} noOfLines={3}>
          {item.description}
        </Text>
      )}
      <Flex
        mt="auto"
        pt={3}
        align="center"
        justify="space-between"
        gap={2}
        borderTop="1px solid"
        borderColor={colors.borderSoft}
      >
        <Text fontSize="13px" color={colors.muted} noOfLines={1}>
          {item.date}
        </Text>
        <Text fontSize="13px" fontWeight="700" color={colors.accent} flexShrink={0} whiteSpace="nowrap">
          View →
        </Text>
      </Flex>
    </Box>
  </Box>
);

export default Gallery;
