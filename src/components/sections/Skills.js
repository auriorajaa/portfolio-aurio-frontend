import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  keyframes,
  Text,
  useColorModeValue,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { skillsData } from "../../data/portfolioData";

const MotionBox = motion(Box);

const SkillCategory = ({ category, skills }) => {
  const cardBg = useColorModeValue("white", "#112240");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={{ base: 4, md: 5, lg: 6 }}
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
        transition="all 0.3s ease-in-out"
        height="100%"
      >
        <Heading
          as="h3"
          fontSize={{ base: "lg", md: "xl" }}
          mb={{ base: 3, md: 4 }}
          color={textPrimary}
          fontWeight="bold"
        >
          {category}
        </Heading>
        <List spacing={{ base: 2, md: 3 }}>
          {skills.map((skill, index) => (
            <ListItem
              key={index}
              display="flex"
              alignItems="center"
              color={textSecondary}
              fontSize={{ base: "sm", md: "md" }}
            >
              <ListIcon
                as={FiCheck}
                color="green.500"
                fontSize={{ base: "md", md: "lg" }}
              />
              {skill}
            </ListItem>
          ))}
        </List>
      </Box>
    </MotionBox>
  );
};

const Skills = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");

  const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.50, brand.50, blue.100)",
    "linear(to-br, teal.900, brand.900, blue.900)"
  );

  return (
    <Box
      as="section"
      id="skills"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Blobs */}
      <Box
        position="absolute"
        top="25%"
        left="5%"
        w={{ base: "220px", md: "380px" }}
        h={{ base: "220px", md: "380px" }}
        bgGradient="radial(circle, purple.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.4, 0.2)}
        borderRadius="full"
        filter="blur(75px)"
        animation={`${floatingAnimation} 11s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="8%"
        w={{ base: "190px", md: "330px" }}
        h={{ base: "190px", md: "330px" }}
        bgGradient="radial(circle, pink.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.4, 0.2)}
        borderRadius="full"
        filter="blur(65px)"
        animation={`${floatingAnimation} 14s ease-in-out infinite reverse`}
      />
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            textAlign="center"
            color={textPrimary}
            fontWeight="bold"
          >
            Skills & Expertise
          </Heading>
          <Text
            maxW="container.md"
            textAlign="center"
            color={textSecondary}
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            lineHeight="tall"
            px={{ base: 4, md: 6, lg: 0 }}
          >
            My technical toolkit spans multiple domains with a focus on
            full-stack development and Java programming.
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 4, md: 6 }}
            w="100%"
          >
            {skillsData.map((category, index) => (
              <SkillCategory key={index} {...category} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Skills;
