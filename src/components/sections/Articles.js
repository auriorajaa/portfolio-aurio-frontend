// src/components/sections/Articles.js
import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Button,
  SimpleGrid,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { categories, articlesData } from "../../data/articlesData";
import RegularArticleCard from "../ui/article/RegularArticleCard";
import TextOnlyArticleCard from "../ui/article/TextOnlyArticleCard";

const MotionBox = motion(Box);

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMore, setShowMore] = useState(false);

  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  const floatingAnimation = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  `;

  const blobOpacity = useColorModeValue(0.35, 0.18);

  const FEATURED_COUNT = 3;
  const ADDITIONAL_COUNT = 5;

  // Filter articles based on category
  const filteredArticles =
    activeCategory === "all"
      ? articlesData
      : articlesData.filter((article) => article.category === activeCategory);

  const featuredArticles = filteredArticles.slice(0, FEATURED_COUNT);
  const additionalArticles = filteredArticles.slice(
    FEATURED_COUNT,
    FEATURED_COUNT + ADDITIONAL_COUNT
  );

  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
    setShowMore(false);
    // Scroll to top of articles section
    setTimeout(() => {
      document
        .getElementById("articles")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
    // Scroll back to top of articles section
    setTimeout(() => {
      document
        .getElementById("articles")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

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
        top="10%"
        right="5%"
        w={{ base: "250px", md: "400px" }}
        h={{ base: "250px", md: "400px" }}
        bgGradient="radial(circle, blue.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(80px)"
        animation={`${floatingAnimation} 13s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="10%"
        w={{ base: "200px", md: "350px" }}
        h={{ base: "200px", md: "350px" }}
        bgGradient="radial(circle, teal.200 0%, transparent 70%)"
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(70px)"
        animation={`${floatingAnimation} 17s ease-in-out infinite reverse`}
      />

      {/* Coming Soon Overlay - Currently disabled for testing */}
      {/* Uncomment the Box below to show the "Under Construction" overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={useColorModeValue("blackAlpha.500", "blackAlpha.600")}
        backdropFilter="blur(5px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={10}
      >
        <VStack spacing={6} textAlign="center" px={4}>
          <Box
            bg="yellow.400"
            color="gray.900"
            px={8}
            py={3}
            fontWeight="black"
            fontSize={{ base: "lg", md: "2xl" }}
            letterSpacing="wider"
            textTransform="uppercase"
            transform="rotate(-2deg)"
            borderWidth="3px"
            borderColor="gray.900"
            borderStyle="dashed"
            boxShadow="xl"
          >
            🚧 Under Construction 🚧
          </Box>

          <Heading
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            color="white"
            fontWeight="bold"
          >
            Coming Soon!
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.300"
            maxW="500px"
          >
            I'm currently working on bringing you amazing content. Stay tuned
            for insightful articles about web development, software engineering,
            and technology!
          </Text>

          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.400"
            fontStyle="italic"
          >
            Articles will be available soon ✨
          </Text>
        </VStack>
      </Box>

      <Container
        maxW="container.xl"
        px={{
          base: 4,
          sm: 6,
          md: 10,
          lg: 16,
          xl: 18,
        }}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header */}
          <VStack spacing={4} textAlign="center" pt={{ base: 4, md: 6 }}>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              color={textPrimary}
              fontWeight="bold"
            >
              Articles & Insights
            </Heading>
            <Text
              color={textSecondary}
              maxW="700px"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
            >
              Exploring technology, development, and everything in between
            </Text>
          </VStack>

          {/* Category Tabs */}
          <HStack
            spacing={{ base: 2, md: 3 }}
            wrap="wrap"
            justify="center"
            pt={2}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.slug ? "solid" : "outline"}
                colorScheme="brand"
                onClick={() => handleCategoryChange(category.slug)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 5, md: 7 }}
                py={{ base: 4, md: 5 }}
                borderRadius="full"
                transition="all 0.2s ease-in-out"
              >
                {category.name}
              </Button>
            ))}
          </HStack>

          {/* Featured Articles (3 cards with images) */}
          <Box w="100%" position="relative">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 8, md: 10, lg: 12 }}
              w="100%"
              alignItems="stretch"
            >
              {featuredArticles.map((article, i) => (
                <RegularArticleCard
                  key={article.id}
                  article={article}
                  delay={i * 0.1}
                />
              ))}
            </SimpleGrid>

            {/* Additional Articles (text-only, editorial style) */}
            {showMore && additionalArticles.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                mt={{ base: 12, md: 16 }}
              >
                {/* Section Divider */}
                <Box mb={{ base: 8, md: 10 }}>
                  <Heading
                    as="h3"
                    fontSize={{ base: "xl", md: "2xl" }}
                    color={textPrimary}
                    fontWeight="bold"
                    mb={2}
                    letterSpacing="-0.02em"
                  >
                    More Articles
                  </Heading>
                  <Text
                    color={textSecondary}
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    Continue exploring our latest insights and stories
                  </Text>
                </Box>

                {/* Text-only Articles in Single Column */}
                <VStack spacing={0} align="stretch" w="100%">
                  {additionalArticles.map((article, i) => (
                    <TextOnlyArticleCard
                      key={article.id}
                      article={article}
                      delay={i * 0.05}
                    />
                  ))}
                </VStack>
              </MotionBox>
            )}

            {/* Show More / Show Less Button */}
            {additionalArticles.length > 0 && (
              <HStack justify="center" mt={{ base: 8, md: 10 }}>
                <Button
                  colorScheme="brand"
                  size="md"
                  onClick={showMore ? handleShowLess : handleShowMore}
                  borderRadius="full"
                  px={{ base: 6, sm: 8 }}
                  py={{ base: 5, sm: 6 }}
                >
                  {showMore
                    ? "Show Less"
                    : `Show More (${additionalArticles.length} more)`}
                </Button>
              </HStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Articles;
