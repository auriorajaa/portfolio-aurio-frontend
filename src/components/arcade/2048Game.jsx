import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Grid, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useStudioColors } from "../public/studio";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const SIZE = 4;
const emptyBoard = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
const copyBoard = (board) => board.map((row) => [...row]);

const addTile = (board) => {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((value, c) => !value && empty.push([r, c])),
  );
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
};

const newGame = () => addTile(addTile(emptyBoard()));

// Head-Start perk: begin with a bonus 64 tile already on the board.
const newGameWith64 = () => {
  const board = newGame();
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((value, c) => !value && empty.push([r, c])),
  );
  if (empty.length) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = 64;
  }
  return board;
};
const transpose = (board) => board[0].map((_, c) => board.map((row) => row[c]));
const reverse = (board) => board.map((row) => [...row].reverse());

const slideRow = (row) => {
  const values = row.filter(Boolean);
  const result = [];
  let score = 0;
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] === values[i + 1]) {
      result.push(values[i] * 2);
      score += values[i] * 2;
      i += 1;
    } else result.push(values[i]);
  }
  while (result.length < SIZE) result.push(0);
  return { row: result, score };
};

const moveBoard = (board, direction) => {
  let working = copyBoard(board);
  if (direction === "up" || direction === "down") working = transpose(working);
  if (direction === "right" || direction === "down") working = reverse(working);
  let gained = 0;
  working = working.map((row) => {
    const next = slideRow(row);
    gained += next.score;
    return next.row;
  });
  if (direction === "right" || direction === "down") working = reverse(working);
  if (direction === "up" || direction === "down") working = transpose(working);
  const changed = JSON.stringify(board) !== JSON.stringify(working);
  return { board: changed ? addTile(working) : board, score: gained, changed };
};

const canMove = (board) =>
  ["up", "down", "left", "right"].some(
    (direction) => moveBoard(board, direction).changed,
  );

const tileColors = {
  2: ["#fff4c2", "#403a1f"],
  4: ["#ffd166", "#40301a"],
  8: ["#ff9f68", "#401f16"],
  16: ["#ff6b6b", "#fff5f0"],
  32: ["#f15bb5", "#fff5fb"],
  64: ["#9b5de5", "#fff8ff"],
  128: ["#5f6fff", "#ffffff"],
  256: ["#00bbf9", "#06202a"],
  512: ["#00f5d4", "#062a25"],
  1024: ["#8ac926", "#132a12"],
  2048: ["#ffca3a", "#382b00"],
};

