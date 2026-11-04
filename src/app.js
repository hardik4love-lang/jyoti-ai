/**
 * Jyoti AI - Main Application Controller (v3 Viral Edition)
 * Conversational Onboarding • Cosmic Story Card Exporter •
 * Dual Persona (Guru vs Roast) • Interactive Stardust Canvas
 */

import { generateKundli, calculateAshtaKoota, calculateDailyPanchang, predictMarriageAndSoulmate, RASHIS } from "./vedic-engine.js";
import { searchCities, CITIES } from "./cities.js";
import { KundliChartRenderer } from "./chart-renderer.js";
import { AIService } from "./ai-service.js";
import { AmbientAudioEngine } from "./audio-ambient.js";
import { TRANSLATIONS } from "./i18n.js";
import { CosmicCardGenerator } from "./card-generator.js";
import { VoiceEngine } from "./voice-engine.js";
import { CELEBRITIES } from "./celebrities.js";
import { calculateDailyAura } from "./aura-meter.js";
import { drawPrashnaCards } from "./tarot-engine.js";
import { HOUSE_DEFINITIONS } from "./house-details.js";
import { getDailyRashifal, getAllRashifalList, ZODIAC_SIGNS } from "./rashifal-engine.js";
import { calculateGemstones } from "./gemstone-engine.js";
import { StreakEngine } from "./streak-engine.js";
import { CallEngine } from "./call-engine.js";
import { PWAInstaller } from "./pwa-install.js";

// Global State
const state = {
  activeChart: null,
  activeChartStyle: "north",
  activeVarga: "D1",
  currentLang: "en",
  currentTab: "personal",
  currentStep: 1,
  selectedGender: "Male",
  selectedRashifalSign: 1,
  chatHistory: [],
  isGenerating: false,
  lastBotMessage: ""
};

const aiService = new AIService();
const audioEngine = new AmbientAudioEngine();
const voiceEngine = new VoiceEngine();
const callEngine = new CallEngine(voiceEngine, aiService);

// DOM Elements
const elements = {
  // Navigation
  navTabPersonal: document.getElementById("navTabPersonal"),
  navTabShaadi: document.getElementById("navTabShaadi"),
  navTabMatching: document.getElementById("navTabMatching"),
  navTabPanchang: document.getElementById("navTabPanchang"),
  navTabTarot: document.getElementById("navTabTarot"),
  viewPersonal: document.getElementById("viewPersonal"),
  viewShaadi: document.getElementById("viewShaadi"),
  viewMatching: document.getElementById("viewMatching"),
  viewPanchang: document.getElementById("viewPanchang"),
  viewTarot: document.getElementById("viewTarot"),
  langToggleBtn: document.getElementById("langToggleBtn"),
  personaToggleBtn: document.getElementById("personaToggleBtn"),
  personaIcon: document.getElementById("personaIcon"),
  personaLabel: document.getElementById("personaLabel"),
  activePersonaBadge: document.getElementById("activePersonaBadge"),
  btnRoastToggle: document.getElementById("btnRoastToggle"),
  voiceToggleBtn: document.getElementById("voiceToggleBtn"),
  voiceIcon: document.getElementById("voiceIcon"),
  voiceLabel: document.getElementById("voiceLabel"),
  speakingHalo: document.getElementById("speakingHalo"),
  avatarSpeakingStatus: document.getElementById("avatarSpeakingStatus"),
  btnSpeakLastMsg: document.getElementById("btnSpeakLastMsg"),

  // Shaadi & Soulmate
  shaadiResultsContainer: document.getElementById("shaadiResultsContainer"),
  shaadiPromptBox: document.getElementById("shaadiPromptBox"),
  btnGoToConsultation: document.getElementById("btnGoToConsultation"),

  // Onboarding Steps
  onboardingSection: document.getElementById("onboardingSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  stepTitle: document.getElementById("stepPromptTitle"),
  stepSubtitle: document.getElementById("stepPromptSubtitle"),
  step1: document.getElementById("step1"),
  step2: document.getElementById("step2"),
  step3: document.getElementById("step3"),
  step4: document.getElementById("step4"),
  btnNext1: document.getElementById("btnNext1"),
  btnNext2: document.getElementById("btnNext2"),
  btnNext3: document.getElementById("btnNext3"),
  btnBack2: document.getElementById("btnBack2"),
  btnBack3: document.getElementById("btnBack3"),
  btnBack4: document.getElementById("btnBack4"),
  btnRevealDestiny: document.getElementById("btnRevealDestiny"),
  dots: document.querySelectorAll(".step-dots .dot"),
  genderBtns: document.querySelectorAll(".gender-btn"),

  // Inputs
  userName: document.getElementById("userName"),
  userDob: document.getElementById("userDob"),
  userTob: document.getElementById("userTob"),
  cityInput: document.getElementById("cityInput"),
  cityDropdown: document.getElementById("cityDropdown"),
  latInput: document.getElementById("latInput"),
  lonInput: document.getElementById("lonInput"),
  tzInput: document.getElementById("tzInput"),

  // Dashboard
  chartContainer: document.getElementById("chartContainer"),
  tabNorth: document.getElementById("tabNorth"),
  tabSouth: document.getElementById("tabSouth"),
  tabD1: document.getElementById("tabD1"),
  tabD9: document.getElementById("tabD9"),
  editChartBtn: document.getElementById("editChartBtn"),
  printReportBtn: document.getElementById("printReportBtn"),
  metricsBadges: document.getElementById("metricsBadges"),
  btnDownloadCard: document.getElementById("btnDownloadCard"),

  // Chat
  chatMessages: document.getElementById("chatMessages"),
  chatInput: document.getElementById("chatInput"),
  sendBtn: document.getElementById("sendBtn"),
  micBtn: document.getElementById("micBtn"),
  chipsWrapper: document.getElementById("chipsWrapper"),

  // Matching
  matchingForm: document.getElementById("matchingForm"),
  matchResultBox: document.getElementById("matchResultBox"),
  celebChipsContainer: document.getElementById("celebChipsContainer"),

  // Aura Meter
  auraMeterCard: document.getElementById("auraMeterCard"),

  // Panchang
  panchangDateDisplay: document.getElementById("panchangDateDisplay"),
  panchangGrid: document.getElementById("panchangGrid"),

  // Tarot
  tarotCardsContainer: document.getElementById("tarotCardsContainer"),
  btnShuffleTarot: document.getElementById("btnShuffleTarot"),
  tarotShareBar: document.getElementById("tarotShareBar"),
  btnShareTarotWhatsApp: document.getElementById("btnShareTarotWhatsApp"),

  // House Modal
  houseModal: document.getElementById("houseModal"),
  closeHouseModalBtn: document.getElementById("closeHouseModalBtn"),
  houseModalTitle: document.getElementById("houseModalTitle"),
  houseModalBody: document.getElementById("houseModalBody"),

  // Settings & Audio
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  providerSelect: document.getElementById("providerSelect"),
  geminiKeyInput: document.getElementById("geminiKeyInput"),
  groqKeyInput: document.getElementById("groqKeyInput"),
  audioToggleBtn: document.getElementById("audioToggleBtn"),
  starCanvas: document.getElementById("starCanvas"),

  // Bottom Dock Navigation
  dockHome: document.getElementById("dockHome"),
  dockRashifal: document.getElementById("dockRashifal"),
  dockCall: document.getElementById("dockCall"),
  dockUpaya: document.getElementById("dockUpaya"),
  dockMilan: document.getElementById("dockMilan"),
  dockTarot: document.getElementById("dockTarot"),

  // 12-Sign Rashifal
  viewRashifal: document.getElementById("viewRashifal"),
  rashifalDateDisplay: document.getElementById("rashifalDateDisplay"),
  rashifalChipsWrapper: document.getElementById("rashifalChipsWrapper"),
  rashifalContentArea: document.getElementById("rashifalContentArea"),

  // Gemstones & Upaya
  viewUpaya: document.getElementById("viewUpaya"),
  gemstoneCardsContainer: document.getElementById("gemstoneCardsContainer"),
  gemstoneWarningBox: document.getElementById("gemstoneWarningBox"),

  // Streak
  streakBadge: document.getElementById("streakBadge"),
  streakCount: document.getElementById("streakCount"),

  // PWA Banner & iOS Guide
  pwaBanner: document.getElementById("pwaBanner"),
  btnPwaInstall: document.getElementById("btnPwaInstall"),
  btnPwaClose: document.getElementById("btnPwaClose"),
  iosInstallModal: document.getElementById("iosInstallModal"),
  closeIosInstallBtn: document.getElementById("closeIosInstallBtn"),
  btnAcknowledgeIosInstall: document.getElementById("btnAcknowledgeIosInstall"),

  // Simulated Live Audio Call
  callOverlay: document.getElementById("callOverlay"),
  callStatus: document.getElementById("callStatus"),
  callTimer: document.getElementById("callTimer"),
  callSubtitles: document.getElementById("callSubtitles"),
  btnCallMute: document.getElementById("btnCallMute"),
  btnCallEnd: document.getElementById("btnCallEnd"),
  btnCallSpeaker: document.getElementById("btnCallSpeaker")
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  setupOnboardingFlow();
  setupStardustCanvas();
  renderCelebrityChips();
  loadSavedSettings();
  loadSavedChart();
  renderPanchang();
  initStreak();
  initPWA();
  initRashifalUI();
  registerServiceWorker();
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

// Stardust Ambient Background Particles (Lightweight, 60fps)
function setupStardustCanvas() {
  const canvas = elements.starCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.5 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.002
  }));

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1) { s.alpha = 0; s.x = Math.random() * w; s.y = Math.random() * h; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 196, 83, ${Math.sin(s.alpha * Math.PI) * 0.8})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Conversational Onboarding Logic
function setupOnboardingFlow() {
  const stepTitles = {
    1: { title: "What name does the universe call you?", sub: "Your sound vibration anchors your planetary consciousness." },
    2: { title: "When did your soul arrive in this realm?", sub: "Your birth date positions the 9 celestial Grahas across the zodiac." },
    3: { title: "At what exact moment did you take your first breath?", sub: "Your birth time unlocks your exact Ascendant (Lagna) degree." },
    4: { title: "Under what skies were you born?", sub: "Your geographic coordinates align local sidereal time with cosmic truth." }
  };

  function goToStep(step) {
    state.currentStep = step;
    elements.step1.classList.toggle("active", step === 1);
    elements.step2.classList.toggle("active", step === 2);
    elements.step3.classList.toggle("active", step === 3);
    elements.step4.classList.toggle("active", step === 4);

    elements.stepTitle.innerText = stepTitles[step].title;
    elements.stepSubtitle.innerText = stepTitles[step].sub;

    elements.dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === step - 1);
    });
  }

  // Next / Back handlers
  elements.btnNext1.addEventListener("click", () => {
    if (!elements.userName.value.trim()) {
      alert("Please enter your name.");
      return;
    }
    goToStep(2);
  });
  elements.btnNext2.addEventListener("click", () => goToStep(3));
  elements.btnNext3.addEventListener("click", () => goToStep(4));

  elements.btnBack2.addEventListener("click", () => goToStep(1));
  elements.btnBack3.addEventListener("click", () => goToStep(2));
  elements.btnBack4.addEventListener("click", () => goToStep(3));

  // Gender selection
  elements.genderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.genderBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedGender = btn.dataset.gender;
    });
  });

  // Reveal Destiny Button
  elements.btnRevealDestiny.addEventListener("click", executeCalculation);
}

