import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  HStack,
  IconButton,
  Progress,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Brain,
  Check,
  Coins,
  Disc,
  Grid2X2,
  Hammer,
  Hash,
  Loader2,
  Monitor,
  Rabbit,
  RefreshCw,
  Route,
  ShoppingBag,
  Sparkles,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
  Wrench,
  Zap,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/layout/Header";
import { useStudioColors } from "../components/public/studio";
import { absoluteUrl, SITE_NAME } from "../utils/seo";
import Game2048 from "../components/arcade/2048Game";
import MemoryMatch from "../components/arcade/MemoryMatch";
import ReactionDodge from "../components/arcade/ReactionDodge";
import TicTacToe from "../components/arcade/TicTacToe";
import RockPaperScissors from "../components/arcade/RockPaperScissors";
import WhacAMole from "../components/arcade/WhacAMole";
import Snake from "../components/arcade/Snake";
import Pong from "../components/arcade/Pong";
import EndlessRunner from "../components/arcade/EndlessRunner";
import {
  ARCADE_ACHIEVEMENTS,
  arcadeAudio,
  arcadeHaptics,
  getCrtMode,
  getUnlockedAchievements,
  loadArcadeStats,
  setCrtMode,
} from "../services/arcadeService";
import {
  SHOP_ITEMS,
  addCoins,
  equipItem,
  getEquippedId,
  isOwned,
  loadCoins,
  purchaseItem,
  unequipItem,
  useShopState,
} from "../services/shopService";
import { geminiGenerate, isGeminiAvailable } from "../services/geminiService";

const GAMES = [
  {
    id: "2048",
    label: "2048 Mini",
    note: "Color tiles puzzle",
    icon: Grid2X2,
    color: "#ffca3a",
    keyNum: "1",
    component: Game2048,
  },
  {
    id: "snake",
    label: "Snake",
    note: "Classic arcade slither",
    icon: Route,
    color: "#0bbfa0",
    keyNum: "2",
    component: Snake,
  },
  {
    id: "pong",
    label: "Pong",
    note: "First to 5 points",
    icon: Disc,
    color: "#ff9f68",
    keyNum: "3",
    component: Pong,
  },
  {
    id: "tictactoe",
    label: "Tic-Tac-Toe",
    note: "Beat the computer",
    icon: Hash,
    color: "#00f5d4",
    keyNum: "4",
    component: TicTacToe,
  },
  {
    id: "rps",
    label: "Rock Paper Scissors",
    note: "Outsmart the AI",
    icon: Swords,
    color: "#9b5de5",
    keyNum: "5",
    component: RockPaperScissors,
  },
  {
    id: "whacamole",
    label: "Whac-a-Mole",
    note: "Speed reflex frenzy",
    icon: Hammer,
    color: "#8ac926",
    keyNum: "6",
    component: WhacAMole,
  },
  {
    id: "memory",
    label: "Memory Match",
    note: "Find matching pairs",
    icon: Brain,
    color: "#f15bb5",
    keyNum: "7",
    component: MemoryMatch,
  },
  {
    id: "dodge",
    label: "Reaction Dodge",
    note: "20-second survival",
    icon: Zap,
    color: "#00bbf9",
    keyNum: "8",
    component: ReactionDodge,
  },
  {
    id: "runner",
    label: "Endless Runner",
    note: "Dash, jump & grab coins",
    icon: Rabbit,
    color: "#ff6b6b",
    keyNum: "9",
    component: EndlessRunner,
  },
];

// Static pro-tips used as the fallback when the Gemini API is unavailable.
const STATIC_TIPS = {
  "2048": "Keep high tiles pinned to a corner and build around them.",
  snake: "Plan two moves ahead — a smooth turn beats a last-second one.",
  pong: "Center yourself early and let the AI's offset favor shadow matches.",
  tictactoe: "Take center if you can; corners set up traps.",
  rps: "People overuse Rock — punish the pattern with Paper on repeats.",
  whacamole: "Tap fast but only where a mole is peeking — misses cost time.",
  memory: "Flip in a fixed grid order so you always know where each card lives.",
  dodge: "Small, steady nudges keep your ship centered and predictable.",
  runner: "Learn the two jump timing windows: spikes need an early hop.",
};

