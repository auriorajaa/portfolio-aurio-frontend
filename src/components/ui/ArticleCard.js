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
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fadeInUp } from "../../utils/animations";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ArticleCard = ({
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
  link,
}) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#8892b0");
  const textBody = useColorModeValue("gray.700", "#ccd6f6");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");

  return (
    <ChakraBox
      {...fadeInUp}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      bg={cardBg}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "2xl",
        borderColor: "brand.500",
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        position="relative"
        overflow="hidden"
        role="group"
        h={{ base: "160px", md: "180px" }}
        bg="gray.900"
      >
        <LazyLoadImage
          src={image}
          alt={title}
          effect="blur"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s",
          }}
          className="group-hover:scale-110"
        />
        <Badge
          position="absolute"
          top={{ base: 2, md: 3 }}
          left={{ base: 2, md: 3 }}
          colorScheme="brand"
          fontSize={{ base: "2xs", md: "xs" }}
          px={{ base: 2, md: 3 }}
          py={1}
          borderRadius="md"
          fontWeight="600"
        >
          {category}
        </Badge>
      </Box>

      <Box
        p={{ base: 4, md: 5 }}
        flex="1"
        display="flex"
        flexDirection="column"
      >
        <Heading
          as="h3"
          fontSize={{ base: "md", md: "lg" }}
          mb={{ base: 2, md: 3 }}
          color={textPrimary}
          noOfLines={2}
          fontWeight="bold"
          lineHeight="1.3"
        >
          {title}
        </Heading>

        <Text
          mb={{ base: 3, md: 4 }}
          color={textBody}
          fontSize={{ base: "sm", md: "md" }}
          noOfLines={3}
          flex="1"
          lineHeight="1.7"
        >
          {excerpt}
        </Text>

        <HStack
          spacing={{ base: 3, md: 4 }}
          mb={{ base: 3, md: 4 }}
          fontSize={{ base: "xs", md: "sm" }}
          color={textSecondary}
          flexWrap="wrap"
        >
          <HStack>
            <Box as={FiClock} flexShrink={0} />
            <Text>{readTime}</Text>
          </HStack>
          <Text>{date}</Text>
        </HStack>

        <Button
          as="a"
          href={link}
          variant="ghost"
          size={{ base: "sm", md: "md" }}
          rightIcon={<FiArrowRight />}
          alignSelf="flex-start"
          mt="auto"
          colorScheme="brand"
          fontSize={{ base: "xs", md: "sm" }}
          _hover={{
            transform: "translateX(4px)",
          }}
          transition="all 0.2s"
        >
          Read More
        </Button>
      </Box>
    </ChakraBox>
  );
};

export default ArticleCard;
