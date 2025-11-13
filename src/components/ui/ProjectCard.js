import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Button,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const ProjectCard = ({ project, delay = 0 }) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");

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
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        bg={cardBg}
        h="100%"
        display="flex"
        flexDirection="column"
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "translateY(-6px)",
          shadow: "xl",
          borderColor: "brand.500",
        }}
      >
        {/* Image */}
        <Box
          position="relative"
          overflow="hidden"
          role="group"
          h={{ base: "180px", md: "200px" }}
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
            {project.link && (
              <Button
                as="a"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FiExternalLink />}
                colorScheme="whiteAlpha"
                size={{ base: "sm", md: "md" }}
              >
                Demo
              </Button>
            )}
          </Flex>
        </Box>

        {/* Content */}
        <Flex direction="column" p={{ base: 4, md: 5 }} flex="1">
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            mb={2}
            color={textPrimary}
            fontWeight="semibold"
            lineHeight="short"
          >
            {project.title}
          </Heading>

          <Text
            color={textSecondary}
            fontSize={{ base: "sm", md: "md" }}
            mb={4}
            lineHeight="1.7"
            flex="1"
          >
            {project.description}
          </Text>

          {/* Tags */}
          <HStack spacing={2} flexWrap="wrap" mb={4}>
            {project.tags.map((tag, i) => (
              <Badge
                key={i}
                colorScheme="brand"
                variant="subtle"
                fontSize={{ base: "xs", md: "sm" }}
                px={2.5}
                py="3px"
                borderRadius="md"
              >
                {tag}
              </Badge>
            ))}
          </HStack>

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
            {project.link && (
              <Button
                as="a"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                size={{ base: "sm", md: "md" }}
                variant="outline"
                leftIcon={<FiExternalLink />}
                colorScheme="brand"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Demo
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default ProjectCard;
