import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const sharpFocus = (color) => `0 0 0 1px ${color}`;

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },

  radii: {
    none: "0",
    sm: "0",
    base: "0",
    md: "0",
    lg: "0",
    xl: "0",
    "2xl": "0",
    full: "0",
  },

  colors: {
    retro: {
      ink: "#1f2833",
      inkSoft: "#4d5866",
      chrome: "#d7dde6",
      chromeDark: "#8894a3",
      paper: "#f4f6f9",
      panel: "#ffffff",
      line: "#9aa8ba",
      lineSoft: "#c3ccd8",
      blue: "#1d5f9f",
      blueDark: "#123f6c",
      bluePale: "#dce8f5",
      amber: "#b56a00",
      green: "#276b46",
      red: "#9f2436",
      black: "#10151b",
    },
    retroDark: {
      ink: "#e6edf5",
      inkSoft: "#aab6c4",
      chrome: "#27313d",
      chromeDark: "#111821",
      paper: "#141a22",
      panel: "#1b232d",
      line: "#465568",
      lineSoft: "#344252",
      blue: "#8bb8e8",
      blueDark: "#5e93ca",
      bluePale: "#26394d",
      amber: "#b56a00",
      green: "#276b46",
      red: "#9f2436",
      black: "#090d12",
    },
    facebook: {
      blue: "#1d5f9f",
      darkBlue: "#123f6c",
      lightBlue: "#4f86bd",
      paleBlue: "#dce8f5",
      gray: "#eef2f6",
      border: "#9aa8ba",
      text: "#1f2833",
      lightText: "#4d5866",
      white: "#ffffff",
      linkBlue: "#1d5f9f",
      hoverBlue: "#c9d8e8",
    },
    facebookDark: {
      blue: "#8bb8e8",
      darkBlue: "#5e93ca",
      lightBlue: "#a8c9ed",
      bg: "#141a22",
      cardBg: "#1b232d",
      hoverBg: "#27313d",
      border: "#465568",
      text: "#e6edf5",
      lightText: "#aab6c4",
      inputBg: "#111821",
      inputBorder: "#465568",
    },
  },

  fonts: {
    heading: "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
    body: "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
    mono: "'Lucida Console', 'Courier New', monospace",
  },

  styles: {
    global: (props) => ({
      "html, body, #root": {
        minHeight: "100%",
      },
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        bg: mode("#cfd7e2", "#0f151d")(props),
        color: mode("#1f2833", "#e6edf5")(props),
        fontSize: "16px",
        lineHeight: "1.42",
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        letterSpacing: "0",
        overflowX: "hidden",
        backgroundImage: mode(
          "linear-gradient(rgba(255,255,255,.42) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.34) 1px, transparent 1px)",
          "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)"
        )(props),
        backgroundSize: "16px 16px",
      },

      // Custom Retro Scrollbar
      "::-webkit-scrollbar": {
        width: "12px",
        height: "12px",
      },
      "::-webkit-scrollbar-track": {
        bg: mode("#d7dde6", "#1b232d")(props),
        borderLeft: mode("1px solid #9aa8ba", "1px solid #465568")(props),
      },
      "::-webkit-scrollbar-thumb": {
        bg: mode("#8894a3", "#465568")(props),
        border: mode("3px solid #d7dde6", "3px solid #1b232d")(props),
        _hover: {
          bg: mode("#6c7988", "#5e93ca")(props),
        },
      },

      // Firefox scrollbar support
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: mode("#8894a3 #d7dde6", "#465568 #1b232d")(props),
      },

      "*::selection": {
        bg: mode("#174f88", "#8bb8e8")(props),
        color: mode("#ffffff", "#10151b")(props),
      },

      a: {
        color: mode("#1d5f9f", "#8bb8e8")(props),
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
        },
      },
      "button, input, textarea, select": {
        letterSpacing: "0",
      },
      "p, span, a": {
        overflowWrap: "break-word",
      },
    }),
  },

  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        borderRadius: "0",
        transition: "background-color .12s ease, border-color .12s ease",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.62)",
        _active: {
          boxShadow: "inset 0 1px 3px rgba(0,0,0,.28)",
        },
      },
      variants: {
        facebook: (props) => ({
          bg: mode("#1d5f9f", "#5e93ca")(props),
          color: "white",
          border: mode("1px solid #123f6c", "1px solid #8bb8e8")(props),
          textShadow: "0 1px 0 rgba(0,0,0,.24)",
          _hover: {
            bg: mode("#2a6faf", "#79aadb")(props),
          },
          _active: {
            bg: mode("#123f6c", "#457bae")(props),
          },
        }),
        facebookGray: (props) => ({
          bg: mode("#e8edf4", "#27313d")(props),
          color: mode("#1f2833", "#e6edf5")(props),
          border: mode("1px solid #9aa8ba", "1px solid #465568")(props),
          _hover: {
            bg: mode("#dce5ef", "#334253")(props),
          },
        }),
        outline: (props) => ({
          border: mode("1px solid #9aa8ba", "1px solid #465568")(props),
          bg: mode("#ffffff", "#1b232d")(props),
          color: mode("#1d5f9f", "#8bb8e8")(props),
          _hover: {
            bg: mode("#dce8f5", "#26394d")(props),
          },
        }),
      },
    },

    Input: {
      variants: {
        outline: (props) => ({
          field: {
            bg: mode("#ffffff", "#111821")(props),
            borderColor: mode("#9aa8ba", "#465568")(props),
            color: mode("#1f2833", "#e6edf5")(props),
            borderRadius: "0",
            fontSize: "16px",
            boxShadow: mode(
              "inset 1px 1px 0 #e3e7ed",
              "inset 1px 1px 0 #090d12"
            )(props),
            _placeholder: {
              color: mode("#6b7684", "#8996a6")(props),
            },
            _hover: {
              borderColor: mode("#1d5f9f", "#8bb8e8")(props),
            },
            _focus: {
              borderColor: mode("#1d5f9f", "#8bb8e8")(props),
              boxShadow: sharpFocus(mode("#1d5f9f", "#8bb8e8")(props)),
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },

    Textarea: {
      variants: {
        outline: (props) => ({
          bg: mode("#ffffff", "#111821")(props),
          borderColor: mode("#9aa8ba", "#465568")(props),
          color: mode("#1f2833", "#e6edf5")(props),
          borderRadius: "0",
          fontSize: "16px",
          boxShadow: mode(
            "inset 1px 1px 0 #e3e7ed",
            "inset 1px 1px 0 #090d12"
          )(props),
          _placeholder: {
            color: mode("#6b7684", "#8996a6")(props),
          },
          _hover: {
            borderColor: mode("#1d5f9f", "#8bb8e8")(props),
          },
          _focus: {
            borderColor: mode("#1d5f9f", "#8bb8e8")(props),
            boxShadow: sharpFocus(mode("#1d5f9f", "#8bb8e8")(props)),
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },

    Select: {
      variants: {
        outline: (props) => ({
          field: {
            bg: mode("#ffffff", "#111821")(props),
            borderColor: mode("#9aa8ba", "#465568")(props),
            color: mode("#1f2833", "#e6edf5")(props),
            borderRadius: "0",
            fontSize: "16px",
            _hover: {
              borderColor: mode("#1d5f9f", "#8bb8e8")(props),
            },
            _focus: {
              borderColor: mode("#1d5f9f", "#8bb8e8")(props),
              boxShadow: sharpFocus(mode("#1d5f9f", "#8bb8e8")(props)),
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
        fontSize: "15px",
        fontWeight: "bold",
        color: mode("#1f2833", "#e6edf5")(props),
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        mb: 1,
      }),
    },

    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("#ffffff", "#1b232d")(props),
          borderRadius: "0",
          border: mode("1px solid #6c7988", "1px solid #465568")(props),
        },
        header: {
          fontSize: "17px",
          fontWeight: "bold",
          color: mode("#1f2833", "#e6edf5")(props),
          borderBottom: mode("1px solid #9aa8ba", "1px solid #465568")(props),
          bg: mode("#d7dde6", "#27313d")(props),
        },
        footer: {
          borderTop: mode("1px solid #9aa8ba", "1px solid #465568")(props),
        },
      }),
    },

    Heading: {
      baseStyle: {
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        fontWeight: "bold",
        letterSpacing: "0",
      },
    },

    Text: {
      baseStyle: {
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        letterSpacing: "0",
      },
    },

    Tag: {
      baseStyle: {
        container: {
          borderRadius: "0",
          border: "1px solid",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
