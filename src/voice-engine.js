/**
 * Jyoti AI - Pure Client-Side Speech Synthesis & Speech Recognition
 * Voice of Jyoti (Text-to-Speech) + Talk to Jyoti (Speech-to-Text)
 * 100% Free, zero-latency, realistic voice interaction using Web Speech API.
 */

export class VoiceEngine {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.isListening = false;
    this.voiceEnabled = true;
    this.currentUtterance = null;
    this.recognition = null;

    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  getVoice(lang = "en") {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (lang === "hi") {
      return voices.find(v => v.lang.includes("hi") || v.lang.includes("IN")) || voices[0];
    }
    return voices.find(v => v.lang === "en-IN" || v.name.includes("India") || v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) || voices[0];
  }

  speak(text, lang = "en", onStart, onEnd) {
    if (!this.synth || !this.voiceEnabled) return;

    this.stop();

    const cleanText = text
      .replace(/###|##|#/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/•/g, "")
      .replace(/[🕉️🙏✨💖🌟🔥💸🌿💍💼🔮]/g, "")
      .trim();

    const speechSnippet = cleanText.split(/\s+/).slice(0, 80).join(" ");

    const utterance = new SpeechSynthesisUtterance(speechSnippet);
    utterance.voice = this.getVoice(lang);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) this.stop();
    return this.voiceEnabled;
  }

  // Speech Recognition (Talk to Jyoti via Microphone)
  startListening(lang = "en", onResult, onStart, onEnd) {
    if (!this.recognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    this.stop(); // Stop speaking before listening
    this.recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    this.recognition.onerror = (err) => {
      console.warn("Speech recognition error:", err);
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition already started:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
