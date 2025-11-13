import React, { useState, useEffect } from "react";
import { IconButton, useColorModeValue, Fade } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgColor = useColorModeValue("#47B5FF", "#47B5FF");
  const hoverBg = useColorModeValue("#1aa3d1ff", "#47B5FF");
  const iconColor = useColorModeValue("white", "#042735ff");

  return (
    <Fade in={visible}>
      <IconButton
        icon={<ArrowUp size={22} />}
        aria-label="Scroll to top"
        position="fixed"
        bottom={{ base: "24px", md: "32px" }}
        right={{ base: "24px", md: "32px" }}
        borderRadius="full"
        size="lg"
        bg={bgColor}
        color={iconColor}
        boxShadow="lg"
        zIndex={1000}
        _hover={{
          bg: hoverBg,
          transform: "translateY(-4px)",
          boxShadow: "xl",
        }}
        transition="all 0.3s ease"
        onClick={scrollToTop}
      />
    </Fade>
  );
};

export default ScrollToTopButton;
