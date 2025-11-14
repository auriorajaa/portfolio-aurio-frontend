import React, { useState } from "react";
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
  FiCheckCircle,
} from "react-icons/fi";

const MotionBox = motion(Box);

// portfolioData structure
const skillsData = [
  {
    category: "Backend",
    skills: [
      "Spring Boot REST API",
      "Django REST Framework",
      "API Design",
      "SQL & NoSQL Databases",
      "Authentication & Security",
      "Docker & Containerization",
    ],
  },
  {
    category: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "Bootstrap",
      "Tailwind CSS",
      "Responsive Design",
    ],
  },
  {
    category: "Java",
    skills: [
      "Core Java",
      "Spring Framework",
      "Java Swing",
      "Native Android Java",
    ],
  },
  {
    category: "Tools",
    skills: [
      "Git & GitHub",
      "Google Cloud Services",
      "Technical Documentation",
    ],
  },
];

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

// Detailed skill descriptions based on experience and education
const skillDetails = {
  "Spring Boot REST API": {
    level: "Advanced",
    description:
      "Built production RESTful APIs for Bank Indonesia's document management system",
    context: "Primary backend framework for enterprise applications",
  },
  "Django REST Framework": {
    level: "Advanced",
    description:
      "Developed multiple full-stack projects including e-commerce and social platforms",
    context: "Experienced in DRF for rapid API development",
  },
  "API Design": {
    level: "Proficient",
    description:
      "Designed scalable REST APIs with proper architecture and documentation",
    context: "Focus on clean, maintainable API structures",
  },
  "SQL & NoSQL Databases": {
    level: "Proficient",
    description:
      "Worked with PostgreSQL, MySQL, Microsoft SQL Server, MongoDB, and Firebase",
    context: "Database design and optimization for various use cases",
  },
  "Authentication & Security": {
    level: "Proficient",
    description:
      "Implemented JWT authentication and secure data handling practices",
    context: "Security-first approach in backend development",
  },
  "Docker & Containerization": {
    level: "Intermediate",
    description:
      "Learned containerization through Bangkit Cloud Computing program",
    context: "Deployment and environment management",
  },
  "React.js": {
    level: "Advanced",
    description:
      "Built multiple responsive frontends with React and modern hooks",
    context: "Primary choice for interactive UI development",
  },
  "Next.js": {
    level: "Advanced",
    description:
      "Created production apps including financial fraud detection platform for Lapis AI",
    context: "Full-stack React framework with SSR capabilities",
  },
  Bootstrap: {
    level: "Proficient",
    description:
      "Used in e-commerce and various web projects for rapid prototyping",
    context: "Reliable framework for responsive layouts",
  },
  "Tailwind CSS": {
    level: "Advanced",
    description:
      "Preferred utility-first CSS framework for modern web applications",
    context: "Primary styling solution for recent projects",
  },
  "Responsive Design": {
    level: "Advanced",
    description: "All projects feature mobile-first, responsive interfaces",
    context: "Essential skill for modern web development",
  },
  "Core Java": {
    level: "Advanced",
    description:
      "Strong foundation from CCIT-FTUI and applied in Android and Spring projects",
    context: "Primary programming language with 3+ years experience",
  },
  "Spring Framework": {
    level: "Advanced",
    description: "Deep experience with Spring Boot and Spring ecosystem",
    context: "Go-to framework for enterprise Java applications",
  },
  "Java Swing": {
    level: "Intermediate",
    description: "Studied desktop application development at CCIT-FTUI",
    context: "Foundation in Java GUI development",
  },
  "Native Android Java": {
    level: "Proficient",
    description: "Built Small Circle marketplace app with Firebase integration",
    context: "Android development with Java and XML",
  },
  "Git & GitHub": {
    level: "Advanced",
    description:
      "Version control for all projects with collaborative workflows",
    context: "Essential tool for professional development",
  },
  "Google Cloud Services": {
    level: "Proficient",
    description: "Trained through Bangkit Academy program with ML integration",
    context: "Cloud computing and deployment expertise",
  },
  "Technical Documentation": {
    level: "Proficient",
    description: "Created comprehensive documentation for APIs and projects",
    context: "Clear communication of technical concepts",
  },
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
          <HStack spacing={3} justify="space-between">
            <HStack spacing={3} flex={1}>
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
