import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { Circle, RotateCcw, X as XIcon, Sparkles, Trophy } from "lucide-react";
import { useStudioColors } from "../public/studio";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

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

// Coach hint: a safe spot for the player — immediate win, block, center, then corners.
const suggestedMove = (board) => {
  const findFor = (mark) => {
    for (let i = 0; i < 9; i += 1) {
      if (board[i]) continue;
      const test = [...board];
      test[i] = mark;
      if (getWinner(test)) return i;
    }
    return null;
  };
  const win = findFor("X");
  if (win !== null) return win;
  const block = findFor("O");
  if (block !== null) return block;
  if (!board[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !board[i]);
  if (corners.length) return corners[0];
  return board.findIndex((cell) => !cell);
};

const TicTacToe = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("tictactoe"));
  const palette = shop?.skin?.colors;
  const pColor = palette?.p || "#00f5d4";
  const sColor = palette?.s || "#ff6b6b";
  const hasHint = Boolean(shop?.perks?.tttHint);
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("hard");
  const [thinking, setThinking] = useState(false);
  const [score, setScore] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.tictactoe || { wins: 0, losses: 0, draws: 0 };
  });
  const timer = useRef(null);

  const reset = (e) => {
    if (e) e.stopPropagation();
    if (timer.current) window.clearTimeout(timer.current);
    arcadeAudio.playClick();
    arcadeAudio.startBgm("tictactoe");
    setBoard(emptyBoard());
    setTurn("X");
    setResult(null);
    setThinking(false);
  };

  const place = (index) => {
    if (result || thinking || board[index] || turn !== "X") return;
    arcadeAudio.playClick();
    arcadeHaptics.light();
    const next = [...board];
    next[index] = "X";
    setBoard(next);
    const outcome = getWinner(next);
    if (outcome) {
      setResult(outcome);
      handleOutcome(outcome);
      return;
    }
    setTurn("O");
  };

  const handleOutcome = (outcome) => {
    arcadeAudio.stopBgm({ fade: true });
    let nextScore = { ...score };
    if (outcome.mark === "X") {
      nextScore.wins += 1;
      arcadeAudio.playWin();
      arcadeHaptics.success();
    } else if (outcome.mark === "O") {
      nextScore.losses += 1;
      arcadeAudio.playHit();
      arcadeHaptics.danger();
    } else {
      nextScore.draws += 1;
      arcadeAudio.playMove();
      arcadeHaptics.medium();
    }
    setScore(nextScore);
    recordGameSession("tictactoe", nextScore);
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
        arcadeAudio.playMove();
        arcadeHaptics.light();
        const outcome = getWinner(working);
        if (outcome) {
          setResult(outcome);
          handleOutcome(outcome);
        } else {
          setTurn("X");
        }
        return working;
      });
      setThinking(false);
    }, 450);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, result, difficulty]);

  useEffect(
    () => () => {
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const hintIndex =
    hasHint && !result && !thinking && turn === "X"
      ? suggestedMove(board)
      : null;

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Tic-Tac-Toe
            </Text>
            {difficulty === "hard" && (
              <Box px={2} py={0.5} bg="#ff6b6b" color="#fff" fontSize="10px" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                Master AI
              </Box>
            )}
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            You are X. The computer is O.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              WINS
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#00f5d4">
              {score.wins}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              LOSSES
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ff6b6b">
              {score.losses}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              DRAWS
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffca3a">
              {score.draws}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <HStack justify="center" mb={5} spacing={2}>
        {[
          { id: "easy", label: "Casual" },
          { id: "hard", label: "Unbeatable" },
        ].map((item) => (
          <Button
            key={item.id}
            onClick={() => {
              arcadeAudio.playClick();
              setDifficulty(item.id);
              reset();
            }}
            size="sm"
            fontSize="12px"
            fontWeight="800"
            border="2px solid"
            borderColor={difficulty === item.id ? "#00f5d4" : colors.border}
            bg={difficulty === item.id ? "#00f5d4" : colors.surface}
            color={difficulty === item.id ? "#171717" : colors.text}
            _hover={{ borderColor: "#00f5d4" }}
          >
            {item.label}
          </Button>
        ))}
      </HStack>

      <Box maxW={{ base: "100%", sm: "360px", md: "420px" }} mx="auto">
        <Box position="relative" p={1} bg={colors.surface} border="2px solid" borderColor={colors.border}>
          <SimpleGrid columns={3} gap={2}>
            {board.map((cell, index) => {
              const isWinning = result?.line?.includes(index);
              return (
                <Flex
                  key={index}
                  as="button"
                  aria-label={`Cell ${index + 1}: ${cell || "empty"}`}
                  onClick={() => place(index)}
                  aspectRatio="1"
                  align="center"
                  justify="center"
                  bg={isWinning ? "#1b2140" : colors.surfaceAlt}
                  border="2px solid"
                  borderColor={isWinning ? pColor : colors.border}
                  cursor={cell || result || thinking ? "default" : "pointer"}
                  transition="all .18s ease"
                  boxShadow={isWinning ? `0 0 12px ${pColor}66` : "none"}
                  transform={isWinning ? "scale(1.02)" : "none"}
                  _hover={
                    !cell && !result && !thinking
                      ? { borderColor: pColor, bg: colors.surface }
                      : {}
                  }
                >
                  {cell === "X" && (
                    <XIcon
                      size={48}
                      strokeWidth={3.5}
                      color={pColor}
                    />
                  )}
                  {cell === "O" && (
                    <Circle
                      size={44}
                      strokeWidth={3.5}
                      color={sColor}
                    />
                  )}
                  {hintIndex === index && !cell && (
                    <Box
                      w="34%"
                      aspectRatio="1"
                      borderRadius="full"
                      border="3px dashed"
                      borderColor={pColor}
                      opacity={0.55}
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
              p={5}
              textAlign="center"
              backdropFilter="blur(2px)"
            >
              {result.mark === "X" ? (
                <Trophy size={42} color="#00f5d4" />
              ) : result.mark === "O" ? (
                <Circle size={42} color="#ff6b6b" />
              ) : (
                <Sparkles size={42} color="#ffca3a" />
              )}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {result.mark === "draw"
                  ? "Draw Match!"
                  : result.mark === "X"
                    ? "You Win!"
                    : "Computer Wins!"}
              </Text>
              <Text mt={1} fontSize="13px" opacity={0.85}>
                {result.mark === "draw"
                  ? "Evenly matched."
                  : result.mark === "X"
                    ? "Great strategy."
                    : "The algorithm prevails. Try again!"}
              </Text>
              <Button
                mt={4}
                size="sm"
                onClick={reset}
                bg="#00f5d4"
                color="#171717"
                fontWeight="800"
                _hover={{ bg: "#8ac926" }}
                leftIcon={<RotateCcw size={14} />}
              >
                Play Again
              </Button>
            </Flex>
          )}
        </Box>

        <Text
          mt={3}
          textAlign="center"
          fontSize="13px"
          fontWeight="700"
          color={colors.muted}
          minH="20px"
        >
          {!result && thinking ? "Computer is thinking..." : !result ? "Your turn (X)" : ""}
        </Text>

        <HStack justify="center" mt={2}>
          <Button
            onClick={reset}
            variant="studioGhost"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
          >
            New Game
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default TicTacToe;