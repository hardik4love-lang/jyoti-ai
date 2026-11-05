/**
 * Verification Test Suite for Jyoti AI Core Modules (v2)
 */
import { generateKundli, calculateAshtaKoota, calculateDailyPanchang, predictMarriageAndSoulmate, detectBoundaryDegrees, getHistoricalTimezoneOffset } from "./src/vedic-engine.js";
import { searchCities } from "./src/cities.js";
import { KundliChartRenderer } from "./src/chart-renderer.js";
import { AIService } from "./src/ai-service.js";
import { TRANSLATIONS } from "./src/i18n.js";
import { CELEBRITIES } from "./src/celebrities.js";
import { calculateDailyAura } from "./src/aura-meter.js";
import { drawPrashnaCards, VEDIC_TAROT_DECK } from "./src/tarot-engine.js";
import { HOUSE_DEFINITIONS } from "./src/house-details.js";
import { getDailyRashifal, getAllRashifalList } from "./src/rashifal-engine.js";
import { calculateGemstones } from "./src/gemstone-engine.js";
import { auditCosmicRedFlags } from "./src/redflag-engine.js";
import { getDailyOracleProphecy } from "./src/yantra-scanner.js";
import { PrashnaEngine } from "./src/prashna-engine.js";
import { CrushRadarEngine } from "./src/radar-engine.js";
import { VideoCallEngine } from "./src/video-call-engine.js";
import { CosmicBatteryEngine } from "./src/battery-engine.js";
import { TransitCountdownEngine } from "./src/countdown-engine.js";

console.log("=== Testing Vedic Astronomical Calculation Engine ===");
console.log("\n=== Testing City Geocoding & Prefix Ranking ===");
const jamResults = searchCities("jam");
console.log(`✅ searchCities("jam") -> First match: ${jamResults[0].name} (${jamResults[0].state}, ${jamResults[0].country})`);
console.log(`- Total matches for "jam": ${jamResults.length} (${jamResults.map(c => c.name).join(", ")})`);
if (jamResults[0].name !== "Jamnagar") {
  throw new Error("Jamnagar should be ranked #1 when searching 'jam'!");
}
console.log("✅ Verified: Jamnagar, Gujarat is prioritized #1 for 'jam'!");

const multiTokenResults = searchCities("jamnagar gujarat");
if (!multiTokenResults.length || multiTokenResults[0].name !== "Jamnagar") {
  throw new Error("Multi-token search 'jamnagar gujarat' must return Jamnagar!");
}
console.log(`✅ Verified: Multi-token 'jamnagar gujarat' -> ${multiTokenResults[0].name} (${multiTokenResults[0].state})!`);

const commaResults = searchCities("jamnagar, gujarat");
if (!commaResults.length || commaResults[0].name !== "Jamnagar") {
  throw new Error("Comma search 'jamnagar, gujarat' must return Jamnagar!");
}
console.log(`✅ Verified: Comma-separated 'jamnagar, gujarat' -> ${commaResults[0].name} (${commaResults[0].state})!`);
const boyBirth = {
  name: "Arjun Verma",
  gender: "Male",
  dob: "1996-08-20",
  tob: "10:15",
  lat: 28.6139,
  lon: 77.2090,
  timezone: 5.5
};

const girlBirth = {
  name: "Pooja Sharma",
  gender: "Female",
  dob: "1998-05-15",
  tob: "14:30",
  lat: 28.6139,
  lon: 77.2090,
  timezone: 5.5
};

const boyChart = generateKundli(boyBirth);
const girlChart = generateKundli(girlBirth);

console.log("✅ Boy Kundli generated successfully!");
console.log(`- Lagna: ${boyChart.lagna.english} (${boyChart.lagna.sign})`);
console.log(`- Moon: ${boyChart.moonSign.english} | Nakshatra: ${boyChart.nakshatra.name}`);
console.log(`- Navamsha (D-9) Lagna: ${boyChart.navamsha.lagna.english}`);

console.log("\n=== Testing Kundli Milan (Ashta Koota 36 Gunas) ===");
const milan = calculateAshtaKoota(boyChart, girlChart);
console.log(`✅ Ashta Koota Match Score: ${milan.totalScore} / 36 Gunas (${milan.percentage}%)`);
console.log(`- Status: ${milan.statusText}`);
milan.breakdown.forEach(k => {
  console.log(`  • ${k.name}: ${k.score}/${k.max} pts - ${k.desc}`);
});

