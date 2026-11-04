/**
 * Jyoti AI - Sacred Temple Bell Synthesizer & Haptics Engine
 * Pure Web Audio additive physical modeling of an authentic bronze temple bell (Ghanti)
 * and Tibetan singing bowl (432Hz fundamental + 4 inharmonic resonant partials).
 * Zero external audio files, $0 cost, zero network latency.
 */

export class TempleBellEngine {
  constructor() {
    this.audioCtx = null;
  }

  initAudioContext() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  /**
   * Strike the sacred temple bell
   * @param {number} baseFreq - Base fundamental frequency (default 432Hz)
   */
  ring(baseFreq = 432.0) {
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.triggerHaptic("sacred");

    const now = this.audioCtx.currentTime;
    // Inharmonic modal partials of an ancient bronze bell
    const partials = [
      { freqRatio: 1.0, gain: 0.35, decay: 4.8 },   // Fundamental
      { freqRatio: 2.0, gain: 0.20, decay: 3.5 },   // Octave harmonic
      { freqRatio: 2.76, gain: 0.16, decay: 2.4 },  // Sacred Tierce
      { freqRatio: 4.08, gain: 0.10, decay: 1.6 },  // Upper chime
      { freqRatio: 5.4, gain: 0.05, decay: 0.9 }    // Rim strike transient
    ];

    partials.forEach(p => {
      try {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * p.freqRatio, now);

        // Instant strike transient with natural exponential decay
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(p.gain, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + p.decay);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + p.decay);
      } catch (e) {
        // Safe fallback
      }
    });
  }

  triggerHaptic(type = "light") {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        if (type === "light") navigator.vibrate(12);
        else if (type === "medium") navigator.vibrate(25);
        else if (type === "sacred") navigator.vibrate([20, 50, 25, 60, 40]);
      } catch (e) {
        // Safe fallback
      }
    }
  }
}
