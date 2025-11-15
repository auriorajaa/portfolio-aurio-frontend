import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  keyframes,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
  FiMapPin,
  FiCode,
  FiCalendar,
} from "react-icons/fi";
import { personalInfo } from "../../data/portfolioData";
import { LazyLoadImage } from "react-lazy-load-image-component";

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const MotionBox = motion(Box);

// Rotating tech stack component
const TechStack = () => {
  const techs = [
    "Spring Boot",
    "Java",
    "RESTful API",
    "Microservices",
    "Django",
    "React.js",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % techs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [techs.length]);

  return (
    <HStack
      spacing={2}
      flexWrap="wrap"
      justify={{ base: "center", lg: "flex-start" }}
    >
      <Text fontSize="sm" color="gray.500" fontWeight="medium">
        Tech:
      </Text>
      <AnimatePresence mode="wait">
        <MotionBox
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Badge
            colorScheme="brand"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {techs[currentIndex]}
          </Badge>
        </MotionBox>
      </AnimatePresence>
    </HStack>
  );
};

// Stats component
const StatsSection = () => {
  const statBg = useColorModeValue("white", "gray.800");
  const statBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Grid
      templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      gap={{ base: 3, md: 4 }}
      w="full"
    >
      {[
        { label: "Experience", value: "2 Yrs", icon: FiCalendar },
        // { label: "Achievements", value: "4+", icon: FiAward },
        { label: "Tech Stack", value: "5+", icon: FiCode },
      ].map((stat, idx) => (
        <MotionBox
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + idx * 0.1 }}
          bg={statBg}
          p={{ base: 3, md: 4 }}
          borderRadius="xl"
          border="1px solid"
          borderColor={statBorder}
          textAlign="center"
          _hover={{
            transform: "translateY(-4px)",
            shadow: "lg",
            transition: "0.3s",
          }}
        >
          <VStack spacing={1}>
            <Box as={stat.icon} size="20px" color="brand.500" />
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color="brand.500"
            >
              {stat.value}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
              {stat.label}
            </Text>
          </VStack>
        </MotionBox>
      ))}
    </Grid>
  );
};

