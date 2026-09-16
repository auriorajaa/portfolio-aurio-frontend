import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { ChevronUp, ChevronDown, Play, RotateCcw, Trophy } from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const WIDTH = 640;
const HEIGHT = 400;
const PADDLE_W = 14;
const PADDLE_H = 76;
const BALL_R = 9;
const WIN_SCORE = 5;
const PLAYER_SPEED = 620; // px/sec

const DIFFICULTY_SETTINGS = {
  easy: { label: "Casual", aiSpeed: 380, reactionMs: 190, errorMargin: 50 },
  normal: { label: "Pro", aiSpeed: 450, reactionMs: 130, errorMargin: 30 },
  hard: { label: "Master", aiSpeed: 520, reactionMs: 70, errorMargin: 12 },
};

const freshBall = (directionToRight) => ({
  x: WIDTH / 2,
  y: HEIGHT / 2,
  vx: (directionToRight ? 1 : -1) * 340,
  vy: (Math.random() < 0.5 ? -1 : 1) * (140 + Math.random() * 120),
});

const Pong = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("pong"));
  const palette = {
    p: shop?.skin?.colors?.p || "#00f5d4",
    s: shop?.skin?.colors?.s || "#ff6b6b",
  };
  const paddleScale = shop?.perks?.pongPaddleScale || 1;
  const PLAYER_HEIGHT = Math.round(PADDLE_H * paddleScale);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({ up: false, down: false });
  const pointerActive = useRef(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [bestStreak, setBestStreak] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.pong?.bestStreak || 0;
  });

  const gameRef = useRef({
    player: { y: HEIGHT / 2 - PADDLE_H / 2 },
    ai: { y: HEIGHT / 2 - PADDLE_H / 2, target: HEIGHT / 2, lastThink: 0 },
    ball: freshBall(true),
    last: 0,
    scores: { player: 0, ai: 0 },
    winStreak: 0,
    difficulty: "normal",
  });

  useEffect(() => {
    gameRef.current.difficulty = difficulty;
  }, [difficulty]);

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { player, ai, ball } = gameRef.current;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Center divider
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player Paddle (Cyan)
    ctx.fillStyle = palette.p;
    ctx.fillRect(6, player.y, PADDLE_W, PLAYER_HEIGHT);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, player.y, PADDLE_W, PLAYER_HEIGHT);

    // AI Paddle (Coral Red)
    ctx.fillStyle = palette.s;
    ctx.fillRect(WIDTH - 6 - PADDLE_W, ai.y, PADDLE_W, PADDLE_H);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(WIDTH - 6 - PADDLE_W, ai.y, PADDLE_W, PADDLE_H);

    // Ball (Arcade Yellow)
    ctx.fillStyle = "#ffca3a";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
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
    arcadeAudio.stopBgm({ fade: true });
    const state = gameRef.current;
    if (winner === "player") {
      state.winStreak += 1;
      arcadeAudio.playWin();
      arcadeHaptics.success();
      setBestStreak((current) => {
        const next = Math.max(current, state.winStreak);
        recordGameSession("pong", next);
        return next;
      });
    } else {
      state.winStreak = 0;
      arcadeAudio.playHit();
      arcadeHaptics.danger();
      recordGameSession("pong", bestStreak);
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
    state.player.y = Math.max(0, Math.min(HEIGHT - PLAYER_HEIGHT, state.player.y));

    // AI movement logic based on selected difficulty
    const diff = DIFFICULTY_SETTINGS[state.difficulty] || DIFFICULTY_SETTINGS.normal;
    if (now - state.ai.lastThink > diff.reactionMs) {
      state.ai.lastThink = now;
      const offset = (Math.random() - 0.5) * diff.errorMargin;
      state.ai.target = state.ball.y - PADDLE_H / 2 + offset;
    }
    const aiDelta = state.ai.target - state.ai.y;
    const aiStep = Math.max(-diff.aiSpeed * dt, Math.min(diff.aiSpeed * dt, aiDelta));
    state.ai.y = Math.max(0, Math.min(HEIGHT - PADDLE_H, state.ai.y + aiStep));

    const ball = state.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Wall bounce
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R;
      ball.vy = Math.abs(ball.vy);
      arcadeAudio.playClick();
    } else if (ball.y + BALL_R > HEIGHT) {
      ball.y = HEIGHT - BALL_R;
      ball.vy = -Math.abs(ball.vy);
      arcadeAudio.playClick();
    }

    const hitsPaddle = (paddleY, paddleX, paddleH) =>
      ball.y > paddleY - BALL_R &&
      ball.y < paddleY + paddleH + BALL_R &&
      Math.abs(ball.x - paddleX) < PADDLE_W / 2 + BALL_R;

    // Paddle collision
    if (ball.vx < 0 && hitsPaddle(state.player.y, 6 + PADDLE_W / 2, PLAYER_HEIGHT)) {
      const offset = (ball.y - (state.player.y + PLAYER_HEIGHT / 2)) / (PLAYER_HEIGHT / 2);
      ball.vx = Math.abs(ball.vx) * 1.05;
      ball.vy = offset * 420;
      ball.x = 6 + PADDLE_W + BALL_R;
      arcadeAudio.playMove();
      arcadeHaptics.light();
    } else if (ball.vx > 0 && hitsPaddle(state.ai.y, WIDTH - 6 - PADDLE_W / 2, PADDLE_H)) {
      const offset = (ball.y - (state.ai.y + PADDLE_H / 2)) / (PADDLE_H / 2);
      ball.vx = -Math.abs(ball.vx) * 1.05;
      ball.vy = offset * 420;
      ball.x = WIDTH - 6 - PADDLE_W - BALL_R;
      arcadeAudio.playMove();
    }

    // Score checks
    if (ball.x < -20) {
      state.scores = { ...state.scores, ai: state.scores.ai + 1 };
      setScores(state.scores);
      arcadeAudio.playHit();
      arcadeHaptics.medium();
      if (state.scores.ai >= WIN_SCORE) {
        endMatch("ai");
        draw();
        return;
      }
      state.ball = freshBall(true);
    } else if (ball.x > WIDTH + 20) {
      state.scores = { ...state.scores, player: state.scores.player + 1 };
      setScores(state.scores);
      arcadeAudio.playScore();
      arcadeHaptics.light();
      if (state.scores.player >= WIN_SCORE) {
        endMatch("player");
        draw();
        return;
      }
      state.ball = freshBall(false);
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = (e) => {
    if (e) e.stopPropagation();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("pong");
    arcadeHaptics.medium();

    gameRef.current = {
      player: { y: HEIGHT / 2 - PADDLE_H / 2 },
      ai: { y: HEIGHT / 2 - PADDLE_H / 2, target: HEIGHT / 2, lastThink: 0 },
      ball: freshBall(Math.random() < 0.5),
      last: performance.now(),
      scores: { player: 0, ai: 0 },
      winStreak: gameRef.current.winStreak,
      difficulty,
    };
    setScores({ player: 0, ai: 0 });
    setStatus("playing");
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      arcadeAudio.stopBgm({ fade: false });
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
      if (["ArrowDown", "s", "S"].includes(event.key)) keysRef.current.down = false;
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
    const y = (clientY - rect.top) * (HEIGHT / rect.height) - PLAYER_HEIGHT / 2;
    gameRef.current.player.y = Math.max(0, Math.min(HEIGHT - PLAYER_HEIGHT, y));
  };

  const handlePointerDown = (event) => {
    if (status !== "playing") return;
    event.preventDefault();
    pointerActive.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    moveTo(event.clientY, event.currentTarget);
  };

  const handlePointerMove = (event) => {
    if (status !== "playing") return;
    if (pointerActive.current) {
      event.preventDefault();
      moveTo(event.clientY, event.currentTarget);
    }
  };

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Pong
            </Text>
            <Box px={2} py={0.5} bg="#ff9f68" color="#171717" fontSize="10px" fontWeight="800" textTransform="uppercase">
              First to {WIN_SCORE}
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Defend your goal and strike past the computer paddle.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              YOU
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#00f5d4">
              {scores.player}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              AI
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ff6b6b">
              {scores.ai}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              STREAK
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffca3a">
              {bestStreak}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <HStack justify="center" mb={4} spacing={2}>
        {Object.entries(DIFFICULTY_SETTINGS).map(([key, val]) => (
          <Button
            key={key}
            onClick={() => {
              arcadeAudio.playClick();
              setDifficulty(key);
            }}
            isDisabled={status === "playing"}
            size="sm"
            fontSize="12px"
            fontWeight="800"
            border="2px solid"
            borderColor={difficulty === key ? "#ff9f68" : colors.border}
            bg={difficulty === key ? "#ff9f68" : colors.surface}
            color={difficulty === key ? "#171717" : colors.text}
          >
            {val.label}
          </Button>
        ))}
      </HStack>

      <Box maxW={{ base: "100%", md: "640px" }} mx="auto">
        <Box
          position="relative"
          w="100%"
          aspectRatio={WIDTH / HEIGHT}
          bg={colors.surface}
          border="2px solid"
          borderColor={colors.border}
          overflow="hidden"
          userSelect="none"
          sx={{
            touchAction: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
          }}
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

          {/* In-Window Overlay */}
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
              {status === "over" && scores.player > scores.ai ? (
                <Trophy size={44} color="#00f5d4" />
              ) : null}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {status === "idle"
                  ? "Pong Arena Ready"
                  : scores.player > scores.ai
                    ? "Victory!"
                    : "Computer Wins!"}
              </Text>
              <Text mt={2} fontSize={{ base: "13px", md: "14px" }} opacity={0.9}>
                {status === "idle"
                  ? "Drag anywhere on the board or use W/S / arrow keys."
                  : `Final score: ${scores.player} - ${scores.ai}.`}
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
                {status === "idle" ? "Start Match" : "Play Again"}
              </Button>
            </Flex>
          )}
        </Box>

        {/* Mobile touch paddle nudge buttons */}
        <Flex
          display={{ base: "flex", md: "none" }}
          justify="center"
          gap={4}
          mt={3}
        >
          <Button
            size="md"
            w="48%"
            h="48px"
            bg={colors.surface}
            border="2px solid"
            borderColor={colors.border}
            onPointerDown={(e) => {
              e.preventDefault();
              keysRef.current.up = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              keysRef.current.up = false;
            }}
            leftIcon={<ChevronUp size={20} />}
          >
            Paddle UP
          </Button>
          <Button
            size="md"
            w="48%"
            h="48px"
            bg={colors.surface}
            border="2px solid"
            borderColor={colors.border}
            onPointerDown={(e) => {
              e.preventDefault();
              keysRef.current.down = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              keysRef.current.down = false;
            }}
            leftIcon={<ChevronDown size={20} />}
          >
            Paddle DOWN
          </Button>
        </Flex>

        <Text
          mt={3}
          textAlign="center"
          fontSize={{ base: "13px", md: "14px" }}
          color={colors.muted}
        >
          Drag on the board or use W/S & Arrow Keys.
        </Text>

        {/* Outside Window Controls */}
        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            onPointerDown={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing" ? "Match in Progress" : status === "idle" ? "Start Match" : "Play Again"}
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

export default Pong;