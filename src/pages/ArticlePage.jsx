// src/pages/ArticlePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Text,
  Image,
  Button,
  Spinner,
  Center,
  VStack,
  HStack,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Sparkles,
  Share2,
} from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { getArticleBySlug, getAllArticles } from "../services/articleService";

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareButtons, setShowShareButtons] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    loadArticle();
    // eslint-disable-next-line
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const [articleData, allArticles] = await Promise.all([
        getArticleBySlug(slug),
        getAllArticles(),
      ]);

      setArticle(articleData);

      if (articleData) {
        // Get related articles (same category or tags, excluding current)
        const related = allArticles
          .filter((a) => a.slug !== slug && a.visibility === "public")
          .filter((a) => {
            // Match by category or tags
            const sameCategory = a.category === articleData.category;
            const sharedTags = a.tags?.some((tag) =>
              articleData.tags?.includes(tag),
            );
            return sameCategory || sharedTags;
          })
          .slice(0, 5);

        // If not enough related, add recent articles
        if (related.length < 5) {
          const recentArticles = allArticles
            .filter(
              (a) =>
                a.slug !== slug &&
                a.visibility === "public" &&
                !related.find((r) => r.slug === a.slug),
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5 - related.length);

          setRelatedArticles([...related, ...recentArticles]);
        } else {
          setRelatedArticles(related);
        }
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#e9ebee" py={20}>
        <Center>
          <Spinner size="xl" color="facebook.blue" thickness="3px" />
        </Center>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box minH="100vh" bg="#e9ebee" py={20}>
        <Container maxW="1000px" px={{ base: 4, md: 6 }}>
          <Box
            bg="white"
            border="1px solid"
            borderColor="facebook.border"
            borderRadius="2px"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="16px" fontWeight="bold" color="facebook.text">
                Article Not Found
              </Text>
              <Text fontSize="12px" color="facebook.lightText">
                The article you're looking for doesn't exist or has been
                removed.
              </Text>
              <Button
                variant="facebook"
                onClick={() => navigate("/")}
                leftIcon={<ArrowLeft size={14} />}
                fontSize="11px"
                h="26px"
                px={4}
                mt={2}
              >
                Back to Portfolio
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#e9ebee" py={{ base: 4, md: 8 }}>
      {/* SEO Meta Tags */}
      {article && (
        <Helmet>
          <title>{article.title} - Aurio Rajaa</title>
          <meta name="description" content={article.excerpt} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:url" content={shareUrl} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.excerpt} />
          <meta property="og:image" content={article.image || ""} />
          <meta property="og:site_name" content="Aurio Rajaa Portfolio" />
          <meta property="article:author" content={article.author} />
          <meta property="article:published_time" content={article.date} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={shareUrl} />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={article.excerpt} />
          <meta name="twitter:image" content={article.image || ""} />
          <meta name="twitter:creator" content="@auriorajaa" />

          {/* Additional Meta Tags */}
          <meta name="author" content={article.author} />
          <meta name="keywords" content={article.tags?.join(", ")} />
        </Helmet>
      )}

      <Container maxW="1000px" px={{ base: 4, md: 6 }}>
        {/* Back Button */}
        <Button
          variant="facebookGray"
          onClick={() => navigate("/")}
          leftIcon={<ArrowLeft size={12} />}
          fontSize="10px"
          h="22px"
          px={3}
          mb={4}
        >
          Back to Portfolio
        </Button>

        {/* Main Layout - Two Columns */}
        <Flex gap={4} direction={{ base: "column", lg: "row" }}>
          {/* Main Article Column */}
          <Box flex="1" minW="0">
            {/* Article Container - Stacked Boxes Style */}
            <VStack spacing={0} align="stretch">
              {/* Header Box */}
              <Box
                bg="white"
                border="1px solid"
                borderColor="facebook.border"
                borderTopRadius="2px"
                px={{ base: 4, md: 5 }}
                py={3}
              >
                {/* Category and Featured Badge */}
                <HStack spacing={2} mb={2} flexWrap="wrap">
                  <Box
                    bg="facebook.paleBlue"
                    px={2}
                    py={1}
                    borderRadius="2px"
                    border="1px solid"
                    borderColor="facebook.border"
                  >
                    <Text
                      fontSize="10px"
                      color="facebook.blue"
                      fontWeight="bold"
                    >
                      {article.categoryLabel}
                    </Text>
                  </Box>
                  {article.featured && (
                    <HStack
                      spacing={1}
                      bg="#fff3cd"
                      px={2}
                      py={1}
                      borderRadius="2px"
                      border="1px solid #ffc107"
                    >
                      <Sparkles size={10} color="#856404" />
                      <Text fontSize="10px" color="#856404" fontWeight="bold">
                        FEATURED
                      </Text>
                    </HStack>
                  )}
                </HStack>

                {/* Article Title */}
                <Text
                  fontSize={{ base: "16px", md: "20px" }}
                  fontWeight="bold"
                  color="facebook.text"
                  lineHeight="1.3"
                  mb={3}
                >
                  {article.title}
                </Text>

                {/* Meta Information */}
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={{ base: 1.5, sm: 3 }}
                  fontSize="11px"
                  color="facebook.lightText"
                  flexWrap="wrap"
                >
                  <HStack spacing={1}>
                    <User size={11} />
                    <Text>{article.author}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Calendar size={11} />
                    <Text>{new Date(article.date).toLocaleDateString()}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Clock size={11} />
                    <Text>{article.readTime}</Text>
                  </HStack>
                </Flex>

                {/* Share Button */}
                <Box mt={3} position="relative">
                  <Button
                    variant="facebookGray"
                    leftIcon={<Share2 size={12} />}
                    onClick={() => setShowShareButtons(!showShareButtons)}
                    fontSize="10px"
                    h="24px"
                    px={3}
                  >
                    Share Article
                  </Button>

                  {/* Share Buttons Dropdown */}
                  {showShareButtons && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      mt={1}
                      bg="white"
                      border="1px solid"
                      borderColor="facebook.border"
                      borderRadius="2px"
                      p={2}
                      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
                      zIndex={10}
                    >
                      <HStack spacing={2}>
                        <Tooltip label="Share on Facebook" fontSize="10px">
                          <FacebookShareButton
                            url={shareUrl}
                            quote={article.title}
                          >
                            <FacebookIcon size={28} round />
                          </FacebookShareButton>
                        </Tooltip>
                        <Tooltip label="Share on Twitter" fontSize="10px">
                          <TwitterShareButton
                            url={shareUrl}
                            title={article.title}
                          >
                            <TwitterIcon size={28} round />
                          </TwitterShareButton>
                        </Tooltip>
                        <Tooltip label="Share on LinkedIn" fontSize="10px">
                          <LinkedinShareButton
                            url={shareUrl}
                            title={article.title}
                            summary={article.excerpt}
                          >
                            <LinkedinIcon size={28} round />
                          </LinkedinShareButton>
                        </Tooltip>
                        <Tooltip label="Share on WhatsApp" fontSize="10px">
                          <WhatsappShareButton
                            url={shareUrl}
                            title={article.title}
                          >
                            <WhatsappIcon size={28} round />
                          </WhatsappShareButton>
                        </Tooltip>
                      </HStack>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Image Box */}
              {article.image && (
                <Box
                  bg="white"
                  borderLeft="1px solid"
                  borderRight="1px solid"
                  borderColor="facebook.border"
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    w="100%"
                    maxH={{ base: "200px", md: "350px" }}
                    objectFit="cover"
                  />
                </Box>
              )}

              {/* Excerpt Box */}
              {article.excerpt && (
                <Box
                  bg="facebook.paleBlue"
                  borderLeft="1px solid"
                  borderRight="1px solid"
                  borderColor="facebook.border"
                  px={{ base: 4, md: 5 }}
                  py={3}
                >
                  <Text
                    fontSize="12px"
                    color="facebook.text"
                    fontStyle="italic"
                    lineHeight="1.6"
                  >
                    {article.excerpt}
                  </Text>
                </Box>
              )}

              {/* Tags Box */}
              {article.tags && article.tags.length > 0 && (
                <Box
                  bg="white"
                  borderLeft="1px solid"
                  borderRight="1px solid"
                  borderColor="facebook.border"
                  px={{ base: 4, md: 5 }}
                  py={2}
                >
                  <HStack spacing={2} flexWrap="wrap">
                    {article.tags.map((tag) => (
                      <HStack key={tag} spacing={1}>
                        <Tag size={9} color="#90949c" />
                        <Text fontSize="10px" color="facebook.lightText">
                          {tag}
                        </Text>
                      </HStack>
                    ))}
                  </HStack>
                </Box>
              )}

              {/* Content Box */}
              <Box
                bg="white"
                border="1px solid"
                borderColor="facebook.border"
                borderBottomRadius="2px"
                px={{ base: 4, md: 5 }}
                py={{ base: 4, md: 5 }}
                className="article-content"
                sx={{
                  // Paragraphs
                  "& p": {
                    mb: 3,
                    lineHeight: "1.65",
                    fontSize: { base: "13px", md: "14px" },
                    color: "facebook.text",
                  },

                  // Headings
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    fontWeight: "bold",
                    color: "facebook.text",
                    mb: 2,
                    mt: 4,
                    lineHeight: "1.3",
                  },
                  "& h1": { fontSize: { base: "18px", md: "22px" } },
                  "& h2": { fontSize: { base: "16px", md: "18px" } },
                  "& h3": { fontSize: { base: "15px", md: "16px" } },
                  "& h4": { fontSize: { base: "14px", md: "15px" } },

                  // Lists
                  "& ul, & ol": {
                    pl: { base: 5, md: 6 },
                    mb: 3,
                  },
                  "& li": {
                    mb: 1.5,
                    lineHeight: "1.6",
                    fontSize: { base: "13px", md: "14px" },
                  },

                  // Links
                  "& a": {
                    color: "facebook.linkBlue",
                    textDecoration: "underline",
                    _hover: {
                      color: "facebook.darkBlue",
                    },
                  },

                  // Blockquotes
                  "& blockquote": {
                    borderLeft: "3px solid",
                    borderColor: "facebook.blue",
                    pl: 3,
                    py: 2,
                    my: 3,
                    ml: 0,
                    fontStyle: "italic",
                    bg: "facebook.paleBlue",
                    fontSize: { base: "12px", md: "13px" },
                  },

                  // Images
                  "& img": {
                    maxW: "100%",
                    h: "auto",
                    border: "1px solid",
                    borderColor: "facebook.border",
                    my: 3,
                  },

                  // Code
                  "& code": {
                    bg: "#f6f7f9",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.9em",
                    fontFamily: "'Courier New', monospace",
                    color: "#c7254e",
                    border: "1px solid #e1e4e8",
                  },

                  "& pre": {
                    bg: "#2d2d2d",
                    color: "#f8f8f2",
                    p: 3,
                    overflowX: "auto",
                    mb: 3,
                    border: "1px solid",
                    borderColor: "facebook.border",
                    fontSize: { base: "11px", md: "12px" },
                    "& code": {
                      bg: "transparent",
                      color: "inherit",
                      border: "none",
                      p: 0,
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </VStack>

            {/* Bottom Navigation */}
            <Box mt={4}>
              <Button
                variant="facebook"
                onClick={() => navigate("/")}
                leftIcon={<ArrowLeft size={14} />}
                fontSize="11px"
                h="26px"
                px={4}
                w={{ base: "100%", sm: "auto" }}
              >
                Back to Portfolio
              </Button>
            </Box>
          </Box>

          {/* Sidebar - Related Articles */}
          <Box w={{ base: "100%", lg: "280px" }} flexShrink={0}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="facebook.border"
              borderRadius="2px"
              position={{ lg: "sticky" }}
              top={{ lg: "20px" }}
            >
              {/* Sidebar Header */}
              <Box
                borderBottom="1px solid"
                borderColor="facebook.border"
                px={3}
                py={2}
                bg="facebook.gray"
              >
                <Text fontSize="12px" fontWeight="bold" color="facebook.text">
                  Related Articles
                </Text>
              </Box>

              {/* Related Articles List */}
              <VStack spacing={0} align="stretch">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((related, idx) => (
                    <Box
                      key={related.id}
                      px={3}
                      py={2}
                      borderBottom={
                        idx !== relatedArticles.length - 1
                          ? "1px solid"
                          : "none"
                      }
                      borderColor="facebook.border"
                      cursor="pointer"
                      transition="background 0.2s"
                      _hover={{ bg: "facebook.paleBlue" }}
                      onClick={() => navigate(`/article/${related.slug}`)}
                    >
                      <HStack spacing={2} align="start">
                        {related.image && (
                          <Box
                            w="50px"
                            h="50px"
                            flexShrink={0}
                            border="1px solid"
                            borderColor="facebook.border"
                            overflow="hidden"
                          >
                            <Image
                              src={related.image}
                              alt={related.title}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          </Box>
                        )}
                        <VStack spacing={0.5} align="start" flex="1" minW="0">
                          <Text
                            fontSize="11px"
                            fontWeight="bold"
                            color="facebook.blue"
                            noOfLines={2}
                            lineHeight="1.3"
                          >
                            {related.title}
                          </Text>
                          <HStack
                            spacing={1}
                            fontSize="9px"
                            color="facebook.lightText"
                          >
                            <Text>
                              {new Date(related.date).toLocaleDateString()}
                            </Text>
                            <Text>•</Text>
                            <Text>{related.readTime}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  ))
                ) : (
                  <Box px={3} py={4} textAlign="center">
                    <Text fontSize="11px" color="facebook.lightText">
                      No related articles found
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default ArticlePage;