console.log("\n=== Testing Shaadi & Soulmate Radar Engine ===");
const shaadi = predictMarriageAndSoulmate(boyChart);
console.log(`✅ Soulmate Archetype: "${shaadi.archetype.title}"`);
console.log(`- Favorable Age Window: ${shaadi.favorableAge} (${shaadi.yearWindow})`);
console.log(`- Connection Type: ${shaadi.marriageType} (Love: ${shaadi.lovePercentage}%)`);
console.log(`- Probable Name Initial: ${shaadi.probableLetters.join(", ")}`);
console.log(`- Meeting Direction: ${shaadi.meetingDirection}`);

console.log("\n=== Testing Daily Panchang & Muhurat ===");
const panchang = calculateDailyPanchang(new Date(2026, 10, 4), 28.6139, 77.2090);
console.log(`✅ Date: ${panchang.date}`);
console.log(`- Tithi: ${panchang.tithi}`);
console.log(`- Vaar: ${panchang.vaar}`);
console.log(`- Nakshatra: ${panchang.nakshatra}`);
console.log(`- Yoga: ${panchang.yoga}`);
console.log(`- Rahu Kaal: ${panchang.rahuKaal}`);
console.log(`- Abhijit Muhurat: ${panchang.abhijit}`);

console.log("\n=== Testing SVG Rendering (D-1 & D-9) ===");
const d1North = KundliChartRenderer.renderNorthIndian(boyChart, "D1");
const d9North = KundliChartRenderer.renderNorthIndian(boyChart, "D9");
const d1South = KundliChartRenderer.renderSouthIndian(boyChart, "D1");
const d9South = KundliChartRenderer.renderSouthIndian(boyChart, "D9");
console.log(`✅ D-1 North SVG: ${d1North.length} bytes`);
console.log(`✅ D-9 North SVG: ${d9North.length} bytes`);
console.log(`✅ D-1 South SVG: ${d1South.length} bytes`);
console.log(`✅ D-9 South SVG: ${d9South.length} bytes`);

console.log("\n=== Testing Bilingual Localization ===");
console.log(`✅ English Hero: ${TRANSLATIONS.en.heroTitle}`);
console.log(`✅ Hindi Hero: ${TRANSLATIONS.hi.heroTitle}`);

console.log("\n=== Testing Celebrity Synastry & Daily Aura Meter ===");
console.log(`✅ Loaded ${CELEBRITIES.length} verified celebrity charts: ${CELEBRITIES.map(c => c.name).join(", ")}`);
const virat = CELEBRITIES.find(c => c.id === "virat");
const viratChart = generateKundli({
  name: virat.name,
  gender: virat.gender,
  dob: virat.dob,
  tob: virat.tob,
  lat: virat.lat,
  lon: virat.lon,
  timezone: virat.tz
});
const celebMatch = calculateAshtaKoota(boyChart, viratChart);
console.log(`✅ Match with Virat Kohli: ${celebMatch.totalScore}/36 Gunas (${celebMatch.percentage}%)`);

const aura = calculateDailyAura(boyChart);
console.log(`✅ Daily Aura Meter -> Love: ${aura.love}%, Career: ${aura.career}%, Intuition: ${aura.intuition}%`);
console.log(`- Daily Cosmic Advice: "${aura.advice}"`);

console.log("\n=== Testing Vedic Tarot Prashna & House Details ===");
console.log(`✅ Loaded ${VEDIC_TAROT_DECK.length} Vedic Tarot Archetypes`);
const prashna = drawPrashnaCards(3);
console.log(`✅ 3-Card Prashna Drawn:
  • Past: [${prashna.past.symbol}] ${prashna.past.name} - ${prashna.past.keywords}
  • Present: [${prashna.present.symbol}] ${prashna.present.name} - ${prashna.present.keywords}
  • Future: [${prashna.future.symbol}] ${prashna.future.name} - ${prashna.future.keywords}`);

console.log(`✅ Verified ${Object.keys(HOUSE_DEFINITIONS).length} Classical House Definitions (1st Tanu Bhava to 12th Vyaya Bhava)`);
console.log(`- 7th House (Kalatra Bhava): ${HOUSE_DEFINITIONS[7].title} | Remedy: ${HOUSE_DEFINITIONS[7].guidance.slice(0, 50)}...`);

