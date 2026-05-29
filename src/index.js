import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import "react-lazy-load-image-component/src/effects/opacity.css";
import App from "./App";
import theme from "./styles/theme";
import "./utils/gsap";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider theme={theme} resetCSS>
        <App />
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>
);
