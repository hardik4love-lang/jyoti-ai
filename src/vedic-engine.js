/**
 * Jyoti AI - Core Vedic Astronomical & Astrological Engine
 * Deterministic, Client-Side, 100% Free & Zero-Cost
 * Implements Lahiri Ayanamsha, Planetary Longitudes, 12 Bhavas,
 * 27 Nakshatras, Vimshottari Dasha, Manglik & Sade Sati analysis.
 */

// Astronomical constants
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export const RASHIS = [
  { id: 1, name: "Mesha", english: "Aries", element: "Fire", lord: "Mars", symbol: "♈" },
  { id: 2, name: "Vrishabha", english: "Taurus", element: "Earth", lord: "Venus", symbol: "♉" },
  { id: 3, name: "Mithuna", english: "Gemini", element: "Air", lord: "Mercury", symbol: "♊" },
  { id: 4, name: "Karka", english: "Cancer", element: "Water", lord: "Moon", symbol: "♋" },
  { id: 5, name: "Simha", english: "Leo", element: "Fire", lord: "Sun", symbol: "♌" },
  { id: 6, name: "Kanya", english: "Virgo", element: "Earth", lord: "Mercury", symbol: "♍" },
  { id: 7, name: "Tula", english: "Libra", element: "Air", lord: "Venus", symbol: "♎" },
  { id: 8, name: "Vrishchika", english: "Scorpio", element: "Water", lord: "Mars", symbol: "♏" },
  { id: 9, name: "Dhanu", english: "Sagittarius", element: "Fire", lord: "Jupiter", symbol: "♐" },
  { id: 10, name: "Makara", english: "Capricorn", element: "Earth", lord: "Saturn", symbol: "♑" },
  { id: 11, name: "Kumbha", english: "Aquarius", element: "Air", lord: "Saturn", symbol: "♒" },
  { id: 12, name: "Meena", english: "Pisces", element: "Water", lord: "Jupiter", symbol: "♓" }
];

