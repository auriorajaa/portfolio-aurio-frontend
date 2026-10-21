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
import { LAGOON, DoodlePaperPlane, DoodleTape } from "../public/studio";

const inputStyles = {
  bg: "#FFFFFF",
  border: "1.5px solid",
  borderColor: "#CFE8E4",
  borderRadius: "8px",
  fontSize: "15px",
  color: LAGOON.heading,
  _hover: { borderColor: "#9FD8D1" },
  _focus: {
    borderColor: LAGOON.primary,
    boxShadow: "0 0 0 3px rgba(14,140,134,0.16)",
    bg: "#FFFFFF",
  },
  _placeholder: { color: "#9AB4B1" },
};

// A clipboard hanging by the door. Grab the form, fill in the
// blanks, hand it back. The memo corner keeps the "TO:" address.
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
    <Box
      position="relative"
      mt="20px"
      transform={{ base: "none", lg: "rotate(-0.6deg)" }}
    >
      {/* Metal clamp */}
      <Box
        aria-hidden="true"
        position="absolute"
        top="-16px"
        left="50%"
        ml="-36px"
        w="72px"
        h="32px"
        bg={LAGOON.primary}
        border="2px solid #0B2F2F"
        borderRadius="8px"
        boxShadow="2px 3px 0 rgba(11,47,47,0.55)"
        zIndex={3}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          ml="-8px"
          mt="-8px"
          w="16px"
          h="16px"
          borderRadius="full"
          bg="#FFFFFF"
          border="1.5px solid #0B2F2F"
        />
      </Box>

      {/* Board */}
      <Box
        bg="#FFFFFF"
        border="2px solid #0B2F2F"
        borderRadius="16px"
        boxShadow="9px 9px 0 rgba(11,47,47,0.9)"
        p={{ base: 6, md: 8 }}
        pt={{ base: 8, md: 10 }}
      >
        <Flex align="flex-start" justify="space-between" gap={4} mb={6}>
          <Box>
            <Text className="public-mono" fontSize="12px" fontWeight="500" color={LAGOON.muted}>
              clipboard — slip no. 001
            </Text>
            <Text
              fontFamily="heading"
              fontSize={{ base: "20px", md: "22px" }}
              fontWeight="700"
              letterSpacing="-.02em"
              color={LAGOON.heading}
              mt="3px"
            >
              Write me a message
            </Text>
          </Box>
          <Text
            className="public-hand"
            fontSize="19px"
            fontWeight="600"
            color={LAGOON.primaryDark}
            lineHeight="1.1"
            display={{ base: "none", sm: "block" }}
            transform="rotate(-2deg)"
            mt="4px"
          >
            just type and hand it back!
          </Text>
        </Flex>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 184px" }}
          gap={{ base: 5, md: 6 }}
          alignItems="start"
        >
          {/* Form sheet, paper-clipped to the board */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="#F7FBFA"
            border="1.5px dashed rgba(11,47,47,0.4)"
            borderRadius="10px"
            p={{ base: 4, md: 5 }}
          >
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
              <FormControl isRequired>
                <FormLabel className="public-mono" fontSize="12px" fontWeight="500" color={LAGOON.muted} mb={2}>
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
                <FormLabel className="public-mono" fontSize="12px" fontWeight="500" color={LAGOON.muted} mb={2}>
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
              <FormLabel className="public-mono" fontSize="12px" fontWeight="500" color={LAGOON.muted} mb={2}>
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
                sx={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 33px, rgba(11,47,47,0.10) 33px, rgba(11,47,47,0.10) 34px)",
                  backgroundPositionY: "14px",
                }}
                {...inputStyles}
              />
            </FormControl>

            <Button
              type="submit"
              variant="lagoonCoral"
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
            <DoodleTape
              w={88}
              h={20}
              color="rgba(255,107,74,0.5)"
              rotation={-4}
              top="-10px"
              left="48px"
              zIndex={2}
            />
            <Box
              bg="#FFD34D"
              border="1.5px solid #0B2F2F"
              borderRadius="4px"
              p={5}
              transform="rotate(1.8deg)"
              boxShadow="4px 4px 0 rgba(11,47,47,0.35)"
              transition="transform .2s ease"
              _hover={{ transform: "rotate(0.4deg)" }}
            >
              <Text className="public-hand" fontSize="21px" fontWeight="600" color="#0B2F2F" lineHeight="1.1">
                TO:
              </Text>
              <Text fontSize="15px" fontWeight="700" color="#0B2F2F" mt={2} lineHeight="1.5">
                {personalInfo.name || "Aurio Rajaa"}
                <br />
                {personalInfo.location || "Jakarta, Indonesia"}
              </Text>
              <Box mt={4} borderTop="1.5px dashed rgba(11,47,47,0.35)" pt={4} textAlign="center">
                <DoodlePaperPlane size={52} />
              </Box>
              <Text className="public-mono" fontSize="10px" fontWeight="600" color="#0B2F2F" mt={3} letterSpacing=".14em" textAlign="center">
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
