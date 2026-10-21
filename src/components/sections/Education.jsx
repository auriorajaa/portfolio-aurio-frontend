import React, { useMemo } from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { Award, GraduationCap } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { LAGOON, LagoonSection } from "../public/studio";

// The campus notice board: a deep-teal corkboard with a peg
// rail on the left, all the school reports pinned up for public.
const PIN_COLORS = [LAGOON.coral, LAGOON.sun, "#FFFFFF"];

const Education = () => {
  const { portfolioData } = usePortfolio();

  const allEducation = useMemo(
    () => [
      ...(portfolioData.education || []),
      ...(portfolioData.certifications || []),
    ],
    [portfolioData.education, portfolioData.certifications]
  );

  if (allEducation.length === 0) return null;

  return (
    <LagoonSection
      id="education"
      tone="wash"
      eyebrow="05 / education"
      title="Education"
      description="Degrees, programs, and bootcamps that shaped how I build."
    >
      <Box
        data-reveal
        position="relative"
        bg="#0B4F4C"
        border="2px solid #0B2F2F"
        borderRadius="18px"
        boxShadow="9px 9px 0 rgba(11,47,47,0.9)"
        overflow="hidden"
      >
        {/* Pegboard rail on the left: a grid of little square holes */}
        <Box
          aria-hidden="true"
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          w={{ base: "22px", md: "52px" }}
          borderRight="1.5px solid rgba(255,255,255,0.16)"
          pointerEvents="none"
          sx={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Board header */}
        <Flex
          align="center"
          gap={3}
          px={{ base: "34px", md: "70px" }}
          pt={{ base: 6, md: 7 }}
        >
          <Text
            className="public-hand"
            fontSize={{ base: "24px", md: "27px" }}
            fontWeight="600"
            color="#FFD34D"
            lineHeight="1.1"
            transform="rotate(-1.2deg)"
          >
            the classroom notice board!
          </Text>
          <Text
            className="public-mono"
            fontSize="10px"
            fontWeight="500"
            color="rgba(255,255,255,0.55)"
            letterSpacing=".16em"
            textTransform="uppercase"
            ml="auto"
            whiteSpace="nowrap"
            display={{ base: "none", sm: "block" }}
          >
            all notes pinned for public
          </Text>
        </Flex>
        <Box
          mx={{ base: "34px", md: "70px" }}
          mt="12px"
          mb={{ base: 7, md: 8 }}
          borderBottom="2px dashed rgba(255,255,255,0.25)"
        />

        {/* Pinned grade reports */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
          gap={{ base: 7, md: 7 }}
          px={{ base: "34px", md: "70px" }}
          pb={{ base: 8, md: 9 }}
          alignItems="stretch"
        >
          {allEducation.map((edu, index) => {
            const scoreValue = edu.gpa || edu.score;
            const isBootcamp = edu.type === "bootcamp";

            return (
              <Box
                key={`${edu.title}-${index}`}
                as="article"
                position="relative"
                display="flex"
                flexDirection="column"
                bg="#FFFFFF"
                border="2px solid #0B2F2F"
                borderRadius="10px"
                overflow="hidden"
                transition="box-shadow .16s ease, transform .16s ease"
                _hover={{
                  boxShadow: "6px 6px 0 rgba(11,47,47,0.55)",
                  transform: "translateY(-3px)",
                }}
              >
                {/* Push pin */}
                <Box
                  aria-hidden="true"
                  position="absolute"
                  top="-11px"
                  left="50%"
                  ml="-11px"
                  w="22px"
                  h="22px"
                  borderRadius="full"
                  bg={PIN_COLORS[index % PIN_COLORS.length]}
                  border="2px solid #0B2F2F"
                  boxShadow="2px 2px 0 rgba(11,47,47,0.5)"
                  zIndex={2}
                />

                {/* Note head: filing row, like a stamped report */}
                <Flex
                  align={{ base: "flex-start", md: "center" }}
                  justify={{ base: "flex-start", md: "space-between" }}
                  flexDirection={{ base: "column", md: "row" }}
                  gap={{ base: "4px", md: 3 }}
                  bg="#FFF7DD"
                  px={{ base: 4, md: 5 }}
                  py={{ base: "10px", md: 2.5 }}
                  borderBottom="2px solid #0B2F2F"
                >
                  <Text
                    className="public-mono"
                    fontSize="10px"
                    fontWeight="600"
                    color="#775400"
                    letterSpacing=".14em"
                    textTransform="uppercase"
                  >
                    note — no. {String(index + 1).padStart(2, "0")}
                  </Text>
                  {edu.period ? (
                    <Text
                      className="public-hand"
                      fontSize={{ base: "17px", md: "19px" }}
                      fontWeight="600"
                      color="#0B2F2F"
                      lineHeight="1.15"
                      noOfLines={{ base: 2, md: 1 }}
                    >
                      {edu.period}
                    </Text>
                  ) : (
                    <Text className="public-mono" fontSize="10px" color="#775400">
                      undated
                    </Text>
                  )}
                </Flex>

                <Box px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }} pt={5} display="flex" flexDirection="column" flex="1">
                  <Flex gap={4} align="flex-start">
                    <Box
                      w={{ base: "42px", md: "56px" }}
                      h={{ base: "42px", md: "56px" }}
                      flexShrink={0}
                      bg="#FFFFFF"
                      border="1.5px solid"
                      borderColor={LAGOON.ink}
                      borderRadius="10px"
                      overflow="hidden"
                      position="relative"
                    >
                      {edu.logo ? (
                        <img
                          src={edu.logo}
                          alt={edu.title}
                          loading="lazy"
                          decoding="async"
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "7px",
                            boxSizing: "border-box",
                            background: "#ffffff",
                          }}
                        />
                      ) : (
                        <Flex
                          w="100%"
                          h="100%"
                          align="center"
                          justify="center"
                          bg={LAGOON.sunSoft}
                          color={LAGOON.primaryDark}
                          fontFamily="heading"
                          fontSize="22px"
                          fontWeight="800"
                        >
                          {(edu.title || "?").charAt(0)}
                        </Flex>
                      )}
                    </Box>

                    <Box minW={0} flex="1">
                      <Text
                        className="public-mono"
                        fontSize="11px"
                        fontWeight="500"
                        color={isBootcamp ? "#775400" : LAGOON.chipText}
                        display="inline-flex"
                        alignItems="center"
                        gap="6px"
                        mb="4px"
                      >
                        {isBootcamp ? <Award size={14} /> : <GraduationCap size={14} />}
                        {isBootcamp ? "bootcamp" : "degree"}
                      </Text>
                      <Text
                        fontFamily="heading"
                        fontSize={{ base: "17px", md: "20px" }}
                        fontWeight="800"
                        lineHeight="1.3"
                        letterSpacing="-.02em"
                        color={LAGOON.heading}
                      >
                        {edu.title}
                      </Text>
                      {(edu.degree || edu.major) && (
                        <Text fontSize="13.5px" fontWeight="700" color={LAGOON.primaryDeep} mt="3px">
                          {[edu.degree, edu.major].filter(Boolean).join(" · ")}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {edu.description && (
                    <Text
                      fontSize={{ base: "14.5px", md: "15px" }}
                      lineHeight="1.7"
                      color={LAGOON.text}
                      mt={4}
                    >
                      {edu.description}
                    </Text>
                  )}

                  {edu.achievements?.length > 0 && (
                    <VStack align="stretch" spacing={2.5} mt={4}>
                      {edu.achievements.map((achievement, i) => (
                        <Flex key={i} gap={3} align="flex-start">
                          <Flex
                            flexShrink={0}
                            align="center"
                            justify="center"
                            w="16px"
                            h="16px"
                            mt="3px"
                            bg="#FFFFFF"
                            border="1.5px solid #0B2F2F"
                            borderRadius="4px"
                          >
                            <Box w="7px" h="7px" borderRadius="2px" bg={LAGOON.coral} />
                          </Flex>
                          <Text fontSize="14.5px" lineHeight="1.65" color={LAGOON.text}>
                            {achievement}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}

                  <Box flex="1" minH="12px" />

                  {/* Result strip: the grade gets a big happy sticker */}
                  {(scoreValue || edu.status || edu.skills?.length > 0) && (
                    <Flex
                      align="center"
                      gap={3}
                      flexWrap="wrap"
                      mt="auto"
                      pt={4}
                      borderTop="1.5px dashed"
                      borderColor={LAGOON.border}
                    >
                      {scoreValue && (
                        <Box
                          bg={LAGOON.sun}
                          border="1.5px solid #0B2F2F"
                          borderRadius="10px"
                          px="12px"
                          py="5px"
                          boxShadow="2.5px 2.5px 0 rgba(11,47,47,0.85)"
          >
                          <Text
                            className="public-mono"
                            fontSize="9px"
                            fontWeight="600"
                            color="#0B2F2F"
                            letterSpacing=".14em"
                            textTransform="uppercase"
                          >
                            {isBootcamp ? "final score" : "gpa"}
                          </Text>
                          <Text
                            className="public-hand"
                            fontSize="21px"
                            fontWeight="700"
                            color="#0B2F2F"
                            lineHeight="1.05"
                            mt="1px"
                          >
                            {scoreValue}
                          </Text>
                        </Box>
                      )}
                      {edu.status && (
                        <Text
                          fontSize="13px"
                          fontWeight="700"
                          color={
                            /current/i.test(edu.status) ? LAGOON.coralDeep : LAGOON.primaryDark
                          }
                        >
                          {edu.status}
                        </Text>
                      )}
                      {edu.skills?.slice(0, 3).length > 0 && (
                        <Text
                          className="public-mono"
                          fontSize="11.5px"
                          color={LAGOON.muted}
                          noOfLines={{ base: 2, md: 1 }}
                          ml={{ base: 0, md: "auto" }}
                          maxW={{ base: "100%", md: "52%" }}
                        >
                          {edu.skills.slice(0, 3).join(" · ")}
                        </Text>
                      )}
                    </Flex>
                  )}
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Box>
    </LagoonSection>
  );
};

export default Education;
