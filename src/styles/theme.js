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
    studio: {
      white: "#fafaf8",
      surface: "#f3f3f0",
      border: "#e2e2dd",
      ink: "#1a1a1a",
      charcoal: "#2c2c2c",
      darkBg: "#1e1e1e",
      darkSurface: "#2a2a2a",
      darkBorder: "#3a3a3a",
      darkText: "#eaeaea",
      muted: "#6f6f6a",
    },

    // ── Admin panel palette — biru diganti studio neutral ──
    retro: {
      ink: "#1a1a1a",
      inkSoft: "#4a4a47",
      chrome: "#e2e2dd",
      chromeDark: "#9a9a95",
      paper: "#fafaf8",
      panel: "#ffffff",
      line: "#c8c8c3",
      lineSoft: "#d8d8d3",
      // Aksen: dulu biru, sekarang charcoal
      blue: "#2c2c2c",
      blueDark: "#1a1a1a",
      bluePale: "#f3f3f0",
      amber: "#8a6000",
      green: "#276b46",
      red: "#9f2436",
      black: "#0f0f0f",
    },
    retroDark: {
      ink: "#eaeaea",
      inkSoft: "#b9b9b4",
      chrome: "#2a2a2a",
      chromeDark: "#1a1a1a",
      paper: "#1e1e1e",
      panel: "#242424",
      line: "#3a3a3a",
      lineSoft: "#313131",
      // Aksen: dulu biru terang, sekarang putih/abu terang
      blue: "#eaeaea",
      blueDark: "#c8c8c3",
      bluePale: "#2c2c2c",
      amber: "#b56a00",
      green: "#276b46",
      red: "#9f2436",
      black: "#0f0f0f",
    },

    // ── facebook.* masih dipakai komponen admin — netralkan ──
    facebook: {
      blue: "#2c2c2c",
      darkBlue: "#1a1a1a",
      lightBlue: "#4a4a47",
      paleBlue: "#f3f3f0",
      gray: "#f3f3f0",
      border: "#c8c8c3",
      text: "#1a1a1a",
      lightText: "#6f6f6a",
      white: "#ffffff",
      linkBlue: "#2c2c2c",
      hoverBlue: "#e2e2dd",
    },
    facebookDark: {
      blue: "#eaeaea",
      darkBlue: "#c8c8c3",
      lightBlue: "#d0d0cb",
      bg: "#1e1e1e",
      cardBg: "#242424",
      hoverBg: "#2a2a2a",
      border: "#3a3a3a",
      text: "#eaeaea",
      lightText: "#b9b9b4",
      inputBg: "#1a1a1a",
      inputBorder: "#3a3a3a",
    },
  },

  semanticTokens: {
    colors: {
      "public.bg": { default: "#fafaf8", _dark: "#1e1e1e" },
      "public.surface": { default: "#f3f3f0", _dark: "#2a2a2a" },
      "public.surfaceAlt": { default: "#ffffff", _dark: "#242424" },
      "public.text": { default: "#1a1a1a", _dark: "#eaeaea" },
      "public.muted": { default: "#6f6f6a", _dark: "#b9b9b4" },
      "public.border": { default: "#e2e2dd", _dark: "#3a3a3a" },
      "public.primary": { default: "#2c2c2c", _dark: "#f5f5f2" },
      "public.primaryDark": { default: "#1a1a1a", _dark: "#ffffff" },
      "public.accent": { default: "#2c2c2c", _dark: "#eaeaea" },
      "public.glow": {
        default: "rgba(0, 0, 0, .04)",
        _dark: "rgba(0, 0, 0, .18)",
      },
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
        bg: mode("#fafaf8", "#1e1e1e")(props),
        color: mode("#1a1a1a", "#eaeaea")(props),
        fontSize: "16px",
        lineHeight: "1.65",
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        letterSpacing: "0",
        overflowX: "hidden",
        backgroundImage: "none",
        transition: "background-color .18s ease, color .18s ease",
      },

      // Scrollbar — disesuaikan ke palette studio
      "::-webkit-scrollbar": {
        width: "12px",
        height: "12px",
      },
      "::-webkit-scrollbar-track": {
        bg: mode("#e2e2dd", "#242424")(props),
        borderLeft: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
      },
      "::-webkit-scrollbar-thumb": {
        bg: mode("#9a9a95", "#3a3a3a")(props),
        border: mode("3px solid #e2e2dd", "3px solid #242424")(props),
        _hover: {
          bg: mode("#6f6f6a", "#5a5a55")(props),
        },
      },
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: mode("#9a9a95 #e2e2dd", "#3a3a3a #242424")(props),
      },

      "*::selection": {
        bg: mode("#1a1a1a", "#eaeaea")(props),
        color: mode("#fafaf8", "#1e1e1e")(props),
      },

      a: {
        // Link warna teks biasa, bukan biru
        color: mode("#1a1a1a", "#eaeaea")(props),
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
        // Public portfolio — tidak berubah
        studio: (props) => ({
          bg: mode("#1a1a1a", "#eaeaea")(props),
          color: mode("#fafaf8", "#1e1e1e")(props),
          borderRadius: "999px",
          border: mode("1px solid #1a1a1a", "1px solid #eaeaea")(props),
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          textShadow: "none",
          fontWeight: "600",
          _hover: {
            bg: mode("#2c2c2c", "#ffffff")(props),
            color: mode("#fafaf8", "#1e1e1e")(props),
            textDecoration: "none",
          },
          _active: {
            transform: "translateY(1px)",
          },
        }),
        studioGhost: (props) => ({
          bg: "transparent",
          color: mode("#1a1a1a", "#eaeaea")(props),
          borderRadius: "999px",
          border: mode("1px solid #e2e2dd", "1px solid #3a3a3a")(props),
          fontWeight: "600",
          boxShadow: "none",
          textShadow: "none",
          _hover: {
            bg: mode("#f3f3f0", "#2a2a2a")(props),
            borderColor: mode("#1a1a1a", "#eaeaea")(props),
            textDecoration: "none",
          },
        }),

        // Admin panel — dulu biru, sekarang studio solid
        facebook: (props) => ({
          bg: mode("#1a1a1a", "#eaeaea")(props),
          color: mode("#fafaf8", "#1e1e1e")(props),
          border: mode("1px solid #0f0f0f", "1px solid #c8c8c3")(props),
          textShadow: "none",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
          _hover: {
            bg: mode("#2c2c2c", "#ffffff")(props),
          },
          _active: {
            bg: mode("#0f0f0f", "#c8c8c3")(props),
          },
        }),

        // Admin panel secondary/gray — studio ghost
        facebookGray: (props) => ({
          bg: mode("#f3f3f0", "#2a2a2a")(props),
          color: mode("#1a1a1a", "#eaeaea")(props),
          border: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
          boxShadow: "none",
          textShadow: "none",
          _hover: {
            bg: mode("#e2e2dd", "#333330")(props),
          },
        }),

        // outline — dipakai beberapa halaman admin
        outline: (props) => ({
          border: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
          bg: mode("#ffffff", "#242424")(props),
          color: mode("#1a1a1a", "#eaeaea")(props),
          boxShadow: "none",
          textShadow: "none",
          _hover: {
            bg: mode("#f3f3f0", "#2a2a2a")(props),
            borderColor: mode("#1a1a1a", "#eaeaea")(props),
          },
        }),
      },
    },

    Input: {
      variants: {
        outline: (props) => ({
          field: {
            bg: mode("#ffffff", "#1a1a1a")(props),
            borderColor: mode("#c8c8c3", "#3a3a3a")(props),
            color: mode("#1a1a1a", "#eaeaea")(props),
            borderRadius: "0",
            fontSize: "16px",
            boxShadow: mode(
              "inset 1px 1px 0 #e2e2dd",
              "inset 1px 1px 0 #0f0f0f"
            )(props),
            _placeholder: {
              color: mode("#9a9a95", "#6f6f6a")(props),
            },
            _hover: {
              borderColor: mode("#1a1a1a", "#eaeaea")(props),
            },
            _focus: {
              borderColor: mode("#1a1a1a", "#eaeaea")(props),
              boxShadow: sharpFocus(mode("#1a1a1a", "#eaeaea")(props)),
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
          bg: mode("#ffffff", "#1a1a1a")(props),
          borderColor: mode("#c8c8c3", "#3a3a3a")(props),
          color: mode("#1a1a1a", "#eaeaea")(props),
          borderRadius: "0",
          fontSize: "16px",
          boxShadow: mode(
            "inset 1px 1px 0 #e2e2dd",
            "inset 1px 1px 0 #0f0f0f"
          )(props),
          _placeholder: {
            color: mode("#9a9a95", "#6f6f6a")(props),
          },
          _hover: {
            borderColor: mode("#1a1a1a", "#eaeaea")(props),
          },
          _focus: {
            borderColor: mode("#1a1a1a", "#eaeaea")(props),
            boxShadow: sharpFocus(mode("#1a1a1a", "#eaeaea")(props)),
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
            bg: mode("#ffffff", "#1a1a1a")(props),
            borderColor: mode("#c8c8c3", "#3a3a3a")(props),
            color: mode("#1a1a1a", "#eaeaea")(props),
            borderRadius: "0",
            fontSize: "16px",
            _hover: {
              borderColor: mode("#1a1a1a", "#eaeaea")(props),
            },
            _focus: {
              borderColor: mode("#1a1a1a", "#eaeaea")(props),
              boxShadow: sharpFocus(mode("#1a1a1a", "#eaeaea")(props)),
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
        color: mode("#1a1a1a", "#eaeaea")(props),
        fontFamily:
          "'Plus Jakarta Sans', 'Tahoma', 'Verdana', 'Geneva', sans-serif",
        mb: 1,
      }),
    },

    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("#ffffff", "#242424")(props),
          borderRadius: "0",
          border: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
        },
        header: {
          fontSize: "17px",
          fontWeight: "bold",
          color: mode("#1a1a1a", "#eaeaea")(props),
          // Header modal: dulu biru-abu, sekarang surface abu
          borderBottom: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
          bg: mode("#f3f3f0", "#2a2a2a")(props),
        },
        footer: {
          borderTop: mode("1px solid #c8c8c3", "1px solid #3a3a3a")(props),
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
