import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { gsap, prefersReducedMotion } from "../utils/gsap";

export const useGsapReveal = ({
  selector = "[data-gsap-reveal]",
  y = 22,
  stagger = 0.07,
  duration = 0.7,
  once = true,
} = {}) => {
  const scopeRef = useRef(null);
  const playedRef = useRef(false);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
    triggerOnce: once,
  });

  const setRefs = useCallback(
    (node) => {
      scopeRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !inView || (once && playedRef.current)) return undefined;

    playedRef.current = true;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(selector);
      const animatedTargets = targets.length ? targets : [scope];

      if (prefersReducedMotion()) {
        gsap.set(animatedTargets, { autoAlpha: 1, y: 0, clearProps: "willChange" });
        return;
      }

      gsap.fromTo(
        animatedTargets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease: "power2.out",
          stagger: Math.min(stagger, 0.12),
          overwrite: "auto",
        },
      );
    }, scope);

    return () => ctx.revert();
  }, [duration, inView, once, selector, stagger, y]);

  return setRefs;
};
