import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Calendar } from "lucide-react";
import { getAllArticles } from "../../services/articleService";
import { StudioPill, StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

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
  const colors = useStudioColors();
  const rootRef = useRef(null);

  useEffect(() => {
    loadArticles();
  }, []);

  useGSAP(
    () => {
      if (loading || prefersReducedMotion()) return;
      gsap.from("[data-article-card]", {
        clipPath: "inset(18% 0% 18% 0% round 28px)",
        y: 32,
        autoAlpha: 0,
        duration: 0.85,
        ease: "power4.out",
        stagger: { each: 0.08, from: "start" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          once: true,
        },
      });
    },
    { dependencies: [loading, filter], scope: rootRef },
  );

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

  const categories = ["ALL", ...new Set(articles.map((a) => a.categoryLabel).filter(Boolean))].slice(0, 5);
  const filteredArticles =
    filter === "ALL" ? articles : articles.filter((article) => article.categoryLabel === filter);
  const visibleArticles = filteredArticles.slice(0, 5);

  if (loading) {
    return (
      <StudioSection id="articles" eyebrow="Writing" title="Field notes">
        <Center py={10}>
          <Spinner color={colors.accent} />
        </Center>
      </StudioSection>
    );
  }

  if (articles.length === 0) return null;

  return (
    <StudioSection id="articles" eyebrow="Writing" title="Notes.">
      <Box ref={rootRef}>
        <HStack spacing={2} flexWrap="wrap" mb={{ base: 7, md: 10 }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "studio" : "studioGhost"}
              size="sm"
              onClick={() => setFilter(category)}
            >
              {category.toUpperCase()}
            </Button>
          ))}
        </HStack>

        <Grid templateColumns={{ base: "1fr", lg: "1.1fr .9fr" }} gap={{ base: 5, md: 7 }}>
          {visibleArticles.map((article, index) => (
            <Box
              data-article-card
              key={article.id}
              gridColumn={{ lg: index === 0 ? "span 1" : "auto" }}
              minH={index === 0 ? { base: "420px", md: "560px" } : "auto"}
              overflow="hidden"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.borderSoft}
              cursor="pointer"
              position="relative"
              onClick={() => navigate(`/article/${article.slug}`)}
              _hover={{ "& img": { transform: "scale(1.06)" } }}
            >
              {article.image && (
                <Box h={index === 0 ? "58%" : "210px"} overflow="hidden" bg={colors.surfaceAlt}>
                  <LazyLoadImage
                    src={article.image}
                    alt={article.title}
                    effect="opacity"
                    threshold={260}
                    loading="lazy"
                    decoding="async"
                    width="100%"
                    height="100%"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform .7s cubic-bezier(.2,.8,.2,1)",
                    }}
                  />
                </Box>
              )}
              <VStack align="stretch" spacing={4} p={{ base: 5, md: 6 }}>
                <HStack justify="space-between" align="center">
                  <StudioPill tone="ghost">{article.categoryLabel}</StudioPill>
                  <ArrowUpRight size={18} color={colors.accent} />
                </HStack>
                <Text fontSize={index === 0 ? { base: "28px", md: "38px" } : "22px"} fontWeight="800" lineHeight="1.08">
                  {article.title}
                </Text>
                <Text fontSize="15px" color={colors.muted} lineHeight="1.7" noOfLines={3}>
                  {article.excerpt}
                </Text>
                <HStack color={colors.muted} fontSize="14px">
                  <Calendar size={14} />
                  <Text>{new Date(article.date).toLocaleDateString()}</Text>
                  <Text>/</Text>
                  <Text>{article.readTime}</Text>
                </HStack>
                <br />
              </VStack>
            </Box>
          ))}
        </Grid>
      </Box>
    </StudioSection>
  );
};

export default Articles;
