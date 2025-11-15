import React from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Grid,
  GridItem,
  Link,
  Heading,
  Divider,
  Tooltip,
  Button,
  Stack,
} from "@chakra-ui/react";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiHeart,
  FiArrowUp,
  FiMapPin,
  FiCode,
  FiExternalLink,
} from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Mock data
const personalInfo = {
  name: "Aurio Rajaa",
  email: "mr.auriorajaa@gmail.com",
  github: "https://github.com/auriorajaa",
  linkedin: "https://linkedin.com/in/auriorajaa",
  location: "Jakarta, Indonesia",
};

const Footer = () => {
  const bgColor = useColorModeValue("gray.50", "#0a192f");
  const textColor = useColorModeValue("gray.600", "#8892b0");
  const headingColor = useColorModeValue("gray.800", "#e6f1ff");
  const borderColor = useColorModeValue("gray.200", "#112240");
  const iconHoverBg = useColorModeValue("brand.50", "brand.900");
  const cardBg = useColorModeValue("white", "#112240");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  const moreLinks = [
    { label: "Activities", href: "#activities" },
    { label: "Achievements", href: "#achievements" },
    { label: "Articles", href: "#articles" },
  ];

  const techStack = [
    "Spring Boot",
    "Java",
    "React",
    "Next.js",
    "Django",
    "PostgreSQL",
  ];

  return (
    <Box
      as="footer"
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      position="relative"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        {/* Main Footer Content */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "2fr 1fr 1fr 1fr",
          }}
          gap={{ base: 8, md: 10, lg: 12 }}
          py={{ base: 10, md: 12, lg: 14 }}
        >
          {/* About Section */}
          <GridItem>
            <VStack align={{ base: "center", md: "flex-start" }} spacing={4}>
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="brand.500"
                letterSpacing="-0.03em"
              >
                AR.
              </Heading>
              <Text
                color={textColor}
                fontSize={{ base: "sm", md: "md" }}
                maxW="400px"
                textAlign={{ base: "center", md: "left" }}
                lineHeight="tall"
              >
                Backend developer specializing in Spring Boot and Java
                ecosystem. Building robust RESTful APIs and scalable solutions.
              </Text>

              {/* Location */}
              <HStack spacing={2} color={textColor} fontSize="sm">
                <FiMapPin />
                <Text>{personalInfo.location}</Text>
              </HStack>

              {/* Tech Stack */}
              <Box w="full">
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color={headingColor}
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Tech Stack
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {techStack.map((tech, idx) => (
                    <MotionBox
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Box
                        px={3}
                        py={1}
                        bg={cardBg}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="500"
                        color={textColor}
                        border="1px solid"
                        borderColor={borderColor}
                        cursor="default"
                      >
                        {tech}
                      </Box>
                    </MotionBox>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </GridItem>

          {/* Quick Links */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <VStack align="flex-start" spacing={3}>
              <Heading
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                textTransform="uppercase"
                letterSpacing="wider"
                mb={1}
              >
                Quick Links
              </Heading>
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  fontSize="sm"
                  color={textColor}
                  _hover={{
                    color: "brand.500",
                    textDecoration: "none",
                    transform: "translateX(4px)",
                  }}
                  transition="all 0.2s"
                  display="inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </GridItem>

          {/* More */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <VStack align="flex-start" spacing={3}>
              <Heading
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                textTransform="uppercase"
                letterSpacing="wider"
                mb={1}
              >
                More
              </Heading>
              {moreLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  fontSize="sm"
                  color={textColor}
                  _hover={{
                    color: "brand.500",
                    textDecoration: "none",
                    transform: "translateX(4px)",
                  }}
                  transition="all 0.2s"
                  display="inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </GridItem>

          {/* Connect Section */}
          <GridItem>
            <VStack align={{ base: "center", lg: "flex-start" }} spacing={4}>
              <Heading
                fontSize="sm"
                fontWeight="600"
                color={headingColor}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Connect
              </Heading>

              <HStack spacing={3}>
                <Tooltip label="GitHub Profile" placement="top">
                  <IconButton
                    as="a"
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    icon={<FiGithub />}
                    variant="ghost"
                    size="lg"
                    fontSize="xl"
                    _hover={{
                      bg: iconHoverBg,
                      color: "brand.500",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                  />
                </Tooltip>

                <Tooltip label="LinkedIn Profile" placement="top">
                  <IconButton
                    as="a"
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    icon={<FiLinkedin />}
                    variant="ghost"
                    size="lg"
                    fontSize="xl"
                    _hover={{
                      bg: iconHoverBg,
                      color: "brand.500",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                  />
                </Tooltip>

                <Tooltip label="Send Email" placement="top">
                  <IconButton
                    as="a"
                    href={`mailto:${personalInfo.email}`}
                    aria-label="Email"
                    icon={<FiMail />}
                    variant="ghost"
                    size="lg"
                    fontSize="xl"
                    _hover={{
                      bg: iconHoverBg,
                      color: "brand.500",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                  />
                </Tooltip>
              </HStack>

              {/* Email Display */}
              <Link
                href={`mailto:${personalInfo.email}`}
                fontSize="sm"
                color={textColor}
                _hover={{ color: "brand.500", textDecoration: "underline" }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {personalInfo.email}
                <FiExternalLink size="12px" />
              </Link>

              {/* Back to Top Button */}
              <Button
                onClick={scrollToTop}
                leftIcon={<FiArrowUp />}
                size="sm"
                variant="outline"
                colorScheme="brand"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="0.3s"
              >
                Back to Top
              </Button>
            </VStack>
          </GridItem>
        </Grid>

        <Divider borderColor={borderColor} />

        {/* Bottom Footer */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          py={{ base: 6, md: 8 }}
          spacing={{ base: 4, md: 0 }}
        >
          <Text
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="500"
            textAlign={{ base: "center", md: "left" }}
          >
            © {new Date().getFullYear()} {personalInfo.name}. All rights
            reserved.
          </Text>

          <HStack
            spacing={1}
            fontSize={{ base: "xs", md: "sm" }}
            color={textColor}
            flexWrap="wrap"
            justify="center"
          >
            <Text>Built with</Text>
            <Box as={FiHeart} color="red.400" />
            <Text>using</Text>
            <Text fontWeight="600" color="brand.500">
              React
            </Text>
            <Text>&</Text>
            <Text fontWeight="600" color="brand.500">
              Chakra UI
            </Text>
          </HStack>

          <HStack spacing={2} fontSize="xs" color={textColor}>
            <FiCode />
            <Text>Designed & Built by {personalInfo.name.split(" ")[0]}</Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
