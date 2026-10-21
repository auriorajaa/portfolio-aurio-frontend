import React from "react";
import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  LAGOON,
  LagoonSection,
  DoodleLightning,
  DoodleTape,
} from "../public/studio";

// Receipts pinned to a route line: every role is its own printed
// slip with a torn (sawtooth) edge, washi tape holding it, and a
// round thumbtack on the dashed line. Current role gets the
// lightning treatment; slips lift when you check them.
const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData.experiences || [];

  if (experienceData.length === 0) return null;

  const tapeColor = (index, isCurrent) =>
    isCurrent
      ? "rgba(255,200,87,0.85)"
      : index % 2 === 0
      ? "rgba(14,140,134,0.55)"
      : "rgba(255,107,74,0.7)";

  return (
    <LagoonSection
      id="experience"
      tone="wash"
      eyebrow="03 / experience"
      title="Experience"
      description="Receipts from roles where I shipped real things, printed and pinned in order."
      headerAside={
        <Flex align="center" gap={2}>
          <DoodleLightning size={13} />
          <Text className="public-mono" fontSize="12px" fontWeight="500" color={LAGOON.muted}>
            {experienceData.length} slips
          </Text>
        </Flex>
      }
    >
      <Box position="relative">
        {/* The pin line */}
        <Box
          aria-hidden="true"
          position="absolute"
          top="10px"
          bottom="18px"
          left={{ base: "7px", md: "212px" }}
          w="0"
          style={{ borderLeft: "2.5px dashed rgba(11,47,47,0.35)" }}
        />

        <VStack align="stretch" spacing={{ base: 9, md: 8 }}>
          {experienceData.map((exp, index) => {
            const bullets = Array.isArray(exp.description)
              ? exp.description.slice(0, 3)
              : [exp.description].filter(Boolean);
            const isCurrent = /present/i.test(exp.period || "");
            const tilt = isCurrent ? -1 : index % 2 === 0 ? 0.6 : -0.6;

            return (
              <Grid
                key={exp.id || `${exp.company}-${index}`}
                data-reveal
                templateColumns={{ base: "1fr", md: "196px 32px minmax(0, 1fr)" }}
                position="relative"
              >
                {/* Stub column: period + place, like a cheque stub */}
                <Box
                  pr={{ base: 0, md: 5 }}
                  textAlign={{ base: "left", md: "right" }}
                  mb={{ base: 4, md: 0 }}
                  pt={{ base: 0, md: 2 }}
                >
                  <Text
                    fontFamily="heading"
                    fontSize={{ base: "18px", md: "19px" }}
                    fontWeight="700"
                    letterSpacing="-.01em"
                    color={LAGOON.heading}
                    lineHeight="1.3"
                  >
                    {exp.period || ""}
                  </Text>
                  {(exp.location || exp.type) && (
                    <Text
                      className="public-mono"
                      fontSize="12px"
                      fontWeight="500"
                      color={LAGOON.muted}
                      mt={2}
                    >
                      {[exp.location, exp.type].filter(Boolean).join(" · ")}
                    </Text>
                  )}
                </Box>

                {/* Thumbtack on the line */}
                <Flex justify={{ base: "flex-start", md: "center" }} pt={{ base: 0, md: 6 }}>
                  <Box
                    position="relative"
                    w="16px"
                    h="16px"
                    borderRadius="full"
                    bg={isCurrent ? LAGOON.coralDeep : LAGOON.primary}
                    border="2.5px solid #0B2F2F"
                    boxShadow="2px 2px 0 rgba(11,47,47,0.85)"
                    flexShrink={0}
                  >
                    <Box
                      position="absolute"
                      top="2px"
                      left="3px"
                      w="4px"
                      h="4px"
                      borderRadius="full"
                      bg="rgba(255,255,255,0.85)"
                    />
                  </Box>
                </Flex>

                {/* The receipt slip */}
                <Box
                  ml={{ base: 6, md: 5 }}
                  position="relative"
                  transform={{ base: "none", lg: `rotate(${tilt}deg)` }}
                  _hover={{ transform: "rotate(0deg) translateX(6px)", zIndex: 1 }}
                  transition="transform .2s ease"
                >
                  <DoodleTape
                    w={72}
                    h={20}
                    color={tapeColor(index, isCurrent)}
                    rotation={index % 2 === 0 ? -5 : 5}
                    top="-10px"
                    left="34px"
                    ml={-36}
                    zIndex={2}
                  />

                  <Box className="receipt-edge" bg="#FFFFFF" p={{ base: "20px 20px 28px", md: "26px 28px 32px" }}>
                    {/* Header: item no. + logo stamp */}
                    <Flex
                      align="flex-start"
                      justify="space-between"
                      gap={3}
                      pb={4}
                      mb={4}
                      style={{ borderBottom: "2px dashed rgba(11,47,47,0.3)" }}
                    >
                      <Box minW={0}>
                        <Text className="public-mono" fontSize="11px" fontWeight="500" color={LAGOON.muted}>
                          {"no. " + String(index + 1).padStart(3, "0")}
                        </Text>
                        <Text
                          fontFamily="heading"
                          fontSize={{ base: "19px", md: "22px" }}
                          fontWeight="700"
                          letterSpacing="-.02em"
                          color={LAGOON.heading}
                          mt="3px"
                        >
                          {exp.position}
                        </Text>
                        <Text fontSize="15px" fontWeight="700" color={LAGOON.primary} mt="3px">
                          {exp.company}
                        </Text>
                      </Box>

                      {/* Logo, stamped like a receipt seal */}
                      <Box
                        w={{ base: "52px", md: "58px" }}
                        h={{ base: "52px", md: "58px" }}
                        flexShrink={0}
                        bg="#FFFFFF"
                        transform="rotate(3deg)"
                        border="2px dashed #0B2F2F"
                        borderRadius="8px"
                        overflow="hidden"
                      >
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={exp.company}
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
                          <Flex w="100%" h="100%" align="center" justify="center">
                            <Text fontFamily="heading" fontSize="20px" fontWeight="800" color={LAGOON.primaryDark}>
                              {(exp.company || "?").charAt(0)}
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </Flex>

                    {/* Line items */}
                    {bullets.length > 0 && (
                      <VStack align="stretch" spacing={3} maxW="860px">
                        {bullets.map((line, i) => (
                          <Flex key={i} gap={3} align="flex-start">
                            <Box
                              as="span"
                              aria-hidden="true"
                              className="public-mono"
                              fontSize="13px"
                              fontWeight="600"
                              color={LAGOON.muted}
                              mt="2px"
                              flexShrink={0}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </Box>
                            <Text
                              fontSize={{ base: "15px", md: "16px" }}
                              lineHeight="1.7"
                              color={LAGOON.text}
                            >
                              {line}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>
                    )}

                    {/* Footer: tech + running total */}
                    {(exp.technologies?.length > 0 || exp.period) && (
                      <Flex
                        align="center"
                        justify="space-between"
                        gap={4}
                        flexWrap="wrap"
                        mt={5}
                        pt={4}
                        style={{ borderTop: "2px dashed rgba(11,47,47,0.3)" }}
                      >
                        <Text fontSize="14px" color={LAGOON.muted} maxW={{ base: "100%", md: "70%" }}>
                          {exp.technologies?.length ? exp.technologies.slice(0, 6).join(" · ") : ""}
                        </Text>
                        <Text
                          className="public-mono"
                          fontSize="12px"
                          fontWeight="600"
                          color={isCurrent ? LAGOON.coralDeep : LAGOON.primaryDark}
                          display="inline-flex"
                          alignItems="center"
                          gap="6px"
                          flexShrink={0}
                        >
                          {isCurrent && <DoodleLightning size={11} />}
                          total: {exp.period || "n/a"}
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </VStack>
      </Box>
    </LagoonSection>
  );
};

export default Experience;
