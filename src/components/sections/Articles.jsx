import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Clock } from "lucide-react";
import { getAllArticles } from "../../services/articleService";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const withTimeout = (promise, timeoutMs = 4500) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Article load timed out")), timeoutMs),
    ),
  ]);

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const colors = useRetroColors();

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

  const categories = ["ALL", ...new Set(articles.map((a) => a.categoryLabel).filter(Boolean))].slice(0, 6);
  const filteredArticles =
    filter === "ALL" ? articles : articles.filter((article) => article.categoryLabel === filter);
  const visibleArticles = filteredArticles.slice(0, 6);

  if (loading) {
    return (
      <RetroPanel id="articles" title="Articles" icon={BookOpen} bodyProps={{ p: 8 }}>
        <Center>
          <Spinner size="md" color="retro.blue" thickness="2px" />
        </Center>
      </RetroPanel>
    );
  }

  if (articles.length === 0) return null;

  return (
    <RetroPanel
      id="articles"
      title="Articles & Field Notes"
      icon={BookOpen}
      headerRight={<RetroBadge tone="green">{articles.length} public</RetroBadge>}
      bodyProps={{ p: 0 }}
    >
      <Box px={3} py={2} borderBottom="1px solid" borderColor={colors.border}>
        <HStack spacing={2} flexWrap="wrap">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? "facebook" : "facebookGray"}
              onClick={() => setFilter(category)}
              fontSize="11px"
              h="24px"
              px={3}
            >
              {category.toUpperCase()}
            </Button>
          ))}
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
        {visibleArticles.map((article, idx) => (
          <Box
            key={article.id}
            p={3}
            borderRight={{ base: "none", lg: idx % 2 === 0 ? "1px solid" : "none" }}
            borderBottom="1px solid"
            borderColor={colors.borderSoft}
            bg={idx % 2 === 0 ? colors.panelBg : colors.panelAlt}
            cursor="pointer"
            _hover={{ bg: colors.paleBlue }}
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <Flex gap={3} align="start">
              {article.image && (
                <Box
                  w="88px"
                  h="68px"
                  flexShrink={0}
                  border="1px solid"
                  borderColor={colors.border}
                  overflow="hidden"
                  bg={colors.panelBg}
                >
                  <Image src={article.image} alt={article.title} w="100%" h="100%" objectFit="cover" />
                </Box>
              )}
              <VStack spacing={1} align="stretch" minW={0} flex={1}>
                <HStack spacing={1} flexWrap="wrap">
                  <RetroBadge>{article.categoryLabel}</RetroBadge>
                  {article.featured && (
                    <RetroBadge tone="amber">
                      <HStack spacing={1}>
                        <Text as="span">Featured</Text>
                      </HStack>
                    </RetroBadge>
                  )}
                </HStack>
                <Text fontSize="13px" fontWeight="bold" color={colors.link} noOfLines={2}>
                  {article.title}
                </Text>
                <Text fontSize="12px" color={colors.text} lineHeight="1.45" noOfLines={2}>
                  {article.excerpt}
                </Text>
                <HStack spacing={3} color={colors.muted}>
                  <HStack spacing={1}>
                    <Calendar size={10} />
                    <Text fontSize="10px">{new Date(article.date).toLocaleDateString()}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Clock size={10} />
                    <Text fontSize="10px">{article.readTime}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </RetroPanel>
  );
};

export default Articles;