const STATIC_DESCRIPTIONS = {
  "2048": "Slide tiles to merge powers of two. Stack your largest tile into one corner and chain merges toward the magic 2048.",
  snake: "Grow a neon serpent by eating apples. Every bite adds points and makes the board tighter to navigate.",
  pong: "Beat a reactive AI to 5 points. Angle your shots off the paddle edge to catch it off guard.",
  tictactoe: "Outmaneuver a minimax-powered AI. Trade easy wins for traps against the Unbeatable setting.",
  rps: "A roguelike against a pattern-reading opponent. Mix up your cadence and break its rhythm.",
  whacamole: "Frenzied 30-second mole-bopping. Moles pop faster as time runs low — stay focused near the end.",
  memory: "Classic concentration. Uncover all 8 pairs in the fewest moves, then chase your personal best.",
  dodge: "Steer a hovercraft through a meteor storm for 20 seconds. Endure the full barrage to win.",
  runner: "An infinite dash through neon ruins. Jump spikes, slip under drones and vacuum up energy coins.",
};

class ArcadeGameBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // Error caught gracefully
  }
  render() {
    if (this.state.hasError)
      return (
        <Box
          p={8}
          border="2px solid"
          borderColor={this.props.colors.border}
          textAlign="center"
        >
          <Text fontWeight="800" fontSize="18px">Game could not start</Text>
          <Text mt={2} fontSize="13px" color={this.props.colors.muted}>
            Please pick another game from the cabinet above.
          </Text>
          <Button mt={4} size="sm" onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </Box>
      );
    return this.props.children;
  }
}

