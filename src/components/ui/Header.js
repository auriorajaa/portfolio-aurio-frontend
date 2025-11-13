import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  IconButton,
  Link,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useColorMode,
  useColorModeValue,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiDownload,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";

const Header = ({ isDownloading, handleDownload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("white", "#0a192f");
  const borderColor = useColorModeValue("gray.200", "#112240");
  const textColor = useColorModeValue("gray.800", "#e6f1ff");
  const hoverColor = useColorModeValue("brand.600", "brand.400");

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      width="100%"
      zIndex="1000"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      boxShadow="sm"
      transition="all 0.3s ease-in-out"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
        <Flex py={{ base: 3, md: 4 }} align="center" justify="space-between">
          <Heading
            as="h1"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="brand.500"
            letterSpacing="-0.03em"
          >
            AR.
          </Heading>

          {/* Desktop & Tablet Navigation */}
          <HStack
            spacing={{ base: 3, md: 4, lg: 6 }}
            display={{ base: "none", lg: "flex" }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                fontWeight="500"
                fontSize={{ base: "sm", lg: "md" }}
                color={textColor}
                _hover={{ color: hoverColor, textDecoration: "none" }}
                transition="color 0.2s"
              >
                {item.label}
              </Link>
            ))}

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                size={{ base: "sm", lg: "md" }}
                fontSize={{ base: "sm", lg: "md" }}
                fontWeight="500"
              >
                More
              </MenuButton>
              <MenuList>
                <MenuItem as="a" href="#activities" fontSize="sm">
                  Activities
                </MenuItem>
                <MenuItem as="a" href="#achievements" fontSize="sm">
                  Achievements
                </MenuItem>
                {/* <MenuItem as="a" href="#articles" fontSize="sm">
                  Articles
                </MenuItem> */}
              </MenuList>
            </Menu>

            <Button
              onClick={handleDownload}
              leftIcon={isDownloading ? <Spinner size="sm" /> : <FiDownload />}
              colorScheme="brand"
              variant="outline"
              size={{ base: "sm", lg: "md" }}
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 3, lg: 5 }}
            >
              {isDownloading ? "Downloading..." : "Resume"}
            </Button>

            <IconButton
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              aria-label="Toggle theme"
              onClick={toggleColorMode}
              variant="ghost"
              size={{ base: "sm", lg: "md" }}
            />
          </HStack>

          {/* Mobile & Small Tablet - Right Side Actions */}
          <HStack spacing={2} display={{ base: "flex", lg: "none" }}>
            <IconButton
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              aria-label="Toggle theme"
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
            />
            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              onClick={onOpen}
              variant="ghost"
              size="md"
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile & Tablet Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton size="lg" mt={1} />
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor={borderColor}
            fontSize="lg"
            fontWeight="bold"
          >
            Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" py={4}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  fontWeight="500"
                  fontSize="md"
                  py={2}
                  onClick={onClose}
                  _hover={{ textDecoration: "none", color: hoverColor }}
                  transition="color 0.2s"
                >
                  {item.label}
                </Link>
              ))}

              <Box borderTopWidth="1px" borderColor={borderColor} pt={4}>
                <Heading
                  as="h3"
                  fontSize="sm"
                  fontWeight="600"
                  color={textColor}
                  mb={2}
                  opacity={0.7}
                >
                  More Sections
                </Heading>
                <Link
                  href="#activities"
                  fontWeight="500"
                  fontSize="md"
                  py={2}
                  display="block"
                  onClick={onClose}
                  _hover={{ textDecoration: "none", color: hoverColor }}
                  transition="color 0.2s"
                >
                  Activities
                </Link>
                <Link
                  href="#achievements"
                  fontWeight="500"
                  fontSize="md"
                  py={2}
                  display="block"
                  onClick={onClose}
                  _hover={{ textDecoration: "none", color: hoverColor }}
                  transition="color 0.2s"
                >
                  Achievements
                </Link>
                {/* <Link
                  href="#articles"
                  fontWeight="500"
                  fontSize="md"
                  py={2}
                  display="block"
                  onClick={onClose}
                  _hover={{ textDecoration: "none", color: hoverColor }}
                  transition="color 0.2s"
                >
                  Articles
                </Link> */}
              </Box>

              <Box borderTopWidth="1px" borderColor={borderColor} pt={4}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                    onClose();
                  }}
                  leftIcon={
                    isDownloading ? <Spinner size="sm" /> : <FiDownload />
                  }
                  colorScheme="brand"
                  variant="outline"
                  size="md"
                  w="full"
                  fontSize="md"
                  fontWeight="500"
                >
                  {isDownloading ? "Downloading..." : "Download Resume"}
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
