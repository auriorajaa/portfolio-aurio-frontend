import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    // Classic Facebook Blue Theme (2008-2012) - Light Mode
    facebook: {
      blue: "#3b5998", // Classic Facebook blue
      darkBlue: "#2d4373", // Darker blue for header
      lightBlue: "#627aad", // Light blue for hover
      paleBlue: "#d8dfea", // Very pale blue for backgrounds
      gray: "#f7f7f7", // Light gray background
      border: "#d3d6db", // Border gray
      text: "#333333", // Dark text
      lightText: "#90949c", // Light gray text
      white: "#ffffff",
      linkBlue: "#3b5998",
      hoverBlue: "#8b9dc3",
    },
    // Dark Mode - Retro Facebook inspired
    facebookDark: {
      blue: "#5b7ec8", // Lighter blue for dark mode
      darkBlue: "#3b5998", // Classic blue for accents
      lightBlue: "#7a99d4", // Lighter blue for hover
      bg: "#18191a", // Dark background
      cardBg: "#242526", // Card background
      hoverBg: "#3a3b3c", // Hover background
      border: "#3e4042", // Border in dark mode
      text: "#e4e6eb", // Light text
      lightText: "#b0b3b8", // Lighter gray text
      inputBg: "#3a3b3c", // Input background
      inputBorder: "#5b5d60", // Input border
    },
  },
  fonts: {
    heading: "'Tahoma', 'Lucida Grande', sans-serif",
    body: "'Tahoma', 'Lucida Grande', sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#e9ebee", "#18191a")(props),
        color: mode("#333333", "#e4e6eb")(props),
        fontSize: "13px",
        lineHeight: "1.34",
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
      },
      html: {
        scrollBehavior: "smooth",
      },
      a: {
        color: mode("#3b5998", "#5b7ec8")(props),
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
        },
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        fontSize: "13px",
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
        borderRadius: "2px",
      },
      variants: {
        facebook: (props) => ({
          bg: mode("#3b5998", "#5b7ec8")(props),
          color: "white",
          border: mode("1px solid #29487d", "1px solid #4a6ba8")(props),
          _hover: {
            bg: mode("#627aad", "#7a99d4")(props),
          },
          _active: {
            bg: mode("#2d4373", "#3b5998")(props),
          },
        }),
        facebookGray: (props) => ({
          bg: mode("#f6f7f9", "#3a3b3c")(props),
          color: mode("#333333", "#e4e6eb")(props),
          border: mode("1px solid #ccd0d5", "1px solid #5b5d60")(props),
          _hover: {
            bg: mode("#e4e6eb", "#4a4b4c")(props),
          },
        }),
      },
    },
    Input: {
      baseStyle: (props) => ({
        field: {
          fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
          fontSize: "13px",
        },
      }),
      variants: {
        outline: (props) => ({
          field: {
            bg: mode("white", "#3a3b3c")(props),
            borderColor: mode("#d3d6db", "#5b5d60")(props),
            color: mode("#333333", "#e4e6eb")(props),
            borderRadius: "2px",
            _placeholder: {
              color: mode("#90949c", "#8a8d91")(props),
            },
            _hover: {
              borderColor: mode("#3b5998", "#5b7ec8")(props),
            },
            _focus: {
              borderColor: mode("#3b5998", "#5b7ec8")(props),
              boxShadow: mode("0 0 0 1px #3b5998", "0 0 0 1px #5b7ec8")(props),
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Textarea: {
      baseStyle: (props) => ({
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
        fontSize: "13px",
      }),
      variants: {
        outline: (props) => ({
          bg: mode("white", "#3a3b3c")(props),
          borderColor: mode("#d3d6db", "#5b5d60")(props),
          color: mode("#333333", "#e4e6eb")(props),
          borderRadius: "2px",
          _placeholder: {
            color: mode("#90949c", "#8a8d91")(props),
          },
          _hover: {
            borderColor: mode("#3b5998", "#5b7ec8")(props),
          },
          _focus: {
            borderColor: mode("#3b5998", "#5b7ec8")(props),
            boxShadow: mode("0 0 0 1px #3b5998", "0 0 0 1px #5b7ec8")(props),
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Select: {
      baseStyle: (props) => ({
        field: {
          fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
          fontSize: "13px",
        },
      }),
      variants: {
        outline: (props) => ({
          field: {
            bg: mode("white", "#3a3b3c")(props),
            borderColor: mode("#d3d6db", "#5b5d60")(props),
            color: mode("#333333", "#e4e6eb")(props),
            borderRadius: "2px",
            _hover: {
              borderColor: mode("#3b5998", "#5b7ec8")(props),
            },
            _focus: {
              borderColor: mode("#3b5998", "#5b7ec8")(props),
              boxShadow: mode("0 0 0 1px #3b5998", "0 0 0 1px #5b7ec8")(props),
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    FormLabel: {
      baseStyle: (props) => ({
        fontSize: "13px",
        fontWeight: "bold",
        color: mode("#333333", "#e4e6eb")(props),
        fontFamily: "'Tahoma', 'Lucida Grande', sans-serif",
        mb: 1,
      }),
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("white", "#242526")(props),
          borderRadius: "2px",
        },
        header: {
          fontSize: "14px",
          fontWeight: "bold",
          color: mode("#333333", "#e4e6eb")(props),
          borderBottom: mode("1px solid #d3d6db", "1px solid #3e4042")(props),
        },
        body: {
          color: mode("#333333", "#e4e6eb")(props),
        },
        footer: {
          borderTop: mode("1px solid #d3d6db", "1px solid #3e4042")(props),
        },
      }),
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