// src/components/ui/TextOnlyArticleCard.js
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
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight, FiCalendar } from "react-icons/fi";

const MotionBox = motion(Box);

const TextOnlyArticleCard = ({ article, delay = 0 }) => {
  const textPrimary = useColorModeValue("gray.900", "white");
  const textSecondary = useColorModeValue("gray.500", "gray.400");
  const textBody = useColorModeValue("gray.700", "gray.300");
  const accentColor = useColorModeValue("brand.600", "brand.400");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Box
        py={{ base: 5, md: 6 }}
        px={{ base: 0, md: 2 }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        role="group"
        position="relative"
        _hover={{
          bg: hoverBg,
          px: { md: 6 },
        }}
        borderRadius="lg"
      >
        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {/* Category & Meta Info Row */}
          <HStack
            spacing={3}
            flexWrap="wrap"
            fontSize="xs"
            color={textSecondary}
            fontWeight="600"
            letterSpacing="wide"
          >
            <Badge
              colorScheme="brand"
              fontSize="10px"
              px={2.5}
              py={1}
              borderRadius="sm"
              fontWeight="800"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {article.categoryLabel}
            </Badge>
            <HStack spacing={1.5} color={textSecondary}>
              <Icon as={FiCalendar} boxSize={3} />
              <Text>{formatDate(article.date)}</Text>
            </HStack>
            <HStack spacing={1.5} color={textSecondary}>
              <Icon as={FiClock} boxSize={3} />
              <Text>{article.readTime}</Text>
            </HStack>
          </HStack>

          {/* Title */}
          <Heading
            as="h4"
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            color={textPrimary}
            fontWeight="bold"
            lineHeight="1.3"
            letterSpacing="-0.02em"
            noOfLines={2}
            transition="color 0.2s ease"
            _groupHover={{
              color: accentColor,
            }}
          >
            {article.title}
          </Heading>

          {/* Excerpt */}
          <Text
            color={textBody}
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
            noOfLines={{ base: 2, md: 3 }}
            fontWeight="400"
          >
            {article.excerpt}
          </Text>

          {/* Read More Link */}
          <HStack
            spacing={2}
            color={textSecondary}
            fontSize="sm"
            fontWeight="700"
            letterSpacing="wide"
            transition="all 0.3s ease"
            _groupHover={{
              color: accentColor,
              transform: "translateX(4px)",
            }}
          >
            <Text>READ MORE</Text>
            <Icon
              as={FiArrowRight}
              boxSize={4}
              transition="transform 0.3s ease"
              _groupHover={{
                transform: "translateX(4px)",
              }}
            />
          </HStack>
        </VStack>

        {/* Left Accent Line on Hover */}
        <Box
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          w="3px"
          h="0%"
          bg={accentColor}
          transition="height 0.3s ease"
          _groupHover={{
            h: "80%",
          }}
          borderRadius="full"
        />
      </Box>

      {/* Divider */}
      <Divider borderColor={borderColor} opacity={0.6} />
    </MotionBox>
  );
};

export default TextOnlyArticleCard;
