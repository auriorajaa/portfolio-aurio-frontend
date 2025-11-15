// src/components/sections/Education.js
import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { educationData, certificationsData } from "../../data/portfolioData";
import TimelineItem from "../ui/education/TimelineItem";
import CertificationItem from "../ui/education/CertificationItem";
import EducationStats from "../ui/education/EducationStats";

const MotionBox = motion(Box);

const TimelineConnector = ({ isLast }) => {
  const connectorColor = useColorModeValue("teal.300", "teal.600");

  const bgColor = useColorModeValue(
    "linear(to-b, teal.300, blue.300)",
    "linear(to-b, teal.600, blue.600)"
  );

  if (isLast) return null;

  return (
    <Box
      position="absolute"
      left={{ base: "19px", md: "50%" }}
      top="80px"
      bottom="-100px"
      width="3px"
      bgGradient={bgColor}
      transform={{ base: "none", md: "translateX(-50%)" }}
      zIndex={0}
      opacity={0.6}
    />
  );
};

const SectionHeader = ({ icon, title, subtitle }) => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("teal.600", "teal.400");

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      mb={10}
    >
      <Flex align="center" gap={3} mb={3}>
        <Box
          p={2}
          borderRadius="lg"
          bg={useColorModeValue("teal.100", "teal.800")}
        >
          <Icon as={icon} boxSize={6} color={accentColor} />
        </Box>
        <Heading
          as="h3"
          fontSize={{ base: "xl", md: "2xl" }}
          color={textPrimary}
          fontWeight="black"
        >
          {title}
        </Heading>
      </Flex>
      <Text
        fontSize={{ base: "sm", md: "md" }}
        color={useColorModeValue("gray.600", "gray.400")}
        ml={14}
      >
        {subtitle}
      </Text>
    </MotionBox>
  );
};

const Education = () => {
  const textPrimary = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("teal.600", "teal.400");
  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );
  const dividerColor = useColorModeValue("teal.200", "teal.700");

  return (
    <Box
      as="section"
      id="education"
      py={{ base: 16, md: 20, lg: 24 }}
      position="relative"
      overflow="hidden"
      bgGradient={bgGradient}
    >
      {/* Background Decorations */}
      <Box
        position="absolute"
        top="5%"
        right="-5%"
        width="500px"
        height="500px"
        bg="teal.400"
        opacity={0.06}
        borderRadius="full"
        filter="blur(120px)"
      />

      <Box
        position="absolute"
        bottom="10%"
        left="-5%"
        width="400px"
        height="400px"
        bg="blue.400"
        opacity={0.05}
        borderRadius="full"
        filter="blur(100px)"
      />

      <Box
        position="absolute"
        top="50%"
        right="10%"
        width="300px"
        height="300px"
        bg="cyan.400"
        opacity={0.04}
        borderRadius="full"
        filter="blur(90px)"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={12}>
          {/* Main Header */}
          <MotionBox
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            w="full"
          >
            <Flex justify="center" align="center" mb={4} gap={2}>
              <Heading
                as="h2"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                color={textPrimary}
                fontWeight="black"
              >
                Education Journey
              </Heading>
            </Flex>

            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textSecondary}
              maxW="2xl"
              mx="auto"
              lineHeight="1.8"
            >
              My academic path and continuous learning journey, building a
              strong foundation in software engineering and cloud computing
            </Text>
          </MotionBox>

          {/* Statistics Cards */}
          <EducationStats
            educationData={educationData}
            certificationsData={certificationsData}
          />

          {/* Formal Education Section */}
          <Box w="full">
            <SectionHeader
              icon={GraduationCap}
              title="Formal Education"
              subtitle="Academic degree programs and diplomas"
            />

            <Box w="full" position="relative">
              {educationData.map((item, index) => (
                <Box
                  key={index}
                  position="relative"
                  w="full"
                  mb={{ base: 12, md: 16 }}
                >
                  <TimelineConnector
                    isLast={index === educationData.length - 1}
                  />
                  <TimelineItem item={item} index={index} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box w="full" position="relative" py={4}>
            <Divider
              borderColor={dividerColor}
              borderWidth="2px"
              opacity={0.6}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg={useColorModeValue("teal.50", "teal.900")}
              px={6}
              py={2}
              borderRadius="full"
              borderWidth="2px"
              borderColor={dividerColor}
            >
              <Icon as={Award} boxSize={5} color={accentColor} />
            </Box>
          </Box>

          {/* Certifications & Bootcamps Section */}
          <Box w="full">
            <SectionHeader
              icon={Award}
              title="Certifications & Bootcamps"
              subtitle="Industry training programs and professional certifications"
            />

            <VStack spacing={10} w="full">
              {certificationsData.map((item, index) => (
                <CertificationItem key={index} item={item} index={index} />
              ))}
            </VStack>
          </Box>

          {/* Bottom Quote */}
          {/* <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            textAlign="center"
            w="full"
            pt={8}
          >
            <Box
              p={6}
              borderRadius="2xl"
              bg={useColorModeValue("white", "#0a192f")}
              borderWidth="2px"
              borderColor={useColorModeValue("teal.200", "teal.700")}
              boxShadow="xl"
              maxW="2xl"
              mx="auto"
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color={textPrimary}
                fontStyle="italic"
                fontWeight="medium"
              >
                "Education is not the filling of a pail, but the lighting of a
                fire."
              </Text>
              <Text fontSize="xs" color={textSecondary} mt={3} opacity={0.8}>
                — William Butler Yeats
              </Text>
            </Box>
          </MotionBox> */}
        </VStack>
      </Container>
    </Box>
  );
};

export default Education;
