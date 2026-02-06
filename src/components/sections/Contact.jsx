import React from "react";
import { Box, Text, Flex, VStack, Input, Textarea, Button, Link } from "@chakra-ui/react";
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
      {/* Section Header */}
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

      {/* Contact Content */}
      <Box px={3} py={3}>
        <Text fontSize="11px" color="facebook.text" mb={3} lineHeight="1.4">
          Open for opportunities and collaborations. Feel free to reach out through any of the following channels.
        </Text>

        {/* Contact Links */}
        <VStack spacing={2} align="stretch" mb={4}>
          <Flex align="center" gap={2}>
            <Mail size={12} color="#3b5998" />
            <Link href={`mailto:${personalInfo.email}`} fontSize="11px" color="facebook.linkBlue" fontWeight="bold">
              {personalInfo.email}
            </Link>
          </Flex>
          <Flex align="center" gap={2}>
            <Github size={12} color="#3b5998" />
            <Link href={personalInfo.github} isExternal fontSize="11px" color="facebook.linkBlue" fontWeight="bold">
              github.com/auriorajaa
            </Link>
          </Flex>
          <Flex align="center" gap={2}>
            <Linkedin size={12} color="#3b5998" />
            <Link href={personalInfo.linkedin} isExternal fontSize="11px" color="facebook.linkBlue" fontWeight="bold">
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
          <VStack spacing={2}>
            <Input
              placeholder="Your Name"
              size="sm"
              bg="white"
              border="1px solid"
              borderColor="facebook.border"
              borderRadius="2px"
              fontSize="11px"
              _focus={{
                outline: "none",
                borderColor: "facebook.blue",
              }}
            />
            <Input
              placeholder="Your Email"
              type="email"
              size="sm"
              bg="white"
              border="1px solid"
              borderColor="facebook.border"
              borderRadius="2px"
              fontSize="11px"
              _focus={{
                outline: "none",
                borderColor: "facebook.blue",
              }}
            />
            <Textarea
              placeholder="Your Message"
              size="sm"
              bg="white"
              border="1px solid"
              borderColor="facebook.border"
              borderRadius="2px"
              fontSize="11px"
              rows={4}
              _focus={{
                outline: "none",
                borderColor: "facebook.blue",
              }}
            />
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