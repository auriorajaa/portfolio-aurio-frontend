// src/components/ui/TimelineItem.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MotionBox = motion(Box);

const TimelineItem = ({ item, index }) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#b8bfd3ff");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");
  const iconBg = useColorModeValue(`${item.color}.100`, `${item.color}.600`);
  const iconColor = useColorModeValue(`${item.color}.600`, `${item.color}.300`);

  const isEven = index % 2 === 0;

  return (
    <Box
      display={{ base: "block", md: "grid" }}
      gridTemplateColumns={{ md: "1fr 80px 1fr" }}
      gap={{ md: 8 }}
      pl={{ base: "60px", md: "0" }}
    >
      {isEven && <Box display={{ base: "none", md: "block" }} />}

      <Box display={{ base: "none", md: "block" }} />

      {/* Timeline Node */}
      <Box
        position="absolute"
        left={{ base: "-2", md: "50%" }}
        top="20px"
        transform={{ base: "none", md: "translateX(-50%)" }}
        zIndex={2}
      >
        <MotionBox
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={iconBg}
          borderRadius="full"
          p={3}
          border="4px solid"
          borderColor={cardBg}
          boxShadow="lg"
        >
          <GraduationCap size={24} color={iconColor} />
        </MotionBox>
      </Box>

      {/* Card Content */}
      <MotionBox
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        bg={cardBg}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        p={{ base: 5, md: 6 }}
        boxShadow="lg"
        position="relative"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "2xl",
          borderColor: `${item.color}.400`,
        }}
        transitionProperty="all"
        transitionDuration="0.3s"
        transitionTimingFunction="ease"
        gridColumn={{ md: isEven ? "3" : "1" }}
        overflow="hidden"
        w="full"
      >
        {/* Logo Section */}
        {item.logo && (
          <Box
            mb={item.status ? { base: 3, md: 4 } : 4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Box
              p={3}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxSize={{ base: "80px", md: "100px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LazyLoadImage
                src={item.logo}
                alt={`${item.title} Logo`}
                effect="blur"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.3)",
                }}
              />
            </Box>

            {/* Status Badge — mobile only */}
            {item.status && (
              <Badge
                display={{ base: "inline-block", md: "none" }}
                mt={3}
                colorScheme={item.status === "Current" ? "green" : "gray"}
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
                textAlign="center"
              >
                {item.status}
              </Badge>
            )}
          </Box>
        )}

        {/* Status Badge — desktop only */}
        {item.status && (
          <Badge
            display={{ base: "none", md: "inline-block" }}
            position="absolute"
            top={4}
            right={3}
            colorScheme={item.status === "Current" ? "green" : "gray"}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
          >
            {item.status}
          </Badge>
        )}

        {/* Text Content */}
        <VStack
          align={{ base: "center", md: "flex-start" }}
          spacing={3}
          textAlign={{ base: "center", md: "left" }}
          w="full"
        >
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            color={textPrimary}
            fontWeight="bold"
            whiteSpace="normal"
            wordBreak="break-word"
            w="full"
          >
            {item.title}
          </Heading>

          {item.major && (
            <Text
              fontSize="md"
              fontWeight="semibold"
              color={`${item.color}.500`}
            >
              {item.major}
            </Text>
          )}

          <HStack
            spacing={4}
            flexWrap="wrap"
            justify={{ base: "center", md: "flex-start" }}
            w="full"
          >
            <Text fontSize="sm" color={textSecondary} fontWeight="500">
              {item.period}
            </Text>

            {item.gpa && (
              <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                GPA: {item.gpa}
              </Text>
            )}
          </HStack>

          {item.description && (
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textSecondary}
              lineHeight="1.7"
              whiteSpace="normal"
              wordBreak="break-word"
              w="full"
            >
              {item.description}
            </Text>
          )}

          {item.achievements && item.achievements.length > 0 && (
            <Box w="full">
              <HStack
                spacing={2}
                mb={2}
                justify={{ base: "center", md: "flex-start" }}
              >
                <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                  Achievements:
                </Text>
              </HStack>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent={{ base: "center", md: "flex-start" }}
                gap={2}
              >
                {item.achievements.map((achievement, idx) => (
                  <Badge
                    key={idx}
                    colorScheme={item.color}
                    variant="subtle"
                    px={3}
                    py={1}
                    fontSize="xs"
                    borderRadius="md"
                    whiteSpace="normal"
                    wordBreak="break-word"
                    maxW="100%"
                  >
                    {achievement}
                  </Badge>
                ))}
              </Box>
            </Box>
          )}
        </VStack>
      </MotionBox>

      {!isEven && <Box display={{ base: "none", md: "block" }} />}
    </Box>
  );
};

export default TimelineItem;
