// src/services/arcadeService.js
/**
 * Arcade Services:
 * 1. Web Audio API procedural audio engine with soft, ear-friendly synthesized BGM
 *    (multi-theme sequencer + per-game tracks) and gentle SFX. No audio assets needed.
 * 2. BGM lifecycle: plays only while a game is active. Fades in/out. Pauses
 *    automatically when the tab is hidden and resumes when visible. Stops on demand.
 * 3. Device haptic feedback engine for touchscreens.
 * 4. Unified high score, session statistics, and achievement tracking with legacy migration.
 * 5. CRT Retro Cabinet mode preference manager.
 */

const AUDIO_MUTE_KEY = "arcade:audio:muted";
const CRT_MODE_KEY = "arcade:display:crt";
const STATS_KEY = "arcade:stats:v2";
const ACHIEVEMENTS_KEY = "arcade:achievements:v1";

// Note frequencies (Hz). We use soft scales (major/minor with sevenths), never
// hard 8-bit square leads, so the music stays pleasant.
const NOTE = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.0, G3: 196.0, Ab3: 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.0, Bb5: 932.33, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51,
  REST: 0,
};

// ============================================================================
// BGM THEMES — a shop-purchasable "shape" applied on top of every game track.
// The theme changes timbre, energy and filter so BGM items sound clearly different,
// without duplicating every composition.
// ============================================================================
export const BGM_THEMES = {
  default: {
    id: "default",
    label: "Studio Mix",
    wave: "triangle",
    padWave: "triangle",
    bassWave: "sine",
    filterFreq: 2200,
    tempoMul: 1,
    gain: 0.17,
    padGain: 0.5,
    bassGain: 0.85,
    arpGain: 0.75,
  },
  "neon-lounge": {
    id: "neon-lounge",
    label: "Neon Lounge",
    wave: "sine",
    padWave: "sine",
    bassWave: "triangle",
    filterFreq: 1300,
    tempoMul: 0.82,
    gain: 0.18,
    padGain: 0.6,
    bassGain: 0.8,
    arpGain: 0.55,
  },
  "midnight-synth": {
    id: "midnight-synth",
    label: "Midnight Synth",
    wave: "triangle",
    padWave: "triangle",
    bassWave: "sine",
    filterFreq: 2600,
    tempoMul: 1.06,
    gain: 0.17,
    padGain: 0.45,
    bassGain: 0.9,
    arpGain: 0.9,
  },
  "ocean-drift": {
    id: "ocean-drift",
    label: "Ocean Drift",
    wave: "sine",
    padWave: "sine",
    bassWave: "sine",
    filterFreq: 900,
    tempoMul: 0.72,
    gain: 0.19,
    padGain: 0.7,
    bassGain: 0.7,
    arpGain: 0.45,
  },
};

export const getBgmTheme = (themeId) => BGM_THEMES[themeId] || BGM_THEMES.default;

