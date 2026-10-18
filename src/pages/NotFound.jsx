import React from "react";
import { Box, Button, Link, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { SITE_NAME } from "../utils/seo";

const NotFound = ({ code = "404", title = "Page not found", message }) => (
  <Box minH="100vh" bg="#ffffff" display="flex" alignItems="center" justifyContent="center" px={4}>
    <Helmet>
      <title>{`${title} | ${SITE_NAME}`}</title>
      <meta
        name="description"
        content={message || "This page could not be found in Aurio Rajaa's portfolio."}
      />
      <meta name="robots" content="noindex, follow" />
    </Helmet>

    <VStack spacing={4} textAlign="center" maxW="560px">
      <Text as="h1" fontSize={{ base: "64px", md: "84px" }} fontWeight="700" lineHeight="1" color="#123a63">
        {code}
      </Text>
      <Text fontSize={{ base: "20px", md: "22px" }} fontWeight="700" color="#123a63">
        {title}
      </Text>
      <Text fontSize="18px" lineHeight="1.7" color="#68788a">
        {message ||
          "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
      </Text>
      <Button
        as={Link}
        href="/"
        variant="classic"
        h="48px"
        px={7}
        fontSize="16px"
        leftIcon={<ArrowLeft size={15} />}
        mt={2}
      >
        Back to Portfolio
      </Button>
    </VStack>
  </Box>
);

export default NotFound;
