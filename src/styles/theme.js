import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    // Classic Facebook Blue Theme (2008-2012)
    facebook: {
      blue: "#3b5998",      // Classic Facebook blue
      darkBlue: "#2d4373",  // Darker blue for header
      lightBlue: "#627aad", // Light blue for hover
      paleBlue: "#d8dfea",  // Very pale blue for backgrounds
      gray: "#f7f7f7",      // Light gray background
      border: "#d3d6db",    // Border gray
      text: "#333333",      // Dark text
      lightText: "#90949c", // Light gray text
      white: "#ffffff",
      linkBlue: "#3b5998",
      hoverBlue: "#8b9dc3",
    },
  },
  fonts: {
    heading: "'Tahoma', 'Lucida Grande', sans-serif",
    body: "'Tahoma', 'Lucida Grande', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#e9ebee",
        color: "facebook.text",
        fontSize: "11px",
        lineHeight: "1.28",
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
      },
      html: {
        scrollBehavior: "smooth",
      },
      "::-webkit-scrollbar": {
        width: "12px",
      },
      "::-webkit-scrollbar-track": {
        bg: "#f1f1f1",
      },
      "::-webkit-scrollbar-thumb": {
        bg: "#888",
        borderRadius: "6px",
        _hover: {
          bg: "#555",
        },
      },
      a: {
        color: "facebook.linkBlue",
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        fontSize: "11px",
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
        borderRadius: "2px",
      },
      variants: {
        facebook: {
          bg: "facebook.blue",
          color: "white",
          border: "1px solid #29487d",
          _hover: {
            bg: "facebook.lightBlue",
          },
          _active: {
            bg: "facebook.darkBlue",
          },
        },
        facebookGray: {
          bg: "#f6f7f9",
          color: "facebook.text",
          border: "1px solid #ccd0d5",
          _hover: {
            bg: "#e4e6eb",
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
        fontWeight: "bold",
      },
    },
    Text: {
      baseStyle: {
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
      },
    },
  },
});

export default theme;