import React from "react";
import { Box, Button, Link, Text, VStack, Flex, Grid } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { SITE_NAME } from "../utils/seo";
import {
  LAGOON,
  DoodleAsterisk,
  DoodleCloudFace,
  DoodleStar,
  DoodleSun,
  PublicShell,
} from "../components/public/studio";

const NotFound = ({ code = "404", title = "Page not found", message }) => (
  <PublicShell>
    <Helmet>
      <title>{`${title} | ${SITE_NAME}`}</title>
      <meta
        name="description"
        content={message || "This page could not be found in Aurio Rajaa's portfolio."}
      />
      <meta name="robots" content="noindex, follow" />
    </Helmet>

    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      px={{ base: 5, md: 8 }}
      pt={{ base: 28, md: 32 }}
      pb={{ base: 40, md: 44 }}
    >
      {/* Flat props around the scene */}
      <Box aria-hidden="true" position="absolute" top="10%" right="8%">
        <DoodleSun size={120} transform="rotate(10deg)" />
      </Box>
      <Box aria-hidden="true" position="absolute" top={{ base: "6%", md: "9%" }} left={{ base: "8%", md: "14%" }} display={{ base: "block", md: "block" }}>
        <DoodleCloudFace size={84} transform="rotate(6deg)" />
      </Box>
      <Box aria-hidden="true" position="absolute" top="18%" left="6%" display={{ base: "none", md: "block" }}>
        <DoodleAsterisk size={34} color={LAGOON.coral} transform="rotate(-12deg)" />
      </Box>
      <Box aria-hidden="true" position="absolute" top="58%" right="24%" display={{ base: "none", lg: "block" }}>
        <DoodleStar size={40} transform="rotate(16deg)" />
      </Box>

      {/* Waves */}
      <Box aria-hidden="true" position="absolute" bottom={0} left={0} right={0} pointerEvents="none">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "150px" }}>
          <path
            d="M0,96 C240,160 480,32 720,96 C960,160 1200,32 1440,96 L1440,220 L0,220 Z"
            fill="#D8F0EC"
          />
          <path
            d="M0,140 C260,190 520,80 780,130 C1040,180 1240,90 1440,140 L1440,220 L0,220 Z"
            fill="#0E6F69"
          />
        </svg>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
        gap={{ base: 12, lg: 10 }}
        alignItems="center"
        maxW="1080px"
        mx="auto"
        position="relative"
        zIndex={1}
      >
        {/* Copy half */}
        <VStack spacing={5} textAlign={{ base: "center", lg: "left" }} alignItems={{ base: "center", lg: "flex-start" }}>
          <Box
            className="public-mono"
            border="1.5px solid"
            borderColor={LAGOON.ink}
            bg="#FFFFFF"
            px={3}
            py="6px"
            borderRadius="8px"
            boxShadow="3px 3px 0 rgba(11,47,47,0.7)"
            fontSize="12px"
            fontWeight="500"
            letterSpacing=".08em"
            transform="rotate(-2deg)"
          >
            {code} · page lost at sea
          </Box>
          <Text
            fontFamily="heading"
            fontSize={{ base: "40px", md: "52px" }}
            fontWeight="700"
            lineHeight="1.05"
            letterSpacing="-.03em"
            color={LAGOON.heading}
          >
            {title}
          </Text>
          <Text fontSize="17px" lineHeight="1.8" color={LAGOON.muted} maxW="440px">
            {message || "You took a turn off the map. The page you're after doesn't exist — but the shore is that way."}
          </Text>
          <Flex gap={3} mt={2} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
            <Button
              as={Link}
              href="/"
              variant="lagoonCoral"
              h="50px"
              px={7}
              fontSize="16px"
              leftIcon={<ArrowLeft size={16} />}
              _hover={{ textDecoration: "none" }}
            >
              Back to the shore
            </Button>
          </Flex>
        </VStack>

        {/* Illustration half: a folded map, made of pure HTML boxes */}
        <Box position="relative" display={{ base: "none", sm: "block" }}>
          <Box
            bg={LAGOON.bgWash}
            border="2px solid #0B2F2F"
            borderRadius="18px"
            boxShadow="8px 8px 0 rgba(11,47,47,0.9)"
            p={{ base: 5, md: 7 }}
            transform="rotate(2deg)"
            position="relative"
            zIndex={1}
            h={{ base: "320px", md: "380px" }}
          >
            {/* The map sheet */}
            <Box
              position="relative"
              h="100%"
              bg="#FFFFFF"
              border="2px solid #0B2F2F"
              borderRadius="10px"
              overflow="hidden"
            >
              {/* Fold creases */}
              <Box
                aria-hidden="true"
                position="absolute"
                top={0}
                bottom={0}
                left="34%"
                w="2px"
                bg="rgba(11,47,47,0.10)"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top={0}
                bottom={0}
                left="68%"
                w="2px"
                bg="rgba(11,47,47,0.10)"
              />
              {/* Grid streets */}
              <Box
                aria-hidden="true"
                position="absolute"
                top="18%"
                left={0}
                right={0}
                borderTop="1.5px solid rgba(11,47,47,0.14)"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top="52%"
                left={0}
                right={0}
                borderTop="2px solid rgba(11,47,47,0.18)"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top="80%"
                left={0}
                right={0}
                borderTop="1.5px solid rgba(11,47,47,0.14)"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top={0}
                bottom={0}
                left="16%"
                w="1.5px"
                bg="rgba(11,47,47,0.12)"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top={0}
                bottom={0}
                left="84%"
                w="1.5px"
                bg="rgba(11,47,47,0.12)"
              />

              {/* The route: a dashed walk from "me" to "X" */}
              <Box
                aria-hidden="true"
                position="absolute"
                top="46%"
                left="18%"
                w="62%"
                borderTop="2.5px dashed #0E8C86"
                transform="rotate(-14deg)"
                transformOrigin="left center"
              />
              <Box
                aria-hidden="true"
                position="absolute"
                top="62%"
                left="44%"
                w="38%"
                borderTop="2.5px dashed #FF6B4A"
                transform="rotate(30deg)"
                transformOrigin="left center"
              />

              {/* Origin pin: me */}
              <Box position="absolute" left="12%" bottom="22%">
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={LAGOON.primary}
                  border="2px solid #0B2F2F"
                  boxShadow="2px 2px 0 rgba(11,47,47,0.9)"
                />
                <Text
                  className="public-hand"
                  fontSize="19px"
                  fontWeight="600"
                  color={LAGOON.primaryDeep}
                  textAlign="center"
                  mt={1}
                >
                  me
                </Text>
              </Box>

              {/* X marks the spot */}
              <Box position="absolute" right="14%" top="18%" textAlign="center">
                <Box
                  position="relative"
                  w="26px"
                  h="26px"
                  mx="auto"
                >
                  <Box
                    position="absolute"
                    top="12px"
                    left={0}
                    right={0}
                    h="2.5px"
                    bg={LAGOON.coralDeep}
                    transform="rotate(45deg)"
                  />
                  <Box
                    position="absolute"
                    top="12px"
                    left={0}
                    right={0}
                    h="2.5px"
                    bg={LAGOON.coralDeep}
                    transform="rotate(-45deg)"
                  />
                </Box>
                <Text
                  className="public-hand"
                  fontSize="19px"
                  fontWeight="600"
                  color={LAGOON.coralDeep}
                  w="110px"
                  ml="-42px"
                  mt={1}
                >
                  you were here?
                </Text>
              </Box>

              {/* Compass */}
              <Box
                position="absolute"
                right="8%"
                bottom="10%"
                w="44px"
                h="44px"
                borderRadius="full"
                bg="#FFFFFF"
                border="2px solid #0B2F2F"
                boxShadow="2px 2px 0 rgba(11,47,47,0.9)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transform="rotate(8deg)"
              >
                <Text className="public-mono" fontSize="13px" fontWeight="600" color={LAGOON.heading}>
                  N
                </Text>
                <Box
                  aria-hidden="true"
                  position="absolute"
                  top="5px"
                  left="50%"
                  ml="-4px"
                  w={0}
                  h={0}
                  borderLeft="4px solid transparent"
                  borderRight="4px solid transparent"
                  borderBottom="6px solid #FF6B4A"
                />
              </Box>
            </Box>
          </Box>
          <Text
            className="public-hand"
            fontSize="26px"
            fontWeight="600"
            color={LAGOON.primaryDeep}
            textAlign="center"
            transform="rotate(-1deg)"
            mt={4}
          >
            hmm... wrong way?
          </Text>
          <Box aria-hidden="true" position="absolute" top="-22px" right="-20px" zIndex={0}>
            <DoodleSun size={72} transform="rotate(14deg)" />
          </Box>
        </Box>
      </Grid>
    </Box>
  </PublicShell>
);

export default NotFound;
