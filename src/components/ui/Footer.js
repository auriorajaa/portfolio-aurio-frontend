import React from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { personalInfo } from "../../data/portfolioData";

const Footer = () => {
  const bgColor = useColorModeValue("gray.50", "#0a192f");
  const textColor = useColorModeValue("gray.600", "#8892b0");
  const borderColor = useColorModeValue("gray.200", "#112240");
  const iconHoverBg = useColorModeValue("brand.50", "brand.900");

  return (
    <Box
      as="footer"
      bg={bgColor}
      py={{ base: 8, md: 10 }}
      borderTop="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }}>
          <HStack spacing={{ base: 3, md: 4 }}>
            <IconButton
              as="a"
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              icon={<FiGithub />}
              variant="ghost"
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "lg", md: "xl" }}
              _hover={{ bg: iconHoverBg, color: "brand.500" }}
              transition="all 0.3s"
            />
            <IconButton
              as="a"
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              icon={<FiLinkedin />}
              variant="ghost"
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "lg", md: "xl" }}
              _hover={{ bg: iconHoverBg, color: "brand.500" }}
              transition="all 0.3s"
            />
            <IconButton
              as="a"
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              icon={<FiMail />}
              variant="ghost"
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "lg", md: "xl" }}
              _hover={{ bg: iconHoverBg, color: "brand.500" }}
              transition="all 0.3s"
            />
          </HStack>

          <Text
            textAlign="center"
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="500"
          >
            © {new Date().getFullYear()} {personalInfo.name}. All rights
            reserved.
          </Text>

          <HStack
            spacing={1}
            fontSize={{ base: "xs", md: "sm" }}
            color={textColor}
            textAlign="center"
            flexWrap="wrap"
            justify="center"
          >
            <Text>Made with</Text>
            <Box as={FiHeart} color="red.400" display="inline" />
            <Text>using React, Chakra UI, and Framer Motion</Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
