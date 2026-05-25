import React from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { RetroBadge, RetroPanel, useRetroColors } from "../ui/retro";

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useRetroColors();

  return (
    <RetroPanel
      id="contact"
      title="Contact Information"
      icon={Mail}
      headerRight={<RetroBadge tone="green">Open inbox</RetroBadge>}
      bodyProps={{ p: 3 }}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={3}>
        <VStack align="stretch" spacing={2}>
          <Text fontSize="13px" color={colors.text} lineHeight="1.5">
            Open for software engineering opportunities, collaborations, and
            technical conversations around backend systems, cloud, and product
            interfaces.
          </Text>

          <Box border="1px solid" borderColor={colors.borderSoft} bg={colors.panelAlt} p={3}>
            <VStack spacing={2} align="stretch">
              <HStack spacing={2}>
                <Mail size={14} color={colors.link} />
                <Link href={`mailto:${personalInfo.email}`} fontSize="12px" fontWeight="bold">
                  {personalInfo.email}
                </Link>
              </HStack>
              <HStack spacing={2}>
                <Github size={14} color={colors.link} />
                <Link href={personalInfo.github} isExternal fontSize="12px" fontWeight="bold">
                  github.com/auriorajaa
                </Link>
              </HStack>
              <HStack spacing={2}>
                <Linkedin size={14} color={colors.link} />
                <Link href={personalInfo.linkedin} isExternal fontSize="12px" fontWeight="bold">
                  linkedin.com/in/auriorajaa
                </Link>
              </HStack>
              <HStack spacing={2}>
                <MapPin size={14} color={colors.link} />
                <Text fontSize="12px" color={colors.text}>
                  {personalInfo.location || "Jakarta, Indonesia"}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        <Box border="1px solid" borderColor={colors.border} bg={colors.panelAlt} p={3}>
          <Text fontSize="12px" fontWeight="bold" color={colors.text} mb={2}>
            Quick Message Draft
          </Text>
          <VStack spacing={2} align="stretch">
            <Input size="sm" placeholder="Your name" />
            <Input size="sm" type="email" placeholder="Your email" />
            <Textarea size="sm" rows={4} resize="vertical" placeholder="Message" />
            <Button
              as={Link}
              href={`mailto:${personalInfo.email}`}
              variant="facebook"
              size="sm"
              alignSelf="flex-end"
              _hover={{ textDecoration: "none" }}
            >
              Open Email Client
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </RetroPanel>
  );
};

export default Contact;
