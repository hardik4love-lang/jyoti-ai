/**
 * Jyoti AI - FaceTime-Style Interactive Live HD Video Consultation Engine
 * 100% Client-Side, $0 Server Cost, Zero External Streaming Dependencies.
 * Features dual-stream cinematic HD video playback (seamless crossfade between idle & talking),
 * real-time user webcam PiP with graceful fallback, live oscilloscope waveform visualizer,
 * Web Audio connection chimes, and cosmic aura filters.
 */

import { SimliAvatarEngine } from "./simli-avatar.js";

export class VideoCallEngine {
  constructor(voiceEngine, aiService) {
    this.voiceEngine = voiceEngine;
    this.aiService = aiService;
    this.simliEngine = new SimliAvatarEngine();

    // User camera state
    this.localStream = null;
    this.isCameraOn = true;
    this.isMicMuted = false;
    this.facingMode = "user"; // "user" (front) or "environment" (rear)
    this.isAuraFilterOn = false;

    // Video streams
    this.idleVideoEl = null;
    this.talkingVideoEl = null;
    this.neuralVideoEl = null;
    this.isSpeaking = false;
    this.isNeuralMode = false;

    // Audio & Visualizer state
    this.audioCtx = null;
    this.animFrameId = null;
    this.ringInterval = null;

    // Call state
    this.isCallActive = false;
    this.callDurationSec = 0;
    this.callTimerInterval = null;
  }