function executeCalculation() {
  const name = elements.userName.value.trim() || "Seeker";
  const gender = state.selectedGender;
  const dob = elements.userDob.value;
  const tob = elements.userTob.value;

  // Auto-resolve city coordinates from input if not yet explicitly selected from dropdown
  const typedCity = elements.cityInput.value.trim();
  if (typedCity) {
    const matched = searchCities(typedCity)[0];
    if (matched && (!elements.latInput.value || elements.latInput.value === "28.6139")) {
      elements.latInput.value = matched.lat;
      elements.lonInput.value = matched.lon;
      elements.tzInput.value = matched.tz;
      elements.cityInput.value = `${matched.name}, ${matched.state ? matched.state + ", " : ""}${matched.country}`;
    }
  }

  const lat = parseFloat(elements.latInput.value) || 22.4707;
  const lon = parseFloat(elements.lonInput.value) || 70.0577;
  const tz = parseFloat(elements.tzInput.value) || 5.5;

  const chart = generateKundli({
    name,
    gender,
    dob,
    tob,
    lat,
    lon,
    timezone: tz
  });

  state.activeChart = chart;
  localStorage.setItem("jyoti_active_chart", JSON.stringify(chart));
  displayDashboard(chart);
}

function setupEventListeners() {
  // Navigation Tabs (Desktop & Legacy)
  if (elements.navTabPersonal) elements.navTabPersonal.addEventListener("click", () => switchNavTab("personal"));
  if (elements.navTabShaadi) elements.navTabShaadi.addEventListener("click", () => switchNavTab("shaadi"));
  if (elements.navTabMatching) elements.navTabMatching.addEventListener("click", () => switchNavTab("matching"));
  if (elements.navTabPanchang) elements.navTabPanchang.addEventListener("click", () => switchNavTab("panchang"));
  if (elements.navTabTarot) elements.navTabTarot.addEventListener("click", () => switchNavTab("tarot"));

  // Bottom Navigation Dock (Native Mobile Thumb-Zone)
  if (elements.dockHome) elements.dockHome.addEventListener("click", () => switchNavTab("personal"));
  if (elements.dockRashifal) elements.dockRashifal.addEventListener("click", () => switchNavTab("rashifal"));
  if (elements.dockCall) elements.dockCall.addEventListener("click", () => startLiveCall());
  if (elements.dockUpaya) elements.dockUpaya.addEventListener("click", () => switchNavTab("upaya"));
  if (elements.dockMilan) elements.dockMilan.addEventListener("click", () => switchNavTab("matching"));
  if (elements.dockTarot) elements.dockTarot.addEventListener("click", () => switchNavTab("tarot"));

  // Live Audio Call Controls
  if (elements.btnCallEnd) elements.btnCallEnd.addEventListener("click", () => endLiveCall());
  if (elements.btnCallMute) {
    elements.btnCallMute.addEventListener("click", () => {
      const isMuted = callEngine.toggleMute();
      elements.btnCallMute.classList.toggle("active", isMuted);
      elements.btnCallMute.innerText = isMuted ? "🔇" : "🎤";
    });
  }
  if (elements.btnCallSpeaker) {
    elements.btnCallSpeaker.addEventListener("click", () => {
      callEngine.isSpeakerOn = !callEngine.isSpeakerOn;
      elements.btnCallSpeaker.classList.toggle("active", callEngine.isSpeakerOn);
    });
  }

  // iOS PWA Guide Modal
  if (elements.closeIosInstallBtn) elements.closeIosInstallBtn.addEventListener("click", () => elements.iosInstallModal.classList.remove("active"));
  if (elements.btnAcknowledgeIosInstall) elements.btnAcknowledgeIosInstall.addEventListener("click", () => elements.iosInstallModal.classList.remove("active"));
  if (elements.iosInstallModal) {
    elements.iosInstallModal.addEventListener("click", (e) => {
      if (e.target === elements.iosInstallModal) elements.iosInstallModal.classList.remove("active");
    });
  }

  // Cosmic Streak Devotion Badge Click
  if (elements.streakBadge) {
    elements.streakBadge.addEventListener("click", () => {
      const { count } = StreakEngine.getStreak();
      StreakEngine.triggerHapticCelebration();
      alert(`🔥 You have a ${count}-Day Cosmic Devotion Streak!\nReturn daily to maintain planetary alignment and deepen your karmic insight.`);
    });
  }

  // Tarot handlers
  if (elements.btnShuffleTarot) elements.btnShuffleTarot.addEventListener("click", renderTarotCards);

  // House Modal close
  if (elements.closeHouseModalBtn) {
    elements.closeHouseModalBtn.addEventListener("click", () => elements.houseModal.classList.remove("active"));
  }
  if (elements.houseModal) {
    elements.houseModal.addEventListener("click", (e) => {
      if (e.target === elements.houseModal) elements.houseModal.classList.remove("active");
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (elements.houseModal) elements.houseModal.classList.remove("active");
      if (elements.settingsModal) elements.settingsModal.classList.remove("active");
    }
  });

  if (elements.btnGoToConsultation) {
    elements.btnGoToConsultation.addEventListener("click", () => switchNavTab("personal"));
  }

  // Voice Toggle & Speak button
  if (elements.voiceToggleBtn) elements.voiceToggleBtn.addEventListener("click", toggleVoice);
  if (elements.btnSpeakLastMsg) elements.btnSpeakLastMsg.addEventListener("click", speakLastBotMessage);

  // Language & Persona Toggles
  elements.langToggleBtn.addEventListener("click", toggleLanguage);
  elements.personaToggleBtn.addEventListener("click", togglePersonaMode);
  elements.btnRoastToggle.addEventListener("click", togglePersonaMode);

  // City Search Autocomplete
  elements.cityInput.addEventListener("input", handleCityInput);
  document.addEventListener("click", e => {
    if (!elements.cityDropdown.contains(e.target) && e.target !== elements.cityInput) {
      elements.cityDropdown.classList.remove("active");
    }
  });

  // Edit details button
  if (elements.editChartBtn) {
    elements.editChartBtn.addEventListener("click", () => {
      elements.dashboardSection.style.display = "none";
      elements.onboardingSection.style.display = "block";
      elements.onboardingSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Download Story Card
  elements.btnDownloadCard.addEventListener("click", () => {
    if (!state.activeChart) return;
    const archetypes = [
      "The Cosmic Alchemist", "The Rebel Mystic", "The Strategic Visionary",
      "The Resilient Healer", "The Sovereign Pioneer", "The Ethereal Sage"
    ];
    const archetype = archetypes[state.activeChart.moonSign.id % archetypes.length];
    CosmicCardGenerator.downloadCard(state.activeChart, archetype);
  });

  // Print Report
  if (elements.printReportBtn) {
    elements.printReportBtn.addEventListener("click", () => window.print());
  }

  // Chart Style Toggles
  elements.tabNorth.addEventListener("click", () => setChartStyle("north"));
  elements.tabSouth.addEventListener("click", () => setChartStyle("south"));
  elements.tabD1.addEventListener("click", () => setVargaChart("D1"));
  elements.tabD9.addEventListener("click", () => setVargaChart("D9"));

  // Matching Form Submission
  elements.matchingForm.addEventListener("submit", handleMatchingSubmit);

  // Microphone voice input
  if (elements.micBtn) {
    elements.micBtn.addEventListener("click", handleMicClick);
  }

  // Chat sending
  elements.sendBtn.addEventListener("click", handleSendMessage);
  elements.chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Quick chips
  elements.chipsWrapper.addEventListener("click", e => {
    const chip = e.target.closest(".topic-chip");
    if (chip && !state.isGenerating) {
      const query = chip.dataset.query;
      elements.chatInput.value = query;
      handleSendMessage();
    }
  });

  // Settings modal
  elements.settingsBtn.addEventListener("click", openSettings);
  elements.closeSettingsBtn.addEventListener("click", closeSettings);
  elements.saveSettingsBtn.addEventListener("click", saveSettings);

  // Audio synthesizer toggle
  elements.audioToggleBtn.addEventListener("click", () => {
    const isPlaying = audioEngine.toggle();
    elements.audioToggleBtn.innerHTML = isPlaying
      ? "🔊 432Hz: ON"
      : "🔇 432Hz: OFF";
  });
}

// Render Celebrity Quick Match Chips
function renderCelebrityChips() {
  if (!elements.celebChipsContainer) return;

  elements.celebChipsContainer.innerHTML = CELEBRITIES.map(c => `
    <button type="button" class="celeb-chip" data-id="${c.id}">
      <span>${c.emoji}</span> <span>${c.name}</span>
    </button>
  `).join("");

  elements.celebChipsContainer.querySelectorAll(".celeb-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const celebId = btn.dataset.id;
      const celeb = CELEBRITIES.find(c => c.id === celebId);
      if (!celeb) return;

      // If user's chart exists, match directly with user
      if (state.activeChart) {
        const celebChart = generateKundli({
          name: celeb.name,
          gender: celeb.gender,
          dob: celeb.dob,
          tob: celeb.tob,
          lat: celeb.lat,
          lon: celeb.lon,
          timezone: celeb.tz
        });

        // Determine who is Boy / Girl based on gender
        const isUserMale = state.activeChart.user.gender === "Male";
        const boy = isUserMale ? state.activeChart : celebChart;
        const girl = isUserMale ? celebChart : state.activeChart;

        const result = calculateAshtaKoota(boy, girl);
        const statusColor = result.totalScore >= 28 ? "#4ade80" : result.totalScore >= 18 ? "#facc15" : "#f87171";

        elements.matchResultBox.innerHTML = `
          <div style="background: rgba(15, 17, 36, 0.9); border: 2px solid var(--accent-gold); border-radius: var(--radius-lg); padding: 1.75rem; text-align: center; box-shadow: 0 10px 40px rgba(244, 196, 83, 0.25);">
            <span style="font-size: 0.8rem; font-weight: 800; color: #ffdf7e; letter-spacing: 0.15em;">🌟 CELEBRITY SYNASTRY RESULT</span>
            <h3 style="font-size: 1.75rem; color: #fff; margin: 0.5rem 0;">
              ${state.activeChart.user.name} & ${celeb.name} ${celeb.emoji}
            </h3>
            <div style="font-size: 3.5rem; font-weight: 800; color: ${statusColor}; margin: 0.25rem 0;">
              ${result.totalScore} <span style="font-size: 1.5rem; color: var(--text-muted);">/ 36 Gunas</span>
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; color: ${statusColor}; margin-bottom: 1.25rem;">
              ${result.statusText} (${result.percentage}% Match)
            </div>

            <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">
              ${result.totalScore >= 24
                ? `Incredible cosmic synergy! Your Moon Nakshatra (${state.activeChart.nakshatra.name}) resonates profoundly with ${celeb.name}'s aura (${celebChart.nakshatra.name}).`
                : `A dynamic, high-spark connection! While temperaments differ, mutual fascination and growth are immense.`}
            </p>

            <button id="btnShareCelebWhatsApp" class="btn-celestial" style="background: linear-gradient(135deg, #25D366, #128C7E); color: #fff;">
              📲 Share Celebrity Match on WhatsApp
            </button>
          </div>
        `;

        elements.matchResultBox.style.display = "block";
        elements.matchResultBox.scrollIntoView({ behavior: "smooth" });

        document.getElementById("btnShareCelebWhatsApp")?.addEventListener("click", () => {
          const text = encodeURIComponent(
            `🌟 I just tested my Vedic compatibility with ${celeb.name} on Jyoti AI and we got ${result.totalScore}/36 Gunas (${result.percentage}% match)! 😱💍\n\nTest your celebrity crush 100% free: http://localhost:8080`
          );
          window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
        });
      } else {
        // Auto-fill girl or boy field in the form
        if (celeb.gender === "Female") {
          document.getElementById("girlName").value = celeb.name;
          document.getElementById("girlDob").value = celeb.dob;
          document.getElementById("girlTob").value = celeb.tob;
          document.getElementById("girlCity").value = celeb.city;
        } else {
          document.getElementById("boyName").value = celeb.name;
          document.getElementById("boyDob").value = celeb.dob;
          document.getElementById("boyTob").value = celeb.tob;
          document.getElementById("boyCity").value = celeb.city;
        }
        elements.matchingForm.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Render Daily Cosmic Energy & Aura Meter
function renderAuraMeter(chart) {
  if (!elements.auraMeterCard) return;
  const aura = calculateDailyAura(chart);

  elements.auraMeterCard.innerHTML = `
    <div class="aura-meter-header">
      <div class="aura-meter-title">✨ Today's Cosmic Alignment</div>
      <div style="font-size: 0.75rem; color: #ffdf7e; font-weight: 700;">${aura.dayLord}'s Day</div>
    </div>

    <div class="aura-bars-grid">
      <div class="aura-bar-row">
        <div class="aura-bar-label">
          <span>💖 Love & Harmony</span>
          <span style="font-weight: bold; color: #f472b6;">${aura.love}%</span>
        </div>
        <div class="aura-track">
          <div class="aura-fill" style="width: ${aura.love}%; background: linear-gradient(90deg, #ec4899, #f43f5e);"></div>
        </div>
      </div>

      <div class="aura-bar-row">
        <div class="aura-bar-label">
          <span>💼 Career & Momentum</span>
          <span style="font-weight: bold; color: #60a5fa;">${aura.career}%</span>
        </div>
        <div class="aura-track">
          <div class="aura-fill" style="width: ${aura.career}%; background: linear-gradient(90deg, #3b82f6, #06b6d4);"></div>
        </div>
      </div>

      <div class="aura-bar-row">
        <div class="aura-bar-label">
          <span>🔮 Intuition & Spirit</span>
          <span style="font-weight: bold; color: #c084fc;">${aura.intuition}%</span>
        </div>
        <div class="aura-track">
          <div class="aura-fill" style="width: ${aura.intuition}%; background: linear-gradient(90deg, #a855f7, #eab308);"></div>
        </div>
      </div>
    </div>

    <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.75rem; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.5rem;">
      <strong>Guidance:</strong> ${aura.advice}
    </p>
  `;
}
function switchNavTab(tabName) {
  state.currentTab = tabName;

  // Bottom dock buttons (Thumb Zone)
  if (elements.dockHome) elements.dockHome.classList.toggle("active", tabName === "personal");
  if (elements.dockRashifal) elements.dockRashifal.classList.toggle("active", tabName === "rashifal");
  if (elements.dockUpaya) elements.dockUpaya.classList.toggle("active", tabName === "upaya");
  if (elements.dockMilan) elements.dockMilan.classList.toggle("active", tabName === "matching" || tabName === "shaadi");
  if (elements.dockTarot) elements.dockTarot.classList.toggle("active", tabName === "tarot");

  // Legacy header tabs
  if (elements.navTabPersonal) elements.navTabPersonal.classList.toggle("active", tabName === "personal");
  if (elements.navTabShaadi) elements.navTabShaadi.classList.toggle("active", tabName === "shaadi");
  if (elements.navTabMatching) elements.navTabMatching.classList.toggle("active", tabName === "matching");
  if (elements.navTabPanchang) elements.navTabPanchang.classList.toggle("active", tabName === "panchang");
  if (elements.navTabTarot) elements.navTabTarot.classList.toggle("active", tabName === "tarot");

  // View visibility
  if (elements.viewPersonal) elements.viewPersonal.style.display = tabName === "personal" ? "block" : "none";
  if (elements.viewShaadi) elements.viewShaadi.style.display = tabName === "shaadi" ? "block" : "none";
  if (elements.viewMatching) elements.viewMatching.style.display = tabName === "matching" ? "block" : "none";
  if (elements.viewPanchang) elements.viewPanchang.style.display = tabName === "panchang" ? "block" : "none";
  if (elements.viewTarot) elements.viewTarot.style.display = tabName === "tarot" ? "block" : "none";
  if (elements.viewRashifal) elements.viewRashifal.style.display = tabName === "rashifal" ? "block" : "none";
  if (elements.viewUpaya) elements.viewUpaya.style.display = tabName === "upaya" ? "block" : "none";

  if (tabName === "panchang") renderPanchang();
  if (tabName === "shaadi") renderShaadiRadar();
  if (tabName === "tarot") renderTarotCards();
  if (tabName === "rashifal") renderRashifal(state.selectedRashifalSign || 1);
  if (tabName === "upaya") renderGemstones();
}

// 12-Sign Daily Transit Rashifal
function initRashifalUI() {
  if (!elements.rashifalChipsWrapper) return;
  elements.rashifalChipsWrapper.innerHTML = ZODIAC_SIGNS.map(sign => `
    <button class="sign-chip ${sign.id === state.selectedRashifalSign ? "active" : ""}" data-sign="${sign.id}">
      <span>${sign.symbol}</span>
      <span>${sign.english} (${sign.name})</span>
    </button>
  `).join("");

  elements.rashifalChipsWrapper.querySelectorAll(".sign-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const sId = parseInt(btn.dataset.sign, 10);
      renderRashifal(sId);
    });
  });

  renderRashifal(state.selectedRashifalSign || 1);
}

