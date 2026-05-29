import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  Flip,
  MotionPathPlugin,
  ScrollTrigger,
  ScrollToPlugin,
  TextPlugin,
);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { Flip, MotionPathPlugin, ScrollTrigger, ScrollToPlugin, TextPlugin, gsap };
