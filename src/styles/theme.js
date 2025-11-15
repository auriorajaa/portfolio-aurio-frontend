import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#e3f5ff",
      100: "#b3e0ff",
      200: "#80cbff",
      300: "#4db5ff",
      400: "#26a5ff",
      500: "#0891e0", // Deep Ocean Blue - Primary
      600: "#0077b6", // Darker Ocean Blue
      700: "#005f8f", // Navy Blue
      800: "#004768", // Deep Navy
      900: "#023047", // Darkest Navy
    },
    accent: {
      50: "#fff5e6",
      100: "#ffe0b3",
      200: "#ffcb80",
      300: "#ffb64d",
      400: "#ffa726",
      500: "#ff9800",
      600: "#fb8c00",
      700: "#f57c00",
      800: "#ef6c00",
      900: "#e65100",
    },
  },
  fonts: {
    heading:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "brand.900" : "#f8f9fa",
        color: props.colorMode === "dark" ? "#e6f1ff" : "#1a202c",
        overflowX: "hidden",
        fontSize: { base: "14px", md: "16px" },
        lineHeight: "1.6",
      },
      html: {
        scrollBehavior: "smooth",
      },
      "*::selection": {
        bg: props.colorMode === "dark" ? "brand.600" : "brand.200",
        color: props.colorMode === "dark" ? "white" : "gray.900",
      },
    }),
  },
  components: {
    Box: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "brand.800" : "white",
        color: props.colorMode === "dark" ? "#e6f1ff" : "gray.800",
      }),
    },
    Input: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "#0b2742" : "gray.50",
        borderColor: props.colorMode === "dark" ? "brand.700" : "gray.200",
        color: props.colorMode === "dark" ? "white" : "gray.800",
        _hover: {
          borderColor: "brand.500",
          bg: props.colorMode === "dark" ? "#10385f" : "white",
        },
        _focus: {
          borderColor: "brand.500",
          boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
        },
      }),
    },
    Textarea: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "#0b2742" : "gray.50",
        borderColor: props.colorMode === "dark" ? "brand.700" : "gray.200",
        color: props.colorMode === "dark" ? "white" : "gray.800",
        _hover: {
          borderColor: "brand.500",
          bg: props.colorMode === "dark" ? "#10385f" : "white",
        },
        _focus: {
          borderColor: "brand.500",
          boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`,
        },
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "lg",
        _focus: {
          boxShadow: "none",
        },
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "brand.600" : "brand.500",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.500" : "brand.600",
          },
        }),
      },
    },
  },
  textStyles: {
    h1: {
      fontSize: { base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" },
      fontWeight: "bold",
      lineHeight: "1.2",
    },
    h2: {
      fontSize: { base: "xl", sm: "2xl", md: "3xl", lg: "4xl" },
      fontWeight: "bold",
      lineHeight: "1.3",
    },
    h3: {
      fontSize: { base: "lg", sm: "xl", md: "2xl" },
      fontWeight: "semibold",
      lineHeight: "1.4",
    },
    body: {
      fontSize: { base: "sm", md: "md", lg: "lg" },
      lineHeight: "1.7",
    },
  },
});

export default theme;
