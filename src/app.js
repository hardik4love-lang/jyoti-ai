/**
 * Jyoti AI - Main Application Controller
 * Handles Form Interaction, City Autocomplete, Chart Rendering,
 * Ashta Koota Matchmaking, Daily Panchang, Bilingual I18n,
 * Real-time Conversational Flow, and Settings Management.
 */

import { generateKundli, calculateAshtaKoota, calculateDailyPanchang } from "./vedic-engine.js";
import { searchCities, CITIES } from "./cities.js";
import { KundliChartRenderer } from "./chart-renderer.js";
import { AIService } from "./ai-service.js";
import { AmbientAudioEngine } from "./audio-ambient.js";
import { TRANSLATIONS } from "./i18n.js";

// Global App State
const state = {
  activeChart: null,
  activeChartStyle: "north", // 'north' or 'south'
  activeVarga: "D1",         // 'D1' or 'D9'
  currentLang: "en",         // 'en' or 'hi'
  currentTab: "personal",    // 'personal', 'matching', 'panchang'
  chatHistory: [],
  selectedCity: null,
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

  // Personal Kundli
  formSection: document.getElementById("formSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  kundliForm: document.getElementById("kundliForm"),
  cityInput: document.getElementById("cityInput"),
  cityDropdown: document.getElementById("cityDropdown"),
  latInput: document.getElementById("latInput"),
  lonInput: document.getElementById("lonInput"),
  tzInput: document.getElementById("tzInput"),
  chartContainer: document.getElementById("chartContainer"),
  tabNorth: document.getElementById("tabNorth"),
  tabSouth: document.getElementById("tabSouth"),
  tabD1: document.getElementById("tabD1"),
  tabD9: document.getElementById("tabD9"),
  editChartBtn: document.getElementById("editChartBtn"),
  printReportBtn: document.getElementById("printReportBtn"),
  metricsBadges: document.getElementById("metricsBadges"),

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
  audioToggleBtn: document.getElementById("audioToggleBtn")
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadSavedSettings();
  loadSavedChart();
  renderPanchang();
  registerServiceWorker();
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.warn("SW note:", err);
    });
  }
}

function setupEventListeners() {
  // Navigation Tabs
  elements.navTabPersonal.addEventListener("click", () => switchNavTab("personal"));
  elements.navTabMatching.addEventListener("click", () => switchNavTab("matching"));
  elements.navTabPanchang.addEventListener("click", () => switchNavTab("panchang"));

  // Language Toggle
  elements.langToggleBtn.addEventListener("click", toggleLanguage);

  // City Search Autocomplete
  elements.cityInput.addEventListener("input", handleCityInput);
  document.addEventListener("click", e => {
    if (!elements.cityDropdown.contains(e.target) && e.target !== elements.cityInput) {
      elements.cityDropdown.classList.remove("active");
    }
  });

  // Personal Form Submission
  elements.kundliForm.addEventListener("submit", handleFormSubmit);

  // Edit details
  if (elements.editChartBtn) {
    elements.editChartBtn.addEventListener("click", () => {
      elements.dashboardSection.style.display = "none";
      elements.formSection.style.display = "block";
      elements.formSection.scrollIntoView({ behavior: "smooth" });
    });
  }

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
      ? "🔊 432Hz Calm: ON"
      : "🔇 432Hz Calm: OFF";
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

// Language Switcher (English <-> Hindi)
function toggleLanguage() {
  state.currentLang = state.currentLang === "en" ? "hi" : "en";
  elements.langToggleBtn.innerHTML = state.currentLang === "en" ? "🌐 हिन्दी" : "🌐 English";
  applyTranslations();
}

function applyTranslations() {
  const t = TRANSLATIONS[state.currentLang];
  document.getElementById("brandTag").innerText = t.brandTag;
  document.getElementById("heroTitle").innerText = t.heroTitle;
  document.getElementById("heroDesc").innerText = t.heroDesc;
  document.getElementById("labelFullName").innerText = t.fullName;
  document.getElementById("labelGender").innerText = t.gender;
  document.getElementById("labelDob").innerText = t.dob;
  document.getElementById("labelTob").innerText = t.tob;
  document.getElementById("labelCity").innerText = t.cityLabel;
  document.getElementById("generateBtn").innerText = t.generateBtn;
  document.getElementById("navTabPersonal").innerText = t.navPersonal;
  document.getElementById("navTabMatching").innerText = t.navMatching;
  document.getElementById("navTabPanchang").innerText = t.navPanchang;
  document.getElementById("editChartBtn").innerText = t.editDetails;
  document.getElementById("printReportBtn").innerText = t.printReport;
  document.getElementById("tabNorth").innerText = t.northChart;
  document.getElementById("tabSouth").innerText = t.southChart;
  document.getElementById("tabD1").innerText = t.d1Chart;
  document.getElementById("tabD9").innerText = t.d9Chart;
  elements.chatInput.placeholder = t.placeholderAsk;

  if (state.activeChart && state.chatHistory.length <= 1) {
    displayDashboard(state.activeChart);
  }
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
      <strong>${c.name}</strong><span class="city-state">(${c.state ? c.state + ", " : ""}${c.country})</span>
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

// Form Submission & Kundli Calculation
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("userName").value.trim() || "Seeker";
  const gender = document.getElementById("userGender").value;
  const dob = document.getElementById("userDob").value;
  const tob = document.getElementById("userTob").value;
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

// Display Chart, Badges and Initial AI greeting
function displayDashboard(chart) {
  elements.formSection.style.display = "none";
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
  } else {
    elements.cityInput.value = "New Delhi, Delhi, India";
    elements.latInput.value = "28.6139";
    elements.lonInput.value = "77.2090";
    elements.tzInput.value = "5.5";
  }
}
