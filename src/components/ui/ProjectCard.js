import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const ProjectCard = ({ project, delay = 0 }) => {
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      h="100%"
    >
      <Box
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.2)"
        borderRadius="xl"
        overflow="hidden"
        h="100%"
        display="flex"
        flexDirection="column"
        transition="all 0.3s ease-in-out"
        bg={useColorModeValue(
          "rgba(255, 255, 255, 0.35)",
          "rgba(17, 34, 64, 0.35)"
        )}
        backdropFilter="blur(14px)"
        boxShadow="0 4px 30px rgba(0,0,0,0.1)"
        _hover={{
          transform: "translateY(-6px)",
          shadow: "xl",
          borderColor: "rgba(255,255,255,0.45)",
        }}
      >
        {/* Image */}
        <Box
          position="relative"
          overflow="hidden"
          role="group"
          h={{ base: "180px", md: "200px" }}
          flexShrink={0}
        >
          <LazyLoadImage
            src={project.image}
            alt={project.title}
            effect="blur"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            className="group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <Flex
            position="absolute"
            inset="0"
            bg="blackAlpha.700"
            opacity="0"
            transition="opacity 0.3s ease"
            _groupHover={{ opacity: 1 }}
            align="center"
            justify="center"
            gap={{ base: 2, md: 4 }}
          >
            {project.github && (
              <Button
                as="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FiGithub />}
                colorScheme="whiteAlpha"
                size={{ base: "sm", md: "md" }}
              >
                Code
              </Button>
            )}
            {project.website && (
              <Button
                as="a"
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FiExternalLink />}
                colorScheme="whiteAlpha"
                size={{ base: "sm", md: "md" }}
              >
                Visit
              </Button>
            )}
          </Flex>
        </Box>

        {/* Content */}
        <Flex direction="column" p={{ base: 4, md: 5 }} flex="1" minH="0">
          {/* Title */}
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            mb={2}
            color={textPrimary}
            fontWeight="semibold"
            lineHeight="short"
            noOfLines={2}
            minH={{ base: "2rem", md: "2rem" }}
          >
            {project.title}
          </Heading>

          {/* Description */}
          <Text
            color={textSecondary}
            fontSize={{ base: "sm", md: "md" }}
            mb={4}
            lineHeight="1.7"
            noOfLines={3}
            minH={{ base: "4rem", md: "4.5rem" }}
          >
            {project.description}
          </Text>

          {/* Tags */}
          <Box mb={4} minH="2rem">
            <HStack spacing={2} flexWrap="wrap">
              {project.tags.slice(0, 5).map((tag, i) => (
                <Badge
                  key={i}
                  colorScheme="gray.100"
                  variant="subtle"
                  fontSize={{ base: "xs", md: "sm" }}
                  px={2.5}
                  py="3px"
                  borderRadius="md"
                  bg="rgba(255,255,255,0.25)"
                  backdropFilter="blur(6px)"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 5 && (
                <Badge
                  colorScheme="gray"
                  variant="subtle"
                  fontSize={{ base: "xs", md: "sm" }}
                  px={2.5}
                  py="3px"
                  borderRadius="md"
                  bg="rgba(255,255,255,0.25)"
                  backdropFilter="blur(6px)"
                >
                  +{project.tags.length - 5}
                </Badge>
              )}
            </HStack>
          </Box>

          {/* Action Buttons */}
          <HStack spacing={3} mt="auto" flexWrap="wrap">
            {project.github && (
              <Button
                as="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                size={{ base: "sm", md: "md" }}
                variant="outline"
                leftIcon={<FiGithub />}
                colorScheme="brand"
                fontSize={{ base: "xs", md: "sm" }}
              >
                GitHub
              </Button>
            )}
            {project.website && (
              <Button
                as="a"
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                size={{ base: "sm", md: "md" }}
                variant="outline"
                leftIcon={<FiExternalLink />}
                colorScheme="brand"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Visit Website
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default ProjectCard;
