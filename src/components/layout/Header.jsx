import React from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  IconButton,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Download, Home, Moon, Sun, TerminalSquare } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";

const Header = ({ isDownloading, handleDownload }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const headerBg = useColorModeValue("#123f6c", "#111821");
  const headerHi = useColorModeValue("#2a6faf", "#27313d");
  const borderColor = useColorModeValue("#082947", "#465568");
  const statusBg = useColorModeValue("#dce8f5", "#26394d");
  const statusText = useColorModeValue("#123f6c", "#d8e9fb");

  return (
    <Box
      bg={`linear-gradient(180deg, ${headerHi}, ${headerBg})`}
      borderBottom="1px solid"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow="0 1px 0 rgba(255,255,255,.22)"
    >
      <Flex
        maxW="1280px"
        mx="auto"
        px={{ base: 2, md: 4 }}
        py={2}
        justify="space-between"
        align="center"
        gap={3}
      >
        <HStack spacing={2} minW={0}>
          <Box
            display="grid"
            placeItems="center"
            w="26px"
            h="24px"
            border="1px solid rgba(255,255,255,.55)"
            bg="rgba(255,255,255,.12)"
          >
            <TerminalSquare size={15} color="#ffffff" />
          </Box>
          <Box minW={0}>
            <Text
              color="white"
              fontSize={{ base: "17px", md: "19px" }}
              fontWeight="bold"
              lineHeight="1.1"
              noOfLines={1}
            >
              aurio.work
            </Text>
            <Text
              color="rgba(255,255,255,.78)"
              fontSize="13px"
              lineHeight="1.1"
              noOfLines={1}
              display={{ base: "none", sm: "block" }}
            >
              {personalInfo.name || "Aurio Rajaa"} / {personalInfo.title || "Software Engineer"}
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2} flexShrink={0}>
          <HStack
            spacing={1}
            bg={statusBg}
            color={statusText}
            border="1px solid"
            borderColor="rgba(255,255,255,.35)"
            px={2}
            h="28px"
            display={{ base: "none", md: "flex" }}
          >
            <Home size={12} />
            <Text fontSize="14px" fontWeight="bold">
              Public Portfolio
            </Text>
          </HStack>
          <IconButton
            icon={colorMode === "light" ? <Moon size={15} /> : <Sun size={15} />}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            variant="facebookGray"
            size="sm"
            h="28px"
            minW="30px"
            title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
          />
          <Button
            variant="facebookGray"
            size="sm"
            h="28px"
            fontSize="15px"
            leftIcon={<Download size={13} />}
            onClick={handleDownload}
            isLoading={isDownloading}
            loadingText="..."
          >
            CV
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
