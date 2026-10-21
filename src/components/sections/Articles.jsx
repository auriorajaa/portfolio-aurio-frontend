import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getAllArticles } from "../../services/articleService";
import { LAGOON, LagoonSection, DoodleTape, DoodlePaperPlane, DoodleSquiggle } from "../public/studio";

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
      <LagoonSection id="articles" eyebrow="07 / writing" title="Writing">
        <Grid
          templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }}
          gap={{ base: 6, md: 8 }}
        >
          <Skeleton
            startColor={LAGOON.surfaceTint}
            endColor={LAGOON.borderSoft}
            height="320px"
            borderRadius="28px"
          />
          <Box pt={2}>
            <SkeletonText
              startColor={LAGOON.surfaceTint}
              endColor={LAGOON.borderSoft}
              spacing="4"
              skeletonHeight="5"
              noOfLines={6}
            />
          </Box>
        </Grid>
      </LagoonSection>
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
    <LagoonSection
      id="articles"
      tone="wash"
      eyebrow="07 / writing"
      title="Writing"
      description="Occasional notes on things I learn while building."
      headerAside={
        <Flex align="center" gap={2}>
          <DoodlePaperPlane size={34} />
          <Text
            className="public-hand"
            fontSize={{ base: "20px", md: "23px" }}
            fontWeight="600"
            color={LAGOON.coralDeep}
            transform="rotate(-2deg)"
            whiteSpace="nowrap"
          >
            hot off the press!
          </Text>
        </Flex>
      }
    >

      {/* Category filter */}
      <Flex gap={2} flexWrap="wrap" mb={{ base: 8, md: 10 }} data-reveal>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "lagoon" : "lagoonOutline"}
            size="sm"
            fontSize="14px"
            h="38px"
            px={5}
            onClick={() => setFilter(category)}
          >
            {category === "ALL" ? "All" : category}
          </Button>
        ))}
      </Flex>

      {/* Lead article — split card */}
      {leadArticle && (
        <Box
          as="article"
          role="link"
          tabIndex={0}
          aria-label={leadArticle.title}
          data-reveal
          bg="#FFFFFF"
          border="2px solid"
          borderColor={LAGOON.ink}
          borderRadius="20px"
          boxShadow="6px 6px 0 #0B2F2F"
          overflow="hidden"
          cursor="pointer"
          transition="box-shadow .18s ease, transform .18s ease"
          _hover={{
            boxShadow: "9px 9px 0 #0B2F2F",
            transform: "translate(-3px, -3px)",
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
          <DoodleTape
            w={96}
            h={24}
            color="rgba(255,200,87,0.85)"
            rotation={5}
            top="-13px"
            right="40px"
            zIndex={2}
          />
          <Flex align="center" gap={3} bg={LAGOON.heading} px={{ base: 5, md: 8 }} py="10px">
            <Text
              className="public-mono"
              fontSize="11px"
              fontWeight="600"
              color="#FFFFFF"
              letterSpacing=".18em"
              textTransform="uppercase"
            >
              Front page
            </Text>
            <Text className="public-mono" fontSize="11px" color="rgba(255,255,255,0.7)" ml="auto" noOfLines={1}>
              {leadArticle.date && formatDate(leadArticle.date)}
            </Text>
          </Flex>
          <Grid templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}>
            {leadArticle.image && (
              <Box
                aspectRatio={{ base: "16 / 9", lg: "auto" }}
                minH={{ lg: "340px" }}
                overflow="hidden"
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
              <Flex gap={3} align="center" mb={4}>
                {leadArticle.categoryLabel && (
                  <Text className="public-mono" fontSize="13px" fontWeight="500" color={LAGOON.coralDeep}>
                    {leadArticle.categoryLabel}
                  </Text>
                )}
              </Flex>

              <Text
                fontFamily="heading"
                fontSize={{ base: "26px", md: "34px" }}
                fontWeight="700"
                lineHeight="1.12"
                letterSpacing="-.03em"
                color={LAGOON.heading}
                noOfLines={3}
              >
                {leadArticle.title}
              </Text>

              {leadArticle.excerpt && (
                <Text
                  fontSize={{ base: "15px", md: "17px" }}
                  lineHeight="1.75"
                  color={LAGOON.text}
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
                borderTop="1px solid"
                borderColor={LAGOON.borderSoft}
                flexWrap="wrap"
              >
                <Text fontSize="14px" fontWeight="500" color={LAGOON.muted}>
                  {[formatDate(leadArticle.date), leadArticle.readTime]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
                <Text
                  display="inline-flex"
                  alignItems="center"
                  gap="5px"
                  fontSize="14px"
                  fontWeight="700"
                  color={LAGOON.primaryDark}
                  ml="auto"
                >
                  Read article
                  <ArrowUpRight size={15} />
                </Text>
              </Flex>
            </Flex>
          </Grid>
        </Box>
      )}

      {/* Grid */}
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
            border="1.5px solid"
            borderColor={LAGOON.ink}
            borderRadius="2px"
            borderTop="5px solid #0B2F2F"
            overflow="hidden"
            cursor="pointer"
            transition="box-shadow .16s ease, transform .16s ease"
            display="flex"
            flexDirection="column"
            _hover={{
              boxShadow: "5px 5px 0 #0B2F2F",
              transform: "translate(-2px, -2px)",
            }}
            onClick={() => navigate(`/article/${article.slug}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/article/${article.slug}`);
              }
            }}
          >
            <Flex align="center" justify="space-between" gap={3} px={{ base: 5, md: 6 }} pt={4} pb={3}>
              <Text
                className="public-mono"
                fontSize="10px"
                fontWeight="600"
                color={LAGOON.muted}
                letterSpacing=".16em"
                textTransform="uppercase"
                noOfLines={1}
              >
                {article.date ? formatDate(article.date) : ""}
              </Text>
              <Text
                className="public-mono"
                fontSize="10px"
                fontWeight="500"
                color={LAGOON.muted}
                letterSpacing=".16em"
                flexShrink={0}
              >
                {"№ "} {String(articleIndex + 2).padStart(3, "0")}
              </Text>
            </Flex>
            <Box mx={{ base: 5, md: 6 }} h="3px" borderTop="1.5px solid #0B2F2F" borderBottom="1.5px solid rgba(11,47,47,0.35)" />

            {article.image && (
              <Box mx={{ base: 5, md: 6 }} mt={5} position="relative">
                <DoodleTape
                  w={66}
                  h={16}
                  color={articleIndex % 2 === 0 ? "rgba(255,200,87,0.8)" : "rgba(14,140,134,0.55)"}
                  rotation={articleIndex % 2 === 0 ? -4 : 4}
                  top="-8px"
                  left="22px"
                  zIndex={1}
                />
                <Box
                  border="1.5px solid"
                  borderColor={LAGOON.ink}
                  borderRadius="4px"
                  overflow="hidden"
                  bg={LAGOON.surfaceTint}
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
                <Box
                  as="span"
                  display="inline-flex"
                  alignSelf="flex-start"
                  alignItems="center"
                  bg="#FFD34D"
                  border="1.5px solid #0B2F2F"
                  borderRadius="999px"
                  px="11px"
                  py="3px"
                  className="public-mono"
                  fontSize="10px"
                  fontWeight="600"
                  color="#0B2F2F"
                  letterSpacing=".12em"
                  textTransform="uppercase"
                  mb={3}
                >
                  {article.categoryLabel}
                </Box>
              )}
              <Text
                fontFamily="heading"
                fontSize={{ base: "21px", md: "23px" }}
                fontWeight="700"
                lineHeight="1.22"
                letterSpacing="-.02em"
                color={LAGOON.heading}
                noOfLines={2}
              >
                {article.title}
              </Text>
              <Box pt="5px" mb="1px">
                <DoodleSquiggle width={128} color={LAGOON.coral} />
              </Box>
              {article.excerpt && (
                <Text fontSize="14.5px" lineHeight="1.75" color={LAGOON.text} mt={4} noOfLines={3}>
                  {article.excerpt}
                </Text>
              )}

              <Box mt="auto" />
              <Box mt={5} borderBottom="1.5px dashed rgba(11,47,47,0.35)" />
              <Flex align="center" gap={3} pt={4}>
                <Text className="public-mono" fontSize="10px" fontWeight="500" color={LAGOON.muted} noOfLines={1}>
                  {[article.readTime, "fact-checked by fish"].filter(Boolean).join(" · ")}
                </Text>
                <Text
                  display="inline-flex"
                  alignItems="center"
                  gap="4px"
                  fontSize="13px"
                  fontWeight="700"
                  color={LAGOON.primaryDeep}
                  ml="auto"
                >
                  Read
                  <ArrowUpRight size={14} />
                </Text>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Box
          py={10}
          textAlign="center"
          bg="#FFFFFF"
          border="1.5px dashed"
          borderColor={LAGOON.ink}
          borderRadius="16px"
        >
          <DoodlePaperPlane size={44} transform="rotate(-14deg)" position="absolute" top="18px" right="26px" />
          {/* Pure-CSS envelope */}
          <Box
            aria-hidden="true"
            role="presentation"
            position="relative"
            w="150px"
            h="100px"
            mx="auto"
            mb={5}
          >
            {/* Body */}
            <Box
              position="absolute"
              inset={0}
              bg="#FFFFFF"
              border="2px solid #0B2F2F"
              borderRadius="10px"
              boxShadow="3px 3px 0 rgba(11,47,47,0.9)"
            />
            {/* Flap: ink under-triangle, then a wash face slightly
                smaller so the ink rim shows on the edges */}
            <Box
              position="absolute"
              top="2px"
              left="3px"
              w={0}
              h={0}
              borderLeft="71px solid transparent"
              borderRight="71px solid transparent"
              borderTop="50px solid #0B2F2F"
              borderRadius="6px"
            />
            <Box
              position="absolute"
              top="5px"
              left="6px"
              w={0}
              h={0}
              borderLeft="68px solid transparent"
              borderRight="68px solid transparent"
              borderTop="45px solid #D8F0EC"
            />
            {/* Wax seal */}
            <Box
              position="absolute"
              top="47px"
              left="50%"
              ml="-8px"
              w="16px"
              h="16px"
              borderRadius="full"
              bg="#FF6B4A"
              border="2px solid #0B2F2F"
              boxShadow="1.5px 1.5px 0 rgba(11,47,47,0.9)"
            />
            {/* Stamp */}
            <Box
              position="absolute"
              top="56px"
              right="10px"
              w="20px"
              h="24px"
              transform="rotate(4deg)"
              border="1.5px solid #0B2F2F"
              bg="#FFC857"
              borderRadius="3px"
              boxShadow="1.5px 1.5px 0 rgba(11,47,47,0.9)"
            />
            {/* Address lines */}
            <Box
              position="absolute"
              bottom="16px"
              left="14px"
              w="62px"
              h="2.5px"
              bg="rgba(11,47,47,0.28)"
              borderRadius="2px"
            />
            <Box
              position="absolute"
              bottom="8px"
              left="14px"
              w="42px"
              h="2.5px"
              bg="rgba(11,47,47,0.18)"
              borderRadius="2px"
            />
          </Box>
          <Text className="public-hand" fontSize="26px" fontWeight="600" color={LAGOON.primaryDeep} mb={1}>
            postbox is empty
          </Text>
          <Text fontSize="16px" color={LAGOON.muted}>
            No articles in this category yet.
          </Text>
        </Box>
      )}
    </LagoonSection>
  );
};

export default Articles;
