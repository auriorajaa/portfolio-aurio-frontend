import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const ActivityCard = ({ activity }) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      width="100%"
      h="100%" // âœ… biar semua card punya tinggi sama dalam grid
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        h="100%"
        _hover={{
          transform: "translateY(-5px)",
          shadow: "2xl",
          borderColor: "brand.500",
        }}
        transition="all 0.3s ease-in-out"
      >
        {/* Image Section */}
        <Box
          position="relative"
          width="100%"
          pb="60%"
          bg="gray.900"
          overflow="hidden"
        >
          <LazyLoadImage
            src={
              activity.image ||
              "https://via.placeholder.com/800x600?text=Activity"
            }
            alt={activity.title}
            effect="blur"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="40%"
            bgGradient="linear(to-t, blackAlpha.700, transparent)"
          />
        </Box>

        {/* Content Section */}
        <Box
          p={{ base: 4, md: 5 }}
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <Heading
            color={textPrimary}
            as="h3"
            fontSize={{ base: "md", md: "lg" }}
            mb={{ base: 2, md: 3 }}
            fontWeight="bold"
            lineHeight="1.3"
            whiteSpace="normal"
            wordBreak="break-word"
            textAlign="left"
          >
            {activity.title}
          </Heading>

          {/* Role Badge */}
          <Box mb={{ base: 2, md: 3 }} textAlign="left">
            <Badge
              colorScheme="brand"
              fontSize={{ base: "xs" }}
              px={{ base: 2, md: 3 }}
              py={1}
              borderRadius="md"
              whiteSpace="normal"
              wordBreak="break-word"
              display="inline-block"
              maxW="100%"
            >
              {activity.role}
            </Badge>
          </Box>

          {/* Period */}
          <Flex
            alignItems="center"
            mb={{ base: 2, md: 3 }}
            gap={2}
            flexWrap="wrap"
          >
            <Box as={FiCalendar} flexShrink={0} />
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color={textSecondary}
              fontWeight="500"
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {activity.period}
            </Text>
          </Flex>

          {/* Description */}
          <Text
            color={textSecondary}
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.7"
            noOfLines={4}
            flex="1"
          >
            {activity.description}
          </Text>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default ActivityCard;
