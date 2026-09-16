import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Grid, HStack, Text } from "@chakra-ui/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Play,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const COLS = 16;
const ROWS = 16;
const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
const BASE_SPEED = 150;
const MIN_SPEED = 75;

// Equipped shop skin overrides the default palette.
const DEFAULT_PALETTE = { p: "#00f5d4", s: "#0bbfa0" };

const randomCell = () => ({
  x: Math.floor(Math.random() * COLS),
  y: Math.floor(Math.random() * ROWS),
});

const randomFood = (snake) => {
  let cell;
  do {
    cell = randomCell();
    // eslint-disable-next-line no-loop-func
  } while (snake.some((seg) => seg.x === cell.x && seg.y === cell.y));
  return cell;
};

const Snake = () => {
  const colors = useStudioColors();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const timeoutRef = useRef(null);
  const pointerStart = useRef(null);
  const startGuard = useRef(false);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.snake?.best || 0;
  });

  // Shop: read once on mount — equips apply from the next run onward.
  const [skin] = useState(() => getShopSnapshot("snake"));
  const palette = skin?.skin?.colors || DEFAULT_PALETTE;
  const appleScore = skin?.perks?.snakeAppleScore || 10;

  const gameRef = useRef({
    snake: [],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
    speed: BASE_SPEED,
  });

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Board wash + vignette
    const bg = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 40, WIDTH / 2, HEIGHT / 2, WIDTH * 0.75);
    bg.addColorStop(0, "rgba(27, 33, 64, 0.9)");
    bg.addColorStop(1, "rgba(10, 13, 28, 0.98)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Subtle arcade grid dots
    ctx.fillStyle = "rgba(148,163,184,0.14)";
    for (let r = 0; r < ROWS; r += 2) {
      for (let c = 0; c < COLS; c += 2) {
        ctx.beginPath();
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const { snake, food } = gameRef.current;

    // --- Illustrated apple (radial gradient, leaf, stem, shine) ---
    const appleX = food.x * CELL + CELL / 2;
    const appleY = food.y * CELL + CELL / 2 + 1;
    const appleR = CELL / 2 - 2;

    ctx.save();
    ctx.shadowColor = "#ff6b6b";
    ctx.shadowBlur = 10;
    const appleGrad = ctx.createRadialGradient(appleX - 2, appleY - 2, 1, appleX, appleY, appleR);
    appleGrad.addColorStop(0, "#ff9494");
    appleGrad.addColorStop(0.55, "#ff4d4d");
    appleGrad.addColorStop(1, "#c62828");
    ctx.fillStyle = appleGrad;
    ctx.beginPath();
    ctx.arc(appleX, appleY, appleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Specular highlight
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.ellipse(appleX - 3, appleY - 3.5, 2.6, 1.6, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Leaf
    ctx.fillStyle = "#8ac926";
    ctx.beginPath();
    ctx.ellipse(appleX + 3, appleY - appleR + 1, 4.5, 2.4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Stem
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(appleX, appleY - appleR + 2);
    ctx.lineTo(appleX + 0.5, appleY - appleR - 3);
    ctx.stroke();
    ctx.restore();

    // --- Snake body (rounded, two-tone, gentle glow) ---
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const x = seg.x * CELL + 1.5;
      const y = seg.y * CELL + 1.5;
      const s = CELL - 3;
      const fill = isHead ? palette.p : palette.s;

      ctx.save();
      ctx.shadowColor = isHead ? palette.p : "rgba(0,0,0,0.35)";
      ctx.shadowBlur = isHead ? 8 : 3;
      const segGrad = ctx.createLinearGradient(x, y, x + s, y + s);
      segGrad.addColorStop(0, fill);
      segGrad.addColorStop(1, isHead ? palette.s : "#08403a");
      ctx.fillStyle = segGrad;
      roundRect(ctx, x, y, s, s, isHead ? 5 : 4);
      ctx.fill();
      ctx.restore();

      // Scale highlight
      if (!isHead && i % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(ctx, x + 3.5, y + 3.5, s - 7, s - 7, 3);
        ctx.fill();
      }

      // Head details: expressive eyes + tongue
      if (isHead) {
        const dir = gameRef.current.dir;
        let eye1X = x + 5;
        let eye1Y = y + 5;
        let eye2X = x + 11;
        let eye2Y = y + 5;

        if (dir.x === 1) {
          eye1X = x + 12;
          eye1Y = y + 3;
          eye2X = x + 12;
          eye2Y = y + 11;
        } else if (dir.x === -1) {
          eye1X = x + 2;
          eye1Y = y + 3;
          eye2X = x + 2;
          eye2Y = y + 11;
        } else if (dir.y === 1) {
          eye1X = x + 3;
          eye1Y = y + 12;
          eye2X = x + 11;
          eye2Y = y + 12;
        } else {
          eye1X = x + 3;
          eye1Y = y + 2;
          eye2X = x + 11;
          eye2Y = y + 2;
        }

        ctx.fillStyle = "#171717";
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 2.4, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(eye1X + 0.6, eye1Y + 0.6, 1, 0, Math.PI * 2);
        ctx.arc(eye2X + 0.6, eye2Y + 0.6, 1, 0, Math.PI * 2);
        ctx.fill();

        // Tongue flick
        if (gameRef.current.tongueTimer > 0) {
          ctx.strokeStyle = "#ff6b6b";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x + s / 2, y + s / 2);
          const tx = dir.x * 4;
          const ty = dir.y * 4;
          ctx.lineTo(x + s / 2 + tx, y + s / 2 + ty);
          ctx.stroke();
        }
      }
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = setupHiDPICanvas(canvasRef.current, WIDTH, HEIGHT);
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gameOver = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const finalScore = gameRef.current.score;
    setStatus("over");
    arcadeAudio.stopBgm({ fade: true });
    arcadeAudio.playHit();
    arcadeHaptics.danger();

    setBest((current) => {
      const next = Math.max(current, finalScore);
      recordGameSession("snake", next);
      return next;
    });
  };

  const tick = () => {
    const state = gameRef.current;
    state.dir = state.nextDir;
    const head = state.snake[0];
    const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };
    const hitWall =
      newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
    const hitSelf = state.snake.some(
      (seg) => seg.x === newHead.x && seg.y === newHead.y,
    );
    if (hitWall || hitSelf) {
      gameOver();
      return;
    }
    state.snake = [newHead, ...state.snake];
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
      state.score += appleScore;
      state.food = randomFood(state.snake);
      state.speed = Math.max(MIN_SPEED, BASE_SPEED - (state.score / 10) * 4);
      setScore(state.score);
      arcadeAudio.playScore();
      arcadeHaptics.light();
    } else {
      state.snake.pop();
    }
    draw();
    timeoutRef.current = window.setTimeout(tick, state.speed);
  };

  const start = (e) => {
    if (e) e.stopPropagation();
    if (startGuard.current || status === "playing") return;
    startGuard.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("snake");
    arcadeHaptics.medium();

    const initialSnake = [
      { x: 7, y: 8 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
    ];
    gameRef.current = {
      snake: initialSnake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomFood(initialSnake),
      score: 0,
      speed: BASE_SPEED,
      tongueTimer: 0,
    };
    setScore(0);
    setStatus("playing");
    draw();
    timeoutRef.current = window.setTimeout(tick, gameRef.current.speed);
    window.setTimeout(() => {
      startGuard.current = false;
    }, 300);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const setDirection = (x, y) => {
    if (status !== "playing") return;
    const state = gameRef.current;
    if (state.dir.x === -x && state.dir.y === -y) return;
    state.nextDir = { x, y };
    arcadeAudio.playMove();
  };

  useEffect(() => {
    const map = {
      ArrowUp: [0, -1],
      w: [0, -1],
      W: [0, -1],
      ArrowDown: [0, 1],
      s: [0, 1],
      S: [0, 1],
      ArrowLeft: [-1, 0],
      a: [-1, 0],
      A: [-1, 0],
      ArrowRight: [1, 0],
      d: [1, 0],
      D: [1, 0],
    };
    const handleKey = (event) => {
      if (map[event.key]) {
        event.preventDefault();
        setDirection(...map[event.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handlePointerDown = (event) => {
    if (status !== "playing") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event) => {
    if (status !== "playing" || !pointerStart.current) return;
    event.preventDefault();
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
    if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 1 : -1, 0);
    else setDirection(0, dy > 0 ? 1 : -1);
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event) => {
    if (status !== "playing") return;
    event.preventDefault();
    pointerStart.current = null;
  };

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Snake
            </Text>
            <Box px={2} py={0.5} bg="#0bbfa0" color="#fff" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Classic Arcade
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Eat apples to grow. Avoid crashing into the boundaries or yourself.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              SCORE
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#00f5d4">
              {score}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              BEST
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffca3a">
              {best}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", sm: "360px", md: "460px" }} mx="auto">
        <Box
          position="relative"
          w="100%"
          aspectRatio={WIDTH / HEIGHT}
          bg={colors.surface}
          border="2px solid"
          borderColor={colors.border}
          overflow="hidden"
          sx={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {status !== "playing" && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg={colors.overlay}
              color={colors.surfaceAlt}
              direction="column"
              p={6}
              textAlign="center"
              backdropFilter="blur(2px)"
              zIndex={10}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {status === "over" && score >= best && score > 0 ? (
                <Trophy size={42} color="#ffca3a" />
              ) : null}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {status === "idle" ? "Ready to Slither?" : "Game Over"}
              </Text>
              <Text mt={2} fontSize={{ base: "13px", md: "14px" }} opacity={0.9}>
                {status === "idle"
                  ? "Swipe or use D-Pad / arrow keys to turn."
                  : `You scored ${score} points!`}
              </Text>
              <Button
                mt={4}
                size="md"
                bg="#00f5d4"
                color="#171717"
                fontWeight="800"
                _hover={{ bg: "#8ac926" }}
                leftIcon={<Play size={15} />}
                onPointerDown={start}
                onClick={start}
              >
                {status === "idle" ? "Start Game" : "Play Again"}
              </Button>
            </Flex>
          )}
        </Box>

        <Box mt={4} display={{ base: "block", md: "none" }}>
          <Text textAlign="center" fontSize="11px" fontWeight="800" color={colors.muted} mb={2} textTransform="uppercase" letterSpacing="0.05em">
            Virtual D-Pad
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={2} maxW="210px" mx="auto">
            <Box />
            <Button
              size="md"
              h="48px"
              bg={colors.surface}
              border="2px solid"
              borderColor={colors.border}
              onClick={() => setDirection(0, -1)}
              onPointerDown={() => setDirection(0, -1)}
              aria-label="Up"
            >
              <ArrowUp size={22} />
            </Button>
            <Box />
            <Button
              size="md"
              h="48px"
              bg={colors.surface}
              border="2px solid"
              borderColor={colors.border}
              onClick={() => setDirection(-1, 0)}
              onPointerDown={() => setDirection(-1, 0)}
              aria-label="Left"
            >
              <ArrowLeft size={22} />
            </Button>
            <Button
              size="md"
              h="48px"
              bg={colors.surface}
              border="2px solid"
              borderColor={colors.border}
              onClick={() => setDirection(0, 1)}
              onPointerDown={() => setDirection(0, 1)}
              aria-label="Down"
            >
              <ArrowDown size={22} />
            </Button>
            <Button
              size="md"
              h="48px"
              bg={colors.surface}
              border="2px solid"
              borderColor={colors.border}
              onClick={() => setDirection(1, 0)}
              onPointerDown={() => setDirection(1, 0)}
              aria-label="Right"
            >
              <ArrowRight size={22} />
            </Button>
          </Grid>
        </Box>

        <Text mt={3} textAlign="center" fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
          Arrow keys, WASD, touch D-pad, or swipe to turn.
        </Text>

        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            onPointerDown={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing" ? "Slithering" : status === "idle" ? "Start Game" : "Play Again"}
          </Button>
          {status === "over" && (
            <Button
              onClick={start}
              onPointerDown={start}
              variant="studioGhost"
              leftIcon={<RotateCcw size={14} />}
            >
              Restart
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default Snake;