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
  useColorModeValue,
} from "@chakra-ui/react";
import { Mail, Github, Linkedin } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo;
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");
  const iconColor = useColorModeValue("#3b5998", "#5b7ec8");
  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2px"
      mb={4}
      id="contact"
    >
      {/* Header */}
      <Flex
        borderBottom="1px solid"
        borderColor={borderColor}
        px={3}
        py={2}
        align="center"
        gap={2}
        bg={grayBg}
      >
        <Mail size={14} color={iconColor} />
        <Text fontSize="14px" fontWeight="bold" color={textColor}>
          Contact Information
        </Text>
      </Flex>

      <Box px={3} py={3}>
        <Text fontSize="13px" color={textColor} mb={3} lineHeight="1.4">
          Open for opportunities and collaborations. Feel free to reach out.
        </Text>

        {/* Links */}
        <VStack spacing={2} align="stretch" mb={4}>
          <Flex align="center" gap={2}>
            <Mail size={12} color={iconColor} />
            <Link
              href={`mailto:${personalInfo.email}`}
              fontSize="13px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              {personalInfo.email}
            </Link>
          </Flex>

          <Flex align="center" gap={2}>
            <Github size={12} color={iconColor} />
            <Link
              href={personalInfo.github}
              isExternal
              fontSize="13px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              github.com/auriorajaa
            </Link>
          </Flex>

          <Flex align="center" gap={2}>
            <Linkedin size={12} color={iconColor} />
            <Link
              href={personalInfo.linkedin}
              isExternal
              fontSize="13px"
              color="facebook.linkBlue"
              fontWeight="bold"
            >
              linkedin.com/in/auriorajaa
            </Link>
          </Flex>
        </VStack>

        {/* Message Form */}
        <Box
          bg={grayBg}
          border="1px solid"
          borderColor={borderColor}
          p={3}
          borderRadius="2px"
        >
          <Text fontSize="13px" fontWeight="bold" color={textColor} mb={2}>
            Send a Message
          </Text>

          <VStack spacing={3} align="stretch">
            {/* Name */}
            <Box>
              <Text fontSize="12px" color={lightTextColor} mb={1}>
                Your Name
              </Text>
              <Input
                size="sm"
                borderRadius="2px"
                fontSize="13px"
                _hover={{ borderColor: "facebook.blue" }}
                _focus={{
                  borderColor: "facebook.blue",
                  boxShadow: "0 0 0 1px #3b5998",
                }}
              />
            </Box>

            {/* Email */}
            <Box>
              <Text fontSize="12px" color={lightTextColor} mb={1}>
                Your Email
              </Text>
              <Input
                type="email"
                size="sm"
                borderRadius="2px"
                fontSize="13px"
                _hover={{ borderColor: "facebook.blue" }}
                _focus={{
                  borderColor: "facebook.blue",
                  boxShadow: "0 0 0 1px #3b5998",
                }}
              />
            </Box>

            {/* Message */}
            <Box>
              <Text fontSize="12px" color={lightTextColor} mb={1}>
                Message
              </Text>
              <Textarea
                size="sm"
                borderRadius="2px"
                fontSize="13px"
                rows={4}
                resize="none"
                _hover={{ borderColor: "facebook.blue" }}
                _focus={{
                  borderColor: "facebook.blue",
                  boxShadow: "0 0 0 1px #3b5998",
                }}
              />
            </Box>

            <Button variant="facebook" size="md" alignSelf="flex-end">
              Send Message
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
