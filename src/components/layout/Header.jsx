import React from "react";
import {
  Box,
  Flex,
  Button,
  Text,
} from "@chakra-ui/react";

const Header = ({ isDownloading, handleDownload }) => {
  return (
    <Box
      bg="facebook.blue"
      borderBottom="1px solid"
      borderColor="facebook.darkBlue"
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

        {/* Search Bar */}
        {/* <InputGroup maxW="400px" size="sm">
          <InputLeftElement pointerEvents="none">
            <Search size={14} color="#999" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            bg="white"
            border="1px solid #2d4373"
            borderRadius="2px"
            fontSize="11px"
            _placeholder={{ color: "#999" }}
            _focus={{
              outline: "none",
              borderColor: "#4e69a2",
            }}
          />
        </InputGroup> */}

        {/* Right Actions */}
        <Flex align="center" gap={2}>
          <Button
            variant="facebookGray"
            size="sm"
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