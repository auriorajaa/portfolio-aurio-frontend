import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getAllArticles } from "../../services/articleService";
import {
  BRUT,
  BrutSection,
  BrutTag,
  DoodlePaperPlane,
  StickerTape,
  usePublicColors,
} from "../public/brutal";

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
  const colors = usePublicColors();

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
      <BrutSection id="articles" number="06" kicker="the press room" title="Writing">
        <Grid
          templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }}
          gap={{ base: 6, md: 8 }}
        >
          <Skeleton
            startColor={colors.blueSoft}
            endColor={colors.primarySoft}
            height="310px"
            borderRadius="10px"
            border="2px solid"
            borderColor={BRUT.ink}
          />
          <Box pt={2}>
            <SkeletonText
              startColor={colors.blueSoft}
              endColor={colors.primarySoft}
              spacing="4"
              skeletonHeight="5"
              noOfLines={6}
            />
          </Box>
        </Grid>
      </BrutSection>
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
    <BrutSection
      id="articles"
      number="06"
      kicker="THE PRESS ROOM"
      title="Writing"
      description="Occasional notes on things I learn while building."
      tone="paper"
    >
      {/* Category filter */}
      <Flex gap={2} flexWrap="wrap" mb={{ base: 8, md: 10 }} data-reveal>
        {categories.map((category, index) => {
          const active = filter === category;
          const tint = [colors.yellow, colors.primarySoft, colors.blueSoft, colors.coralSoft, colors.limeSoft][index % 5];
          return (
            <Button
              key={category}
              size="sm"
              fontSize="12px"
              h="38px"
              px={4}
              fontFamily="spaceMono"
              fontWeight="700"
              letterSpacing=".06em"
              textTransform="uppercase"
              borderRadius="6px"
              border="2px solid"
              borderColor={BRUT.ink}
              bg={active ? colors.primary : "#FFFFFF"}
              color={active ? "#FFFFFF" : colors.heading}
              boxShadow={BRUT.shadowXs}
              transition="all .15s ease"
              _hover={{
                bg: active ? colors.primaryDeep : tint,
                transform: "translate(-1px, -1px)",
                boxShadow: BRUT.shadow,
              }}
              onClick={() => setFilter(category)}
            >
              {category === "ALL" ? "All" : category}
            </Button>
          );
        })}
      </Flex>

      {/* Lead article — front page */}
      {leadArticle && (
        <Box
          as="article"
          role="link"
          tabIndex={0}
          aria-label={leadArticle.title}
          data-reveal
          bg="#FFFFFF"
          border="2.5px solid"
          borderColor={BRUT.ink}
          borderRadius="10px"
          boxShadow={BRUT.shadowLg}
          overflow="hidden"
          cursor="pointer"
          transition="box-shadow .18s ease, transform .18s ease"
          _hover={{
            boxShadow: "10px 10px 0 #17181C",
            transform: "translate(-4px, -4px)",
          }}
          onClick={() => navigate(`/article/${leadArticle.slug}`)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate(`/article/${leadArticle.slug}`);
            }
          }}
          mb={{ base: 8, md: 10 }}
          position="relative"
        >
          <StickerTape
            w={96}
            h={24}
            color="rgba(255,210,63,0.8)"

            top="-13px"
            right="40px"
            zIndex={2}
          />
          <Flex align="center" gap={3} bg={BRUT.ink} px={{ base: 5, md: 8 }} py="11px">
            <Text
              fontFamily="bungee"
              fontSize="11px"
              color={colors.yellow}
              letterSpacing=".14em"
            >
              FRONT PAGE
            </Text>
            <Text fontFamily="spaceMono" fontSize="11px" fontWeight="700" color={colors.onDarkMuted} ml="auto" noOfLines={1}>
              {leadArticle.date && formatDate(leadArticle.date)}
            </Text>
          </Flex>
          <Grid templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}>
            {leadArticle.image && (
              <Box
                aspectRatio={{ base: "16 / 9", lg: "auto" }}
                minH={{ lg: "340px" }}
                overflow="hidden"
                borderBottom={{ base: "2.5px solid", lg: "none" }}
                borderRight={{ base: "none", lg: "2.5px solid" }}
                borderColor={BRUT.ink}
              >
                <img
                  src={leadArticle.image}
                  alt={leadArticle.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            <Flex direction="column" justify="center" p={{ base: 6, md: 10 }}>
              {leadArticle.categoryLabel && (
                <BrutTag tone="yellow" mb={4} alignSelf="flex-start">
                  {leadArticle.categoryLabel}
                </BrutTag>
              )}

              <Text
                fontFamily="bungee"
                fontSize={{ base: "20px", md: "27px" }}
                lineHeight="1.2"
                color={BRUT.ink}
                noOfLines={4}
              >
                {leadArticle.title}
              </Text>

              {leadArticle.excerpt && (
                <Text
                  fontSize={{ base: "16.5px", md: "17.5px" }}
                  lineHeight="1.75"
                  color={colors.text}
                  mt={4}
                  noOfLines={3}
                >
                  {leadArticle.excerpt}
                </Text>
              )}

              <Flex
                align="center"
                gap={4}
                mt={7}
                pt={5}
                borderTop="2px dashed"
                borderColor={colors.borderDashed}
                flexWrap="wrap"
              >
                <Text fontFamily="spaceMono" fontSize="13.5px" fontWeight="700" color={BRUT.ink}>
                  {[formatDate(leadArticle.date), leadArticle.readTime]
                    .filter(Boolean)
                    .join(" / ")}
                </Text>
                <Flex
                  align="center"
                  gap="6px"
                  ml="auto"
                  bg={BRUT.primary}
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="6px"
                  px="13px"
                  py="6px"
                  boxShadow={BRUT.shadowXs}
                  transition="transform .15s ease, box-shadow .15s ease"
                  _hover={{ transform: "translate(-1px, -1px)", boxShadow: BRUT.shadow }}
                >
                  <Text
                    fontFamily="spaceMono"
                    fontSize="12.5px"
                    fontWeight="700"
                    letterSpacing=".04em"
                    textTransform="uppercase"
                    color="#FFFFFF"
                  >
                    Read article
                  </Text>
                  <ArrowUpRight size={14} color="#FFFFFF" />
                </Flex>
              </Flex>
            </Flex>
          </Grid>
        </Box>
      )}

      {/* Grid — ticket-stub cards */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
        gap={{ base: 6, md: 7 }}
      >
        {listArticles.map((article, articleIndex) => (
          <Box
            key={article.id}
            as="article"
            role="link"
            tabIndex={0}
            aria-label={article.title}
            data-reveal
            bg="#FFFFFF"
            border="2px solid"
            borderColor={BRUT.ink}
            borderRadius="10px"
            overflow="hidden"
            cursor="pointer"
            transition="box-shadow .16s ease, transform .16s ease"
            display="flex"
            flexDirection="column"
            _hover={{
              boxShadow: "7px 7px 0 #17181C",
              transform: "translate(-3px, -3px)",
            }}
            onClick={() => navigate(`/article/${article.slug}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/article/${article.slug}`);
              }
            }}
          >
            {/* Perforated header */}
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              px={{ base: 5, md: 6 }}
              py={3}
              bg={articleIndex % 2 === 0 ? colors.yellow : colors.blueSoft}
              borderBottom="2px solid"
              borderColor={BRUT.ink}
            >
              <Text
                fontFamily="spaceMono"
                fontSize="11.5px"
                fontWeight="700"
                color={BRUT.ink}
                letterSpacing=".14em"
                textTransform="uppercase"
                noOfLines={1}
              >
                {article.date ? formatDate(article.date) : "undated"}
              </Text>
              <Text
                fontFamily="spaceMono"
                fontSize="11.5px"
                fontWeight="700"
                color={BRUT.ink}
                letterSpacing=".12em"
                flexShrink={0}
              >
                {"№ "}{String(articleIndex + 2).padStart(3, "0")}
              </Text>
            </Flex>

            {article.image && (
              <Box mx={{ base: 5, md: 6 }} mt={5} position="relative">
                <StickerTape
                  w={64}
                  h={16}
                  color={articleIndex % 2 === 0 ? "rgba(255,210,63,0.8)" : "rgba(77,124,255,0.6)"}

                  top="-8px"
                  left="22px"
                  zIndex={1}
                />
                <Box
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="6px"
                  overflow="hidden"
                  bg={colors.bgWash}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "16 / 8",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            )}

            <Flex direction="column" flex="1" px={{ base: 5, md: 6 }} pt={5} pb={5}>
              {article.categoryLabel && (
                <BrutTag tone="lime" mb={3} alignSelf="flex-start">
                  {article.categoryLabel}
                </BrutTag>
              )}
              <Text
                fontFamily="bungee"
                fontSize={{ base: "16.5px", md: "17.5px" }}
                lineHeight="1.35"
                color={BRUT.ink}
                noOfLines={3}
              >
                {article.title}
              </Text>

              {article.excerpt && (
                <Text fontSize="16px" lineHeight="1.75" color={colors.text} mt={3} noOfLines={3}>
                  {article.excerpt}
                </Text>
              )}

              <Box mt="auto" />
              <Box mt={5} borderBottom="2px dashed rgba(23,24,28,0.3)" />
              <Flex align="center" gap={3} pt={4}>
                <Text
                  fontFamily="spaceMono"
                  fontSize="12px"
                  fontWeight="700"
                  color={BRUT.ink}
                  letterSpacing=".04em"
                  noOfLines={1}
                >
                  {[article.readTime, "FACT-CHECKED BY DUCKS"].filter(Boolean).join(" / ")}
                </Text>
                <Flex
                  align="center"
                  gap="4px"
                  ml="auto"
                  bg={BRUT.primary}
                  border="2px solid"
                  borderColor={BRUT.ink}
                  borderRadius="6px"
                  px="11px"
                  py="5px"
                  boxShadow={BRUT.shadowXs}
                  transition="transform .15s ease, box-shadow .15s ease"
                  _hover={{ transform: "translate(-1px, -1px)", boxShadow: BRUT.shadow }}
                >
                  <Text
                    fontFamily="spaceMono"
                    fontSize="11.5px"
                    fontWeight="700"
                    color="#FFFFFF"
                  >
                    READ
                  </Text>
                  <ArrowUpRight size={13} color="#FFFFFF" />
                </Flex>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Box
          py={10}
          px={6}
          textAlign="center"
          bg={colors.bgWash}
          border="2px dashed"
          borderColor={BRUT.ink}
          borderRadius="10px"
          position="relative"
        >
          <DoodlePaperPlane
            size={46}

            position="absolute"
            top="18px"
            right="26px"
          />
          <Text fontFamily="bungee" fontSize={{ base: "18px", md: "22px" }} color={colors.primaryDeep} mb={1}>
            POSTBOX IS EMPTY
          </Text>
          <Text fontSize="16px" color={BRUT.inkSoft}>
            No articles in this category yet.
          </Text>
        </Box>
      )}
    </BrutSection>
  );
};

export default Articles;
