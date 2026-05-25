import React, { useMemo, useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Trophy,
  Calendar,
  Award,
} from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const colors = useRetroColors();
  const [openIdx, setOpenIdx] = useState(null);

  const allEducation = useMemo(
    () => [
      ...(portfolioData.education || []),
      ...(portfolioData.certifications || []),
    ],
    [portfolioData.education, portfolioData.certifications]
  );

  const toggle = (idx) => setOpenIdx((prev) => (prev === idx ? null : idx));

  if (allEducation.length === 0) {
    return (
      <RetroPanel
        id="education"
        title="Education & Certifications"
        icon={GraduationCap}
      >
        <Box p={4}>
          <Text fontSize="16px" color={colors.muted}>
            No education or certification records available.
          </Text>
        </Box>
      </RetroPanel>
    );
  }

  return (
    <RetroPanel
      id="education"
      title="Education & Certifications"
      icon={GraduationCap}
      // headerRight={
      //   <RetroBadge flexShrink={0}>{allEducation.length} records</RetroBadge>
      // }
      bodyProps={{ p: 0, overflow: "hidden" }}
    >
      <VStack
        align="stretch"
        spacing={0}
        divider={<Divider borderColor={colors.border} />}
      >
        {allEducation.map((edu, idx) => {
          const isOpen = openIdx === idx;
          const details = [
            ...(Array.isArray(edu.courses) ? edu.courses : []),
            ...(Array.isArray(edu.skills) ? edu.skills : []),
          ];

          return (
            <Box key={`${edu.title}-${idx}`}>
              {/* ── Compact Header Row (unchanged layout) ── */}
              <Flex
                as="button"
                onClick={() => toggle(idx)}
                w="100%"
                align="center"
                gap={3}
                px={{ base: 3, md: 4 }}
                py={3}
                textAlign="left"
                bg={isOpen ? colors.panelAlt : "transparent"}
                _hover={{ bg: colors.panelAlt }}
                transition="background 0.15s"
                cursor="pointer"
              >
                <Box
                  flexShrink={0}
                  w="64px"
                  h="64px"
                  border="1px solid"
                  borderColor={colors.border}
                  bg={colors.panelBg}
                  overflow="hidden"
                >
                  {edu.logo && (
                    <Image
                      src={edu.logo}
                      alt={edu.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  )}
                </Box>

                <Box minW={0} flex={1}>
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    color={colors.text}
                    noOfLines={1}
                    wordBreak="break-word"
                  >
                    {edu.title}
                  </Text>
                  <Text fontSize="14px" color={colors.muted} noOfLines={1}>
                    {edu.degree || edu.major || edu.period}
                  </Text>
                </Box>

                <HStack spacing={2} flexShrink={0}>
                  <RetroBadge
                    tone={edu.status === "Completed" ? "green" : "amber"}
                  >
                    {edu.status || edu.type}
                  </RetroBadge>
                  <Box
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.2s"
                    color={colors.muted}
                  >
                    <ChevronDown size={16} />
                  </Box>
                </HStack>
              </Flex>

              {/* ── Expanded Detail (Activities typography) ── */}
              <Collapse in={isOpen} animateOpacity>
                <Box px={{ base: 3, md: 4 }} pb={4} bg={colors.panelBg}>
                  {/* Title + Badge + Meta */}
                  <Flex gap={3} align="start" mb={3}>
                    {/* <Box
                      flexShrink={0}
                      w={{ base: "48px", md: "64px" }}
                      h={{ base: "48px", md: "64px" }}
                      border="1px solid"
                      borderColor={colors.border}
                      bg={colors.panelBg}
                      overflow="hidden"
                    >
                      {edu.logo && (
                        <Image
                          src={edu.logo}
                          alt={edu.title}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      )}
                    </Box> */}

                    <Box minW={0} flex={1}>
                      <Flex
                        gap={2}
                        align="start"
                        justify="space-between"
                        flexWrap="wrap"
                        mb={1}
                      >
                        <Box minW={0} flex={1}>
                          {/* Activities scale: 16px bold */}
                          <Text
                            fontSize="16px"
                            fontWeight="bold"
                            color={colors.text}
                            wordBreak="break-word"
                          >
                            {edu.title}
                          </Text>
                          {/* Activities scale: 15px bold link */}
                          <Text
                            fontSize="15px"
                            color={colors.link}
                            fontWeight="bold"
                            wordBreak="break-word"
                          >
                            {edu.degree || edu.major}
                          </Text>
                        </Box>
                        {/* <RetroBadge
                          tone={edu.status === "Completed" ? "green" : "amber"}
                          flexShrink={0}
                          mt="2px"
                        >
                          {edu.status || edu.type}
                        </RetroBadge> */}
                      </Flex>

                      {/* Activities scale: 14px muted */}
                      <Flex gap={2} flexWrap="wrap">
                        <HStack spacing={1}>
                          <Calendar size={14} color={colors.muted} />
                          <Text fontSize="14px" color={colors.muted}>
                            {edu.period}
                          </Text>
                        </HStack>
                        {(edu.gpa || edu.score) && (
                          <HStack spacing={1}>
                            <Award size={14} color={colors.muted} />
                            <Text fontSize="14px" color={colors.muted}>
                              {edu.gpa
                                ? `GPA ${edu.gpa}`
                                : `Score ${edu.score}`}
                            </Text>
                          </HStack>
                        )}
                      </Flex>
                    </Box>
                  </Flex>

                  {/* Description */}
                  {edu.description && (
                    <Box mb={3}>
                      <HStack spacing={2} mb={2}>
                        <BookOpen size={14} color={colors.link} />
                        <Text
                          fontSize="14px"
                          fontWeight="bold"
                          color={colors.muted}
                        >
                          FULL DESCRIPTION
                        </Text>
                      </HStack>
                      {/* Activities scale: 15px lineHeight 1.4 */}
                      <Text
                        fontSize="15px"
                        color={colors.text}
                        lineHeight="1.4"
                        wordBreak="break-word"
                      >
                        {edu.description}
                      </Text>
                    </Box>
                  )}

                  {/* Achievements */}
                  {edu.achievements?.length > 0 && (
                    <Box mb={3}>
                      <HStack spacing={2} mb={2}>
                        <Trophy size={14} color={colors.link} />
                        <Text
                          fontSize="14px"
                          fontWeight="bold"
                          color={colors.muted}
                        >
                          ACHIEVEMENTS
                        </Text>
                      </HStack>
                      <VStack align="stretch" spacing={1}>
                        {edu.achievements.map((a) => (
                          <HStack key={a} spacing={2} align="start">
                            {/* <Box
                              mt="6px"
                              w="5px"
                              h="5px"
                              bg={colors.link}
                              flexShrink={0}
                            /> */}
                            {/* Activities scale: 15px */}
                            <Text
                              fontSize="15px"
                              color={colors.text}
                              wordBreak="break-word"
                            >
                              - {a}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* Courses / Skills */}
                  {details.length > 0 && (
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="bold"
                        color={colors.muted}
                        mb={2}
                      >
                        {edu.type === "formal"
                          ? "COURSEWORK"
                          : "SKILLS LEARNED"}
                      </Text>
                      <SimpleGrid
                        columns={{ base: 1, sm: 2, xl: 3 }}
                        spacing={2}
                      >
                        {details.map((d) => (
                          <Box
                            key={d}
                            border="1px solid"
                            borderColor={colors.borderSoft}
                            bg={colors.panelAlt}
                            px={2}
                            py={1}
                          >
                            {/* Activities scale: 14px bold */}
                            <Text
                              fontSize="14px"
                              color={colors.text}
                              fontWeight="bold"
                              wordBreak="break-word"
                            >
                              {d}
                            </Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </VStack>
    </RetroPanel>
  );
};

export default Education;
