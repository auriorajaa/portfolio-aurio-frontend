import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { RotateCcw, HelpCircle } from "lucide-react";
import { useStudioColors } from "../public/studio";
import { RockHand, PaperHand, ScissorsHand } from "./HandAssets";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const CHOICES = [
  {
    id: "rock",
    label: "Rock",
    handComponent: RockHand,
    beats: "scissors",
    color: "#ff6b6b",
  },
  {
    id: "paper",
    label: "Paper",
    handComponent: PaperHand,
    beats: "rock",
    color: "#00bbf9",
  },
  {
    id: "scissors",
    label: "Scissors",
    handComponent: ScissorsHand,
    beats: "paper",
    color: "#ffca3a",
  },
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
  const [shop] = useState(() => getShopSnapshot("rps"));
  const palette = {
    p: shop?.skin?.colors?.p || "#00f5d4",
    s: shop?.skin?.colors?.s || "#ff6b6b",
  };
  const bgmStarted = useRef(false);
  const [playerHistory, setPlayerHistory] = useState([]);
  const [roundHistory, setRoundHistory] = useState([]);
  const [round, setRound] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.rps || { wins: 0, losses: 0, ties: 0 };
  });

  const reset = (e) => {
    if (e) e.stopPropagation();
    arcadeAudio.playClick();
    setRound(null);
    setLocked(false);
    setCountdown(null);
  };

  useEffect(
    () => () => {
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const play = (playerId) => {
    if (locked) return;
    if (!bgmStarted.current) {
      bgmStarted.current = true;
      arcadeAudio.startBgm("rps");
    }
    setLocked(true);
    arcadeAudio.playClick();
    arcadeHaptics.light();
    setCountdown(3);

    // Dynamic 3... 2... 1... countdown with rhythmic hand bobbing
    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        arcadeAudio.playMove();
        arcadeHaptics.light();
      } else {
        clearInterval(countInterval);
        setCountdown("SHOOT!");
        arcadeAudio.playJump();
        arcadeHaptics.medium();

        setTimeout(() => {
          setCountdown(null);
          const npcId = pickNpcMove(playerHistory);
          const verdict = judge(playerId, npcId);
          setRound({ player: playerId, npc: npcId, verdict });
          setPlayerHistory((prev) => [...prev, playerId].slice(-12));
          setRoundHistory((prev) => [...prev, verdict].slice(-8));

          let nextScore = { ...score };
          if (verdict === "win") {
            nextScore.wins += 1;
            arcadeAudio.playWin();
            arcadeHaptics.success();
          } else if (verdict === "lose") {
            nextScore.losses += 1;
            arcadeAudio.playHit();
            arcadeHaptics.danger();
          } else {
            nextScore.ties += 1;
            arcadeAudio.playClick();
            arcadeHaptics.medium();
          }
          setScore(nextScore);
          recordGameSession("rps", nextScore);
          setLocked(false);
        }, 300);
      }
    }, 260);
  };

  const verdictCopy = {
    win: "You won this round!",
    lose: "Computer counter-picked you!",
    tie: "Mirror match! It is a tie.",
  };

  const PlayerHandView = round?.player ? byId[round.player].handComponent : RockHand;
  const NpcHandView = round?.npc ? byId[round.npc].handComponent : RockHand;

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Rock Paper Scissors
            </Text>
            <Box px={2} py={0.5} bg="#9b5de5" color="#fff" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Hand Battle
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Outsmart the computer with real hand gestures. Keep an unpredictable cadence!
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
              TIES
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffca3a">
              {score.ties}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", md: "580px" }} mx="auto">
        {/* Arena Faceoff Stage */}
        <Flex
          justify="center"
          align="center"
          gap={{ base: 2, sm: 6, md: 8 }}
          bg={colors.surface}
          border="2px solid"
          borderColor={colors.border}
          py={{ base: 6, md: 9 }}
          px={{ base: 2, md: 4 }}
          mb={5}
          position="relative"
          overflow="hidden"
        >
          {/* Player Hand Stage */}
          <Flex direction="column" align="center" flex="1">
            <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="800" color={colors.muted} mb={2}>
              YOU
            </Text>
            <Box
              w={{ base: "90px", sm: "110px", md: "130px" }}
              h={{ base: "90px", sm: "110px", md: "130px" }}
              bg={colors.surfaceAlt}
              border="3px solid"
              borderColor={
                round?.verdict === "win"
                  ? palette.p
                  : round?.player
                    ? byId[round.player].color
                    : colors.border
              }
              boxShadow={
                round?.verdict === "win"
                  ? `0 0 16px ${palette.p}66`
                  : "none"
              }
              display="grid"
              placeItems="center"
              transition="all .2s ease"
              borderRadius="12px"
            >
              {countdown !== null ? (
                <RockHand size={76} color={palette.p} isShaking={true} />
              ) : round?.player ? (
                <PlayerHandView
                  size={84}
                  color={byId[round.player].color}
                  isShaking={false}
                />
              ) : (
                <RockHand size={76} color={colors.muted} isShaking={false} />
              )}
            </Box>
            <Text mt={2} fontSize="13px" fontWeight="800" textTransform="capitalize">
              {countdown !== null ? "Shooting..." : round?.player || "Pick Hand"}
            </Text>
          </Flex>

          {/* VS / Countdown Center Badge */}
          <Flex direction="column" align="center" justify="center" minW="70px">
            {countdown !== null ? (
              <Box
                px={3}
                py={1.5}
                bg="#171717"
                border="2px solid #00f5d4"
                borderRadius="full"
              >
                <Text
                  fontSize={{ base: "20px", md: "26px" }}
                  fontWeight="900"
                  color="#00f5d4"
                  lineHeight="1"
                >
                  {countdown}
                </Text>
              </Box>
            ) : (
              <Text fontSize={{ base: "22px", md: "28px" }} fontWeight="900" color={colors.muted}>
                VS
              </Text>
            )}
          </Flex>

          {/* Computer Hand Stage */}
          <Flex direction="column" align="center" flex="1">
            <Text fontSize={{ base: "11px", md: "12px" }} fontWeight="800" color={colors.muted} mb={2}>
              COMPUTER
            </Text>
            <Box
              w={{ base: "90px", sm: "110px", md: "130px" }}
              h={{ base: "90px", sm: "110px", md: "130px" }}
              bg={colors.surfaceAlt}
              border="3px solid"
              borderColor={
                round?.verdict === "lose"
                  ? palette.s
                  : round?.npc
                    ? byId[round.npc].color
                    : colors.border
              }
              boxShadow={
                round?.verdict === "lose"
                  ? `0 0 16px ${palette.s}66`
                  : "none"
              }
              display="grid"
              placeItems="center"
              transition="all .2s ease"
              borderRadius="12px"
            >
              {locked || countdown !== null ? (
                <RockHand size={76} color={palette.s} isShaking={true} />
              ) : round?.npc ? (
                <NpcHandView
                  size={84}
                  color={byId[round.npc].color}
                  isShaking={false}
                />
              ) : (
                <HelpCircle size={44} color={colors.muted} />
              )}
            </Box>
            <Text mt={2} fontSize="13px" fontWeight="800" textTransform="capitalize">
              {locked || countdown !== null ? "Deciding..." : round?.npc || "Waiting"}
            </Text>
          </Flex>
        </Flex>

        {/* Verdict Display */}
        <Box textAlign="center" mb={4} minH="24px">
          <Text
            fontWeight="800"
            fontSize="16px"
            color={
              round?.verdict === "win"
                ? "#00f5d4"
                : round?.verdict === "lose"
                  ? "#ff6b6b"
                  : round?.verdict === "tie"
                    ? "#ffca3a"
                    : colors.muted
            }
          >
            {countdown !== null
              ? "Rock... Paper... Scissors..."
              : round?.verdict
                ? verdictCopy[round.verdict]
                : "Choose your hand below to duel"}
          </Text>
        </Box>

        {/* Illustrated Hand Selection Buttons */}
        <SimpleGrid columns={3} gap={{ base: 2, sm: 3 }}>
          {CHOICES.map((choice) => {
            const HandComponent = choice.handComponent;
            const isSelected = round?.player === choice.id;
            return (
              <Button
                key={choice.id}
                onClick={(e) => {
                  e.stopPropagation();
                  play(choice.id);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                isDisabled={locked}
                variant="unstyled"
                h="auto"
                py={{ base: 3, sm: 4 }}
                px={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={1.5}
                border="2px solid"
                borderColor={isSelected ? choice.color : colors.border}
                bg={isSelected ? colors.surface : colors.surfaceAlt}
                borderRadius="8px"
                boxShadow={isSelected ? `0 0 12px ${choice.color}66` : "none"}
                _hover={!locked ? { borderColor: choice.color, transform: "translateY(-3px)" } : {}}
                transition="all .18s ease"
              >
                <HandComponent size={58} color={choice.color} />
                <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="900" mt={1}>
                  {choice.label}
                </Text>
                <Text fontSize="10px" color={colors.muted} textTransform="uppercase" fontWeight="700">
                  Beats {choice.beats}
                </Text>
              </Button>
            );
          })}
        </SimpleGrid>

        {/* Round History Dots */}
        {roundHistory.length > 0 && (
          <Flex justify="center" align="center" gap={2} mt={4}>
            <Text fontSize="11px" fontWeight="700" color={colors.muted} mr={1}>
              Recent:
            </Text>
            {roundHistory.map((res, i) => (
              <Box
                key={i}
                w="20px"
                h="20px"
                borderRadius="full"
                display="grid"
                placeItems="center"
                fontSize="10px"
                fontWeight="900"
                bg={res === "win" ? "#00f5d4" : res === "lose" ? "#ff6b6b" : "#ffca3a"}
                color="#171717"
              >
                {res === "win" ? "W" : res === "lose" ? "L" : "T"}
              </Box>
            ))}
          </Flex>
        )}

        {/* Board Controls */}
        <HStack justify="center" mt={5}>
          <Button
            onClick={reset}
            onPointerDown={reset}
            variant="studioGhost"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            isDisabled={!round && !countdown}
          >
            Clear Board
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default RockPaperScissors;