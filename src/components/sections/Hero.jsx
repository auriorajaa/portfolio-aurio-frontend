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
} from "@chakra-ui/react";
import { MapPin, Mail, Briefcase } from "lucide-react";
import { personalInfo } from "../../data/portfolioData";

const Hero = () => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="#d3d6db"
      borderRadius="2px"
      mb={4}
      id="hero"
    >
      {/* Cover Photo */}
      <Box
        h="200px"
        bg="#3b5998"
        position="relative"
        zIndex={1}
        borderTopRadius="2px"
      />

      {/* Profile Content */}
      <Box px={4} pb={4} position="relative">
        <Flex
          justify="space-between"
          align="flex-end"
          mt="-90px"
          mb={3}
        >
          {/* Profile Picture */}
          <Link
            href="/profilepic.jpg"
            isExternal
            _hover={{ textDecoration: "none" }}
          >
            <Box
              position="relative"
              zIndex={2}
              border="4px solid white"
              borderRadius="2px"
              overflow="hidden"
              boxSize="168px"
              bg="white"
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

          {/* <Button variant="facebookGray" size="sm" mb={2}>
            View Full Profile
          </Button> */}
        </Flex>

        {/* Name */}
        <Heading
          as="h1"
          fontSize="20px"
          fontWeight="bold"
          color="#1c1e21"
          mb={1}
        >
          {personalInfo.name}
        </Heading>

        {/* Bio */}
        <Text fontSize="11px" color="#1c1e21" mb={3} lineHeight="1.4">
          {personalInfo.bio}
        </Text>

        {/* Info */}
        <VStack spacing={2} align="stretch" mb={3}>
          <HStack spacing={2}>
            <Briefcase size={12} color="#90949c" />
            <Text fontSize="11px" color="#4b4f56">
              {personalInfo.title}
            </Text>
          </HStack>

          <HStack spacing={2}>
            <MapPin size={12} color="#90949c" />
            <Text fontSize="11px" color="#4b4f56">
              Lives in{" "}
              <strong style={{ color: "#1c1e21" }}>
                {personalInfo.location}
              </strong>
            </Text>
          </HStack>

          <HStack spacing={2}>
            <Mail size={12} color="#90949c" />
            <Link
              href={`mailto:${personalInfo.email}`}
              fontSize="11px"
              color="#385898"
            >
              {personalInfo.email}
            </Link>
          </HStack>
        </VStack>

        {/* Actions */}
        {/* <Flex gap={2}>
          <Button variant="facebook" size="sm" flex={1}>
            Message
          </Button>
          <Button variant="facebookGray" size="sm" flex={1}>
            Add Friend
          </Button>
        </Flex> */}
      </Box>
    </Box>
  );
};

export default Hero;
