/**
 * Jyoti AI - Pure Client-Side Web Audio Synthesizer
 * Generates relaxing 432Hz cosmic harmonic resonance at 0 bytes download cost.
 */

export class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play() {
    if (this.isPlaying) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    // Smooth fade in
    this.gainNode.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 3);
    this.gainNode.connect(this.ctx.destination);

    // Fundamental frequencies: 432Hz (Sacred Cosmic Pitch) + Sub-octave 108Hz + 216Hz
    const freqs = [108, 216, 432, 436]; // Slight detune for warm binaural beat

    this.oscillators = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      osc.connect(this.gainNode);
      osc.start();
      return osc;
    });

    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying) return;

    // Smooth fade out
    if (this.gainNode) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        this.oscillators.forEach(osc => osc.stop());
        this.oscillators = [];
        this.isPlaying = false;
      }, 1500);
    } else {
      this.isPlaying = false;
    }
  }
}
