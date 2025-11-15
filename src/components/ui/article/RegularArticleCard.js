// src/components/ui/RegularArticleCard.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  useColorModeValue,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiClock, FiArrowUpRight, FiCalendar } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const RegularArticleCard = ({ article, delay = 0 }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("brand.600", "brand.400");
  const overlayBg = useColorModeValue(
    "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)",
    "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.95) 100%)"
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      h="100%"
    >
      <Box
        overflow="hidden"
        bg={cardBg}
        h="100%"
        display="flex"
        flexDirection="column"
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          transform: "translateY(-4px)",
        }}
        cursor="pointer"
        role="group"
        position="relative"
      >
        {/* Image Container with Overlay Content */}
        <Box
          position="relative"
          overflow="hidden"
          h={{ base: "320px", md: "380px" }}
          bg="gray.900"
        >
          <LazyLoadImage
            src={article.image}
            alt={article.title}
            effect="blur"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            wrapperClassName="article-image-wrapper"
          />

          {/* Gradient Overlay */}
          <Box
            position="absolute"
            inset={0}
            background={overlayBg}
            transition="opacity 0.4s ease"
          />

          {/* Category Badge - Top */}
          <Badge
            position="absolute"
            top={4}
            left={4}
            colorScheme="brand"
            fontSize={{ base: "10px", md: "xs" }}
            px={3}
            py={1.5}
            borderRadius="sm"
            fontWeight="800"
            textTransform="uppercase"
            letterSpacing="wider"
            bg="white"
            color="gray.900"
            boxShadow="lg"
          >
            {article.categoryLabel}
          </Badge>

          {/* Content Overlay - Bottom */}
          <VStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={{ base: 5, md: 6 }}
            spacing={3}
            align="stretch"
            transition="transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _groupHover={{
              transform: "translateY(-8px)",
            }}
          >
            {/* Meta Info */}
            <HStack spacing={4} fontSize="xs" color="gray.300" fontWeight="600">
              <HStack spacing={1.5}>
                <Icon as={FiCalendar} boxSize={3.5} />
                <Text>{formatDate(article.date)}</Text>
              </HStack>
              <HStack spacing={1.5}>
                <Icon as={FiClock} boxSize={3.5} />
                <Text>{article.readTime}</Text>
              </HStack>
            </HStack>

            {/* Title */}
            <Heading
              as="h3"
              fontSize={{ base: "xl", md: "2xl" }}
              color="white"
              fontWeight="bold"
              lineHeight="1.2"
              noOfLines={2}
              letterSpacing="-0.02em"
            >
              {article.title}
            </Heading>

            {/* Excerpt */}
            <Text
              color="gray.300"
              fontSize={{ base: "sm", md: "md" }}
              noOfLines={2}
              lineHeight="1.6"
              fontWeight="400"
            >
              {article.excerpt}
            </Text>

            {/* Read More Arrow */}
            <HStack
              spacing={2}
              color="white"
              fontSize="sm"
              fontWeight="700"
              transition="all 0.3s ease"
              _groupHover={{
                color: accentColor,
                transform: "translateX(4px)",
              }}
            >
              <Text letterSpacing="wide">READ ARTICLE</Text>
              <Icon
                as={FiArrowUpRight}
                boxSize={4}
                transition="transform 0.3s ease"
                _groupHover={{
                  transform: "translate(2px, -2px)",
                }}
              />
            </HStack>
          </VStack>

          {/* Hover Effect Border */}
          <Box
            position="absolute"
            inset={0}
            borderWidth="2px"
            borderColor="transparent"
            transition="border-color 0.3s ease"
            _groupHover={{
              borderColor: accentColor,
            }}
            pointerEvents="none"
          />
        </Box>
      </Box>

      <style jsx>{`
        .article-image-wrapper:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </MotionBox>
  );
};

export default RegularArticleCard;
