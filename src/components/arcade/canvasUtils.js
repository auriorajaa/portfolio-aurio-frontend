// src/components/arcade/canvasUtils.js
/**
 * Sets up a canvas's backing-store resolution to match devicePixelRatio,
 * keeping drawing crisp on Retina/HiDPI screens while CSS display size
 * stays 100% fluid and responsive.
 */
export const setupHiDPICanvas = (canvas, logicalWidth, logicalHeight) => {
  if (!canvas) return null;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  canvas.width = Math.round(logicalWidth * dpr);
  canvas.height = Math.round(logicalHeight * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false; // Authentic sharp pixel-art arcade rendering
  }
  return ctx;
};
