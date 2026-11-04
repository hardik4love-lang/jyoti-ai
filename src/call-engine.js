/**
 * Jyoti AI - Simulated Live Audio Call Engine
 * Simulates a 1-on-1 direct celestial voice consultation with Jyoti.
 * Generates synthetic telephone ringtones via Web Audio API (0 external MP3 dependencies),
 * animates real-time audio visualizer waves, and manages call states.
 */

export class CallEngine {
  constructor(voiceEngine, aiService) {
    this.voiceEngine = voiceEngine;
    this.aiService = aiService;
    this.audioCtx = null;
    this.ringInterval = null;
    this.timerInterval = null;
    this.callSeconds = 0;
    this.isCallActive = false;
    this.isMuted = false;
    this.isSpeakerOn = true;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Play synthetic phone ring using dual oscillators (400Hz + 450Hz)
  startRinging(onConnected) {
    this.initAudioContext();
    if (!this.audioCtx) {
      setTimeout(onConnected, 2000);
      return;
    }

    let ringCount = 0;
    const playRingBurst = () => {
      if (this.isCallActive || ringCount >= 2) {
        clearInterval(this.ringInterval);
        onConnected();
        return;
      }
      ringCount++;

      try {
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(400, this.audioCtx.currentTime);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(450, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(this.audioCtx.currentTime + 1.2);
        osc2.stop(this.audioCtx.currentTime + 1.2);
      } catch (e) {
        console.warn("Ring sound warning:", e);
      }
    };

    playRingBurst();
    this.ringInterval = setInterval(playRingBurst, 3000);
  }

  stopRinging() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Play synthetic 3-tone call ended chime
  playEndChime() {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(400, this.audioCtx.currentTime + 0.15);
      osc.frequency.setValueAtTime(320, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {
      // Safe fallback
    }
  }

  startCallTimer(timerElement) {
    this.callSeconds = 0;
    this.isCallActive = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.callSeconds++;
      const mins = String(Math.floor(this.callSeconds / 60)).padStart(2, "0");
      const secs = String(this.callSeconds % 60).padStart(2, "0");
      if (timerElement) {
        timerElement.innerText = `${mins}:${secs}`;
      }
    }, 1000);
  }

  endCall() {
    this.stopRinging();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.playEndChime();
    this.isCallActive = false;
    this.callSeconds = 0;
    if (this.voiceEngine) {
      this.voiceEngine.stopListening();
      this.voiceEngine.stopSpeaking();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.voiceEngine) {
      if (this.isMuted) {
        this.voiceEngine.stopListening();
      } else {
        // Will resume on click
      }
    }
    return this.isMuted;
  }
}
