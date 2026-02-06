import React from "react";
import {
  Box,
  Text,
  Flex,
  VStack,
  Input,
  Textarea,
  Button,
  Link,
} from "@chakra-ui/react";
import { Mail, Github, Linkedin } from "lucide-react";
import { personalInfo } from "../../data/portfolioData";

const Contact = () => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="facebook.border"
      borderRadius="2px"
      mb={4}
      id="contact"
    >
      {/* Header */}
      <Flex
        borderBottom="1px solid"
        borderColor="facebook.border"
        px={3}
        py={2}
        align="center"
        gap={2}
        bg="facebook.gray"
      >
        <Mail size={14} color="#3b5998" />
        <Text fontSize="12px" fontWeight="bold" color="facebook.text">
          Contact Information
        </Text>
      </Flex>

      <Box px={3} py={3}>
        <Text fontSize="11px" color="facebook.text" mb={3} lineHeight="1.4">
          Open for opportunities and collaborations. Feel free to reach out.
        </Text>

        {/* Links */}
        <VStack spacing={2} align="stretch" mb={4}>
          <Flex align="center" gap={2}>
            <Mail size={12} color="#3b5998" />
            <Link
              href={`mailto:${personalInfo.email}`}
              fontSize="11px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              {personalInfo.email}
            </Link>
          </Flex>

          <Flex align="center" gap={2}>
            <Github size={12} color="#3b5998" />
            <Link
              href={personalInfo.github}
              isExternal
              fontSize="11px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              github.com/auriorajaa
            </Link>
          </Flex>

          <Flex align="center" gap={2}>
            <Linkedin size={12} color="#3b5998" />
            <Link
              href={personalInfo.linkedin}
              isExternal
              fontSize="11px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              linkedin.com/in/auriorajaa
            </Link>
          </Flex>
        </VStack>

        {/* Message Form */}
        <Box
          bg="facebook.gray"
          border="1px solid"
          borderColor="facebook.border"
          p={3}
          borderRadius="2px"
        >
          <Text fontSize="11px" fontWeight="bold" color="facebook.text" mb={2}>
            Send a Message
          </Text>

          <VStack spacing={3} align="stretch">
            {/* Name */}
            <Box>
              <Text fontSize="10px" color="facebook.lightText" mb={1}>
                Your Name
              </Text>
              <Input
                size="sm"
                bg="white"
                border="1px solid"
                borderColor="facebook.border"
                borderRadius="2px"
                fontSize="11px"
                _focus={{ borderColor: "facebook.blue" }}
              />
            </Box>

            {/* Email */}
            <Box>
              <Text fontSize="10px" color="facebook.lightText" mb={1}>
                Your Email
              </Text>
              <Input
                type="email"
                size="sm"
                bg="white"
                border="1px solid"
                borderColor="facebook.border"
                borderRadius="2px"
                fontSize="11px"
                _focus={{ borderColor: "facebook.blue" }}
              />
            </Box>

            {/* Message */}
            <Box>
              <Text fontSize="10px" color="facebook.lightText" mb={1}>
                Message
              </Text>
              <Textarea
                size="sm"
                bg="white"
                border="1px solid"
                borderColor="facebook.border"
                borderRadius="2px"
                fontSize="11px"
                rows={4}
                resize="none"
                _focus={{ borderColor: "facebook.blue" }}
              />
            </Box>

            <Button variant="facebook" size="sm" alignSelf="flex-end">
              Send Message
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
