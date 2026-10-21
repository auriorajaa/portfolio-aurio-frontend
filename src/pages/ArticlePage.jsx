// src/pages/ArticlePage.jsx
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import Header from "../components/layout/Header";
import Layout from "../components/layout/Layout";
import {
  PublicShell,
  usePublicColors,
  DoodleHeart,
  DoodlePaperPlane,
  DoodleTape,
} from "../components/public/studio";
import { gsap, prefersReducedMotion } from "../utils/gsap";
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
  const colors = usePublicColors();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const pageRef = useRef(null);
  const articleId = article?.id;

  const shareUrl = absoluteUrl(`/article/${slug}`);

  // Cover image settles in when the article lands.
  useLayoutEffect(() => {
    const scope = pageRef.current;
    if (!scope || !articleId || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-page-reveal]",
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.12 }
      );
    }, scope);
    return () => ctx.revert();
  }, [articleId]);

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
    const flashCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };
    try {
      await navigator.clipboard.writeText(shareUrl);
      flashCopied();
    } catch {
      // clipboard API blocked (http or permission) — classic execCommand fallback
      try {
        const helper = document.createElement("textarea");
        helper.value = shareUrl;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
        flashCopied();
      } catch {
        window.prompt("Copy link, then close:", shareUrl);
      }
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
      <PublicShell bg="#FFFFFF">
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="50vh">
          <Text fontSize="15px" color={colors.muted}>
            Loading article...
          </Text>
        </Center>
      </PublicShell>
    );
  }

  if (!article) {
    return (
      <PublicShell bg="#FFFFFF">
        <Helmet>
          <title>{articleTitle}</title>
          <link rel="canonical" href={shareUrl} />
          <meta name="description" content={articleDescription} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="60vh" px={4}>
          <VStack spacing={4} textAlign="center">
            <Text
              fontFamily="heading"
              fontSize={{ base: "26px", md: "32px" }}
              fontWeight="700"
              letterSpacing="-.03em"
              color={colors.heading}
            >
              Article not found
            </Text>
            <Text fontSize="16px" color={colors.muted}>
              This piece may have moved or been unpublished.
            </Text>
            <Button
              variant="lagoon"
              leftIcon={<ArrowLeft size={15} />}
              onClick={() => navigate("/")}
            >
              Back to Portfolio
            </Button>
          </VStack>
        </Center>
      </PublicShell>
    );
  }

  const articleSchema = createArticleSchema(article, shareUrl);
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Articles", item: "/#articles" },
    { name: article.title, item: `/article/${article.slug || slug}` },
  ]);

  return (
    <Box ref={pageRef}>
      <Layout isDownloading={isDownloading} handleDownload={handleDownload}>
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

      <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={4}>
        <Button
          variant="lagoonOutline"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "articles" } })}
          mb={7}
        >
          All Writing
        </Button>

        <Flex align="center" gap={3} flexWrap="wrap" mb={4}>
          <Flex align="center" gap={2}>
            <DoodlePaperPlane size={40} transform="rotate(-8deg)" />
            <Text
              className="public-hand"
              fontSize={{ base: "26px", md: "30px" }}
              fontWeight="600"
              color={colors.coralDeep}
              transform="rotate(-1.5deg)"
            >
              a little something I wrote
            </Text>
          </Flex>
        </Flex>

        <Text
          as="h1"
          fontFamily="heading"
          fontSize={{ base: "34px", md: "52px" }}
          fontWeight="700"
          lineHeight="1.05"
          letterSpacing="-.04em"
          color={colors.heading}
          maxW="900px"
          mb={5}
        >
          {article.title}
        </Text>

        <Flex align="center" gap={3} flexWrap="wrap" mb={6}>
          {article.categoryLabel && (
            <Box
              className="public-mono"
              fontSize="12px"
              fontWeight="600"
              color={colors.primaryDark}
              border="1.5px dashed rgba(11,47,47,0.55)"
              borderRadius="6px"
              px={3}
              py="5px"
              transform="rotate(-2deg)"
              bg="#FFFFFF"
            >
              {article.categoryLabel}
            </Box>
          )}
          {article.featured && (
            <Text
              className="public-mono"
              fontSize="12px"
              fontWeight="500"
              color={colors.coralDeep}
            >
              featured
            </Text>
          )}
        </Flex>

        {article.excerpt && (
          <Text
            fontSize={{ base: "17px", md: "19px" }}
            lineHeight="1.75"
            color={colors.muted}
            maxW="820px"
            mb={6}
          >
            {article.excerpt}
          </Text>
        )}

        <Flex
          align="center"
          gap={3}
          flexWrap="wrap"
          borderTop="1px solid"
          borderColor={colors.borderSoft}
          pt={5}
          pb={6}
        >
          <Box
            w="40px"
            h="40px"
            borderRadius="999px"
            overflow="hidden"
            border="1.5px solid"
            borderColor={colors.ink}
            flexShrink={0}
          >
            <img
              src="/profilepic.png"
              alt={article.author || DEFAULT_AUTHOR}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box>
            <Text fontSize="15px" fontWeight="700" color={colors.heading}>
              {article.author || DEFAULT_AUTHOR}
            </Text>
            <Text fontSize="13px" color={colors.muted}>
              {[formatDate(article.date), article.readTime].filter(Boolean).join(" · ")}
            </Text>
          </Box>
        </Flex>

        {article.image && (
          <Box
            mt={2}
            border="2px solid"
            borderColor={colors.ink}
            borderRadius="14px"
            overflow="hidden"
            bg={colors.surfaceTint}
            boxShadow="6px 6px 0 rgba(11,47,47,0.9)"
            data-page-reveal
            position="relative"
          >
            <DoodleTape
              w={92}
              h={22}
              color="rgba(255,200,87,0.85)"
              rotation={-4}
              top="-12px"
              left="44px"
              ml={-46}
              zIndex={2}
            />
            <DoodleTape
              w={72}
              h={20}
              color="rgba(255,107,74,0.75)"
              rotation={4}
              bottom="-10px"
              right="40px"
              ml={-36}
              zIndex={2}
            />
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                maxHeight: "520px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
      </Container>

      {/* Body + Sidebar */}
      <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} pb={{ base: 12, md: 20 }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 290px" }}
          gap={{ base: 10, lg: 14 }}
        >
          {/* Article body */}
          <Box
            className="article-body"
            maxW="780px"
            sx={{
              "& p": {
                mb: "1.4em",
                lineHeight: "1.85",
                fontSize: { base: "17px", md: "18px" },
                color: colors.text,
              },
              "& h1, & h2, & h3, & h4": {
                fontFamily: "var(--font-display, 'Open Sans'), 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: "700",
                lineHeight: "1.25",
                letterSpacing: "-.025em",
                mt: "1.8em",
                mb: "0.6em",
                color: colors.heading,
              },
              "& h1": { fontSize: { base: "28px", md: "34px" } },
              "& h2": { fontSize: { base: "25px", md: "29px" } },
              "& h3": { fontSize: { base: "21px", md: "24px" } },
              "& h4": { fontSize: { base: "18px", md: "19px" } },
              "& blockquote": {
                my: 7,
                pl: 6,
                pr: 5,
                py: 5,
                borderLeft: "3px solid",
                borderColor: colors.coral,
                bg: colors.surfaceAlt,
                borderRadius: "0 18px 18px 0",
                fontSize: { base: "17px", md: "18px" },
                lineHeight: "1.75",
                color: colors.primaryDark,
                fontStyle: "italic",
              },
              "& ul, & ol": { pl: 6, mb: "1.4em" },
              "& li": {
                mb: "0.5em",
                fontSize: { base: "17px", md: "18px" },
                lineHeight: "1.75",
                color: colors.text,
              },
              "& li::marker": { color: colors.primary },
              "& img": {
                maxW: "100%",
                height: "auto",
                my: 7,
                display: "block",
                borderRadius: "14px",
              },
              "& a": {
                color: colors.primary,
                textDecoration: "underline",
                textDecorationColor: "rgba(14,140,134,0.4)",
                textUnderlineOffset: "3px",
                _hover: { color: colors.coralDeep },
              },
              "& pre": {
                bg: "#082F2E",
                border: "none",
                borderRadius: "18px",
                color: "#E8F8F5",
                p: 5,
                overflowX: "auto",
                mb: "1.4em",
                fontSize: "14px",
                lineHeight: "1.7",
                fontFamily: "'IBM Plex Mono', monospace",
              },
              "& code": {
                fontFamily: "'IBM Plex Mono', monospace",
                bg: colors.surfaceTint,
                border: "1px solid",
                borderColor: colors.chipBorder,
                borderRadius: "6px",
                px: "6px",
                py: "2px",
                fontSize: "0.86em",
                color: colors.primaryDark,
              },
              "& pre code": {
                bg: "transparent",
                border: "none",
                color: "inherit",
                p: 0,
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
            <Box position={{ lg: "sticky" }} top={{ lg: "110px" }}>
              {/* Share */}
              <Box
                bg={colors.surfaceAlt}
                border="1.5px solid"
                borderColor={colors.ink}
                borderRadius="12px"
                p={5}
                mb={6}
              >
                <Text
                  fontFamily="heading"
                  fontSize="16px"
                  fontWeight="700"
                  color={colors.heading}
                  mb={3}
                >
                  Share this article
                </Text>
                <VStack align="stretch" spacing={2}>
                  {shareLinks.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      isExternal
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                      fontSize="15px"
                      fontWeight="600"
                      color={colors.text}
                      px={4}
                      py="9px"
                      borderRadius="12px"
                      border="1px solid"
                      borderColor={colors.borderSoft}
                      bg="#FFFFFF"
                      transition="all .15s ease"
                      _hover={{
                        color: colors.primaryDark,
                        borderColor: colors.chipBorder,
                        bg: colors.surfaceTint,
                        textDecoration: "none",
                      }}
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
                    fontSize="15px"
                    fontWeight="600"
                    color={colors.text}
                    px={4}
                    py="9px"
                    borderRadius="12px"
                    border="1px solid"
                    borderColor={copied ? colors.primaryDeep : colors.borderSoft}
                    bg={copied ? "#FFC857" : "#FFFFFF"}
                    boxShadow={copied ? "2px 2px 0 rgba(11,47,47,0.85)" : "none"}
                    cursor="pointer"
                    textAlign="left"
                    transition="all .15s ease"
                    _hover={{
                      color: colors.primaryDark,
                      borderColor: colors.chipBorder,
                      bg: colors.surfaceTint,
                    }}
                  >
                    <Link2 size={14} /> {copied ? "Link copied!" : "Copy link"}
                  </Box>
                </VStack>
              </Box>

              {/* Topics: a teal post-it */}
              {article.tags?.length > 0 && (
                <Box
                  bg="#E3F4F1"
                  border="1.5px solid"
                  borderColor="#0B2F2F"
                  borderRadius="4px"
                  boxShadow="3px 3px 0 rgba(11,47,47,0.4)"
                  p={5}
                  mb={7}
                  transform="rotate(-1.2deg)"
                  position="relative"
                >
                  <Box
                    aria-hidden="true"
                    position="absolute"
                    top="-10px"
                    left="26px"
                    w="52px"
                    h="12px"
                    borderRadius="2px"
                    bg="rgba(14,140,134,0.55)"
                    transform="rotate(4deg)"
                  />
                  <Text
                    className="public-hand"
                    fontSize="26px"
                    fontWeight="600"
                    color="#0B2F2F"
                    mb={3}
                    transform="rotate(-1deg)"
                  >
                    the topics
                  </Text>
                  <Text fontSize="14px" lineHeight="1.9" color={colors.text}>
                    {article.tags.join(" · ")}
                  </Text>
                </Box>
              )}

              {/* Related reads: a ticket stub with a punched edge */}
              {relatedArticles.length > 0 && (
                <Box
                  bg="#FFFFFF"
                  border="2px solid"
                  borderColor="#0B2F2F"
                  borderRadius="8px"
                  boxShadow="3px 3px 0 rgba(11,47,47,0.85)"
                  p={5}
                  pl={7}
                  position="relative"
                  sx={{
                    "&::before": {
                      content: "' '",
                      position: "absolute",
                      top: "10px",
                      bottom: "10px",
                      left: "12px",
                      width: "0",
                      borderLeft: "2px dashed rgba(11,47,47,0.4)",
                    },
                  }}
                >
                  <Box mb={3} pl={4}>
                    <Text
                      className="public-hand"
                      fontSize="26px"
                      fontWeight="600"
                      color="#0B2F2F"
                      transform="rotate(-1deg)"
                    >
                      keep reading!
                    </Text>
                  </Box>
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
                        _last={{ borderBottom: "none" }}
                        py={3}
                        cursor="pointer"
                        display="block"
                        w="100%"
                        p={0}
                        _hover={{ "& .related-title": { color: colors.primary } }}
                      >
                        <Text
                          className="related-title"
                          fontSize="15px"
                          fontWeight="600"
                          lineHeight="1.45"
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

      {/* The wrap-up line */}
      <Container maxW="1200px" px={{ base: 5, md: 8, lg: 10 }} pb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={3} justify="center">
          <Text
            className="public-hand"
            fontSize={{ base: "28px", md: "32px" }}
            fontWeight="600"
            color={colors.primaryDeep || colors.primary}
            transform="rotate(-1deg)"
          >
            that&apos;s a wrap &mdash; thanks for reading
          </Text>
          <DoodleHeart size={24} />
        </Flex>
      </Container>

      </Layout>
    </Box>
  );
};

export default ArticlePage;
