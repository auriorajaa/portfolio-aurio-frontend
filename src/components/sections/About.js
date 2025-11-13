import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { personalInfo } from "../../data/portfolioData";

const MotionBox = motion(Box);

const About = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "#112240");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgGradient = useColorModeValue(
    "linear(to-br, brand.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );

  const stats = [
    {
      label: "Projects Completed",
      value: "12+",
      help: "Including course projects",
    },
    {
      label: "Technologies",
      value: "15+",
      help: "Different tools & frameworks",
    },
    {
      label: "Certifications",
      value: "8",
      help: "Professional certifications",
    },
  ];

  return (
    <Box
      as="section"
      id="about"
      bgGradient={bgGradient}
      py={{ base: 12, md: 16, lg: 20 }}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            w="full"
          >
            <Heading
              as="h2"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              color={textPrimary}
              mb={{ base: 4, md: 6 }}
              fontWeight="bold"
            >
              About Me
            </Heading>
            <Text
              maxW="container.md"
              mx="auto"
              color={textSecondary}
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="tall"
              px={{ base: 4, md: 6, lg: 0 }}
            >
              I'm a passionate software engineering student with a strong focus
              on full-stack development. I love creating efficient, scalable
              solutions and continuously learning new technologies to stay at
              the forefront of web development.
            </Text>
          </MotionBox>

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
            w="full"
            maxW="container.lg"
          >
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Stat
                  px={{ base: 4, md: 6 }}
                  py={{ base: 4, md: 5 }}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  shadow="md"
                  textAlign="center"
                  _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
                  transition="all 0.3s ease-in-out"
                  height="100%"
                >
                  <StatNumber
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color="brand.500"
                    mb={1}
                  >
                    {stat.value}
                  </StatNumber>
                  <StatLabel
                    fontWeight="medium"
                    color={textPrimary}
                    fontSize={{ base: "sm", md: "md" }}
                    mb={1}
                  >
                    {stat.label}
                  </StatLabel>
                  <StatHelpText
                    color={textSecondary}
                    fontSize={{ base: "xs", md: "sm" }}
                    mb={0}
                  >
                    {stat.help}
                  </StatHelpText>
                </Stat>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;
