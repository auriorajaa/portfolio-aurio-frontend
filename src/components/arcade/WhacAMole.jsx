import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Grid, HStack, Text } from "@chakra-ui/react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useStudioColors } from "../public/studio";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const HOLE_COUNT = 9;
const ROUND_MS = 30000;

const DEFAULT_MOLE = { body: "#8ac926", coat: "#6a9c1a", hat: "#ffca3a", snout: "#ffd166", eye: "#171717" };

// Slower start, gentle ramp — moles stay hittable early and only get frantic late.
const easeIn = (t) => t * (1.6 - 0.6 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const WhacAMole = () => {
  const colors = useStudioColors();
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [holes, setHoles] = useState(() => Array(HOLE_COUNT).fill(null));
  const [whackedHoles, setWhackedHoles] = useState({});
  const [missedHoles, setMissedHoles] = useState({});
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.whacamole?.best || 0;
  });

  const [shop] = useState(() => getShopSnapshot("whacamole"));
  const molePalette = shop?.skin?.colors?.p
    ? {
        body: shop.skin.colors.p,
        coat: shop.skin.colors.s || shop.skin.colors.p,
        hat: "#ffca3a",
        snout: "#f9a8d4",
        eye: "#6d28d9",
      }
    : DEFAULT_MOLE;
  const extraMs = shop?.perks?.moleExtraMs || 0;
  const scoreMult = shop?.perks?.moleScoreMult || 1;
  const roundMs = ROUND_MS + extraMs;

  const startedAt = useRef(0);
  const spawnTimer = useRef(null);
  const hideTimers = useRef({});
  const feedbackTimers = useRef({});
  const tickTimer = useRef(null);
  const scoreRef = useRef(0);
  const startGuard = useRef(false);

  const clearAllTimers = () => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (tickTimer.current) clearInterval(tickTimer.current);
    Object.values(hideTimers.current).forEach((id) => clearTimeout(id));
    Object.values(feedbackTimers.current).forEach((id) => clearTimeout(id));
    hideTimers.current = {};
    feedbackTimers.current = {};
  };

  const scheduleSpawn = () => {
    const elapsed = performance.now() - startedAt.current;
    const progress = Math.min(1, Math.max(0, elapsed / roundMs));
    const d = easeIn(progress);
    const delay = lerp(1000, 470, d) + Math.random() * 240;
    spawnTimer.current = window.setTimeout(() => {
      setHoles((current) => {
        const emptyIndexes = current
          .map((mole, i) => (mole ? null : i))
          .filter((i) => i !== null);
        if (!emptyIndexes.length) return current;
        const index = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const visibleFor = lerp(1200, 560, d) + Math.random() * 160;
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

  const showFeedback = (index, kind) => {
    const setter = kind === "whack" ? setWhackedHoles : setMissedHoles;
    const clearer = kind === "whack" ? setMissedHoles : setWhackedHoles;
    setter((prev) => ({ ...prev, [index]: true }));
    clearer((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    if (feedbackTimers.current[index]) clearTimeout(feedbackTimers.current[index]);
    feedbackTimers.current[index] = window.setTimeout(() => {
      setter((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }, 420);
  };

  const start = (e) => {
    if (e) e.stopPropagation();
    if (startGuard.current || status === "playing") return;
    startGuard.current = true;
    clearAllTimers();
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("whacamole");
    startedAt.current = performance.now();
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(Math.ceil(roundMs / 1000));
    setHoles(Array(HOLE_COUNT).fill(null));
    setWhackedHoles({});
    setMissedHoles({});
    setStatus("playing");
    scheduleSpawn();
    tickTimer.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt.current;
      const remaining = Math.max(0, Math.ceil((roundMs - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearAllTimers();
        setHoles(Array(HOLE_COUNT).fill(null));
        setStatus("over");
        arcadeAudio.stopBgm({ fade: true });
        arcadeAudio.playWin();
        arcadeHaptics.success();
        setBest((current) => {
          const next = Math.max(current, scoreRef.current);
          recordGameSession("whacamole", next);
          return next;
        });
      }
    }, 250);
    window.setTimeout(() => {
      startGuard.current = false;
    }, 300);
  };

  useEffect(() => clearAllTimers, []);

  useEffect(
    () => () => {
      clearAllTimers();
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const whack = (index) => {
    if (status !== "playing") return;
    if (holes[index]) {
      arcadeAudio.playWhack();
      arcadeHaptics.medium();
      showFeedback(index, "whack");

      if (hideTimers.current[index]) {
        clearTimeout(hideTimers.current[index]);
        delete hideTimers.current[index];
      }
      setHoles((current) =>
        current.map((mole, i) => (i === index ? null : mole)),
      );
      scoreRef.current += scoreMult;
      setScore(scoreRef.current);
    } else if (!whackedHoles[index]) {
      // Miss: clear, non-blocking feedback so the player knows the hole was empty.
      arcadeAudio.playClick();
      arcadeHaptics.light();
      showFeedback(index, "miss");
    }
  };

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Whac-a-Mole
            </Text>
            <Box px={2} py={0.5} bg="#8ac926" color="#171717" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Speed Reflex
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Tap moles as they peek out. Test your reaction time!
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
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              TIME
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color={timeLeft <= 5 ? "#ff6b6b" : colors.text}>
              {timeLeft}s
            </Text>
          </Box>
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", sm: "360px", md: "460px" }} mx="auto">
        <Box position="relative">
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={{ base: 2.5, md: 3.5 }}
            p={{ base: 2.5, md: 4 }}
            bg={colors.surface}
            border="2px solid"
            borderColor={colors.border}
            borderRadius="12px"
          >
            {holes.map((mole, index) => {
              const isWhacked = whackedHoles[index];
              const isMiss = missedHoles[index];
              const isVisible = Boolean(mole) || isWhacked;
              const palette = molePalette;
              return (
                <Box
                  key={index}
                  as="button"
                  aria-label={`Mole hole ${index + 1}`}
                  onClick={() => whack(index)}
                  position="relative"
                  aspectRatio="1"
                  bg="radial-gradient(circle at 50% 85%, #232b45 0%, #161a2e 60%, #0f1222 100%)"
                  border="3px solid"
                  borderColor="#2c3352"
                  borderRadius="50%"
                  overflow="hidden"
                  cursor={status === "playing" ? "pointer" : "default"}
                  sx={{
                    touchAction: "manipulation",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* Hole dark opening */}
                  <Box
                    position="absolute"
                    inset="8% 10% auto 10%"
                    h="30%"
                    borderRadius="50%"
                    bg="radial-gradient(circle at 50% 40%, #05060c 0%, #000 70%)"
                    border="2px solid rgba(255,255,255,0.12)"
                    boxShadow="inset 0 6px 10px rgba(0,0,0,0.8)"
                  />
                  {/* Grass tufts */}
                  <Box position="absolute" bottom="6%" left="8%" w="34%" h="16%" bg="#1f8a2f" borderRadius="50% 50% 10% 10%" opacity="0.85" />
                  <Box position="absolute" bottom="6%" right="8%" w="34%" h="16%" bg="#1f8a2f" borderRadius="50% 50% 10% 10%" opacity="0.85" />

                  {/* Mole body */}
                  <Box
                    position="absolute"
                    left="50%"
                    bottom={isVisible ? "4%" : "-130%"}
                    transform="translateX(-50%)"
                    transition="bottom .16s cubic-bezier(.2,1.4,.4,1)"
                    w="74%"
                    h="72%"
                    borderRadius="50% 50% 18% 18%"
                    bg={isWhacked ? "#b4b4b4" : `radial-gradient(circle at 50% 28%, ${palette.body} 0%, ${palette.coat} 75%)`}
                    border="3px solid"
                    borderColor={colors.surfaceAlt}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 6px 14px rgba(0,0,0,0.55), inset 0 -6px 10px rgba(0,0,0,0.25)"
                  >
                    {/* Ears */}
                    <Box position="absolute" top="6%" left="12%" w="16%" h="20%" borderRadius="50%" bg={palette.coat} border="2px solid" borderColor={colors.surfaceAlt} />
                    <Box position="absolute" top="6%" right="12%" w="16%" h="20%" borderRadius="50%" bg={palette.coat} border="2px solid" borderColor={colors.surfaceAlt} />
                    {/* Eyes + cheeks */}
                    <Flex justify="center" gap="14%" w="60%">
                      <Box w="9%" aspectRatio="1" borderRadius="full" bg={palette.eye} boxShadow="0 0 0 2px rgba(255,255,255,0.65)" />
                      <Box w="9%" aspectRatio="1" borderRadius="full" bg={palette.eye} boxShadow="0 0 0 2px rgba(255,255,255,0.65)" />
                    </Flex>
                    <Box w="12%" aspectRatio="1" borderRadius="full" bg="rgba(255,105,105,0.4)" mt="6%" />
                    <Box w="12%" aspectRatio="1" borderRadius="full" bg="rgba(255,105,105,0.4)" ml="24%" mt="-8%" />
                    {/* Snout + teeth */}
                    <Box
                      w="30%"
                      h="16%"
                      borderRadius="50%"
                      bg={isWhacked ? "#ddd" : palette.snout}
                      mt="2%"
                      display="flex"
                      alignItems="flex-end"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      <Box w="18%" h="40%" bg="#fff" border="1px solid #aaa" borderRadius="2px 2px 4px 4px" mr="6%" />
                      <Box w="18%" h="40%" bg="#fff" border="1px solid #aaa" borderRadius="2px 2px 4px 4px" />
                    </Box>
                    {/* Little hat for charm */}
                    <Box
                      position="absolute"
                      top="-2%"
                      left="50%"
                      w="34%"
                      h="14%"
                      borderRadius="50%"
                      transform="translateX(-50%)"
                      bg={palette.hat}
                      boxShadow="0 2px 4px rgba(0,0,0,0.4)"
                      display={isWhacked ? "none" : "block"}
                    />
                  </Box>

                  {/* Hit / miss feedback overlay */}
                  {isWhacked && (
                    <Box position="absolute" inset={0} display="grid" placeItems="center" pointerEvents="none">
                      <Text fontSize={{ base: "14px", md: "18px" }} fontWeight="900" color="#ffffff" textShadow="0 2px 6px rgba(0,0,0,0.6)">
                        {scoreMult > 1 ? `+${scoreMult}` : "BONK!"}
                      </Text>
                    </Box>
                  )}
                  {isMiss && (
                    <Box position="absolute" inset={0} display="grid" placeItems="center" pointerEvents="none">
                      <Text fontSize={{ base: "12px", md: "15px" }} fontWeight="900" color="#ff8f8f" textShadow="0 2px 6px rgba(0,0,0,0.6)">
                        MISS
                      </Text>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Grid>

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
              borderRadius="12px"
              zIndex={10}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {status === "over" && (
                <Trophy size={42} color="#8ac926" style={{ margin: "0 auto" }} />
              )}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {status === "idle" ? "Moles Underground" : "Time is Up!"}
              </Text>
              <Text mt={2} fontSize={{ base: "13px", md: "14px" }} opacity={0.9}>
                {status === "idle"
                  ? `30-second round${extraMs ? ` +${Math.round(extraMs / 1000)}s bonus` : ""}. Tap moles before they duck down.`
                  : `You whacked ${score} mole${score === 1 ? "" : "s"}.`}
              </Text>
              <Button
                mt={4}
                size="md"
                bg="#8ac926"
                color="#171717"
                fontWeight="800"
                _hover={{ bg: "#00f5d4" }}
                leftIcon={<Play size={15} />}
                onPointerDown={start}
                onClick={start}
              >
                {status === "idle" ? "Start Round" : "Play Again"}
              </Button>
            </Flex>
          )}
        </Box>

        <Text mt={3} textAlign="center" fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
          Moles get faster as the timer winds down.
        </Text>

        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            onPointerDown={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing" ? "Whacking in Progress" : status === "idle" ? "Start Round" : "Play Again"}
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

export default WhacAMole;