  initAudioContext() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Play synthetic video connection ringer (dual chime 440Hz + 528Hz)
  playConnectChime() {
    this.initAudioContext();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(528, now + 0.4);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(660, now);
      osc2.frequency.exponentialRampToValueAtTime(792, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch (e) {}
  }

  // 1. Dual HD Video Stream Setup (Seamless Crossfade)
  setupVideoFeeds(idleVideoEl, talkingVideoEl) {
    this.idleVideoEl = idleVideoEl;
    this.talkingVideoEl = talkingVideoEl;

    if (this.idleVideoEl) {
      this.idleVideoEl.currentTime = 0;
      this.idleVideoEl.play().catch(() => {});
      this.idleVideoEl.classList.add("active");
    }
    if (this.talkingVideoEl) {
      this.talkingVideoEl.currentTime = 0;
      this.talkingVideoEl.play().catch(() => {});
      this.talkingVideoEl.classList.remove("active");
    }
  }

  // 2. Set Speaking State with Zero-Lag Crossfade
  setAvatarSpeaking(isSpeaking, haloElement = null) {
    this.isSpeaking = !!isSpeaking;

    if (this.talkingVideoEl && this.idleVideoEl) {
      if (this.isSpeaking) {
        this.talkingVideoEl.currentTime = 0;
        this.talkingVideoEl.play().catch(() => {});
        this.talkingVideoEl.classList.add("active");
        this.idleVideoEl.classList.remove("active");
      } else {
        this.idleVideoEl.play().catch(() => {});
        this.idleVideoEl.classList.add("active");
        this.talkingVideoEl.classList.remove("active");
      }
    }

    if (haloElement) {
      if (this.isSpeaking) {
        haloElement.classList.add("active");
      } else {
        haloElement.classList.remove("active");
      }
    }
  }

  // 3. Initialize User Camera Stream (FaceTime PiP)
  async initUserCamera(videoElement, onFail) {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (onFail) onFail(new Error("Camera API not supported on this browser or platform"));
      return false;
    }

    try {
      if (this.localStream) {
        this.stopCameraStream();
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: this.facingMode ? { ideal: this.facingMode } : undefined,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
      } catch (eConstraints) {
        // Fallback to basic unconstrained video for desktop webcams
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      this.localStream = stream;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play().catch(() => {});
        };
        videoElement.style.display = "block";
        videoElement.style.opacity = "1";
      }
      this.isCameraOn = true;
      return true;
    } catch (err) {
      console.warn("User camera access denied or unavailable:", err);
      if (onFail) onFail(err);
      this.isCameraOn = false;
      return false;
    }
  }

  // 4. Flip Camera between Front and Rear (Mobile Support)
  async flipCamera(videoElement) {
    this.facingMode = this.facingMode === "user" ? "environment" : "user";
    return await this.initUserCamera(videoElement);
  }

  // 5. Toggle Camera Privacy
  toggleCamera(videoElement, placeholderElement) {
    if (!this.localStream) {
      // If camera wasn't running, attempt to start it
      this.initUserCamera(videoElement);
      if (placeholderElement) placeholderElement.style.display = "none";
      return true;
    }
    this.isCameraOn = !this.isCameraOn;
    this.localStream.getVideoTracks().forEach(track => {
      track.enabled = this.isCameraOn;
    });
    if (placeholderElement) {
      placeholderElement.style.display = this.isCameraOn ? "none" : "flex";
    }
    if (videoElement) {
      videoElement.style.opacity = this.isCameraOn ? "1" : "0.1";
    }
    return this.isCameraOn;
  }

  // 6. Toggle Cosmic Aura Filter
  toggleAuraFilter(videoElement) {
    this.isAuraFilterOn = !this.isAuraFilterOn;
    if (videoElement) {
      if (this.isAuraFilterOn) {
        videoElement.classList.add("aura-filtered");
      } else {
        videoElement.classList.remove("aura-filtered");
      }
    }
    return this.isAuraFilterOn;
  }

  // 7. Toggle Microphone Mute
  toggleMute() {
    this.isMicMuted = !this.isMicMuted;
    if (this.voiceEngine) {
      if (this.isMicMuted) {
        this.voiceEngine.stopListening();
      }
    }
    return this.isMicMuted;
  }

  // 8. Real-Time Oscilloscope Waveform Visualizer
  startVisualizer(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let phase = 0;

    const render = () => {
      if (!this.isCallActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isSpeaking = this.voiceEngine?.isSpeaking || this.isSpeaking;
      const isListening = this.voiceEngine?.isListening;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isSpeaking
        ? "rgba(244, 196, 83, 0.95)"
        : isListening
          ? "rgba(56, 189, 248, 0.95)"
          : "rgba(255, 255, 255, 0.3)";

      ctx.beginPath();
      const points = 40;
      const sliceWidth = canvas.width / points;
      let x = 0;

      for (let i = 0; i < points; i++) {
        const baseAmp = isSpeaking ? 14 : isListening ? 9 : 2.5;
        const envelope = Math.sin((i / points) * Math.PI);
        const y = (canvas.height / 2) + Math.sin(phase + i * 0.35) * baseAmp * envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      phase += isSpeaking ? 0.22 : 0.08;
      this.animFrameId = requestAnimationFrame(render);
    };

    render();
  }

  // 9. Call Duration Timer HUD
  startCallTimer(timerElement) {
    this.callDurationSec = 0;
    this.isCallActive = true;
    if (this.callTimerInterval) clearInterval(this.callTimerInterval);

    this.callTimerInterval = setInterval(() => {
      this.callDurationSec++;
      const m = String(Math.floor(this.callDurationSec / 60)).padStart(2, "0");
      const s = String(this.callDurationSec % 60).padStart(2, "0");
      if (timerElement) timerElement.innerText = `${m}:${s}`;
    }, 1000);
  }

  // 10. Floating PiP Drag Logic with Boundary Clamping
  setupDraggablePiP(pipElement) {
    if (!pipElement) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons inside PiP
      if (e.target.closest("button")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = pipElement.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      pipElement.style.cursor = "grabbing";
      pipElement.style.transition = "none";
      if (e.target.setPointerCapture && e.pointerId) {
        try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const pad = 12;
      const maxLeft = window.innerWidth - pipElement.offsetWidth - pad;
      const maxTop = window.innerHeight - pipElement.offsetHeight - pad;

      newLeft = Math.max(pad, Math.min(newLeft, maxLeft));
      newTop = Math.max(pad, Math.min(newTop, maxTop));

      pipElement.style.left = `${newLeft}px`;
      pipElement.style.top = `${newTop}px`;
      pipElement.style.right = "auto";
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      pipElement.style.cursor = "grab";
      pipElement.style.transition = "border-color 0.2s ease, box-shadow 0.2s ease";
      if (e.target.releasePointerCapture && e.pointerId) {
        try { e.target.releasePointerCapture(e.pointerId); } catch(err) {}
      }
    };

    pipElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  // 11. End Consultation and Clean Up Hardware Tracks
  endCall() {
    this.isCallActive = false;
    if (this.callTimerInterval) clearInterval(this.callTimerInterval);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.stopCameraStream();
    if (this.simliEngine) {
      this.simliEngine.stopStream();
    }
    if (this.idleVideoEl) {
      this.idleVideoEl.pause();
    }
    if (this.talkingVideoEl) {
      this.talkingVideoEl.pause();
    }
    if (this.voiceEngine) {
      this.voiceEngine.stopListening();
      this.voiceEngine.stopSpeaking();
    }
  }

  stopCameraStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }
}
