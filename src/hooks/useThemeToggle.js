import { useColorMode, useColorModeValue } from "@chakra-ui/react";

export const useThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const bg = useColorModeValue("light.bg", "dark.bg");
  const text = useColorModeValue("light.text", "dark.text");
  const border = useColorModeValue("light.border", "dark.border");
  const secondary = useColorModeValue("light.secondary", "dark.secondary");
  const card = useColorModeValue("light.card", "dark.card");
  const hoverBg = useColorModeValue("light.hover", "dark.hover");
  const hoverText = useColorModeValue("light.hoverText", "dark.hoverText");

  return {
    colorMode,
    toggleColorMode,
    bg,
    text,
    border,
    secondary,
    card,
    hoverBg,
    hoverText,
    isDark: colorMode === "dark",
  };
};