// ============================================================================
// BGM COMPOSITIONS PER GAME (unique chords, melody and bassline)
// Melodies are sparse, loop-friendly and written to sit comfortably on the chord
// progressions (roots + 3rds/5ths build the sustained pad). All in ear-friendly keys.
// ============================================================================
const BGM_TRACKS = {
  // 1. 2048: "Neon Tide" — I–vi–IV–V in C, airy pluck over slow pads, 102 BPM
  "2048": {
    tempo: 102,
    chords: [
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.F3, NOTE.A3, NOTE.C4],
      [NOTE.G3, NOTE.B3, NOTE.D4],
    ],
    notes: [
      { n: NOTE.E4, d: 0.5 }, { n: NOTE.G4, d: 0.5 }, { n: NOTE.A4, d: 0.5 }, { n: NOTE.G4, d: 0.5 },
      { n: NOTE.E4, d: 0.5 }, { n: NOTE.C4, d: 0.5 }, { n: NOTE.D4, d: 0.5 }, { n: NOTE.C4, d: 0.5 },
      { n: NOTE.A4, d: 0.5 }, { n: NOTE.C5, d: 0.5 }, { n: NOTE.B4, d: 0.5 }, { n: NOTE.G4, d: 0.5 },
      { n: NOTE.E4, d: 0.5 }, { n: NOTE.F4, d: 0.5 }, { n: NOTE.G4, d: 0.5 }, { n: NOTE.REST, d: 0.5 },
    ],
    bass: [NOTE.C3, NOTE.A2, NOTE.F2, NOTE.G2],
  },

  // 2. Snake: "Desert Mirage" — Dm–Bb–F–A, warm flute-like lead, 96 BPM
  snake: {
    tempo: 96,
    chords: [
      [NOTE.D4, NOTE.F4, NOTE.A4],
      [NOTE.Bb3, NOTE.D4, NOTE.F4],
      [NOTE.F3, NOTE.A3, NOTE.C4],
      [NOTE.A3, NOTE.C4, NOTE.E4],
    ],
    notes: [
      { n: NOTE.D5, d: 0.5 }, { n: NOTE.F5, d: 0.5 }, { n: NOTE.A5, d: 0.5 }, { n: NOTE.F5, d: 0.5 },
      { n: NOTE.D5, d: 0.5 }, { n: NOTE.C5, d: 0.5 }, { n: NOTE.Bb4, d: 0.5 }, { n: NOTE.C5, d: 0.5 },
      { n: NOTE.A4, d: 0.5 }, { n: NOTE.F4, d: 0.5 }, { n: NOTE.A4, d: 0.5 }, { n: NOTE.C5, d: 0.5 },
      { n: NOTE.E5, d: 0.75 }, { n: NOTE.D5, d: 0.5 }, { n: NOTE.REST, d: 0.25 },
    ],
    bass: [NOTE.D3, NOTE.Bb2, NOTE.F2, NOTE.A2],
  },

  // 3. Pong: "Night Chroma" — Am–F–C–G, soft arpeggiated bounce, 112 BPM
  pong: {
    tempo: 112,
    chords: [
      [NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.F3, NOTE.A3, NOTE.C4],
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.G3, NOTE.B3, NOTE.D4],
    ],
    notes: [
      { n: NOTE.A4, d: 0.25 }, { n: NOTE.C5, d: 0.25 }, { n: NOTE.E5, d: 0.25 }, { n: NOTE.C5, d: 0.25 },
      { n: NOTE.F4, d: 0.25 }, { n: NOTE.A4, d: 0.25 }, { n: NOTE.C5, d: 0.25 }, { n: NOTE.A4, d: 0.25 },
      { n: NOTE.C5, d: 0.25 }, { n: NOTE.E5, d: 0.25 }, { n: NOTE.G5, d: 0.25 }, { n: NOTE.E5, d: 0.25 },
      { n: NOTE.B4, d: 0.25 }, { n: NOTE.D5, d: 0.25 }, { n: NOTE.G5, d: 0.25 }, { n: NOTE.D5, d: 0.25 },
    ],
    bass: [NOTE.A2, NOTE.F2, NOTE.C3, NOTE.G2],
  },

  // 4. Tic-Tac-Toe: "Zen Garden" — Cmaj7–Fmaj7–Am7–G, sparse & meditative, 90 BPM
  tictactoe: {
    tempo: 90,
    chords: [
      [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.B4],
      [NOTE.F3, NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.A3, NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.G3, NOTE.B3, NOTE.D4, NOTE.Fs4],
    ],
    notes: [
      { n: NOTE.E4, d: 0.5 }, { n: NOTE.G4, d: 0.5 }, { n: NOTE.B4, d: 0.5 }, { n: NOTE.C5, d: 0.5 },
      { n: NOTE.A4, d: 0.5 }, { n: NOTE.C5, d: 0.5 }, { n: NOTE.E5, d: 0.5 }, { n: NOTE.D5, d: 0.5 },
      { n: NOTE.C4, d: 0.5 }, { n: NOTE.E4, d: 0.5 }, { n: NOTE.A4, d: 0.5 }, { n: NOTE.C5, d: 0.5 },
      { n: NOTE.G4, d: 0.5 }, { n: NOTE.B4, d: 0.5 }, { n: NOTE.D5, d: 1.0 },
    ],
    bass: [NOTE.C3, NOTE.F2, NOTE.A2, NOTE.G2],
  },

  // 5. Rock Paper Scissors: "Showdown Whisper" — Em–Am–B–Em, light groove, 108 BPM
  rps: {
    tempo: 108,
    chords: [
      [NOTE.E3, NOTE.G3, NOTE.B3],
      [NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.B3, NOTE.D4, NOTE.Fs4],
      [NOTE.E3, NOTE.G3, NOTE.B3],
    ],
    notes: [
      { n: NOTE.E4, d: 0.25 }, { n: NOTE.G4, d: 0.25 }, { n: NOTE.B4, d: 0.25 }, { n: NOTE.G4, d: 0.25 },
      { n: NOTE.A4, d: 0.25 }, { n: NOTE.C5, d: 0.25 }, { n: NOTE.B4, d: 0.25 }, { n: NOTE.A4, d: 0.25 },
      { n: NOTE.G4, d: 0.25 }, { n: NOTE.B4, d: 0.25 }, { n: NOTE.D5, d: 0.25 }, { n: NOTE.B4, d: 0.25 },
      { n: NOTE.E4, d: 0.25 }, { n: NOTE.REST, d: 0.25 }, { n: NOTE.E4, d: 0.25 }, { n: NOTE.G4, d: 0.25 },
    ],
    bass: [NOTE.E2, NOTE.A2, NOTE.B2, NOTE.E2],
  },

  // 6. Whac-a-Mole: "Kawaii Picnic" — C–G–Am–F, bright but soft ukulele mood, 118 BPM
  whacamole: {
    tempo: 118,
    chords: [
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.G3, NOTE.B3, NOTE.D4],
      [NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.F3, NOTE.A3, NOTE.C4],
    ],
    notes: [
      { n: NOTE.C5, d: 0.25 }, { n: NOTE.E5, d: 0.25 }, { n: NOTE.G5, d: 0.25 }, { n: NOTE.E5, d: 0.25 },
      { n: NOTE.D5, d: 0.25 }, { n: NOTE.C5, d: 0.25 }, { n: NOTE.A4, d: 0.25 }, { n: NOTE.C5, d: 0.25 },
      { n: NOTE.A4, d: 0.25 }, { n: NOTE.C5, d: 0.25 }, { n: NOTE.E5, d: 0.25 }, { n: NOTE.C5, d: 0.25 },
      { n: NOTE.F4, d: 0.25 }, { n: NOTE.G4, d: 0.25 }, { n: NOTE.C5, d: 0.5 },
    ],
    bass: [NOTE.C3, NOTE.G2, NOTE.A2, NOTE.F2],
  },

  // 7. Memory Match: "Glowbox Lullaby" — G–Em–C–D, music-box air, 84 BPM
  memory: {
    tempo: 84,
    chords: [
      [NOTE.G3, NOTE.B3, NOTE.D4],
      [NOTE.E3, NOTE.G3, NOTE.B3],
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.D4, NOTE.Fs4, NOTE.A4],
    ],
    notes: [
      { n: NOTE.B4, d: 0.5 }, { n: NOTE.D5, d: 0.5 }, { n: NOTE.G5, d: 0.5 }, { n: NOTE.D5, d: 0.5 },
      { n: NOTE.E5, d: 0.5 }, { n: NOTE.D5, d: 0.5 }, { n: NOTE.B4, d: 0.5 }, { n: NOTE.G4, d: 0.5 },
      { n: NOTE.C5, d: 0.5 }, { n: NOTE.E5, d: 0.5 }, { n: NOTE.A5, d: 0.5 }, { n: NOTE.G5, d: 0.5 },
      { n: NOTE.D5, d: 1.0 }, { n: NOTE.B4, d: 1.0 },
    ],
    bass: [NOTE.G2, NOTE.E2, NOTE.C3, NOTE.D3],
  },

  // 8. Reaction Dodge: "Threat Vector" — Em–C–D–Bm, tense but atmospheric, 122 BPM
  dodge: {
    tempo: 122,
    chords: [
      [NOTE.E3, NOTE.G3, NOTE.B3],
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.D4, NOTE.Fs4, NOTE.A4],
      [NOTE.B3, NOTE.D4, NOTE.Fs4],
    ],
    notes: [
      { n: NOTE.B3, d: 0.25 }, { n: NOTE.E4, d: 0.25 }, { n: NOTE.G4, d: 0.25 }, { n: NOTE.REST, d: 0.25 },
      { n: NOTE.C4, d: 0.25 }, { n: NOTE.A4, d: 0.25 }, { n: NOTE.G4, d: 0.25 }, { n: NOTE.REST, d: 0.25 },
      { n: NOTE.D4, d: 0.25 }, { n: NOTE.Fs4, d: 0.25 }, { n: NOTE.A4, d: 0.25 }, { n: NOTE.REST, d: 0.25 },
      { n: NOTE.B3, d: 0.25 }, { n: NOTE.D4, d: 0.25 }, { n: NOTE.Fs4, d: 0.5 }, { n: NOTE.REST, d: 0.0 },
    ],
    bass: [NOTE.E2, NOTE.C3, NOTE.D3, NOTE.B2],
  },

  // 9. Endless Runner: "Morning Rush" — Am–F–C–G, energetic but smooth lead, 132 BPM
  runner: {
    tempo: 132,
    chords: [
      [NOTE.A3, NOTE.C4, NOTE.E4],
      [NOTE.F3, NOTE.A3, NOTE.C4],
      [NOTE.C4, NOTE.E4, NOTE.G4],
      [NOTE.G3, NOTE.B3, NOTE.D4],
    ],
    notes: [
      { n: NOTE.A4, d: 0.2 }, { n: NOTE.C5, d: 0.2 }, { n: NOTE.E5, d: 0.2 }, { n: NOTE.A5, d: 0.2 },
      { n: NOTE.G5, d: 0.2 }, { n: NOTE.E5, d: 0.2 }, { n: NOTE.C5, d: 0.2 }, { n: NOTE.A4, d: 0.2 },
      { n: NOTE.C5, d: 0.2 }, { n: NOTE.E5, d: 0.2 }, { n: NOTE.G5, d: 0.2 }, { n: NOTE.C6, d: 0.2 },
      { n: NOTE.B5, d: 0.2 }, { n: NOTE.G5, d: 0.2 }, { n: NOTE.D5, d: 0.2 }, { n: NOTE.G5, d: 0.2 },
    ],
    bass: [NOTE.A2, NOTE.F2, NOTE.C3, NOTE.G2],
  },
};

