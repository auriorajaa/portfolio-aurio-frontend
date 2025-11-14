import React from "react";
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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { personalInfo } from "../../data/portfolioData";

const floatingAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const MotionBox = motion(Box);

const Hero = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );
  return (
    <Box
      as="section"
      id="home"
      minH={{ base: "100vh", md: "100vh" }}
      display="flex"
      alignItems="center"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      py={{ base: 20, md: 0 }}
    >
      <Container
        maxW="container.xl"
        position="relative"
        zIndex={2}
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, md: 10, lg: 12 }}
          alignItems="center"
          minH={{ base: "auto", md: "80vh" }}
        >
          <GridItem order={{ base: 2, lg: 1 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack
                spacing={{ base: 4, md: 5, lg: 6 }}
                align={{ base: "center", lg: "flex-start" }}
                textAlign={{ base: "center", lg: "left" }}
              >
                <Text
                  color="brand.500"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  Hello, I'm
                </Text>
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  lineHeight="shorter"
                  color={textPrimary}
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
                <Text
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  color={textSecondary}
                  maxW={{ base: "100%", lg: "600px" }}
                  lineHeight="tall"
                  px={{ base: 4, lg: 0 }}
                >
                  {personalInfo.bio}
                </Text>

                <HStack
                  spacing={{ base: 3, md: 4 }}
                  wrap="wrap"
                  justify={{ base: "center", lg: "flex-start" }}
                  pt={{ base: 2, md: 4 }}
                >
                  <Button
                    as="a"
                    href="#projects"
                    colorScheme="brand"
                    size={{ base: "md", md: "lg" }}
                    rightIcon={<FiArrowDown />}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    View My Work
                  </Button>

                  <Button
                    as="a"
                    href="#contact"
                    variant="outline"
                    colorScheme="brand"
                    size={{ base: "md", md: "lg" }}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    Contact Me
                  </Button>
                </HStack>

                <HStack spacing={{ base: 3, md: 4 }} pt={{ base: 2, md: 4 }}>
                  <IconButton
                    as="a"
                    href={personalInfo.github}
                    target="_blank"
                    aria-label="GitHub"
                    icon={<FiGithub />}
                    colorScheme="brand"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                    isRound
                  />
                  <IconButton
                    as="a"
                    href={personalInfo.linkedin}
                    target="_blank"
                    aria-label="LinkedIn"
                    icon={<FiLinkedin />}
                    colorScheme="brand"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                    isRound
                  />
                  <IconButton
                    as="a"
                    href={`mailto:${personalInfo.email}`}
                    aria-label="Email"
                    icon={<FiMail />}
                    colorScheme="brand"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                    isRound
                  />
                </HStack>
              </VStack>
            </MotionBox>
          </GridItem>

          <GridItem order={{ base: 1, lg: 2 }}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              textAlign="center"
              animation={`${floatingAnimation} 6s ease-in-out infinite`}
            >
              <Box
                borderRadius="3xl"
                overflow="hidden"
                boxSize={{
                  base: "250px",
                  sm: "300px",
                  md: "350px",
                  lg: "450px",
                  xl: "500px",
                }}
                mx="auto"
                border={{ base: "4px solid", md: "6px solid", lg: "8px solid" }}
                borderColor="brand.500"
                boxShadow="2xl"
                position="relative"
                _hover={{ transform: "scale(1.05)", transition: "0.4s ease" }}
              >
                <LazyLoadImage
                  src="/profilepic.jpg"
                  alt={personalInfo.name}
                  effect="blur"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center -55px",
                    transform: "scale(1.35)",
                    transition: "transform 0.5s ease",
                  }}
                />
              </Box>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      {/* Animated background elements */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w={{ base: "100px", md: "150px", lg: "200px" }}
        h={{ base: "100px", md: "150px", lg: "200px" }}
        bg="brand.500"
        opacity="0.1"
        borderRadius="full"
        filter="blur(40px)"
        animation={`${floatingAnimation} 8s ease-in-out infinite`}
        display={{ base: "none", md: "block" }}
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w={{ base: "80px", md: "120px", lg: "150px" }}
        h={{ base: "80px", md: "120px", lg: "150px" }}
        bg="brand.300"
        opacity="0.1"
        borderRadius="full"
        filter="blur(30px)"
        animation={`${floatingAnimation} 10s ease-in-out infinite reverse`}
        display={{ base: "none", md: "block" }}
      />
    </Box>
  );
};

export default Hero;
