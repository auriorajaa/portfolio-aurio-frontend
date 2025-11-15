// src/components/ui/ExperienceCard.js
import React, { useState } from "react";
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
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiCode,
  FiBriefcase,
  FiZap,
} from "react-icons/fi";

const MotionBox = motion(Box);

const TimelineNode = ({
  exp,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <VStack
      spacing={5}
      flex="1"
      cursor="pointer"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      position="relative"
    >
      <MotionBox
        position="relative"
        w={{ base: "70px", md: "80px" }}
        h={{ base: "70px", md: "80px" }}
        borderRadius="full"
        bg={cardBg}
        borderWidth="3px"
        borderColor={
          isSelected ? "brand.500" : isHovered ? "brand.400" : borderColor
        }
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        animate={{
          scale: isSelected ? 1.15 : isHovered ? 1.05 : 1,
          y: isSelected ? -5 : 0,
        }}
        transition={{ duration: 0.3 }}
        shadow={isSelected ? "xl" : "md"}
      >
        {isSelected && (
          <MotionBox
            position="absolute"
            inset={-3}
            borderRadius="full"
            bg="brand.500"
            opacity={0.2}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        {exp.logo ? (
          <Box
            as="img"
            src={exp.logo}
            alt={exp.company}
            w="65%"
            h="65%"
            objectFit="contain"
          />
        ) : (
          <FiBriefcase size={30} color="var(--chakra-colors-brand-500)" />
        )}
      </MotionBox>
      <VStack spacing={2} maxW="160px">
        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight={isSelected ? "bold" : "600"}
          color={isSelected ? "brand.500" : textSecondary}
          textAlign="center"
          noOfLines={2}
          transition="all 0.3s"
        >
          {exp.company}
        </Text>
        <Text
          fontSize="xs"
          color={textSecondary}
          textAlign="center"
          lineHeight="1.3"
        >
          {exp.period}
        </Text>
      </VStack>
    </VStack>
  );
};

const ExperienceDetailPanel = ({ experience, index }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentBg = useColorModeValue("gray.50", "gray.700");

  return (
    <MotionBox
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      w="100%"
    >
      <Box
        bg={cardBg}
        borderRadius="2xl"
        borderWidth="2px"
        borderColor="brand.500"
        overflow="hidden"
        shadow="2xl"
        position="relative"
      >
        {/* Top accent gradient - matching brand colors */}
        <Box h="6px" bg="brand.500" />

        <Box p={{ base: 6, md: 8 }}>
          {/* Header Section */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={6}
            mb={6}
            pb={6}
            borderBottom="1px"
            borderColor={borderColor}
          >
            {/* Logo Large */}
            {experience.logo && (
              <MotionBox
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                flexShrink={0}
              >
                <Box
                  w={{ base: "80px", md: "100px" }}
                  h={{ base: "80px", md: "100px" }}
                  bg="white"
                  borderRadius="xl"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderWidth="2px"
                  borderColor={borderColor}
                  shadow="md"
                >
                  <Box
                    as="img"
                    src={experience.logo}
                    alt={experience.company}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
              </MotionBox>
            )}

            {/* Title Section */}
            <VStack align="flex-start" spacing={3} flex="1">
              <MotionBox
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                w="100%"
              >
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={textPrimary}
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  {experience.position}
                </Heading>
              </MotionBox>

              <HStack spacing={3} flexWrap="wrap">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  color="brand.500"
                >
                  {experience.company}
                </Text>
                {experience.type && (
                  <Badge
                    colorScheme="brand"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {experience.type}
                  </Badge>
                )}
              </HStack>

              {/* Meta Info */}
              <Wrap spacing={4} fontSize="sm" color={textSecondary}>
                <HStack spacing={2}>
                  <FiCalendar />
                  <Text fontWeight="500">{experience.period}</Text>
                </HStack>

                {experience.location && (
                  <HStack spacing={2}>
                    <FiMapPin />
                    <Text fontWeight="500">{experience.location}</Text>
                  </HStack>
                )}
              </Wrap>
            </VStack>
          </Flex>

          {/* Main Content - Two Column Layout on Desktop */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={6}
            align="stretch"
          >
            {/* Left Column - Description */}
            <Box flex="1.5" minW="0">
              <HStack spacing={2} mb={4}>
                <FiZap color="var(--chakra-colors-brand-500)" size={20} />
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  Key Contributions
                </Text>
              </HStack>

              {Array.isArray(experience.description) ? (
                <UnorderedList
                  spacing={3}
                  color={textSecondary}
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.8"
                  pl={6}
                  stylePosition="outside"
                >
                  {experience.description.map((point, idx) => (
                    <MotionBox
                      as={ListItem}
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.08 + 0.3, duration: 0.3 }}
                    >
                      {point}
                    </MotionBox>
                  ))}
                </UnorderedList>
              ) : (
                <Text
                  color={textSecondary}
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.8"
                >
                  {experience.description}
                </Text>
              )}
            </Box>

            {/* Right Column - Tech Stack */}
            {experience.technologies && experience.technologies.length > 0 && (
              <Box
                flex="1"
                bg={accentBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                h="fit-content"
                position="sticky"
                top="20px"
              >
                <HStack spacing={2} mb={4}>
                  <FiCode color="var(--chakra-colors-brand-500)" size={20} />
                  <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                    Tech Stack
                  </Text>
                </HStack>
                <Wrap spacing={3}>
                  {experience.technologies.map((tech, idx) => (
                    <WrapItem key={idx}>
                      <MotionBox
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.05 + 0.4, duration: 0.3 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <Tag
                          size="lg"
                          variant="subtle"
                          colorScheme="brand"
                          borderRadius="full"
                          fontSize="sm"
                          px={4}
                          py={2}
                          cursor="pointer"
                          borderWidth="1px"
                          borderColor="transparent"
                          _hover={{
                            borderColor: "brand.500",
                            shadow: "md",
                          }}
                          transition="all 0.2s"
                        >
                          <TagLabel fontWeight="600">{tech}</TagLabel>
                        </Tag>
                      </MotionBox>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </MotionBox>
  );
};

const ExperienceCard = ({ experiences }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <VStack spacing={12} w="100%">
      {/* Timeline Navigation */}
      <Box w="100%" position="relative" py={8}>
        {/* Connection Line */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          right="0"
          h="2px"
          bg={borderColor}
          transform="translateY(-50%)"
          display={{ base: "none", md: "block" }}
        />

        {/* Progress Line */}
        <MotionBox
          position="absolute"
          top="50%"
          left="0"
          h="3px"
          bg="brand.500"
          transform="translateY(-50%)"
          initial={{ width: 0 }}
          animate={{
            width: `${(selectedIndex / (experiences.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          display={{ base: "none", md: "block" }}
        />

        {/* Timeline Nodes */}
        <Flex
          justify="space-between"
          position="relative"
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 8, md: 0 }}
        >
          {experiences.map((exp, idx) => (
            <TimelineNode
              key={exp.id}
              exp={exp}
              index={idx}
              isSelected={selectedIndex === idx}
              isHovered={hoveredIndex === idx}
              onSelect={() => setSelectedIndex(idx)}
              onHover={() => setHoveredIndex(idx)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </Flex>
      </Box>

      {/* Detail Panel */}
      <ExperienceDetailPanel
        experience={experiences[selectedIndex]}
        index={selectedIndex}
      />
    </VStack>
  );
};

export default ExperienceCard;
