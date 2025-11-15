import React, { useState, useEffect } from "react";
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
  VStack,
  useColorMode,
  useColorModeValue,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiDownload,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

const Header = ({ isDownloading, handleDownload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [scrolled, setScrolled] = useState(false);

  const bgColor = useColorModeValue("white", "#0a192f");
  const borderColor = useColorModeValue("gray.200", "#112240");
  const textColor = useColorModeValue("gray.800", "#e6f1ff");
  const hoverColor = useColorModeValue("brand.600", "brand.400");
  const activeBg = useColorModeValue("brand.50", "brand.900");

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  const moreItems = [
    { label: "Activities", href: "#activities" },
    { label: "Achievements", href: "#achievements" },
    { label: "Articles", href: "#articles" },
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
      borderColor={scrolled ? borderColor : "transparent"}
      backdropFilter="blur(10px)"
      boxShadow={scrolled ? "md" : "none"}
      transition="all 0.3s ease-in-out"
    >
      <Container
        maxW="container.xl"
        px={{ base: 4, md: 6, lg: 8 }}
        // --- FIX: kasih padding extra untuk jaga jarak dari edge
        // terutama di browser dengan font rendering berbeda
        paddingLeft={{ base: 6, md: 8, lg: 10 }}
        paddingRight={{ base: 6, md: 8, lg: 10 }}
      >
        <Flex
          py={{ base: 3, md: 4 }}
          align="center"
          justify="space-between"
          gap={6}
        >
          {/* Logo */}
          <Heading
            as="h1"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="brand.500"
            letterSpacing="-0.03em"
            cursor="pointer"
            flexShrink={0} // --- FIX: biar logo tidak mengecil
            minWidth="60px" // --- FIX: selalu punya ruang aman
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            _hover={{ transform: "scale(1.05)" }}
            transition="0.2s"
          >
            AR.
          </Heading>

          {/* Desktop Navigation */}
          <HStack
            spacing={{ base: 3, md: 4, lg: 6 }}
            display={{ base: "none", lg: "flex" }}
            // --- FIX: kasih gap-fallback untuk browser lama
            style={{ gap: "28px" }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                fontWeight="500"
                fontSize={{ base: "sm", lg: "md" }}
                color={textColor}
                position="relative"
                _hover={{ color: hoverColor, textDecoration: "none" }}
                transition="color 0.2s"
                _after={{
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  width: "0%",
                  height: "2px",
                  bg: "brand.500",
                  transition: "width 0.3s",
                }}
                sx={{
                  "&:hover::after": { width: "100%" },
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* MORE MENU */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                fontWeight="500"
                _hover={{ bg: activeBg, color: hoverColor }}
              >
                More
              </MenuButton>
              <MenuList>
                {moreItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    as="a"
                    href={item.href}
                    fontSize="sm"
                    _hover={{ bg: activeBg, color: hoverColor }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Download Resume */}
            <Tooltip label="Download my resume" placement="bottom">
              <Button
                onClick={handleDownload}
                leftIcon={
                  isDownloading ? <Spinner size="sm" /> : <FiDownload />
                }
                colorScheme="brand"
                variant="outline"
                px={5}
                isDisabled={isDownloading}
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              >
                {isDownloading ? "Downloading..." : "Resume"}
              </Button>
            </Tooltip>

            {/* Dark / Light Toggle */}
            <Tooltip
              label={`Switch to ${
                colorMode === "dark" ? "light" : "dark"
              } mode`}
              placement="bottom"
            >
              <IconButton
                icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
                aria-label="Toggle theme"
                onClick={toggleColorMode}
                variant="ghost"
                _hover={{ bg: activeBg, transform: "rotate(15deg)" }}
              />
            </Tooltip>
          </HStack>

          {/* Mobile Buttons */}
          <HStack spacing={2} display={{ base: "flex", lg: "none" }}>
            <IconButton
              icon={isDownloading ? <Spinner size="sm" /> : <FiDownload />}
              aria-label="Download Resume"
              onClick={handleDownload}
              variant="ghost"
            />

            <IconButton
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              aria-label="Toggle theme"
              onClick={toggleColorMode}
              variant="ghost"
            />

            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              onClick={onOpen}
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Container>

      {/* Drawer Menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={bgColor}>
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor={borderColor}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="md" color="brand.500">
              Navigation
            </Heading>
            <IconButton icon={<FiX />} onClick={onClose} variant="ghost" />
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={1} align="stretch" py={4}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  fontWeight="500"
                  py={3}
                  px={4}
                  borderRadius="md"
                  onClick={onClose}
                  _hover={{ bg: activeBg, color: hoverColor }}
                >
                  {item.label}
                </Link>
              ))}

              <Box borderTopWidth="1px" borderColor={borderColor} pt={4}>
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    fontWeight="500"
                    py={3}
                    px={4}
                    borderRadius="md"
                    onClick={onClose}
                    _hover={{ bg: activeBg, color: hoverColor }}
                  >
                    {item.label}
                  </Link>
                ))}
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
                  size="lg"
                  w="full"
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
