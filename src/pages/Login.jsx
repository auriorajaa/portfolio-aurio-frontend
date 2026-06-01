// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { StudioPill, useStudioColors } from "../components/public/studio";

const LOGIN_FEATURES = [
  { icon: FileText, label: "Articles", text: "Drafts, visibility, previews" },
  { icon: FolderOpen, label: "Projects", text: "Showcase media and links" },
  { icon: UserRound, label: "Profile", text: "Bio, SEO, contact details" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { currentUser, isAdminUser } = useAuth();
  const colors = useStudioColors();

  useEffect(() => {
    if (currentUser && isAdminUser) {
      navigate("/dashboard-secure-panel");
    }
  }, [currentUser, isAdminUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please fill in both fields.",
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
        title: "Signed in",
        description: "Welcome back to the portfolio studio.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/dashboard-secure-panel");
    } catch (error) {
      toast({
        title: "Login failed",
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
    <Box minH="100vh" bg={colors.bg} color={colors.text} overflowX="hidden">
      <Container maxW="1180px" w="100%" px={{ base: 4, md: 6 }} py={{ base: 5, md: 8 }}>
        <HStack
          justify="space-between"
          align="center"
          mb={{ base: 8, md: 18 }}
          w="100%"
          maxW="calc(100vw - 32px)"
        >
          <Link href="/" _hover={{ textDecoration: "none", opacity: 0.72 }}>
            <Text fontSize="15px" fontWeight="700" letterSpacing="-.01em">
              aurio
              <Box as="span" color={colors.muted} fontWeight="400">
                .work
              </Box>
            </Text>
          </Link>
          <Button
            variant="studioGhost"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => navigate("/")}
          >
            Portfolio
          </Button>
        </HStack>

        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(0, .9fr) 420px" }}
          gap={{ base: 8, lg: 16 }}
          alignItems="center"
          minW={0}
        >
          <VStack
            align="stretch"
            spacing={{ base: 5, md: 9 }}
            minW={0}
            w="100%"
            maxW={{ base: "calc(100vw - 32px)", lg: "720px" }}
          >
            <HStack spacing={3} flexWrap="wrap">
              <StudioPill>Private Studio</StudioPill>
              <Text fontSize="15px" color={colors.muted} fontWeight="500">
                Portfolio administration
              </Text>
            </HStack>

            <Box>
              <Text
                as="h1"
                fontSize={{ base: "38px", md: "56px" }}
                lineHeight=".99"
                fontWeight="800"
                letterSpacing="-0.02em"
                maxW={{ base: "calc(100vw - 32px)", lg: "720px" }}
                overflowWrap="break-word"
              >
                A quiet control room for the public portfolio.
              </Text>
              <Text
                mt={5}
                fontSize={{ base: "16px", md: "18px" }}
                lineHeight="1.75"
                color={colors.muted}
                maxW={{ base: "calc(100vw - 32px)", md: "600px" }}
              >
                Sign in to manage writing, project case studies, profile data,
                credentials, media, and the small details that keep the site
                sharp.
              </Text>
            </Box>

            <SimpleGrid display={{ base: "none", md: "grid" }} columns={{ md: 3 }} spacing={3}>
              {LOGIN_FEATURES.map(({ icon: Icon, label, text }) => (
                <Box
                  key={label}
                  border="1px solid"
                  borderColor={colors.border}
                  borderRadius="18px"
                  bg={colors.surfaceAlt}
                  p={4}
                >
                  <Icon size={18} color={colors.muted} />
                  <Text mt={4} fontSize="15px" fontWeight="700">
                    {label}
                  </Text>
                  <Text mt={1} fontSize="13px" color={colors.muted} lineHeight="1.55">
                    {text}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            <HStack
              display={{ base: "none", md: "flex" }}
              borderTop="1px solid"
              borderColor={colors.borderSoft}
              pt={5}
              spacing={3}
              color={colors.muted}
              align="start"
            >
              <ShieldCheck size={18} />
              <Text fontSize="14px" lineHeight="1.65" maxW="560px">
                Access is restricted to the owner account. The public portfolio
                stays untouched until saved changes are published from the
                dashboard.
              </Text>
            </HStack>
          </VStack>

          <Box
            bg={colors.surfaceAlt}
            border="1px solid"
            borderColor={colors.border}
            borderRadius="28px"
            boxShadow="0 24px 60px rgba(0,0,0,.06)"
            overflow="hidden"
            minW={0}
            w={{ base: "calc(100vw - 32px)", lg: "420px" }}
            maxW="calc(100vw - 32px)"
          >
            <Box px={{ base: 5, md: 6 }} py={5}>
              <Text fontSize="24px" fontWeight="800" lineHeight="1.12">
                Sign in
              </Text>
              <Text mt={2} fontSize="14px" color={colors.muted}>
                Use your admin credentials to continue.
              </Text>
            </Box>

            <Divider borderColor={colors.borderSoft} />

            <Box px={{ base: 5, md: 6 }} py={{ base: 5, md: 6 }}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Email address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Mail size={16} color={colors.muted} />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Lock size={16} color={colors.muted} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <InputRightElement>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={
                            showPassword ? (
                              <EyeOff size={16} color={colors.muted} />
                            ) : (
                              <Eye size={16} color={colors.muted} />
                            )
                          }
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="studio"
                    h="44px"
                    isLoading={loading}
                    loadingText="Signing in..."
                  >
                    Enter dashboard
                  </Button>
                </VStack>
              </form>
            </Box>

            <Divider borderColor={colors.borderSoft} />

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={3}
              align={{ base: "stretch", sm: "center" }}
              justify="space-between"
              px={{ base: 5, md: 6 }}
              py={4}
              bg={colors.surface}
            >
              <HStack spacing={2} color={colors.muted}>
                <Lock size={13} />
                <Text fontSize="13px">Encrypted admin session</Text>
              </HStack>
              <Button variant="studioGhost" size="sm" onClick={() => navigate("/")}>
                Back to site
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