const Arcade = ({ isDownloading, handleDownload }) => {
  const colors = useStudioColors();
  const toast = useToast();
  const [activeGame, setActiveGame] = useState("2048");
  const [isMuted, setIsMuted] = useState(() => arcadeAudio.getMuted());
  const [crtEnabled, setCrtEnabled] = useState(() => getCrtMode());
  const [stats, setStats] = useState(() => loadArcadeStats());
  const [coinPressed, setCoinPressed] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const selectingRef = useRef(false);

  // ---- Shop ----
  const shop = useShopState(null);
  const coins = shop?.coins ?? loadCoins();
  const owned = shop?.owned ?? [];
  const equippedBgm = shop?.bgmTheme || "default";
  const { isOpen: shopOpen, onOpen: onShopOpen, onClose: onShopClose } = useDisclosure();
  const { isOpen: passportOpen, onOpen: onPassportOpen, onClose: onPassportClose } = useDisclosure();
  const [pendingBuy, setPendingBuy] = useState(null);

  // ---- AI Coach ----
  const [aiState, setAiState] = useState({
    status: "idle",
    gameId: null,
    desc: "",
    tip: "",
    rec: "",
    refreshed: 0,
  });
  const aiAbort = useRef(null);

  const active = GAMES.find((game) => game.id === activeGame) || GAMES[0];
  const ActiveGame = active.component;
  const canonicalUrl = absoluteUrl("/arcade");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const unlockedBadges = useMemo(() => getUnlockedAchievements(), [stats]);

  // Global cleanup: never let BGM bleed into browsing or other pages.
  useEffect(() => {
    return () => {
      if (aiAbort.current) aiAbort.current.abort();
      arcadeAudio.stopBgm({ fade: false });
    };
  }, []);

  // Keep the equipped BGM theme in sync across tabs / purchases.
  useEffect(() => {
    arcadeAudio.setBgmTheme(equippedBgm);
  }, [equippedBgm]);

  // Stop BGM the moment the user switches games (exit the current game window).
  useEffect(() => {
    arcadeAudio.stopBgm({ fade: true });
    setStats(loadArcadeStats());
  }, [activeGame]);

  const toggleSound = () => {
    const next = arcadeAudio.toggleMute();
    setIsMuted(next);
    if (!next) arcadeAudio.playClick();
  };

  const toggleCrt = () => {
    arcadeAudio.playClick();
    setCrtEnabled((prev) => {
      const next = !prev;
      setCrtMode(next);
      return next;
    });
  };

  const insertCoin = () => {
    if (coinPressed) return; // debounce rapid spam clicks
    setCoinPressed(true);
    arcadeAudio.playCoin();
    arcadeHaptics.success();
    addCoins(1);
    window.setTimeout(() => setCoinPressed(false), 350);
  };

  const selectGame = (id) => {
    if (id === activeGame || selectingRef.current) return;
    selectingRef.current = true;
    setSelecting(true);
    arcadeAudio.playClick();
    arcadeHaptics.light();
    if (id !== activeGame) {
      arcadeAudio.stopBgm({ fade: false });
    }
    setActiveGame(id);
    window.setTimeout(() => {
      selectingRef.current = false;
      setSelecting(false);
    }, 180);
  };

  // ---- AI Coach ----
  const refreshCoach = useMemo(
    () => () => {
      if (aiAbort.current) aiAbort.current.abort();
      const controller = new AbortController();
      aiAbort.current = controller;
      const gameId = activeGame;
      setAiState((s) => ({ ...s, status: "loading", gameId }));

      const finish = (descFallback, tipFallback) => {
        setAiState((s) =>
          s.gameId === gameId
            ? {
                ...s,
                status: "done",
                desc: descFallback,
                tip: tipFallback,
                rec: makeRecommendation(),
                refreshed: Date.now(),
              }
            : s,
        );
      };

      // Friendly recommendation based on real statistics.
      const makeRecommendation = () => {
        const g = stats?.games || {};
        const scored = GAMES.map((game) => ({
          ...game,
          n: g[game.id]?.played || 0,
          best: g[game.id]?.best || g[game.id]?.bestStreak || 0,
        }));
        const played = scored.find((x) => x.n > 0);
        if (played) {
          return `${played.label} (${played.n} play${played.n === 1 ? "" : "s"})`;
        }
        return "sorted by health: try 2048 for a calm warm-up.";
      };

      const tipFallback = STATIC_TIPS[gameId] || "";
      const descFallback = STATIC_DESCRIPTIONS[gameId] || active.note;

      // Static content first — UI is instantly useful even offline.
      finish(descFallback, tipFallback);

      if (!isGeminiAvailable()) {
        setAiState((s) => (s.gameId === gameId ? { ...s, status: "offline" } : s));
        return;
      }

      Promise.allSettled([
        geminiGenerate({
          prompt: `Write a punchy 2-sentence game description for "${active.label}". Tone: upbeat, modern mobile-game marketing.`,
          cacheKey: `desc-${gameId}`,
          signal: controller.signal,
        }),
        geminiGenerate({
          prompt: `Give one crisp pro tip (under 160 chars) for the browser game ${active.label} (${gameId}). Be specific and useful.`,
          cacheKey: `tip-${gameId}`,
          signal: controller.signal,
        }),
      ]).then((results) => {
        if (controller.signal.aborted) return;
        const descRes = results[0];
        const tipRes = results[1];
        setAiState((s) => {
          if (s.gameId !== gameId) return s;
          return {
            ...s,
            status: "done",
            desc: descRes?.status === "fulfilled" && descRes.value?.ok
              ? descRes.value.text
              : descFallback,
            tip: tipRes?.status === "fulfilled" && tipRes.value?.ok
              ? tipRes.value.text
              : tipFallback,
            rec: makeRecommendation(),
            refreshed: Date.now(),
          };
        });
      });
    },
    [activeGame, stats, active],
  );

  useEffect(() => {
    refreshCoach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame]);

  // ---- Shop actions ----
  const tryBuy = (item) => {
    if (pendingBuy) return;
    if (isOwned(item.id)) {
      toast({ title: "Already owned", status: "info", duration: 1800, isClosable: true });
      return;
    }
    if (coins < item.price) {
      toast({ title: "Not enough coins", description: "Insert a coin or play a round to earn more.", status: "warning", duration: 2200, isClosable: true });
      return;
    }
    setPendingBuy(item.id);
    requestAnimationFrame(() => {
      const result = purchaseItem(item.id);
      setPendingBuy(null);
      if (result.ok) {
        toast({ title: `Bought ${item.name}!`, status: "success", duration: 2000, isClosable: true });
        arcadeAudio.playScore();
        arcadeHaptics.success();
      } else if (result.reason === "owned") {
        toast({ title: "Already owned", status: "info", duration: 1800, isClosable: true });
      } else if (result.reason === "insufficient") {
        toast({ title: "Not enough coins", status: "warning", duration: 2200, isClosable: true });
      } else if (result.reason === "busy") {
        toast({ title: "Please wait a moment...", status: "info", duration: 1800, isClosable: true });
      } else {
        toast({ title: "Purchase failed", description: "Try again in a second.", status: "error", duration: 2200, isClosable: true });
      }
    });
  };

  const tryEquip = (item) => {
    const isEquippedHere =
      item.type === "bgm"
        ? item.themeId === shop?.bgmTheme
        : getEquippedId(item.scope, item.type) === item.id;
    if (isEquippedHere) {
      const r = unequipItem(item.id);
      if (!r.ok) toast({ title: "Could not unequip", status: "error", duration: 1800, isClosable: true });
    } else {
      const r = equipItem(item.id);
      if (!r.ok) {
        const msg = r.reason === "not-owned" ? "Own it first." : "Could not equip.";
        toast({ title: msg, status: "warning", duration: 1800, isClosable: true });
      }
    }
  };

  // Global keyboard shortcuts for cabinet feeling
  useEffect(() => {
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
      if (e.key === "m" || e.key === "M") toggleSound();
      else if (e.key === "c" || e.key === "C") toggleCrt();
      else {
        const num = Number(e.key);
        if (num >= 1 && num <= GAMES.length) selectGame(GAMES[num - 1].id);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame, coinPressed, isMuted, crtEnabled]);

  const shopGroups = useMemo(() => {
    const order = ["skin", "equipment", "bgm", "asset"];
    return order
      .map((type) => ({ type, items: SHOP_ITEMS.filter((i) => i.type === type) }))
      .filter((group) => group.items.length > 0);
  }, []);

  return (
    <Box minH="100vh" bg={colors.bg} color={colors.text} position="relative">
      <Helmet>
        <title>{"Arcade Cabinet | " + SITE_NAME}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta
          name="description"
          content="Interactive arcade games with ambient music, responsive touch controls, high score tracking, and a coin-powered shop."
        />
        <meta property="og:title" content={"Arcade Cabinet | " + SITE_NAME} />
        <meta
          property="og:description"
          content="Interactive arcade games with ambient music, responsive touch controls, high score tracking, and a coin-powered shop."
        />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {crtEnabled && (
        <Box
          position="fixed"
          inset={0}
          pointerEvents="none"
          zIndex={999}
          background="linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))"
          backgroundSize="100% 3px, 6px 100%"
          opacity={0.75}
        />
      )}

      <Header isDownloading={isDownloading} handleDownload={handleDownload} />

      <Container
        maxW="6xl"
        px={{ base: 3, sm: 5, md: 6 }}
        pt={{ base: 20, md: 28 }}
        pb={{ base: 14, md: 20 }}
      >
        {/* Retro Arcade Marquee Banner */}
        <Box
          bg="#14182b"
          color="#ffffff"
          p={{ base: 4, sm: 6, md: 8 }}
          position="relative"
          overflow="hidden"
          border="3px solid"
          borderColor="#00f5d4"
          boxShadow="0 0 24px rgba(0,245,212,0.2)"
          mb={{ base: 5, md: 8 }}
        >
          <Box
            position="absolute"
            right="-30px"
            top="-45px"
            w="160px"
            h="160px"
            borderRadius="full"
            bg="#f15bb5"
            opacity="0.6"
            filter="blur(30px)"
          />
          <Box
            position="absolute"
            right="110px"
            bottom="-50px"
            w="140px"
            h="140px"
            borderRadius="full"
            bg="#00f5d4"
            opacity="0.6"
            filter="blur(30px)"
          />

          <Box position="relative">
            <Flex
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={3}
              pb={4}
              mb={4}
              borderBottom="1px solid rgba(255,255,255,0.15)"
            >
              <HStack spacing={2}>
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg="#8ac926"
                  boxShadow="0 0 8px #8ac926"
                />
                <Text fontSize="11px" fontWeight="900" letterSpacing="0.1em" color="#00f5d4" textTransform="uppercase">
                  ONLINE CABINET - FREE PLAY
                </Text>
              </HStack>

              <HStack spacing={2}>
                <Button
                  size="xs"
                  bg={coinPressed ? "#00f5d4" : "#ffd166"}
                  color="#171717"
                  fontWeight="900"
                  onClick={insertCoin}
                  leftIcon={<Coins size={13} />}
                  _hover={{ bg: "#ffca3a" }}
                  transform={coinPressed ? "scale(0.95)" : "none"}
                  transition="all .1s ease"
                >
                  INSERT COIN ({coins})
                </Button>

                <Tooltip label="Open the arcade shop">
                  <Button
                    size="xs"
                    bg="#9b5de5"
                    color="#ffffff"
                    fontWeight="900"
                    onClick={onShopOpen}
                    leftIcon={<ShoppingBag size={13} />}
                    _hover={{ bg: "#8b5cf6" }}
                  >
                    SHOP
                  </Button>
                </Tooltip>

                <Tooltip label={crtEnabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines [C]"}>
                  <IconButton
                    size="xs"
                    aria-label="Toggle CRT Mode"
                    icon={<Monitor size={14} />}
                    onClick={toggleCrt}
                    bg={crtEnabled ? "#00f5d4" : "rgba(255,255,255,0.1)"}
                    color={crtEnabled ? "#171717" : "#ffffff"}
                    _hover={{ bg: "#00f5d4", color: "#171717" }}
                  />
                </Tooltip>

                <Tooltip label={isMuted ? "Unmute Sound [M]" : "Mute Sound [M]"}>
                  <IconButton
                    size="xs"
                    aria-label="Toggle Sound"
                    icon={isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    onClick={toggleSound}
                    bg={!isMuted ? "#00f5d4" : "rgba(255,255,255,0.1)"}
                    color={!isMuted ? "#171717" : "#ffffff"}
                    _hover={{ bg: "#00f5d4", color: "#171717" }}
                  />
                </Tooltip>

                <Button
                  size="xs"
                  variant="outline"
                  borderColor="rgba(255,255,255,0.3)"
                  color="#ffffff"
                  onClick={onPassportOpen}
                  leftIcon={<Trophy size={13} color="#ffd166" />}
                  _hover={{ bg: "rgba(255,255,255,0.15)", borderColor: "#ffd166" }}
                >
                  PASSPORT ({unlockedBadges.length}/{ARCADE_ACHIEVEMENTS.length})
                </Button>
              </HStack>
            </Flex>

            <Text
              as="h1"
              fontSize={{ base: "32px", sm: "42px", md: "56px" }}
              fontWeight="900"
              lineHeight="1.05"
              letterSpacing="-0.02em"
              maxW="720px"
            >
              The Retro Arcade Corner
            </Text>
            <Text
              mt={3}
              maxW="580px"
              fontSize={{ base: "14px", md: "16px" }}
              opacity="0.85"
              lineHeight="1.6"
            >
              Nine browser games with relaxing background music, haptic rumble, personal best records, an AI coach, and a coin-powered shop. Swipe on mobile or use arrow keys on desktop.
            </Text>

            <HStack spacing={3} mt={5} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/"
                size="sm"
                bg="#ffffff"
                color="#171717"
                fontWeight="800"
                _hover={{ bg: "#ffca3a" }}
              >
                Back to Portfolio
              </Button>
              <Text fontSize="12px" opacity="0.6" display={{ base: "none", md: "inline" }}>
                Hotkeys: [1-9] switch game &bull; [M] audio mute &bull; [C] CRT scanlines
              </Text>
            </HStack>
          </Box>
        </Box>

        {/* Mobile Horizontal Scrollable Game Selector Bar */}
        <Box display={{ base: "block", md: "none" }} mb={5}>
          <Text
            mb={2}
            fontSize="11px"
            fontWeight="900"
            color={colors.muted}
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            Select Game ({GAMES.length} Active)
          </Text>
          <Box
            overflowX="auto"
            py={1}
            sx={{
              display: "flex",
              gap: "8px",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {GAMES.map((game) => {
              const Icon = game.icon;
              const isSelected = activeGame === game.id;
              return (
                <Button
                  key={game.id}
                  onClick={() => selectGame(game.id)}
                  size="sm"
                  flexShrink={0}
                  h="42px"
                  px={3}
                  bg={isSelected ? game.color : colors.surfaceAlt}
                  color={isSelected ? "#171717" : colors.text}
                  border="2px solid"
                  borderColor={isSelected ? game.color : colors.border}
                  fontWeight="800"
                  fontSize="12px"
                  leftIcon={<Icon size={16} />}
                  boxShadow={isSelected ? `0 0 10px ${game.color}88` : "none"}
                >
                  {game.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Desktop Grid Game Cards */}
        <Grid
          display={{ base: "none", md: "grid" }}
          templateColumns="repeat(3, minmax(0, 1fr))"
          gap={3}
          mb={6}
        >
          {GAMES.map((game) => {
            const Icon = game.icon;
            const isSelected = activeGame === game.id;
            const gameScore = stats?.games?.[game.id]?.best || stats?.games?.[game.id]?.bestStreak || 0;
            return (
              <Button
                key={game.id}
                aria-pressed={isSelected}
                onClick={() => selectGame(game.id)}
                variant="unstyled"
                h="auto"
                minH="92px"
                p={3.5}
                display="flex"
                flexDirection="column"
                alignItems="stretch"
                justifyContent="space-between"
                whiteSpace="normal"
                textAlign="left"
                bg={isSelected ? game.color : colors.surfaceAlt}
                color={isSelected ? "#171717" : colors.text}
                border="2px solid"
                borderColor={isSelected ? game.color : colors.border}
                transform={isSelected ? "translateY(-3px)" : "none"}
                boxShadow={isSelected ? `4px 4px 0 ${game.color}` : "none"}
                transition="all .18s ease"
                _hover={{
                  transform: "translateY(-3px)",
                  borderColor: game.color,
                }}
              >
                <Flex justify="space-between" align="center" w="100%">
                  <HStack spacing={1.5}>
                    <Icon size={16} />
                    <Text fontSize="10px" fontWeight="900" letterSpacing="0.08em" opacity="0.85">
                      [{game.keyNum}] {isSelected ? "ACTIVE" : "READY"}
                    </Text>
                  </HStack>
                  {gameScore > 0 && (
                    <Text fontSize="10px" fontWeight="900" opacity="0.8">
                      BEST: {gameScore}
                    </Text>
                  )}
                </Flex>
                <Box mt={2}>
                  <Text fontSize="15px" fontWeight="900" lineHeight="1.1">
                    {game.label}
                  </Text>
                  <Text mt={0.5} fontSize="12px" opacity="0.75" lineHeight="1.2">
                    {game.note}
                  </Text>
                </Box>
              </Button>
            );
          })}
        </Grid>

        {/* AI Arcade Coach */}
        <Box
          bg={colors.surfaceAlt}
          border="1px solid"
          borderColor={colors.border}
          p={4}
          mb={5}
          position="relative"
        >
          <Flex align="flex-start" gap={3} flexWrap="wrap">
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg="#14182b"
              display="grid"
              placeItems="center"
              color="#00f5d4"
              flexShrink={0}
            >
              {aiState.status === "loading" ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
            </Box>
            <Box flex="1" minW="220px">
              <HStack spacing={2} mb={1}>
                <Text fontSize="13px" fontWeight="900" textTransform="uppercase" letterSpacing="0.06em" color={colors.text}>
                  AI Coach
                </Text>
                {aiState.status === "offline" && (
                  <Text fontSize="11px" color={colors.muted}>
                    (offline - built-in tips shown)
                  </Text>
                )}
                <Tooltip label="Regenerate coach content">
                  <IconButton
                    size="xs"
                    aria-label="Refresh AI coach"
                    icon={<RefreshCw size={12} />}
                    onClick={refreshCoach}
                    bg="transparent"
                    color={colors.muted}
                    _hover={{ color: "#00f5d4" }}
                  />
                </Tooltip>
              </HStack>
              <Text fontSize="14px" lineHeight="1.5" color={colors.text}>
                {aiState.desc || active.note}
              </Text>
              <HStack spacing={2} mt={2} flexWrap="wrap">
                <Box
                  px={2.5}
                  py={1}
                  bg="#00f5d4"
                  color="#171717"
                  fontSize="12px"
                  fontWeight="800"
                  borderRadius="6px"
                >
                  PRO TIP: {aiState.tip || STATIC_TIPS[activeGame]}
                </Box>
                <Box px={2.5} py={1} bg={colors.surface} border="1px solid" borderColor={colors.border} fontSize="12px" fontWeight="700" color={colors.muted} borderRadius="6px">
                  Try next: {aiState.rec || active.label}
                </Box>
              </HStack>
            </Box>
          </Flex>
        </Box>

        {/* Active Game Stage / Cabinet Screen */}
        <Box
          bg={colors.surfaceAlt}
          border="3px solid"
          borderColor={active.color}
          p={{ base: 3, sm: 5, md: 8 }}
          boxShadow={`6px 6px 0 ${active.color}`}
          position="relative"
        >
          <ArcadeGameBoundary colors={colors} key={activeGame}>
            {selecting ? <Box p={10} textAlign="center"><Spinner size="xl" /></Box> : <ActiveGame />}
          </ArcadeGameBoundary>
        </Box>
      </Container>

      {/* Arcade Passport Drawer (Stats & Achievements) */}
      <Drawer isOpen={passportOpen} placement="right" onClose={onPassportClose} size="md">
        <DrawerOverlay backdropFilter="blur(3px)" />
        <DrawerContent bg={colors.surfaceAlt} color={colors.text} borderLeft="3px solid #00f5d4">
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor={colors.border}>
            <HStack spacing={2}>
              <Trophy size={20} color="#00f5d4" />
              <Text fontSize="18px" fontWeight="900">
                Arcade Passport & Stats
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody py={5}>
            <Box p={4} bg={colors.surface} border="1px solid" borderColor={colors.border} mb={5}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="12px" fontWeight="800" color={colors.muted} textTransform="uppercase">
                  Badges Unlocked
                </Text>
                <Text fontSize="13px" fontWeight="900" color="#00f5d4">
                  {unlockedBadges.length} / {ARCADE_ACHIEVEMENTS.length}
                </Text>
              </Flex>
              <Progress
                value={(unlockedBadges.length / ARCADE_ACHIEVEMENTS.length) * 100}
                size="sm"
                colorScheme="teal"
                bg={colors.border}
              />
              <HStack justify="space-between" mt={4} pt={3} borderTop="1px solid" borderColor={colors.border}>
                <Box textAlign="center" flex="1">
                  <Text fontSize="10px" color={colors.muted} fontWeight="800">TOTAL SESSIONS</Text>
                  <Text fontSize="18px" fontWeight="900">{stats?.totalPlayed || 0}</Text>
                </Box>
                <Box textAlign="center" flex="1">
                  <Text fontSize="10px" color={colors.muted} fontWeight="800">COINS WALLET</Text>
                  <Text fontSize="18px" fontWeight="900" color="#ffd166">{coins}</Text>
                </Box>
              </HStack>
            </Box>

            <Text fontSize="13px" fontWeight="900" textTransform="uppercase" letterSpacing="0.06em" mb={3}>
              Cabinet Achievements
            </Text>
            <SimpleGrid columns={1} gap={2.5}>
              {ARCADE_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedBadges.includes(ach.id);
                return (
                  <Flex
                    key={ach.id}
                    p={3}
                    align="center"
                    gap={3}
                    border="1px solid"
                    borderColor={isUnlocked ? "#00f5d4" : colors.border}
                    bg={isUnlocked ? colors.surface : "transparent"}
                    opacity={isUnlocked ? 1 : 0.55}
                  >
                    <Box
                      w="36px"
                      h="36px"
                      display="grid"
                      placeItems="center"
                      bg={isUnlocked ? "#00f5d4" : colors.surface}
                      color={isUnlocked ? "#171717" : colors.muted}
                      border="1px solid"
                      borderColor={isUnlocked ? "#00f5d4" : colors.border}
                    >
                      <Trophy size={18} />
                    </Box>
                    <Box flex="1">
                      <Flex justify="space-between" align="center">
                        <Text fontSize="14px" fontWeight="800">
                          {ach.title}
                        </Text>
                        {isUnlocked && (
                          <Text fontSize="10px" fontWeight="900" color="#00f5d4">
                            UNLOCKED
                          </Text>
                        )}
                      </Flex>
                      <Text fontSize="12px" color={colors.muted} mt={0.5}>
                        {ach.desc}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </SimpleGrid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Arcade Shop Drawer */}
      <Drawer isOpen={shopOpen} placement="right" onClose={onShopClose} size="md">
        <DrawerOverlay backdropFilter="blur(3px)" />
        <DrawerContent bg={colors.surfaceAlt} color={colors.text} borderLeft="3px solid #ffd166">
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor={colors.border}>
            <HStack spacing={2}>
              <ShoppingBag size={20} color="#ffd166" />
              <Text fontSize="18px" fontWeight="900">
                Arcade Shop
              </Text>
              <Box ml="auto" px={3} py={1} bg="#ffd166" color="#171717" borderRadius="6px" fontWeight="900" fontSize="13px">
                <HStack spacing={1}>
                  <Coins size={14} />
                  <Text>{coins}</Text>
                </HStack>
              </Box>
            </HStack>
          </DrawerHeader>
          <DrawerBody py={4}>
            <Text fontSize="12px" color={colors.muted} mb={4} lineHeight="1.5">
              Spend your hard-earned coins. Skins and equipment apply to a game on its next run. BGM themes change the music everywhere.
            </Text>
            {shopGroups.map((group) => (
              <Box key={group.type} mb={5}>
                <Text fontSize="12px" fontWeight="900" textTransform="uppercase" letterSpacing="0.06em" mb={2} color={colors.text}>
                  {group.type === "skin" ? "Skins" : group.type === "equipment" ? "Equipment & Power-Ups" : group.type === "bgm" ? "BGM Music" : "Collectible Assets"}
                </Text>
                <SimpleGrid columns={1} gap={2.5}>
                  {group.items.map((item) => {
                    const ownedItem = owned.includes(item.id);
                    const isEquipped =
                      item.type === "bgm"
                        ? item.themeId === shop?.bgmTheme
                        : getEquippedId(item.scope, item.type) === item.id;
                    const canAfford = coins >= item.price;
                    return (
                      <Flex
                        key={item.id}
                        p={3}
                        gap={3}
                        align="center"
                        border="1px solid"
                        borderColor={isEquipped ? item.color : colors.border}
                        bg={isEquipped ? colors.surface : "transparent"}
                        boxShadow={isEquipped ? `0 0 10px ${item.color}44` : "none"}
                      >
                        <Box
                          w="40px"
                          h="40px"
                          flexShrink={0}
                          display="grid"
                          placeItems="center"
                          borderRadius="8px"
                          bg={`${item.color}22`}
                          color={item.color}
                          border="1px solid"
                          borderColor={item.color}
                        >
                          <Wrench size={18} />
                        </Box>
                        <Box flex="1" minW="0">
                          <Flex align="center" gap={2} flexWrap="wrap">
                            <Text fontSize="14px" fontWeight="800">{item.name}</Text>
                            {isEquipped && (
                              <Text fontSize="10px" fontWeight="900" color="#00f5d4">EQUIPPED</Text>
                            )}
                          </Flex>
                          <Text fontSize="12px" color={colors.muted} lineHeight="1.4">
                            {item.desc}
                          </Text>
                        </Box>
                        <Box flexShrink={0}>
                          {ownedItem ? (
                            item.type === "asset" ? (
                              <Text fontSize="11px" fontWeight="900" color="#ffca3a">
                                <Check size={13} style={{ display: "inline" }} /> OWNED
                              </Text>
                            ) : (
                              <Button
                                size="xs"
                                onClick={() => tryEquip(item)}
                                bg={isEquipped ? "transparent" : "#00f5d4"}
                                color={isEquipped ? "#00f5d4" : "#171717"}
                                border={isEquipped ? "2px solid #00f5d4" : "none"}
                                fontWeight="900"
                                _hover={{ bg: isEquipped ? "#171717" : "#8ac926" }}
                              >
                                {isEquipped ? "Unequip" : "Equip"}
                              </Button>
                            )
                          ) : (
                            <Button
                              size="xs"
                              onClick={() => tryBuy(item)}
                              isDisabled={!canAfford || pendingBuy === item.id}
                              bg={canAfford ? "#ffd166" : colors.surface}
                              color={canAfford ? "#171717" : colors.muted}
                              fontWeight="900"
                              _hover={canAfford ? { bg: "#ffca3a" } : {}}
                              leftIcon={pendingBuy === item.id ? <Loader2 size={12} className="spin" /> : <Coins size={12} />}
                            >
                              {item.price}
                            </Button>
                          )}
                        </Box>
                      </Flex>
                    );
                  })}
                </SimpleGrid>
              </Box>
            ))}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid" borderColor={colors.border}>
            <Button size="sm" variant="ghost" onClick={insertCoin} leftIcon={<Coins size={14} />} color={colors.text}>
              Insert Coin (+1)
            </Button>
            <Button size="sm" bg="#00f5d4" color="#171717" fontWeight="800" ml={2} onClick={onShopClose}>
              Done
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Arcade;