import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import { Play, RotateCcw } from "lucide-react";
import { useStudioColors } from "../public/studio";

const HOLE_COUNT = 9;
const ROUND_MS = 30000;
const BEST_KEY = "arcade:whacamole:best";

const WhacAMole = () => {
  const colors = useStudioColors();
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [holes, setHoles] = useState(() => Array(HOLE_COUNT).fill(null));
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  const startedAt = useRef(0);
  const spawnTimer = useRef(null);
  const hideTimers = useRef({});
  const tickTimer = useRef(null);
  const scoreRef = useRef(0);

  const clearAllTimers = () => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (tickTimer.current) clearInterval(tickTimer.current);
    Object.values(hideTimers.current).forEach((id) => clearTimeout(id));
    hideTimers.current = {};
  };

  const scheduleSpawn = () => {
    const elapsed = performance.now() - startedAt.current;
    const difficulty = Math.min(1, elapsed / ROUND_MS);
    const delay = 650 - difficulty * 350 + Math.random() * 300;
    spawnTimer.current = window.setTimeout(() => {
      setHoles((current) => {
        const emptyIndexes = current
          .map((mole, i) => (mole ? null : i))
          .filter((i) => i !== null);
        if (!emptyIndexes.length) return current;
        const index =
          emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const visibleFor = 950 - difficulty * 500 + Math.random() * 150;
        const moleId = performance.now();
        hideTimers.current[index] = window.setTimeout(() => {
          setHoles((holesNow) =>
            holesNow.map((mole, i) =>
              i === index && mole === moleId ? null : mole,
            ),
          );
        }, visibleFor);
        const next = [...current];
        next[index] = moleId;
        return next;
      });
      scheduleSpawn();
    }, delay);
  };

  const start = () => {
    clearAllTimers();
    startedAt.current = performance.now();
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(30);
    setHoles(Array(HOLE_COUNT).fill(null));
    setStatus("playing");
    scheduleSpawn();
    tickTimer.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt.current;
      const remaining = Math.max(0, Math.ceil((ROUND_MS - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearAllTimers();
        setHoles(Array(HOLE_COUNT).fill(null));
        setStatus("over");
        setBest((current) => {
          if (scoreRef.current <= current) return current;
          try {
            window.localStorage.setItem(BEST_KEY, String(scoreRef.current));
          } catch {
            // storage unavailable, ignore
          }
          return scoreRef.current;
        });
      }
    }, 250);
  };

  useEffect(() => clearAllTimers, []);

  const whack = (index) => {
    if (status !== "playing" || !holes[index]) return;
    if (hideTimers.current[index]) {
      clearTimeout(hideTimers.current[index]);
      delete hideTimers.current[index];
    }
    setHoles((current) =>
      current.map((mole, i) => (i === index ? null : mole)),
    );
    scoreRef.current += 1;
    setScore(scoreRef.current);
  };

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Whac-a-Mole
          </Text>
          <Text mt={1} fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
            Tap the moles before they duck back down.
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
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize={{ base: "11px", md: "12px" }} color={colors.muted}>
              TIME
            </Text>
            <Text fontWeight="800">{timeLeft}s</Text>
          </Box>
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", md: "500px", xl: "620px" }} mx="auto">
        <Grid templateColumns="repeat(3, 1fr)" gap={{ base: 2, md: 3 }}>
          {holes.map((mole, index) => (
            <Box
              key={index}
              as="button"
              onClick={() => whack(index)}
              position="relative"
              aspectRatio="1"
              bg={colors.surface}
              border="1px solid"
              borderColor={colors.border}
              overflow="hidden"
              cursor={status === "playing" ? "pointer" : "default"}
            >
              <Box
                position="absolute"
                left="50%"
                bottom={mole ? "8%" : "-60%"}
                transform="translateX(-50%)"
                transition="bottom .12s cubic-bezier(.2,1.4,.4,1)"
                w="62%"
                h="62%"
                borderRadius="full"
                bg="#8ac926"
                border="3px solid"
                borderColor={colors.text}
              />
            </Box>
          ))}
        </Grid>
        <Text mt={3} textAlign="center" fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
          30-second round. Moles get faster as time runs out.
        </Text>
        {status === "over" && (
          <Box
            mt={4}
            p={4}
            border="1px solid"
            borderColor={colors.border}
            textAlign="center"
          >
            <Text fontWeight="800">Time's up</Text>
            <Text mt={1} fontSize={{ base: "14px", md: "15px" }} color={colors.muted}>
              You whacked {score} mole{score === 1 ? "" : "s"}.
            </Text>
          </Box>
        )}
        <HStack justify="center" mt={5} spacing={2}>
          <Button
            onClick={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing"
              ? "Running"
              : status === "idle"
                ? "Start round"
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
export default WhacAMole;