function renderRashifal(signId) {
  state.selectedRashifalSign = signId;
  const data = getDailyRashifal(signId);

  if (elements.rashifalChipsWrapper) {
    elements.rashifalChipsWrapper.querySelectorAll(".sign-chip").forEach(b => {
      b.classList.toggle("active", parseInt(b.dataset.sign, 10) === signId);
    });
  }

  if (elements.rashifalDateDisplay) {
    elements.rashifalDateDisplay.innerText = data.dateString;
  }

  if (!elements.rashifalContentArea) return;
  elements.rashifalContentArea.innerHTML = `
    <div class="rashifal-hero-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span style="font-size: 2.2rem; margin-right: 0.5rem;">${data.symbol}</span>
          <span style="font-size: 1.45rem; font-weight: 800; color: #fff;">${data.english} • ${data.name}</span>
          <div style="color: var(--accent-gold); font-size: 0.85rem; margin-top: 0.2rem;">
            Ruler: <strong>${data.lord}</strong> • Element: <strong>${data.element}</strong> • Deity: <strong>${data.deity}</strong>
          </div>
        </div>
        <div style="background: rgba(244, 196, 83, 0.15); border: 1px solid var(--border-glow); padding: 0.4rem 0.85rem; border-radius: var(--radius-full); color: var(--accent-gold); font-weight: 800; font-size: 0.95rem;">
          Cosmic Index: ${data.overallScore}%
        </div>
      </div>

      <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.5rem;">${data.headline}</h3>
      <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.5rem;">
        ${data.forecast}
      </p>

      <!-- Rating Meters -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span>❤️ Romance & Harmony</span>
            <span style="font-weight: bold; color: #f43f5e;">${data.loveScore}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${data.loveScore}%; background: linear-gradient(90deg, #ec4899, #f43f5e);"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span>💼 Career & Wealth</span>
            <span style="font-weight: bold; color: #4ade80;">${data.careerScore}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${data.careerScore}%; background: linear-gradient(90deg, #10b981, #4ade80);"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
            <span>⚡ Vital Prana (Health)</span>
            <span style="font-weight: bold; color: #38bdf8;">${data.healthScore}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${data.healthScore}%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
          </div>
        </div>
      </div>

      <!-- Lucky Attributes -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem;">
        <div style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); padding: 0.45rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem;">
          🎨 Lucky Color: <strong>${data.luckyColor}</strong>
        </div>
        <div style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); padding: 0.45rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem;">
          🔢 Lucky Number: <strong>${data.luckyNumber}</strong>
        </div>
        <div style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); padding: 0.45rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.82rem;">
          ⏰ Shubha Muhurat: <strong>${data.luckyMuhurat}</strong>
        </div>
      </div>

      <!-- Upaya -->
      <div style="background: rgba(244, 196, 83, 0.08); border-left: 3px solid var(--accent-gold); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.88rem; color: #fef08a; line-height: 1.6;">
        <strong>🕊️ Daily Vedic Upaya:</strong> ${data.upaya}
      </div>
    </div>
  `;
}

