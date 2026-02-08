// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Eye, EyeOff, Lock, Mail, Shield, Home } from "lucide-react";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { currentUser, isAdminUser } = useAuth();

  // Color mode values
  const bgColor = useColorModeValue("#e9ebee", "#18191a");
  const cardBg = useColorModeValue("white", "#242526");
  const borderColor = useColorModeValue("#d3d6db", "#3e4042");
  const textColor = useColorModeValue("#333333", "#e4e6eb");
  const lightTextColor = useColorModeValue("#90949c", "#b0b3b8");
  const paleBg = useColorModeValue("#d8dfea", "#3a3b3c");
  const grayBg = useColorModeValue("#f7f7f7", "#242526");

  useEffect(() => {
    if (currentUser && isAdminUser) {
      navigate("/dashboard-secure-panel");
    }
  }, [currentUser, isAdminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/dashboard-secure-panel");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: 8, md: 20 }}>
      <Container maxW="900px" px={4}>
        {/* Main Content */}
        <HStack
          spacing={6}
          align="stretch"
          direction={{ base: "column", md: "row" }}
          as={Box}
        >
          {/* Left Side - Branding */}
          <Box flex="1" display={{ base: "none", md: "block" }}>
            <VStack align="start" spacing={4} pt={8}>
              <Text fontSize="16px" color={textColor} lineHeight="1.6">
                Manage your portfolio content, articles, and projects from this
                secure administrative dashboard.
              </Text>

              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="2px"
                p={4}
                w="100%"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="14px" fontWeight="bold" color={textColor}>
                    Portal Features:
                  </Text>

                  <VStack align="start" spacing={2} pl={2}>
                    <HStack spacing={2}>
                      <Box
                        w="4px"
                        h="4px"
                        bg="facebook.blue"
                        borderRadius="full"
                      />
                      <Text fontSize="13px" color={textColor}>
                        Create and edit articles
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Box
                        w="4px"
                        h="4px"
                        bg="facebook.blue"
                        borderRadius="full"
                      />
                      <Text fontSize="13px" color={textColor}>
                        Manage project portfolio
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Box
                        w="4px"
                        h="4px"
                        bg="facebook.blue"
                        borderRadius="full"
                      />
                      <Text fontSize="13px" color={textColor}>
                        Update profile information
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Box
                        w="4px"
                        h="4px"
                        bg="facebook.blue"
                        borderRadius="full"
                      />
                      <Text fontSize="13px" color={textColor}>
                        Content analytics & stats
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              <Box
                bg={paleBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="2px"
                p={3}
                w="100%"
              >
                <HStack spacing={2}>
                  <Lock
                    size={14}
                    color={useColorModeValue("#3b5998", "#5b7ec8")}
                  />
                  <Text fontSize="12px" color={textColor} fontStyle="italic">
                    This area is protected and accessible only to authorized
                    administrators.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Right Side - Login Form */}
          <Box flex="1" maxW={{ base: "100%", md: "400px" }}>
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2px"
            >
              {/* Header */}
              <Box
                borderBottom="1px solid"
                borderColor={borderColor}
                px={4}
                py={3}
                bg={grayBg}
              >
                <VStack spacing={1} align="start">
                  <Text fontSize="12px" color={lightTextColor}>
                    Enter your credentials to continue
                  </Text>
                </VStack>
              </Box>

              {/* Form */}
              <Box px={4} py={4}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={3}>
                    <FormControl isRequired>
                      <FormLabel
                        fontSize="13px"
                        fontWeight="bold"
                        mb={2}
                        color={textColor}
                      >
                        Email Address
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@example.com"
                          fontSize="13px"
                          pl={8}
                        />
                        <Box
                          position="absolute"
                          left="8px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={1}
                          pointerEvents="none"
                        >
                          <Mail size={16} color={lightTextColor} />
                        </Box>
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel
                        fontSize="13px"
                        fontWeight="bold"
                        mb={2}
                        color={textColor}
                      >
                        Password
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          fontSize="13px"
                          pl={8}
                        />
                        <Box
                          position="absolute"
                          left="8px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={1}
                          pointerEvents="none"
                        >
                          <Lock size={16} color={lightTextColor} />
                        </Box>
                        <InputRightElement>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            icon={
                              showPassword ? (
                                <EyeOff size={16} color={lightTextColor} />
                              ) : (
                                <Eye size={16} color={lightTextColor} />
                              )
                            }
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            _hover={{ bg: paleBg }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <Button
                      type="submit"
                      w="full"
                      variant="facebook"
                      fontSize="13px"
                      fontWeight="bold"
                      isLoading={loading}
                      loadingText="Signing in..."
                      mt={2}
                      h="38px"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>
              </Box>

              {/* Footer */}
              <Box
                borderTop="1px solid"
                borderColor={borderColor}
                px={4}
                py={3}
                bg={grayBg}
              >
                <VStack spacing={2}>
                  <HStack spacing={2} fontSize="12px" color={lightTextColor}>
                    <Lock size={12} />
                    <Text>Secure encrypted connection</Text>
                  </HStack>

                  <Divider borderColor={borderColor} />

                  <Button
                    variant="facebookGray"
                    size="sm"
                    fontSize="12px"
                    h="32px"
                    leftIcon={<Home size={14} />}
                    onClick={() => navigate("/")}
                    w="full"
                  >
                    Back to Portfolio
                  </Button>
                </VStack>
              </Box>
            </Box>

            {/* Mobile Branding Info */}
            <Box
              display={{ base: "block", md: "none" }}
              mt={4}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2px"
              p={3}
            >
              <VStack align="start" spacing={2}>
                <HStack spacing={2}>
                  <Shield
                    size={16}
                    color={useColorModeValue("#3b5998", "#5b7ec8")}
                  />
                  <Text fontSize="13px" fontWeight="bold" color={textColor}>
                    About Admin Portal
                  </Text>
                </HStack>
                <Text fontSize="12px" color={lightTextColor} lineHeight="1.5">
                  Manage articles, projects, and portfolio content. Protected
                  access for administrators only.
                </Text>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
};

export default Login;
