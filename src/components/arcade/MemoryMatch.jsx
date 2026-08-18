import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useStudioColors } from "../public/studio";

const ICONS = [Circle, Cloud, Diamond, Heart, Moon, Star, Sun, Zap];
const BEST_KEY = "arcade:memory:best";

const makeCards = () =>
  [...ICONS, ...ICONS]
    .map((Icon, index) => ({
      id: index,
      Icon,
      pair: ICONS.indexOf(Icon),
      flipped: false,
      matched: false,
    }))
    .sort(() => Math.random() - 0.5);

const MemoryMatch = () => {
  const colors = useStudioColors();
  const [cards, setCards] = useState(makeCards);
  const [open, setOpen] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => {
    try {
      const stored = Number(window.localStorage.getItem(BEST_KEY));
      return stored > 0 ? stored : null;
    } catch {
      return null;
    }
  });

  const reset = () => {
    setCards(makeCards());
    setOpen([]);
    setMoves(0);
    setLocked(false);
  };

  useEffect(() => {
    if (open.length !== 2) return undefined;
    setLocked(true);
    const timer = window.setTimeout(() => {
      const [first, second] = open;
      setCards((current) => {
        const firstCard = current.find((item) => item.id === first);
        const secondCard = current.find((item) => item.id === second);
        const matched = firstCard?.pair === secondCard?.pair;
        return current.map((card) =>
          card.id === first || card.id === second
            ? { ...card, flipped: matched, matched }
            : card,
        );
      });
      setOpen([]);
      setLocked(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [open]);

  const choose = (card) => {
    if (locked || card.flipped || card.matched || open.includes(card.id))
      return;
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
    setBest((current) => {
      if (current !== null && moves >= current) return current;
      try {
        window.localStorage.setItem(BEST_KEY, String(moves));
      } catch {
        // storage unavailable, ignore
      }
      return moves;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <Box>
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <Text fontSize="20px" fontWeight="800">
            Memory Match
          </Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            Tap two cards and find all eight pairs.
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              MOVES
            </Text>
            <Text fontWeight="800">{moves}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              BEST
            </Text>
            <Text fontWeight="800">{best ?? "0"}</Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} px={3} py={2}>
            <Text fontSize="10px" color={colors.muted}>
              MATCHES
            </Text>
            <Text fontWeight="800">
              {matches}/{ICONS.length}
            </Text>
          </Box>
        </HStack>
      </HStack>
      <SimpleGrid maxW={{ base: "100%", md: "560px", xl: "680px" }} mx="auto" columns={4} gap={{ base: 2, md: 3 }}>
        {cards.map((card) => {
          const Icon = card.Icon;
          const visible = card.flipped || card.matched;
          return (
            <Button
              key={card.id}
              aria-label={visible ? "Revealed card" : "Hidden card"}
              onClick={() => choose(card)}
              isDisabled={locked && !visible}
              variant="studioGhost"
              aspectRatio="1"
              h="auto"
              minH="0"
              p={0}
              bg={visible ? colors.surface : colors.surfaceAlt}
              borderColor={card.matched ? colors.text : colors.border}
              transition="background .15s, transform .15s"
              transform={card.matched ? "scale(.96)" : "scale(1)"}
            >
              {visible ? (
                <Icon size={38} strokeWidth={2.5} />
              ) : (
                <Text fontSize="36px" fontWeight="800" color={colors.muted}>
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
          p={4}
          border="1px solid"
          borderColor={colors.border}
          textAlign="center"
        >
          <Text fontWeight="800">You found them all</Text>
          <Text mt={1} fontSize="13px" color={colors.muted}>
            {best === moves ? "New best. That was quick." : "That was quick."}
          </Text>
        </Box>
      )}
      <Button
        mt={5}
        onClick={reset}
        variant="studioGhost"
        leftIcon={<RotateCcw size={14} />}
      >
        Play again
      </Button>
    </Box>
  );
};
export default MemoryMatch;