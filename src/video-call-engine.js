/**
 * Jyoti AI - FaceTime-Style Interactive Live Video Consultation Engine
 * 100% Client-Side, $0 Server Cost, Zero External Streaming Dependencies.
 * Powers real-time front camera PiP, living avatar kinematics, audio waveform visualizer,
 * stochastic eye-blinking, and speech-reactive celestial aura.
 */

export class VideoCallEngine {
  constructor(voiceEngine, aiService) {
    this.voiceEngine = voiceEngine;
    this.aiService = aiService;

    // User camera state
    this.localStream = null;
    this.isCameraOn = true;
    this.isMicMuted = false;
    this.facingMode = "user"; // "user" (front) or "environment" (rear)

    // Audio & Visualizer state
    this.audioCtx = null;
    this.animFrameId = null;
    this.blinkTimeout = null;
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

  // 1. Initialize User Camera Stream (FaceTime PiP)
  async initUserCamera(videoElement, onFail) {
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (onFail) onFail(new Error("Camera API not supported on this device"));
      return false;
    }

    try {
      if (this.localStream) {
        this.stopCameraStream();
      }

      const constraints = {
        video: {
          facingMode: { ideal: this.facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: false // Audio managed via Web Speech / Web Audio API
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoElement) {
        videoElement.srcObject = this.localStream;
        await videoElement.play().catch(() => {});
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

  // 2. Flip Camera between Front and Rear (Mobile Support)
  async flipCamera(videoElement) {
    this.facingMode = this.facingMode === "user" ? "environment" : "user";
    return await this.initUserCamera(videoElement);
  }

  // 3. Toggle Camera Privacy
  toggleCamera(videoElement, placeholderElement) {
    if (!this.localStream) return false;
    this.isCameraOn = !this.isCameraOn;
    this.localStream.getVideoTracks().forEach(track => {
      track.enabled = this.isCameraOn;
    });
    if (placeholderElement) {
      placeholderElement.style.display = this.isCameraOn ? "none" : "flex";
    }
    if (videoElement) {
      videoElement.style.opacity = this.isCameraOn ? "1" : "0.15";
    }
    return this.isCameraOn;
  }

  // 4. Toggle Microphone Mute
  toggleMute() {
    this.isMicMuted = !this.isMicMuted;
    if (this.voiceEngine) {
      if (this.isMicMuted) {
        this.voiceEngine.stopListening();
      }
    }
    return this.isMicMuted;
  }

  // 5. Living Avatar Engine (Breathing + Stochastic Poisson Blinking)
  startLivingAvatar(avatarContainer, eyelidElement) {
    if (!avatarContainer) return;

    avatarContainer.classList.add("avatar-breathing-active");

    // Stochastic eye blinking scheduler (Poisson-distributed every 2.8s - 5.5s)
    const scheduleNextBlink = () => {
      if (!this.isCallActive) return;
      const nextInterval = 2800 + Math.random() * 2700;
      this.blinkTimeout = setTimeout(() => {
        if (eyelidElement) {
          eyelidElement.classList.add("blink-shutter");
          setTimeout(() => {
            eyelidElement.classList.remove("blink-shutter");
            scheduleNextBlink();
          }, 140); // 140ms natural eye blink
        }
      }, nextInterval);
    };

    scheduleNextBlink();
  }

  // 6. Speech-Reactive Viseme & Golden Aura Glow
  setAvatarSpeaking(isSpeaking, visemeElement, auraElement) {
    if (isSpeaking) {
      if (visemeElement) visemeElement.classList.add("viseme-speaking-active");
      if (auraElement) auraElement.classList.add("aura-pulse-active");
    } else {
      if (visemeElement) visemeElement.classList.remove("viseme-speaking-active");
      if (auraElement) auraElement.classList.remove("aura-pulse-active");
    }
  }

  // 7. Real-Time Oscilloscope Waveform Visualizer
  startVisualizer(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let phase = 0;

    const render = () => {
      if (!this.isCallActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isSpeaking = this.voiceEngine?.isSpeaking;
      const isListening = this.voiceEngine?.isListening;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isSpeaking
        ? "rgba(244, 196, 83, 0.95)"
        : isListening
          ? "rgba(56, 189, 248, 0.95)"
          : "rgba(255, 255, 255, 0.25)";

      ctx.beginPath();
      const points = 40;
      const sliceWidth = canvas.width / points;
      let x = 0;

      for (let i = 0; i < points; i++) {
        const baseAmp = isSpeaking ? 16 : isListening ? 10 : 3;
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

  // 8. Call Duration Timer HUD
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

  // 9. Floating PiP Drag Logic with Boundary Clamping
  setupDraggablePiP(pipElement) {
    if (!pipElement) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = pipElement.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      pipElement.style.cursor = "grabbing";
      pipElement.style.transition = "none";
      if (e.target.setPointerCapture && e.pointerId) {
        e.target.setPointerCapture(e.pointerId);
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Clamp within viewport
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
      pipElement.style.transition = "transform 0.2s ease, border-color 0.2s ease";
      if (e.target.releasePointerCapture && e.pointerId) {
        e.target.releasePointerCapture(e.pointerId);
      }
    };

    pipElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  // 10. End Consultation and Clean Up Hardware Tracks
  endCall() {
    this.isCallActive = false;
    if (this.callTimerInterval) clearInterval(this.callTimerInterval);
    if (this.blinkTimeout) clearTimeout(this.blinkTimeout);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.stopCameraStream();
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
