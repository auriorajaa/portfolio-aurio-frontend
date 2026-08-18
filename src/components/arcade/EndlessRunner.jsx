import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { ArrowUp, Play, RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";

const WIDTH = 320;
const HEIGHT = 380;
const LANES = 3;
const LANE_W = WIDTH / LANES;
const PLAYER_SIZE = 34;
const GROUND_Y = HEIGHT - 54;
const JUMP_MS = 460;
const BEST_KEY = "arcade:runner:best";
const BASE_SPEED = 92;
const SPEED_RAMP = 180;
const MAX_SPEED = 190;
const MIN_SPAWN_MS = 620;
const INITIAL_SPAWN_MS = 1240;
const SWIPE_THRESHOLD = 34;

const laneCenterX = (lane) => lane * LANE_W + LANE_W / 2 - PLAYER_SIZE / 2;

const EndlessRunner = () => {
  const colors = useStudioColors();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const [frame, setFrame] = useState({
    lane: 1,
    jumping: false,
    obstacles: [],
    coins: [],
  });

  const gameRef = useRef({
    raf: null,
    started: 0,
    last: 0,
    lane: 1,
    jumping: false,
    jumpUntil: 0,
    obstacles: [],
    coins: [],
    nextSpawn: 0,
    bonus: 0,
  });
  const pointerStart = useRef(null);

  const start = () => {
    if (gameRef.current.raf) cancelAnimationFrame(gameRef.current.raf);
    gameRef.current = {
      raf: null,
      started: performance.now(),
      last: performance.now(),
      lane: 1,
      jumping: false,
      jumpUntil: 0,
      obstacles: [],
      coins: [],
      nextSpawn: 0,
      bonus: 0,
    };
    setFrame({ lane: 1, jumping: false, obstacles: [], coins: [] });
    setScore(0);
    setStatus("playing");
    setRunning(true);
  };

  const changeLane = (delta) => {
    if (status !== "playing") return;
    gameRef.current.lane = Math.max(
      0,
      Math.min(LANES - 1, gameRef.current.lane + delta),
    );
  };
  const jump = () => {
    if (status !== "playing" || gameRef.current.jumping) return;
    gameRef.current.jumping = true;
    gameRef.current.jumpUntil = performance.now() + JUMP_MS;
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (["ArrowLeft", "a", "A"].includes(event.key)) {
        event.preventDefault();
        changeLane(-1);
      } else if (["ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        changeLane(1);
      } else if (["ArrowUp", "w", "W", " "].includes(event.key)) {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (!running) return undefined;
    const tick = (now) => {
      const game = gameRef.current;
      if (document.hidden) {
        game.last = now;
        game.raf = requestAnimationFrame(tick);
        return;
      }
      const delta = Math.min(50, now - game.last);
      game.last = now;
      const elapsed = now - game.started;
      const speed = Math.min(MAX_SPEED, BASE_SPEED + elapsed / SPEED_RAMP);

      if (game.jumping && now > game.jumpUntil) game.jumping = false;

      game.nextSpawn -= delta;
      if (game.nextSpawn <= 0) {
        const lane = Math.floor(Math.random() * LANES);
        const isHurdle = Math.random() < 0.45;
        game.obstacles.push({
          id: now + Math.random(),
          lane,
          y: -40,
          type: isHurdle ? "hurdle" : "block",
        });
        if (Math.random() < 0.5) {
          const coinLane = (lane + 1 + Math.floor(Math.random() * 2)) % LANES;
          game.coins.push({
            id: now + Math.random() + 1,
            lane: coinLane,
            y: -90,
          });
        }
        game.nextSpawn = Math.max(MIN_SPAWN_MS, INITIAL_SPAWN_MS - elapsed / 55);
      }

      game.obstacles = game.obstacles
        .map((o) => ({ ...o, y: o.y + (speed * delta) / 1000 }))
        .filter((o) => o.y < HEIGHT + 40);
      game.coins = game.coins
        .map((c) => ({ ...c, y: c.y + (speed * delta) / 1000 }))
        .filter((c) => c.y < HEIGHT + 40);

      game.coins = game.coins.filter((coin) => {
        const collected =
          coin.lane === game.lane &&
          coin.y > GROUND_Y - 20 &&
          coin.y < GROUND_Y + PLAYER_SIZE;
        if (collected) game.bonus += 5;
        return !collected;
      });

      const collided = game.obstacles.some((o) => {
        if (o.lane !== game.lane) return false;
        const overlapsY = o.y + 26 > GROUND_Y && o.y < GROUND_Y + PLAYER_SIZE;
        if (!overlapsY) return false;
        if (o.type === "hurdle" && game.jumping) return false;
        return true;
      });

      const nextScore = Math.floor(elapsed / 100) + game.bonus;
      setFrame({
        lane: game.lane,
        jumping: game.jumping,
        obstacles: [...game.obstacles],
        coins: [...game.coins],
      });
      setScore(nextScore);

      if (collided) {
        cancelAnimationFrame(game.raf);
        game.raf = null;
        setRunning(false);
        setStatus("over");
        setBest((current) => {
          if (nextScore <= current) return current;
          try {
            window.localStorage.setItem(BEST_KEY, String(nextScore));
          } catch {
            // storage unavailable, ignore
          }
          return nextScore;
        });
        return;
      }
      game.raf = requestAnimationFrame(tick);
    };
    gameRef.current.raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(gameRef.current.raf);
      gameRef.current.raf = null;
    };
  }, [running]);

  useEffect(
    () => () =>
      gameRef.current.raf && cancelAnimationFrame(gameRef.current.raf),
    [],
  );

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerMove = (event) => {
    if (!pointerStart.current || status !== "playing") return;
    event.preventDefault();
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      return;
    }
    if (Math.abs(dy) > Math.abs(dx) * 1.15 && dy < -SWIPE_THRESHOLD) {
      jump();
      pointerStart.current = { x: event.clientX, y: event.clientY };
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) * 1.15 && Math.abs(dx) >= SWIPE_THRESHOLD) {
      changeLane(dx > 0 ? 1 : -1);
      pointerStart.current = { x: event.clientX, y: event.clientY };
    }
  };
  const handlePointerUp = (event) => {
    event.preventDefault();
    pointerStart.current = null;
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Endless Runner
          </Text>
          <Text mt={1} fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
            Switch lanes, jump hurdles, grab coins.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
              SCORE
            </Text>
            <Text fontWeight="800">{score}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
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
          userSelect="none"
          sx={{
            touchAction: "none",
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
          {[1, 2].map((line) => (
            <Box
              key={line}
              position="absolute"
              left={`${line * LANE_W}px`}
              top={0}
              bottom={0}
              w="1px"
              bg={colors.border}
              opacity={0.6}
            />
          ))}
          {frame.obstacles.map((o) => (
            <Box
              key={o.id}
              position="absolute"
              left={`${laneCenterX(o.lane)}px`}
              top={`${o.y}px`}
              w={`${PLAYER_SIZE}px`}
              h={o.type === "hurdle" ? "18px" : "28px"}
              bg={o.type === "hurdle" ? "#ffca3a" : "#ff6b6b"}
              border="2px solid"
              borderColor={colors.text}
            />
          ))}
          {frame.coins.map((c) => (
            <Box
              key={c.id}
              position="absolute"
              left={`${laneCenterX(c.lane) + 9}px`}
              top={`${c.y}px`}
              w="16px"
              h="16px"
              borderRadius="full"
              bg="#ffd166"
              border="2px solid"
              borderColor={colors.text}
            />
          ))}
          <Box
            position="absolute"
            left={`${laneCenterX(frame.lane)}px`}
            top={`${frame.jumping ? GROUND_Y - 34 : GROUND_Y}px`}
            w={`${PLAYER_SIZE}px`}
            h={`${PLAYER_SIZE}px`}
            bg="#00f5d4"
            border="3px solid"
            borderColor={colors.text}
            transition="left .12s ease, top .1s ease"
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
              <Text mt={2} fontSize={{ base: "14px", md: "15px" }}>
                {status === "idle"
                  ? "Swipe left/right to switch lanes, swipe up to jump."
                  : `You scored ${score}.`}
              </Text>
            </Flex>
          )}
        </Box>
        <Text mt={3} textAlign="center" fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
          A/D or arrows to switch lanes, Space or W/up to jump.
        </Text>
        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            variant="studio"
            isDisabled={status === "playing"}
            color={colors.surfaceAlt}
            bg={colors.text}
            border="2px solid"
            borderColor={colors.text}
            _hover={{ bg: colors.text }}
            _disabled={{
              opacity: 1,
              cursor: "default",
              color: colors.surfaceAlt,
              bg: colors.text,
              borderColor: colors.text,
            }}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing"
              ? "Running"
              : status === "idle"
                ? "Start run"
                : "Run again"}
          </Button>
          {status === "playing" && (
            <Button
              onClick={jump}
              variant="studioGhost"
              leftIcon={<ArrowUp size={14} />}
            >
              Jump
            </Button>
          )}
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
export default EndlessRunner;