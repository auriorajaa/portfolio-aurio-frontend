// src/services/arcadeService.test.js
import {
  arcadeAudio,
  arcadeHaptics,
  getCrtMode,
  setCrtMode,
  loadArcadeStats,
  recordGameSession,
  getUnlockedAchievements,
  unlockAchievement,
  ARCADE_ACHIEVEMENTS,
} from "./arcadeService";

describe("arcadeService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("audio mute toggle and state persistence", () => {
    expect(arcadeAudio.getMuted()).toBe(false);
    arcadeAudio.toggleMute();
    expect(arcadeAudio.getMuted()).toBe(true);
    expect(window.localStorage.getItem("arcade:audio:muted")).toBe("true");
    arcadeAudio.setMuted(false);
    expect(arcadeAudio.getMuted()).toBe(false);
  });

  test("CRT mode toggle and persistence", () => {
    expect(getCrtMode()).toBe(false);
    setCrtMode(true);
    expect(getCrtMode()).toBe(true);
    setCrtMode(false);
    expect(getCrtMode()).toBe(false);
  });

  test("haptics methods do not throw even if unsupported", () => {
    expect(() => {
      arcadeHaptics.light();
      arcadeHaptics.medium();
      arcadeHaptics.success();
      arcadeHaptics.danger();
    }).not.toThrow();
  });

  test("recording game sessions updates stats and achievements", () => {
    const initialStats = loadArcadeStats();
    expect(initialStats.totalPlayed).toBe(0);

    const updated = recordGameSession("snake", 60);
    expect(updated.totalPlayed).toBe(1);
    expect(updated.games.snake.best).toBe(60);

    const achievements = getUnlockedAchievements();
    expect(achievements).toContain("first_coin");
    expect(achievements).toContain("snake_pro");
  });

  test("unlockAchievement unlocks correctly and avoids duplicates", () => {
    expect(unlockAchievement("tile_master")).toBe(true);
    expect(unlockAchievement("tile_master")).toBe(false); // already unlocked
    const unlocked = getUnlockedAchievements();
    expect(unlocked).toContain("tile_master");
  });

  test("ARCADE_ACHIEVEMENTS contains all 8 achievements with valid fields", () => {
    expect(ARCADE_ACHIEVEMENTS.length).toBe(8);
    ARCADE_ACHIEVEMENTS.forEach((ach) => {
      expect(ach.id).toBeTruthy();
      expect(ach.title).toBeTruthy();
      expect(ach.desc).toBeTruthy();
    });
  });
});
