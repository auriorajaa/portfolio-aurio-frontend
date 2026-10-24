// src/pages/ArticlePage.jsx
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";
import { Navbar } from "../components/public/Navbar";
import {
  PublicShell,
  usePublicColors,
  BRUT,
  BrutTag,
  StickerTape,
  DoodleHeart,
  DoodlePaperPlane,
  DoodleSquiggle,
} from "../components/public/brutal";
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
    d
      ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "";

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
      <PublicShell bg={colors.bg}>
        <Navbar isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="50vh" flexDir="column" gap={3}>
          <DoodlePaperPlane size={48} />
          <Text fontFamily="spaceMono" fontSize="14px" fontWeight="700" letterSpacing=".1em" color={BRUT.ink}>
            FETCHING THE STORY...
          </Text>
        </Center>
      </PublicShell>
    );
  }

  if (!article) {
    return (
      <PublicShell bg={colors.bg}>
        <Helmet>
          <title>{articleTitle}</title>
          <link rel="canonical" href={shareUrl} />
          <meta name="description" content={articleDescription} />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Navbar isDownloading={isDownloading} handleDownload={handleDownload} />
        <Center minH="60vh" px={4}>
          <VStack spacing={5} textAlign="center">
            <Box
              bg={colors.coral}
              border="2.5px solid"
              borderColor={BRUT.ink}
              borderRadius="10px"
              boxShadow={BRUT.shadowLg}
              px={8}
              py={6}

            >
              <Text fontFamily="bungee" fontSize={{ base: "22px", md: "28px" }} color="#FFFFFF" lineHeight="1.2">
                404!
              </Text>
              <Text fontFamily="spaceMono" fontSize="12px" fontWeight="700" letterSpacing=".12em" color="#FFFFFF" mt={1}>
                ARTICLE NOT FOUND
              </Text>
            </Box>
            <Text fontSize="16px" color={BRUT.inkSoft}>
              This piece may have moved or been unpublished.
            </Text>
            <Button
              variant="brutCoral"
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
      <PublicLayout isDownloading={isDownloading} handleDownload={handleDownload}>
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

      <Box maxW="1200px" mx="auto" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={4}>
        <Button
          variant="brutOutline"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/", { state: { scrollTo: "articles" } })}
          mb={7}
        >
          All Writing
        </Button>

        <Flex align="center" gap={3} flexWrap="wrap" mb={4}>
          <BrutTag tone="coral" dot dotColor={colors.coral}>
            A LITTLE SOMETHING I WROTE
          </BrutTag>
          <DoodleSquiggle width={90} />
        </Flex>

        <Text
          as="h1"
          fontFamily="bungee"
          fontSize={{ base: "28px", md: "42px" }}
          lineHeight="1.15"
          color={BRUT.ink}
          maxW="940px"
          mb={5}
        >
          {article.title}
        </Text>

        <Flex align="center" gap={3} flexWrap="wrap" mb={6}>
          {article.categoryLabel && (
            <BrutTag tone="yellow">
              {article.categoryLabel}
            </BrutTag>
          )}
          {article.featured && (
            <BrutTag tone="coral">
              ★ FEATURED
            </BrutTag>
          )}
        </Flex>

        {article.excerpt && (
          <Text
            fontSize={{ base: "17px", md: "18px" }}
            lineHeight="1.75"
            color={colors.muted}
            maxW="820px"
            mb={7}
          >
            {article.excerpt}
          </Text>
        )}

        {/* Byline like a masthead chip */}
        <Flex
          align="center"
          gap={3}
          flexWrap="wrap"
          bg="#FFFFFF"
          border="2px solid"
          borderColor={BRUT.ink}
          borderRadius="8px"
          boxShadow={BRUT.shadowXs}
          px={4}
          py={3}
          mb={8}
          maxW="fit-content"
        >
          <Box
            w="40px"
            h="40px"
            borderRadius="6px"
            overflow="hidden"
            border="2px solid"
            borderColor={BRUT.ink}
            flexShrink={0}
          >
            <img
              src="/profilepic.png"
              alt={article.author || DEFAULT_AUTHOR}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box>
            <Text fontFamily="spaceMono" fontSize="12px" fontWeight="700" color={colors.heading}>
              {article.author || DEFAULT_AUTHOR}
            </Text>
            <Text fontFamily="spaceMono" fontSize="12.5px" fontWeight="700" color={BRUT.ink}>
              {[formatDate(article.date), article.readTime].filter(Boolean).join(" / ")}
            </Text>
          </Box>
        </Flex>

        {article.image && (
          <Box
            mt={2}
            border="2.5px solid"
            borderColor={BRUT.ink}
            borderRadius="10px"
            overflow="hidden"
            bg={colors.bgWash}
            boxShadow={BRUT.shadowLg}
            data-page-reveal
            position="relative"
          >
            <StickerTape
              w={92}
              h={22}
              color="rgba(255,210,63,0.8)"

              top="-13px"
              left="44px"
              zIndex={2}
            />
            <StickerTape
              w={72}
              h={20}
              color="rgba(255,107,107,0.72)"

              bottom="-11px"
              right="40px"
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
      </Box>

      {/* Body + Sidebar */}
      <Box maxW="1200px" mx="auto" px={{ base: 5, md: 8, lg: 10 }} pb={{ base: 12, md: 20 }}>
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
                fontFamily: "bungee",
                fontWeight: "400",
                lineHeight: "1.3",
                mt: "1.8em",
                mb: "0.6em",
                color: BRUT.ink,
              },
              "& h1": { fontSize: { base: "22px", md: "26px" } },
              "& h2": {
                fontSize: { base: "19px", md: "22px" },
                display: "inline-block",
                backgroundImage: `linear-gradient(transparent 62%, ${colors.yellow} 62%, ${colors.yellow} 92%, transparent 92%)`,
                px: "2px",
              },
              "& h3": { fontSize: { base: "17px", md: "19px" }, color: colors.primaryDeep },
              "& h4": { fontSize: { base: "16px", md: "17px" } },
              "& blockquote": {
                my: 7,
                pl: 6,
                pr: 5,
                py: 5,
                bg: colors.yellow,
                border: "2px solid",
                borderLeft: "6px solid",
                borderColor: BRUT.ink,
                borderRadius: "0 8px 8px 0",
                fontSize: { base: "17px", md: "18px" },
                lineHeight: "1.75",
                color: BRUT.ink,
                fontWeight: "600",
                boxShadow: BRUT.shadowXs,
              },
              "& ul, & ol": { pl: 6, mb: "1.4em" },
              "& li": {
                mb: "0.5em",
                fontSize: { base: "17px", md: "18px" },
                lineHeight: "1.75",
                color: colors.text,
              },
              "& li::marker": { color: colors.primaryDeep },
              "& img": {
                maxW: "100%",
                height: "auto",
                my: 7,
                display: "block",
              },
              "& a": {
                color: colors.primaryDeep,
                fontWeight: "600",
                textDecoration: "underline",
                textDecorationColor: colors.primary,
                textDecorationThickness: "2px",
                textUnderlineOffset: "3px",
                _hover: { color: colors.coralDeep, textDecorationColor: colors.coral },
              },
              "& pre": {
                bg: BRUT.ink,
                border: "2px solid #17181C",
                borderRadius: "8px",
                color: "#FFFDF6",
                p: 5,
                overflowX: "auto",
                mb: "1.4em",
                fontSize: "14px",
                lineHeight: "1.7",
                fontFamily: "var(--font-mono)",
                boxShadow: BRUT.shadowXs,
              },
              "& code": {
                fontFamily: "var(--font-mono)",
                bg: colors.yellow,
                border: "1.5px solid",
                borderColor: "rgba(23,24,28,0.5)",
                borderRadius: "4px",
                px: "6px",
                py: "2px",
                fontSize: "0.86em",
                color: BRUT.ink,
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
                borderTop: "2px dashed",
                borderColor: colors.borderDashed,
              },
            }}
            dangerouslySetInnerHTML={{ __html: article.description }}
          />

          {/* Sidebar */}
          <Box>
            <Box position={{ lg: "sticky" }} top={{ lg: "110px" }}>
              {/* Share panel */}
              <Box
                bg="#FFFFFF"
                border="2px solid"
                borderColor={BRUT.ink}
                borderRadius="10px"
                boxShadow={BRUT.shadowXs}
                p={5}
                mb={6}
              >
                <Text
                  fontFamily="bungee"
                  fontSize="13px"
                  color={BRUT.ink}
                  mb={4}
                >
                  PASS IT ON
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
                      fontFamily="heading"
                      fontSize="14px"
                      fontWeight="600"
                      color={colors.heading}
                      px={4}
                      py="9px"
                      borderRadius="6px"
                      border="1.5px solid"
                      borderColor="rgba(23,24,28,0.35)"
                      bg="#FFFFFF"
                      transition="all .15s ease"
                      _hover={{
                        bg: colors.yellow,
                        borderColor: BRUT.ink,
                        boxShadow: BRUT.shadowXs,
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
                    fontFamily="heading"
                    fontSize="14px"
                    fontWeight="600"
                    px={4}
                    py="9px"
                    borderRadius="6px"
                    border="2px solid"
                    borderColor={BRUT.ink}
                    bg={copied ? colors.primary : "#FFFFFF"}
                    color={copied ? "#FFFFFF" : colors.heading}
                    boxShadow={copied ? BRUT.shadowXs : "none"}
                    cursor="pointer"
                    textAlign="left"
                    transition="all .15s ease"
                    _hover={{
                      bg: copied ? colors.primaryDeep : colors.yellow,
                      boxShadow: BRUT.shadowXs,
                    }}
                  >
                    <Link2 size={14} /> {copied ? "Link copied!" : "Copy link"}
                  </Box>
                </VStack>
              </Box>

              {/* Topics: a yellow post-it */}
              {article.tags?.length > 0 && (
                <Box
                  bg={colors.yellow}
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="6px"
                  boxShadow={BRUT.shadowXs}
                  p={5}
                  mb={7}

                  position="relative"
                >
                  <StickerTape
                    w={52}
                    h={13}
                    color="rgba(255,255,255,0.6)"

                    top="-9px"
                    left="26px"
                  />
                  <Text
                    fontFamily="bungee"
                    fontSize="13px"
                    color={BRUT.ink}
                    mb={3}
                  >
                    THE TOPICS
                  </Text>
                  <Flex gap={1.5} flexWrap="wrap">
                    {article.tags.map((tag, i) => (
                      <BrutTag key={tag} tone={["mint", "blue", "lime", "yellow"][i % 4]}>
                        {tag}
                      </BrutTag>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Related reads: ticket with dashed edge */}
              {relatedArticles.length > 0 && (
                <Box
                  bg="#FFFFFF"
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="8px"
                  boxShadow={BRUT.shadowXs}
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
                      borderLeft: "2px dashed rgba(23,24,28,0.35)",
                    },
                  }}
                >
                  <Box mb={3} pl={4}>
                    <Text fontFamily="bungee" fontSize="13px" color={BRUT.ink}>
                      KEEP READING!
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
                        borderColor="rgba(23,24,28,0.2)"
                        _last={{ borderBottom: "none" }}
                        py={3}
                        cursor="pointer"
                        display="block"
                        w="100%"
                        p={0}
                        _hover={{ "& .related-title": { color: colors.primaryDeep } }}
                      >
                        <Text
                          className="related-title"
                          fontFamily="heading"
                          fontSize="15px"
                          fontWeight="600"
                          lineHeight="1.45"
                          color={colors.heading}
                          transition="color .12s ease"
                          mb="2px"
                        >
                          {r.title}
                        </Text>
                        <Text fontFamily="spaceMono" fontSize="12.5px" fontWeight="700" color={BRUT.ink}>
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
      </Box>

      {/* The wrap-up strip */}
      <Box maxW="1200px" mx="auto" px={{ base: 5, md: 8, lg: 10 }} pb={{ base: 4, md: 6 }}>
        <Flex align="center" gap={3} justify="center" pb={4}>
          <Text
            fontFamily="heading"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="600"
            color={colors.primaryDeep}

          >
            that&apos;s a wrap &mdash; thanks for reading
          </Text>
          <DoodleHeart size={24} />
        </Flex>
      </Box>

      </PublicLayout>
    </Box>
  );
};

export default ArticlePage;