// ============================================================================
// AUDIO MANAGER: PROCEDURAL SFX + EAR-FRIENDLY BGM ENGINE
// ============================================================================
class ArcadeAudio {
  constructor() {
    this.ctx = null;
    this.bgmMasterGain = null;
    this.currentTrackId = null;
    this.bgmTimer = null;
    this.loopToken = 0;
    this.bgmTrack = null;
    this.bgmBeat = 1;
    this.activeNodes = [];
    this.isMuted = false;
    this.isVisible = true;
    this.bgmActive = false;
    this.bgmTheme = "default";
    this.unlockBound = false;

    try {
      this.isMuted = window.localStorage.getItem(AUDIO_MUTE_KEY) === "true";
      const savedTheme = window.localStorage.getItem("arcade:audio:theme");
      if (savedTheme) this.bgmTheme = getBgmTheme(savedTheme).id;
    } catch {
      this.isMuted = false;
    }

    if (typeof document !== "undefined") {
      this.handleVisibility = this.handleVisibility.bind(this);
      document.addEventListener("visibilitychange", this.handleVisibility);
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.bgmMasterGain = this.ctx.createGain();
          this.bgmMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
          this.bgmMasterGain.connect(this.ctx.destination);
        } catch {
          this.ctx = null;
        }
      }
      this._bindUnlock();
    }
    this._ensureResume();
    return this.ctx;
  }

  _bindUnlock() {
    if (this.unlockBound || typeof window === "undefined") return;
    this.unlockBound = true;
    const unlock = () => this._ensureResume();
    ["pointerdown", "keydown", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, unlock, { once: false }),
    );
  }

  _ensureResume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  _setMasterGain(target, rampSec = 0.4) {
    if (!this.ctx || !this.bgmMasterGain) return;
    const t = this.ctx.currentTime;
    try {
      this.bgmMasterGain.gain.cancelScheduledValues(t);
      this.bgmMasterGain.gain.setValueAtTime(Math.max(0, this.bgmMasterGain.gain.value), t);
      this.bgmMasterGain.gain.linearRampToValueAtTime(Math.max(0, target), t + Math.max(0.01, rampSec));
    } catch {
      try {
        this.bgmMasterGain.gain.setValueAtTime(Math.max(0, target), t);
      } catch {}
    }
  }

  _themeGain() {
    return this.isVisible && !this.isMuted ? getBgmTheme(this.bgmTheme).gain : 0;
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    try {
      window.localStorage.setItem(AUDIO_MUTE_KEY, String(this.isMuted));
    } catch {
      // storage unavailable
    }
    if (this.ctx && this.bgmMasterGain) {
      this._setMasterGain(this._themeGain(), 0.25);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  getTheme() {
    return getBgmTheme(this.bgmTheme);
  }

  setBgmTheme(themeId) {
    const theme = getBgmTheme(themeId);
    if (theme.id === this.bgmTheme) return this.bgmTheme;
    this.bgmTheme = theme.id;
    try {
      window.localStorage.setItem("arcade:audio:theme", this.bgmTheme);
    } catch {}
    if (this.bgmActive && this.currentTrackId) {
      this.startBgm(this.currentTrackId, { force: true });
    }
    return this.bgmTheme;
  }

  handleVisibility() {
    const hidden = typeof document !== "undefined" && document.hidden;
    if (hidden === this.isVisible) return;
    this.isVisible = !hidden;
    if (!this.ctx) return;
    if (hidden) {
      this._setMasterGain(0, 0.3);
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    } else if (this.bgmActive) {
      this._setMasterGain(this._themeGain(), 0.9);
      this._kickLoop();
    }
  }

  // Preload a track definition (no-ops; everything is procedural). Kept so
  // games can "preload" critical audio without any asset download.
  preloadBgm(gameId) {
    return Boolean(BGM_TRACKS[gameId]);
  }

  // ==========================================
  // BACKGROUND MUSIC SEQUENCER
  // ==========================================
  startBgm(gameId, { force = false } = {}) {
    if (!gameId) return;
    const track = BGM_TRACKS[gameId] || BGM_TRACKS["2048"];
    if (this.currentTrackId === gameId && this.bgmActive && !force) return;

    this._releaseNodes();
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }

    this.currentTrackId = gameId;
    this.bgmActive = true;
    this.bgmTrack = track;
    this.bgmBeat = (60 / track.tempo) * getBgmTheme(this.bgmTheme).tempoMul;

    const ctx = this.initContext();
    if (!ctx) return;
    this._setMasterGain(this._themeGain(), 1.2);
    this._kickLoop();
  }

  _kickLoop() {
    if (!this.bgmActive || !this.bgmTrack || !this.ctx) return;
    const token = ++this.loopToken;
    const track = this.bgmTrack;
    const beat = this.bgmBeat;
    const theme = getBgmTheme(this.bgmTheme);

    const scheduleBar = () => {
      if (token !== this.loopToken || !this.bgmActive || !this.ctx) return;
      if (this.ctx.state === "suspended") {
        // Autoplay still blocked — retry silently later, never block gameplay.
        this.bgmTimer = setTimeout(scheduleBar, 600);
        return;
      }
      const startTime = this.ctx.currentTime + 0.08;
      const melodyDur = track.notes.reduce((acc, n) => acc + n.d * beat, 0);
      const barCount = Math.max(1, track.chords.length);
      const barDur = melodyDur / barCount;

      // --- Sustained pads (soft, warm chords) ---
      track.chords.forEach((chord, bi) => {
        const chordStart = startTime + bi * barDur;
        chord.forEach((freq) => {
          if (!freq) return;
          this._scheduleNote(freq, chordStart, barDur, {
            wave: theme.padWave,
            peak: 0.03 * theme.padGain,
            attack: Math.min(0.5, barDur * 0.35),
            release: barDur * 0.42,
            filter: theme.filterFreq * 0.8,
          });
        });
        const bassRoot = track.bass[bi];
        if (bassRoot) {
          this._scheduleNote(bassRoot, chordStart + barDur * 0.08, barDur * 0.85, {
            wave: theme.bassWave,
            peak: 0.055 * theme.bassGain,
            attack: 0.02,
            release: barDur * 0.4,
            filter: Math.min(1100, theme.filterFreq * 0.5),
          });
        }
      });

      // --- Gentle melody / arpeggio line ---
      let offset = 0;
      track.notes.forEach((note) => {
        const noteDur = note.d * beat;
        if (note.n > 0) {
          this._scheduleNote(note.n, startTime + offset, noteDur * 1.25, {
            wave: theme.wave,
            peak: 0.045 * theme.arpGain,
            attack: 0.02,
            release: noteDur * 0.6,
            filter: theme.filterFreq,
          });
        }
        offset += noteDur;
      });

      this.bgmTimer = setTimeout(scheduleBar, Math.max(400, melodyDur * 1000 - 50));
    };

    scheduleBar();
  }

  _scheduleNote(freq, startTime, duration, { wave = "sine", peak = 0.04, attack = 0.05, release = 0.4, filter = 2000 }) {
    if (!this.ctx || !this.bgmMasterGain) return;
    try {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(Math.max(120, filter), startTime);
      lp.Q.value = 0.6;

      // Slight detune for warmth / chorus feel
      osc.type = wave;
      const detune = (Math.random() - 0.5) * 6;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime(detune, startTime);

      const safePeak = Math.max(0.0001, peak);
      const releaseT = Math.max(startTime + 0.03, startTime + duration * 0.72 + release);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(safePeak, startTime + attack);
      gain.gain.setValueAtTime(safePeak, Math.max(startTime + attack + 0.01, startTime + duration * 0.4));
      gain.gain.exponentialRampToValueAtTime(0.0001, releaseT);

      osc.connect(gain);
      gain.connect(lp);
      lp.connect(this.bgmMasterGain);

      const node = { osc, gain, lp };
      this.activeNodes.push(node);

      osc.onended = () => {
        this.activeNodes = this.activeNodes.filter((n) => n !== node);
      };

      osc.start(startTime);
      osc.stop(releaseT + 0.02);
    } catch {
      // Audio error is non-fatal
    }
  }

  _releaseNodes() {
    this.activeNodes.forEach((n) => {
      try {
        n.osc.stop();
        n.gain.disconnect();
        n.lp.disconnect();
      } catch {}
    });
    this.activeNodes = [];
  }

  stopBgm({ fade = true } = {}) {
    if (!this.bgmActive && !this.bgmTimer && this.activeNodes.length === 0) return;
    if (fade && this.ctx && this.bgmMasterGain) {
      this._setMasterGain(0, 0.45);
      const token = ++this.loopToken;
      this.bgmActive = false;
      setTimeout(() => {
        if (token !== this.loopToken) return;
        this._finishStop();
      }, 480);
    } else {
      this._finishStop();
    }
  }

  _finishStop() {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.loopToken += 1;
    this._releaseNodes();
    this.bgmActive = false;
    this.currentTrackId = null;
    this.bgmTrack = null;
  }

  // ==========================================
  // PROCEDURAL SOUND EFFECTS (SFX)
  // ==========================================
  playTone({
    freqStart = 440,
    freqEnd = 440,
    duration = 0.1,
    type = "triangle",
    gainStart = 0.12,
    gainEnd = 0.001,
    delay = 0,
  } = {}) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime + delay;
      const endTime = startTime + duration;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freqStart), startTime);
      if (freqStart !== freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), endTime);
      }

      gain.gain.setValueAtTime(gainStart, startTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainEnd), endTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(endTime);
    } catch {
      // Audio node error, gracefully ignore
    }
  }

  // Soft two-note coin chime (B4 -> E5)
  playCoin() {
    this.playTone({ freqStart: 493.88, freqEnd: 493.88, duration: 0.09, type: "triangle", gainStart: 0.14 });
    this.playTone({ freqStart: 659.25, freqEnd: 659.25, duration: 0.28, type: "triangle", gainStart: 0.16, delay: 0.08 });
  }

  // Directional blip
  playMove() {
    this.playTone({ freqStart: 260, freqEnd: 340, duration: 0.045, type: "triangle", gainStart: 0.1 });
  }

  // Upward chirp for scores
  playScore() {
    this.playTone({ freqStart: 620, freqEnd: 880, duration: 0.09, type: "sine", gainStart: 0.16 });
  }

  // Mallet bonk on mole
  playWhack() {
    this.playTone({ freqStart: 320, freqEnd: 100, duration: 0.1, type: "triangle", gainStart: 0.22 });
    this.playTone({ freqStart: 160, freqEnd: 70, duration: 0.14, type: "sine", gainStart: 0.16 });
  }

  // Soft jump swoop for runner
  playJump() {
    this.playTone({ freqStart: 220, freqEnd: 480, duration: 0.13, type: "triangle", gainStart: 0.12 });
  }

  // Card flip / button press click
  playClick() {
    this.playTone({ freqStart: 380, freqEnd: 240, duration: 0.035, type: "sine", gainStart: 0.08 });
  }

  // Collision / loss sound (soft thud)
  playHit() {
    this.playTone({ freqStart: 170, freqEnd: 55, duration: 0.22, type: "triangle", gainStart: 0.16 });
  }

  // Peaceful victory arpeggio (warm, not piercing)
  playWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone({
        freqStart: freq,
        freqEnd: freq,
        duration: idx === notes.length - 1 ? 0.4 : 0.12,
        type: "triangle",
        gainStart: 0.13,
        delay: idx * 0.1,
      });
    });
  }
}