// Classical Parashara Gemstones & Vedic Upaya
function renderGemstones() {
  if (!elements.gemstoneCardsContainer) return;

  if (!state.activeChart) {
    elements.gemstoneCardsContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.95rem;">
          Personalized gemstones require your exact Ascendant (Lagna) and 9th House fortune lord.
        </p>
        <button id="btnGoKundliForGems" class="btn-primary" style="margin: 0 auto;">
          ✨ Calculate My Kundli First
        </button>
      </div>
    `;
    const btn = document.getElementById("btnGoKundliForGems");
    if (btn) btn.onclick = () => switchNavTab("personal");
    if (elements.gemstoneWarningBox) elements.gemstoneWarningBox.style.display = "none";
    return;
  }

  const gems = calculateGemstones(state.activeChart);
  if (!gems) return;

  elements.gemstoneCardsContainer.innerHTML = gems.prescriptions.map(p => `
    <div class="gemstone-card">
      <div class="gemstone-role-tag">${p.role} • ${p.planet}</div>
      <h3 style="color: #fff; font-size: 1.25rem; margin-bottom: 0.35rem;">${p.data.stone}</h3>
      <p style="color: var(--accent-gold-light); font-size: 0.82rem; margin-bottom: 0.75rem;">
        Alternative: ${p.data.altStone} • Color: ${p.data.color}
      </p>
      <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 0.85rem;">
        ${p.purpose} ${p.data.benefits}
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.5rem; font-size: 0.78rem; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 0.75rem;">
        <div>💍 Metal: <strong>${p.data.metal}</strong></div>
        <div>👆 Finger: <strong>${p.data.finger}</strong></div>
        <div>🗓️ Day/Time: <strong>${p.data.day}</strong></div>
        <div>📿 Rudraksha: <strong>${p.data.rudraksha}</strong></div>
      </div>

      <div style="font-size: 0.78rem; color: #86efac; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem;">
        <strong>Chant:</strong> "${p.data.mantra}" (108 times)
      </div>
    </div>
  `).join("");

  if (gems.maleficWarnings.length > 0 && elements.gemstoneWarningBox) {
    elements.gemstoneWarningBox.style.display = "block";
    elements.gemstoneWarningBox.innerHTML = `
      <strong>⚠️ Astrological Dusthana Cautions:</strong>
      <ul style="margin-left: 1.25rem; margin-top: 0.35rem;">
        ${gems.maleficWarnings.map(w => `<li>${w}</li>`).join("")}
      </ul>
    `;
  } else if (elements.gemstoneWarningBox) {
    elements.gemstoneWarningBox.style.display = "none";
  }
}

// Live Simulated Audio Call with Jyoti
function startLiveCall() {
  if (!elements.callOverlay) return;
  elements.callOverlay.style.display = "flex";
  elements.callStatus.innerText = "Dialing Jyoti in the Celestial Realm...";
  elements.callTimer.style.display = "none";
  elements.callSubtitles.innerText = '"Connecting your soul vibration to the stars..."';

  callEngine.startRinging(() => {
    elements.callStatus.innerText = "Connected • Live Jyotish Consultation";
    elements.callTimer.style.display = "block";
    callEngine.startCallTimer(elements.callTimer);

    const greeting = state.activeChart
      ? `Namaste ${state.activeChart.user.name}! I am Jyoti. Your stars show your Lagna is ${state.activeChart.lagna.english}. What cosmic guidance do you seek today?`
      : "Namaste! I am Jyoti, your AI Vedic Astrologer. I am listening to your stars. Speak freely about your destiny or question.";

    elements.callSubtitles.innerText = `"${greeting}"`;
    voiceEngine.speak(greeting, () => {
      if (callEngine.isCallActive && !callEngine.isMuted) {
        voiceEngine.startListening(
          transcript => handleCallTranscript(transcript),
          () => {}
        );
      }
    });
  });
}

async function handleCallTranscript(query) {
  if (!query || !callEngine.isCallActive) return;
  elements.callSubtitles.innerText = `You: "${query}"`;
  voiceEngine.stopListening();
  try {
    const reply = await aiService.askQuestion(query, state.activeChart, state.chatHistory);
    elements.callSubtitles.innerText = `Jyoti: "${reply}"`;
    voiceEngine.speak(reply, () => {
      if (callEngine.isCallActive && !callEngine.isMuted) {
        voiceEngine.startListening(
          transcript => handleCallTranscript(transcript),
          () => {}
        );
      }
    });
  } catch (e) {
    elements.callSubtitles.innerText = "Jyoti: I felt a cosmic disturbance. Could you repeat that?";
  }
}

function endLiveCall() {
  callEngine.endCall();
  if (elements.callOverlay) {
    elements.callOverlay.style.display = "none";
  }
}

// Cosmic Streak Devotion
function initStreak() {
  const result = StreakEngine.updateStreak();
  if (elements.streakCount) {
    elements.streakCount.innerText = result.count;
  }
}

// Smart PWA Installation
function initPWA() {
  new PWAInstaller(
    elements.pwaBanner,
    elements.btnPwaInstall,
    elements.btnPwaClose,
    elements.iosInstallModal
  );
}

// Render Daily Vedic Tarot & Prashna
function renderTarotCards() {
  if (!elements.tarotCardsContainer) return;
  const cards = drawPrashnaCards(3);
  const cardList = [cards.past, cards.present, cards.future];

  elements.tarotCardsContainer.innerHTML = cardList.map(c => `
    <div class="tarot-card-item">
      <span class="card-role-badge">${c.role}</span>
      <div class="card-symbol-hero">${c.symbol}</div>
      <h3 class="card-name-title">${c.name}</h3>
      <div class="card-keywords">${c.keywords}</div>
      <p class="card-advice-body">
        <strong>Oracle Advice:</strong> ${c.advice}
      </p>
    </div>
  `).join("");

  if (elements.tarotShareBar) elements.tarotShareBar.style.display = "block";

  if (elements.btnShareTarotWhatsApp) {
    elements.btnShareTarotWhatsApp.onclick = () => {
      const text = encodeURIComponent(
        `🔮 Daily Vedic Prashna Oracle on Jyoti AI:\n\n📜 Past Root: ${cards.past.name} (${cards.past.keywords})\n⚡ Present Energy: ${cards.present.name} (${cards.present.keywords})\n✨ Future Outcome: ${cards.future.name}\n\n"${cards.future.advice}"\n\nDraw your free 3-card reading: http://localhost:8080`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    };
  }
}

