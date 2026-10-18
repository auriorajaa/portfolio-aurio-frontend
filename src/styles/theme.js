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

    // Legacy variant names retained for admin buttons that still request them.
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
    heading: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
        bg: "#ffffff",
        color: "#3b444d",
        fontSize: "18px",
        lineHeight: "1.65",
        fontFamily:
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
        bg: "#1f5fa9",
        color: "#ffffff",
      },

      // Zero-specificity anchor default so it never fights button/link
      // variants (a:hover previously made button text invisible).
      ":where(a):where(:not(.chakra-button))": {
        color: "#1f5fa9",
        textDecoration: "none",
        transition: "color .12s ease",
        _hover: {
          color: "#17497f",
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
        fontWeight: "600",
        fontSize: "15px",
        fontFamily:
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        borderRadius: "999px",
        transition:
          "background-color .16s ease, border-color .16s ease, color .16s ease, transform .16s ease",
        boxShadow: "none",
        _active: {
          transform: "translateY(1px)",
          boxShadow: "none",
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

        // Public classic (2015) — glossy "rock" primary button
        classic: {
          bg: "linear-gradient(180deg, #4c8ede 0%, #2f74c0 48%, #2264ad 52%, #17497f 100%)",
          color: "#ffffff",
          border: "1px solid #143e6b",
          borderRadius: "4px",
          fontWeight: "700",
          fontSize: "15px",
          textShadow: "0 1px 1px rgba(9,30,55,0.5)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 2px rgba(9,30,55,0.3)",
          _hover: {
            bg: "linear-gradient(180deg, #5c9ce8 0%, #3a80cc 48%, #2a6cb8 52%, #1c548c 100%)",
            borderColor: "#143e6b",
            color: "#ffffff",
            textDecoration: "none",
          },
          _active: {
            bg: "linear-gradient(180deg, #17497f 0%, #2264ad 100%)",
            boxShadow: "inset 0 2px 3px rgba(9,30,55,0.4)",
          },
        },

        // Public classic (2015) — glossy white secondary button
        classicOutline: {
          bg: "linear-gradient(180deg, #ffffff 0%, #f4f8fc 48%, #e9f1f9 52%, #dce8f4 100%)",
          color: "#123a63",
          border: "1px solid #b9c9da",
          borderRadius: "4px",
          fontWeight: "700",
          fontSize: "15px",
          textShadow: "0 1px 0 #ffffff",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(9,30,55,0.12)",
          _hover: {
            bg: "linear-gradient(180deg, #ffffff 0%, #eef5fb 48%, #e0ecf8 52%, #d0e1f1 100%)",
            borderColor: "#9fb6cd",
            color: "#0f3356",
            textDecoration: "none",
          },
          _active: {
            bg: "linear-gradient(180deg, #dce8f4 0%, #e9f1f9 100%)",
            boxShadow: "inset 0 2px 3px rgba(9,30,55,0.18)",
          },
        },

        // Public classic — glossy white button for navy/blue bands
        classicWhite: {
          bg: "linear-gradient(180deg, #ffffff 0%, #f6fafe 48%, #ecf3fa 52%, #e2edf7 100%)",
          color: "#123a63",
          border: "1px solid #ffffff",
          borderRadius: "4px",
          fontWeight: "700",
          fontSize: "15px",
          textShadow: "0 1px 0 #ffffff",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(9,24,42,0.35)",
          _hover: {
            bg: "linear-gradient(180deg, #ffffff 0%, #eef5fc 48%, #e2eef8 52%, #d5e6f4 100%)",
            borderColor: "#e3edf7",
            color: "#0d2b4a",
            textDecoration: "none",
          },
          _active: {
            bg: "linear-gradient(180deg, #dbe7f5 0%, #eaf2fa 100%)",
          },
        },

        // Public classic — glassy outline button for navy/blue bands
        classicOnDark: {
          bg: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.06) 52%, rgba(255,255,255,0.1) 100%)",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.55)",
          borderRadius: "4px",
          fontWeight: "700",
          fontSize: "15px",
          textShadow: "0 1px 1px rgba(9,24,42,0.5)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          _hover: {
            bg: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.16) 48%, rgba(255,255,255,0.12) 52%, rgba(255,255,255,0.16) 100%)",
            borderColor: "#ffffff",
            color: "#ffffff",
            textDecoration: "none",
          },
          _active: {
            bg: "rgba(255,255,255,0.2)",
            boxShadow: "inset 0 2px 3px rgba(9,24,42,0.25)",
          },
        },

        // Admin panel — dulu biru, sekarang studio solid
        facebook: (props) => ({
          bg: mode("#1a1a1a", "#eaeaea")(props),
          color: mode("#fafaf8", "#1e1e1e")(props),
          border: mode("1px solid #0f0f0f", "1px solid #c8c8c3")(props),
          borderRadius: "999px",
          textShadow: "none",
          boxShadow: "none",
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
          borderRadius: "999px",
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
          borderRadius: "999px",
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
            borderRadius: "14px",
            fontSize: "15px",
            minH: "42px",
            boxShadow: "none",
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
          borderRadius: "14px",
          fontSize: "15px",
          boxShadow: "none",
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
            borderRadius: "14px",
            fontSize: "15px",
            minH: "42px",
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
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        mb: 1,
      }),
    },

    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: mode("#ffffff", "#242424")(props),
          borderRadius: "24px",
          border: mode("1px solid #e2e2dd", "1px solid #3a3a3a")(props),
          boxShadow: mode(
            "0 24px 70px rgba(0,0,0,.12)",
            "0 24px 70px rgba(0,0,0,.4)",
          )(props),
          overflow: "hidden",
        },
        header: {
          fontSize: "17px",
          fontWeight: "700",
          color: mode("#1a1a1a", "#eaeaea")(props),
          borderBottom: mode("1px solid #e8e8e2", "1px solid #343434")(props),
          bg: mode("#ffffff", "#242424")(props),
        },
        footer: {
          borderTop: mode("1px solid #e8e8e2", "1px solid #343434")(props),
        },
      }),
    },

    Heading: {
      baseStyle: {
        fontFamily:
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        letterSpacing: "0",
      },
    },

    Text: {
      baseStyle: {
        fontFamily:
          "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        letterSpacing: "0",
      },
    },

    Tag: {
      baseStyle: {
        container: {
          borderRadius: "999px",
          border: "1px solid",
          fontWeight: "600",
        },
      },
    },
  },
});

export default theme;
