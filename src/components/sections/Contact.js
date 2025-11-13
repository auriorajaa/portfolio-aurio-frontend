import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiMail, FiLinkedin, FiGithub, FiSend } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import { personalInfo } from "../../data/portfolioData";
import { keyframes } from "@chakra-ui/react";

const MotionBox = motion(Box);

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const textPrimary = useColorModeValue("gray.800", "#e6f1ff");
  const textSecondary = useColorModeValue("gray.600", "#8892b0");
  const cardBg = useColorModeValue("white", "#112240");
  const inputBg = useColorModeValue("gray.50", "#1a2942");
  const hoverBg = useColorModeValue("white", "#162b46");
  const borderColor = useColorModeValue("gray.200", "#1e3a5f");
  const focusColor = useColorModeValue("brand.500", "brand.400");

  const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

  const bgGradient = useColorModeValue(
    "linear(to-tr, teal.50, brand.50, blue.100)",
    "linear(to-tr, teal.900, brand.900, blue.900)"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey)
        throw new Error("Email service not configured");

      const templateParams = {
        to_email: personalInfo.email,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email sending failed:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      as="section"
      id="contact"
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Blobs */}
      <Box
        position="absolute"
        top="20%"
        right="8%"
        w={{ base: "240px", md: "390px" }}
        h={{ base: "240px", md: "390px" }}
        bgGradient="radial(circle, brand.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.35, 0.18)}
        borderRadius="full"
        filter="blur(75px)"
        animation={`${floatingAnimation} 12s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="25%"
        left="10%"
        w={{ base: "200px", md: "350px" }}
        h={{ base: "200px", md: "350px" }}
        bgGradient="radial(circle, blue.200 0%, transparent 70%)"
        opacity={useColorModeValue(0.35, 0.18)}
        borderRadius="full"
        filter="blur(70px)"
        animation={`${floatingAnimation} 14s ease-in-out infinite reverse`}
      />
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 12 }}>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            textAlign="center"
            color={textPrimary}
            fontWeight="bold"
          >
            Get In Touch
          </Heading>

          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 8, md: 10 }}
            w="100%"
          >
            {/* Contact Info */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <VStack spacing={6} align="flex-start">
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={textPrimary}
                >
                  Let's Connect
                </Heading>
                <Text color={textSecondary} fontSize={{ base: "md", md: "lg" }}>
                  Feel free to reach out for collaborations, projects, or just a
                  friendly chat!
                </Text>

                <List spacing={5} w="100%">
                  {[
                    { icon: FiMail, label: "Email", value: personalInfo.email },
                    {
                      icon: FiLinkedin,
                      label: "LinkedIn",
                      value: "linkedin.com/in/auriorajaa",
                    },
                    {
                      icon: FiGithub,
                      label: "GitHub",
                      value: "github.com/auriorajaa",
                    },
                  ].map((item, idx) => (
                    <ListItem key={idx}>
                      <HStack spacing={4}>
                        <Box as={item.icon} color="brand.400" fontSize="xl" />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontWeight="medium" color={textPrimary}>
                            {item.label}
                          </Text>
                          <Text
                            color={textSecondary}
                            fontSize="sm"
                            wordBreak="break-word"
                          >
                            {item.value}
                          </Text>
                        </VStack>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </MotionBox>

            {/* Contact Form */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={5}>
                    {["name", "email", "subject"].map((field) => (
                      <FormControl key={field} isInvalid={errors[field]}>
                        <FormLabel fontWeight="medium" color={textPrimary}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        <Input
                          name={field}
                          type={field === "email" ? "email" : "text"}
                          placeholder={`Enter your ${field}`}
                          value={formData[field]}
                          onChange={handleChange}
                          bg={inputBg}
                          border="1px solid"
                          borderColor={borderColor}
                          _focus={{
                            borderColor: focusColor,
                            boxShadow: `0 0 0 2px ${focusColor}`,
                            bg: hoverBg,
                          }}
                          _hover={{
                            borderColor: focusColor,
                            bg: hoverBg,
                          }}
                        />
                      </FormControl>
                    ))}

                    <FormControl isInvalid={errors.message}>
                      <FormLabel fontWeight="medium" color={textPrimary}>
                        Message
                      </FormLabel>
                      <Textarea
                        name="message"
                        placeholder="Write your message..."
                        value={formData.message}
                        onChange={handleChange}
                        bg={inputBg}
                        border="1px solid"
                        borderColor={borderColor}
                        rows={6}
                        _focus={{
                          borderColor: focusColor,
                          boxShadow: `0 0 0 2px ${focusColor}`,
                          bg: hoverBg,
                        }}
                        _hover={{
                          borderColor: focusColor,
                          bg: hoverBg,
                        }}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      leftIcon={!isLoading && <FiSend />}
                      isLoading={isLoading}
                      loadingText="Sending..."
                      borderRadius="xl"
                      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                      transition="all 0.3s ease"
                    >
                      Send Message
                    </Button>
                  </VStack>
                </form>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;