export const arcadeAudio = new ArcadeAudio();

// ============================================================================
// DEVICE HAPTIC FEEDBACK
// ============================================================================
export const arcadeHaptics = {
  vibrate(pattern) {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics unsupported or blocked
      }
    }
  },
  light() {
    this.vibrate(10);
  },
  medium() {
    this.vibrate(25);
  },
  success() {
    this.vibrate([15, 30, 20]);
  },
  danger() {
    this.vibrate([35, 40, 35]);
  },
};

// ============================================================================
// RETRO CRT DISPLAY PREFERENCE
// ============================================================================
export const getCrtMode = () => {
  try {
    return window.localStorage.getItem(CRT_MODE_KEY) === "true";
  } catch {
    return false;
  }
};

export const setCrtMode = (enabled) => {
  try {
    window.localStorage.setItem(CRT_MODE_KEY, String(Boolean(enabled)));
  } catch {
    // storage unavailable
  }
};

// ============================================================================
// UNIFIED ARCADE STATS & ACHIEVEMENTS
// ============================================================================
export const ARCADE_ACHIEVEMENTS = [
  {
    id: "first_coin",
    title: "Insert Coin",
    desc: "Played your first arcade game or pressed Free Play.",
    icon: "Coins",
  },
  {
    id: "snake_pro",
    title: "Snake Charmer",
    desc: "Scored 50+ points in Snake.",
    icon: "Route",
  },
  {
    id: "tile_master",
    title: "Tile Maestro",
    desc: "Created a 256 or higher tile in 2048.",
    icon: "Grid2X2",
  },
  {
    id: "pong_streak",
    title: "Paddle Wizard",
    desc: "Won 2 or more Pong games in a streak.",
    icon: "Disc",
  },
  {
    id: "mole_slayer",
    title: "Reflex King",
    desc: "Whacked 15 or more moles in a single round.",
    icon: "Hammer",
  },
  {
    id: "memory_ace",
    title: "Memory Ace",
    desc: "Cleared Memory Match in 22 moves or fewer.",
    icon: "Brain",
  },
  {
    id: "dodge_survivor",
    title: "Flash Reflex",
    desc: "Survived a full 20-second Reaction Dodge trial.",
    icon: "Zap",
  },
  {
    id: "runner_legend",
    title: "Cyber Runner",
    desc: "Scored 80+ in Endless Runner.",
    icon: "Rabbit",
  },
];

