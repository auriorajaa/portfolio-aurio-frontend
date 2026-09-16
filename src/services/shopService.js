// src/services/shopService.js
/**
 * Arcade Shop services:
 * - Persisted coin wallet (validated, clamped, seeded for new installs).
 * - Catalog of purchasable items (skins, equipment/power-ups, BGM themes, assets).
 * - Purchase / equip / unequip with in-flight guards and idempotency.
 * - Cross-tab sync via the `storage` event.
 *
 * Everything here is defensive: corrupted / missing storage, NaN / negative
 * balances, duplicate purchases and invalid equip requests never crash the app.
 */

import React from "react";
import { arcadeAudio } from "./arcadeService";

const COINS_KEY = "arcade:coins:v1";
const PURCHASES_KEY = "arcade:shop:purchases:v1";
const EQUIPPED_KEY = "arcade:shop:equipped:v1";
export const STARTING_COINS = 25;
export const MAX_COINS = 500000;

// ============================================================================
// CATALOG
// ============================================================================
export const SHOP_ITEMS = [
  // ---- Skins ----
  {
    id: "skin_snake_amethyst",
    type: "skin",
    scope: "snake",
    name: "Royal Amethyst",
    desc: "Violet royal skin for your snake.",
    price: 150,
    icon: "Crown",
    color: "#a78bfa",
    colors: { p: "#a78bfa", s: "#6d28d9" },
  },
  {
    id: "skin_snake_ablaze",
    type: "skin",
    scope: "snake",
    name: "Molten Blaze",
    desc: "Lava-hot colors for speed demons.",
    price: 200,
    icon: "Flame",
    color: "#ff6b6b",
    colors: { p: "#ff6b6b", s: "#ff9f68" },
  },
  {
    id: "skin_2048_candy",
    type: "skin",
    scope: "2048",
    name: "Candy Core",
    desc: "Sweet gradient tiles for 2048.",
    price: 180,
    icon: "Candy",
    color: "#f15bb5",
    tiles: {
      2: ["#ffe3f1", "#5b2140"],
      4: ["#ffc4e0", "#5b2140"],
      8: ["#ff9ece", "#ffffff"],
      16: ["#f15bb5", "#ffffff"],
      32: ["#ff6b6b", "#ffffff"],
      64: ["#ff9f68", "#ffffff"],
      128: ["#9b5de5", "#ffffff"],
      256: ["#00bbf9", "#06202a"],
      512: ["#00f5d4", "#062a25"],
      1024: ["#8ac926", "#132a12"],
      2048: ["#ffca3a", "#382b00"],
    },
  },
  {
    id: "skin_pong_arc",
    type: "skin",
    scope: "pong",
    name: "Neon Sprint",
    desc: "Sleek neon paddles for Pong.",
    price: 120,
    icon: "Zap",
    color: "#38e0a8",
    colors: { p: "#38e0a8", s: "#ff5d8f" },
  },
  {
    id: "skin_ttt_void",
    type: "skin",
    scope: "tictactoe",
    name: "Void Protocol",
    desc: "Mystic purple & cyan marks.",
    price: 100,
    icon: "Moon",
    color: "#c084fc",
    colors: { p: "#c084fc", s: "#22d3ee" },
  },
  {
    id: "skin_rps_aqua",
    type: "skin",
    scope: "rps",
    name: "Aqua Fist",
    desc: "Icy blue hands for every gesture.",
    price: 130,
    icon: "Droplets",
    color: "#38bdf8",
    colors: { p: "#38bdf8" },
  },
  {
    id: "skin_mole_ghost",
    type: "skin",
    scope: "whacamole",
    name: "Ghost Mole",
    desc: "Ghostly pale moles for spooky tapping.",
    price: 160,
    icon: "Ghost",
    color: "#e2e8f0",
    colors: { p: "#e2e8f0", s: "#5b21b6" },
  },
  {
    id: "skin_memory_aurora",
    type: "skin",
    scope: "memory",
    name: "Aurora Deck",
    desc: "Glowing cyan card backs.",
    price: 140,
    icon: "Sparkles",
    color: "#67e8f9",
    colors: { p: "#67e8f9", s: "#a5f3fc" },
  },
  {
    id: "skin_dodge_onyx",
    type: "skin",
    scope: "dodge",
    name: "Onyx Interceptor",
    desc: "Violet stealth-fighter paint.",
    price: 170,
    icon: "MoonStar",
    color: "#8b5cf6",
    colors: { p: "#8b5cf6", s: "#c4b5fd" },
  },
  {
    id: "skin_runner_ember",
    type: "skin",
    scope: "runner",
    name: "Ember Dash",
    desc: "Blazing runner armor with orange visor.",
    price: 190,
    icon: "Flame",
    color: "#fb923c",
    colors: { p: "#fb923c", s: "#ef4444" },
  },

  // ---- Equipment / power-ups ----
  {
    id: "equip_snake_golden",
    type: "equipment",
    scope: "snake",
    name: "Golden Apples",
    desc: "Apples are worth 15 points each.",
    price: 250,
    icon: "Apple",
    color: "#ffd166",
    perk: { snakeAppleScore: 15 },
  },
  {
    id: "equip_pong_titan",
    type: "equipment",
    scope: "pong",
    name: "Titan Paddle",
    desc: "+30% larger player paddle.",
    price: 220,
    icon: "Disc3",
    color: "#00bbf9",
    perk: { pongPaddleScale: 1.3 },
  },
  {
    id: "equip_mole_extra",
    type: "equipment",
    scope: "whacamole",
    name: "Extra Round",
    desc: "+8 seconds of whacking time.",
    price: 200,
    icon: "Timer",
    color: "#8ac926",
    perk: { moleExtraMs: 8000 },
  },
  {
    id: "equip_mole_golden",
    type: "equipment",
    scope: "whacamole",
    name: "Golden Mallet",
    desc: "Each knock scores 2 points.",
    price: 260,
    icon: "Hammer",
    color: "#ffca3a",
    perk: { moleScoreMult: 2 },
  },
  {
    id: "equip_dodge_shield",
    type: "equipment",
    scope: "dodge",
    name: "Nano Shield",
    desc: "Survive one meteorite impact.",
    price: 280,
    icon: "Shield",
    color: "#00f5d4",
    perk: { dodgeShield: 1 },
  },
  {
    id: "equip_runner_magnet",
    type: "equipment",
    scope: "runner",
    name: "Coin Magnet",
    desc: "Pick up coins from a wider radius.",
    price: 240,
    icon: "Magnet",
    color: "#ffd166",
    perk: { runnerMagnet: true },
  },
  {
    id: "equip_memory_peek",
    type: "equipment",
    scope: "memory",
    name: "Quick Glimpse",
    desc: "Reveal the whole deck for 1.2s at start.",
    price: 220,
    icon: "Eye",
    color: "#f15bb5",
    perk: { memoryPeek: true },
  },
  {
    id: "equip_2048_headstart",
    type: "equipment",
    scope: "2048",
    name: "Head Start",
    desc: "Start with a free 64 tile.",
    price: 230,
    icon: "Rocket",
    color: "#ff9f68",
    perk: { "2048HeadStart": true },
  },
  {
    id: "equip_ttt_coach",
    type: "equipment",
    scope: "tictactoe",
    name: "Hint Oracle",
    desc: "Highlight a safe square each turn.",
    price: 150,
    icon: "Lightbulb",
    color: "#ffca3a",
    perk: { tttHint: true },
  },

  // ---- BGM themes ----
  {
    id: "bgm_neon_lounge",
    type: "bgm",
    scope: "bgm",
    name: "Neon Lounge",
    desc: "Chilled, smooth synth pads for every game.",
    price: 180,
    icon: "Music4",
    color: "#9b5de5",
    themeId: "neon-lounge",
  },
  {
    id: "bgm_midnight_synth",
    type: "bgm",
    scope: "bgm",
    name: "Midnight Synth",
    desc: "Bright, energetic synthwave energy.",
    price: 200,
    icon: "AudioWaveform",
    color: "#00bbf9",
    themeId: "midnight-synth",
  },
  {
    id: "bgm_ocean_drift",
    type: "bgm",
    scope: "bgm",
    name: "Ocean Drift",
    desc: "Ambient, dreamy underwater moods.",
    price: 220,
    icon: "Waves",
    color: "#00f5d4",
    themeId: "ocean-drift",
  },

  // ---- Assets (cosmetic collectibles) ----
  {
    id: "asset_stamp_neon",
    type: "asset",
    scope: "global",
    name: "Neon Stamp",
    desc: "A glowing neon passport stamp to collect.",
    price: 90,
    icon: "Stamp",
    color: "#00f5d4",
  },
  {
    id: "asset_stamp_gold",
    type: "asset",
    scope: "global",
    name: "Gold Stamp",
    desc: "The golden cabinet collector's stamp.",
    price: 150,
    icon: "Award",
    color: "#ffca3a",
  },
];

