/**
 * Jyoti AI - Daily Cosmic Energy & Aura Meter
 * Computes dynamic daily alignment scores (Love, Career, Intuition, Vitality)
 */

export function calculateDailyAura(chart, date = new Date()) {
  const moonRashiId = chart.moonSign.id;
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon...
  const dashaLord = chart.dasha.current.mahadasha;

  // Day lord mapping: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
  const dayLords = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const currentDayLord = dayLords[dayOfWeek];

  // Dynamic deterministic variation based on date and birth chart
  const seed = (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() + moonRashiId * 7) % 100;

  // 1. Love & Harmony Index
  const loveEnergy = Math.min(98, Math.max(55, 65 + (seed % 30) - (chart.doshas.manglik.intensity !== "None" ? 5 : 0)));

  // 2. Career & Execution Momentum
  const careerEnergy = Math.min(99, Math.max(50, 70 + ((seed * 3) % 28)));

  // 3. Intuition & Spiritual Resonance
  const intuitionEnergy = Math.min(99, Math.max(60, 75 + ((seed * 7) % 24)));

  // 4. Cosmic Stress / Friction
  const stressLevel = chart.doshas.sadeSati.active ? 38 + (seed % 25) : 15 + (seed % 20);

  // Status message
  let advice = "Favorable cosmic currents: Trust your instincts and move forward with planned conversations.";
  if (careerEnergy > 85) {
    advice = "Exceptional career alignment today: Ideal for pitch meetings, strategic decisions, and bold proposals.";
  } else if (loveEnergy > 85) {
    advice = "Venusian harmony peak: Perfect evening for romantic reconciliation or deepening mutual bonds.";
  } else if (stressLevel > 45) {
    advice = "Planetary friction detected: Avoid reactive emotional confrontations during the Rahu Kaal window.";
  }

  return {
    love: loveEnergy,
    career: careerEnergy,
    intuition: intuitionEnergy,
    stress: stressLevel,
    dayLord: currentDayLord,
    advice
  };
}
