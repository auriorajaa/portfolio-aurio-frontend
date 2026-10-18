import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import "react-lazy-load-image-component/src/effects/opacity.css";
import App from "./App";
import theme from "./styles/theme";
import "./index.css";
import "./utils/gsap";

// Public site is intentionally light-only (classic 2015 look) — ignore
// whatever color mode a visitor may have stored from before.
const lightColorModeManager = {
  type: "localStorage",
  get: () => "light",
  set: () => {},
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider
        theme={theme}
        colorModeManager={lightColorModeManager}
        resetCSS
      >
        <App />
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>
);
