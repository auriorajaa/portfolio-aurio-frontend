import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const SkillCard = ({ skill, categoryColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue(
    `${categoryColor}.50`,
    `${categoryColor}.900`
  );

  const MotionBox = motion(Box);

  const levelColors = {
    Advanced: "green",
    Proficient: "blue",
    Intermediate: "orange",
  };

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={isHovered ? `${categoryColor}.400` : borderColor}
        borderRadius="xl"
        p={{ base: 4, md: 5 }}
        h="100%"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "xl",
          bg: hoverBg,
        }}
        cursor="pointer"
      >
        <VStack spacing={3} align="stretch" h="100%">
          <HStack spacing={3} justify="space-between" minW="0" w="100%">
            <HStack spacing={3} flex={1} minW="0">
              <Box
                p={2}
                bg={`${categoryColor}.100`}
                borderRadius="lg"
                color={`${categoryColor}.600`}
              >
                <Icon as={skill.icon} boxSize={{ base: 5, md: 6 }} />
              </Box>

              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="700"
                color={textPrimary}
                noOfLines={1}
                minW="0"
              >
                {skill.name}
              </Text>
            </HStack>

            <Badge
              colorScheme={levelColors[skill.level]}
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              whiteSpace="normal"
              overflowWrap="break-word"
              wordBreak="break-word"
              maxW="80%" // biar aman di layar kecil
              textAlign="right"
            >
              {skill.level}
            </Badge>
          </HStack>

          <VStack spacing={2} align="stretch" flex={1}>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color={textSecondary}
              fontWeight="500"
              lineHeight="tall"
            >
              {skill.description}
            </Text>
            <HStack spacing={2}>
              <Icon
                as={FiCheckCircle}
                color={`${categoryColor}.500`}
                boxSize={3}
              />
              <Text
                fontSize="xs"
                color={textSecondary}
                fontStyle="italic"
                fontWeight="500"
              >
                {skill.context}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </MotionBox>
  );
};
export default SkillCard;
