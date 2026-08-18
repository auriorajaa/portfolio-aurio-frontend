import React, { useRef, useState } from "react";
import { Box, Button, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";

const SCORE_KEY = "arcade:rps:score";
const CHOICES = [
  { id: "rock", label: "Rock", emoji: "\u270A", beats: "scissors", color: "#ff6b6b" },
  { id: "paper", label: "Paper", emoji: "\u270B", beats: "rock", color: "#00bbf9" },
  { id: "scissors", label: "Scissors", emoji: "\u270C\uFE0F", beats: "paper", color: "#ffca3a" },
];
const byId = Object.fromEntries(CHOICES.map((choice) => [choice.id, choice]));

const pickNpcMove = (history) => {
  if (history.length < 3 || Math.random() < 0.35) {
    return CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
  }
  const tally = { rock: 0, paper: 0, scissors: 0 };
  history.slice(-6).forEach((entry) => {
    tally[entry] += 1;
  });
  const likely = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  return byId[byId[likely].beats].id === likely
    ? likely
    : CHOICES.find((choice) => choice.beats === likely).id;
};

const judge = (player, npc) => {
  if (player === npc) return "tie";
  return byId[player].beats === npc ? "win" : "lose";
};

const RockPaperScissors = () => {
  const colors = useStudioColors();
  const [playerHistory, setPlayerHistory] = useState([]);
  const [round, setRound] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(SCORE_KEY));
      return stored && typeof stored === "object"
        ? { wins: 0, losses: 0, ties: 0, ...stored }
        : { wins: 0, losses: 0, ties: 0 };
    } catch {
      return { wins: 0, losses: 0, ties: 0 };
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
    setRound(null);
    setLocked(false);
  };

  const play = (playerId) => {
    if (locked) return;
    setLocked(true);
    setRound({ player: playerId, npc: null, verdict: null });
    const nextHistory = [...playerHistory, playerId].slice(-12);
    timer.current = window.setTimeout(() => {
      const npcId = pickNpcMove(playerHistory);
      const verdict = judge(playerId, npcId);
      setRound({ player: playerId, npc: npcId, verdict });
      setPlayerHistory(nextHistory);
      if (verdict === "win") saveScore({ ...score, wins: score.wins + 1 });
      else if (verdict === "lose")
        saveScore({ ...score, losses: score.losses + 1 });
      else saveScore({ ...score, ties: score.ties + 1 });
      setLocked(false);
    }, 550);
  };

  const verdictCopy = {
    win: "You win this round",
    lose: "Computer wins this round",
    tie: "It's a tie",
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Rock Paper Scissors
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            The computer learns your habits. Try to stay unpredictable.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              WINS
            </Text>
            <Text fontWeight="800">{score.wins}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              LOSSES
            </Text>
            <Text fontWeight="800">{score.losses}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              TIES
            </Text>
            <Text fontWeight="800">{score.ties}</Text>
          </Box>
        </HStack>
      </HStack>

      <Box maxW="380px" mx="auto">
        <Flex
          justify="center"
          align="center"
          gap={{ base: 4, md: 8 }}
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          py={8}
          mb={5}
        >
          <Flex direction="column" align="center">
            <Text fontSize="10px" fontWeight="800" color={colors.muted} mb={2}>
              YOU
            </Text>
            <Text fontSize="44px" lineHeight="1">
              {round?.player ? byId[round.player].emoji : "\u2753"}
            </Text>
          </Flex>
          <Text fontSize="20px" fontWeight="800" color={colors.muted}>
            VS
          </Text>
          <Flex direction="column" align="center">
            <Text fontSize="10px" fontWeight="800" color={colors.muted} mb={2}>
              COMPUTER
            </Text>
            <Text fontSize="44px" lineHeight="1">
              {locked ? "\u2753" : round?.npc ? byId[round.npc].emoji : "\u2753"}
            </Text>
          </Flex>
        </Flex>

        <Text
          textAlign="center"
          fontWeight="800"
          fontSize="14px"
          mb={4}
          minH="20px"
        >
          {locked
            ? "Choosing…"
            : round?.verdict
              ? verdictCopy[round.verdict]
              : "Pick a move"}
        </Text>

        <SimpleGrid columns={3} gap={2}>
          {CHOICES.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => play(choice.id)}
              isDisabled={locked}
              variant="studioGhost"
              h="auto"
              py={4}
              flexDirection="column"
              borderColor={
                round?.player === choice.id ? choice.color : colors.border
              }
            >
              <Text fontSize="28px" lineHeight="1" mb={1}>
                {choice.emoji}
              </Text>
              <Text fontSize="11px" fontWeight="800">
                {choice.label}
              </Text>
            </Button>
          ))}
        </SimpleGrid>

        <HStack justify="center" mt={5}>
          <Button
            onClick={reset}
            variant="studioGhost"
            leftIcon={<RotateCcw size={14} />}
            isDisabled={!round}
          >
            Clear board
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
export default RockPaperScissors;