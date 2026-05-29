import theme from "./styles/theme";

test("uses the public studio theme tokens", () => {
  expect(theme.config.initialColorMode).toBe("light");
  expect(theme.colors.studio.white).toBe("#fafaf8");
  expect(theme.semanticTokens.colors["public.primary"]._dark).toBe("#f5f5f2");
  expect(theme.fonts.body).toContain("Plus Jakarta Sans");
});
