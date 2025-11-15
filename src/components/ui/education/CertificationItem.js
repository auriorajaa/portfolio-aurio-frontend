// src/components/ui/CertificationItem.js
import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
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
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const CertificationItem = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#a8b2d1");
  const accentColor = useColorModeValue(
    `${item.color}.600`,
    `${item.color}.400`
  );
  const borderColor = useColorModeValue(
    `${item.color}.300`,
    `${item.color}.600`
  );
  const accentBg = useColorModeValue(`${item.color}.50`, `${item.color}.900`);

  const logoBg = useColorModeValue("white", "gray.800");

  const scoreValue = item.score ? parseFloat(item.score.split("/")[0]) : 0;
  const maxScore = item.score ? parseFloat(item.score.split("/")[1]) : 100;
  const scorePercentage = (scoreValue / maxScore) * 100;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      position="relative"
      w="full"
      maxW="full"
    >
      {/* Decorative Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="250px"
        opacity={0.3}
        borderRadius="3xl"
        zIndex={0}
      />

      {/* Content */}
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDirection={{ base: "column", lg: "row" }}
        gap={{ base: 6, lg: 10 }}
        alignItems={{ base: "center", lg: "flex-start" }}
        maxW="full"
      >
        {/* Left: Logo & Status */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          flexShrink={0}
        >
          <VStack spacing={4} align="center">
            <Box
              position="relative"
              p={4}
              bg={logoBg}
              borderRadius="2xl"
              borderWidth="3px"
              borderColor={borderColor}
              boxSize={{ base: "140px", md: "160px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Box
                position="absolute"
                inset="-50%"
                bgGradient={`linear(45deg, transparent, ${item.color}.300, transparent)`}
                animation="rotate 4s linear infinite"
                opacity={0.3}
              />

              <Box
                as="img"
                src={item.logo}
                alt={`${item.title} Logo`}
                w="100%"
                h="100%"
                objectFit="contain"
                position="relative"
                zIndex={1}
              />
            </Box>

            {item.status && (
              <Badge
                colorScheme={item.status === "Current" ? "green" : "blue"}
                fontSize="xs"
                px={4}
                py={2}
                borderRadius="full"
                fontWeight="bold"
                boxShadow="lg"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={CheckCircle} boxSize={3} />
                {item.status}
              </Badge>
            )}
          </VStack>
        </MotionBox>

        {/* Right: Content */}
        <VStack
          spacing={5}
          align="stretch"
          flex={1}
          w="full"
          maxW="full"
          minW={0}
        >
          <Box>
            <Heading
              as="h3"
              fontSize={{ base: "xl", md: "2xl", lg: "2.5xl" }}
              color={textPrimary}
              fontWeight="black"
              mb={3}
              lineHeight="1.2"
              wordBreak="break-word"
              maxW="full"
            >
              {item.title}
            </Heading>

            {item.major && (
              <Flex align="center" gap={2} flexWrap="wrap" mb={3} maxW="full">
                <Icon
                  as={Target}
                  color={accentColor}
                  boxSize={5}
                  flexShrink={0}
                />
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="bold"
                  color={accentColor}
                  wordBreak="break-word"
                  maxW="full"
                >
                  {item.major}
                </Text>
              </Flex>
            )}

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={3}
              flexWrap="wrap"
              maxW="full"
            >
              <Flex
                align="center"
                gap={2}
                bg={accentBg}
                px={4}
                py={2}
                borderRadius="xl"
                borderWidth="2px"
                borderColor={borderColor}
                boxShadow="md"
                maxW={{ base: "full", sm: "auto" }}
                minW={0}
              >
                <Icon
                  as={Calendar}
                  boxSize={4}
                  color={accentColor}
                  flexShrink={0}
                />
                <Text
                  fontSize="sm"
                  color={textPrimary}
                  fontWeight="semibold"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {item.period}
                </Text>
              </Flex>

              {item.score && (
                <Flex
                  align="center"
                  gap={2}
                  bg={accentBg}
                  px={4}
                  py={2}
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor={borderColor}
                  boxShadow="md"
                  maxW={{ base: "full", sm: "auto" }}
                >
                  <Icon
                    as={Zap}
                    color={accentColor}
                    boxSize={4}
                    flexShrink={0}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={textPrimary}
                    whiteSpace="nowrap"
                  >
                    Score: {item.score}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>

          {item.score && (
            <Box w="full" maxW="full">
              <Flex justify="space-between" mb={2}>
                <Text fontSize="xs" color={textSecondary} fontWeight="semibold">
                  Performance
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                  {scorePercentage.toFixed(0)}%
                </Text>
              </Flex>
              <Progress
                value={scorePercentage}
                size="md"
                colorScheme={item.color}
                borderRadius="full"
                hasStripe
                isAnimated
                bg={accentBg}
                boxShadow="inner"
              />
            </Box>
          )}

          {item.description && (
            <Text
              fontSize="sm"
              color={textSecondary}
              lineHeight="1.8"
              wordBreak="break-word"
              maxW="full"
            >
              {item.description}
            </Text>
          )}

          {item.skills && item.skills.length > 0 && (
            <Box maxW="full">
              <Flex align="center" gap={2} mb={3}>
                <Icon as={Zap} color={accentColor} boxSize={5} flexShrink={0} />
                <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                  Skills & Technologies
                </Text>
              </Flex>
              <Flex flexWrap="wrap" gap={2} maxW="full">
                {item.skills.map((skill, idx) => (
                  <MotionBox
                    key={idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
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
                  </MotionBox>
                ))}
              </Flex>
            </Box>
          )}

          {item.achievements && item.achievements.length > 0 && (
            <Box maxW="full">
              <Button
                size="sm"
                variant="solid"
                colorScheme={item.color}
                onClick={() => setIsExpanded(!isExpanded)}
                rightIcon={<Icon as={isExpanded ? ChevronUp : ChevronDown} />}
                leftIcon={<Icon as={Award} />}
                w={{ base: "full", sm: "auto" }}
                fontWeight="bold"
                boxShadow="md"
              >
                {isExpanded ? "Hide" : "Show"} Achievements (
                {item.achievements.length})
              </Button>

              <Collapse in={isExpanded} animateOpacity>
                <VStack align="stretch" spacing={3} mt={4} maxW="full">
                  {item.achievements.map((achievement, idx) => (
                    <MotionFlex
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      align="flex-start"
                      gap={3}
                      p={4}
                      bg={accentBg}
                      borderRadius="lg"
                      borderLeftWidth="4px"
                      borderLeftColor={accentColor}
                      boxShadow="md"
                      _hover={{
                        transform: "translateX(4px)",
                        boxShadow: "lg",
                      }}
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
                        maxW="full"
                      >
                        {achievement}
                      </Text>
                    </MotionFlex>
                  ))}
                </VStack>
              </Collapse>
            </Box>
          )}
        </VStack>
      </Box>

      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </MotionBox>
  );
};

export default CertificationItem;
