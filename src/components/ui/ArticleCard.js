import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  Image,
  HStack,
  Button,
  useColorModeValue,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight, FiCalendar } from "react-icons/fi";

const MotionBox = motion(Box);

const ArticleCard = ({
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
  link,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const textBody = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("brand.500", "brand.400");
  const overlayGradient = useColorModeValue(
    "linear(to-b, transparent 0%, blackAlpha.600 100%)",
    "linear(to-b, transparent 0%, blackAlpha.800 100%)"
  );

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      h="100%"
    >
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        bg={cardBg}
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "2xl",
          borderColor: hoverBorderColor,
        }}
        h="100%"
        display="flex"
        flexDirection="column"
        cursor="pointer"
      >
        {/* Image Container */}
        <Box
          position="relative"
          overflow="hidden"
          h={{ base: "180px", md: "220px" }}
          bg="gray.900"
        >
          <Image
            src={image}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="transform 0.5s ease"
            _groupHover={{ transform: "scale(1.1)" }}
          />

          {/* Gradient Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient={overlayGradient}
          />

          {/* Category Badge */}
          <Badge
            position="absolute"
            top={{ base: 3, md: 4 }}
            left={{ base: 3, md: 4 }}
            colorScheme="brand"
            fontSize={{ base: "xs", md: "sm" }}
            px={{ base: 3, md: 4 }}
            py={{ base: 1, md: 2 }}
            borderRadius="lg"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="wide"
            shadow="lg"
          >
            {category}
          </Badge>
        </Box>

        {/* Content Container */}
        <VStack
          p={{ base: 5, md: 6 }}
          spacing={{ base: 3, md: 4 }}
          align="stretch"
          flex="1"
        >
          {/* Title */}
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            color={textPrimary}
            noOfLines={2}
            fontWeight="bold"
            lineHeight="1.4"
            minH={{ base: "56px", md: "64px" }}
          >
            {title}
          </Heading>

          {/* Excerpt */}
          <Text
            color={textBody}
            fontSize={{ base: "sm", md: "md" }}
            noOfLines={3}
            lineHeight="1.7"
            flex="1"
            minH={{ base: "60px", md: "72px" }}
          >
            {excerpt}
          </Text>

          {/* Meta Info */}
          <HStack
            spacing={{ base: 4, md: 6 }}
            pt={{ base: 2, md: 3 }}
            borderTopWidth="1px"
            borderColor={borderColor}
            fontSize={{ base: "xs", md: "sm" }}
            color={textSecondary}
            flexWrap="wrap"
          >
            <HStack spacing={2}>
              <Icon as={FiCalendar} />
              <Text fontWeight="medium">{date}</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiClock} />
              <Text fontWeight="medium">{readTime}</Text>
            </HStack>
          </HStack>

          {/* Read More Button */}
          <Button
            as="a"
            href={link}
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            rightIcon={<FiArrowRight />}
            colorScheme="brand"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="600"
            justifyContent="flex-start"
            px={0}
            _hover={{
              transform: "translateX(8px)",
              color: hoverBorderColor,
            }}
            transition="all 0.3s"
          >
            Read Article
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default ArticleCard;