// Interactive House Modal Handler
function attachHouseClickListeners() {
  if (!elements.chartContainer) return;
  elements.chartContainer.querySelectorAll(".house-group").forEach(group => {
    group.addEventListener("click", () => {
      const houseNum = parseInt(group.dataset.house);
      openHouseModal(houseNum);
    });
  });
}

function openHouseModal(houseNum) {
  if (!state.activeChart) return;
  const def = HOUSE_DEFINITIONS[houseNum];
  const isNavamsha = state.activeVarga === "D9";

  let rashiInfo;
  let planetsInHouse = "";

  if (isNavamsha) {
    const navLagnaId = state.activeChart.navamsha.lagna.id;
    const navRashiId = ((navLagnaId + houseNum - 2) % 12) + 1;
    rashiInfo = RASHIS[navRashiId - 1];
    planetsInHouse = state.activeChart.navamsha.planets
      .filter(p => p.rashiId === navRashiId)
      .map(p => p.name)
      .join(", ") || "None";
  } else {
    const houseData = state.activeChart.houses[houseNum];
    rashiInfo = houseData.rashi;
    planetsInHouse = houseData.planets.join(", ") || "None";
  }

  elements.houseModalTitle.innerHTML = `House ${houseNum}: ${def.sanskrit} <span style="font-size:0.85rem; color:#fff;">(${def.title}) [${isNavamsha ? "D-9 Navamsha" : "D-1 Rashi"}]</span>`;
  elements.houseModalBody.innerHTML = `
    <div style="background: rgba(244, 196, 83, 0.1); border: 1px solid var(--border-glow); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
      <strong>Sign Placed:</strong> ${rashiInfo.english} (${rashiInfo.name}) • <strong>Sign Lord:</strong> ${rashiInfo.lord}
    </div>
    <div style="margin-bottom: 0.75rem;">
      <strong>Planets Residing:</strong> <span style="color:#ffdf7e; font-weight:bold;">${planetsInHouse}</span>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <strong>Significations (Karakas):</strong> ${def.significance}
    </div>
    <div style="margin-bottom: 0.75rem;">
      <strong>Governed Anatomy:</strong> ${def.bodyParts}
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.75rem; margin-top: 0.75rem; color: #86efac;">
      <strong>Vedic Upaya (Remedy):</strong> ${def.guidance}
    </div>
  `;

  elements.houseModal.classList.add("active");
}

