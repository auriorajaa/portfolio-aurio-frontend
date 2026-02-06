import React from "react";
import { Box, Text } from "@chakra-ui/react";
import SectionTitle from "../ui/SectionTitle";
import Divider from "../ui/Divider";

const About = () => {
  return (
    <Box>
      <SectionTitle id="about">ABOUT_ME//</SectionTitle>
      <Text fontSize="md" lineHeight="1.8">
        Backend developer specializing in Spring Boot and Java ecosystem. 
        Building robust RESTful APIs and microservices. Also experienced with 
        Django and modern frontend technologies like React and Next.js.
      </Text>
      <Text fontSize="md" mt={4} lineHeight="1.8">
        Currently based in Jakarta, Indonesia. Open for collaboration and 
        new opportunities in software engineering.
      </Text>
      <Divider />
    </Box>
  );
};

export default About;