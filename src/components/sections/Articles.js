import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiEdit3,
  FiCode,
  FiCoffee,
  FiZap,
  FiBookOpen,
  FiPenTool,
} from "react-icons/fi";

const MotionBox = motion(Box);

const Articles = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("brand.500", "brand.400");
  const iconBg = useColorModeValue("brand.50", "brand.900");
  const badgeBg = useColorModeValue("yellow.100", "yellow.900");
  const badgeBorder = useColorModeValue("yellow.300", "yellow.700");
  const badgeText = useColorModeValue("yellow.800", "yellow.200");
  const progressBg = useColorModeValue("gray.200", "gray.700");
  const tagBg = useColorModeValue("brand.100", "brand.800");
  const tagHoverBg = useColorModeValue("brand.200", "brand.700");
  const blobOpacity = useColorModeValue(0.4, 0.2);

  const floatingAnimation = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  `;

  const pulseAnimation = keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  `;

  const bounceAnimation = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  `;

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  const icons = [
    { icon: FiEdit3, delay: 0 },
    { icon: FiCode, delay: 0.2 },
    { icon: FiCoffee, delay: 0.4 },
    { icon: FiZap, delay: 0.6 },
    { icon: FiBookOpen, delay: 0.8 },
    { icon: FiPenTool, delay: 1 },
  ];

  const tags = [
    "Coding Tutorials",
    "Best Practices",
    "Tech Reviews",
    "Project Stories",
  ];

  return (
    <Box
      as="section"
      id="articles"
      py={{ base: 16, md: 20, lg: 24 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      minH={{ base: "70vh", md: "80vh" }}
      display="flex"
      alignItems="center"
    >
      {/* Decorative Blobs */}
      <Box
        position="absolute"
        top="12%"
        left="7%"
        w={{ base: "210px", md: "360px" }}
        h={{ base: "210px", md: "360px" }}
        bgGradient="radial(circle, green.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(72px)"
        animation={`${floatingAnimation} 15s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="18%"
        right="12%"
        w={{ base: "190px", md: "320px" }}
        h={{ base: "190px", md: "320px" }}
        bgGradient="radial(circle, teal.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(68px)"
        animation={`${floatingAnimation} 18s ease-in-out infinite reverse`}
      />

      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 12 }} position="relative" zIndex={1}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading
              as="h2"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              color={textPrimary}
              fontWeight="bold"
              mb={4}
            >
              Articles & Insights
            </Heading>
            <Text
              maxW="container.md"
              mx="auto"
              color={textSecondary}
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="tall"
              px={{ base: 4, md: 0 }}
            >
              Thoughts, tutorials, and insights about software development
            </Text>
          </MotionBox>

          {/* Main Coming Soon Card */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            w="100%"
            maxW="900px"
          >
            <Box
              bg={cardBg}
              borderWidth="2px"
              borderColor={borderColor}
              borderRadius="2xl"
              p={{ base: 8, md: 12, lg: 16 }}
              shadow="2xl"
              position="relative"
              overflow="hidden"
            >
              {/* Animated gradient overlay */}
              <Box
                position="absolute"
                top="-50%"
                left="-50%"
                w="200%"
                h="200%"
                bgGradient="conic(from 0deg, transparent, brand.200, transparent)"
                opacity={0.1}
                animation={`${floatingAnimation} 20s linear infinite`}
              />

              <VStack
                spacing={{ base: 6, md: 8 }}
                position="relative"
                zIndex={1}
              >
                {/* Animated Icons Grid */}
                <HStack
                  spacing={{ base: 3, md: 6 }}
                  flexWrap="wrap"
                  justify="center"
                  mb={4}
                >
                  {icons.map((item, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: item.delay }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <Box
                        p={{ base: 3, md: 4 }}
                        bg={iconBg}
                        borderRadius="xl"
                        animation={`${bounceAnimation} 2s ease-in-out infinite`}
                        animationDelay={`${item.delay}s`}
                      >
                        <Icon
                          as={item.icon}
                          boxSize={{ base: 6, md: 8 }}
                          color={accentColor}
                        />
                      </Box>
                    </MotionBox>
                  ))}
                </HStack>

                {/* Status Badge */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  animation={`${pulseAnimation} 3s ease-in-out infinite`}
                >
                  <Box
                    display="inline-block"
                    px={{ base: 4, md: 6 }}
                    py={{ base: 2, md: 3 }}
                    bg={badgeBg}
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor={badgeBorder}
                  >
                    <HStack spacing={2}>
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="yellow.500"
                        animation={`${pulseAnimation} 2s ease-in-out infinite`}
                      />
                      <Text
                        color={badgeText}
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="bold"
                        letterSpacing="wide"
                        textTransform="uppercase"
                      >
                        Under Construction
                      </Text>
                    </HStack>
                  </Box>
                </MotionBox>

                {/* Main Message */}
                <VStack spacing={{ base: 3, md: 4 }} textAlign="center">
                  <Heading
                    as="h3"
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    color={textPrimary}
                    fontWeight="bold"
                  >
                    Great Content Coming Soon! 🚀
                  </Heading>
                  <Text
                    color={textSecondary}
                    fontSize={{ base: "md", md: "lg" }}
                    maxW="600px"
                    lineHeight="tall"
                  >
                    I'm currently crafting amazing articles and tutorials about
                    web development, software engineering, and technology. Stay
                    tuned for insightful content!
                  </Text>
                </VStack>

                {/* Progress Indicator */}
                <VStack spacing={3} w="100%" maxW="400px">
                  <HStack justify="space-between" w="100%">
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color={textSecondary}
                      fontWeight="medium"
                    >
                      Content Preparation
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color={accentColor}
                      fontWeight="bold"
                    >
                      In Progress...
                    </Text>
                  </HStack>
                  <Box
                    w="100%"
                    h="8px"
                    bg={progressBg}
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <MotionBox
                      h="100%"
                      bgGradient="linear(to-r, brand.400, teal.400, blue.400)"
                      borderRadius="full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </Box>
                </VStack>

                {/* Features Preview */}
                <VStack
                  spacing={{ base: 2, md: 3 }}
                  pt={{ base: 4, md: 6 }}
                  textAlign="center"
                >
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color={textSecondary}
                    fontWeight="medium"
                  >
                    Coming Soon:
                  </Text>
                  <HStack
                    spacing={{ base: 2, md: 4 }}
                    flexWrap="wrap"
                    justify="center"
                  >
                    {tags.map((tag, index) => (
                      <MotionBox
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <Box
                          px={{ base: 3, md: 4 }}
                          py={{ base: 1, md: 2 }}
                          bg={tagBg}
                          color={accentColor}
                          borderRadius="full"
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="semibold"
                          _hover={{
                            transform: "scale(1.05)",
                            bg: tagHoverBg,
                          }}
                          transition="all 0.2s"
                          cursor="default"
                        >
                          {tag}
                        </Box>
                      </MotionBox>
                    ))}
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </MotionBox>

          {/* Bottom Message */}
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Text
              color={textSecondary}
              fontSize={{ base: "sm", md: "md" }}
              textAlign="center"
              fontStyle="italic"
            >
              Check back soon for exciting content! ✨
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Articles;