const LEGACY_KEYS = {
  "2048": "arcade:2048:best",
  snake: "arcade:snake:best",
  pong: "arcade:pong:streak",
  tictactoe: "arcade:tictactoe:score",
  rps: "arcade:rps:score",
  whacamole: "arcade:whacamole:best",
  memory: "arcade:memory:best",
  dodge: "arcade:dodge:best",
  runner: "arcade:runner:best",
};

export const getLegacyScore = (gameId) => {
  const key = LEGACY_KEYS[gameId];
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    if (gameId === "tictactoe" || gameId === "rps") {
      return JSON.parse(raw);
    }
    return Number(raw) || 0;
  } catch {
    return null;
  }
};

export const loadArcadeStats = () => {
  let stats = {
    totalPlayed: 0,
    coinsInserted: 0,
    games: {
      "2048": { best: 0, played: 0 },
      snake: { best: 0, played: 0 },
      pong: { bestStreak: 0, played: 0 },
      tictactoe: { wins: 0, losses: 0, draws: 0, played: 0 },
      rps: { wins: 0, losses: 0, ties: 0, played: 0 },
      whacamole: { best: 0, played: 0 },
      memory: { bestMoves: null, played: 0 },
      dodge: { best: 0, played: 0 },
      runner: { best: 0, played: 0 },
    },
  };

  try {
    const stored = JSON.parse(window.localStorage.getItem(STATS_KEY));
    if (stored && typeof stored === "object") {
      stats = { ...stats, ...stored, games: { ...stats.games, ...(stored.games || {}) } };
    }
  } catch {
    // fallback
  }

  Object.entries(LEGACY_KEYS).forEach(([gameId, key]) => {
    const legacy = getLegacyScore(gameId);
    if (legacy !== null && legacy !== undefined) {
      const g = stats.games[gameId] || {};
      if (typeof legacy === "number") {
        if (gameId === "memory") {
          if (!g.bestMoves || (legacy > 0 && legacy < g.bestMoves)) g.bestMoves = legacy;
        } else if (gameId === "pong") {
          if (legacy > (g.bestStreak || 0)) g.bestStreak = legacy;
        } else {
          if (legacy > (g.best || 0)) g.best = legacy;
        }
      } else if (typeof legacy === "object") {
        stats.games[gameId] = { ...g, ...legacy };
      }
    }
  });

  return stats;
};

