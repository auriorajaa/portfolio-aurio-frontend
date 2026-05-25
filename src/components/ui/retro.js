import React from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const useRetroColors = () => ({
  pageBg: useColorModeValue("#cfd7e2", "#0f151d"),
  panelBg: useColorModeValue("#ffffff", "#1b232d"),
  panelAlt: useColorModeValue("#eef2f6", "#141a22"),
  headerBg: useColorModeValue("#d7dde6", "#27313d"),
  headerDark: useColorModeValue("#b8c3d0", "#111821"),
  border: useColorModeValue("#9aa8ba", "#465568"),
  borderSoft: useColorModeValue("#c3ccd8", "#344252"),
  text: useColorModeValue("#1f2833", "#e6edf5"),
  muted: useColorModeValue("#4d5866", "#aab6c4"),
  link: useColorModeValue("#1d5f9f", "#8bb8e8"),
  linkDark: useColorModeValue("#123f6c", "#5e93ca"),
  paleBlue: useColorModeValue("#dce8f5", "#26394d"),
  amber: useColorModeValue("#b56a00", "#b56a00"),
  green: useColorModeValue("#276b46", "#276b46"),
  red: useColorModeValue("#9f2436", "#9f2436"),
  shadow: useColorModeValue(
    "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #b6c0cc",
    "inset 1px 1px 0 rgba(255,255,255,.06), inset -1px -1px 0 rgba(0,0,0,.32)"
  ),
});

export const RetroPanel = ({
  id,
  title,
  icon: Icon,
  actions,
  children,
  footer,
  headerRight,
  bodyProps,
  ...props
}) => {
  const colors = useRetroColors();

  return (
    <Box
      id={id}
      bg={colors.panelBg}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="0"
      mb={4}
      boxShadow={colors.shadow}
      overflow="hidden"
      {...props}
    >
      {title && (
        <Flex
          align="center"
          justify="space-between"
          gap={3}
          px={3}
          py={2}
          borderBottom="1px solid"
          borderColor={colors.border}
          bg={`linear-gradient(180deg, ${colors.headerBg}, ${colors.headerDark})`}
          minH="34px"
        >
          <HStack spacing={2} minW={0}>
            {Icon && <Icon size={14} color={colors.link} />}
            <Text
              fontSize="16px"
              fontWeight="bold"
              color={colors.text}
              noOfLines={1}
            >
              {title}
            </Text>
          </HStack>
          {(actions || headerRight) && (
            <HStack spacing={2} flexShrink={0}>
              {headerRight}
              {actions}
            </HStack>
          )}
        </Flex>
      )}
      <Box {...bodyProps}>{children}</Box>
      {footer && (
        <Box
          px={3}
          py={2}
          borderTop="1px solid"
          borderColor={colors.border}
          bg={colors.panelAlt}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};

export const RetroBadge = ({ children, tone = "blue", ...props }) => {
  const colors = useRetroColors();
  const tones = {
    blue: { bg: colors.paleBlue, color: colors.link, border: colors.border },
    amber: { bg: "#fff2cc", color: colors.amber, border: "#d6a84a" },
    green: { bg: "#dff0df", color: colors.green, border: "#8fbc8f" },
    red: { bg: "#f7d8dc", color: colors.red, border: "#c97a86" },
    gray: { bg: colors.panelAlt, color: colors.muted, border: colors.border },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      minH="18px"
      px={2}
      border="1px solid"
      bg={selected.bg}
      color={selected.color}
      borderColor={selected.border}
      fontSize="13px"
      fontWeight="bold"
      lineHeight="16px"
      textTransform="uppercase"
      {...props}
    >
      {children}
    </Box>
  );
};

export const RetroDivider = () => {
  const colors = useRetroColors();
  return (
    <Box
      h="1px"
      bg={colors.border}
      borderBottom="1px solid"
      borderColor={colors.borderSoft}
    />
  );
};