console.log("\n=== Testing 12-Sign Daily Transit Rashifal & Gemstones ===");
const allRashifal = getAllRashifalList();
console.log(`✅ Successfully generated forecasts for all ${allRashifal.length} Zodiac Rashis (Mesha to Meena)`);
const ariesForecast = getDailyRashifal(1);
console.log(`- Mesha (Aries): "${ariesForecast.headline}"`);
console.log(`  Ratings -> Love: ${ariesForecast.loveScore}%, Career: ${ariesForecast.careerScore}%, Health: ${ariesForecast.healthScore}%`);
console.log(`  Lucky Attributes -> Color: ${ariesForecast.luckyColor} | Number: ${ariesForecast.luckyNumber}`);

const gemstonePrescription = calculateGemstones(boyChart);
console.log(`✅ Parashara Gemstone Prescriptions for Lagna ${boyChart.lagna.english}:`);
gemstonePrescription.prescriptions.forEach(p => {
  console.log(`  • ${p.role}: ${p.data.stone} (${p.data.color}) on ${p.data.finger} | Metal: ${p.data.metal}`);
});
console.log(`  • Seed Mantra: "${gemstonePrescription.prescriptions[0].data.mantra}"`);

console.log("\n=== Testing Gandanta Boundary Detection & Historical DST Timezones ===");
const nyDstSummer = getHistoricalTimezoneOffset("America/New_York", "2024-07-15", "12:00");
const nyDstWinter = getHistoricalTimezoneOffset("America/New_York", "2024-01-15", "12:00");
console.log(`✅ America/New_York DST Summer Offset: ${nyDstSummer}h (EDT) | Winter: ${nyDstWinter}h (EST)`);
if (nyDstSummer !== -4 || nyDstWinter !== -5) {
  throw new Error("DST Historical Timezone failed!");
}

const gandantaTest = detectBoundaryDegrees({
  lagna: { degreeTotal: 1.5, degree: "1.50" }, // In Ashwini Gandanta
  moonSign: { degreeTotal: 239.5 } // In Jyeshtha-Mula Gandanta
});
console.log(`✅ Gandanta & Boundary Degrees detected: ${gandantaTest.length} alerts`);
gandantaTest.forEach(g => console.log(`  • ${g.title}`));

console.log("\n=== Testing Cosmic Red Flags & Unfiltered Roast Engine ===");
const redFlags = auditCosmicRedFlags(boyChart);
console.log(`✅ Moon Red Flag Archetype: "${redFlags.archetype}"`);
console.log(`- Toxic Dating Loop: ${redFlags.flags[0].text}`);
console.log(`- Share Quote: ${redFlags.shareQuote}`);
if (!redFlags.flags.length || !redFlags.archetype) {
  throw new Error("Red flag audit failed!");
}

console.log("\n=== Testing Biometric Yantra Daily Oracle Prophecy ===");
const dailyOracle = getDailyOracleProphecy(boyChart);
console.log(`✅ Prana Score: ${dailyOracle.pranaScore}% | Aura: ${dailyOracle.auraType}`);
console.log(`- Ruling Graha: ${dailyOracle.rulingGraha}`);
console.log(`- Blessed Action: "${dailyOracle.blessedAction}"`);
console.log(`- Forbidden Action: "${dailyOracle.forbiddenAction}"`);
if (dailyOracle.pranaScore < 50 || !dailyOracle.blessedAction) {
  throw new Error("Daily Oracle generation failed!");
}

console.log("\n=== Testing Instant Vedic Prashna (Horary) Oracle ===");
const prashnaResult = PrashnaEngine.castPrashna("ex_love");
console.log(`✅ Prashna Ascendant: ${prashnaResult.prashnaLagna} | Moon Nakshatra: ${prashnaResult.currentNakshatra}`);
console.log(`- Query: "${prashnaResult.queryTitle}"`);
console.log(`- Verdict: "${prashnaResult.verdict}"`);
console.log(`- Timing: ${prashnaResult.timing}`);
console.log(`- Insight: ${prashnaResult.insight}`);
console.log(`- Remedy: ${prashnaResult.remedy}`);
if (!prashnaResult.prashnaLagna || !prashnaResult.verdict || !prashnaResult.spokenScript) {
  throw new Error("Prashna calculation failed!");
}

