/**
 * Jyoti AI - Vedic Prashna & Cosmic Archetype Card Engine ("Pick-A-Card")
 * Combines classical Jyotish Prashna Tantra with 22 Major Celestial Archetypes.
 * Generates viral 3-card readings: Past Root, Present Energy, Future Outcome.
 */

export const VEDIC_TAROT_DECK = [
  { id: 1, name: "The Cosmic Seeker (Arambha)", planet: "Lagna / Sun", element: "Fire", symbol: "☀️", keywords: "New beginnings, sovereign power, self-realization", advice: "Take the bold first step. The universe favors self-determined initiative today." },
  { id: 2, name: "The Lunar Oracle (Soma)", planet: "Moon", element: "Water", symbol: "🌙", keywords: "Deep intuition, emotional tide, hidden mysteries", advice: "Listen to the whisper of your subconscious. Facts can deceive, but your gut will not." },
  { id: 3, name: "The Divine Mother (Shakti)", planet: "Venus / Moon", element: "Earth", symbol: "🌸", keywords: "Abundance, creativity, unconditional nurture", advice: "Allow yourself to receive. Cultivate patience and surround yourself with beauty." },
  { id: 4, name: "The Dharma King (Raja)", planet: "Sun / Mars", element: "Fire", symbol: "👑", keywords: "Authority, discipline, moral structure, leadership", advice: "Lead with integrity. Set firm personal boundaries and enforce consistency." },
  { id: 5, name: "The Sacred Guru (Brihaspati)", planet: "Jupiter", element: "Ether", symbol: "📿", keywords: "Wisdom, expansion, divine grace, higher learning", advice: "Seek knowledge over immediate profit. A generous teacher or insight will appear." },
  { id: 6, name: "The Twin Souls (Mithuna)", planet: "Venus / Mercury", element: "Air", symbol: "💞", keywords: "Soul connection, divine mirror, crucial choice", advice: "Choose union over ego. True alignment requires vulnerable and honest dialogue." },
  { id: 7, name: "The Solar Chariot (Ratha)", planet: "Mars", element: "Fire", symbol: "⚔️", keywords: "Victory through focus, discipline, overcoming obstacles", advice: "Do not surrender now. Channel scattered energy into singular, deliberate action." },
  { id: 8, name: "Karma's Scales (Nyaya)", planet: "Saturn / Libra", element: "Air", symbol: "⚖️", keywords: "Karmic justice, truth, equilibrium, cause and effect", advice: "Be completely truthful with yourself. What you put into the cosmic field will return multiplied." },
  { id: 9, name: "The Forest Hermit (Vanaprastha)", planet: "Saturn / Ketu", element: "Earth", symbol: "🏮", keywords: "Solitude, inner lantern, detachment, meditation", advice: "Step back from the noise. Answers will not come from external opinions, only quiet stillness." },
  { id: 10, name: "The Wheel of Samsara (Kaal Chakra)", planet: "Jupiter / Rahu", element: "Ether", symbol: "☸️", keywords: "Destiny turning, sudden shifts, karmic cycle reset", advice: "Everything is in flux. If things were hard, relief is coming; stay humble during peaks." },
  { id: 11, name: "The Lion Tamer (Atma Bala)", planet: "Sun / Leo", element: "Fire", symbol: "🦁", keywords: "Inner courage, gentleness conquering fury, resilience", advice: "Brute force will fail, but serene, patient grace will tame the fiercest adversity." },
  { id: 12, name: "The Sacred Surrender (Samadhi)", planet: "Neptune / Ketu", element: "Water", symbol: "🌊", keywords: "Perspective flip, letting go, profound spiritual insight", advice: "Surrender your need to control the outcome. Let the river carry you to the shore." },
  { id: 13, name: "The Great Metamorphosis (Punarjanma)", planet: "Scorpio / Ketu", element: "Water", symbol: "🦋", keywords: "End of an era, radical rebirth, shedding old skin", advice: "Do not mourn what has withered away. You are making fertile soil for a greater identity." },
  { id: 14, name: "The Divine Alchemy (Samanvaya)", planet: "Jupiter / Sagittarius", element: "Fire/Water", symbol: "🏺", keywords: "Balance, emotional moderation, graceful integration", advice: "Avoid extremes. Blend passion with practicality to create gold from common lead." },
  { id: 15, name: "The Maya Illusion (Moham)", planet: "Rahu", element: "Shadow", symbol: "🎭", keywords: "Obsession, material attachment, shadow projections", advice: "Beware of shiny promises. Question whether this desire frees your soul or enchains it." },
  { id: 16, name: "The Lightning Tower (Vajra)", planet: "Mars / Rahu", element: "Fire", symbol: "⚡", keywords: "Sudden breakthrough, destruction of false pride, awakening", advice: "A sudden shock clears away delusions. Rebuild your life on stone, not on sand." },
  { id: 17, name: "The Celestial Star (Tara)", planet: "Venus / Nakshatras", element: "Air", symbol: "⭐", keywords: "Pure hope, celestial guidance, healing, inspiration", advice: "Have faith. The darkest part of the night is past; your true north star is shining." },
  { id: 18, name: "The Moon Mist (Chaya)", planet: "Moon / Rahu", element: "Water", symbol: "🌘", keywords: "Uncertainty, illusions, unconscious fears, dreams", advice: "Do not make major contractual commitments while the fog lingers. Wait for daylight." },
  { id: 19, name: "The Golden Dawn (Surya Deva)", planet: "Sun", element: "Fire", symbol: "🌞", keywords: "Triumph, radiant vitality, public recognition, joy", advice: "Step into your light. Warm others with your presence; your success is blessed." },
  { id: 20, name: "The Awakening Call (Jagriti)", planet: "Pluto / Jupiter", element: "Fire", symbol: "🎺", keywords: "Karmic reckoning, life purpose awakening, liberation", advice: "Heed the call of your soul. Forgive the past and step into your designated purpose." },
  { id: 21, name: "The Cosmic Mandala (Moksha)", planet: "Jupiter / Saturn", element: "Universe", symbol: "🌌", keywords: "Total completion, wholeness, cosmic celebration", advice: "You have completed a great karmic circle. Celebrate your growth with deep gratitude." },
  { id: 22, name: "The Divine Innocent (Balak)", planet: "Mercury / Uranus", element: "Air", symbol: "🕊️", keywords: "Infinite potential, leap of faith, pure spontaneous joy", advice: "Trust the unknown. Jump into the adventure with a child's pure and open heart." }
];

export function drawPrashnaCards(count = 3) {
  const shuffled = [...VEDIC_TAROT_DECK].sort(() => 0.5 - Math.random());
  return {
    past: { role: "Past Root Cause", ...shuffled[0] },
    present: { role: "Present Energy", ...shuffled[1] },
    future: { role: "Future Destiny & Advice", ...shuffled[2] }
  };
}
