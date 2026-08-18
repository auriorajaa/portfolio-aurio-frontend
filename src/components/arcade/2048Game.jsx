import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";

const SIZE = 4;
const BEST_KEY = "arcade:2048:best";
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
  const [board, setBoard] = useState(newGame);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const [status, setStatus] = useState("playing");
  const pointerRef = useRef(null);

  const restart = () => {
    setBoard(newGame());
    setScore(0);
    setStatus("playing");
  };

  const move = (direction) => {
    if (status === "over") return;
    const result = moveBoard(board, direction);
    if (!result.changed) {
      if (!canMove(board)) setStatus("over");
      return;
    }
    const nextScore = score + result.score;
    setBoard(result.board);
    setScore(nextScore);
    setBest((current) => {
      if (nextScore <= current) return current;
      try {
        window.localStorage.setItem(BEST_KEY, String(nextScore));
      } catch {
        // storage unavailable, ignore
      }
      return nextScore;
    });
    if (result.board.flat().includes(2048)) setStatus("won");
    else if (!canMove(result.board)) setStatus("over");
  };

  useEffect(() => {
    const handleKey = (event) => {
      const keys = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      if (keys[event.key]) {
        event.preventDefault();
        move(keys[event.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const beginPointer = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };
  const endPointer = (event) => {
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
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            2048 Mini
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            Swipe or drag to join the tiles.
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
      <Box maxW="430px" mx="auto">
        <Box
          bg={colors.surface}
          p={{ base: 2, md: 3 }}
          border="1px solid"
          borderColor={colors.border}
          touchAction="none"
          userSelect="none"
          onPointerDown={beginPointer}
          onPointerUp={endPointer}
          onPointerCancel={() => {
            pointerRef.current = null;
          }}
        >
          <SimpleGrid columns={4} gap={{ base: 1.5, md: 2 }}>
            {board.flat().map((value, index) => {
              const palette = tileColors[value] || ["#22304a", "#ffffff"];
              return (
                <Flex
                  key={index}
                  aspectRatio="1"
                  align="center"
                  justify="center"
                  border="1px solid"
                  borderColor={value ? "transparent" : colors.border}
                  bg={value ? palette[0] : colors.surface}
                  color={value ? palette[1] : colors.muted}
                  fontSize={{ base: "20px", md: "28px" }}
                  fontWeight="800"
                  transition="background .16s, transform .16s"
                  transform={value ? "scale(.96)" : "scale(1)"}
                >
                  {value || ""}
                </Flex>
              );
            })}
          </SimpleGrid>
        </Box>
        <Text mt={3} textAlign="center" fontSize="12px" color={colors.muted}>
          Use arrow keys, swipe, or drag.
        </Text>
        {status !== "playing" && (
          <Box
            mt={4}
            p={4}
            border="1px solid"
            borderColor={colors.border}
            textAlign="center"
          >
            <Text fontWeight="800">
              {status === "won" ? "You win" : "Game over"}
            </Text>
            <Text mt={1} fontSize="13px" color={colors.muted}>
              {status === "won"
                ? "Nice work. Keep going if you want."
                : "No more moves."}
            </Text>
          </Box>
        )}
        <Button
          mt={5}
          onClick={restart}
          variant="studioGhost"
          leftIcon={<RotateCcw size={14} />}
        >
          Restart
        </Button>
      </Box>
    </Box>
  );
};
export default Game2048;