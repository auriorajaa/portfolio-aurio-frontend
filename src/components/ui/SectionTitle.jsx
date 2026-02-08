import React from "react";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";

const SectionTitle = ({ children, id }) => {
  const borderColor = useColorModeValue("#333333", "#e4e6eb");

  return (
    <Box id={id} pt={20} pb={8}>
      <Heading
        as="h2"
        fontSize={{ base: "xl", md: "2xl" }}
        borderBottom={`3px solid ${borderColor}`}
        pb={2}
        display="inline-block"
        fontWeight="bold"
        letterSpacing="0.05em"
      >
        {children}
      </Heading>
    </Box>
  );
};

export default SectionTitle;
