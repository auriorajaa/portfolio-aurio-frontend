// src/components/ui/TimelineItem.js
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  useColorModeValue,
  VStack,
  Button,
  Collapse,
  Icon,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  BookOpen,
} from "lucide-react";

const MotionBox = motion(Box);

const TimelineItem = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCourses, setShowCourses] = useState(false);

  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#a8b2d1");
  const accentColor = useColorModeValue(
    `${item.color}.600`,
    `${item.color}.400`
  );
  const bgOverlay = useColorModeValue(
    `linear-gradient(135deg, ${item.color}.50 0%, white 100%)`,
    `linear-gradient(135deg, ${item.color}.900 0%, #0a192f 100%)`
  );
  const statBg = useColorModeValue(`${item.color}.50`, `${item.color}.900`);
  const borderAccent = useColorModeValue(
    `${item.color}.300`,
    `${item.color}.600`
  );

  const isEven = index % 2 === 0;

  const getPercentage = () => {
    if (item.gpa) {
      return (parseFloat(item.gpa) / 4.0) * 100;
    } else if (item.score) {
      return parseFloat(item.score.split("/")[0]);
    }
    return 0;
  };

  const percentage = getPercentage();

  return (
    <Box
      display={{ base: "block", md: "grid" }}
      gridTemplateColumns={{ md: "1fr 80px 1fr" }}
      gap={{ md: 8 }}
      pl={{ base: "60px", md: "0" }}
    >
      {isEven && <Box display={{ base: "none", md: "block" }} />}
      <Box display={{ base: "none", md: "block" }} />

      {/* Timeline Node */}
      <Box
        position="absolute"
        left={{ base: "-2", md: "50%" }}
        top="20px"
        transform={{ base: "none", md: "translateX(-50%)" }}
        zIndex={2}
      >
        <MotionBox
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={useColorModeValue("white", "#0a192f")}
          borderRadius="full"
          p={3}
          border="4px solid"
          borderColor={accentColor}
          boxShadow="xl"
        >
          <GraduationCap size={24} color={accentColor} />
        </MotionBox>
      </Box>

      {/* Content */}
      <MotionBox
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        position="relative"
        gridColumn={{ md: isEven ? "3" : "1" }}
        w="full"
        maxW="full"
      >
        <Box
          position="absolute"
          top="-20px"
          left="-20px"
          right="-20px"
          bottom="-20px"
          bgGradient={bgOverlay}
          borderRadius="3xl"
          opacity={0.4}
          filter="blur(40px)"
          zIndex={0}
        />

        <Box position="relative" zIndex={1}>
          {item.logo && (
            <Flex
              justify={{
                base: "center",
                md: isEven ? "flex-start" : "flex-end",
              }}
              mb={6}
            >
              <MotionBox
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  p={3}
                  bg="white"
                  borderRadius="2xl"
                  borderWidth="3px"
                  borderColor={borderAccent}
                  boxSize={{ base: "100px", md: "120px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="2xl"
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    inset="-50%"
                    bgGradient={`linear(45deg, transparent, ${item.color}.200, transparent)`}
                    animation="shine 3s infinite"
                  />
                  <Box
                    as="img"
                    src={item.logo}
                    alt={`${item.title} Logo`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transform="scale(1.3)"
                    position="relative"
                    zIndex={1}
                  />
                </Box>
              </MotionBox>
            </Flex>
          )}

          <VStack
            align={{ base: "center", md: isEven ? "flex-start" : "flex-end" }}
            spacing={4}
            textAlign={{ base: "center", md: isEven ? "left" : "right" }}
            w="full"
            maxW="full"
          >
            {item.status && (
              <Badge
                colorScheme={item.status === "Current" ? "green" : "blue"}
                fontSize="xs"
                px={4}
                py={2}
                borderRadius="full"
                fontWeight="bold"
                boxShadow="lg"
              >
                {item.status}
              </Badge>
            )}

            <Heading
              as="h3"
              fontSize={{ base: "xl", md: "2xl" }}
              color={textPrimary}
              fontWeight="black"
              w="full"
              maxW="full"
              wordBreak="break-word"
            >
              {item.title}
            </Heading>

            {item.major && (
              <VStack
                spacing={1}
                align={{
                  base: "center",
                  md: isEven ? "flex-start" : "flex-end",
                }}
                w="full"
                maxW="full"
              >
                <HStack spacing={2}>
                  <Icon as={BookOpen} color={accentColor} boxSize={5} />
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color={accentColor}
                    wordBreak="break-word"
                  >
                    {item.major}
                  </Text>
                </HStack>
                {item.degree && (
                  <Text fontSize="sm" color={textSecondary} fontWeight="medium">
                    {item.degree}
                  </Text>
                )}
              </VStack>
            )}

            <Flex
              w="full"
              gap={3}
              flexWrap="wrap"
              justify={{
                base: "center",
                md: isEven ? "flex-start" : "flex-end",
              }}
              maxW="full"
            >
              <Flex
                align="center"
                gap={2}
                bg={statBg}
                px={4}
                py={2}
                borderRadius="xl"
                borderWidth="2px"
                borderColor={borderAccent}
                boxShadow="md"
              >
                <Icon as={Calendar} boxSize={4} color={accentColor} />
                <Text
                  fontSize="sm"
                  color={textPrimary}
                  fontWeight="semibold"
                  whiteSpace="nowrap"
                >
                  {item.period}
                </Text>
              </Flex>

              {(item.gpa || item.score) && (
                <Flex
                  align="center"
                  gap={2}
                  bg={statBg}
                  px={4}
                  py={2}
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor={borderAccent}
                  boxShadow="md"
                >
                  <Icon as={Award} boxSize={4} color={accentColor} />
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={textPrimary}
                    whiteSpace="nowrap"
                  >
                    {item.gpa ? `GPA: ${item.gpa}` : `Score: ${item.score}`}
                  </Text>
                </Flex>
              )}
            </Flex>

            {(item.gpa || item.score) && (
              <Box w="full" maxW="full">
                <Flex justify="space-between" mb={2}>
                  <Text
                    fontSize="xs"
                    color={textSecondary}
                    fontWeight="semibold"
                  >
                    Performance
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                    {percentage.toFixed(0)}%
                  </Text>
                </Flex>
                <Progress
                  value={percentage}
                  size="md"
                  colorScheme={item.color}
                  borderRadius="full"
                  hasStripe
                  isAnimated
                  bg={statBg}
                  boxShadow="inner"
                />
              </Box>
            )}

            {item.description && (
              <Text
                fontSize="sm"
                color={textSecondary}
                lineHeight="1.8"
                w="full"
                maxW="full"
                wordBreak="break-word"
              >
                {item.description}
              </Text>
            )}

            {item.achievements && item.achievements.length > 0 && (
              <Box w="full" maxW="full">
                <Button
                  size="sm"
                  variant="solid"
                  colorScheme={item.color}
                  onClick={() => setIsExpanded(!isExpanded)}
                  rightIcon={<Icon as={isExpanded ? ChevronUp : ChevronDown} />}
                  leftIcon={<Icon as={Award} />}
                  w={{ base: "full", md: "auto" }}
                  boxShadow="md"
                >
                  {isExpanded ? "Hide" : "View"} Achievements (
                  {item.achievements.length})
                </Button>

                <Collapse in={isExpanded} animateOpacity>
                  <VStack align="stretch" spacing={3} mt={4} maxW="full">
                    {item.achievements.map((achievement, idx) => (
                      <Flex
                        key={idx}
                        align="flex-start"
                        gap={3}
                        p={3}
                        bg={statBg}
                        borderRadius="lg"
                        borderLeftWidth="4px"
                        borderLeftColor={accentColor}
                        boxShadow="md"
                        _hover={{
                          transform: "translateX(4px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.2s"
                        maxW="full"
                      >
                        <Icon
                          as={Award}
                          color={accentColor}
                          boxSize={5}
                          flexShrink={0}
                          mt={0.5}
                        />
                        <Text
                          fontSize="sm"
                          color={textPrimary}
                          fontWeight="medium"
                          wordBreak="break-word"
                        >
                          {achievement}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Collapse>
              </Box>
            )}

            {item.courses && item.courses.length > 0 && (
              <Box w="full" maxW="full">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme={item.color}
                  onClick={() => setShowCourses(!showCourses)}
                  rightIcon={
                    <Icon as={showCourses ? ChevronUp : ChevronDown} />
                  }
                  leftIcon={<Icon as={BookOpen} />}
                  w={{ base: "full", md: "auto" }}
                >
                  {showCourses ? "Hide" : "View"} Key Courses (
                  {item.courses.length})
                </Button>

                <Collapse in={showCourses} animateOpacity>
                  <Flex flexWrap="wrap" gap={2} mt={3} maxW="full">
                    {item.courses.map((course, idx) => (
                      <Badge
                        key={idx}
                        colorScheme={item.color}
                        variant="solid"
                        px={3}
                        py={2}
                        fontSize="xs"
                        borderRadius="lg"
                        fontWeight="semibold"
                        boxShadow="sm"
                      >
                        {course}
                      </Badge>
                    ))}
                  </Flex>
                </Collapse>
              </Box>
            )}

            {item.skills && item.skills.length > 0 && (
              <Box w="full" maxW="full">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={textPrimary}
                  mb={2}
                >
                  Skills Learned:
                </Text>
                <Flex flexWrap="wrap" gap={2} maxW="full">
                  {item.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      colorScheme={item.color}
                      variant="solid"
                      px={3}
                      py={2}
                      fontSize="xs"
                      borderRadius="lg"
                      fontWeight="semibold"
                      boxShadow="sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </VStack>
        </Box>

        <style>
          {`
            @keyframes shine {
              0% {
                transform: translateX(-100%) translateY(-100%) rotate(45deg);
              }
              100% {
                transform: translateX(100%) translateY(100%) rotate(45deg);
              }
            }
          `}
        </style>
      </MotionBox>

      {!isEven && <Box display={{ base: "none", md: "block" }} />}
    </Box>
  );
};

export default TimelineItem;
