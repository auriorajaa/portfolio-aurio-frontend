import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getAllArticles } from "../../services/articleService";
import { StudioSection, useStudioColors } from "../public/studio";

const withTimeout = (promise, timeoutMs = 4500) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Article load timed out")), timeoutMs),
    ),
  ]);

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const colors = useStudioColors();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const allArticles = await withTimeout(getAllArticles());
      const publicArticles = allArticles
        .filter((article) => article.visibility === "public")
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setArticles(publicArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudioSection id="articles" title="Writing">
        <Text fontSize="16px" color={colors.muted}>
          Loading articles…
        </Text>
      </StudioSection>
    );
  }

  if (articles.length === 0) return null;

  const categories = [
    "ALL",
    ...new Set(articles.map((a) => a.categoryLabel).filter(Boolean)),
  ].slice(0, 5);

  const filteredArticles =
    filter === "ALL"
      ? articles
      : articles.filter((article) => article.categoryLabel === filter);

  const visibleArticles = filteredArticles.slice(0, 6);
  const leadArticle = visibleArticles[0];
  const listArticles = visibleArticles.slice(1);

  return (
    <StudioSection id="articles" title="Writing">
      {/* Category filter */}
      <Flex gap={2} flexWrap="wrap" mb={{ base: 7, md: 9 }}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "classic" : "classicOutline"}
            size="sm"
            fontSize="15px"
            h="36px"
            px={4}
            onClick={() => setFilter(category)}
          >
            {category.toUpperCase()}
          </Button>
        ))}
      </Flex>

      {/* Lead essay — text only, wide */}
      {leadArticle && (
        <Box
          as="article"
          role="group"
          borderTop="4px solid"
          borderColor={colors.heading}
          pt={6}
          pb={2}
          mb={{ base: 9, md: 11 }}
          cursor="pointer"
          transition="background-color .16s ease"
          _hover={{ bg: "#f8fafd" }}
          onClick={() => navigate(`/article/${leadArticle.slug}`)}
        >
          <Text
            fontSize="12px"
            fontWeight="800"
            letterSpacing=".16em"
            textTransform="uppercase"
            color={colors.accent}
          >
            {leadArticle.categoryLabel}
          </Text>
          <Text
            as="h3"
            fontSize={{ base: "26px", md: "34px" }}
            fontWeight="700"
            lineHeight="1.3"
            color={colors.heading}
            mt={2}
            maxW="1050px"
            noOfLines={2}
            transition="color .15s ease"
            _groupHover={{ color: colors.accent }}
          >
            {leadArticle.title}
          </Text>
          {leadArticle.excerpt && (
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              lineHeight="1.8"
              color={colors.text}
              mt={3}
              maxW="950px"
              noOfLines={2}
            >
              {leadArticle.excerpt}
            </Text>
          )}
          <Text fontSize="14px" color={colors.muted} mt={4}>
            {[formatDate(leadArticle.date), leadArticle.readTime]
              .filter(Boolean)
              .join(" · ")}
            <Text as="span" fontWeight="700" color={colors.accent} ml={2}>
              Read more →
            </Text>
          </Text>

          {leadArticle.image && (
            <Box
              mt={5}
              bg="#ffffff"
              border="1px solid"
              borderColor="#b9c9da"
              p="10px"
              boxShadow="0 3px 10px rgba(18,58,99,0.12)"
            >
              <img
                src={leadArticle.image}
                alt={leadArticle.title}
                loading="lazy"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 6",
                  objectFit: "cover",
                  border: "1px solid #c9d6e4",
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Column grid — text only */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
        gap={{ base: 7, md: 9 }}
      >
        {listArticles.map((article) => (
          <Box
            key={article.id}
            as="article"
            role="group"
            borderTop="3px solid"
            borderColor="#c6d7e8"
            pt={5}
            cursor="pointer"
            transition="background-color .16s ease"
            _hover={{ bg: "#f8fafd" }}
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <Text
              fontSize="12px"
              fontWeight="800"
              letterSpacing=".16em"
              textTransform="uppercase"
              color={colors.accent}
            >
              {article.categoryLabel}
            </Text>

            <Flex gap={4} mt={2} align="flex-start">
              <Box flex="1" minW={0}>
                <Text
                  as="h3"
                  fontSize={{ base: "19px", md: "21px" }}
                  fontWeight="700"
                  lineHeight="1.4"
                  color={colors.heading}
                  noOfLines={2}
                  transition="color .15s ease"
                  _groupHover={{ color: colors.accent }}
                >
                  {article.title}
                </Text>
                {article.excerpt && (
                  <Text
                    fontSize="15px"
                    lineHeight="1.75"
                    color={colors.text}
                    mt={2}
                    noOfLines={3}
                  >
                    {article.excerpt}
                  </Text>
                )}
              </Box>

              {article.image && (
                <Box
                  w="108px"
                  h="108px"
                  flexShrink={0}
                  display={{ base: "none", sm: "block" }}
                  bg="#ffffff"
                  border="1px solid"
                  borderColor="#b9c9da"
                  p="4px"
                  boxShadow="0 1px 4px rgba(18,58,99,0.12)"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border: "1px solid #c9d6e4",
                    }}
                  />
                </Box>
              )}
            </Flex>

            <Text fontSize="13px" color={colors.muted} mt={3}>
              {[formatDate(article.date), article.readTime]
                .filter(Boolean)
                .join(" · ")}
              <Text as="span" fontWeight="700" color={colors.accent} ml={2}>
                Read more →
              </Text>
            </Text>
          </Box>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Box py={12} textAlign="center">
          <Text fontSize="16px" color={colors.muted}>
            No articles in this category yet.
          </Text>
        </Box>
      )}
    </StudioSection>
  );
};

export default Articles;
