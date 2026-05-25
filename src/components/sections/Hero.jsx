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
  SimpleGrid,
} from "@chakra-ui/react";
import { Briefcase, Code2, MapPin, Mail, Server, ShieldCheck } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Hero = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useRetroColors();
  const topSkills = ["Spring Boot", "Django REST", "React", "Next.js", "GCP"];

  return (
    <RetroPanel id="hero" bodyProps={{ p: 0 }}>
      <Box
        minH={{ base: "132px", md: "170px" }}
        borderBottom="1px solid"
        borderColor={colors.border}
        bg={colors.headerBg}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          opacity={0.9}
          bgImage="
            linear-gradient(90deg, rgba(18,63,108,.90), rgba(29,95,159,.72)),
            repeating-linear-gradient(0deg, rgba(255,255,255,.16) 0, rgba(255,255,255,.16) 1px, transparent 1px, transparent 7px),
            repeating-linear-gradient(90deg, rgba(255,255,255,.10) 0, rgba(255,255,255,.10) 1px, transparent 1px, transparent 9px)
          "
        />
        <Flex
          position="relative"
          zIndex={1}
          h="100%"
          minH={{ base: "132px", md: "150px" }}
          align="end"
          p={{ base: 3, md: 4 }}
        >
          <Box color="white" maxW="780px">
            <HStack spacing={2} mb={2} flexWrap="wrap">
              <RetroBadge tone="green">Available for Collaboration</RetroBadge>
            </HStack>
            <Heading
              as="h1"
              fontSize={{ base: "24px", md: "34px" }}
              lineHeight="1.08"
            >
              {personalInfo.name || "Aurio Rajaa"}
            </Heading>
            <Text
              fontSize={{ base: "13px", md: "15px" }}
              mt={1}
              color="rgba(255,255,255,.84)"
            >
              {personalInfo.title || "Software Engineer"} / Backend, cloud, and
              full-stack systems
            </Text>
          </Box>
        </Flex>
      </Box>

      <Flex
        p={{ base: 3, md: 4 }}
        gap={4}
        direction={{ base: "column", md: "row" }}
        align="stretch"
      >
        <Box
          display={{ base: "block", lg: "none" }}
          w={{ base: "188px", md: "168px" }}
          h={{ base: "188px", md: "168px" }}
          flexShrink={0}
          border="1px solid"
          borderColor={colors.border}
          bg={colors.panelAlt}
          p={1}
          alignSelf={{ base: "center", md: "flex-start" }}
        >
          <Link
            href="/profilepic.png"
            isExternal
            _hover={{ textDecoration: "none" }}
          >
            <Image
              src="/profilepic.png"
              alt={personalInfo.name || "Aurio Rajaa"}
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center"
            />
          </Link>
        </Box>

        <VStack align="stretch" spacing={3} flex={1} minW={0}>
          <Text
            fontSize="13px"
            color={colors.text}
            lineHeight="1.6"
            overflowWrap="anywhere"
          >
            {personalInfo.bio}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
            <HStack
              border="1px solid"
              borderColor={colors.borderSoft}
              bg={colors.panelAlt}
              p={2}
            >
              <Briefcase size={14} color={colors.link} />
              <Text fontSize="12px" color={colors.text} noOfLines={1}>
                {personalInfo.title}
              </Text>
            </HStack>
            <HStack
              border="1px solid"
              borderColor={colors.borderSoft}
              bg={colors.panelAlt}
              p={2}
            >
              <MapPin size={14} color={colors.link} />
              <Text fontSize="12px" color={colors.text} noOfLines={1}>
                {personalInfo.location}
              </Text>
            </HStack>
            <HStack
              border="1px solid"
              borderColor={colors.borderSoft}
              bg={colors.panelAlt}
              p={2}
            >
              <Mail size={14} color={colors.link} />
              <Link
                href={`mailto:${personalInfo.email}`}
                fontSize="12px"
                fontWeight="bold"
                noOfLines={1}
              >
                {personalInfo.email}
              </Link>
            </HStack>
          </SimpleGrid>

          <HStack spacing={1} flexWrap="wrap">
            {topSkills.map((skill) => (
              <RetroBadge key={skill}>{skill}</RetroBadge>
            ))}
          </HStack>
        </VStack>
      </Flex>
    </RetroPanel>
  );
};

export default Hero;
