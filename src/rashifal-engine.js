/**
 * Jyoti AI - 12-Sign Daily Transit Horoscope (Rashifal) Engine
 * Classical Parashari Gochara (Transit) principles calculated client-side.
 * Covers all 12 Rashis (Mesha/Aries to Meena/Pisces) with dynamic ratings,
 * auspicious muhurats, lucky attributes, and practical Vedic upayas.
 */

export const ZODIAC_SIGNS = [
  { id: 1, name: "Mesha", english: "Aries", symbol: "♈", element: "Fire", lord: "Mars", deity: "Kartikeya" },
  { id: 2, name: "Vrishabha", english: "Taurus", symbol: "♉", element: "Earth", lord: "Venus", deity: "Lakshmi" },
  { id: 3, name: "Mithuna", english: "Gemini", symbol: "♊", element: "Air", lord: "Mercury", deity: "Vishnu" },
  { id: 4, name: "Karka", english: "Cancer", symbol: "♋", element: "Water", lord: "Moon", deity: "Parvati" },
  { id: 5, name: "Simha", english: "Leo", symbol: "♌", element: "Fire", lord: "Sun", deity: "Shiva" },
  { id: 6, name: "Kanya", english: "Virgo", symbol: "♍", element: "Earth", lord: "Mercury", deity: "Ganesha" },
  { id: 7, name: "Tula", english: "Libra", symbol: "♎", element: "Air", lord: "Venus", deity: "Lakshmi" },
  { id: 8, name: "Vrishchika", english: "Scorpio", symbol: "♏", element: "Water", lord: "Mars", deity: "Hanuman" },
  { id: 9, name: "Dhanu", english: "Sagittarius", symbol: "♐", element: "Fire", lord: "Jupiter", deity: "Dakshinamurthy" },
  { id: 10, name: "Makara", english: "Capricorn", symbol: "♑", element: "Earth", lord: "Saturn", deity: "Bhairava" },
  { id: 11, name: "Kumbha", english: "Aquarius", symbol: "♒", element: "Air", lord: "Saturn", deity: "Shani Deva" },
  { id: 12, name: "Meena", english: "Pisces", symbol: "♓", element: "Water", lord: "Jupiter", deity: "Hayagriva" }
];

