import React, { useRef } from "react";
import { Box, Button, Container, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { SITE_NAME } from "../utils/seo";
import { useStudioColors } from "../components/public/studio";
import { gsap, prefersReducedMotion } from "../utils/gsap";

const NotFound = ({ code = "404", title = "Page not found", message }) => {
  const rootRef = useRef(null);
  const colors = useStudioColors();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from("[data-error-code]", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.05,
        })
        .from(
          "[data-error-reveal]",
          {
            y: 16,
            autoAlpha: 0,
            duration: 0.52,
            stagger: 0.08,
          },
          "-=0.35",
        );

    },
    { scope: rootRef },
  );

  return (
    <Box ref={rootRef} minH="100vh" bg={colors.bg} display="grid" placeItems="center" px={4}>
      <Helmet>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={message || "This page could not be found in Aurio Rajaa's portfolio."} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Container maxW="620px" textAlign="center">
        <VStack spacing={5}>
          <Heading
            as="h1"
            color={colors.text}
            fontSize={{ base: "44px", md: "48px" }}
            lineHeight="1"
            letterSpacing="0"
          >
            {code.split("").map((digit, idx) => (
              <Box
                as="span"
                data-error-code
                key={`${digit}-${idx}`}
                display="inline-block"
                px={1}
              >
                {digit}
              </Box>
            ))}
          </Heading>
          <Box data-error-reveal h="1px" w="100%" bg={colors.border} />
          <Text data-error-reveal fontSize="20px" fontWeight="700" color={colors.text}>
            {title}
          </Text>
          <Text data-error-reveal fontSize="16px" lineHeight="1.7" color={colors.muted}>
            {message ||
              "The route exists outside the current portfolio map. Head back and keep browsing the work."}
          </Text>
          <Button
            data-error-reveal
            as={Link}
            href="/"
            variant="studio"
            leftIcon={<ArrowLeft size={15} />}
            _hover={{ textDecoration: "none" }}
          >
            Back to Portfolio
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;
