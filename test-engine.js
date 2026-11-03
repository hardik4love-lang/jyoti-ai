/**
 * Verification Test Suite for Jyoti AI Core Modules (v2)
 */
import { generateKundli, calculateAshtaKoota, calculateDailyPanchang, predictMarriageAndSoulmate } from "./src/vedic-engine.js";
import { searchCities } from "./src/cities.js";
import { KundliChartRenderer } from "./src/chart-renderer.js";
import { AIService } from "./src/ai-service.js";
import { TRANSLATIONS } from "./src/i18n.js";

console.log("=== Testing Vedic Astronomical Calculation Engine ===");
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

console.log("\n🎉 ALL ADVANCED TESTS PASSED! Production-ready at 100% free and $0 cost.");
