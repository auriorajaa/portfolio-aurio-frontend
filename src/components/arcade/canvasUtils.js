// Sets up a canvas's backing-store resolution to match devicePixelRatio,
// while the CSS display size (set via style, e.g. width:100%) stays
// responsive and untouched. This keeps drawing crisp on retina screens
// without any extra library.
export const setupHiDPICanvas = (canvas, logicalWidth, logicalHeight) => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
};
