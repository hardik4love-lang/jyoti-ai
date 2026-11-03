/**
 * Jyoti AI - Main Application Controller (v3 Viral Edition)
 * Conversational Onboarding • Cosmic Story Card Exporter •
 * Dual Persona (Guru vs Roast) • Interactive Stardust Canvas
 */

import { generateKundli, calculateAshtaKoota, calculateDailyPanchang } from "./vedic-engine.js";
import { searchCities, CITIES } from "./cities.js";
import { KundliChartRenderer } from "./chart-renderer.js";
import { AIService } from "./ai-service.js";
import { AmbientAudioEngine } from "./audio-ambient.js";
import { TRANSLATIONS } from "./i18n.js";
import { CosmicCardGenerator } from "./card-generator.js";

// Global State
const state = {
  activeChart: null,
  activeChartStyle: "north",
  activeVarga: "D1",
  currentLang: "en",
  currentTab: "personal",
  currentStep: 1,
  selectedGender: "Male",
  chatHistory: [],
  isGenerating: false
};

const aiService = new AIService();
const audioEngine = new AmbientAudioEngine();

// DOM Elements
const elements = {
  // Navigation
  navTabPersonal: document.getElementById("navTabPersonal"),
  navTabMatching: document.getElementById("navTabMatching"),
  navTabPanchang: document.getElementById("navTabPanchang"),
  viewPersonal: document.getElementById("viewPersonal"),
  viewMatching: document.getElementById("viewMatching"),
  viewPanchang: document.getElementById("viewPanchang"),
  langToggleBtn: document.getElementById("langToggleBtn"),
  personaToggleBtn: document.getElementById("personaToggleBtn"),
  personaIcon: document.getElementById("personaIcon"),
  personaLabel: document.getElementById("personaLabel"),
  activePersonaBadge: document.getElementById("activePersonaBadge"),
  btnRoastToggle: document.getElementById("btnRoastToggle"),

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
  chipsWrapper: document.getElementById("chipsWrapper"),

  // Matching
  matchingForm: document.getElementById("matchingForm"),
  matchResultBox: document.getElementById("matchResultBox"),

  // Panchang
  panchangDateDisplay: document.getElementById("panchangDateDisplay"),
  panchangGrid: document.getElementById("panchangGrid"),

  // Settings & Audio
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  providerSelect: document.getElementById("providerSelect"),
  geminiKeyInput: document.getElementById("geminiKeyInput"),
  groqKeyInput: document.getElementById("groqKeyInput"),
  audioToggleBtn: document.getElementById("audioToggleBtn"),
  starCanvas: document.getElementById("starCanvas")
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  setupOnboardingFlow();
  setupStardustCanvas();
  loadSavedSettings();
  loadSavedChart();
  renderPanchang();
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
  const lat = parseFloat(elements.latInput.value) || 28.6139;
  const lon = parseFloat(elements.lonInput.value) || 77.2090;
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
  // Navigation Tabs
  elements.navTabPersonal.addEventListener("click", () => switchNavTab("personal"));
  elements.navTabMatching.addEventListener("click", () => switchNavTab("matching"));
  elements.navTabPanchang.addEventListener("click", () => switchNavTab("panchang"));

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

// Navigation Tab Switcher
function switchNavTab(tabName) {
  state.currentTab = tabName;
  elements.navTabPersonal.classList.toggle("active", tabName === "personal");
  elements.navTabMatching.classList.toggle("active", tabName === "matching");
  elements.navTabPanchang.classList.toggle("active", tabName === "panchang");

  elements.viewPersonal.style.display = tabName === "personal" ? "block" : "none";
  elements.viewMatching.style.display = tabName === "matching" ? "block" : "none";
  elements.viewPanchang.style.display = tabName === "panchang" ? "block" : "none";

  if (tabName === "panchang") renderPanchang();
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

// City Search Autocomplete
function handleCityInput(e) {
  const query = e.target.value.trim();
  if (query.length < 1) {
    elements.cityDropdown.classList.remove("active");
    return;
  }

  const matches = searchCities(query);
  if (matches.length === 0) {
    elements.cityDropdown.classList.remove("active");
    return;
  }

  elements.cityDropdown.innerHTML = matches.map(c => `
    <div class="autocomplete-item" data-lat="${c.lat}" data-lon="${c.lon}" data-tz="${c.tz}" data-name="${c.name}, ${c.state || c.country}">
      <strong>${c.name}</strong> <span style="color: #94a3b8; font-size: 0.8rem;">(${c.state ? c.state + ", " : ""}${c.country})</span>
    </div>
  `).join("");

  elements.cityDropdown.classList.add("active");

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
