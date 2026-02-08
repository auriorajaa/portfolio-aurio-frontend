// src/components/Articles.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  Button,
  HStack,
  VStack,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { getAllArticles } from "../../services/articleService";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const allArticles = await getAllArticles();

      // ✅ Hanya tampilkan artikel dengan visibility = "public"
      // (draft & private tidak muncul di halaman publik)
      const publicArticles = allArticles.filter(
        (article) => article.visibility === "public",
      );

      setArticles(publicArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories dynamically (hanya dari public articles)
  const allCategories = [...new Set(articles.map((a) => a.categoryLabel))];
  const categories = ["ALL", ...allCategories];
  const essentialCategories = categories.slice(0, 4); // max 4 filter tabs

  const filteredArticles =
    filter === "ALL"
      ? articles
      : articles.filter((a) => a.categoryLabel === filter);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  // Reset ke halaman 1 saat filter berubah
  const handleFilterChange = (category) => {
    setFilter(category);
    setCurrentPage(1);
  };

  const handleArticleClick = (slug) => {
    navigate(`/article/${slug}`);
  };

  if (loading) {
    return (
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2px"
        mb={4}
        id="articles"
      >
        <Box
          borderBottom="1px solid"
          borderColor={borderColor}
          px={3}
          py={2}
          bg={grayBg}
        >
          <Flex align="center" gap={2}>
            <BookOpen size={14} color={iconColor} />
            <Text fontSize="14px" fontWeight="bold" color={textColor}>
              Articles
            </Text>
          </Flex>
        </Box>
        <Center py={10}>
          <Spinner size="md" color="facebook.blue" thickness="2px" />
        </Center>
      </Box>
    );
  }

  if (articles.length === 0) {
    return null; // tidak ada artikel public → tidak tampilkan section
  }

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="articles"
    >
      {/* Section Header */}
      <Box
        borderBottom="1px solid"
        borderColor={borderColor}
        px={3}
        py={2}
        bg={grayBg}
      >
        <Flex align="center" gap={2} mb={2}>
          <BookOpen size={14} color={iconColor} />
          <Text fontSize="14px" fontWeight="bold" color={textColor}>
            Articles
          </Text>
        </Flex>

        {/* Filter Tabs */}
        <HStack spacing={2} flexWrap="wrap">
          {essentialCategories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? "facebook" : "facebookGray"}
              onClick={() => handleFilterChange(category)}
              fontSize="12px"
              h="22px"
              px={3}
            >
              {category.toUpperCase()}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Articles Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
        {currentArticles.map((article, idx) => (
          <Box
            key={article.id}
            p={3}
            borderRight={{
              base: "none",
              md: idx % 2 === 0 ? "1px solid lightgray" : "none",
            }}
            borderBottom="1px solid"
            borderColor={borderColor}
            transition="all 0.15s ease"
            _hover={{
              transform: "translateX(-2px)",
            }}
            cursor="pointer"
            onClick={() => handleArticleClick(article.slug)}
          >
            {/* Article Image */}
            {article.image && (
              <Box
                border="1px solid"
                borderColor={borderColor}
                mb={2}
                overflow="hidden"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  w="100%"
                  h="150px"
                  objectFit="cover"
                />
              </Box>
            )}

            {/* Article Info */}
            <VStack spacing={1} align="stretch">
              {/* Category Badge */}
              <HStack spacing={2}>
                <Box
                  bg="facebook.paleBlue"
                  px={2}
                  py={0.5}
                  borderRadius="2px"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontSize="12px" color="facebook.blue" fontWeight="bold">
                    {article.categoryLabel}
                  </Text>
                </Box>
                {article.featured && (
                  <HStack
                    spacing={0.5}
                    bg="#fff3cd"
                    px={2}
                    py={0.5}
                    borderRadius="2px"
                    border="1px solid #ffc107"
                  >
                    <Sparkles size={9} color="#856404" />
                    <Text fontSize="12px" color="#856404" fontWeight="bold">
                      FEATURED
                    </Text>
                  </HStack>
                )}
              </HStack>

              <Text fontSize="14px" fontWeight="bold" color={textColor}>
                {article.title}
              </Text>
              <Text
                fontSize="13px"
                color={lightTextColor}
                lineHeight="1.4"
                noOfLines={2}
              >
                {article.excerpt}
              </Text>

              {/* Meta Info */}
              <HStack spacing={3} pt={1}>
                <HStack spacing={1}>
                  <Calendar size={10} color="#90949c" />
                  <Text fontSize="12px" color={lightTextColor}>
                    {new Date(article.date).toLocaleDateString()}
                  </Text>
                </HStack>
                <HStack spacing={1}>
                  <Clock size={10} color="#90949c" />
                  <Text fontSize="12px" color={lightTextColor}>
                    {article.readTime}
                  </Text>
                </HStack>
              </HStack>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <HStack spacing={1} pt={1}>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Text key={tag} fontSize="9px" color="facebook.lightText">
                      #{tag}
                    </Text>
                  ))}
                </HStack>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          borderTop="1px solid"
          borderColor={borderColor}
          px={3}
          py={2}
          bg={grayBg}
        >
          <Flex justify="center" align="center" gap={3}>
            <Button
              size="sm"
              variant="facebookGray"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
              fontSize="12px"
              h="22px"
              px={2}
            >
              <ChevronLeft size={12} />
            </Button>

            <Text fontSize="13px" color={textColor}>
              Page {currentPage} of {totalPages}
            </Text>

            <Button
              size="sm"
              variant="facebookGray"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              isDisabled={currentPage === totalPages}
              fontSize="12px"
              h="22px"
              px={2}
            >
              <ChevronRight size={12} />
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Articles;
