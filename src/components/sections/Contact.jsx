import React, { useRef, useState } from "react";
import { Box, Button, Grid, Link, Text, VStack, useToast } from "@chakra-ui/react";
import emailjs from "@emailjs/browser";
import { useGSAP } from "@gsap/react";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { StudioSection, useStudioColors } from "../public/studio";
import { gsap, prefersReducedMotion } from "../../utils/gsap";

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const personalInfo = portfolioData.personalInfo || {};
  const colors = useStudioColors();
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-contact-reveal]", {
        y: 22,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          once: true,
        },
      });
    },
    { scope: rootRef }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all fields.", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message, to_email: "mr.auriorajaa@gmail.com", reply_to: form.email },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
      toast({ title: "Message sent.", description: "Thanks — I'll get back to you soon.", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "Message failed.", description: error?.text || "Please try again or email directly.", status: "error", duration: 3500, isClosable: true });
    } finally {
      setSending(false);
    }
  };

  const socials = [
    { icon: <Mail size={15} />, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: <Github size={15} />, label: "github.com/auriorajaa", href: personalInfo.github, external: true },
    { icon: <Linkedin size={15} />, label: "linkedin.com/in/auriorajaa", href: personalInfo.linkedin, external: true },
    { icon: <MapPin size={15} />, label: personalInfo.location || "Jakarta, Indonesia" },
  ].filter((s) => s.href || s.label);

  const inputBase = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid",
    outline: "none",
    fontSize: "15px",
    fontFamily: "inherit",
    padding: "14px 0",
    transition: "border-color .18s ease",
    resize: "none",
  };

  return (
    <StudioSection id="contact" eyebrow="Contact" title="A small form to talk.">
      <Grid
        ref={rootRef}
        templateColumns={{ base: "1fr", lg: "1fr 1.4fr" }}
        gap={{ base: 12, lg: 16 }}
        alignItems="start"
      >
        {/* ── Left: info ───────────────────────────────────── */}
        <VStack align="stretch" spacing={8}>
          <Text
            data-contact-reveal
            fontSize={{ base: "15px", md: "17px" }}
            lineHeight="1.78"
            color={colors.muted}
            maxW="340px"
          >
            Open for engineering roles, collaborations, and practical product conversations.
          </Text>

          <VStack data-contact-reveal align="stretch" spacing={0}>
            {socials.map((s, i) => (
              <Box
                key={i}
                display="flex"
                alignItems="center"
                gap={3}
                py={3}
                borderBottom="1px solid"
                borderColor={colors.borderSoft}
                color={colors.muted}
                fontSize="14px"
                _first={{ borderTop: "1px solid", borderTopColor: colors.borderSoft }}
              >
                <Box color={colors.accent} flexShrink={0}>{s.icon}</Box>
                {s.href ? (
                  <Link
                    href={s.href}
                    isExternal={s.external}
                    color={colors.text}
                    fontWeight="500"
                    fontSize="14px"
                    _hover={{ color: colors.accent }}
                    transition="color .15s ease"
                    textDecoration="none"
                  >
                    {s.label}
                  </Link>
                ) : (
                  <Text fontSize="14px" fontWeight="500" color={colors.text}>{s.label}</Text>
                )}
              </Box>
            ))}
          </VStack>
        </VStack>

        {/* ── Right: form ──────────────────────────────────── */}
        <Box
          data-contact-reveal
          as="form"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <VStack align="stretch" spacing={0}>
            {/* Name */}
            <Box
              // borderBottom="1px solid"
              borderColor={focused === "name" ? colors.text : colors.borderSoft}
              transition="border-color .18s ease"
              pb={1}
              mb={6}
            >
              <Text fontSize="11px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={colors.muted} mb={1}>
                Name
              </Text>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Your name"
                style={{
                  ...inputBase,
                  borderColor: focused === "name" ? colors.text : colors.borderSoft,
                  color: colors.text,
                }}
              />
            </Box>

            {/* Email */}
            <Box
              // borderBottom="1px solid"
              borderColor={focused === "email" ? colors.text : colors.borderSoft}
              transition="border-color .18s ease"
              pb={1}
              mb={6}
            >
              <Text fontSize="11px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={colors.muted} mb={1}>
                Email
              </Text>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="your@email.com"
                style={{
                  ...inputBase,
                  borderColor: focused === "email" ? colors.text : colors.borderSoft,
                  color: colors.text,
                }}
              />
            </Box>

            {/* Message */}
            <Box
              // borderBottom="1px solid"
              borderColor={focused === "message" ? colors.text : colors.borderSoft}
              transition="border-color .18s ease"
              pb={1}
              mb={8}
            >
              <Text fontSize="11px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={colors.muted} mb={1}>
                Message
              </Text>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                placeholder="What's on your mind?"
                rows={6}
                style={{
                  ...inputBase,
                  borderColor: focused === "message" ? colors.text : colors.borderSoft,
                  color: colors.text,
                }}
              />
            </Box>

            {/* Submit */}
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4}>
              <Text fontSize="12px" color={colors.muted} maxW="220px" lineHeight="1.6">
                I typically respond within 24–48 hours.
              </Text>
              <Button
                type="submit"
                variant="studio"
                size="sm"
                fontSize="13px"
                h="34px"
                px={4}
                leftIcon={<Send size={13} />}
                isLoading={sending}
                loadingText="Sending..."
              >
                Send message
              </Button>
            </Box>
          </VStack>
        </Box>
      </Grid>
    </StudioSection>
  );
};

export default Contact;