const Game2048 = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("2048"));
  const candyTiles = shop?.skin?.tiles || null;
  const candyPalette = (value) => (candyTiles && candyTiles[value]) || null;
  const headStart = Boolean(shop?.perks?.["2048HeadStart"]);
  const [board, setBoard] = useState(() => (headStart ? newGameWith64() : newGame()));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.["2048"]?.best || 0;
  });
  const [status, setStatus] = useState("playing");
  const pointerRef = useRef(null);
  const winCelebrated = useRef(false);

  const restart = (e) => {
    if (e) e.stopPropagation();
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("2048");
    winCelebrated.current = false;
    setBoard(headStart ? newGameWith64() : newGame());
    setScore(0);
    setStatus("playing");
  };

  const endGame = (nextStatus) => {
    if (status === "over" || status === "won") return;
    setStatus(nextStatus);
    arcadeAudio.stopBgm({ fade: true });
    if (nextStatus === "won") {
      arcadeAudio.playWin();
      arcadeHaptics.success();
    } else {
      arcadeAudio.playHit();
      arcadeHaptics.danger();
    }
  };

  const move = (direction) => {
    if (status === "over") return;
    // Reaching 2048 is a milestone, not a dead end — keep the run going.
    if (status === "won") {
      arcadeAudio.startBgm("2048");
      setStatus("playing");
    }
    const result = moveBoard(board, direction);
    if (!result.changed) {
      if (!canMove(board)) {
        endGame("over");
      }
      return;
    }

    if (result.score > 0) {
      arcadeAudio.playScore();
      arcadeHaptics.light();
    } else {
      arcadeAudio.playMove();
    }

    const nextScore = score + result.score;
    setBoard(result.board);
    setScore(nextScore);

    setBest((current) => {
      const next = Math.max(current, nextScore);
      recordGameSession("2048", next);
      return next;
    });

    if (result.board.flat().includes(2048) && !winCelebrated.current) {
      winCelebrated.current = true;
      endGame("won");
    } else if (!canMove(result.board)) {
      endGame("over");
    }
  };

  useEffect(() => {
    const handleKey = (event) => {
      const keys = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
      };
      if (keys[event.key]) {
        event.preventDefault();
        move(keys[event.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(
    () => () => {
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const beginPointer = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const endPointer = (event) => {
    event.preventDefault();
    if (!pointerRef.current) return;
    const dx = event.clientX - pointerRef.current.x;
    const dy = event.clientY - pointerRef.current.y;
    pointerRef.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  };

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              2048 Mini
            </Text>
            <Box px={2} py={0.5} bg="#ffca3a" color="#171717" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Puzzle Grid
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Join like numbers to reach the legendary 2048 tile!
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
          bg={colors.surface}
          p={{ base: 2, md: 3 }}
          border="2px solid"
          borderColor={colors.border}
          userSelect="none"
          sx={{
            touchAction: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
          }}
          onPointerDown={beginPointer}
          onPointerUp={endPointer}
          onPointerCancel={() => {
            pointerRef.current = null;
          }}
        >
          <SimpleGrid columns={4} gap={{ base: 1.5, md: 2.5 }}>
            {board.flat().map((value, index) => {
              const palette = candyPalette(value) || tileColors[value] || ["#22304a", "#ffffff"];
              const digits = String(value).length;
              return (
                <Flex
                  key={index}
                  aspectRatio="1"
                  align="center"
                  justify="center"
                  border="1px solid"
                  borderColor={value ? "transparent" : colors.border}
                  bg={value ? palette[0] : colors.surfaceAlt}
                  color={value ? palette[1] : colors.muted}
                  fontSize={
                    digits >= 4
                      ? { base: "14px", sm: "16px", md: "20px" }
                      : digits === 3
                        ? { base: "16px", sm: "20px", md: "24px" }
                        : { base: "20px", sm: "24px", md: "30px" }
                  }
                  fontWeight="900"
                  transition="background .15s, transform .15s"
                  transform={value ? "scale(.96)" : "scale(1)"}
                  boxShadow={value >= 128 ? `0 0 10px ${palette[0]}88` : "none"}
                >
                  {value || ""}
                </Flex>
              );
            })}
          </SimpleGrid>
        </Box>

        {/* Mobile touch arrow pad */}
        <Box mt={4} display={{ base: "block", md: "none" }}>
          <Text textAlign="center" fontSize="11px" fontWeight="800" color={colors.muted} mb={2} textTransform="uppercase" letterSpacing="0.05em">
            Touch Navigation
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={2} maxW="210px" mx="auto">
            <Box />
            <Button
              size="md"
              h="48px"
              bg={colors.surface}
              border="2px solid"
              borderColor={colors.border}
              onClick={() => move("up")}
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
              onClick={() => move("left")}
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
              onClick={() => move("down")}
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
              onClick={() => move("right")}
              aria-label="Right"
            >
              <ArrowRight size={22} />
            </Button>
          </Grid>
        </Box>

        <Text mt={3} textAlign="center" fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
          Use arrow keys, WASD, swipe, or touch arrows.
        </Text>

        {status !== "playing" && (
          <Box
            mt={4}
            p={4}
            border="2px solid"
            borderColor={status === "won" ? "#ffca3a" : "#ff6b6b"}
            bg={colors.surface}
            textAlign="center"
          >
            {status === "won" ? (
              <Trophy size={36} color="#ffca3a" style={{ margin: "0 auto" }} />
            ) : null}
            <Text fontWeight="800" fontSize="18px" mt={1}>
              {status === "won" ? "2048 Reached! You Win!" : "No More Moves!"}
            </Text>
            <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
              {status === "won"
                ? "Legendary run! You can keep playing to push for higher scores."
                : "The grid is locked. Give it another shot!"}
            </Text>
            <Button
              mt={3}
              size="sm"
              bg={status === "won" ? "#ffca3a" : "#00f5d4"}
              color="#171717"
              fontWeight="800"
              leftIcon={<RotateCcw size={14} />}
              onPointerDown={restart}
              onClick={restart}
            >
              Play Again
            </Button>
          </Box>
        )}

        <HStack justify="center" mt={4}>
          <Button
            onClick={restart}
            variant="studioGhost"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
          >
            Restart
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Game2048;