import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { Play, RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";

const WIDTH = 320;
const HEIGHT = 360;
const ROUND = 20000;
const BEST_KEY = "arcade:dodge:best";

const ReactionDodge = () => {
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
  const [time, setTime] = useState(20);
  const [frame, setFrame] = useState({ player: 140, blocks: [] });
  const gameRef = useRef({
    raf: null,
    started: 0,
    last: 0,
    player: 140,
    blocks: [],
    nextBlock: 0,
  });
  const pointerActive = useRef(false);

  const start = () => {
    if (gameRef.current.raf) cancelAnimationFrame(gameRef.current.raf);
    gameRef.current = {
      ...gameRef.current,
      started: performance.now(),
      last: performance.now(),
      player: 140,
      blocks: [],
      nextBlock: 0,
    };
    setFrame({ player: 140, blocks: [] });
    setScore(0);
    setTime(20);
    setStatus("playing");
    setRunning(true);
  };

  const moveTo = (clientX, element) => {
    if (status !== "playing") return;
    const rect = element.getBoundingClientRect();
    const next = Math.max(
      10,
      Math.min(WIDTH - 42, (clientX - rect.left) * (WIDTH / rect.width) - 16),
    );
    gameRef.current.player = next;
    setFrame((current) => ({ ...current, player: next }));
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (gameRef.current.raf === null) return;
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        event.preventDefault();
        gameRef.current.player = Math.max(10, gameRef.current.player - 28);
      }
      if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        event.preventDefault();
        gameRef.current.player = Math.min(
          WIDTH - 42,
          gameRef.current.player + 28,
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
      game.nextBlock -= delta;
      if (game.nextBlock <= 0) {
        game.blocks.push({
          id: now,
          x: Math.random() * (WIDTH - 34),
          y: -28,
          size: 24 + Math.random() * 14,
          speed: 90 + elapsed / 180,
        });
        game.nextBlock = Math.max(260, 760 - elapsed / 35);
      }
      game.blocks = game.blocks
        .map((block) => ({
          ...block,
          y: block.y + (block.speed * delta) / 1000,
        }))
        .filter((block) => block.y < HEIGHT + 40);
      const hit = game.blocks.some(
        (block) =>
          block.x < game.player + 32 &&
          block.x + block.size > game.player &&
          block.y + block.size > HEIGHT - 44 &&
          block.y < HEIGHT - 8,
      );
      setFrame({ player: game.player, blocks: [...game.blocks] });
      const nextScore = Math.floor(elapsed / 100);
      setScore(nextScore);
      setTime(Math.max(0, Math.ceil((ROUND - elapsed) / 1000)));
      if (hit || elapsed >= ROUND) {
        cancelAnimationFrame(game.raf);
        game.raf = null;
        setRunning(false);
        setStatus(hit ? "over" : "finished");
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
    pointerActive.current = true;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    moveTo(event.clientX, event.currentTarget);
  };
  const handlePointerMove = (event) => {
    if (pointerActive.current) { event.preventDefault(); moveTo(event.clientX, event.currentTarget); }
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Reaction Dodge
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            Drag the block. Stay clear for 20 seconds.
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
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              TIME
            </Text>
            <Text fontWeight="800">{time}s</Text>
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
          <Box
            position="absolute"
            left={`${frame.player}px`}
            bottom="16px"
            w="32px"
            h="32px"
            bg="#00f5d4"
            border="3px solid"
            borderColor={colors.text}
            transition="left .03s linear"
          />
          {frame.blocks.map((block) => (
            <Box
              key={block.id}
              position="absolute"
              left={`${block.x}px`}
              top={`${block.y}px`}
              w={`${block.size}px`}
              h={`${block.size}px`}
              bg="#ff6b6b"
              border="2px solid"
              borderColor={colors.text}
            />
          ))}
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
                  : status === "finished"
                    ? "You made it"
                    : "Game over"}
              </Text>
              <Text mt={2} fontSize="13px">
                {status === "idle"
                  ? "Drag left and right to move."
                  : status === "finished"
                    ? `Clean run. Score ${score}.`
                    : `That block got you. Score ${score}.`}
              </Text>
            </Flex>
          )}
        </Box>
        <Text mt={3} textAlign="center" fontSize="12px" color={colors.muted}>
          Drag with your finger or mouse. Use A/D on desktop.
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
          {status !== "idle" && status !== "playing" && (
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
export default ReactionDodge;