export const saveArcadeStats = (stats) => {
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // storage unavailable
  }
};

export const recordGameSession = (gameId, scoreOrData) => {
  const stats = loadArcadeStats();
  stats.totalPlayed = (stats.totalPlayed || 0) + 1;

  if (!stats.games[gameId]) {
    stats.games[gameId] = { played: 0 };
  }
  const game = stats.games[gameId];
  game.played = (game.played || 0) + 1;

  if (gameId === "memory") {
    const moves = Number(scoreOrData);
    if (moves > 0 && (!game.bestMoves || moves < game.bestMoves)) {
      game.bestMoves = moves;
      try {
        window.localStorage.setItem(LEGACY_KEYS[gameId], String(moves));
      } catch {}
    }
    if (moves > 0 && moves <= 22) unlockAchievement("memory_ace");
  } else if (gameId === "pong") {
    const streak = Number(scoreOrData);
    if (streak > (game.bestStreak || 0)) {
      game.bestStreak = streak;
      try {
        window.localStorage.setItem(LEGACY_KEYS[gameId], String(streak));
      } catch {}
    }
    if (streak >= 2) unlockAchievement("pong_streak");
  } else if (gameId === "tictactoe" || gameId === "rps") {
    if (typeof scoreOrData === "object") {
      Object.assign(game, scoreOrData);
      try {
        window.localStorage.setItem(LEGACY_KEYS[gameId], JSON.stringify(scoreOrData));
      } catch {}
    }
  } else {
    const num = Number(scoreOrData);
    if (num > (game.best || 0)) {
      game.best = num;
      try {
        window.localStorage.setItem(LEGACY_KEYS[gameId], String(num));
      } catch {}
    }
    if (gameId === "snake" && num >= 50) unlockAchievement("snake_pro");
    if (gameId === "2048" && num >= 256) unlockAchievement("tile_master");
    if (gameId === "whacamole" && num >= 15) unlockAchievement("mole_slayer");
    if (gameId === "dodge" && num >= 180) unlockAchievement("dodge_survivor");
    if (gameId === "runner" && num >= 80) unlockAchievement("runner_legend");
  }

  unlockAchievement("first_coin");
  saveArcadeStats(stats);
  return stats;
};

export const getUnlockedAchievements = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(ACHIEVEMENTS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const unlockAchievement = (id) => {
  const current = getUnlockedAchievements();
  if (!current.includes(id)) {
    const next = [...current, id];
    try {
      window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next));
    } catch {}
    return true;
  }
  return false;
};
