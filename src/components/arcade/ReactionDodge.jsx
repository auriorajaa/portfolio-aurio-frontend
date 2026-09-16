import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const LOGICAL_W = 360;
const LOGICAL_H = 420;
const ROUND_MS = 20000;
const PLAYER_W = 40;
const PLAYER_H = 34;
const PLAYER_BOTTOM = 22;
const PLAYER_Y = LOGICAL_H - PLAYER_BOTTOM - PLAYER_H;
const BLOCK_BASE_SPEED = 95;
const BLOCK_MAX_SPEED = 190;

const ReactionDodge = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("dodge"));
  const skinColors = shop?.skin?.colors || null;
  const palette = {
    p: skinColors?.p || "#00f5d4",
    s: skinColors?.s || "#00bbf9",
  };
  const shieldPerk = shop?.perks?.dodgeShield || 0;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | playing | over | finished
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [shields, setShields] = useState(0);
  const shieldsRef = useRef(0);
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.dodge?.best || 0;
  });

  const gameRef = useRef({
    started: 0,
    last: 0,
    playerX: LOGICAL_W / 2 - PLAYER_W / 2,
    targetX: LOGICAL_W / 2 - PLAYER_W / 2,
    meteorites: [],
    particles: [],
    nextSpawn: 0,
  });

  const pointerActive = useRef(false);

  const clamp = (val) => Math.max(4, Math.min(LOGICAL_W - PLAYER_W - 4, val));

  // Draw sci-fi starship / hovercraft
  const drawStarship = (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);

    // Thruster flame particles
    if (running) {
      for (let i = 0; i < 2; i++) {
        gameRef.current.particles.push({
          x: x + PLAYER_W / 2 + (Math.random() - 0.5) * 8,
          y: y + PLAYER_H,
          vx: (Math.random() - 0.5) * 20,
          vy: 60 + Math.random() * 40,
          size: 3 + Math.random() * 3,
          color: Math.random() < 0.5 ? palette.p : palette.s,
          alpha: 0.9,
        });
      }
    }

    // Ship Wings
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = palette.p;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PLAYER_W / 2, 0); // Nose tip
    ctx.lineTo(PLAYER_W, PLAYER_H - 4); // Right wing tip
    ctx.lineTo(PLAYER_W / 2 + 6, PLAYER_H - 10);
    ctx.lineTo(PLAYER_W / 2 - 6, PLAYER_H - 10);
    ctx.lineTo(0, PLAYER_H - 4); // Left wing tip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ship Cockpit / Core
    ctx.fillStyle = palette.p;
    ctx.beginPath();
    ctx.ellipse(PLAYER_W / 2, PLAYER_H / 2 - 2, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wingtip Plasma Cannons
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(1, PLAYER_H - 12, 3, 8);
    ctx.fillRect(PLAYER_W - 4, PLAYER_H - 12, 3, 8);

    ctx.restore();
  };

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

    // Deep space background grid
    ctx.strokeStyle = "rgba(148,163,184,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < LOGICAL_W; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, LOGICAL_H);
      ctx.stroke();
    }

    // Red Danger Threshold Line
    ctx.strokeStyle = "rgba(255,107,107,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, PLAYER_Y + PLAYER_H + 4);
    ctx.lineTo(LOGICAL_W, PLAYER_Y + PLAYER_H + 4);
    ctx.stroke();
    ctx.setLineDash([]);

    const { playerX, meteorites, particles } = gameRef.current;

    // Thruster exhaust particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    // Falling Meteorites / Plasma Bombs
    meteorites.forEach((m) => {
      ctx.save();
      ctx.translate(m.x + m.size / 2, m.y + m.size / 2);

      // Meteorite fire trail
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, m.size / 2 + 4);
      grad.addColorStop(0, "#ffd166");
      grad.addColorStop(0.5, "#ff6b6b");
      grad.addColorStop(1, "rgba(255,107,107,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, m.size / 2 + 4, 0, Math.PI * 2);
      ctx.fill();

      // Meteorite rock core
      ctx.fillStyle = "#331a24";
      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, m.size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cracks
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -4);
      ctx.lineTo(2, 2);
      ctx.lineTo(5, -2);
      ctx.stroke();

      ctx.restore();
    });

    // Starship Player
    drawStarship(ctx, playerX, PLAYER_Y);

    // Active shield (Equipment perk)
    if (shieldsRef.current > 0) {
      ctx.save();
      ctx.strokeStyle = palette.p;
      ctx.globalAlpha = 0.7 + Math.sin(performance.now() / 180) * 0.15;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        playerX + PLAYER_W / 2,
        PLAYER_Y + PLAYER_H / 2,
        PLAYER_W * 0.75,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.restore();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = setupHiDPICanvas(canvasRef.current, LOGICAL_W, LOGICAL_H);
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      arcadeAudio.stopBgm({ fade: false });
    },
    [],
  );

  const start = (e) => {
    if (e) e.stopPropagation();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("dodge");
    arcadeHaptics.medium();

    const startX = LOGICAL_W / 2 - PLAYER_W / 2;
    gameRef.current = {
      started: performance.now(),
      last: performance.now(),
      playerX: startX,
      targetX: startX,
      meteorites: [],
      particles: [],
      nextSpawn: 0,
    };
    setScore(0);
    setTime(20);
    shieldsRef.current = shieldPerk;
    setShields(shieldPerk);
    setStatus("playing");
    setRunning(true);
  };

  const nudgePlayer = (delta) => {
    if (status !== "playing") return;
    arcadeAudio.playMove();
    gameRef.current.targetX = clamp(gameRef.current.targetX + delta);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (status !== "playing") return;
      if (["ArrowLeft", "a", "A"].includes(event.key)) {
        event.preventDefault();
        nudgePlayer(-38);
      } else if (["ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        nudgePlayer(38);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (!running) return undefined;

    const tick = (now) => {
      const game = gameRef.current;
      if (document.hidden) {
        game.last = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const delta = Math.min(50, now - game.last);
      const dt = delta / 1000;
      game.last = now;
      const elapsed = now - game.started;

      // Smooth interpolation to target
      game.playerX = clamp(game.playerX + (game.targetX - game.playerX) * 0.35);

      // Update particles
      game.particles = game.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          alpha: p.alpha - dt * 2,
        }))
        .filter((p) => p.alpha > 0);

      // Spawn falling meteorites
      game.nextSpawn -= delta;
      if (game.nextSpawn <= 0) {
        const size = 26 + Math.random() * 16;
        game.meteorites.push({
          id: now,
          x: Math.random() * (LOGICAL_W - size),
          y: -size,
          size,
          speed: Math.min(BLOCK_MAX_SPEED, BLOCK_BASE_SPEED + elapsed / 160),
        });
        game.nextSpawn = Math.max(240, 700 - elapsed / 36);
      }

      // Move meteorites
      game.meteorites = game.meteorites
        .map((m) => ({ ...m, y: m.y + (m.speed * delta) / 1000 }))
        .filter((m) => m.y < LOGICAL_H + 40);

      // Collision detection
      const shipBox = {
        left: game.playerX + 6,
        right: game.playerX + PLAYER_W - 6,
        top: PLAYER_Y + 4,
        bottom: PLAYER_Y + PLAYER_H,
      };

      const hitTest = (m) => {
        const rad = m.size / 2 - 2;
        const cx = m.x + m.size / 2;
        const cy = m.y + m.size / 2;
        return (
          cx + rad > shipBox.left &&
          cx - rad < shipBox.right &&
          cy + rad > shipBox.top &&
          cy - rad < shipBox.bottom
        );
      };

      let hit = game.meteorites.some(hitTest);

      // Shield equipment absorbs a hit before the hull is compromised.
      if (hit && shieldsRef.current > 0) {
        game.meteorites = game.meteorites.filter((m) => !hitTest(m));
        shieldsRef.current -= 1;
        setShields(shieldsRef.current);
        arcadeAudio.playMove();
        arcadeHaptics.medium();
        hit = false;
      }

      const nextScore = Math.floor(elapsed / 100);
      setScore(nextScore);
      setTime(Math.max(0, Math.ceil((ROUND_MS - elapsed) / 1000)));

      draw();

      if (hit || elapsed >= ROUND_MS) {
        setRunning(false);
        const didWin = !hit && elapsed >= ROUND_MS;
        setStatus(didWin ? "finished" : "over");

        if (didWin) {
          arcadeAudio.playWin();
          arcadeHaptics.success();
        } else {
          arcadeAudio.playHit();
          arcadeHaptics.danger();
        }
        arcadeAudio.stopBgm({ fade: true });

        setBest((current) => {
          const next = Math.max(current, nextScore);
          recordGameSession("dodge", next);
          return next;
        });
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const moveToClientX = (clientX, element) => {
    if (status !== "playing") return;
    const rect = element.getBoundingClientRect();
    const scaledX = (clientX - rect.left) * (LOGICAL_W / rect.width);
    gameRef.current.targetX = clamp(scaledX - PLAYER_W / 2);
  };

  const handlePointerDown = (e) => {
    if (status !== "playing") return;
    e.preventDefault();
    pointerActive.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    moveToClientX(e.clientX, e.currentTarget);
  };

  const handlePointerMove = (e) => {
    if (status !== "playing") return;
    if (pointerActive.current) {
      e.preventDefault();
      moveToClientX(e.clientX, e.currentTarget);
    }
  };

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Reaction Dodge
            </Text>
            <Box px={2} py={0.5} bg="#00bbf9" color="#171717" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Survival
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Steer your starship through falling space meteorites for 20 seconds.
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
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color={time <= 5 ? "#ff6b6b" : colors.text}>
              {time}s
            </Text>
          </Box>
          {shieldPerk > 0 && (
            <Box border="1px solid" borderColor={palette.p} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
              <Text fontSize="10px" fontWeight="800" color={colors.muted}>
                SHIELD
              </Text>
              <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color={palette.p}>
                {shields}
              </Text>
            </Box>
          )}
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", sm: "360px", md: "420px" }} mx="auto">
        <Box
          position="relative"
          w="100%"
          aspectRatio={LOGICAL_W / LOGICAL_H}
          bg="#070a14"
          border="2px solid"
          borderColor={colors.border}
          overflow="hidden"
          userSelect="none"
          sx={{
            touchAction: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            pointerActive.current = false;
          }}
          onPointerCancel={() => {
            pointerActive.current = false;
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* In-Window Overlay */}
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
              zIndex={10}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {status === "finished" ? (
                <Trophy size={42} color="#00f5d4" />
              ) : status === "over" ? (
                <Zap size={42} color="#ff6b6b" />
              ) : null}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {status === "idle"
                  ? "Starship Ready"
                  : status === "finished"
                    ? "Full Trial Survived!"
                    : "Hull Compromised!"}
              </Text>
              <Text mt={2} fontSize={{ base: "13px", md: "14px" }} opacity={0.9}>
                {status === "idle"
                  ? "Drag left and right, use A/D, or tap touch arrows."
                  : status === "finished"
                    ? `Flawless evasion! Final Score: ${score}.`
                    : `Impact detected! Final Score: ${score}.`}
              </Text>
              <Button
                mt={4}
                size="md"
                bg="#00f5d4"
                color="#171717"
                fontWeight="800"
                _hover={{ bg: "#8ac926" }}
                leftIcon={<Play size={15} />}
                onPointerDown={start}
                onClick={start}
              >
                {status === "idle" ? "Start Trial" : "Try Again"}
              </Button>
            </Flex>
          )}
        </Box>

        {/* Mobile Left / Right Buttons */}
        <Flex
          display={{ base: "flex", md: "none" }}
          justify="center"
          gap={4}
          mt={3}
        >
          <Button
            size="md"
            w="48%"
            h="48px"
            bg={colors.surface}
            border="2px solid"
            borderColor={colors.border}
            onClick={() => nudgePlayer(-36)}
            leftIcon={<ArrowLeft size={20} />}
          >
            Move LEFT
          </Button>
          <Button
            size="md"
            w="48%"
            h="48px"
            bg={colors.surface}
            border="2px solid"
            borderColor={colors.border}
            onClick={() => nudgePlayer(36)}
            rightIcon={<ArrowRight size={20} />}
          >
            Move RIGHT
          </Button>
        </Flex>

        <Text mt={3} textAlign="center" fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
          Drag with finger or mouse. Use A/D and arrow keys on desktop.
        </Text>

        {/* Outside Window Controls */}
        <HStack justify="center" mt={4} spacing={2}>
          <Button
            onClick={start}
            onPointerDown={start}
            variant="studio"
            isDisabled={status === "playing"}
            leftIcon={status === "playing" ? undefined : <Play size={14} />}
          >
            {status === "playing" ? "Evading Hazards" : status === "idle" ? "Start Trial" : "Run Again"}
          </Button>
          {status !== "idle" && (
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

export default ReactionDodge;