// Microphone input handler
function handleMicClick() {
  if (voiceEngine.isListening) {
    voiceEngine.stopListening();
    elements.micBtn.classList.remove("listening");
    elements.chatInput.placeholder = TRANSLATIONS[state.currentLang].placeholderAsk;
    return;
  }

  voiceEngine.startListening(
    state.currentLang,
    // On Result
    (transcript) => {
      elements.chatInput.value = transcript;
      elements.micBtn.classList.remove("listening");
      elements.chatInput.placeholder = TRANSLATIONS[state.currentLang].placeholderAsk;
      handleSendMessage();
    },
    // On Start
    () => {
      elements.micBtn.classList.add("listening");
      elements.chatInput.placeholder = state.currentLang === "hi" ? "सुन रहे हैं... बोलिए..." : "Listening to you... Speak now...";
    },
    // On End
    () => {
      elements.micBtn.classList.remove("listening");
      elements.chatInput.placeholder = TRANSLATIONS[state.currentLang].placeholderAsk;
    }
  );
}
function toggleVoice() {
  const isEnabled = voiceEngine.toggleVoice();
  elements.voiceIcon.innerText = isEnabled ? "🔊" : "🔇";
  elements.voiceLabel.innerText = isEnabled ? "Voice: ON" : "Voice: OFF";
}

function speakLastBotMessage() {
  if (state.lastBotMessage) {
    speakWithJyoti(state.lastBotMessage);
  }
}

function speakWithJyoti(text) {
  voiceEngine.speak(
    text,
    state.currentLang,
    () => {
      // On start speaking: halo glowing
      if (elements.speakingHalo) elements.speakingHalo.classList.add("active");
      if (elements.avatarSpeakingStatus) {
        elements.avatarSpeakingStatus.innerHTML = `<span class="status-dot" style="background:#f43f5e; box-shadow:0 0 8px #f43f5e;"></span> Jyoti is speaking to you...`;
      }
    },
    () => {
      // On end speaking
      if (elements.speakingHalo) elements.speakingHalo.classList.remove("active");
      if (elements.avatarSpeakingStatus) {
        elements.avatarSpeakingStatus.innerHTML = `<span class="status-dot"></span> In consultation with you`;
      }
    }
  );
}

