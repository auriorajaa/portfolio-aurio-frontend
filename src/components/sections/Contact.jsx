import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import emailjs from "@emailjs/browser";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";

const fieldStyle = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "16px",
  color: "#3b444d",
  background: "#f8fafd",
  border: "1px solid #c9d6e4",
  borderRadius: "4px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color .15s ease, box-shadow .15s ease",
};

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#1f5fa9";
    e.target.style.boxShadow = "0 0 0 3px rgba(31,95,169,0.15)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#c9d6e4";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "mr.auriorajaa@gmail.com",
          reply_to: form.email,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Message sent.",
        description: "Thanks — I'll get back to you soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Message failed.",
        description: error?.text || "Please try again or email directly.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const socials = [
    personalInfo.email && {
      label: "Email",
      href: `mailto:${personalInfo.email}`,
      external: false,
    },
    personalInfo.github && {
      label: "GitHub",
      href: personalInfo.github,
      external: true,
    },
    personalInfo.linkedin && {
      label: "LinkedIn",
      href: personalInfo.linkedin,
      external: true,
    },
  ].filter(Boolean);

  return (
    <Box
      as="section"
      id="contact"
      bg={colors.navyGradient}
      color="#ffffff"
      mx={{ base: "12px", md: "28px" }}
      my={{ base: "14px", md: "26px" }}
      border="1px solid rgba(255,255,255,0.22)"
      boxShadow="0 6px 18px rgba(18,58,99,0.25)"
    >
      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 14, md: 20 }}
      >
        {/* Campaign call */}
        <Box textAlign="center" maxW="780px" mx="auto">
          <Flex align="center" justify="center" gap={3} mb={5}>
            <Box w="44px" h="2px" bg="rgba(255,255,255,0.5)" />
            <Text
              fontSize="12px"
              fontWeight="800"
              letterSpacing=".22em"
              textTransform="uppercase"
              color="#c9dcf1"
            >
              Get in Touch
            </Text>
            <Box w="44px" h="2px" bg="rgba(255,255,255,0.5)" />
          </Flex>

          <Heading
            as="h2"
            fontSize={{ base: "30px", md: "44px" }}
            fontWeight="800"
            lineHeight="1.2"
            textShadow="0 2px 3px rgba(9,24,42,0.45)"
          >
            Have a project in mind?
          </Heading>

          <Text
            mt={4}
            fontSize={{ base: "16px", md: "18px" }}
            lineHeight="1.8"
            color="#dbe7f5"
          >
            Send a message below! I usually reply within 24–48 hours.
          </Text>

          <Flex
            display="inline-flex"
            align="center"
            gap={3}
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.35)"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.15)"
            px={5}
            py={3}
            my={5}
          >
            <Text fontSize="15px" fontWeight="600" color="#ffffff">
              Currently open to full-time roles & project work
            </Text>
          </Flex>
        </Box>

        {/* Form card */}
        <Box
          maxW="820px"
          mx="auto"
          mt={{ base: 9, md: 11 }}
          bg="#ffffff"
          border="1px solid"
          borderColor="#b9c9da"
          boxShadow="0 10px 30px rgba(9,24,42,0.35)"
        >
          <Box as="form" onSubmit={handleSubmit} p={{ base: 5, md: 8 }}>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={{ base: 5, md: 6 }}
            >
              <Box>
                <Text
                  as="label"
                  htmlFor="contact-name"
                  fontSize="12px"
                  fontWeight="700"
                  letterSpacing=".1em"
                  textTransform="uppercase"
                  color={colors.muted}
                  display="block"
                  mb="6px"
                >
                  Name
                </Text>
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Your name"
                  style={fieldStyle}
                />
              </Box>

              <Box>
                <Text
                  as="label"
                  htmlFor="contact-email"
                  fontSize="12px"
                  fontWeight="700"
                  letterSpacing=".1em"
                  textTransform="uppercase"
                  color={colors.muted}
                  display="block"
                  mb="6px"
                >
                  Email
                </Text>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  style={fieldStyle}
                />
              </Box>
            </Grid>

            <Box mt={{ base: 5, md: 6 }}>
              <Text
                as="label"
                htmlFor="contact-message"
                fontSize="12px"
                fontWeight="700"
                letterSpacing=".1em"
                textTransform="uppercase"
                color={colors.muted}
                display="block"
                mb="6px"
              >
                Message
              </Text>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="What would you like to talk about?"
                rows={5}
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </Box>

            <Button
              type="submit"
              variant="classic"
              w="100%"
              h="52px"
              mt={{ base: 6, md: 7 }}
              fontSize="17px"
              isLoading={sending}
              loadingText="Sending..."
            >
              Send Message
            </Button>
          </Box>
        </Box>

        {/* Socials + direct email */}
        <Box textAlign="center" mt={{ base: 8, md: 10 }}>
          <Text fontSize="14px" color="#c9dcf1" mb={4}>
            Or find me on
          </Text>
          <Flex justify="center" gap={3} flexWrap="wrap">
            {socials.map((social) => (
              <Button
                key={social.label}
                as={Link}
                href={social.href}
                isExternal={social.external}
                variant="classicWhite"
                h="46px"
                px={7}
                fontSize="15px"
              >
                {social.label}
              </Button>
            ))}
          </Flex>
          <Text mt={5} fontSize="14px" color="#c9dcf1">
            Or email me directly at{" "}
            <Text as="span" fontWeight="700" color="#ffffff">
              {personalInfo.email}
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