export const getShopItem = (id) => SHOP_ITEMS.find((item) => item.id === id) || null;

const sanitizeInt = (value, fallback, min, max) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

// ============================================================================
// COINS
// ============================================================================
export const loadCoins = () => {
  let coins = STARTING_COINS;
  try {
    const raw = window.localStorage.getItem(COINS_KEY);
    if (raw === null) {
      window.localStorage.setItem(COINS_KEY, String(STARTING_COINS));
      return coins;
    }
    coins = sanitizeInt(Number(raw), STARTING_COINS, 0, MAX_COINS);
  } catch {
    coins = STARTING_COINS;
  }
  return coins;
};

export const saveCoins = (coins) => {
  const safe = sanitizeInt(coins, 0, 0, MAX_COINS);
  try {
    window.localStorage.setItem(COINS_KEY, String(safe));
  } catch {}
  emitChange();
  return safe;
};

export const addCoins = (amount) => {
  const safe = sanitizeInt(amount, 0, -MAX_COINS, MAX_COINS);
  const next = Math.max(0, Math.min(MAX_COINS, loadCoins() + safe));
  saveCoins(next);
  return next;
};

export const spendCoins = (amount) => {
  const safe = sanitizeInt(amount, 0, 0, MAX_COINS);
  const balance = loadCoins();
  if (balance < safe) return { ok: false, balance, reason: "insufficient" };
  const next = balance - safe;
  saveCoins(next);
  return { ok: true, balance: next };
};