// Render Shaadi & Soulmate Radar
function renderShaadiRadar() {
  if (!state.activeChart) {
    elements.shaadiResultsContainer.style.display = "none";
    elements.shaadiPromptBox.style.display = "block";
    return;
  }

  elements.shaadiPromptBox.style.display = "none";
  const soul = predictMarriageAndSoulmate(state.activeChart);

  elements.shaadiResultsContainer.innerHTML = `
    <div class="shaadi-card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 800; color: #f43f5e; letter-spacing: 0.15em;">SOULMATE ARCHETYPE</span>
          <h3 style="font-size: 1.6rem; color: #fff; margin-top: 0.2rem;">"${soul.archetype.title}"</h3>
        </div>
        <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem; color: #fda4af; font-weight: 700;">
          7th House in ${state.activeChart.houses[7].rashi.english} (${state.activeChart.houses[7].rashi.name})
        </div>
      </div>

      <p style="color: var(--text-secondary); margin-top: 1rem; font-size: 1.05rem; line-height: 1.6;">
        ${soul.archetype.traits}
      </p>

      <div class="shaadi-grid">
        <div class="shaadi-pill">
          <div class="metric-label">Marriage Window</div>
          <div class="shaadi-val-highlight">${soul.favorableAge}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Peak Alignment: ${soul.yearWindow}</div>
        </div>

        <div class="shaadi-pill">
          <div class="metric-label">Connection Dynamic</div>
          <div class="shaadi-val-highlight" style="font-size: 1.1rem; color: #60a5fa;">${soul.marriageType}</div>
          <div class="love-bar-container">
            <div class="love-bar-fill" style="width: ${soul.lovePercentage}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
            <span>Love: ${soul.lovePercentage}%</span>
            <span>Arranged: ${soul.arrangedPercentage}%</span>
          </div>
        </div>

        <div class="shaadi-pill">
          <div class="metric-label">Spouse's Name Vibration</div>
          <div class="shaadi-val-highlight" style="letter-spacing: 0.15em; color: #a78bfa;">
            ${soul.probableLetters.join(", ")}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Primary Syllable Initials</div>
        </div>

        <div class="shaadi-pill">
          <div class="metric-label">Meeting Direction</div>
          <div class="shaadi-val-highlight" style="font-size: 1.15rem; color: #34d399;">${soul.meetingDirection}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">From your birth sanctuary</div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
        <button id="btnDownloadSoulmateCard" class="btn-share-story" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);">
          📸 Download Soulmate Story Card (PNG)
        </button>
        <button id="btnShareShaadiWhatsApp" class="btn-celestial" style="background: linear-gradient(135deg, #25D366, #128C7E); color: #fff;">
          📲 Share on WhatsApp Status
        </button>
      </div>
    </div>
  `;

  elements.shaadiResultsContainer.style.display = "block";

  // Download Soulmate Story Card Handler
  document.getElementById("btnDownloadSoulmateCard")?.addEventListener("click", () => {
    CosmicCardGenerator.downloadSoulmateCard(state.activeChart, soul);
  });

  // Share to WhatsApp Handler
  document.getElementById("btnShareShaadiWhatsApp")?.addEventListener("click", () => {
    const text = encodeURIComponent(
      `💍 Jyoti AI just revealed my Vedic Soulmate Archetype:\n\n✨ Partner: "${soul.archetype.title}"\n🎯 Marriage Window: ${soul.favorableAge} (${soul.yearWindow})\n🔮 Name Starting With: ${soul.probableLetters.join(", ")}\n❤️ Type: ${soul.marriageType}\n\nCheck yours 100% free with zero subscriptions: http://localhost:8080`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  });
}

// Persona Switcher (Gentle Guru vs Cosmic Roast)
function togglePersonaMode() {
  const current = aiService.personaMode;
  const next = current === "gentle" ? "roast" : "gentle";
  aiService.setPersonaMode(next);

  updatePersonaUI(next);

  // Send a quick announcement message in chat
  if (state.activeChart) {
    if (next === "roast") {
      appendMessage("bot", `🔥 **Cosmic Roast Mode Activated!** No sugarcoating, no excuses. Ask me about your career, toxic love patterns, or finances if you're brave enough.`);
    } else {
      appendMessage("bot", `🕊️ **Gentle Guru Mode Activated.** Namaste. I am here with compassionate, grounding Vedic wisdom and practical remedies.`);
    }
  }
}

function updatePersonaUI(mode) {
  if (mode === "roast") {
    elements.personaIcon.innerText = "🔥";
    elements.personaLabel.innerText = "Cosmic Roast";
    elements.personaToggleBtn.classList.add("roast-active");
    elements.activePersonaBadge.innerText = "Roast Mode 🔥";
    elements.activePersonaBadge.style.background = "rgba(244, 63, 94, 0.2)";
    elements.activePersonaBadge.style.color = "#fda4af";
    elements.activePersonaBadge.style.borderColor = "rgba(244, 63, 94, 0.4)";
    elements.btnRoastToggle.innerText = "🕊️ Calm Mode";
  } else {
    elements.personaIcon.innerText = "🕊️";
    elements.personaLabel.innerText = "Gentle Guru";
    elements.personaToggleBtn.classList.remove("roast-active");
    elements.activePersonaBadge.innerText = "Guru Mode";
    elements.activePersonaBadge.style.background = "rgba(244, 196, 83, 0.15)";
    elements.activePersonaBadge.style.color = "var(--accent-gold)";
    elements.activePersonaBadge.style.borderColor = "var(--border-glow)";
    elements.btnRoastToggle.innerText = "🔥 Roast Me";
  }
}

// Language Switcher (English <-> Hindi)
function toggleLanguage() {
  state.currentLang = state.currentLang === "en" ? "hi" : "en";
  elements.langToggleBtn.innerHTML = state.currentLang === "en" ? "🌐 हिन्दी" : "🌐 English";
  const t = TRANSLATIONS[state.currentLang];
  document.getElementById("brandTag").innerText = t.brandTag;
  document.getElementById("navTabPersonal").innerText = t.navPersonal;
  document.getElementById("navTabMatching").innerText = t.navMatching;
  document.getElementById("navTabPanchang").innerText = t.navPanchang;
  elements.chatInput.placeholder = t.placeholderAsk;
}

// City Search Autocomplete with Offline Ranking & Global Atlas Fallback
let citySearchDebounceTimer = null;

function handleCityInput(e) {
  const query = e.target.value.trim();
  if (query.length < 1) {
    elements.cityDropdown.classList.remove("active");
    return;
  }

  const matches = searchCities(query);

  if (matches.length > 0) {
    elements.cityDropdown.innerHTML = matches.map(c => `
      <div class="autocomplete-item" data-lat="${c.lat}" data-lon="${c.lon}" data-tz="${c.tz}" data-name="${c.name}, ${c.state ? c.state + ", " : ""}${c.country}">
        <strong>${c.name}</strong> <span style="color: #94a3b8; font-size: 0.8rem;">(${c.state ? c.state + ", " : ""}${c.country})</span>
      </div>
    `).join("");

    elements.cityDropdown.classList.add("active");
    bindCityItemClicks();
  }

  // If query is at least 3 chars and matches are few, fetch from global OpenStreetMap atlas
  if (query.length >= 3) {
    clearTimeout(citySearchDebounceTimer);
    citySearchDebounceTimer = setTimeout(() => {
      fetchGlobalCityFallback(query, matches);
    }, 450);
  } else if (matches.length === 0) {
    elements.cityDropdown.classList.remove("active");
  }
}

function bindCityItemClicks() {
  elements.cityDropdown.querySelectorAll(".autocomplete-item").forEach(item => {
    item.addEventListener("click", () => {
      elements.cityInput.value = item.dataset.name;
      elements.latInput.value = item.dataset.lat;
      elements.lonInput.value = item.dataset.lon;
      elements.tzInput.value = item.dataset.tz;
      elements.cityDropdown.classList.remove("active");
    });
  });
}

async function fetchGlobalCityFallback(query, existingMatches) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;

    const existingNames = new Set(existingMatches.map(m => m.name.toLowerCase()));
    const remoteItems = data
      .filter(d => {
        const place = (d.address?.city || d.address?.town || d.address?.village || d.name || "").toLowerCase();
        return !existingNames.has(place);
      })
      .slice(0, 4)
      .map(d => {
        const placeName = d.address?.city || d.address?.town || d.address?.village || d.name || query;
        const stateName = d.address?.state || "";
        const countryName = d.address?.country || "";
        const lat = parseFloat(d.lat);
        const lon = parseFloat(d.lon);
        const isIndia = countryName.toLowerCase().includes("india") || d.display_name.toLowerCase().includes("india");
        const tz = isIndia ? 5.5 : Math.round((lon / 15) * 2) / 2;
        return {
          name: placeName,
          fullName: `${placeName}${stateName ? ", " + stateName : ""}, ${countryName}`,
          lat,
          lon,
          tz
        };
      });

    if (remoteItems.length === 0) return;

    const remoteHtml = remoteItems.map(c => `
      <div class="autocomplete-item" data-lat="${c.lat}" data-lon="${c.lon}" data-tz="${c.tz}" data-name="${c.fullName}">
        🌐 <strong>${c.name}</strong> <span style="color: #94a3b8; font-size: 0.8rem;">(${c.fullName})</span>
      </div>
    `).join("");

    if (existingMatches.length > 0) {
      elements.cityDropdown.innerHTML += `
        <div style="padding: 0.35rem 0.75rem; font-size: 0.7rem; color: var(--accent-gold); border-top: 1px solid rgba(255,255,255,0.08); text-transform: uppercase; letter-spacing: 0.05em;">Global Atlas</div>
        ${remoteHtml}
      `;
    } else {
      elements.cityDropdown.innerHTML = remoteHtml;
      elements.cityDropdown.classList.add("active");
    }

    bindCityItemClicks();
  } catch (err) {
    // Graceful offline fallback
  }
}

// Display Chart, Badges and Initial AI greeting
function displayDashboard(chart) {
  elements.onboardingSection.style.display = "none";
  elements.dashboardSection.style.display = "block";

  // Badges
  elements.metricsBadges.innerHTML = `
    <div class="metric-pill">
      <div class="metric-label">Lagna (Ascendant)</div>
      <div class="metric-val">${chart.lagna.english} (${chart.lagna.sign})</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Moon Sign (Rashi)</div>
      <div class="metric-val">${chart.moonSign.english} (${chart.moonSign.sign})</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Nakshatra</div>
      <div class="metric-val">${chart.nakshatra.name} (P${chart.nakshatra.pada})</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Current Dasha</div>
      <div class="metric-val">${chart.dasha.current.mahadasha}-${chart.dasha.current.antardasha}</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Manglik Status</div>
      <div class="metric-val">${chart.doshas.manglik.intensity}</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Sade Sati</div>
      <div class="metric-val">${chart.doshas.sadeSati.active ? chart.doshas.sadeSati.phase : "None"}</div>
    </div>
  `;

  renderChartSvg();
  renderAuraMeter(chart);

  elements.chatMessages.innerHTML = "";
  state.chatHistory = [];

  const t = TRANSLATIONS[state.currentLang];
  const initialBotMsg = t.welcomeMsg(
    chart.user.name,
    chart.lagna.english,
    chart.nakshatra.name,
    chart.dasha.current.mahadasha,
    chart.dasha.current.antardasha
  );

  appendMessage("bot", initialBotMsg);
  state.lastBotMessage = initialBotMsg;
  speakWithJyoti(initialBotMsg);
}

