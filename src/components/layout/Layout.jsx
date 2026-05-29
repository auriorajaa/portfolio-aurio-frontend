import React, { useRef, useState, useEffect } from "react";
import { Box, HStack, Link, Text } from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import Header from "./Header";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Layout = ({ children, isDownloading, handleDownload }) => {
  const colors = useStudioColors();
  const footerRef = useRef(null);
  const topBtnRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const year = new Date().getFullYear();

  // Show/hide scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fade in/out the button
  useEffect(() => {
    if (!topBtnRef.current) return;
    gsap.to(topBtnRef.current, {
      autoAlpha: showTop ? 1 : 0,
      y: showTop ? 0 : 12,
      duration: 0.32,
      ease: "power3.out",
    });
  }, [showTop]);

  const handleScrollTop = () => {
    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0 });
      return;
    }
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 1.1,
      ease: "power4.inOut",
    });
  };

  useGSAP(
    () => {
      if (!footerRef.current || prefersReducedMotion()) return;
      gsap.from("[data-footer-reveal]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: footerRef }
  );

  const socials = [
    personalInfo.github && { href: personalInfo.github, icon: <Github size={18} />, label: "GitHub", external: true },
    personalInfo.linkedin && { href: personalInfo.linkedin, icon: <Linkedin size={18} />, label: "LinkedIn", external: true },
    personalInfo.email && { href: `mailto:${personalInfo.email}`, icon: <Mail size={18} />, label: "Email", external: false },
  ].filter(Boolean);

  return (
    <Box
      minH="100vh"
      bg={colors.bg}
      color={colors.text}
      transition="background-color .28s ease, color .28s ease"
      position="relative"
      overflow="hidden"
    >
      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Box as="main" position="relative" zIndex={1}>
        {children}
      </Box>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Box
        ref={footerRef}
        as="footer"
        position="relative"
        zIndex={1}
        borderTop="1px solid"
        borderColor={colors.borderSoft}
      >
        {/* Big CTA row */}
        <Box
          maxW="1240px"
          mx="auto"
          px={{ base: 5, md: 8 }}
          py={{ base: 10, md: 16 }}
        >
          <Box
            display="flex"
            alignItems={{ base: "flex-start", md: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            gap={6}
          >
            {/* <Box data-footer-reveal>
              <Text
                fontSize={{ base: "28px", md: "42px" }}
                fontWeight="800"
                lineHeight="1.05"
                letterSpacing="-0.03em"
                mb={2}
              >
                Let's build something.
              </Text>
              <Text fontSize={{ base: "14px", md: "16px" }} color={colors.muted}>
                Open to new projects, collaborations, and conversations.
              </Text>
            </Box> */}

            {/* {personalInfo.email && (
              <Link
                data-footer-reveal
                href={`mailto:${personalInfo.email}`}
                display="inline-flex"
                alignItems="center"
                gap={2}
                px={{ base: 5, md: 7 }}
                py={{ base: 3, md: 4 }}
                border="1px solid"
                borderColor={colors.text}
                fontSize={{ base: "13px", md: "14px" }}
                fontWeight="700"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={colors.text}
                bg="transparent"
                _hover={{ bg: colors.text, color: colors.bg }}
                transition="background .18s ease, color .18s ease"
                textDecoration="none"
                flexShrink={0}
              >
                <Mail size={15} />
                Get in touch
              </Link>
            )} */}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          maxW="1240px"
          mx="auto"
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 6 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={4}
        >
          {/* Name + copyright */}
          <Box data-footer-reveal>
            <Text fontSize="14px" fontWeight="700" letterSpacing="-0.01em" mb="2px">
              {personalInfo.name || "Aurio Rajaa"}
            </Text>
            <Text fontSize="12px" color={colors.muted}>
              © {year} — All rights reserved
            </Text>
          </Box>

          {/* Socials */}
          <HStack data-footer-reveal spacing={1}>
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                isExternal={s.external}
                aria-label={s.label}
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="36px"
                h="36px"
                border="1px solid"
                borderColor={colors.borderSoft}
                color={colors.muted}
                _hover={{ borderColor: colors.text, color: colors.text }}
                transition="border-color .15s ease, color .15s ease"
              >
                {s.icon}
              </Link>
            ))}
          </HStack>
        </Box>
      </Box>

      {/* ── Scroll to top ─────────────────────────────────────── */}
      <Box
        ref={topBtnRef}
        as="button"
        onClick={handleScrollTop}
        position="fixed"
        bottom={{ base: 5, md: 7 }}
        right={{ base: 5, md: 7 }}
        zIndex={900}
        w="44px"
        h="44px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px solid"
        borderColor={colors.borderSoft}
        bg={colors.bg}
        color={colors.muted}
        cursor="pointer"
        aria-label="Scroll to top"
        style={{ opacity: 0, visibility: "hidden" }}
        _hover={{ borderColor: colors.text, color: colors.text }}
        transition="border-color .15s ease, color .15s ease"
      >
        <ArrowUp size={17} />
      </Box>
    </Box>
  );
};

export default Layout;