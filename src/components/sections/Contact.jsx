import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { BRUT, DoodlePaperPlane } from "../public/brutal";

const inputStyles = {
  bg: "#FFFFFF",
  border: "2px solid",
  borderColor: BRUT.ink,
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "500",
  color: BRUT.heading,
  boxShadow: BRUT.shadowXs,
  _hover: { borderColor: BRUT.primary },
  _focus: {
    borderColor: BRUT.primaryDeep,
    boxShadow: `0 0 0 3px rgba(4,167,119,0.35), ${BRUT.shadowXs}`,
    bg: "#FFFFFF",
  },
  _placeholder: { color: "#A2A4AC" },
};

// Form no.001: a paper slip you fill in and hand back across the
// counter. The "TO:" memo keeps the address; the send button is
// stationed under the dashed divider.
const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
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
        title: "Slip handed in.",
        description: "Thanks, I'll get back to you soon.",
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

  return (
    <Box position="relative" mt="8px">
      {/* Board */}
      <Box
        bg={BRUT.surface}
        border="2.5px solid"
        borderColor={BRUT.ink}
        borderRadius="12px"
        boxShadow={BRUT.shadowLg}
        p={{ base: 5, md: 7 }}
      >
        <Flex align="flex-start" justify="space-between" gap={4} mb={6}>
          <Box>
            <Text
              fontFamily="heading"
              fontSize={{ base: "21px", md: "23px" }}
              fontWeight="600"
              color={BRUT.heading}
              mt="3px"
            >
              Write me a message
            </Text>
          </Box>
        </Flex>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 190px" }}
          gap={{ base: 5, md: 6 }}
          alignItems="start"
        >
          <Box as="form" onSubmit={handleSubmit}>
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
              <FormControl isRequired>
                <FormLabel
                  fontFamily="spaceMono"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing=".12em"
                  textTransform="uppercase"
                  color={BRUT.ink}
                  mb={2}
                >
                  From
                </FormLabel>
                <Input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  h="48px"
                  px={4}
                  {...inputStyles}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  fontFamily="spaceMono"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing=".12em"
                  textTransform="uppercase"
                  color={BRUT.ink}
                  mb={2}
                >
                  Reply to
                </FormLabel>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  h="48px"
                  px={4}
                  {...inputStyles}
                />
              </FormControl>
            </Grid>

            <FormControl isRequired mt={4}>
              <FormLabel
                fontFamily="spaceMono"
                fontSize="11px"
                fontWeight="700"
                letterSpacing=".12em"
                textTransform="uppercase"
                color={BRUT.ink}
                mb={2}
              >
                Message
              </FormLabel>
              <Textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                rows={5}
                resize="vertical"
                px={4}
                py={3}
                {...inputStyles}
              />
            </FormControl>

            <Button
              type="submit"
              variant="brutCoral"
              w="100%"
              h="50px"
              mt={5}
              leftIcon={<Send size={16} />}
              isLoading={sending}
              loadingText="Sending..."
            >
              Hand in the slip
            </Button>
          </Box>

          {/* Memo corner with the address */}
          <Box position="relative" display={{ base: "none", lg: "block" }}>
            <Box
              bg={BRUT.yellow}
              border="2px solid"
              borderColor={BRUT.ink}
              borderRadius="8px"
              p={5}

              boxShadow={BRUT.shadow}
              transition="transform .2s ease"
              _hover={{ transform: "translate(-2px, -2px)", boxShadow: BRUT.shadowLg }}
            >
              <Text
                fontFamily="bungee"
                fontSize="19px"
                color={BRUT.ink}
                lineHeight="1"
              >
                TO:
              </Text>
              <Text
                fontFamily="heading"
                fontSize="15px"
                fontWeight="600"
                color={BRUT.ink}
                mt={3}
                lineHeight="1.5"
              >
                {personalInfo.name || "Aurio Rajaa"}
                <br />
                {personalInfo.location || "Jakarta, Indonesia"}
              </Text>
              <Box mt={4} borderTop="2px dashed rgba(23,24,28,0.4)" pt={4} textAlign="center">
                <DoodlePaperPlane size={52} />
              </Box>
              <Text
                fontFamily="spaceMono"
                fontSize="9.5px"
                fontWeight="700"
                color={BRUT.ink}
                mt={3}
                letterSpacing=".14em"
                textAlign="center"
                textTransform="uppercase"
              >
                NO ENVELOPE NEEDED
              </Text>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Contact;
