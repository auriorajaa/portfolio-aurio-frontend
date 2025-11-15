// src/components/ui/EducationStats.js
import React from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, TrendingUp } from "lucide-react";

const MotionBox = motion(Box);

const StatCard = ({ icon, label, value, helpText, color, delay }) => {
  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#a8b2d1");

  const iconBg = useColorModeValue(`${color}.100`, `${color}.800`);
  const iconColor = useColorModeValue(`${color}.600`, `${color}.300`);
  const borderColor = useColorModeValue(`${color}.200`, `${color}.600`);

  const cardBg = useColorModeValue("whiteAlpha.700", "rgba(10,25,47,0.6)");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      h="full"
    >
      <Box
        h="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        p={4}
        borderRadius="3xl"
        borderWidth="1.5px"
        borderColor={borderColor}
        bg={cardBg}
        backdropFilter="blur(12px)"
        boxShadow="lg"
        _hover={{
          transform: "translateY(-6px) scale(1.02)",
          boxShadow: "xl",
          borderColor: iconColor,
        }}
        transition="all 0.25s"
      >
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          flex="1"
          justify="flex-start"
        >
          {/* Icon */}
          <Box
            p={3}
            borderRadius="full"
            bg={iconBg}
            mb={3}
            boxShadow="md"
            border="2px solid"
            borderColor={borderColor}
          >
            <Icon as={icon} boxSize={6} color={iconColor} />
          </Box>

          {/* Stats */}
          <Stat textAlign="center" flex="1">
            <StatNumber
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="800"
              color={iconColor}
              mb={1}
            >
              {value}
            </StatNumber>

            <StatLabel
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              color={textPrimary}
              mb={1}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {label}
            </StatLabel>

            {helpText && (
              <StatHelpText
                fontSize={{ base: "xs", md: "sm" }}
                color={textSecondary}
              >
                {helpText}
              </StatHelpText>
            )}
          </Stat>
        </Flex>
      </Box>
    </MotionBox>
  );
};

const EducationStats = ({ educationData, certificationsData }) => {
  const totalFormalEducation = educationData.length;
  const totalCertifications = certificationsData.length;

  const currentEducation = educationData.filter(
    (item) => item.status === "Current"
  ).length;
  const completedEducation = educationData.filter(
    (item) => item.status === "Completed"
  ).length;

  const allData = [...educationData, ...certificationsData];
  const totalAchievements = allData.reduce(
    (acc, item) => acc + (item.achievements?.length || 0),
    0
  );

  const gpaValues = educationData
    .map((item) => parseFloat(item.gpa))
    .filter((gpa) => !isNaN(gpa));

  const averageGPA =
    gpaValues.length > 0
      ? (gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length).toFixed(2)
      : "N/A";

  return (
    <SimpleGrid
      columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
      spacing={{ base: 4, md: 6 }}
      w="full"
      mb={8}
    >
      <StatCard
        icon={GraduationCap}
        label="Formal Education"
        value={totalFormalEducation}
        helpText={`${currentEducation} ongoing, ${completedEducation} completed`}
        color="blue"
        delay={0.1}
      />

      <StatCard
        icon={TrendingUp}
        label="Average GPA"
        value={averageGPA}
        helpText="Across programs"
        color="purple"
        delay={0.2}
      />

      <StatCard
        icon={Award}
        label="Achievements"
        value={totalAchievements}
        helpText="Awards earned"
        color="teal"
        delay={0.3}
      />

      <StatCard
        icon={BookOpen}
        label="Certifications"
        value={totalCertifications}
        helpText="Bootcamps done"
        color="green"
        delay={0.4}
      />
    </SimpleGrid>
  );
};

export default EducationStats;