// ============================================================================
// PURCHASES
// ============================================================================
export const loadPurchases = () => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(PURCHASES_KEY));
    if (!Array.isArray(raw)) return [];
    const valid = raw.filter((id) => typeof id === "string" && getShopItem(id));
    if (valid.length !== raw.length) {
      window.localStorage.setItem(PURCHASES_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
};

export const isOwned = (id) => {
  const item = getShopItem(id);
  if (!item) return false;
  return loadPurchases().includes(id);
};

let purchaseLock = false;
const acquirePurchaseLock = () => {
  if (purchaseLock) return null;
  purchaseLock = true;
  return () => {
    purchaseLock = false;
  };
};

export const purchaseItem = (id) => {
  const item = getShopItem(id);
  if (!item) return { ok: false, reason: "invalid" };
  const owned = loadPurchases();
  if (owned.includes(id)) return { ok: false, reason: "owned" };

  const lock = acquirePurchaseLock();
  if (!lock) return { ok: false, reason: "busy" };
  try {
    const spent = spendCoins(item.price);
    if (!spent.ok) return spent;
    const next = [...owned, id];
    try {
      window.localStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
    } catch {
      // refund on storage failure so the wallet is never corrupted
      saveCoins(spent.balance + item.price);
      return { ok: false, reason: "storage" };
    }
    if (item.type === "bgm" && item.themeId) {
      arcadeAudio.setBgmTheme(item.themeId);
    }
    emitChange();
    return { ok: true, balance: spent.balance, item };
  } finally {
    lock();
  }
};

// ============================================================================
// EQUIPPING
// ============================================================================
export const loadEquipped = () => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(EQUIPPED_KEY));
    const out = {};
    if (raw && typeof raw === "object") {
      Object.entries(raw).forEach(([key, id]) => {
        if (!getShopItem(id)) return;
        out[key] = id;
      });
    }
    return out;
  } catch {
    return {};
  }
};

