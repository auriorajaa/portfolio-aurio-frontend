import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";
import { articlesData } from "../../data/portfolioData";
import { keyframes } from "@chakra-ui/react";

const MotionBox = motion(Box);

const ArticleCard = ({ article }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
        transition="all 0.3s ease-in-out"
        height="100%"
        cursor="pointer"
      >
        <Heading
          as="h3"
          fontSize={{ base: "md", md: "lg" }}
          color={textPrimary}
          mb={{ base: 2, md: 3 }}
          fontWeight="bold"
        >
          {article.title}
        </Heading>

        <Text
          color={textSecondary}
          mb={{ base: 3, md: 4 }}
          noOfLines={3}
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="tall"
        >
          {article.excerpt}
        </Text>

        <HStack
          spacing={{ base: 3, md: 4 }}
          mb={{ base: 3, md: 4 }}
          color={textSecondary}
          fontSize={{ base: "xs", md: "sm" }}
          flexWrap="wrap"
        >
          <HStack>
            <FiCalendar />
            <Text>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </HStack>
          <HStack>
            <FiClock />
            <Text>{article.readTime}</Text>
          </HStack>
        </HStack>

        <HStack spacing={2} flexWrap="wrap">
          {article.tags.map((tag, index) => (
            <Badge
              key={index}
              colorScheme="brand"
              variant="subtle"
              fontSize={{ base: "2xs", md: "xs" }}
              mb={1}
            >
              {tag}
            </Badge>
          ))}
        </HStack>
      </Box>
    </MotionBox>
  );
};

const Articles = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

  const bgGradient = useColorModeValue(
    "linear(to-br, yellow.50, green.50, teal.50)",
    "linear(to-br, yellow.900, green.900, teal.900)"
  );

  return (
    <Box
      as="section"
      id="articles"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Blobs */}
      <Box
        position="absolute"
        top="12%"
        left="7%"
        w={{ base: "210px", md: "360px" }}
        h={{ base: "210px", md: "360px" }}
        bgGradient="radial(circle, green.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.4, 0.2)}
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
        opacity={useColorModeValue(0.4, 0.2)}
        borderRadius="full"
        filter="blur(68px)"
        animation={`${floatingAnimation} 18s ease-in-out infinite reverse`}
      />
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            textAlign="center"
            color={textPrimary}
            fontWeight="bold"
          >
            Latest Articles
          </Heading>
          <Text
            maxW="container.md"
            textAlign="center"
            color={textSecondary}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="tall"
            px={{ base: 4, md: 6, lg: 0 }}
          >
            Thoughts, tutorials, and insights about software development and
            technology.
          </Text>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            {articlesData.map((article, index) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </SimpleGrid>

          {/* Coming Soon Message */}
          <Box textAlign="center" py={{ base: 6, md: 8 }}>
            <Text color={textSecondary} fontSize={{ base: "md", md: "lg" }}>
              More articles coming soon...
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Articles;