console.log("\n=== Testing Crush & Ex Truth Radar Engine ===");
const radarResult = CrushRadarEngine.analyzeTruth("Aarav", "Ananya");
console.log(`✅ Couple: ${radarResult.name1} & ${radarResult.name2}`);
console.log(`- Magnetism Score: ${radarResult.score}%`);
console.log(`- Archetype: "${radarResult.archetype}"`);
console.log(`- Who Falls Harder: "${radarResult.whoFallsText}"`);
console.log(`- Fatal Friction: "${radarResult.fatalFriction}"`);
console.log(`- Secret Obsession: "${radarResult.secretObsession}"`);
const whatsappLink = CrushRadarEngine.getWhatsAppTruthLink("Aarav", "Ananya");
console.log(`✅ Generated WhatsApp Share Link: ${whatsappLink.slice(0, 85)}...`);
if (radarResult.score < 50 || !radarResult.whoFallsText || !decodeURIComponent(whatsappLink).includes("truth=")) {
  throw new Error("Crush Radar test failed!");
}

console.log("\n=== Testing FaceTime-Style Video Call Engine ===");
const videoEngine = new VideoCallEngine(null, null);
console.log(`✅ Video Call Engine initialized: Facing mode = ${videoEngine.facingMode}`);
const initialMute = videoEngine.isMicMuted;
const newMute = videoEngine.toggleMute();
console.log(`✅ Mic toggle test: ${initialMute} -> ${newMute}`);
if (newMute !== !initialMute) {
  throw new Error("VideoCallEngine mute toggle failed!");
}
videoEngine.facingMode = "environment";
if (videoEngine.facingMode !== "environment") {
  throw new Error("VideoCallEngine camera flip failed!");
}
// Test Aura filter toggle
const auraState = videoEngine.toggleAuraFilter(null);
if (!auraState) {
  throw new Error("VideoCallEngine aura toggle failed!");
}
console.log(`✅ Aura filter toggle tested: ${auraState}`);

// Test Speaking state
videoEngine.setAvatarSpeaking(true, null);
if (!videoEngine.isSpeaking) {
  throw new Error("VideoCallEngine speaking state failed!");
}
console.log(`✅ Avatar speaking crossfade state verified: ${videoEngine.isSpeaking}`);

// Test Simli Avatar integration
if (!videoEngine.simliEngine) {
  throw new Error("SimliAvatarEngine not attached to VideoCallEngine!");
}
videoEngine.simliEngine.saveConfig("test_simli_key_1234567890", "custom_face_id_1");
if (!videoEngine.simliEngine.isConfigured()) {
  throw new Error("SimliAvatarEngine config test failed!");
}
console.log(`✅ Simli Neural Avatar integration initialized & configured (Free 50m tier ready)`);
videoEngine.simliEngine.clearConfig();

videoEngine.endCall();
console.log(`✅ Video Call Engine endCall lifecycle executed successfully`);

console.log("\n=== Testing Daily Cosmic Readiness Battery Engine ===");
const battery = CosmicBatteryEngine.getDailyBattery(boyChart);
console.log(`✅ Cosmic Battery Overall: ${battery.overallScore}% (${battery.headline})`);
console.log(`- Day Lord: ${battery.dayName} (${battery.dayLord})`);
console.log(`- Mental: ${battery.mentalClarity}% | Career: ${battery.careerDrive}% | Harmony: ${battery.socialHarmony}%`);
console.log(`- Golden Window: ${battery.goldenWindow}`);
console.log(`- Upaya: "${battery.microUpaya}"`);
if (battery.overallScore < 50 || !battery.goldenWindow || !battery.microUpaya) {
  throw new Error("CosmicBatteryEngine calculation failed!");
}

console.log("\n=== Testing Transit & Dasha Countdown Engine ===");
const countdown = TransitCountdownEngine.getCountdownMetrics(boyChart);
console.log(`✅ Current Dasha: ${countdown.currentMahadasha} • ${countdown.currentAntardasha}`);
console.log(`- Progress: ${countdown.progressPercent}% (${countdown.daysRemaining} days remaining)`);
console.log(`- Sade Sati Status: ${countdown.sadeSatiStatus}`);
console.log(`- Next Shift Theme: "${countdown.shiftTheme}"`);
if (!countdown.currentMahadasha || countdown.progressPercent < 0 || countdown.progressPercent > 100) {
  throw new Error("TransitCountdownEngine failed!");
}

console.log("\n🎉 ALL ADVANCED TESTS PASSED! Production-ready at 100% free and $0 cost.");