const Hero = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      as="section"
      id="home"
      minH="100vh"
      display="flex"
      alignItems="center"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      py={{ base: 24, md: 16 }}
    >
      <Container
        maxW="container.xl"
        position="relative"
        zIndex={2}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}
          gap={{ base: 8, md: 10, lg: 16 }}
          alignItems="center"
        >
          {/* Left Content */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack
                spacing={{ base: 5, md: 6 }}
                align={{ base: "center", lg: "flex-start" }}
                textAlign={{ base: "center", lg: "left" }}
              >
                {/* Status Badge */}
                <HStack
                  spacing={3}
                  flexWrap="wrap"
                  justify={{ base: "center", lg: "flex-start" }}
                >
                  <MotionBox
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Badge
                      colorScheme="green"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box
                        w={2}
                        h={2}
                        bg="green.400"
                        borderRadius="full"
                        animation={`${pulseAnimation} 2s infinite`}
                      />
                      Available for Work
                    </Badge>
                  </MotionBox>
                  <HStack spacing={1} color={textSecondary} fontSize="sm">
                    <FiMapPin />
                    <Text>{personalInfo.location}</Text>
                  </HStack>
                </HStack>

                {/* Main Heading */}
                <Box>
                  <Text
                    color="brand.500"
                    fontWeight="bold"
                    fontSize={{ base: "md", md: "lg" }}
                    mb={2}
                  >
                    Hello, I'm
                  </Text>
                  <Heading
                    as="h1"
                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="bold"
                    lineHeight="shorter"
                    color={textPrimary}
                    mb={2}
                  >
                    {personalInfo.name}
                  </Heading>
                  <Heading
                    as="h2"
                    fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
                    color="brand.500"
                    fontWeight="medium"
                  >
                    {personalInfo.title}
                  </Heading>
                </Box>

                {/* Bio */}
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={textSecondary}
                  maxW={{ base: "100%", lg: "550px" }}
                  lineHeight="tall"
                >
                  {personalInfo.bio}
                </Text>

                {/* Tech Stack Rotator */}
                <TechStack />

                {/* Stats Section */}
                <Box w="full" pt={2}>
                  <StatsSection />
                </Box>

                {/* Action Buttons */}
                <HStack
                  spacing={4}
                  wrap="wrap"
                  justify={{ base: "center", lg: "flex-start" }}
                  pt={4}
                  w="full"
                >
                  <Button
                    as="a"
                    href="#projects"
                    colorScheme="brand"
                    size="lg"
                    rightIcon={<FiArrowDown />}
                    _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                    transition="0.3s"
                  >
                    View My Work
                  </Button>

                  <Button
                    as="a"
                    href="#contact"
                    variant="outline"
                    colorScheme="brand"
                    size="lg"
                    _hover={{ transform: "translateY(-2px)", bg: "brand.50" }}
                    transition="0.3s"
                  >
                    Contact Me
                  </Button>
                </HStack>

                {/* Social Links */}
                <HStack spacing={3} pt={2}>
                  {[
                    {
                      icon: FiGithub,
                      href: personalInfo.github,
                      label: "GitHub",
                    },
                    {
                      icon: FiLinkedin,
                      href: personalInfo.linkedin,
                      label: "LinkedIn",
                    },
                    {
                      icon: FiMail,
                      href: `mailto:${personalInfo.email}`,
                      label: "Email",
                    },
                  ].map((social, idx) => (
                    <Tooltip key={idx} label={social.label} placement="top">
                      <IconButton
                        as="a"
                        href={social.href}
                        target={social.label !== "Email" ? "_blank" : undefined}
                        aria-label={social.label}
                        icon={<social.icon />}
                        colorScheme="brand"
                        variant="ghost"
                        size="lg"
                        isRound
                        _hover={{
                          bg: "brand.500",
                          color: "white",
                          transform: "scale(1.1)",
                        }}
                        transition="0.3s"
                      />
                    </Tooltip>
                  ))}
                </HStack>
              </VStack>
            </MotionBox>
          </GridItem>

          {/* Right Content - Profile Image Card */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                position="relative"
                w="full"
                maxW={{ base: "300px", sm: "350px", md: "400px", lg: "450px" }}
                mx="auto"
              >
                {/* Decorative Elements Behind Image */}
                <Box
                  position="absolute"
                  top="-20px"
                  right="-20px"
                  w="full"
                  h="full"
                  bg="brand.500"
                  opacity="0.2"
                  borderRadius="3xl"
                  transform="rotate(6deg)"
                  zIndex={0}
                />
                <Box
                  position="absolute"
                  bottom="-20px"
                  left="-20px"
                  w="full"
                  h="full"
                  bg="brand.300"
                  opacity="0.15"
                  borderRadius="3xl"
                  transform="rotate(-6deg)"
                  zIndex={0}
                />

                {/* Main Image Card */}
                <Box
                  position="relative"
                  zIndex={1}
                  bg={cardBg}
                  borderRadius="3xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  border={{ base: "6px solid", md: "8px solid" }}
                  borderColor="brand.500"
                  animation={`${floatingAnimation} 6s ease-in-out infinite`}
                  _hover={{
                    transform: "scale(1.02) rotate(2deg)",
                    transition: "0.4s ease",
                  }}
                >
                  <Box
                    w="full"
                    h={{ base: "300px", sm: "350px", md: "400px", lg: "450px" }}
                    position="relative"
                    overflow="hidden"
                  >
                    <LazyLoadImage
                      src="/profilepic.jpg"
                      alt={personalInfo.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center -95px",
                        transform: "scale(1.45)",
                      }}
                    />
                  </Box>

                  {/* Overlay Badge */}
                  <Box
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                    bg="whiteAlpha.900"
                    p={3}
                    borderRadius="xl"
                    boxShadow="xs"
                  >
                    <HStack justify="space-between" align="center">
                      <VStack align="flex-start" spacing={0}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                          {personalInfo.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {personalInfo.title}
                        </Text>
                      </VStack>
                      <Badge colorScheme="green" fontSize="xs">
                        Active
                      </Badge>
                    </HStack>
                  </Box>
                </Box>
              </Box>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      {/* Animated Background Elements */}
      {[
        { top: "10%", left: "5%", size: "200px", delay: "0s", duration: "8s" },
        {
          top: "60%",
          right: "5%",
          size: "150px",
          delay: "2s",
          duration: "10s",
        },
        {
          top: "30%",
          right: "15%",
          size: "100px",
          delay: "4s",
          duration: "12s",
        },
      ].map((circle, idx) => (
        <Box
          key={idx}
          position="absolute"
          top={circle.top}
          left={circle.left}
          right={circle.right}
          w={circle.size}
          h={circle.size}
          bg="brand.500"
          opacity="0.1"
          borderRadius="full"
          filter="blur(40px)"
          animation={`${floatingAnimation} ${circle.duration} ease-in-out infinite`}
          style={{ animationDelay: circle.delay }}
          display={{ base: "none", md: "block" }}
        />
      ))}
    </Box>
  );
};

export default Hero;
