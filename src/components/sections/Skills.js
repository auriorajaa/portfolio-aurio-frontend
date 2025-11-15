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
  HStack,
  Icon,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  SiSpringboot,
  SiDjango,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiReact,
  SiNextdotjs,
  SiBootstrap,
  SiTailwindcss,
  SiSpring,
  SiAndroid,
  SiGit,
  SiGithub,
  SiGooglecloud,
  SiMarkdown,
  SiMysql,
  SiRedis,
  SiJsonwebtokens,
} from "react-icons/si";
import {
  FiDatabase,
  FiShield,
  FiLayers,
  FiCode,
  FiLayout,
  FiTool,
  FiServer,
  FiCpu,
} from "react-icons/fi";
import { skillDetails } from "../../data/portfolioData";
import { skillsData } from "../../data/portfolioData";
import SkillCard from "../ui/skill/SkillCard";

const MotionBox = motion(Box);

// Icon mapping
const skillIconMap = {
  "Spring Boot REST API": SiSpringboot,
  "Django REST Framework": SiDjango,
  "API Design": FiLayers,
  "SQL & NoSQL Databases": FiDatabase,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  Redis: SiRedis,
  "Authentication & Security": FiShield,
  "JWT Auth": SiJsonwebtokens,
  "Docker & Containerization": SiDocker,
  "React.js": SiReact,
  "Next.js": SiNextdotjs,
  Bootstrap: SiBootstrap,
  "Tailwind CSS": SiTailwindcss,
  "Responsive Design": FiLayout,
  "Core Java": FiCpu,
  "Spring Framework": SiSpring,
  "Java Swing": FiCode,
  "Native Android Java": SiAndroid,
  "Git & GitHub": SiGit,
  GitHub: SiGithub,
  "Google Cloud Services": SiGooglecloud,
  "Technical Documentation": SiMarkdown,
};

const enhanceSkillsData = (data) => {
  const categoryConfig = {
    Backend: { icon: FiServer, color: "green" },
    Frontend: { icon: FiLayout, color: "blue" },
    Java: { icon: FiCode, color: "orange" },
    Tools: { icon: FiTool, color: "purple" },
  };

  return data.map((category) => ({
    ...category,
    ...categoryConfig[category.category],
    skills: category.skills.map((skillName) => ({
      name: skillName,
      icon: skillIconMap[skillName] || FiCode,
      ...skillDetails[skillName],
    })),
  }));
};

const skillsDataEnhanced = enhanceSkillsData(skillsData);

const CategorySection = ({ category }) => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const sectionBg = useColorModeValue("whiteAlpha.600", "whiteAlpha.50");
  const iconBg = useColorModeValue(
    `${category.color}.100`,
    `${category.color}.900`
  );
  const iconColor = useColorModeValue(
    `${category.color}.600`,
    `${category.color}.300`
  );

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box
        bg={sectionBg}
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        p={{ base: 6, md: 8 }}
        mb={{ base: 6, md: 8 }}
      >
        <HStack spacing={4} mb={{ base: 6, md: 8 }}>
          <Box
            p={{ base: 3, md: 4 }}
            bg={iconBg}
            borderRadius="xl"
            color={iconColor}
          >
            <Icon as={category.icon} boxSize={{ base: 6, md: 8 }} />
          </Box>
          <VStack align="start" spacing={1}>
            <Heading
              as="h3"
              fontSize={{ base: "xl", md: "2xl" }}
              color={textPrimary}
              fontWeight="bold"
            >
              {category.category}
            </Heading>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
              {category.skills.length} Core Technologies
            </Text>
          </VStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 5 }}>
          {category.skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              categoryColor={category.color}
            />
          ))}
        </SimpleGrid>
      </Box>
    </MotionBox>
  );
};

