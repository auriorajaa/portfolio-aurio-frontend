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
        {/* Image - Fixed height */}
        <Box
          position="relative"
          overflow="hidden"
          role="group"
          h="200px"
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

        {/* Content - Fixed structure */}
        <Flex direction="column" p={5} flex="1" minH="0">
          {/* Title - Fixed height */}
          <Heading
            as="h3"
            fontSize="xl"
            mb={2}
            color={textPrimary}
            fontWeight="semibold"
            lineHeight="1.3"
            noOfLines={2}
            h="2.6em"
            overflow="hidden"
          >
            {project.title}
          </Heading>

          {/* Description - Fixed height */}
          <Text
            color={textSecondary}
            fontSize="md"
            mb={4}
            lineHeight="1.6"
            noOfLines={3}
            h="4.8em"
            overflow="hidden"
          >
            {project.description}
          </Text>

          {/* Tags - Fixed height */}
          <Box mb={4} h="2.5em" overflow="hidden">
            <HStack spacing={2} flexWrap="wrap">
              {project.tags.slice(0, 3).map((tag, i) => (
                <Badge
                  key={i}
                  colorScheme="gray.100"
                  variant="subtle"
                  fontSize="xs"
                  px={2.5}
                  py="3px"
                  borderRadius="md"
                  bg="rgba(255,255,255,0.25)"
                  backdropFilter="blur(6px)"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge
                  colorScheme="gray"
                  variant="subtle"
                  fontSize="xs"
                  px={2.5}
                  py="3px"
                  borderRadius="md"
                  bg="rgba(255,255,255,0.25)"
                  backdropFilter="blur(6px)"
                >
                  +{project.tags.length - 3}
                </Badge>
              )}
            </HStack>
          </Box>

          {/* Action Buttons - Push to bottom */}
          <HStack spacing={3} mt="auto" pt={2}>
            {project.github && (
              <Button
                as="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                size="md"
                variant="outline"
                leftIcon={<FiGithub />}
                colorScheme="brand"
                fontSize="md"
                flex="1"
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
                size="md"
                variant="outline"
                leftIcon={<FiExternalLink />}
                colorScheme="brand"
                fontSize="md"
                flex="1"
              >
                Visit
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default ProjectCard;
