import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { MapPin, Mail, Briefcase } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Hero = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo;

  // Use theme colors
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const profileBorder = useColorModeValue("white", "#242526");
  const iconColor = useColorModeValue("#90949c", "#8a8d91");
  const lightIconColor = useColorModeValue("#4b4f56", "#b0b3b8");
  const linkColor = useColorModeValue("#385898", "#5b7ec8");

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="hero"
    >
      {/* Cover Photo */}
      <Box
        h="200px"
        bgImage="url('https://images.unsplash.com/photo-1704948079672-45dc21034083?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        position="relative"
        zIndex={1}
        borderTopRadius="2px"
      />

      {/* Profile Content */}
      <Box px={4} pb={4} position="relative">
        <Flex justify="space-between" align="flex-end" mt="-90px" mb={3}>
          {/* Profile Picture */}
          <Link
            href="/profilepic.jpg"
            isExternal
            _hover={{ textDecoration: "none" }}
          >
            <Box
              position="relative"
              zIndex={2}
              border={`4px solid ${profileBorder}`}
              borderRadius="2px"
              overflow="hidden"
              boxSize="168px"
              bg={cardBg}
              boxShadow="0 2px 4px rgba(0,0,0,0.35)"
              cursor="pointer"
            >
              <Image
                src="/profilepic.jpg"
                alt={personalInfo.name}
                w="100%"
                h="100%"
                objectFit="cover"
                transform="scale(2.30)"
                imageRendering="auto"
              />
            </Box>
          </Link>
        </Flex>

        {/* Name */}
        <Heading as="h1" fontSize="20px" fontWeight="bold" mb={1}>
          {personalInfo.name}
        </Heading>

        {/* Bio */}
        <Text fontSize="13px" mb={3} lineHeight="1.4">
          {personalInfo.bio}
        </Text>

        {/* Info */}
        <VStack spacing={2} align="stretch" mb={3}>
          <HStack spacing={2}>
            <Briefcase size={12} color={iconColor} />
            <Text fontSize="13px" color={lightIconColor}>
              {personalInfo.title}
            </Text>
          </HStack>

          <HStack spacing={2}>
            <MapPin size={12} color={iconColor} />
            <Text fontSize="13px" color={lightIconColor}>
              Lives in <strong>{personalInfo.location}</strong>
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Mail size={12} color={iconColor} />
            <Link
              href={`mailto:${personalInfo.email}`}
              fontSize="13px"
              color={linkColor}
            >
              {personalInfo.email}
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Hero;
