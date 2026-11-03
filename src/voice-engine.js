/**
 * Jyoti AI - Pure Client-Side Speech Synthesis (Voice of Jyoti)
 * 100% Free, zero-latency, realistic voice using Web Speech API.
 */

export class VoiceEngine {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.voiceEnabled = true;
    this.currentUtterance = null;
  }

  getVoice(lang = "en") {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (lang === "hi") {
      return voices.find(v => v.lang.includes("hi") || v.lang.includes("IN")) || voices[0];
    }
    // Prefer Indian English or pleasant natural English voice
    return voices.find(v => v.lang === "en-IN" || v.name.includes("India") || v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) || voices[0];
  }

  speak(text, lang = "en", onStart, onEnd) {
    if (!this.synth || !this.voiceEnabled) return;

    this.stop();

    // Clean markdown symbols for smooth, natural speech
    const cleanText = text
      .replace(/###|##|#/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/•/g, "")
      .replace(/[🕉️🙏✨💖🌟🔥💸🌿💍💼🔮]/g, "")
      .trim();

    // Limit speech to first 300 words for sweet, punchy voice delivery
    const speechSnippet = cleanText.split(/\s+/).slice(0, 80).join(" ");

    const utterance = new SpeechSynthesisUtterance(speechSnippet);
    utterance.voice = this.getVoice(lang);
    utterance.rate = 0.95; // Gentle, measured, soothing pace
    utterance.pitch = 1.05; // Warm, friendly tone

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
}
