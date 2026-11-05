/**
 * Jyoti AI - Biometric Sacred Yantra Haptic Scanner
 * Replaces the cheap "roadside tarot card" gimmick with a cinematic 3-second tactile ritual.
 * Features 432Hz -> 528Hz Solfeggio acoustic sweep, multi-stage rhythmic haptics,
 * and high-precision daily planetary prana alignment.
 * $0 external API, pure client-side Web Audio & Haptics.
 */

export class YantraScanner {
  constructor({ containerEl, circleEl, progressBarEl, statusEl, onComplete }) {
    this.container = containerEl;
    this.circle = circleEl;
    this.progressBar = progressBarEl;
    this.statusText = statusEl;
    this.onComplete = onComplete;

    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.timer = null;
    this.progressInterval = null;
    this.startTime = 0;
    this.holdDuration = 3000; // 3 seconds
    this.isHolding = false;

    this.bindEvents();
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  startSound() {
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = "sine";
      const now = this.audioCtx.currentTime;
      this.oscillator.frequency.setValueAtTime(432, now);
      // Sweep to 528Hz (Solfeggio Transformation)
      this.oscillator.frequency.exponentialRampToValueAtTime(528, now + 3.0);

      this.gainNode.gain.setValueAtTime(0.001, now);
      this.gainNode.gain.linearRampToValueAtTime(0.18, now + 0.3);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();
    } catch (e) {
      // Audio fallback
    }
  }

  stopSound() {
    if (this.oscillator && this.gainNode && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.1);
        this.oscillator.stop(now + 0.12);
      } catch (e) {}
      this.oscillator = null;
    }
  }

  vibrate(pattern) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  bindEvents() {
    if (!this.circle) return;

    const start = (e) => {
      e.preventDefault();
      if (this.isHolding) return;
      this.isHolding = true;
      this.startTime = Date.now();

      this.circle.classList.add("scanning-active");
      if (this.statusText) this.statusText.innerText = "Aligning consciousness with the 9 Grahas...";
      this.vibrate([20, 40]);
      this.startSound();

      // Progress bar animation
      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - this.startTime;
        const pct = Math.min(100, Math.round((elapsed / this.holdDuration) * 100));
        if (this.progressBar) this.progressBar.style.strokeDashoffset = `${283 - (283 * pct) / 100}`;

        if (pct === 50) {
          this.vibrate([25, 30, 25, 50]);
          if (this.statusText) this.statusText.innerText = "Resonating at 528Hz Heart Chakra frequency...";
        }
      }, 30);

      this.timer = setTimeout(() => {
        this.completeScan();
      }, this.holdDuration);
    };

    const cancel = (e) => {
      if (!this.isHolding) return;
      this.isHolding = false;
      clearTimeout(this.timer);
      clearInterval(this.progressInterval);
      this.stopSound();

      this.circle.classList.remove("scanning-active");
      if (this.progressBar) this.progressBar.style.strokeDashoffset = "283";
      if (this.statusText) this.statusText.innerText = "Hold thumb firmly for 3 full seconds to align";
    };

    this.circle.addEventListener("pointerdown", start);
    window.addEventListener("pointerup", cancel);
    this.circle.addEventListener("pointercancel", cancel);
  }

  completeScan() {
    this.isHolding = false;
    clearInterval(this.progressInterval);
    this.stopSound();

    this.circle.classList.remove("scanning-active");
    this.circle.classList.add("scan-complete");
    if (this.progressBar) this.progressBar.style.strokeDashoffset = "0";

    this.vibrate([80, 50, 140, 60, 200]);
    if (this.statusText) this.statusText.innerText = "✨ Cosmic Prana Aligned & Sealed!";

    setTimeout(() => {
      this.circle.classList.remove("scan-complete");
      if (this.onComplete) this.onComplete();
    }, 600);
  }
}

/**
 * Computes deterministic daily Oracle revelation from chart and calendar day
 */
export function getDailyOracleProphecy(chart) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const moonId = chart?.moonSign?.id || 1;
  const lagnaId = chart?.lagna?.id || 1;
  const seed = (dayOfYear * 13 + moonId * 7 + lagnaId * 5) % 100;

  const pranaScore = 82 + (seed % 17); // 82% to 98%
  
  const rulings = [
    { graha: "Surya (Sun)", aura: "Radiant Sovereign", rule: "Lead without seeking validation.", avoid: "Arguments with authority figures." },
    { graha: "Chandra (Moon)", aura: "Deep Somatic Intuition", rule: "Trust your first somatic gut impulse.", avoid: "Late-night overthinking and toxic nostalgia." },
    { graha: "Mangala (Mars)", aura: "Decisive Breakthrough Energy", rule: "Execute delayed hard tasks before noon.", avoid: "Impulsive texts written in anger." },
    { graha: "Budha (Mercury)", aura: "Sharp Commercial Insight", rule: "Negotiate contracts and pitch ideas.", avoid: "Gossip and multitasking." },
    { graha: "Guru (Jupiter)", aura: "Golden Divine Grace", rule: "Invest in higher study and generosity.", avoid: "Over-promising what you cannot deliver." },
    { graha: "Shukra (Venus)", aura: "Aesthetic Magnetism", rule: "Wear clean, elegant clothes and create art.", avoid: "Excessive indulgence and cheap compromises." },
    { graha: "Shani (Saturn)", aura: "Karmic Foundation Builder", rule: "Quiet, disciplined manual work.", avoid: "Complaining about delays." }
  ];

  const oracle = rulings[seed % rulings.length];

  return {
    pranaScore,
    rulingGraha: oracle.graha,
    auraType: oracle.aura,
    blessedAction: oracle.rule,
    forbiddenAction: oracle.avoid,
    sacredFrequency: "528 Hz (Sacred Transformation)",
    favorableDirection: ["North-East (Ishanya)", "East (Purva)", "North (Uttara)"][seed % 3]
  };
}
