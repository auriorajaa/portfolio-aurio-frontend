import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { ArrowUp, Play, RotateCcw, Trophy } from "lucide-react";
import { useStudioColors } from "../public/studio";
import { setupHiDPICanvas } from "./canvasUtils";
import {
  arcadeAudio,
  arcadeHaptics,
  loadArcadeStats,
  recordGameSession,
} from "../../services/arcadeService";
import { getShopSnapshot } from "../../services/shopService";

const LOGICAL_W = 600;
const LOGICAL_H = 340;
const GROUND_Y = 270;
const RUNNER_W = 32;
const RUNNER_H = 46;
const GRAVITY = 1600; // px/sec^2
const JUMP_FORCE = -540; // px/sec

const DEFAULT_PALETTE = { p: "#00f5d4", s: "#0bbfa0", coin: "#ffd166", enemy: "#ff6b6b" };

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : "255, 255, 255";
};

const EndlessRunner = () => {
  const colors = useStudioColors();
  const [shop] = useState(() => getShopSnapshot("runner"));
  const palette = shop?.skin?.colors ? { ...DEFAULT_PALETTE, ...shop.skin.colors } : DEFAULT_PALETTE;
  const magnet = Boolean(shop?.perks?.runnerMagnet);
  const magnetRadius = magnet ? 64 : 22;
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coinsCount, setCoinsCount] = useState(0);
  const [best, setBest] = useState(() => {
    const stats = loadArcadeStats();
    return stats.games?.runner?.best || 0;
  });

  const gameRef = useRef({
    started: 0,
    last: 0,
    runner: {
      x: 70,
      y: GROUND_Y - RUNNER_H,
      vy: 0,
      isGrounded: true,
      legCycle: 0,
    },
    speed: 280,
    obstacles: [],
    coins: [],
    particles: [],
    nextSpawn: 0,
    bgOffset1: 0,
    bgOffset2: 0,
    groundOffset: 0,
    coinsCollected: 0,
    score: 0,
  });

  // Draw animated runner character on HiDPI canvas
  const drawRunner = (ctx, r) => {
    const { x, y, isGrounded, legCycle } = r;

    // Dust particles when running on the ground
    if (isGrounded && Math.random() < 0.4) {
      gameRef.current.particles.push({
        x: x + 2,
        y: GROUND_Y - 2,
        vx: -80 - Math.random() * 60,
        vy: -20 - Math.random() * 30,
        size: 3 + Math.random() * 3,
        alpha: 0.8,
      });
    }

    ctx.save();
    ctx.translate(x, y);

    // Torso (Cyber Armor)
    ctx.fillStyle = palette.p;
    ctx.fillRect(8, 14, 16, 18);
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 14, 16, 18);

    // Cyber Visor Head
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 2, 14, 12);
    ctx.strokeRect(10, 2, 14, 12);
    // Glowing Visor
    ctx.fillStyle = palette.enemy;
    ctx.fillRect(14, 5, 10, 4);

    if (isGrounded) {
      // Running legs (animating angle with legCycle)
      const legPhase = Math.sin(legCycle);
      // Back leg
      ctx.strokeStyle = palette.s;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(12, 32);
      ctx.lineTo(12 - legPhase * 12, 44);
      ctx.stroke();

      // Front leg
      ctx.strokeStyle = "#171717";
      ctx.beginPath();
      ctx.moveTo(20, 32);
      ctx.lineTo(20 + legPhase * 12, 44);
      ctx.stroke();

      // Sneakers
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(12 - legPhase * 12 - 3, 42, 7, 4);
      ctx.fillRect(20 + legPhase * 12 - 3, 42, 7, 4);

      // Arms
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(16, 18);
      ctx.lineTo(16 + legPhase * 10, 28);
      ctx.stroke();
    } else {
      // Jump pose (tucked forward)
      ctx.strokeStyle = "#171717";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(12, 32);
      ctx.lineTo(4, 38);
      ctx.lineTo(10, 42);
      ctx.moveTo(20, 32);
      ctx.lineTo(28, 38);
      ctx.lineTo(22, 42);
      ctx.stroke();

      // Raised arms
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(16, 16);
      ctx.lineTo(26, 8);
      ctx.stroke();
    }

    ctx.restore();
  };

  const draw = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const game = gameRef.current;

    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

    // 1. Sky & Stars Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, "#0a0c18");
    skyGrad.addColorStop(1, "#181d36");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, LOGICAL_W, GROUND_Y);

    // Glowing Cyber Moon
    ctx.fillStyle = palette.coin;
    ctx.shadowColor = palette.coin;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(520, 50, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Far Parallax City Skyline (Slow)
    ctx.fillStyle = "#1c223d";
    const bldWidth = 44;
    for (let i = -1; i < LOGICAL_W / bldWidth + 2; i++) {
      const bx = i * bldWidth - (game.bgOffset1 % bldWidth);
      const bH = 60 + Math.sin(i * 1.5) * 35;
      ctx.fillRect(bx, GROUND_Y - bH, bldWidth - 2, bH);
      // Windows
      ctx.fillStyle = "rgba(255,202,58,0.2)";
      ctx.fillRect(bx + 6, GROUND_Y - bH + 8, 6, 8);
      ctx.fillRect(bx + 18, GROUND_Y - bH + 8, 6, 8);
      ctx.fillRect(bx + 6, GROUND_Y - bH + 24, 6, 8);
      ctx.fillStyle = "#1c223d";
    }

    // 3. Mid Parallax Industrial Skyline (Medium)
    ctx.fillStyle = "#273056";
    const midWidth = 60;
    for (let i = -1; i < LOGICAL_W / midWidth + 2; i++) {
      const mx = i * midWidth - (game.bgOffset2 % midWidth);
      const mH = 35 + ((i * 7) % 25);
      ctx.fillRect(mx, GROUND_Y - mH, midWidth - 4, mH);
      // Neon rooftop antenna
      ctx.strokeStyle = palette.p;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx + midWidth / 2, GROUND_Y - mH);
      ctx.lineTo(mx + midWidth / 2, GROUND_Y - mH - 12);
      ctx.stroke();
    }

    // 4. Ground Roadway
    ctx.fillStyle = "#121422";
    ctx.fillRect(0, GROUND_Y, LOGICAL_W, LOGICAL_H - GROUND_Y);

    // Neon Road Edge
    ctx.strokeStyle = palette.p;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(LOGICAL_W, GROUND_Y);
    ctx.stroke();

    // Road Grid Stripes (Moving Fast)
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 16]);
    ctx.beginPath();
    ctx.moveTo(- (game.groundOffset % 30), GROUND_Y + 16);
    ctx.lineTo(LOGICAL_W + 30, GROUND_Y + 16);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Particles (Runner dust)
    game.particles.forEach((p) => {
      ctx.fillStyle = `rgba(${hexToRgb(palette.p)}, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    // 6. Collectible Gold Energy Coins
    game.coins.forEach((c) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      // Spinning ellipse
      const wobble = Math.abs(Math.sin(c.angle));
      ctx.fillStyle = palette.coin;
      ctx.shadowColor = palette.coin;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 * Math.max(0.2, wobble), 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    // 7. Recognizable Obstacles
    game.obstacles.forEach((o) => {
      if (o.type === "spike") {
        // Ground Hazard Spikes (Must Jump)
        ctx.fillStyle = palette.enemy;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(o.x, GROUND_Y);
        ctx.lineTo(o.x + o.w / 2, GROUND_Y - o.h);
        ctx.lineTo(o.x + o.w, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner hazard stripe
        ctx.fillStyle = "#ffca3a";
        ctx.beginPath();
        ctx.moveTo(o.x + o.w * 0.3, GROUND_Y);
        ctx.lineTo(o.x + o.w / 2, GROUND_Y - o.h * 0.6);
        ctx.lineTo(o.x + o.w * 0.7, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      } else if (o.type === "barrier") {
        // High Neon Barrier
        ctx.fillStyle = palette.enemy;
        ctx.fillRect(o.x, GROUND_Y - o.h, o.w, o.h);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(o.x, GROUND_Y - o.h, o.w, o.h);

        // Warning light on top
        ctx.fillStyle = "#ffca3a";
        ctx.fillRect(o.x + 4, GROUND_Y - o.h - 6, o.w - 8, 6);
      } else if (o.type === "drone") {
        // Flying Cyber Drone
        ctx.save();
        ctx.translate(o.x + o.w / 2, o.y + o.h / 2);

        // Body
        ctx.fillStyle = "#273056";
        ctx.fillRect(-14, -8, 28, 16);
        ctx.strokeStyle = palette.enemy;
        ctx.lineWidth = 2;
        ctx.strokeRect(-14, -8, 28, 16);

        // Red Sensor Eye
        ctx.fillStyle = palette.enemy;
        ctx.shadowColor = palette.enemy;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Spinning Propellers
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, -10);
        ctx.lineTo(18, -10);
        ctx.stroke();

        ctx.restore();
      }
    });

    // 8. Runner Character
    drawRunner(ctx, game.runner);
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

  const jump = () => {
    if (status !== "playing") return;
    const r = gameRef.current.runner;
    if (r.isGrounded) {
      r.vy = JUMP_FORCE;
      r.isGrounded = false;
      arcadeAudio.playJump();
      arcadeHaptics.light();
    }
  };

  const start = (e) => {
    if (e) e.stopPropagation();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    arcadeAudio.playCoin();
    arcadeAudio.startBgm("runner");
    arcadeHaptics.medium();

    gameRef.current = {
      started: performance.now(),
      last: performance.now(),
      runner: {
        x: 70,
        y: GROUND_Y - RUNNER_H,
        vy: 0,
        isGrounded: true,
        legCycle: 0,
      },
      speed: 280,
      obstacles: [],
      coins: [],
      particles: [],
      nextSpawn: 0.8,
      bgOffset1: 0,
      bgOffset2: 0,
      groundOffset: 0,
      coinsCollected: 0,
      score: 0,
    };
    setScore(0);
    setDistance(0);
    setCoinsCount(0);
    setStatus("playing");
    setRunning(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (status !== "playing") return;
      if (["ArrowUp", "w", "W", " "].includes(e.key)) {
        e.preventDefault();
        jump();
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
      const dt = Math.min(0.04, (now - game.last) / 1000 || 0);
      game.last = now;

      // Accelerate gradually
      game.speed = Math.min(480, game.speed + dt * 4);

      // Update Parallax Offsets
      game.bgOffset1 += game.speed * dt * 0.2;
      game.bgOffset2 += game.speed * dt * 0.5;
      game.groundOffset += game.speed * dt;

      // Update Runner Physics
      const r = game.runner;
      r.vy += GRAVITY * dt;
      r.y += r.vy * dt;

      if (r.y >= GROUND_Y - RUNNER_H) {
        r.y = GROUND_Y - RUNNER_H;
        r.vy = 0;
        r.isGrounded = true;
        r.legCycle += game.speed * dt * 0.04;
      } else {
        r.isGrounded = false;
      }

      // Update Particles
      game.particles = game.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          alpha: p.alpha - dt * 1.5,
        }))
        .filter((p) => p.alpha > 0);

      // Spawner: Spikes, Barriers, or Drones + Energy Coins
      game.nextSpawn -= dt;
      if (game.nextSpawn <= 0) {
        const pickType = Math.random();
        if (pickType < 0.45) {
          // Ground Spikes
          game.obstacles.push({
            type: "spike",
            x: LOGICAL_W + 20,
            y: GROUND_Y - 32,
            w: 30,
            h: 32,
          });
        } else if (pickType < 0.75) {
          // Barrier block
          game.obstacles.push({
            type: "barrier",
            x: LOGICAL_W + 20,
            y: GROUND_Y - 38,
            w: 26,
            h: 38,
          });
        } else {
          // High Flying Cyber Drone (Jump or run under)
          game.obstacles.push({
            type: "drone",
            x: LOGICAL_W + 20,
            y: GROUND_Y - 80,
            w: 34,
            h: 22,
          });
        }

        // Spawn Coin trail
        if (Math.random() < 0.6) {
          const coinY = Math.random() < 0.5 ? GROUND_Y - 70 : GROUND_Y - 30;
          game.coins.push({
            x: LOGICAL_W + 60,
            y: coinY,
            angle: 0,
          });
        }

        game.nextSpawn = 1.0 + Math.random() * 1.1 - Math.min(0.5, (now - game.started) / 60000);
      }

      // Move Obstacles
      game.obstacles.forEach((o) => {
        o.x -= game.speed * dt;
      });
      game.obstacles = game.obstacles.filter((o) => o.x + o.w > -20);

      // Move Coins & animate spin
      game.coins.forEach((c) => {
        c.x -= game.speed * dt;
        c.angle += dt * 6;
      });

      // Coin Pickups (Magnet perk widens the pickup radius)
      game.coins = game.coins.filter((coin) => {
        const hitsCoin =
          Math.abs(r.x + RUNNER_W / 2 - coin.x) < magnetRadius &&
          Math.abs(r.y + RUNNER_H / 2 - coin.y) < (magnet ? 44 : 28);
        if (hitsCoin) {
          game.coinsCollected += 1;
          game.score += 15;
          setCoinsCount(game.coinsCollected);
          arcadeAudio.playScore();
          arcadeHaptics.light();
        }
        return !hitsCoin;
      });
      game.coins = game.coins.filter((c) => c.x > -20);

      // Collision Detection with Obstacles
      const runnerBox = {
        left: r.x + 6,
        right: r.x + RUNNER_W - 6,
        top: r.y + 4,
        bottom: r.y + RUNNER_H,
      };

      const hit = game.obstacles.some((o) => {
        const obsBox = {
          left: o.x + 4,
          right: o.x + o.w - 4,
          top: o.y,
          bottom: o.y + o.h,
        };
        return (
          runnerBox.right > obsBox.left &&
          runnerBox.left < obsBox.right &&
          runnerBox.bottom > obsBox.top &&
          runnerBox.top < obsBox.bottom
        );
      });

      const distMeters = Math.floor((now - game.started) / 90);
      const totalScore = distMeters + game.coinsCollected * 15;
      game.score = totalScore;
      setDistance(distMeters);
      setScore(totalScore);

      draw();

      if (hit) {
        setRunning(false);
        setStatus("over");
        arcadeAudio.playHit();
        arcadeAudio.stopBgm({ fade: true });
        arcadeHaptics.danger();

        setBest((curr) => {
          const next = Math.max(curr, totalScore);
          recordGameSession("runner", next);
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

  return (
    <Box w="100%">
      <HStack justify="space-between" flexWrap="wrap" gap={3} mb={5}>
        <Box>
          <HStack spacing={2}>
            <Text fontSize={{ base: "18px", md: "22px" }} fontWeight="800">
              Endless Runner
            </Text>
            <Box px={2} py={0.5} bg="#ff6b6b" color="#fff" fontSize="10px" fontWeight="800" textTransform="uppercase">
              Side-Scroller
            </Box>
          </HStack>
          <Text mt={1} fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
            Leap over ground spikes, dodge cyber drones, and grab energy coins!
          </Text>
        </Box>
        <HStack spacing={2}>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              DIST
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#00f5d4">
              {distance}m
            </Text>
          </Box>
          <Box border="1px solid" borderColor={colors.border} bg={colors.surface} px={{ base: 2.5, md: 3 }} py={1.5} textAlign="center" minW="55px">
            <Text fontSize="10px" fontWeight="800" color={colors.muted}>
              COINS
            </Text>
            <Text fontWeight="800" fontSize={{ base: "14px", md: "16px" }} color="#ffd166">
              {coinsCount}
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
        </HStack>
      </HStack>

      <Box maxW={{ base: "100%", md: "620px" }} mx="auto">
        {/* Game Stage */}
        <Box
          position="relative"
          w="100%"
          aspectRatio={LOGICAL_W / LOGICAL_H}
          bg="#0a0c18"
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
          onPointerDown={() => {
            if (status === "playing") jump();
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* In-Window Overlay (Proper pointer event isolation) */}
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
              {status === "over" && score >= best && score > 0 ? (
                <Trophy size={42} color="#ffd166" />
              ) : null}
              <Text fontWeight="800" fontSize="22px" mt={2}>
                {status === "idle" ? "Side-Scroller Ready" : "Runner Collided!"}
              </Text>
              <Text mt={2} fontSize={{ base: "13px", md: "14px" }} opacity={0.9}>
                {status === "idle"
                  ? "Tap screen, press Space or W to leap over obstacles."
                  : `Distance: ${distance}m &bull; Coins: ${coinsCount} &bull; Score: ${score}`}
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
                {status === "idle" ? "Start Run" : "Dash Again"}
              </Button>
            </Flex>
          )}
        </Box>

        {/* Big On-Screen Jump Button for Touch / Mobile */}
        <Box mt={3}>
          <Button
            w="100%"
            h="54px"
            bg="#ffca3a"
            color="#171717"
            fontSize="16px"
            fontWeight="900"
            borderRadius="8px"
            leftIcon={<ArrowUp size={24} />}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              jump();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              jump();
            }}
            _active={{ transform: "scale(0.98)" }}
          >
            TAP TO JUMP
          </Button>
        </Box>

        <Text mt={2} textAlign="center" fontSize={{ base: "13px", md: "14px" }} color={colors.muted}>
          Press Space, Up, W, or tap anywhere on the game to jump.
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
            {status === "playing" ? "Running" : status === "idle" ? "Start Run" : "Run Again"}
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

export default EndlessRunner;