const equippedKey = (item) => {
  if (item.scope === "global" || item.scope === "bgm") return item.scope;
  return `${item.scope}:${item.type}`;
};

export const equipItem = (id) => {
  const item = getShopItem(id);
  if (!item) return { ok: false, reason: "invalid" };
  if (!isOwned(id)) return { ok: false, reason: "not-owned" };
  const equipped = loadEquipped();
  const key = equippedKey(item);
  const next = { ...equipped, [key]: id };
  try {
    window.localStorage.setItem(EQUIPPED_KEY, JSON.stringify(next));
  } catch {
    return { ok: false, reason: "storage" };
  }
  if (item.type === "bgm" && item.themeId) {
    arcadeAudio.setBgmTheme(item.themeId);
  }
  emitChange();
  return { ok: true, item };
};

export const unequipItem = (id) => {
  const item = getShopItem(id);
  if (!item) return { ok: false, reason: "invalid" };
  const equipped = loadEquipped();
  const key = equippedKey(item);
  if (equipped[key] !== id) return { ok: false, reason: "not-equipped" };
  const next = { ...equipped };
  delete next[key];
  try {
    window.localStorage.setItem(EQUIPPED_KEY, JSON.stringify(next));
  } catch {
    return { ok: false, reason: "storage" };
  }
  emitChange();
  return { ok: true };
};

export const getEquippedId = (scope, type) => {
  const equipped = loadEquipped();
  if (scope === "global" || scope === "bgm") return equipped[scope] || null;
  return equipped[`${scope}:${type}`] || null;
};

export const getEquippedSkin = (gameId) => {
  if (!gameId) return null;
  const id = getEquippedId(gameId, "skin");
  return id ? getShopItem(id) : null;
};

export const getEquippedEquipment = (gameId) => {
  if (!gameId) return null;
  const id = getEquippedId(gameId, "equipment");
  return id ? getShopItem(id) : null;
};

export const getEquippedBgmThemeId = () => {
  const id = getEquippedId("bgm", "bgm");
  const item = id ? getShopItem(id) : null;
  return item?.themeId || "default";
};

// Equipment perks for a game combined from the equipped equipment item.
export const getShopPerks = (gameId) => {
  const equip = getEquippedEquipment(gameId);
  return equip?.perk || {};
};

// One-shot snapshot games read on mount (equip changes apply next run).
export const getShopSnapshot = (gameId) => ({
  coins: loadCoins(),
  owned: loadPurchases(),
  skin: getEquippedSkin(gameId),
  equipment: getEquippedEquipment(gameId),
  perks: getShopPerks(gameId),
  bgmTheme: getEquippedBgmThemeId(),
});

// ============================================================================
// REACTIVE NOTIFICATION (single-tab + cross-tab)
// ============================================================================
const listeners = new Set();
let started = false;

const emitChange = () => {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch {}
  });
};

const onStorage = (event) => {
  if (!event.key) return;
  if ([COINS_KEY, PURCHASES_KEY, EQUIPPED_KEY, "arcade:audio:theme"].includes(event.key)) {
    emitChange();
  }
};

const ensureListeners = () => {
  if (started) return;
  started = true;
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
};

/** React hook: re-reads snapshot whenever coins/purchases/equips change. */
export const useShopState = (gameId) => {
  const [snapshot, setSnapshot] = React.useState(() => getShopSnapshot(gameId));
  React.useEffect(() => {
    ensureListeners();
    const update = () => setSnapshot(getShopSnapshot(gameId));
    listeners.add(update);
    update();
    return () => {
      listeners.delete(update);
    };
  }, [gameId]);
  return snapshot;
};