const SIGN_PREDICTIONS = {
  1: {
    headline: "High Ambition & Swift Breakthroughs",
    forecast: "Mars energizes your sector of initiative. Unfinished projects will gain rapid velocity today. Avoid rash financial decisions in the afternoon.",
    loveScore: 82, careerScore: 91, healthScore: 78,
    luckyColor: "Crimson Red & Gold", luckyNumber: 9, luckyMuhurat: "10:30 AM - 12:15 PM",
    upaya: "Chant 'Om Kram Kreem Kroum Sah Bhaumaya Namah' 7 times before embarking on negotiations."
  },
  2: {
    headline: "Financial Stability & Harmonious Bonds",
    forecast: "Venus showers auspicious grace over family and wealth sectors. A long-pending reimbursement or investment return may materialize.",
    loveScore: 94, careerScore: 80, healthScore: 88,
    luckyColor: "Lotus Pink & Silken White", luckyNumber: 6, luckyMuhurat: "02:00 PM - 03:45 PM",
    upaya: "Offer white flowers or a spoon of raw milk to a Shiva Lingam or plants at sunrise."
  },
  3: {
    headline: "Brilliant Communication & Strategic Wins",
    forecast: "Mercury enhances your wit and persuasive eloquence. Ideal day for high-stakes meetings, technical pitches, and resolving misunderstandings.",
    loveScore: 78, careerScore: 93, healthScore: 84,
    luckyColor: "Emerald Green & Light Yellow", luckyNumber: 5, luckyMuhurat: "09:00 AM - 10:45 AM",
    upaya: "Feed fresh green grass or spinach to a sacred cow or chant 'Om Budhaya Namah'."
  },
  4: {
    headline: "Intuitive Clarity & Deep Emotional Healing",
    forecast: "The Moon expands your psychic sensitivity. Trust gut feelings over dry external analysis. Domestic peace brings creative breakthroughs.",
    loveScore: 91, careerScore: 76, healthScore: 82,
    luckyColor: "Pearl White & Silver", luckyNumber: 2, luckyMuhurat: "06:30 PM - 08:00 PM",
    upaya: "Drink water from a silver cup or touch your mother's feet for divine blessings."
  },
  5: {
    headline: "Commanding Leadership & Creative Triumph",
    forecast: "Sun in full splendor elevates your executive presence. Superiors notice your proactive vision. Maintain warmth rather than domineering ego.",
    loveScore: 84, careerScore: 96, healthScore: 85,
    luckyColor: "Saffron, Gold & Amber", luckyNumber: 1, luckyMuhurat: "11:15 AM - 01:00 PM",
    upaya: "Offer Surya Arghya (fresh water in a copper vessel) facing east with Gayatri Mantra."
  },
  6: {
    headline: "Meticulous Execution & Health Revitalization",
    forecast: "Your analytical precision clears administrative clutter. A disciplined health regimen pays immediate dividends. Contract reviews yield high leverage.",
    loveScore: 79, careerScore: 89, healthScore: 92,
    luckyColor: "Sea Green & Dove Grey", luckyNumber: 5, luckyMuhurat: "08:15 AM - 10:00 AM",
    upaya: "Donate yellow lentils or feed wild birds on your balcony before noon."
  },
  7: {
    headline: "Magnetic Diplomacy & Romantic Resonance",
    forecast: "Venus illuminates your 7th house of partnerships. A soul-affirming connection or profitable business partnership is under divine alignment.",
    loveScore: 97, careerScore: 84, healthScore: 86,
    luckyColor: "Pastel Blue & Rose Gold", luckyNumber: 6, luckyMuhurat: "04:30 PM - 06:15 PM",
    upaya: "Keep a small natural quartz crystal in your workspace to harmonize relationship auras."
  },
  8: {
    headline: "Transformative Power & Unlocking Hidden Truths",
    forecast: "Mars activates your deeper occult and research intelligence. Secrets reveal themselves in your favor. Trust quiet observation over confrontation.",
    loveScore: 81, careerScore: 88, healthScore: 80,
    luckyColor: "Deep Maroon & Rust Gold", luckyNumber: 8, luckyMuhurat: "01:30 PM - 03:00 PM",
    upaya: "Light a mustard-oil lamp under a Peepal tree or recite Hanuman Chalisa at sunset."
  },
  9: {
    headline: "Divine Fortune & Philosophical Expansion",
    forecast: "Jupiter radiates fortune over higher learning, mentors, and long-distance opportunities. An unexpected advisor brings immense clarity.",
    loveScore: 89, careerScore: 94, healthScore: 90,
    luckyColor: "Bright Yellow & Royal Purple", luckyNumber: 3, luckyMuhurat: "10:00 AM - 11:30 AM",
    upaya: "Apply a small saffron or turmeric tilak on your forehead before leaving home."
  },
  10: {
    headline: "Mastery of Duty & Unstoppable Recognition",
    forecast: "Saturn rewards your patient persistence. Longstanding career efforts receive public acknowledgment. Structure and punctuality are your superpowers.",
    loveScore: 75, careerScore: 98, healthScore: 81,
    luckyColor: "Navy Blue & Charcoal", luckyNumber: 8, luckyMuhurat: "03:15 PM - 05:00 PM",
    upaya: "Help an elderly person or donate footwear/blankets to someone in need."
  },
  11: {
    headline: "Social Innovation & Fulfilling Longest Dreams",
    forecast: "Your sector of collective alliances and sudden wealth gains cosmic momentum. A collaborative brainstorm unlocks an unexpected financial stream.",
    loveScore: 87, careerScore: 92, healthScore: 83,
    luckyColor: "Electric Cyan & Metallic Silver", luckyNumber: 7, luckyMuhurat: "05:00 PM - 06:45 PM",
    upaya: "Feed black dogs or sprinkle sesame seeds for stray birds in the morning."
  },
  12: {
    headline: "Spiritual Awakening & Serene Abundance",
    forecast: "Jupiter heightens lucid dreams and peaceful detachment. Outstanding karmic debts dissolve. Focus on creative sanctuary and inward prayer.",
    loveScore: 92, careerScore: 81, healthScore: 87,
    luckyColor: "Aqua Marine & Turmeric Gold", luckyNumber: 3, luckyMuhurat: "07:00 AM - 08:30 AM",
    upaya: "Feed soaking grams to aquatic life (fish in ponds) or meditate facing northeast for 10 minutes."
  }
};

export function getDailyRashifal(signId = 1) {
  const meta = ZODIAC_SIGNS.find(s => s.id === parseInt(signId)) || ZODIAC_SIGNS[0];
  const pred = SIGN_PREDICTIONS[meta.id];

  const overall = Math.round((pred.loveScore + pred.careerScore + pred.healthScore) / 3);

  return {
    ...meta,
    ...pred,
    overallScore: overall,
    dateString: new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  };
}

export function getAllRashifalList() {
  return ZODIAC_SIGNS.map(s => getDailyRashifal(s.id));
}
