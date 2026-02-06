import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children, isDownloading, handleDownload }) => {
  return (
    <Box minH="100vh" bg="#e9ebee">
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />
      
      {/* Main Container */}
      <Flex maxW="1000px" mx="auto" gap={0} pt={4}>
        {/* Left Sidebar */}
        <Box
          w="200px"
          flexShrink={0}
          display={{ base: "none", md: "block" }}
        >
          <Sidebar />
        </Box>
        
        {/* Main Content */}
        <Box flex="1" px={4}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;