const Skills = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const tabBg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const blobOpacity = useColorModeValue(0.4, 0.2);
  const capsuleHoverBg = useColorModeValue("50", "900");

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
        opacity={blobOpacity}
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
        opacity={blobOpacity}
        borderRadius="full"
        filter="blur(65px)"
        animation={`${floatingAnimation} 14s ease-in-out infinite reverse`}
      />

      <Container
        maxW="container.xl"
        px={{ base: 4, md: 6, lg: 8 }}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading
              as="h2"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              color={textPrimary}
              fontWeight="bold"
              mb={4}
            >
              Skills & Expertise
            </Heading>
            <Text
              maxW="container.md"
              mx="auto"
              color={textSecondary}
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              lineHeight="tall"
              px={{ base: 4, md: 6, lg: 0 }}
            >
              Specialized in Java backend development with Spring Boot,
              full-stack web applications, and cloud computing. Built through
              academic training and hands-on project experience.
            </Text>
          </MotionBox>

          {/* Tabs Section */}
          <Box w="100%">
            <Tabs
              variant="soft-rounded"
              colorScheme="brand"
              isFitted={{ base: false, md: true }}
            >
              <TabList
                mb={{ base: 6, md: 8 }}
                flexWrap="wrap"
                gap={2}
                bg={tabBg}
                p={{ base: 2, md: 3 }}
                borderRadius="xl"
              >
                <Tab
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="600"
                  _selected={{
                    bg: "brand.500",
                    color: "white",
                  }}
                >
                  All
                </Tab>
                {skillsDataEnhanced.map((category, index) => (
                  <Tab
                    key={index}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="600"
                    _selected={{
                      bg: `${category.color}.500`,
                      color: "white",
                    }}
                  >
                    <HStack spacing={2}>
                      <Icon as={category.icon} boxSize={4} />
                      <Text>{category.category}</Text>
                    </HStack>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {/* All Skills Panel - Responsive Layout */}
                <TabPanel px={0}>
                  {/* Mobile: Compact Grid */}
                  <SimpleGrid
                    columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
                    spacing={{ base: 3, md: 4 }}
                    display={{ base: "grid", lg: "none" }}
                  >
                    {skillsDataEnhanced.flatMap((category, catIndex) =>
                      category.skills.map((skill, skillIndex) => {
                        const globalIndex =
                          skillsDataEnhanced
                            .slice(0, catIndex)
                            .reduce((acc, cat) => acc + cat.skills.length, 0) +
                          skillIndex;

                        return (
                          <MotionBox
                            key={`${category.category}-${skillIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.3,
                              delay: globalIndex * 0.02,
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <VStack
                              bg={cardBg}
                              p={3}
                              borderRadius="xl"
                              borderWidth="2px"
                              borderColor={`${category.color}.200`}
                              spacing={2}
                              _hover={{
                                borderColor: `${category.color}.400`,
                                bg: `${category.color}.${capsuleHoverBg}`,
                              }}
                              transition="all 0.3s"
                              cursor="pointer"
                              h="100%"
                              justify="space-between"
                            >
                              <Box
                                p={2}
                                bg={`${category.color}.100`}
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                w="100%"
                              >
                                <Icon
                                  as={skill.icon}
                                  boxSize={6}
                                  color={`${category.color}.600`}
                                />
                              </Box>
                              <Text
                                fontSize="xs"
                                fontWeight="600"
                                color={textPrimary}
                                textAlign="center"
                                noOfLines={2}
                                lineHeight="tight"
                              >
                                {skill.name}
                              </Text>
                              <Badge
                                colorScheme={
                                  skill.level === "Advanced"
                                    ? "green"
                                    : skill.level === "Proficient"
                                    ? "blue"
                                    : "orange"
                                }
                                fontSize="2xs"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                              >
                                {skill.level}
                              </Badge>
                            </VStack>
                          </MotionBox>
                        );
                      })
                    )}
                  </SimpleGrid>

                  {/* Desktop: Capsule Layout */}
                  <Flex
                    wrap="wrap"
                    gap={4}
                    justify="center"
                    align="center"
                    display={{ base: "none", lg: "flex" }}
                  >
                    {skillsDataEnhanced.flatMap((category, catIndex) =>
                      category.skills.map((skill, skillIndex) => {
                        const globalIndex =
                          skillsDataEnhanced
                            .slice(0, catIndex)
                            .reduce((acc, cat) => acc + cat.skills.length, 0) +
                          skillIndex;

                        return (
                          <MotionBox
                            key={`${category.category}-${skillIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.3,
                              delay: globalIndex * 0.02,
                            }}
                            whileHover={{ scale: 1.08, y: -3 }}
                          >
                            <HStack
                              bg={cardBg}
                              px={5}
                              py={3}
                              borderRadius="full"
                              shadow="md"
                              borderWidth="2px"
                              borderColor={`${category.color}.200`}
                              spacing={3}
                              _hover={{
                                borderColor: `${category.color}.400`,
                                shadow: "xl",
                                bg: `${category.color}.${capsuleHoverBg}`,
                              }}
                              transition="all 0.3s"
                              cursor="pointer"
                            >
                              <Box
                                p={2}
                                bg={`${category.color}.100`}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Icon
                                  as={skill.icon}
                                  boxSize={5}
                                  color={`${category.color}.600`}
                                />
                              </Box>
                              <Text
                                fontSize="md"
                                fontWeight="600"
                                color={textPrimary}
                                whiteSpace="nowrap"
                              >
                                {skill.name}
                              </Text>
                              <Badge
                                colorScheme={
                                  skill.level === "Advanced"
                                    ? "green"
                                    : skill.level === "Proficient"
                                    ? "blue"
                                    : "orange"
                                }
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="full"
                              >
                                {skill.level}
                              </Badge>
                            </HStack>
                          </MotionBox>
                        );
                      })
                    )}
                  </Flex>
                </TabPanel>

                {/* Individual Category Panels */}
                {skillsDataEnhanced.map((category, index) => (
                  <TabPanel key={index} px={0}>
                    <CategorySection category={category} />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>

          {/* Educational Foundation */}
          {/* <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            w="100%"
          >
            <Box
              bg={cardBg}
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              shadow="xl"
              borderWidth="2px"
              borderColor="brand.200"
            >
              <HStack spacing={3} mb={6}>
                <Icon as={FiAward} boxSize={6} color="brand.500" />
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={textPrimary}
                >
                  Educational Foundation
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                    3.50 GPA
                  </Badge>
                  <Text fontWeight="700" color={textPrimary}>
                    Polytechnic State of Jakarta
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Web programming, computer science fundamentals, and software
                    engineering principles
                  </Text>
                </VStack>

                <VStack align="start" spacing={2}>
                  <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                    3.40 GPA
                  </Badge>
                  <Text fontWeight="700" color={textPrimary}>
                    University of Indonesia (CCIT-FTUI)
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Java programming, Android development, data structures, and
                    databases
                  </Text>
                </VStack>

                <VStack align="start" spacing={2}>
                  <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                    89/100 Score
                  </Badge>
                  <Text fontWeight="700" color={textPrimary}>
                    Bangkit Academy (Google)
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Backend API development, ML integration, and Google Cloud
                    Services
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </MotionBox> */}
        </VStack>
      </Container>
    </Box>
  );
};

export default Skills;
