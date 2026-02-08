import React from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";

const Header = ({ isDownloading, handleDownload }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const headerBg = useColorModeValue("#3b5998", "#242526");
  const headerBorder = useColorModeValue("#2d4373", "#3e4042");

  return (
    <Box
      bg={headerBg}
      borderBottom="1px solid"
      borderColor={headerBorder}
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex
        maxW="1000px"
        mx="auto"
        px={4}
        py={2}
        justify="space-between"
        align="center"
      >
        {/* Logo */}
        <Flex align="center" gap={3}>
          <Text
            fontSize="24px"
            fontWeight="bold"
            color="white"
            fontFamily="'Klavika', 'Helvetica', sans-serif"
            letterSpacing="-0.5px"
          >
            portfolio
          </Text>
        </Flex>

        {/* Actions */}
        <Flex align="center" gap={2}>
          <IconButton
            icon={
              colorMode === "light" ? <Moon size={16} /> : <Sun size={16} />
            }
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            variant="facebookGray"
            size="sm"
            title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
          />
          <Button
            variant="facebookGray"
            size="sm"
            fontSize="13px"
            onClick={handleDownload}
            isLoading={isDownloading}
            loadingText="..."
          >
            Download CV
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
