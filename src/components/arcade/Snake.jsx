import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { Play, RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";

const COLS = 16;
const ROWS = 16;
const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
const BASE_SPEED = 150;
const MIN_SPEED = 75;
const BEST_KEY = "arcade:snake:best";

const randomCell = () => ({
  x: Math.floor(Math.random() * COLS),
  y: Math.floor(Math.random() * ROWS),
});
const randomFood = (snake) => {
  let cell;
  do {
    cell = randomCell();
  } while (snake.some((seg) => seg.x === cell.x && seg.y === cell.y));
  return cell;
};

const Snake = () => {
  const colors = useStudioColors();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const timeoutRef = useRef(null);
  const pointerStart = useRef(null);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const gameRef = useRef({
    snake: [],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
    speed: BASE_SPEED,
  });

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const { snake, food } = gameRef.current;
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00f5d4" : "#0bbfa0";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = setupHiDPICanvas(canvasRef.current, WIDTH, HEIGHT);
    }
  }, []);

  const gameOver = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const finalScore = gameRef.current.score;
    setStatus("over");
    setBest((current) => {
      if (finalScore <= current) return current;
      try {
        window.localStorage.setItem(BEST_KEY, String(finalScore));
      } catch {
        // storage unavailable, ignore
      }
      return finalScore;
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
      state.score += 10;
      state.food = randomFood(state.snake);
      state.speed = Math.max(MIN_SPEED, BASE_SPEED - (state.score / 10) * 4);
      setScore(state.score);
    } else {
      state.snake.pop();
    }
    draw();
    timeoutRef.current = window.setTimeout(tick, state.speed);
  };

  const start = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    };
    setScore(0);
    setStatus("playing");
    draw();
    timeoutRef.current = window.setTimeout(tick, gameRef.current.speed);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const setDirection = (x, y) => {
    if (status !== "playing") return;
    const state = gameRef.current;
    if (state.dir.x === -x && state.dir.y === -y) return;
    state.nextDir = { x, y };
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
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event) => {
    if (!pointerStart.current) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) setDirection(dx > 0 ? 1 : -1, 0);
    else setDirection(0, dy > 0 ? 1 : -1);
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Snake
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            Eat the food. Don't hit the walls or yourself.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              SCORE
            </Text>
            <Text fontWeight="800">{score}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              BEST
            </Text>
            <Text fontWeight="800">{best}</Text>
          </Box>
        </HStack>
      </HStack>
      <Box maxW={`${WIDTH}px`} mx="auto">
        <Box
          position="relative"
          w="100%"
          maxW={`${WIDTH}px`}
          h={`${HEIGHT}px`}
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          overflow="hidden"
          touchAction="none"
          userSelect="none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
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
            >
              <Text fontWeight="800" fontSize="20px">
                {status === "idle" ? "Ready?" : "Game over"}
              </Text>
              <Text mt={2} fontSize="13px">
                {status === "idle"
                  ? "Swipe or use arrow keys to steer."
                  : `You scored ${score}.`}
              </Text>
            </Flex>
          )}
        </Box>
        <Text mt={3} textAlign="center" fontSize="12px" color={colors.muted}>
          Arrow keys, WASD, or swipe to change direction.
        </Text>
        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing"
              ? "Running"
              : status === "idle"
                ? "Start game"
                : "Play again"}
          </Button>
          {status === "over" && (
            <Button
              onClick={start}
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