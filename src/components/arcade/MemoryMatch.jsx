import React, { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import {
  Circle,
  Cloud,
  Diamond,
  Heart,
  Moon,
  Star,
  Sun,
  Zap,
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

const ICONS = [
  { icon: Circle, color: "#00f5d4" },
  { icon: Cloud, color: "#00bbf9" },
  { icon: Diamond, color: "#9b5de5" },
  { icon: Heart, color: "#ff6b6b" },
  { icon: Moon, color: "#ffca3a" },
  { icon: Star, color: "#ffd166" },
  { icon: Sun, color: "#ff9f68" },
  { icon: Zap, color: "#8ac926" },
];

const makeCards = () =>
  [...ICONS, ...ICONS]
    .map((item, index) => ({
      id: index,
      Icon: item.icon,
      color: item.color,
      pair: ICONS.indexOf(item),
      flipped: false,
      matched: false,
    }))
    .sort(() => Math.random() - 0.5);

const MemoryMatch = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("memory"));
  const skinColors = shop?.skin?.colors || null;
  const canPeek = Boolean(shop?.perks?.memoryPeek);
  const peekTimer = useRef(null);
  const [peeking, setPeeking] = useState(false);
  const [cards, setCards] = useState(makeCards);
  const [open, setOpen] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.memory?.bestMoves || null;
  });

  const startPeek = () => {
    if (!canPeek) return;
    if (peekTimer.current) window.clearTimeout(peekTimer.current);
    setPeeking(true);
    peekTimer.current = window.setTimeout(() => setPeeking(false), 1400);
  };

  const reset = (e) => {
    if (e) e.stopPropagation();
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("memory");
    setCards(makeCards());
    setOpen([]);
    setMoves(0);
    setLocked(false);
    startPeek();
  };

  useEffect(() => {
    startPeek();
    return () => {
      if (peekTimer.current) window.clearTimeout(peekTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open.length !== 2) return undefined;
    setLocked(true);
    const timer = window.setTimeout(() => {
      const [first, second] = open;
      setCards((current) => {
        const firstCard = current.find((item) => item.id === first);
        const secondCard = current.find((item) => item.id === second);
        const matched = firstCard?.pair === secondCard?.pair;

        if (matched) {
          arcadeAudio.playScore();
          arcadeHaptics.success();
        } else {
          arcadeAudio.playMove();
        }

        return current.map((card) =>
          card.id === first || card.id === second
            ? { ...card, flipped: matched, matched }
            : card,
        );
      });
      setOpen([]);
      setLocked(false);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [open]);

  const choose = (card) => {
    if (locked || peeking || card.flipped || card.matched || open.includes(card.id))
      return;
    arcadeAudio.playClick();
    arcadeHaptics.light();
    setMoves((value) => value + 1);
    setOpen((value) => [...value, card.id]);
    setCards((current) =>
      current.map((item) =>
        item.id === card.id ? { ...item, flipped: true } : item,
      ),
    );
  };

  const matches = cards.filter((card) => card.matched).length / 2;
  const done = matches === ICONS.length;

  useEffect(() => {
    if (!done) return;
    arcadeAudio.playWin();
    arcadeAudio.stopBgm({ fade: true });
    arcadeHaptics.success();
    setBest((current) => {
      const next = current === null || moves < current ? moves : current;
      recordGameSession("memory", next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(
    () => () => {
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Memory Match
            </Text>
            <Box px={2} py={0.5} bg="#f15bb5" color="#fff" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Mind Gym
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Flip cards and uncover all 8 matching arcade icon pairs.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              MOVES
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#00f5d4">
              {moves}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              BEST
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffca3a">
              {best ?? "-"}
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              PAIRS
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#f15bb5">
              {matches}/{ICONS.length}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <SimpleGrid
        maxW={{ base: "100%", sm: "360px", md: "460px" }}
        mx="auto"
        columns={4}
        gap={{ base: 2, sm: 2.5, md: 3 }}
      >
        {cards.map((card) => {
          const Icon = card.Icon;
          const visible = card.flipped || card.matched || peeking;
          return (
            <Button
              key={card.id}
              aria-label={visible ? "Revealed card" : "Hidden card"}
              onClick={() => choose(card)}
              isDisabled={locked && !visible}
              variant="unstyled"
              aspectRatio="1"
              w="100%"
              h="auto"
              minH="0"
              p={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={
                visible
                  ? colors.surface
                  : skinColors
                    ? `linear-gradient(135deg, ${skinColors.p} 0%, ${skinColors.s} 100%)`
                    : "#1f2438"
              }
              border="2px solid"
              borderColor={
                card.matched
                  ? card.color
                  : visible
                    ? colors.border
                    : skinColors
                      ? skinColors.s
                      : "#353d5e"
              }
              transition="all .2s ease"
              transform={card.matched ? "scale(.95)" : "scale(1)"}
              boxShadow={card.matched ? `0 0 10px ${card.color}66` : "none"}
              _hover={!visible && !locked ? { borderColor: "#00f5d4", transform: "translateY(-2px)" } : {}}
            >
              {visible ? (
                <Icon size={32} color={card.color} strokeWidth={2.5} />
              ) : (
                <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="900" color={skinColors ? "#171717" : "#64748b"}>
                  ?
                </Text>
              )}
            </Button>
          );
        })}
      </SimpleGrid>

      {done && (
        <Box
          mt={5}
          maxW={{ base: "100%", sm: "360px", md: "460px" }}
          mx="auto"
          p={4}
          border="2px solid"
          borderColor="#f15bb5"
          bg={colors.surface}
          textAlign="center"
        >
          <Trophy size={36} color="#f15bb5" style={{ margin: "0 auto" }} />
          <Text fontWeight="800" fontSize="18px" mt={1}>
            Memory Vault Cleared!
          </Text>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Completed in {moves} moves.
            {best === moves ? " That is a brand new record!" : " Sharp recall!"}
          </Text>
          <Button
            mt={3}
            size="sm"
            bg="#f15bb5"
            color="#ffffff"
            fontWeight="800"
            _hover={{ bg: "#9b5de5" }}
            leftIcon={<RotateCcw size={14} />}
            onPointerDown={reset}
            onClick={reset}
          >
            Play Again
          </Button>
        </Box>
      )}

      <HStack justify="center" mt={5}>
        <Button
          onClick={reset}
          variant="studioGhost"
          size="sm"
          leftIcon={<RotateCcw size={14} />}
        >
          Reset Deck
        </Button>
      </HStack>
    </Box>
  );
};

export default MemoryMatch;