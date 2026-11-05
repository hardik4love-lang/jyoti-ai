/**
 * Jyoti AI - Simli Real-Time Neural Streaming Avatar Engine
 * Integrates official Simli WebRTC SDK for authentic, broadcast-grade talking head video.
 * Runs at $0 cost utilizing Simli's 50 free minutes/month developer tier (No credit card required).
 */

const SIMLI_STORAGE_KEY = "jyoti_simli_api_key";
const SIMLI_FACE_STORAGE_KEY = "jyoti_simli_face_id";

// Default public female avatar Face ID from Simli's library if custom face not set
const DEFAULT_SIMLI_FACE_ID = "5514e24d-6086-46a3-ace4-6a7264e5cb7c";

export class SimliAvatarEngine {
  constructor() {
    this.apiKey = typeof localStorage !== "undefined" ? localStorage.getItem(SIMLI_STORAGE_KEY) || "" : "";
    this.faceId = typeof localStorage !== "undefined" ? localStorage.getItem(SIMLI_FACE_STORAGE_KEY) || DEFAULT_SIMLI_FACE_ID : DEFAULT_SIMLI_FACE_ID;
    this.client = null;
    this.isConnected = false;
    this.sessionToken = null;
    this.simliModule = null;
  }

  isConfigured() {
    return !!this.apiKey && this.apiKey.trim().length > 10;
  }

  saveConfig(apiKey, faceId = "") {
    this.apiKey = (apiKey || "").trim();
    if (faceId && faceId.trim()) {
      this.faceId = faceId.trim();
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SIMLI_STORAGE_KEY, this.apiKey);
      localStorage.setItem(SIMLI_FACE_STORAGE_KEY, this.faceId);
    }
  }

  clearConfig() {
    this.apiKey = "";
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(SIMLI_STORAGE_KEY);
      localStorage.removeItem(SIMLI_FACE_STORAGE_KEY);
    }
  }

  async loadSimliSDK() {
    if (this.simliModule) return this.simliModule;
    try {
      // Dynamic import of official simli-client via ESM
      this.simliModule = await import("https://esm.sh/simli-client@3.2.0");
      return this.simliModule;
    } catch (err) {
      console.warn("Failed to load Simli ESM client:", err);
      return null;
    }
  }

  /**
   * Request a session token directly from Simli API
   */
  async requestSessionToken() {
    if (!this.apiKey) {
      throw new Error("Simli API Key is required. Please enter your free key in settings.");
    }

    const payload = {
      faceId: this.faceId || DEFAULT_SIMLI_FACE_ID,
      maxSessionLength: 600,
      maxIdleTime: 180
    };

    const response = await fetch("https://api.simli.ai/compose/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-simli-api-key": this.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Simli Token Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    this.sessionToken = data.session_token || data.token;
    return this.sessionToken;
  }

  /**
   * Start Live WebRTC Neural Stream
   */
  async startStream(videoElement, audioElement, onStatusUpdate = null) {
    if (!this.isConfigured()) {
      throw new Error("NO_API_KEY");
    }

    if (onStatusUpdate) onStatusUpdate("Initializing Simli WebRTC SDK...");
    const sdk = await this.loadSimliSDK();
    if (!sdk || !sdk.SimliClient) {
      throw new Error("Unable to initialize Simli WebRTC client in this browser.");
    }

    if (onStatusUpdate) onStatusUpdate("Requesting secure neural session token...");
    const token = await this.requestSessionToken();

    if (onStatusUpdate) onStatusUpdate("Connecting WebRTC P2P media stream...");
    this.client = new sdk.SimliClient(
      token,
      videoElement,
      audioElement,
      null,
      sdk.LogLevel ? sdk.LogLevel.INFO : 2
    );

    await this.client.start();
    this.isConnected = true;
    if (onStatusUpdate) onStatusUpdate("Connected • Real-Time Neural Avatar Live");
    return true;
  }

  /**
   * Send PCM Audio Data to Simli to drive lip-sync and voice in real-time
   */
  sendAudioData(pcmData) {
    if (this.client && this.isConnected && typeof this.client.sendAudioData === "function") {
      this.client.sendAudioData(pcmData);
    }
  }

  stopStream() {
    if (this.client) {
      try {
        if (typeof this.client.stop === "function") {
          this.client.stop();
        }
      } catch (e) {}
      this.client = null;
    }
    this.isConnected = false;
  }
}
