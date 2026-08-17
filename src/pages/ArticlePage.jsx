// src/pages/ArticlePage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Center, Container, Spinner, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowLeft, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import Header from "../components/layout/Header";
import { StudioPill, useStudioColors } from "../components/public/studio";
import { getArticleBySlug, getAllArticles } from "../services/articleService";
import { gsap, prefersReducedMotion } from "../utils/gsap";
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
  const rootRef = useRef(null);
  const progressRef = useRef(null);

  const shareUrl = absoluteUrl(`/article/${slug}`);

  useGSAP(
    () => {
      if (!article || prefersReducedMotion()) return;
      gsap.from("[data-hero]", {
        y: 24, autoAlpha: 0, duration: 0.72,
        ease: "power4.out", stagger: 0.07,
      });
      gsap.utils.toArray(".article-body > *").forEach((el) => {
        gsap.fromTo(el,
          { y: 20, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 0.56, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
          }
        );
      });
      gsap.to(progressRef.current, {
        scaleX: 1, transformOrigin: "left center", ease: "none",
        scrollTrigger: {
          trigger: rootRef.current, start: "top top",
          end: "bottom bottom", scrub: true,
        },
      });
    },
    { dependencies: [article?.slug], scope: rootRef }
  );

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
          .filter((a) => a.category === articleData.category || a.tags?.some((t) => articleData.tags?.includes(t)))
          .slice(0, 4);
        const fill = allArticles
          .filter((a) => a.slug !== slug && a.visibility === "public" && !related.find((r) => r.slug === a.slug))
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

  useEffect(() => { loadArticle(); }, [slug, loadArticle]);

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
      icon: <Twitter size={16} />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || "")}`,
    },
    {
      label: "Facebook",
      icon: <Facebook size={16} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: <Linkedin size={16} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const articleTitle = article ? `${article.title} | ${DEFAULT_AUTHOR}` : `Article not found | ${SITE_NAME}`;
  const articleDescription = article ? truncate(article.excerpt || article.description, 155) : "This article could not be found in Aurio Rajaa's portfolio.";
  const articleImage = absoluteUrl(article?.image || DEFAULT_IMAGE);
  const articleKeywords = article
    ? [...new Set([...(article.tags || []), ...DEFAULT_KEYWORDS])].join(", ")
    : DEFAULT_KEYWORDS.join(", ");

  if (loading) {
    return (
      <Box minH="100vh" bg={colors.bg}>
        <Center minH="100vh"><Spinner color={colors.accent} /></Center>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box minH="100vh" bg={colors.bg} color={colors.text}>
        <Helmet>
          <title>{articleTitle}</title>
          <link rel="canonical" href={shareUrl} />
          <meta name="description" content={articleDescription} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Header isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="70vh" px={4}>
          <VStack spacing={5} textAlign="center">
            <Text fontSize={{ base: "28px", md: "36px" }} fontWeight="800" letterSpacing="-0.02em">
              Article not found
            </Text>
            <Text fontSize="17px" color={colors.muted}>
              This piece may have moved or been unpublished.
            </Text>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", fontSize: "14px", fontWeight: "600",
                border: `1px solid ${colors.border}`, background: "transparent",
                color: colors.text, cursor: "pointer", letterSpacing: "0.02em",
              }}
            >
              <ArrowLeft size={14} /> Back to portfolio
            </button>
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
    <Box ref={rootRef} minH="100vh" bg={colors.bg} color={colors.text} transition="background-color .28s ease">
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

      {/* Reading progress bar */}
      <Box
        ref={progressRef}
        position="fixed" top={0} left={0} right={0}
        h="2px" bg={colors.accent} zIndex={1200} transform="scaleX(0)"
      />

      {/* <Header isDownloading={isDownloading} handleDownload={handleDownload} /> */}

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Box
        borderBottom="1px solid"
        borderColor={colors.borderSoft}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 8, md: 12 }}
      >
        <Container maxW="900px" px={{ base: 5, md: 8 }}>
          {/* Back */}
          <Box
            data-hero
            as="button"
            onClick={() => {
              navigate("/", { state: { scrollTo: "articles" } });
            }}
            display="inline-flex"
            alignItems="center"
            gap={2}
            fontSize="13px"
            fontWeight="500"
            color={colors.muted}
            letterSpacing="0.06em"
            textTransform="uppercase"
            mb={8}
            _hover={{ color: colors.text }}
            transition="color .18s ease"
            bg="transparent"
            border="none"
            cursor="pointer"
          >
            <ArrowLeft size={13} /> Back
          </Box>

          {/* Category + Featured pill */}
          <Box data-hero mb={5} display="flex" gap={2} flexWrap="wrap">
            <StudioPill>{article.categoryLabel}</StudioPill>
            {article.featured && <StudioPill tone="accent">Featured</StudioPill>}
          </Box>

          {/* Title */}
          <Text
            data-hero
            as="h1"
            fontSize={{ base: "36px", md: "56px", lg: "66px" }}
            fontWeight="800"
            lineHeight="0.97"
            letterSpacing="-0.03em"
            mb={6}
          >
            {article.title}
          </Text>

          {/* Excerpt / deck */}
          {article.excerpt && (
            <Text
              data-hero
              fontSize={{ base: "18px", md: "22px" }}
              lineHeight="1.5"
              color={colors.muted}
              fontWeight="400"
              maxW="680px"
              mb={8}
            >
              {article.excerpt}
            </Text>
          )}

          {/* Meta row */}
          <Box
            data-hero
            display="flex"
            flexWrap="wrap"
            gap={5}
            alignItems="center"
            fontSize="13px"
            color={colors.muted}
            borderTop="1px solid"
            borderColor={colors.borderSoft}
            pt={5}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                w="28px" h="28px" borderRadius="full"
                bg={colors.accent}
                display="flex" alignItems="center" justifyContent="center"
                fontSize="11px" fontWeight="700" color={colors.bg}
              >
                {article.author?.[0]?.toUpperCase()}
              </Box>
              <Text fontWeight="600" color={colors.text} fontSize="14px">
                {article.author}
              </Text>
            </Box>
            <Text>{formatDate(article.date)}</Text>
            {article.readTime && <Text>{article.readTime}</Text>}
          </Box>
        </Container>
      </Box>

      {/* ── Body + Sidebar ───────────────────────────────────────── */}
      <Container maxW="1200px" px={{ base: 5, md: 8 }} py={{ base: 10, md: 16 }}>
        {/* Hero image */}
        {article.image && (
          <Box data-hero mb={{ base: 8, md: 12 }} overflow="hidden" bg={colors.surfaceAlt}>
            <LazyLoadImage
              src={article.image}
              alt={article.title}
              effect="opacity"
              threshold={260}
              loading="lazy"
              decoding="async"
              width="100%"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>
        )}
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 280px" }}
          gap={{ base: 12, lg: 16 }}
        >
          {/* Article body */}
          <Box
            className="article-body"
            sx={{
              "& p": {
                mb: "1.4em",
                lineHeight: "1.82",
                fontSize: { base: "17px", md: "19px" },
                color: colors.text,
                fontWeight: 400,
              },
              "& h1, & h2, & h3, & h4": {
                fontWeight: "800",
                lineHeight: "1.12",
                letterSpacing: "-0.025em",
                mt: "2em",
                mb: "0.6em",
                color: colors.text,
              },
              "& h1": { fontSize: { base: "30px", md: "40px" } },
              "& h2": { fontSize: { base: "24px", md: "32px" } },
              "& h3": { fontSize: { base: "20px", md: "26px" } },
              "& h4": { fontSize: { base: "17px", md: "20px" } },
              "& blockquote": {
                my: 10,
                pl: { base: 5, md: 8 },
                borderLeft: "3px solid",
                borderColor: colors.accent,
                fontSize: { base: "20px", md: "26px" },
                lineHeight: "1.45",
                fontWeight: "300",
                fontStyle: "italic",
                color: colors.primary,
              },
              "& ul, & ol": { pl: 6, mb: "1.4em" },
              "& li": { mb: "0.4em", fontSize: { base: "17px", md: "19px" }, lineHeight: "1.72" },
              "& img": { maxW: "100%", my: 8, display: "block" },
              "& a": { color: colors.accent, textDecoration: "underline", textUnderlineOffset: "3px" },
              "& pre": {
                bg: "#0f0f0e",
                color: "#f5f5f0",
                p: 6,
                overflowX: "auto",
                mb: "1.4em",
                fontSize: "14px",
                lineHeight: "1.7",
              },
              "& code": {
                fontFamily: "monospace",
                bg: colors.surfaceAlt,
                px: "4px",
                py: "2px",
                fontSize: "0.88em",
              },
              "& hr": {
                my: 10,
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
              <Box
                borderTop="2px solid"
                borderColor={colors.text}
                pt={5}
                mb={8}
              >
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color={colors.muted}
                  mb={4}
                >
                  Share
                </Text>
                <Box display="flex" flexDirection="column" gap={2}>
                  {shareLinks.map((s) => (
                    <Box
                      key={s.label}
                      as="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      display="flex"
                      alignItems="center"
                      gap={3}
                      fontSize="13px"
                      fontWeight="500"
                      color={colors.muted}
                      py={2}
                      borderBottom="1px solid"
                      borderColor={colors.borderSoft}
                      _hover={{ color: colors.text }}
                      transition="color .15s ease"
                      textDecoration="none"
                    >
                      {s.icon} {s.label}
                    </Box>
                  ))}
                  <Box
                    as="button"
                    onClick={handleCopyLink}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    fontSize="13px"
                    fontWeight="500"
                    color={copied ? colors.accent : colors.muted}
                    py={2}
                    borderBottom="1px solid"
                    borderColor={colors.borderSoft}
                    _hover={{ color: colors.text }}
                    transition="color .15s ease"
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                    textAlign="left"
                  >
                    <Link2 size={16} /> {copied ? "Link copied!" : "Copy link"}
                  </Box>
                </Box>
              </Box>

              {/* Tags */}
              {article.tags?.length > 0 && (
                <Box mb={8}>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color={colors.muted}
                    mb={3}
                  >
                    Topics
                  </Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {article.tags.map((tag) => (
                      <Box
                        key={tag}
                        fontSize="12px"
                        fontWeight="500"
                        px={3} py={1}
                        border="1px solid"
                        borderColor={colors.borderSoft}
                        color={colors.muted}
                        letterSpacing="0.03em"
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Related */}
              {relatedArticles.length > 0 && (
                <Box
                  borderTop="2px solid"
                  borderColor={colors.text}
                  pt={5}
                >
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color={colors.muted}
                    mb={5}
                  >
                    More to read
                  </Text>
                  <Box display="flex" flexDirection="column" gap={0}>
                    {relatedArticles.map((r, i) => (
                      <Box
                        key={r.id}
                        as="button"
                        onClick={() => navigate(`/article/${r.slug}`)}
                        textAlign="left"
                        bg="transparent"
                        border="none"
                        borderBottom="1px solid"
                        borderColor={colors.borderSoft}
                        py={4}
                        cursor="pointer"
                        display="block"
                        w="100%"
                        _hover={{ "& .related-title": { color: colors.accent } }}
                      >
                        <Text
                          className="related-title"
                          fontSize="15px"
                          fontWeight="700"
                          lineHeight="1.25"
                          letterSpacing="-0.01em"
                          color={colors.text}
                          transition="color .15s ease"
                          mb={1}
                        >
                          {r.title}
                        </Text>
                        <Text fontSize="12px" color={colors.muted}>
                          {formatDate(r.date)}
                          {r.readTime && <> · {r.readTime}</>}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticlePage;
