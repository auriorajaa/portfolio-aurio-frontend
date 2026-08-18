import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { Circle, RotateCcw, X as XIcon } from "lucide-react";
import { useStudioColors } from "../public/studio";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const SCORE_KEY = "arcade:tictactoe:score";
const emptyBoard = () => Array(9).fill(null);

const getWinner = (board) => {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { mark: "draw", line: [] };
  return null;
};

const minimax = (board, depth, isMax) => {
  const result = getWinner(board);
  if (result?.mark === "O") return 10 - depth;
  if (result?.mark === "X") return depth - 10;
  if (result?.mark === "draw") return 0;
  let best = isMax ? -Infinity : Infinity;
  board.forEach((cell, i) => {
    if (cell) return;
    board[i] = isMax ? "O" : "X";
    const score = minimax(board, depth + 1, !isMax);
    board[i] = null;
    best = isMax ? Math.max(best, score) : Math.min(best, score);
  });
  return best;
};

const bestMove = (board) => {
  let move = null;
  let bestScore = -Infinity;
  board.forEach((cell, i) => {
    if (cell) return;
    board[i] = "O";
    const score = minimax(board, 0, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  });
  return move;
};

const randomMove = (board) => {
  const options = board
    .map((cell, i) => (cell ? null : i))
    .filter((i) => i !== null);
  return options[Math.floor(Math.random() * options.length)];
};

const TicTacToe = () => {
  const colors = useStudioColors();
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("hard");
  const [thinking, setThinking] = useState(false);
  const [score, setScore] = useState(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(SCORE_KEY));
      return stored && typeof stored === "object"
        ? { wins: 0, losses: 0, draws: 0, ...stored }
        : { wins: 0, losses: 0, draws: 0 };
    } catch {
      return { wins: 0, losses: 0, draws: 0 };
    }
  });
  const timer = useRef(null);

  const saveScore = (next) => {
    setScore(next);
    try {
      window.localStorage.setItem(SCORE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable, ignore
    }
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setBoard(emptyBoard());
    setTurn("X");
    setResult(null);
    setThinking(false);
  };

  const place = (index) => {
    if (result || thinking || board[index] || turn !== "X") return;
    const next = [...board];
    next[index] = "X";
    setBoard(next);
    const outcome = getWinner(next);
    if (outcome) {
      setResult(outcome);
      return;
    }
    setTurn("O");
  };

  useEffect(() => {
    if (turn !== "O" || result) return undefined;
    setThinking(true);
    timer.current = window.setTimeout(() => {
      setBoard((current) => {
        const useRandom = difficulty === "easy" && Math.random() < 0.65;
        const working = [...current];
        const move = useRandom ? randomMove(working) : bestMove(working);
        if (move === null || move === undefined) return current;
        working[move] = "O";
        const outcome = getWinner(working);
        if (outcome) setResult(outcome);
        else setTurn("X");
        return working;
      });
      setThinking(false);
    }, 450);
    return () => window.clearTimeout(timer.current);
  }, [turn, result, difficulty]);

  useEffect(() => {
    if (!result) return;
    if (result.mark === "draw") {
      saveScore({ ...score, draws: score.draws + 1 });
    } else if (result.mark === "X") {
      saveScore({ ...score, wins: score.wins + 1 });
    } else if (result.mark === "O") {
      saveScore({ ...score, losses: score.losses + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Tic-Tac-Toe
          </Text>
          <Text mt={1} fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
            You're X. The computer plays O.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
              WINS
            </Text>
            <Text fontWeight="800">{score.wins}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
              LOSSES
            </Text>
            <Text fontWeight="800">{score.losses}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
              DRAWS
            </Text>
            <Text fontWeight="800">{score.draws}</Text>
          </Box>
        </HStack>
      </HStack>

      <HStack justify="center" mb={4} spacing={2}>
        {["easy", "hard"].map((level) => (
          <Button
            key={level}
            onClick={() => {
              setDifficulty(level);
              reset();
            }}
            size="sm"
            variant={difficulty === level ? "studio" : "studioGhost"}
          >
            {level === "easy" ? "Easy" : "Unbeatable"}
          </Button>
        ))}
      </HStack>

      <Box maxW={{ base: "100%", md: "500px", xl: "600px" }} mx="auto">
        <Box position="relative">
          <SimpleGrid columns={3} gap={2}>
            {board.map((cell, index) => {
              const isWinning = result?.line?.includes(index);
              return (
                <Flex
                  key={index}
                  as="button"
                  onClick={() => place(index)}
                  aspectRatio="1"
                  align="center"
                  justify="center"
                  bg={isWinning ? colors.text : colors.surface}
                  border="1px solid"
                  borderColor={colors.border}
                  cursor={cell || result || thinking ? "default" : "pointer"}
                  transition="background .15s"
                >
                  {cell === "X" && (
                    <XIcon
                      size={58}
                      strokeWidth={3}
                      color={isWinning ? colors.surfaceAlt : "#00f5d4"}
                    />
                  )}
                  {cell === "O" && (
                    <Circle
                      size={54}
                      strokeWidth={3}
                      color={isWinning ? colors.surfaceAlt : "#ff6b6b"}
                    />
                  )}
                </Flex>
              );
            })}
          </SimpleGrid>
          {result && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              bg={colors.overlay}
              color={colors.surfaceAlt}
              direction="column"
              p={4}
              textAlign="center"
            >
              <Text fontWeight="800" fontSize="20px">
                {result.mark === "draw"
                  ? "Draw"
                  : result.mark === "X"
                    ? "You win"
                    : "Computer wins"}
              </Text>
              <Text mt={1} fontSize={{ base: "14px", md: "15px" }}>
                {result.mark === "draw"
                  ? "Nobody gets the line."
                  : result.mark === "X"
                    ? "Nicely played."
                    : "Try again."}
              </Text>
            </Flex>
          )}
        </Box>
        <Text mt={3} textAlign="center" fontSize={{ base: "14px", md: "15px" }} color={colors.muted} minH="16px">
          {!result && thinking ? "Computer is thinkingâ€¦" : "\u00A0"}
        </Text>
        <HStack justify="center" mt={2}>
          <Button
            onClick={reset}
            variant="studioGhost"
            leftIcon={<RotateCcw size={14} />}
          >
            New game
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
export default TicTacToe;