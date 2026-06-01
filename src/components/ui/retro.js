import React from "react";
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useStudioColors } from "../public/studio";

export const useRetroColors = () => ({
  ...useStudioColors(),
  pageBg: useColorModeValue("#fafaf8", "#1e1e1e"),
  panelBg: useColorModeValue("#ffffff", "#242424"),
  panelAlt: useColorModeValue("#f3f3f0", "#2a2a2a"),
  headerBg: useColorModeValue("#ffffff", "#242424"),
  headerDark: useColorModeValue("#f3f3f0", "#2a2a2a"),
  border: useColorModeValue("#e2e2dd", "#3a3a3a"),
  borderSoft: useColorModeValue("#edede8", "#343434"),
  text: useColorModeValue("#1a1a1a", "#eaeaea"),
  muted: useColorModeValue("#6f6f6a", "#b9b9b4"),
  link: useColorModeValue("#1a1a1a", "#eaeaea"),
  linkDark: useColorModeValue("#0f0f0f", "#ffffff"),
  paleBlue: useColorModeValue("#f3f3f0", "#2a2a2a"),
  amber: useColorModeValue("#8a6000", "#d6a64b"),
  green: useColorModeValue("#276b46", "#75b98f"),
  red: useColorModeValue("#9f2436", "#de7886"),
  overlay: useColorModeValue("rgba(26,26,26,.42)", "rgba(0,0,0,.74)"),
  shadow: useColorModeValue(
    "0 18px 48px rgba(0,0,0,0.045)",
    "0 18px 48px rgba(0,0,0,0.24)",
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
      borderRadius="22px"
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
          py={3}
          borderBottom="1px solid"
          borderColor={colors.borderSoft}
          bg={colors.panelBg}
          minH="46px"
        >
          <HStack spacing={2} minW={0}>
            {Icon && <Icon size={15} color={colors.muted} />}
            <Text
              fontSize="15px"
              fontWeight="700"
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
    blue: { bg: colors.panelAlt, color: colors.text, border: colors.border },
    amber: { bg: useColorModeValue("#fff6df", "#332815"), color: colors.amber, border: useColorModeValue("#ead6a2", "#5a4824") },
    green: { bg: useColorModeValue("#e8f4ec", "#14291e"), color: colors.green, border: useColorModeValue("#bed9c8", "#2b563c") },
    red: { bg: useColorModeValue("#f9e6e9", "#32171c"), color: colors.red, border: useColorModeValue("#e6bcc3", "#63303a") },
    gray: { bg: colors.panelAlt, color: colors.muted, border: colors.border },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      minH="22px"
      px={2.5}
      border="1px solid"
      bg={selected.bg}
      color={selected.color}
      borderColor={selected.border}
      borderRadius="999px"
      fontSize="11px"
      fontWeight="700"
      letterSpacing=".04em"
      lineHeight="1"
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
      bg={colors.borderSoft}
    />
  );
};
