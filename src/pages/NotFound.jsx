import React from "react";
import { Box, Button, Flex, Grid, Link, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { SITE_NAME } from "../utils/seo";
import { BRUT, PublicShell } from "../components/public/brutal";

const NotFound = ({ code = "404", title = "Page not found", message }) => {
  return (
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
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 6, md: 8 }}
        py={{ base: 24, md: 20 }}
        bg={BRUT.bg}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1.05fr 0.95fr" }}
          gap={{ base: 14, lg: 16 }}
          alignItems="center"
          maxW="1040px"
          mx="auto"
          w="100%"
        >
          {/* Copy half */}
          <VStack
            spacing={5}
            textAlign={{ base: "center", lg: "left" }}
            alignItems={{ base: "center", lg: "flex-start" }}
          >
            <Text
              fontFamily="bungee"
              fontSize={{ base: "clamp(72px, 18vw, 132px)" }}
              lineHeight="0.92"
              color={BRUT.primary}
              sx={{
                WebkitTextStroke: `3px ${BRUT.ink}`,
                paintOrder: "stroke fill",
                textShadow: "6px 6px 0 #17181C",
              }}
            >
              {code}
            </Text>
            <Text
              as="h1"
              fontFamily="bungee"
              fontSize={{ base: "clamp(24px, 5.5vw, 38px)" }}
              lineHeight="1.15"
              color={BRUT.ink}
            >
              PAGE NOT FOUND
            </Text>
            <Text
              fontSize="16px"
              lineHeight="1.8"
              color={BRUT.ink}
              fontWeight="500"
              maxW="440px"
            >
              {message ||
                "You took a turn off the map — this page doesn't exist, but the way home is right here."}
            </Text>
            <Button
              as={Link}
              href="/"
              h="54px"
              px={{ base: 7, md: 8 }}
              fontSize="16px"
              fontFamily="spaceMono"
              fontWeight="700"
              letterSpacing=".04em"
              textTransform="uppercase"
              bg={BRUT.primary}
              color="#FFFFFF"
              border="3px solid"
              borderColor={BRUT.ink}
              borderRadius="10px"
              boxShadow={BRUT.shadow}
              leftIcon={<ArrowLeft size={17} />}
              transition="transform .16s ease, box-shadow .16s ease"
              _hover={{
                bg: BRUT.primaryDeep,
                color: "#FFFFFF",
                textDecoration: "none",
                transform: "translate(-3px, -3px)",
                boxShadow: BRUT.shadowLg,
              }}
              _focusVisible={{
                boxShadow: `${BRUT.shadow}, 0 0 0 3px rgba(4,167,119,0.4)`,
              }}
            >
              Back to Home
            </Button>
          </VStack>

          {/* Clean illustration card: a plain app window holding the giant 404 */}
          <Box
            position="relative"
            bg="#FFFFFF"
            border="3px solid"
            borderColor={BRUT.ink}
            borderRadius="12px"
            boxShadow={BRUT.shadowLg}
            overflow="hidden"
          >
            {/* Window chrome */}
            <Flex
              align="center"
              gap="7px"
              bg={BRUT.ink}
              px={5}
              py="12px"
              aria-hidden="true"
            >
              <Box w="11px" h="11px" borderRadius="full" bg={BRUT.yellow} border="1.5px solid rgba(255,255,255,0.4)" />
              <Box w="11px" h="11px" borderRadius="full" bg={BRUT.blue} border="1.5px solid rgba(255,255,255,0.4)" />
              <Box w="11px" h="11px" borderRadius="full" bg={BRUT.primary} border="1.5px solid rgba(255,255,255,0.4)" />
              <Text
                fontFamily="spaceMono"
                fontSize="11.5px"
                fontWeight="700"
                letterSpacing=".12em"
                color="rgba(255,255,255,0.75)"
                ml="auto"
              >
                error_page.html
              </Text>
            </Flex>

            {/* Body: one bold graphic, nothing else */}
            <Flex
              position="relative"
              align="center"
              justify="center"
              bg={BRUT.bgWash}
              px={8}
              py={{ base: 14, md: 20 }}
              overflow="hidden"
            >
              <Box
                aria-hidden="true"
                position="absolute"
                top="14%"
                left="12%"
                w="26px"
                h="26px"
                borderRadius="6px"
                bg={BRUT.yellow}
                border="2px solid"
                borderColor={BRUT.ink}
              />
              <Box
                aria-hidden="true"
                position="absolute"
                bottom="16%"
                right="12%"
                w="22px"
                h="22px"
                borderRadius="full"
                bg={BRUT.primary}
                border="2px solid"
                borderColor={BRUT.ink}
              />
              <Box
                aria-hidden="true"
                position="absolute"
                bottom="24%"
                left="18%"
                w="14px"
                h="14px"
                borderRadius="4px"
                bg={BRUT.blue}
                border="2px solid"
                borderColor={BRUT.ink}
              />
              <Text
                fontFamily="bungee"
                fontSize={{ base: "clamp(64px, 14vw, 110px)" }}
                lineHeight="1"
                color={BRUT.primary}
                sx={{
                  WebkitTextStroke: `2.5px ${BRUT.ink}`,
                  paintOrder: "stroke fill",
                  textShadow: `5px 5px 0 ${BRUT.yellow}`,
                }}
              >
                {code}
              </Text>
            </Flex>
          </Box>
        </Grid>
      </Box>
    </PublicShell>
  );
};

export default NotFound;
