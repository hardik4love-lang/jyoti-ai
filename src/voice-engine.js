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
    this.voices = [];

    if (this.synth) {
      this.voices = this.synth.getVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.voices = this.synth.getVoices();
        };
      }
    }

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
    const voices = this.voices && this.voices.length > 0 ? this.voices : this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === "hi") {
      return (
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang.includes("hi")) ||
        voices.find(v => v.name.includes("Lekha") || v.name.includes("Swara")) ||
        voices[0]
      );
    }
    return (
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.name.includes("Neerja") || v.name.includes("Rishi") || v.name.includes("Aditi") || v.name.includes("India")) ||
      voices.find(v => v.name.includes("Samantha") || v.name.includes("Natural") || v.name.includes("Google")) ||
      voices[0]
    );
  }

  speak(text, langOrEndCb = "en", onStart, onEnd) {
    if (!this.synth || !this.voiceEnabled) return;

    let lang = "en";
    let startCb = onStart;
    let endCb = onEnd;

    if (typeof langOrEndCb === "function") {
      endCb = langOrEndCb;
      lang = "en";
    } else if (typeof langOrEndCb === "string") {
      lang = langOrEndCb;
    }

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
      if (startCb) startCb();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (endCb) endCb();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (endCb) endCb();
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

  stopSpeaking() {
    this.stop();
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) this.stop();
    return this.voiceEnabled;
  }

  // Speech Recognition (Talk to Jyoti via Microphone)
  startListening(langOrOnResult = "en", onResult, onStart, onEnd) {
    let lang = "en";
    let resultCb = onResult;
    let startCb = onStart;
    let endCb = onEnd;

    if (typeof langOrOnResult === "function") {
      resultCb = langOrOnResult;
      startCb = onResult;
      endCb = onStart;
      lang = "en";
    } else if (typeof langOrOnResult === "string") {
      lang = langOrOnResult;
    }

    if (!this.recognition) {
      console.warn("Speech recognition not supported in this browser. Please use text input.");
      return;
    }

    this.stop(); // Stop speaking before listening
    this.recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

    this.recognition.onstart = () => {
      this.isListening = true;
      if (startCb) startCb();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (resultCb) resultCb(transcript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (endCb) endCb();
    };

    this.recognition.onerror = (err) => {
      console.warn("Speech recognition error:", err);
      this.isListening = false;
      if (endCb) endCb();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Recognition already active:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