// Chart Style & Varga Toggles
function setChartStyle(style) {
  state.activeChartStyle = style;
  elements.tabNorth.classList.toggle("active", style === "north");
  elements.tabSouth.classList.toggle("active", style === "south");
  renderChartSvg();
}

function setVargaChart(varga) {
  state.activeVarga = varga;
  elements.tabD1.classList.toggle("active", varga === "D1");
  elements.tabD9.classList.toggle("active", varga === "D9");
  renderChartSvg();
}

function renderChartSvg() {
  if (!state.activeChart) return;
  if (state.activeChartStyle === "north") {
    elements.chartContainer.innerHTML = KundliChartRenderer.renderNorthIndian(state.activeChart, state.activeVarga);
  } else {
    elements.chartContainer.innerHTML = KundliChartRenderer.renderSouthIndian(state.activeChart, state.activeVarga);
  }
  attachHouseClickListeners();
}

// Matchmaking Handler (Ashta Koota 36 Gunas)
function handleMatchingSubmit(e) {
  e.preventDefault();

  const boyName = document.getElementById("boyName").value.trim() || "Boy";
  const boyDob = document.getElementById("boyDob").value;
  const boyTob = document.getElementById("boyTob").value;

  const girlName = document.getElementById("girlName").value.trim() || "Girl";
  const girlDob = document.getElementById("girlDob").value;
  const girlTob = document.getElementById("girlTob").value;

  const boyChart = generateKundli({ name: boyName, gender: "Male", dob: boyDob, tob: boyTob, lat: 28.6139, lon: 77.2090, timezone: 5.5 });
  const girlChart = generateKundli({ name: girlName, gender: "Female", dob: girlDob, tob: girlTob, lat: 28.6139, lon: 77.2090, timezone: 5.5 });

  const result = calculateAshtaKoota(boyChart, girlChart);
  const statusColor = result.totalScore >= 28 ? "#4ade80" : result.totalScore >= 18 ? "#facc15" : "#f87171";

  const rowsHtml = result.breakdown.map(k => `
    <tr>
      <td><strong>${k.name}</strong></td>
      <td style="color: ${k.score === k.max ? '#4ade80' : '#ffdf7e'}; font-weight: bold;">${k.score} / ${k.max}</td>
      <td style="color: var(--text-secondary);">${k.desc}</td>
    </tr>
  `).join("");

  elements.matchResultBox.innerHTML = `
    <div style="background: rgba(15, 17, 36, 0.85); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center;">
      <h3 style="color: var(--accent-gold); font-size: 1.35rem; margin-bottom: 0.5rem;">
        Matchmaking Compatibility Score
      </h3>
      <div style="font-size: 3.25rem; font-weight: 800; color: ${statusColor}; margin: 0.5rem 0;">
        ${result.totalScore} <span style="font-size: 1.5rem; color: var(--text-muted);">/ 36 Gunas</span>
      </div>
      <div style="font-size: 1.15rem; font-weight: 700; color: ${statusColor}; margin-bottom: 1rem;">
        ${result.statusText}
      </div>

      <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <div><strong>${boyName}:</strong> ${boyChart.moonSign.english} Rashi (${boyChart.nakshatra.name})</div>
        <div><strong>${girlName}:</strong> ${girlChart.moonSign.english} Rashi (${girlChart.nakshatra.name})</div>
      </div>

      <table class="milan-table">
        <thead>
          <tr>
            <th>Koota Factor</th>
            <th>Obtained Score</th>
            <th>Significance</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;

  elements.matchResultBox.style.display = "block";
  elements.matchResultBox.scrollIntoView({ behavior: "smooth" });
}

// Daily Panchang Renderer
function renderPanchang() {
  const panchang = calculateDailyPanchang();
  elements.panchangDateDisplay.innerText = panchang.date;

  elements.panchangGrid.innerHTML = `
    <div class="metric-pill">
      <div class="metric-label">Tithi</div>
      <div class="metric-val">${panchang.tithi}</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Vaar (Day)</div>
      <div class="metric-val">${panchang.vaar}</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Nakshatra</div>
      <div class="metric-val">${panchang.nakshatra}</div>
    </div>
    <div class="metric-pill">
      <div class="metric-label">Yoga</div>
      <div class="metric-val">${panchang.yoga}</div>
    </div>
    <div class="metric-pill" style="border-color: rgba(239, 68, 68, 0.4);">
      <div class="metric-label" style="color: #f87171;">⚠️ Rahu Kaal (Inauspicious)</div>
      <div class="metric-val" style="color: #fca5a5;">${panchang.rahuKaal}</div>
    </div>
    <div class="metric-pill" style="border-color: rgba(74, 222, 128, 0.4);">
      <div class="metric-label" style="color: #4ade80;">✨ Abhijit Muhurat (Auspicious)</div>
      <div class="metric-val" style="color: #86efac;">${panchang.abhijit}</div>
    </div>
  `;
}

// Chat Flow
async function handleSendMessage() {
  const query = elements.chatInput.value.trim();
  if (!query || state.isGenerating || !state.activeChart) return;

  elements.chatInput.value = "";
  appendMessage("user", query);
  state.chatHistory.push({ sender: "user", text: query });

  state.isGenerating = true;
  elements.sendBtn.disabled = true;
  const typingBubble = appendTypingIndicator();

  try {
    const responseText = await aiService.askQuestion(query, state.activeChart, state.chatHistory);
    typingBubble.remove();
    appendMessage("bot", responseText);
    state.chatHistory.push({ sender: "bot", text: responseText });
    state.lastBotMessage = responseText;
    speakWithJyoti(responseText);
  } catch (err) {
    typingBubble.remove();
    appendMessage("bot", `I apologize, there was an issue: ${err.message}.`);
  } finally {
    state.isGenerating = false;
    elements.sendBtn.disabled = false;
    elements.chatInput.focus();
  }
}

function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `message-bubble message-${sender}`;
  bubble.innerHTML = formatMarkdown(text);
  elements.chatMessages.appendChild(bubble);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return bubble;
}

function appendTypingIndicator() {
  const bubble = document.createElement("div");
  bubble.className = "message-bubble message-bot typing-dots";
  bubble.innerHTML = "<span>•</span> <span>•</span> <span>•</span>";
  elements.chatMessages.appendChild(bubble);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return bubble;
}

function formatMarkdown(text) {
  let html = text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/• (.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
  return html;
}

// Settings
function openSettings() {
  const creds = aiService.getCredentials();
  elements.providerSelect.value = creds.provider;
  elements.geminiKeyInput.value = aiService.geminiApiKey;
  elements.groqKeyInput.value = aiService.groqApiKey;
  elements.settingsModal.classList.add("active");
}

function closeSettings() {
  elements.settingsModal.classList.remove("active");
}

function saveSettings() {
  aiService.setCredentials({
    provider: elements.providerSelect.value,
    geminiKey: elements.geminiKeyInput.value,
    groqKey: elements.groqKeyInput.value
  });
  closeSettings();
  alert("Settings saved successfully!");
}

function loadSavedSettings() {
  const creds = aiService.getCredentials();
  elements.providerSelect.value = creds.provider;
  updatePersonaUI(aiService.personaMode);
}

function loadSavedChart() {
  const saved = localStorage.getItem("jyoti_active_chart");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.activeChart = parsed;
      displayDashboard(parsed);
    } catch (e) {
      console.warn("Could not parse saved chart:", e);
    }
  }
}
