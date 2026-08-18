import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { Play, RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";

const WIDTH = 320;
const HEIGHT = 220;
const PADDLE_W = 8;
const PADDLE_H = 46;
const BALL_R = 6;
const WIN_SCORE = 5;
const PLAYER_SPEED = 320; // px/sec while holding a key
const AI_MAX_SPEED = 220; // px/sec, deliberately slower than the ball can move
const AI_REACTION_MS = 140;
const BEST_KEY = "arcade:pong:streak";

const freshBall = (directionToRight) => ({
  x: WIDTH / 2,
  y: HEIGHT / 2,
  vx: (directionToRight ? 1 : -1) * 160,
  vy: (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 60),
});

const Pong = () => {
  const colors = useStudioColors();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({ up: false, down: false });
  const pointerActive = useRef(false);
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [bestStreak, setBestStreak] = useState(() => {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const gameRef = useRef({
    player: { y: HEIGHT / 2 - PADDLE_H / 2 },
    ai: { y: HEIGHT / 2 - PADDLE_H / 2, target: HEIGHT / 2, lastThink: 0 },
    ball: freshBall(true),
    last: 0,
    scores: { player: 0, ai: 0 },
    winStreak: 0,
  });

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { player, ai, ball } = gameRef.current;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#00f5d4";
    ctx.fillRect(4, player.y, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(WIDTH - 4 - PADDLE_W, ai.y, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "#ffca3a";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = setupHiDPICanvas(canvasRef.current, WIDTH, HEIGHT);
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endMatch = (winner) => {
    setStatus("over");
    const state = gameRef.current;
    if (winner === "player") {
      state.winStreak += 1;
      setBestStreak((current) => {
        if (state.winStreak <= current) return current;
        try {
          window.localStorage.setItem(BEST_KEY, String(state.winStreak));
        } catch {
          // storage unavailable, ignore
        }
        return state.winStreak;
      });
    } else {
      state.winStreak = 0;
    }
  };

  const tick = (now) => {
    const state = gameRef.current;
    if (document.hidden) {
      state.last = now;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min(0.033, (now - state.last) / 1000 || 0);
    state.last = now;

    if (keysRef.current.up) state.player.y -= PLAYER_SPEED * dt;
    if (keysRef.current.down) state.player.y += PLAYER_SPEED * dt;
    state.player.y = Math.max(0, Math.min(HEIGHT - PADDLE_H, state.player.y));

    if (now - state.ai.lastThink > AI_REACTION_MS) {
      state.ai.lastThink = now;
      const errorMargin = (Math.random() - 0.5) * 40;
      state.ai.target = state.ball.y - PADDLE_H / 2 + errorMargin;
    }
    const aiDelta = state.ai.target - state.ai.y;
    const aiStep = Math.max(
      -AI_MAX_SPEED * dt,
      Math.min(AI_MAX_SPEED * dt, aiDelta),
    );
    state.ai.y = Math.max(0, Math.min(HEIGHT - PADDLE_H, state.ai.y + aiStep));

    const ball = state.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R;
      ball.vy *= -1;
    } else if (ball.y + BALL_R > HEIGHT) {
      ball.y = HEIGHT - BALL_R;
      ball.vy *= -1;
    }

    const hitsPaddle = (paddleY, paddleX) =>
      ball.y > paddleY &&
      ball.y < paddleY + PADDLE_H &&
      Math.abs(ball.x - paddleX) < PADDLE_W + BALL_R;

    if (ball.vx < 0 && hitsPaddle(state.player.y, 4 + PADDLE_W / 2)) {
      const offset = (ball.y - (state.player.y + PADDLE_H / 2)) / (PADDLE_H / 2);
      ball.vx = Math.abs(ball.vx) * 1.05;
      ball.vy = offset * 220;
      ball.x = 4 + PADDLE_W + BALL_R;
    } else if (
      ball.vx > 0 &&
      hitsPaddle(state.ai.y, WIDTH - 4 - PADDLE_W / 2)
    ) {
      const offset = (ball.y - (state.ai.y + PADDLE_H / 2)) / (PADDLE_H / 2);
      ball.vx = -Math.abs(ball.vx) * 1.05;
      ball.vy = offset * 220;
      ball.x = WIDTH - 4 - PADDLE_W - BALL_R;
    }

    if (ball.x < -20) {
      state.scores = { ...state.scores, ai: state.scores.ai + 1 };
      setScores(state.scores);
      if (state.scores.ai >= WIN_SCORE) {
        endMatch("ai");
      } else {
        state.ball = freshBall(true);
      }
    } else if (ball.x > WIDTH + 20) {
      state.scores = { ...state.scores, player: state.scores.player + 1 };
      setScores(state.scores);
      if (state.scores.player >= WIN_SCORE) {
        endMatch("player");
      } else {
        state.ball = freshBall(false);
      }
    }

    draw();
    if (status === "over" || (state.scores.player >= WIN_SCORE) || (state.scores.ai >= WIN_SCORE)) {
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    gameRef.current = {
      player: { y: HEIGHT / 2 - PADDLE_H / 2 },
      ai: { y: HEIGHT / 2 - PADDLE_H / 2, target: HEIGHT / 2, lastThink: 0 },
      ball: freshBall(Math.random() < 0.5),
      last: performance.now(),
      scores: { player: 0, ai: 0 },
      winStreak: gameRef.current.winStreak,
    };
    setScores({ player: 0, ai: 0 });
    setStatus("playing");
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["ArrowUp", "w", "W"].includes(event.key)) {
        event.preventDefault();
        keysRef.current.up = true;
      }
      if (["ArrowDown", "s", "S"].includes(event.key)) {
        event.preventDefault();
        keysRef.current.down = true;
      }
    };
    const handleKeyUp = (event) => {
      if (["ArrowUp", "w", "W"].includes(event.key)) keysRef.current.up = false;
      if (["ArrowDown", "s", "S"].includes(event.key))
        keysRef.current.down = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const moveTo = (clientY, element) => {
    if (status !== "playing") return;
    const rect = element.getBoundingClientRect();
    const y = (clientY - rect.top) * (HEIGHT / rect.height) - PADDLE_H / 2;
    gameRef.current.player.y = Math.max(0, Math.min(HEIGHT - PADDLE_H, y));
  };
  const handlePointerDown = (event) => {
    event.preventDefault();
    pointerActive.current = true;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    moveTo(event.clientY, event.currentTarget);
  };
  const handlePointerMove = (event) => {
    if (pointerActive.current) { event.preventDefault(); moveTo(event.clientY, event.currentTarget); }
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Pong
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            First to {WIN_SCORE} points wins.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              YOU
            </Text>
            <Text fontWeight="800">{scores.player}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              COMPUTER
            </Text>
            <Text fontWeight="800">{scores.ai}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              STREAK
            </Text>
            <Text fontWeight="800">{bestStreak}</Text>
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
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            pointerActive.current = false;
          }}
          onPointerCancel={() => {
            pointerActive.current = false;
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
            >
              <Text fontWeight="800" fontSize="20px">
                {status === "idle"
                  ? "Ready?"
                  : scores.player > scores.ai
                    ? "You win"
                    : "Computer wins"}
              </Text>
              <Text mt={2} fontSize="13px">
                {status === "idle"
                  ? "Drag, use your mouse, or arrow keys."
                  : `Final score ${scores.player}–${scores.ai}.`}
              </Text>
            </Flex>
          )}
        </Box>
        <Text mt={3} textAlign="center" fontSize="12px" color={colors.muted}>
          Drag on the board, or use W/S and arrow keys.
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
                ? "Start match"
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
export default Pong;