export const NAKSHATRAS = [
  { id: 1, name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { id: 2, name: "Bharani", lord: "Venus", deity: "Yama" },
  { id: 3, name: "Krittika", lord: "Sun", deity: "Agni" },
  { id: 4, name: "Rohini", lord: "Moon", deity: "Brahma" },
  { id: 5, name: "Mrigashira", lord: "Mars", deity: "Soma" },
  { id: 6, name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { id: 7, name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { id: 8, name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { id: 9, name: "Ashlesha", lord: "Mercury", deity: "Sarpas" },
  { id: 10, name: "Magha", lord: "Ketu", deity: "Pitris" },
  { id: 11, name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { id: 12, name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { id: 13, name: "Hasta", lord: "Moon", deity: "Savitr" },
  { id: 14, name: "Chitra", lord: "Mars", deity: "Tvashtr" },
  { id: 15, name: "Swati", lord: "Rahu", deity: "Vayu" },
  { id: 16, name: "Vishakha", lord: "Jupiter", deity: "Indragni" },
  { id: 17, name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { id: 18, name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { id: 19, name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { id: 20, name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { id: 21, name: "Uttara Ashadha", lord: "Sun", deity: "Vishwadevas" },
  { id: 22, name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { id: 23, name: "Dhanishta", lord: "Mars", deity: "Vasus" },
  { id: 24, name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { id: 25, name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { id: 26, name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahirbudhnya" },
  { id: 27, name: "Revati", lord: "Mercury", deity: "Pushan" }
];

export const DASHA_ORDER = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

// Helper: Normalize degrees to 0-360 range
export function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Convert Date & Time to Julian Day Number (Universal Time)
export function getJulianDay(date, timeString, timezoneOffsetHours) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Decimal UTC hour
  const decimalUTCHour = hours + minutes / 60 - timezoneOffsetHours;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + (decimalUTCHour / 24) + b - 1524.5;
  return jd;
}

// Compute Lahiri Ayanamsha for a given Julian Day
export function getLahiriAyanamsha(jd) {
  // Epoch J2000.0 = 2451545.0
  const T = (jd - 2451545.0) / 36525.0;
  // Base Lahiri at J2000 is 23° 51' 11" = 23.853055°
  // Precession rate: 50.29" per year = 1.39697° per century
  const ayanamsha = 23.853055 + 1.396971 * T + 0.000308 * T * T;
  return ayanamsha;
}

// Compute Tropical Positions of Planets using High Precision Approximations
function computeTropicalPositions(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T;

  // 1. Sun
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T2);
  const M_sun = normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T2) * DEG_TO_RAD;
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin(M_sun) +
                (0.019993 - 0.000101 * T) * Math.sin(2 * M_sun) +
                0.000289 * Math.sin(3 * M_sun);
  const sunTrop = normalizeDeg(L0 + C_sun);

  // 2. Moon
  const Lp = normalizeDeg(218.3164477 + 481267.8812853 * T);
  const D = normalizeDeg(297.8501921 + 445267.1114034 * T) * DEG_TO_RAD;
  const M = normalizeDeg(357.5291092 + 35999.0502909 * T) * DEG_TO_RAD;
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * T) * DEG_TO_RAD;
  const F = normalizeDeg(93.2720950 + 483202.0175233 * T) * DEG_TO_RAD;

  const moonPerturbations =
    6.288774 * Math.sin(Mp) +
    1.274027 * Math.sin(2 * D - Mp) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mp) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F);
  const moonTrop = normalizeDeg(Lp + moonPerturbations);

  // 3. Rahu & Ketu (Mean Node)
  const nodeOmega = normalizeDeg(125.04452 - 1934.136261 * T + 0.0020708 * T2);
  const rahuTrop = nodeOmega;
  const ketuTrop = normalizeDeg(nodeOmega + 180);

  // 4. Mars
  const M_mars = normalizeDeg(19.373 + 19140.299 * T) * DEG_TO_RAD;
  const L_mars = normalizeDeg(355.433 + 19141.696 * T + 10.691 * Math.sin(M_mars));

  // 5. Mercury
  const M_merc = normalizeDeg(174.794 + 149472.515 * T) * DEG_TO_RAD;
  const L_merc = normalizeDeg(252.251 + 149474.072 * T + 23.44 * Math.sin(M_merc));

  // 6. Jupiter
  const M_jup = normalizeDeg(20.02 + 3034.906 * T) * DEG_TO_RAD;
  const L_jup = normalizeDeg(34.35 + 3036.303 * T + 5.55 * Math.sin(M_jup));

  // 7. Venus
  const M_ven = normalizeDeg(50.116 + 58517.804 * T) * DEG_TO_RAD;
  const L_ven = normalizeDeg(181.98 + 58519.213 * T + 0.776 * Math.sin(M_ven));

  // 8. Saturn
  const M_sat = normalizeDeg(317.02 + 1221.554 * T) * DEG_TO_RAD;
  const L_sat = normalizeDeg(50.08 + 1222.114 * T + 6.35 * Math.sin(M_sat));

  return {
    Sun: sunTrop,
    Moon: moonTrop,
    Mars: L_mars,
    Mercury: L_merc,
    Jupiter: L_jup,
    Venus: L_ven,
    Saturn: L_sat,
    Rahu: rahuTrop,
    Ketu: ketuTrop
  };
}

// Compute Sidereal Ascendant (Lagna)
function computeLagna(jd, lat, lon, ayanamsha) {
  const T = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time in degrees
  const gmst = normalizeDeg(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  // Local Sidereal Time
  const lst = normalizeDeg(gmst + lon);
  const lstRad = lst * DEG_TO_RAD;

  // Mean Obliquity of Ecliptic
  const eps = (23.4392911 - 0.0130042 * T) * DEG_TO_RAD;
  const latRad = lat * DEG_TO_RAD;

  // Ascendant formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  let ascTropical = Math.atan2(y, x) * RAD_TO_DEG;
  ascTropical = normalizeDeg(ascTropical);

  // Convert to Sidereal
  const lagnaSidereal = normalizeDeg(ascTropical - ayanamsha);
  return lagnaSidereal;
}

// Calculate Moon's Nakshatra, Pada & Balance of Dasha
function getNakshatraInfo(moonLong) {
  const nakshatraSpan = 360 / 27; // 13°20' = 13.333333°
  const padaSpan = nakshatraSpan / 4; // 3°20' = 3.333333°

  const nakIndex = Math.floor(moonLong / nakshatraSpan);
  const nakDegree = moonLong % nakshatraSpan;
  const pada = Math.floor(nakDegree / padaSpan) + 1;
  const nak = NAKSHATRAS[nakIndex];

  // Fraction remaining for Vimshottari Dasha balance
  const fractionRemaining = (nakshatraSpan - nakDegree) / nakshatraSpan;

  return {
    index: nakIndex + 1,
    name: nak.name,
    lord: nak.lord,
    deity: nak.deity,
    pada: pada,
    fractionRemaining: fractionRemaining
  };
}

// Calculate Vimshottari Dasha Timeline
function computeVimshottariDasha(nakshatraInfo, birthDate) {
  const lordName = nakshatraInfo.lord;
  let startIndex = DASHA_ORDER.findIndex(d => d.lord === lordName);
  if (startIndex === -1) startIndex = 0;

  const timeline = [];
  let currentDate = new Date(birthDate.getTime());

  // First Mahadasha has balance
  const firstLord = DASHA_ORDER[startIndex];
  const balanceYears = firstLord.years * nakshatraInfo.fractionRemaining;
  const firstEndDate = new Date(currentDate.getTime() + balanceYears * 365.25 * 24 * 60 * 60 * 1000);

  timeline.push({
    mahadasha: firstLord.lord,
    startDate: new Date(currentDate),
    endDate: new Date(firstEndDate),
    years: balanceYears
  });
  currentDate = new Date(firstEndDate);

  // Subsequent Mahadashas
  for (let i = 1; i < 9; i++) {
    const idx = (startIndex + i) % 9;
    const item = DASHA_ORDER[idx];
    const nextEndDate = new Date(currentDate.getTime() + item.years * 365.25 * 24 * 60 * 60 * 1000);
    timeline.push({
      mahadasha: item.lord,
      startDate: new Date(currentDate),
      endDate: new Date(nextEndDate),
      years: item.years
    });
    currentDate = new Date(nextEndDate);
  }

  // Find currently active Dasha
  const now = new Date();
  let currentDasha = timeline.find(d => now >= d.startDate && now < d.endDate);
  if (!currentDasha) currentDasha = timeline[0];

  // Determine Antardasha for current Mahadasha
  const mLord = currentDasha.mahadasha;
  const mYears = DASHA_ORDER.find(d => d.lord === mLord).years;
  const mStartIdx = DASHA_ORDER.findIndex(d => d.lord === mLord);

  let antardashaTimeline = [];
  let aDate = new Date(currentDasha.startDate.getTime());
  for (let j = 0; j < 9; j++) {
    const aIdx = (mStartIdx + j) % 9;
    const aLord = DASHA_ORDER[aIdx];
    // Antardasha duration = (M_years * A_years) / 120 (in years)
    const aDurationYears = (mYears * aLord.years) / 120;
    const aEndDate = new Date(aDate.getTime() + aDurationYears * 365.25 * 24 * 60 * 60 * 1000);
    antardashaTimeline.push({
      lord: aLord.lord,
      startDate: new Date(aDate),
      endDate: new Date(aEndDate)
    });
    aDate = new Date(aEndDate);
  }

  let activeAntardasha = antardashaTimeline.find(a => now >= a.startDate && now < a.endDate);
  if (!activeAntardasha) activeAntardasha = antardashaTimeline[0];

  return {
    timeline,
    current: {
      mahadasha: currentDasha.mahadasha,
      antardasha: activeAntardasha.lord,
      endsAt: currentDasha.endDate.getFullYear()
    }
  };
}

// Analyze Manglik Dosha (Mars in 1, 4, 7, 8, 12 from Lagna or Moon)
function analyzeManglik(marsHouse, marsHouseFromMoon) {
  const manglikHouses = [1, 4, 7, 8, 12];
  const isLagnaManglik = manglikHouses.includes(marsHouse);
  const isMoonManglik = manglikHouses.includes(marsHouseFromMoon);
  return {
    isManglik: isLagnaManglik || isMoonManglik,
    intensity: (isLagnaManglik && isMoonManglik) ? "High (Purna)" : (isLagnaManglik || isMoonManglik) ? "Moderate (Anshik)" : "None",
    explanation: isLagnaManglik
      ? `Mars is placed in House ${marsHouse} from Lagna, indicating active passion, dynamism, and need for mutual patience in partnership.`
      : "No dominant Manglik dosha found in Lagna chart."
  };
}

// Analyze Sade Sati Status (Saturn transit relative to Natal Moon)
function analyzeSadeSati(natalMoonSignId, currentSaturnSignId) {
  // Current Saturn is in Kumbha (Aquarius - Sign 11) in 2024-2025, moving to Meena (Pisces - Sign 12)
  const diff = (currentSaturnSignId - natalMoonSignId + 12) % 12;
  if (diff === 11) {
    return { active: true, phase: "Rising Phase (1st Phase)", remedy: "Chant Hanuman Chalisa; help the underprivileged on Saturdays." };
  } else if (diff === 0) {
    return { active: true, phase: "Peak Phase (2nd Phase)", remedy: "Cultivate deep patience, regular routine, light sesame oil lamp on Saturdays." };
  } else if (diff === 1) {
    return { active: true, phase: "Setting Phase (3rd Phase)", remedy: "Relief and long-term stabilization begin; practice gratitude and charity." };
  }
  return { active: false, phase: "None", remedy: "No Sade Sati active at present." };
}

// Main Master Function: Generate Complete Kundli
export function generateKundli({ name, gender, dob, tob, lat, lon, timezone }) {
  const birthDate = new Date(`${dob}T${tob}:00`);
  const jd = getJulianDay(birthDate, tob, timezone);
  const ayanamsha = getLahiriAyanamsha(jd);

  // Compute Planetary Sidereal Longitudes
  const tropical = computeTropicalPositions(jd);
  const sidereal = {};
  for (const [planet, tropDeg] of Object.entries(tropical)) {
    sidereal[planet] = normalizeDeg(tropDeg - ayanamsha);
  }

  // Lagna (Ascendant)
  const lagnaDeg = computeLagna(jd, lat, lon, ayanamsha);
  const lagnaRashiIndex = Math.floor(lagnaDeg / 30);
  const lagnaRashi = RASHIS[lagnaRashiIndex];

  // Moon Sign and Nakshatra
  const moonDeg = sidereal.Moon;
  const moonRashiIndex = Math.floor(moonDeg / 30);
  const moonRashi = RASHIS[moonRashiIndex];
  const nakshatraInfo = getNakshatraInfo(moonDeg);

  // Sun Sign
  const sunDeg = sidereal.Sun;
  const sunRashiIndex = Math.floor(sunDeg / 30);
  const sunRashi = RASHIS[sunRashiIndex];

  // Assign Planets to Houses (Vedic Whole Sign / Rashi Bhavas)
  // House 1 = Lagna Sign
  const houses = {};
  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaRashiIndex + (h - 1)) % 12;
    houses[h] = {
      house: h,
      rashi: RASHIS[rashiIdx],
      planets: []
    };
  }

  const planetPositions = [];
  for (const [planet, deg] of Object.entries(sidereal)) {
    const rashiIdx = Math.floor(deg / 30);
    const houseNum = ((rashiIdx - lagnaRashiIndex + 12) % 12) + 1;
    const degInSign = (deg % 30).toFixed(2);
    
    houses[houseNum].planets.push(planet);
    planetPositions.push({
      name: planet,
      longitude: deg.toFixed(2),
      rashi: RASHIS[rashiIdx].name,
      englishRashi: RASHIS[rashiIdx].english,
      degreeInSign: `${degInSign}°`,
      house: houseNum
    });
  }

  // Mars House from Moon
  const marsRashiIdx = Math.floor(sidereal.Mars / 30);
  const marsHouseFromMoon = ((marsRashiIdx - moonRashiIndex + 12) % 12) + 1;
  const marsHouseFromLagna = ((marsRashiIdx - lagnaRashiIndex + 12) % 12) + 1;

  // Dasha
  const dashaInfo = computeVimshottariDasha(nakshatraInfo, birthDate);

  // Manglik & Sade Sati
  const manglik = analyzeManglik(marsHouseFromLagna, marsHouseFromMoon);
  // Estimate Current Saturn Sign (Kumbha/Aquarius in 2024-2026 = ID 11)
  const currentSaturnSignId = 11;
  const sadeSati = analyzeSadeSati(moonRashi.id, currentSaturnSignId);

  // Navamsha (D-9) Chart Calculation
  const navamshaPlanets = planetPositions.map(p => {
    const rawLong = parseFloat(p.longitude);
    const navSignIndex = Math.floor(rawLong / (360 / 108)) % 12;
    return {
      name: p.name,
      rashi: RASHIS[navSignIndex].name,
      englishRashi: RASHIS[navSignIndex].english,
      rashiId: RASHIS[navSignIndex].id
    };
  });
  const navLagnaIndex = Math.floor(lagnaDeg / (360 / 108)) % 12;
  const navamshaLagna = RASHIS[navLagnaIndex];

  // Lucky Attributes
  const luckyColorMap = {
    Sun: "Ruby Red / Gold",
    Moon: "Pearl White / Silver",
    Mars: "Coral Red / Bright Orange",
    Mercury: "Emerald Green",
    Jupiter: "Bright Yellow / Turmeric",
    Venus: "Soft White / Pastel Pink",
    Saturn: "Deep Blue / Charcoal Black",
    Rahu: "Smoky Grey",
    Ketu: "Terracotta Brown"
  };

  const luckyNumberMap = {
    Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9
  };

  return {
    user: { name, gender, dob, tob },
    lagna: {
      sign: lagnaRashi.name,
      english: lagnaRashi.english,
      degree: (lagnaDeg % 30).toFixed(2),
      lord: lagnaRashi.lord,
      element: lagnaRashi.element
    },
    moonSign: {
      sign: moonRashi.name,
      english: moonRashi.english,
      lord: moonRashi.lord,
      id: moonRashi.id
    },
    sunSign: {
      sign: sunRashi.name,
      english: sunRashi.english,
      lord: sunRashi.lord
    },
    nakshatra: nakshatraInfo,
    planets: planetPositions,
    navamsha: {
      lagna: navamshaLagna,
      planets: navamshaPlanets
    },
    houses: houses,
    dasha: dashaInfo,
    doshas: {
      manglik,
      sadeSati
    },
    recommendations: {
      luckyColor: luckyColorMap[lagnaRashi.lord] || "Gold",
      luckyNumber: luckyNumberMap[lagnaRashi.lord] || 7,
      luckyDirection: lagnaRashi.element === "Fire" ? "East" : lagnaRashi.element === "Earth" ? "South" : lagnaRashi.element === "Air" ? "West" : "North",
      deity: nakshatraInfo.deity
    }
  };
}

// =========================================================================
// KUNDLI MILAN (ASHTA KOOTA 36 GUNAS MARRIAGE MATCHING ENGINE)
// =========================================================================

// Yoni Animals (14 classifications)
const NAKSHATRA_YONI = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat", // 1-9
  "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",      // 10-18
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant" // 19-27
];

// Gana (Deva, Manushya, Rakshasa)
const NAKSHATRA_GANA = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",      // 1-9
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",  // 10-18
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"// 19-27
];

// Nadi (Adi, Madhya, Antya)
const NAKSHATRA_NADI = [
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya",     // 1-9
  "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",     // 10-18
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya"      // 19-27
];

// Planetary Friendship Matrix (Friends, Neutral, Enemy)
const PLANET_RELATIONS = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutrals: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutrals: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutrals: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutrals: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], neutrals: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] }
};

export function calculateAshtaKoota(boyChart, girlChart) {
  const bNakIdx = boyChart.nakshatra.index - 1;
  const gNakIdx = girlChart.nakshatra.index - 1;
  const bSignId = boyChart.moonSign.id;
  const gSignId = girlChart.moonSign.id;
  const bLord = boyChart.moonSign.lord;
  const gLord = girlChart.moonSign.lord;

  let totalScore = 0;
  const breakdown = [];

  // 1. Varna Koota (Max 1 pt)
  const varnaOrder = signId => [4, 8, 12].includes(signId) ? 4 : [1, 5, 9].includes(signId) ? 3 : [2, 6, 10].includes(signId) ? 2 : 1;
  const bVarna = varnaOrder(bSignId);
  const gVarna = varnaOrder(gSignId);
  const varnaPts = bVarna >= gVarna ? 1 : 0;
  totalScore += varnaPts;
  breakdown.push({ name: "Varna", score: varnaPts, max: 1, desc: "Ego, spiritual capacity & work harmony" });

  // 2. Vashya Koota (Max 2 pts)
  const vashyaPts = bSignId === gSignId ? 2 : (Math.abs(bSignId - gSignId) % 6 === 0) ? 1 : 1;
  totalScore += vashyaPts;
  breakdown.push({ name: "Vashya", score: vashyaPts, max: 2, desc: "Mutual attraction, magnetism & balance of power" });

  // 3. Tara Koota (Max 3 pts)
  const bToG = ((gNakIdx - bNakIdx + 27) % 27) % 9;
  const gToB = ((bNakIdx - gNakIdx + 27) % 27) % 9;
  const evilTaras = [2, 4, 6]; // Vipat, Pratyak, Naidhana
  const bFavorable = !evilTaras.includes(bToG);
  const gFavorable = !evilTaras.includes(gToB);
  const taraPts = (bFavorable && gFavorable) ? 3 : (bFavorable || gFavorable) ? 1.5 : 0;
  totalScore += taraPts;
  breakdown.push({ name: "Tara", score: taraPts, max: 3, desc: "Health, longevity & destiny synchronization" });

  // 4. Yoni Koota (Max 4 pts)
  const bYoni = NAKSHATRA_YONI[bNakIdx];
  const gYoni = NAKSHATRA_YONI[gNakIdx];
  let yoniPts = 2;
  if (bYoni === gYoni) yoniPts = 4;
  else if (["Horse-Elephant", "Cow-Tiger", "Cat-Rat", "Lion-Elephant"].some(pair => (bYoni + "-" + gYoni).includes(pair))) yoniPts = 0;
  totalScore += yoniPts;
  breakdown.push({ name: "Yoni", score: yoniPts, max: 4, desc: "Biological, physical & emotional intimacy" });

  // 5. Graha Maitri (Max 5 pts)
  let maitriPts = 3;
  if (bLord === gLord) {
    maitriPts = 5;
  } else {
    const bRel = PLANET_RELATIONS[bLord];
    const gRel = PLANET_RELATIONS[gLord];
    const bLikesG = bRel?.friends.includes(gLord);
    const gLikesB = gRel?.friends.includes(bLord);
    const bHatesG = bRel?.enemies.includes(gLord);
    const gHatesB = gRel?.enemies.includes(bLord);

    if (bLikesG && gLikesB) maitriPts = 5;
    else if ((bLikesG && !gHatesB) || (gLikesB && !bHatesG)) maitriPts = 4;
    else if (!bHatesG && !gHatesB) maitriPts = 3;
    else if (bHatesG && gHatesB) maitriPts = 0;
    else maitriPts = 1;
  }
  totalScore += maitriPts;
  breakdown.push({ name: "Graha Maitri", score: maitriPts, max: 5, desc: "Psychological resonance & friendship of minds" });

  // 6. Gana Koota (Max 6 pts)
  const bGana = NAKSHATRA_GANA[bNakIdx];
  const gGana = NAKSHATRA_GANA[gNakIdx];
  let ganaPts = 6;
  if (bGana === gGana) ganaPts = 6;
  else if ((bGana === "Deva" && gGana === "Manushya") || (bGana === "Manushya" && gGana === "Deva")) ganaPts = 5;
  else if ((bGana === "Rakshasa" && gGana === "Deva") || (bGana === "Deva" && gGana === "Rakshasa")) ganaPts = 1;
  else ganaPts = 0;
  totalScore += ganaPts;
  breakdown.push({ name: "Gana", score: ganaPts, max: 6, desc: "Temperamental harmony & lifestyle habits" });

  // 7. Bhakoot Koota (Max 7 pts)
  const diffSign = (Math.abs(bSignId - gSignId) + 12) % 12;
  const inauspiciousBhakoot = [1, 5, 7]; // 2/12, 6/8, 9/5 positions
  let bhakootPts = 7;
  if (inauspiciousBhakoot.includes(diffSign) || inauspiciousBhakoot.includes(12 - diffSign)) {
    // Cancellation rule: if lords are identical or friends, Bhakoot dosha is cancelled!
    if (bLord === gLord || PLANET_RELATIONS[bLord]?.friends.includes(gLord)) {
      bhakootPts = 7;
    } else {
      bhakootPts = 0;
    }
  }
  totalScore += bhakootPts;
  breakdown.push({ name: "Bhakoot", score: bhakootPts, max: 7, desc: "Family welfare, emotional bonding & joy" });

  // 8. Nadi Koota (Max 8 pts)
  const bNadi = NAKSHATRA_NADI[bNakIdx];
  const gNadi = NAKSHATRA_NADI[gNakIdx];
  const nadiPts = (bNadi !== gNadi) ? 8 : (bNakIdx === gNakIdx ? 8 : 0);
  totalScore += nadiPts;
  breakdown.push({ name: "Nadi", score: nadiPts, max: 8, desc: "Genetic health, vital energy & progeny" });

  return {
    totalScore,
    maxScore: 36,
    percentage: Math.round((totalScore / 36) * 100),
    isAuspicious: totalScore >= 18,
    statusText: totalScore >= 28 ? "Excellent Compatibility (Uttam Milan)" : totalScore >= 18 ? "Good Compatibility (Madhyam Milan)" : "Requires Remedies (Adham Milan)",
    breakdown
  };
}

// =========================================================================
// DAILY PANCHANG & SHUBH MUHURAT CALCULATOR
// =========================================================================

export function calculateDailyPanchang(date = new Date(), lat = 28.6139, lon = 77.2090) {
  const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  const jd = getJulianDay(date, timeStr, 5.5);
  const ayanamsha = getLahiriAyanamsha(jd);
  const trop = computeTropicalPositions(jd);

  const sunSid = normalizeDeg(trop.Sun - ayanamsha);
  const moonSid = normalizeDeg(trop.Moon - ayanamsha);

  // 1. Tithi
  const diff = normalizeDeg(moonSid - sunSid);
  const tithiNum = Math.floor(diff / 12) + 1;
  const isShukla = tithiNum <= 15;
  const tithiIndex = isShukla ? tithiNum : tithiNum - 15;
  const tithiNames = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", isShukla ? "Purnima (Full Moon)" : "Amavasya (New Moon)"];
  const tithiName = `${tithiNames[tithiIndex - 1]} (${isShukla ? "Shukla Paksha" : "Krishna Paksha"})`;

  // 2. Vaar (Day of week)
  const vaarNames = ["Ravivaar (Sunday)", "Somvaar (Monday)", "Mangalvaar (Tuesday)", "Budhvaar (Wednesday)", "Guruvaar (Thursday)", "Shukravaar (Friday)", "Shanivaar (Saturday)"];
  const vaar = vaarNames[date.getDay()];

  // 3. Nakshatra
  const nakIdx = Math.floor(moonSid / (360 / 27));
  const nakshatra = NAKSHATRAS[nakIdx].name;

  // 4. Yoga (27 Yogas)
  const yogaNames = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Asiddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yogaIdx = Math.floor(normalizeDeg(sunSid + moonSid) / (360 / 27));
  const yoga = yogaNames[yogaIdx] || "Shubha";

  // 5. Rahu Kaal (approx 90 min window by day of week)
  const rahuSlots = [
    "16:30 - 18:00", // Sun
    "07:30 - 09:00", // Mon
    "15:00 - 16:30", // Tue
    "12:00 - 13:30", // Wed
    "13:30 - 15:00", // Thu
    "10:30 - 12:00", // Fri
    "09:00 - 10:30"  // Sat
  ];
  const rahuKaal = rahuSlots[date.getDay()];

  // 6. Abhijit Muhurat (Auspicious mid-day 48 min window)
  const abhijit = "11:45 - 12:35";

  return {
    date: date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    tithi: tithiName,
    vaar,
    nakshatra,
    yoga,
    rahuKaal,
    abhijit
  };
}

// =========================================================================
// VIRAL SHAADI (MARRIAGE) & SOULMATE RADAR ENGINE
// =========================================================================

export function predictMarriageAndSoulmate(chart) {
  const h7 = chart.houses[7];
  const h5 = chart.houses[5];
  const lagnaLord = chart.lagna.lord;
  const h7Lord = h7.rashi.lord;
  const venus = chart.planets.find(p => p.name === "Venus");
  const jupiter = chart.planets.find(p => p.name === "Jupiter");

  // 1. Archetype of Spouse based on 7th Sign
  const archetypes = {
    Aries: { title: "The Dynamic Trailblazer", traits: "Passionate, courageous, direct communicator, fiercely protective." },
    Taurus: { title: "The Grounded Devotee", traits: "Sensual, highly loyal, aesthetic connoisseur, creates financial stability." },
    Gemini: { title: "The Witty Intellectual", traits: "Social butterfly, endlessly curious, youthful spirit, loves deep late-night banter." },
    Cancer: { title: "The Empathetic Nurturer", traits: "Intuitive, family-centric, deeply emotional, builds an impenetrable safe haven." },
    Leo: { title: "The Magnetic Sovereign", traits: "Generous, proud, warm-hearted, commands respect with charismatic elegance." },
    Virgo: { title: "The Mindful Anchor", traits: "Practical, observant, service-oriented, notices every detail of your life." },
    Libra: { title: "The Graceful Peacemaker", traits: "Charming, artistic, romantic, prioritizes balance and mutual respect." },
    Scorpio: { title: "The Intense Mystic", traits: "Deeply magnetic, fiercely loyal, transformative presence, all-or-nothing love." },
    Sagittarius: { title: "The Free-Spirited Explorer", traits: "Philosophical, optimistic, loves adventure, inspires you to dream bigger." },
    Capricorn: { title: "The Ambitious Builder", traits: "Mature, disciplined, long-term planner, shows love through rock-solid loyalty." },
    Aquarius: { title: "The Visionary Rebel", traits: "Unconventional, humanitarian, intellectual friend first, values authentic freedom." },
    Pisces: { title: "The Soulful Dreamer", traits: "Spiritual, deeply compassionate, creative genius, connects on a telepathic level." }
  };
  const soulmateArchetype = archetypes[h7.rashi.english] || archetypes.Libra;

  // 2. Love vs Arranged Probability
  let loveScore = 50;
  if ([h5.rashi.lord, "Venus", "Mars"].includes(h7Lord)) loveScore += 25;
  if (h7.planets.includes("Venus") || h7.planets.includes("Mars") || h7.planets.includes("Rahu")) loveScore += 20;
  if (h7.planets.includes("Jupiter") || h7.planets.includes("Sun")) loveScore -= 20;
  loveScore = Math.max(15, Math.min(92, loveScore));
  const marriageType = loveScore >= 55 ? "Love Marriage / Self-Chosen Partner" : "Traditional Arranged / Family-Blessed Connection";

  // 3. Favorable Marriage Age Window
  const birthYear = new Date(chart.user.dob).getFullYear();
  let baseAge = 25;
  if (["Saturn", "Rahu", "Ketu"].includes(h7Lord) || h7.planets.includes("Saturn")) baseAge += 3; // Saturn delays for maturity
  if (["Venus", "Mercury", "Moon"].includes(h7Lord)) baseAge -= 1; // Early/on-time
  const ageRange = `${baseAge} - ${baseAge + 3} years`;
  const yearWindow = `${birthYear + baseAge} - ${birthYear + baseAge + 3}`;

  // 4. Soulmate's Name First Letter Vibration (derived from 7th house rashi / nakshatra syllables)
  const lettersBySign = {
    Aries: ["A", "L", "I"], Taurus: ["B", "V", "U"], Gemini: ["K", "CH", "GH"],
    Cancer: ["H", "D"], Leo: ["M", "T"], Virgo: ["P", "T", "N"],
    Libra: ["R", "T"], Scorpio: ["N", "Y"], Sagittarius: ["BH", "DH", "F"],
    Capricorn: ["KH", "J"], Aquarius: ["G", "S"], Pisces: ["D", "CH", "Z"]
  };
  const probableLetters = lettersBySign[h7.rashi.english] || ["A", "S", "R"];

  // 5. Meeting Direction
  const directions = {
    Fire: "East / North-East",
    Earth: "South / South-West",
    Air: "West / North-West",
    Water: "North / North-East"
  };
  const meetingDirection = directions[chart.houses[7].rashi.element] || "North";

  return {
    archetype: soulmateArchetype,
    marriageType,
    lovePercentage: loveScore,
    arrangedPercentage: 100 - loveScore,
    favorableAge: ageRange,
    yearWindow,
    probableLetters,
    meetingDirection
  };
}
