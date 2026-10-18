// src/pages/ArticlePage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Button, Center, Container, Flex, Grid, Link, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import Header from "../components/layout/Header";
import { StudioPill, useStudioColors } from "../components/public/studio";
import { getArticleBySlug, getAllArticles } from "../services/articleService";
import {
  DEFAULT_AUTHOR,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  createArticleSchema,
  createBreadcrumbSchema,
  truncate,
} from "../utils/seo";

const withTimeout = (promise, ms = 4500) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Article load timed out")), ms)
    ),
  ]);

const ArticlePage = ({ isDownloading, handleDownload }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const colors = useStudioColors();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = absoluteUrl(`/article/${slug}`);

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      const [articleData, allArticles] = await withTimeout(
        Promise.all([getArticleBySlug(slug), getAllArticles()])
      );
      setArticle(articleData);
      if (articleData) {
        const related = allArticles
          .filter((a) => a.slug !== slug && a.visibility === "public")
          .filter(
            (a) =>
              a.category === articleData.category ||
              a.tags?.some((t) => articleData.tags?.includes(t))
          )
          .slice(0, 4);
        const fill = allArticles
          .filter(
            (a) =>
              a.slug !== slug &&
              a.visibility === "public" &&
              !related.find((r) => r.slug === a.slug)
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4 - related.length);
        setRelatedArticles([...related, ...fill]);
      }
    } catch (e) {
      console.error("Error loading article:", e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadArticle();
  }, [slug, loadArticle]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy link:", shareUrl);
    }
  };

  const shareLinks = [
    {
      label: "Twitter / X",
      icon: <Twitter size={14} />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || "")}`,
    },
    {
      label: "Facebook",
      icon: <Facebook size={14} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: <Linkedin size={14} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const articleTitle = article ? `${article.title} | ${DEFAULT_AUTHOR}` : `Article not found | ${SITE_NAME}`;
  const articleDescription = article
    ? truncate(article.excerpt || article.description, 155)
    : "This article could not be found in Aurio Rajaa's portfolio.";
  const articleImage = absoluteUrl(article?.image || DEFAULT_IMAGE);
  const articleKeywords = article
    ? [...new Set([...(article.tags || []), ...DEFAULT_KEYWORDS])].join(", ")
    : DEFAULT_KEYWORDS.join(", ");

  if (loading) {
    return (
      <Box minH="100vh" bg="#ffffff">
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="50vh">
          <Text fontSize="15px" color={colors.muted}>
            Loading article…
          </Text>
        </Center>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box minH="100vh" bg="#ffffff" color={colors.text}>
        <Helmet>
          <title>{articleTitle}</title>
          <link rel="canonical" href={shareUrl} />
          <meta name="description" content={articleDescription} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="60vh" px={4}>
          <VStack spacing={4} textAlign="center">
            <Text fontSize={{ base: "24px", md: "30px" }} fontWeight="700" color={colors.heading}>
              Article not found
            </Text>
            <Text fontSize="16px" color={colors.muted}>
              This piece may have moved or been unpublished.
            </Text>
            <Button
              variant="classic"
              leftIcon={<ArrowLeft size={14} />}
              onClick={() => navigate("/")}
            >
              Back to Portfolio
            </Button>
          </VStack>
        </Center>
      </Box>
    );
  }

  const articleSchema = createArticleSchema(article, shareUrl);
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Articles", item: "/#articles" },
    { name: article.title, item: `/article/${article.slug || slug}` },
  ]);

  return (
    <Box minH="100vh" bg="#ffffff" color={colors.text}>
      <Helmet>
        <title>{articleTitle}</title>
        <link rel="canonical" href={shareUrl} />
        <meta name="description" content={articleDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={articleTitle} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:image" content={articleImage} />
        <meta property="og:image:secure_url" content={articleImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${article.title} article cover`} />
        <meta property="article:author" content={article.author || DEFAULT_AUTHOR} />
        <meta property="article:published_time" content={article.date} />
        {article.updatedAt && <meta property="article:modified_time" content={article.updatedAt} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={articleTitle} />
        <meta name="twitter:description" content={articleDescription} />
        <meta name="twitter:image" content={articleImage} />
        <meta name="twitter:image:alt" content={`${article.title} article cover`} />
        <meta name="twitter:site" content="@auriorajaa" />
        <meta name="twitter:creator" content="@auriorajaa" />
        <meta name="author" content={article.author || DEFAULT_AUTHOR} />
        <meta name="keywords" content={articleKeywords} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
      </Helmet>

      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Container maxW="1400px" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 10 }} pb={4}>
        <Button
          variant="classicOutline"
          size="sm"
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate("/", { state: { scrollTo: "articles" } })}
          mb={6}
        >
          All Writing
        </Button>

        <Flex gap={2} flexWrap="wrap" mb={3}>
          <StudioPill>{article.categoryLabel}</StudioPill>
          {article.featured && <StudioPill>Featured</StudioPill>}
        </Flex>

        <Text
          as="h1"
          fontSize={{ base: "30px", md: "42px" }}
          fontWeight="700"
          lineHeight="1.25"
          color={colors.heading}
          mb={4}
        >
          {article.title}
        </Text>

        {article.excerpt && (
          <Text fontSize={{ base: "17px", md: "20px" }} lineHeight="1.7" color={colors.muted} maxW="880px" mb={5}>
            {article.excerpt}
          </Text>
        )}

        <Text fontSize="16px" color={colors.muted} borderTop="1px solid" borderColor={colors.borderSoft} pt={4} pb={2}>
          By <Text as="span" fontWeight="700" color={colors.text}>{article.author}</Text> ·{" "}
          {formatDate(article.date)}
          {article.readTime ? ` · ${article.readTime}` : ""}
        </Text>

        {article.image && (
          <Box mt={4} border="1px solid" borderColor={colors.border} borderRadius="4px" overflow="hidden" bg={colors.surface}>
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              decoding="async"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </Box>
        )}
      </Container>

      {/* Body + Sidebar */}
      <Container maxW="1400px" px={{ base: 5, md: 10 }} pb={{ base: 12, md: 16 }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 250px" }}
          gap={{ base: 10, lg: 12 }}
        >
          {/* Article body */}
          <Box
            className="article-body"
            maxW="940px"
            sx={{
              "& p": {
                mb: "1.4em",
                lineHeight: "1.85",
                fontSize: { base: "18px", md: "19px" },
                color: colors.text,
              },
              "& h1, & h2, & h3, & h4": {
                fontWeight: "700",
                lineHeight: "1.3",
                mt: "1.8em",
                mb: "0.6em",
                color: colors.heading,
              },
              "& h1": { fontSize: { base: "28px", md: "36px" } },
              "& h2": { fontSize: { base: "24px", md: "28px" } },
              "& h3": { fontSize: { base: "21px", md: "24px" } },
              "& h4": { fontSize: { base: "18px", md: "19px" } },
              "& blockquote": {
                my: 6,
                pl: 4,
                borderLeft: "4px solid",
                borderColor: colors.border,
                fontSize: { base: "18px", md: "19px" },
                lineHeight: "1.7",
                fontStyle: "italic",
                color: "#555555",
              },
              "& ul, & ol": { pl: 6, mb: "1.4em" },
              "& li": { mb: "0.4em", fontSize: { base: "18px", md: "19px" }, lineHeight: "1.75" },
              "& img": { maxW: "100%", height: "auto", my: 6, display: "block" },
              "& a": { color: colors.accent, textDecoration: "underline" },
              "& pre": {
                bg: "#f5f5f5",
                border: "1px solid",
                borderColor: colors.border,
                borderRadius: "4px",
                color: "#333333",
                p: 4,
                overflowX: "auto",
                mb: "1.4em",
                fontSize: "14px",
                lineHeight: "1.7",
              },
              "& code": {
                fontFamily: "monospace",
                bg: "#f2f2f2",
                border: "1px solid #e5e5e5",
                borderRadius: "3px",
                px: "4px",
                py: "1px",
                fontSize: "0.88em",
              },
              "& hr": {
                my: 8,
                border: "none",
                borderTop: "1px solid",
                borderColor: colors.borderSoft,
              },
            }}
            dangerouslySetInnerHTML={{ __html: article.description }}
          />

          {/* Sidebar */}
          <Box>
            <Box position={{ lg: "sticky" }} top={{ lg: "88px" }}>
              {/* Share */}
              <Box borderTop="2px solid" borderColor={colors.border} pt={4} mb={7}>
                <Text fontSize="15px" fontWeight="700" color={colors.heading} mb={2}>
                  Share this article
                </Text>
                <VStack align="stretch" spacing={1}>
                  {shareLinks.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      isExternal
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                      fontSize="16px"
                      color={colors.accent}
                      py="3px"
                      _hover={{ color: colors.primaryDark }}
                    >
                      {s.icon} {s.label}
                    </Link>
                  ))}
                  <Box
                    as="button"
                    type="button"
                    onClick={handleCopyLink}
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    fontSize="16px"
                    color={copied ? colors.primaryDark : colors.accent}
                    py="3px"
                    bg="transparent"
                    border="none"
                    p={0}
                    cursor="pointer"
                    textAlign="left"
                    _hover={{ color: colors.primaryDark, textDecoration: "underline" }}
                  >
                    <Link2 size={14} /> {copied ? "Link copied!" : "Copy link"}
                  </Box>
                </VStack>
              </Box>

              {/* Tags */}
              {article.tags?.length > 0 && (
                <Box mb={7}>
                  <Text fontSize="15px" fontWeight="700" color={colors.heading} mb={2}>
                    Topics
                  </Text>
                  <Flex gap={2} flexWrap="wrap">
                    {article.tags.map((tag) => (
                      <StudioPill key={tag}>{tag}</StudioPill>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Related */}
              {relatedArticles.length > 0 && (
                <Box borderTop="2px solid" borderColor={colors.border} pt={4}>
                  <Text fontSize="14px" fontWeight="700" color={colors.heading} mb={3}>
                    More to read
                  </Text>
                  <VStack align="stretch" spacing={0}>
                    {relatedArticles.map((r) => (
                      <Box
                        key={r.id}
                        as="button"
                        type="button"
                        onClick={() => navigate(`/article/${r.slug}`)}
                        textAlign="left"
                        bg="transparent"
                        border="none"
                        borderBottom="1px solid"
                        borderColor={colors.borderSoft}
                        py={3}
                        cursor="pointer"
                        display="block"
                        w="100%"
                        p={0}
                        _hover={{ "& .related-title": { color: colors.accent } }}
                      >
                        <Text
                          className="related-title"
                          fontSize="15px"
                          fontWeight="600"
                          lineHeight="1.4"
                          color={colors.text}
                          transition="color .12s ease"
                          mb="2px"
                        >
                          {r.title}
                        </Text>
                        <Text fontSize="13px" color={colors.muted}>
                          {formatDate(r.date)}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArticlePage;
