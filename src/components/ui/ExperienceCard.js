import React from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  useColorModeValue,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiBriefcase } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const ExperienceCard = ({ experience, index, totalItems }) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");

  // Center last card if odd number of items
  const isLastOdd = totalItems % 2 !== 0 && index === totalItems - 1;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      height="100%"
      display="flex"
      flexDirection="column"
      w="100%"
      maxW={{ base: "100%", lg: isLastOdd ? "calc(50% - 12px)" : "100%" }}
      gridColumn={{ base: "1", lg: isLastOdd ? "1 / -1" : "auto" }}
      mx={{ base: 0, lg: isLastOdd ? "auto" : 0 }}
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={{ base: 5, md: 6 }}
        shadow="md"
        _hover={{
          shadow: "xl",
          transform: "translateY(-4px)",
          borderColor: "brand.500",
        }}
        transition="all 0.25s ease"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <HStack align="flex-start" spacing={4} mb={4}>
          {experience.logo && (
            <Box
              flexShrink={0}
              p={2}
              bg="white"
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              boxSize={{ base: "56px", md: "64px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LazyLoadImage
                src={experience.logo}
                alt={`${experience.company} Logo`}
                effect="blur"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.25)",
                }}
              />
            </Box>
          )}

          <VStack align="flex-start" spacing={1} flex="1" minW="0">
            <Heading
              as="h3"
              fontSize={{ base: "lg", md: "xl" }}
              color={textPrimary}
              fontWeight="700"
              lineHeight="1.2"
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {experience.position}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              color="brand.500"
            >
              {experience.company}
            </Text>

            {/* Meta Info: period, location, type */}
            <HStack
              spacing={{ base: 3, md: 4 }}
              fontSize={{ base: "xs", md: "sm" }}
              color={textSecondary}
              flexWrap="wrap"
              pt={1}
            >
              <HStack spacing={1}>
                <FiCalendar />
                <Text whiteSpace="nowrap">{experience.period}</Text>
              </HStack>
              {experience.location && (
                <HStack spacing={1}>
                  <FiMapPin />
                  <Text>{experience.location}</Text>
                </HStack>
              )}
              {experience.type && (
                <Badge
                  colorScheme="brand"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  display="flex"
                  alignItems="center"
                  borderRadius="md"
                >
                  <HStack spacing={1}>
                    <Text>{experience.type}</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>

        {/* Description - Bullet Points */}
        {Array.isArray(experience.description) ? (
          <UnorderedList
            spacing={2}
            color={textSecondary}
            mb={{ base: 4, md: 5 }}
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
            flex="1"
            pl={4}
            stylePosition="outside"
          >
            {experience.description.map((point, idx) => (
              <ListItem key={idx}>{point}</ListItem>
            ))}
          </UnorderedList>
        ) : (
          <Text
            color={textSecondary}
            mb={{ base: 4, md: 5 }}
            lineHeight="1.7"
            fontSize={{ base: "sm", md: "md" }}
            flex="1"
          >
            {experience.description}
          </Text>
        )}

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <Box mt="auto" pt={2}>
            <Text
              fontWeight="600"
              color={textPrimary}
              mb={2.5}
              fontSize={{ base: "sm", md: "sm" }}
            >
              Technologies:
            </Text>
            <Wrap spacing={2}>
              {experience.technologies.map((tech, index) => (
                <WrapItem key={index}>
                  <Tag
                    size="md"
                    variant="subtle"
                    colorScheme="brand"
                    borderRadius="full"
                    fontSize="sm"
                    px={3}
                    py={1.5}
                  >
                    <TagLabel>{tech}</TagLabel>
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </Box>
    </MotionBox>
  );
};

export default ExperienceCard;
