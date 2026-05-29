import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useGSAP } from "@gsap/react";
import { Download, Moon, Sun, X, ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { useStudioColors } from "../public/studio";
import { ScrollTrigger, gsap, prefersReducedMotion } from "../../utils/gsap";

const NAV_ITEMS = [
  { label: "Intro", href: "#hero" },
  { label: "Work", href: "#projects" },
  { label: "Practice", href: "#skills" },
  { label: "Archive", href: "#gallery" },
  { label: "Writing", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

const Header = ({ isDownloading, handleDownload }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const { colorMode, toggleColorMode } = useColorMode();
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const location = useLocation();
  const colors = useStudioColors();
  const pillRef = useRef(null);
  const overlayRef = useRef(null);
  const progressRef = useRef(null);
  const isHome = location.pathname === "/";

  // ── Track scroll position ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Track active section ───────────────────────────────────────
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // ── Progress bar + entrance ────────────────────────────────────
  useGSAP(
    () => {
      if (!progressRef.current) return;

      if (!prefersReducedMotion()) {
        gsap.from(pillRef.current, {
          y: -52,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.2,
        });
      }

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(progressRef.current, {
            scaleX: self.progress,
            transformOrigin: "left center",
          });
        },
      });
    },
    { scope: pillRef },
  );

  // ── Mobile overlay animation ───────────────────────────────────
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const links = overlay.querySelectorAll("[data-mobile-link]");

      if (prefersReducedMotion()) {
        gsap.set(overlay, {
          autoAlpha: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (mobileOpen) {
        tl.set(overlay, { pointerEvents: "auto" })
          .to(overlay, { autoAlpha: 1, duration: 0.22 })
          .fromTo(
            links,
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.055 },
            "-=0.1",
          );
      } else {
        tl.to(links, {
          yPercent: -30,
          autoAlpha: 0,
          duration: 0.16,
          stagger: { each: 0.02, from: "end" },
        })
          .to(overlay, { autoAlpha: 0, duration: 0.2 }, "-=0.06")
          .set(overlay, { pointerEvents: "none" });
      }
    },
    { dependencies: [mobileOpen], scope: overlayRef },
  );

  const scrollToAnchor = (e, href) => {
    if (!isHome) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setMobileOpen(false);
    if (prefersReducedMotion()) {
      target.scrollIntoView({ block: "start" });
      return;
    }
    gsap.to(window, {
      duration: 0.85,
      ease: "power4.out",
      scrollTo: { y: target, offsetY: 80 },
    });
  };

  // ── Pill nav background logic ──────────────────────────────────
  const pillBg = colorMode === "light"
    ? scrolled ? "rgba(250,250,248,0.9)" : "rgba(250,250,248,0.0)"
    : scrolled ? "rgba(30,30,30,0.88)" : "rgba(30,30,30,0.0)";
  const pillBorder = colorMode === "light"
    ? scrolled ? "1px solid rgba(0,0,0,0.10)" : "1px solid transparent"
    : scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent";

  return (
    <>
      {/* ── DESKTOP + TABLET NAVBAR ───────────────────────────── */}
      <Box
        ref={pillRef}
        position="fixed"
        top={{ base: 3, md: 5 }}
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        w={{ base: "calc(100% - 24px)", md: "auto" }}
        maxW={{ base: "100%", md: "780px" }}
        // Hide on mobile — bottom bar handles it
        display={{ base: "none", md: "block" }}
      >
        {/* Progress bar — sits above pill */}
        <Box
          ref={progressRef}
          position="absolute"
          top="-2px"
          left="18px"
          right="18px"
          h="1.5px"
          bg={colors.text}
          borderRadius="999px"
          transform="scaleX(0)"
          transformOrigin="left center"
          zIndex={1}
        />

        {/* Pill */}
        <Flex
          align="center"
          justify="space-between"
          gap={2}
          px={{ base: 3, md: 5 }}
          h={{ base: "52px", md: "56px" }}
          borderRadius="999px"
          bg={pillBg}
          border={pillBorder}
          backdropFilter="blur(20px)"
          WebkitBackdropFilter="blur(20px)"
          boxShadow={scrolled
            ? colorMode === "light"
              ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)"
              : "0 4px 24px rgba(0,0,0,0.4)"
            : "none"}
          style={{ transition: "background .3s ease, border-color .3s ease, box-shadow .3s ease" }}
        >
          {/* Wordmark */}
          <Link
            href={isHome ? "#hero" : "/"}
            onClick={(e) => scrollToAnchor(e, "#hero")}
            _hover={{ textDecoration: "none", opacity: 0.72 }}
            flexShrink={0}
            style={{ transition: "opacity .18s ease" }}
          >
            <Text
              fontSize="15px"
              fontWeight="700"
              color={colors.text}
              lineHeight="1"
              letterSpacing="-.01em"
            >
              {personalInfo.name?.split(" ")[0] || "aurio"}
              <Box as="span" color={colors.muted} fontWeight="400">
                .work
              </Box>
            </Text>
          </Link>

          {/* Divider */}
          <Box w="1px" h="18px" bg={colors.border} mx={1} flexShrink={0} />

          {/* Nav links */}
          <HStack
            as="nav"
            spacing={0}
            flex={1}
            justify="center"
            overflow="hidden"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={(e) => scrollToAnchor(e, item.href)}
                  position="relative"
                  display="flex"
                  alignItems="center"
                  h="36px"
                  px={{ md: "10px", lg: "13px" }}
                  fontSize="13px"
                  fontWeight={isActive ? "700" : "500"}
                  color={isActive ? colors.text : colors.muted}
                  borderRadius="999px"
                  bg={isActive ? colors.surface : "transparent"}
                  _hover={{
                    textDecoration: "none",
                    color: colors.text,
                    bg: colors.surface,
                  }}
                  style={{ transition: "color .18s ease, background .18s ease" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </HStack>

          {/* Divider */}
          <Box w="1px" h="18px" bg={colors.border} mx={1} flexShrink={0} />

          {/* Actions */}
          <HStack spacing={1} flexShrink={0}>
            <IconButton
              icon={colorMode === "light" ? <Moon size={15} /> : <Sun size={15} />}
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              variant="studioGhost"
              w="34px"
              h="34px"
              minW="34px"
              borderRadius="999px"
            />
            <Button
              variant="studio"
              size="sm"
              fontSize="13px"
              h="34px"
              px={4}
              leftIcon={<Download size={13} />}
              onClick={handleDownload}
              isLoading={isDownloading}
            >
              CV
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* ── MOBILE TOP BAR (wordmark only) ────────────────────── */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        justifyContent="space-between"
        px={4}
        h="56px"
        bg={scrolled
          ? colorMode === "light" ? "rgba(250,250,248,0.92)" : "rgba(30,30,30,0.92)"
          : "transparent"}
        borderBottom={scrolled ? `1px solid ${colors.border}` : "1px solid transparent"}
        backdropFilter="blur(18px)"
        style={{ transition: "background .3s ease, border-color .3s ease" }}
      >
        <Link
          href={isHome ? "#hero" : "/"}
          onClick={(e) => scrollToAnchor(e, "#hero")}
          _hover={{ textDecoration: "none" }}
        >
          <Text fontSize="15px" fontWeight="700" color={colors.text} letterSpacing="-.01em">
            {personalInfo.name?.split(" ")[0] || "aurio"}
            <Box as="span" color={colors.muted} fontWeight="400">.work</Box>
          </Text>
        </Link>

        <HStack spacing={1}>
          <IconButton
            icon={colorMode === "light" ? <Moon size={16} /> : <Sun size={16} />}
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="studioGhost"
            w="36px"
            h="36px"
            minW="36px"
          />
          {/* Menu toggle for full overlay */}
          <IconButton
            icon={mobileOpen ? <X size={18} /> : (
              // Hamburger custom: 3 lines with middle line shorter
              <Box display="flex" flexDirection="column" gap="4px" alignItems="flex-end">
                <Box w="18px" h="1.5px" bg={colors.text} borderRadius="1px" />
                <Box w="12px" h="1.5px" bg={colors.text} borderRadius="1px" />
                <Box w="18px" h="1.5px" bg={colors.text} borderRadius="1px" />
              </Box>
            )}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            variant="studioGhost"
            w="36px"
            h="36px"
            minW="36px"
          />
        </HStack>
      </Box>

      {/* ─ */}

      {/* ── FULL SCREEN MOBILE OVERLAY ────────────────────────── */}
      <Box
        ref={overlayRef}
        position="fixed"
        inset={0}
        zIndex={1100}
        bg={colorMode === "light" ? "#fafaf8" : "#1e1e1e"}
        color={colors.text}
        opacity={0}
        visibility="hidden"
        pointerEvents="none"
        px={7}
        display={{ base: "flex", md: "none" }}
        flexDirection="column"
        justifyContent="center"
        gap={0}
      >
        {/* Close button */}
        <IconButton
          icon={<X size={20} />}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          variant="studioGhost"
          position="absolute"
          top={4}
          right={4}
          w="40px"
          h="40px"
        />

        <VStack align="stretch" spacing={0}>
          {NAV_ITEMS.map((item, i) => (
            <Box
              key={item.href}
              data-mobile-link
              overflow="hidden"
              borderBottom={i < NAV_ITEMS.length - 1 ? `1px solid ${colors.border}` : "none"}
            >
              <Link
                href={isHome ? item.href : `/${item.href}`}
                onClick={(e) => scrollToAnchor(e, item.href)}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py={5}
                _hover={{ textDecoration: "none", opacity: 0.6 }}
                style={{ transition: "opacity .16s ease" }}
              >
                <HStack spacing={4} align="baseline">
                  <Text
                    fontSize="12px"
                    color={colors.muted}
                    fontWeight="500"
                    letterSpacing=".06em"
                    minW="22px"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                  <Text
                    fontSize="38px"
                    fontWeight="800"
                    lineHeight=".95"
                    letterSpacing="-.02em"
                    color={activeHref === item.href ? colors.text : colors.text}
                    opacity={activeHref === item.href ? 1 : 0.55}
                  >
                    {item.label}
                  </Text>
                </HStack>
                <ArrowUpRight size={18} color={colors.muted} />
              </Link>
            </Box>
          ))}
        </VStack>

        {/* Bottom actions */}
        <Flex mt={10} gap={3}>
          <Button
            variant="studio"
            leftIcon={<Download size={14} />}
            onClick={() => { handleDownload(); setMobileOpen(false); }}
            isLoading={isDownloading}
            flex={1}
          >
            Download CV
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default Header;