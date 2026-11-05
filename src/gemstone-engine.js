/**
 * Jyoti AI - Classical Parashara Gemstone & Vedic Upaya Engine
 * Prescribes personalized sacred gemstones (Jeevan Ratna, Bhagya Ratna, Vidya Ratna),
 * Rudraksha Mukhis, auspicious metals, finger placement, and sacred seed mantras.
 */

export const GEMSTONE_DATABASE = {
  Sun: {
    stone: "Ruby (Manikya)",
    altStone: "Garnet / Red Spinel",
    color: "Deep Pigeon Blood Red",
    metal: "Pure Gold / Copper",
    finger: "Ring Finger (Anamika)",
    day: "Sunday morning at Sunrise",
    mantra: "Om Hram Hreem Hroum Sah Suryaya Namah",
    rudraksha: "1-Mukhi or 12-Mukhi Rudraksha",
    deity: "Lord Surya Narayana",
    benefits: "Executive authority, vitality, self-confidence, heart health & public fame."
  },
  Moon: {
    stone: "Natural South Sea Pearl (Moti)",
    altStone: "Moonstone (Chandrakant Mani)",
    color: "Lustrous Milky White",
    metal: "Pure Silver",
    finger: "Little Finger (Kanishtha)",
    day: "Monday evening during Shukla Paksha",
    mantra: "Om Shram Shreem Shroum Sah Chandramase Namah",
    rudraksha: "2-Mukhi Rudraksha",
    deity: "Goddess Parvati / Chandra Deva",
    benefits: "Emotional equilibrium, psychic peace, intuitive clarity & family harmony."
  },
  Mars: {
    stone: "Red Coral (Moonga)",
    altStone: "Carnelian",
    color: "Ox-blood Red / Vermilion",
    metal: "Copper / Gold",
    finger: "Ring Finger (Anamika)",
    day: "Tuesday morning",
    mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah",
    rudraksha: "3-Mukhi Rudraksha",
    deity: "Lord Hanuman / Kartikeya",
    benefits: "Physical stamina, real estate gains, eliminating fear & overcoming adversaries."
  },
  Mercury: {
    stone: "Natural Emerald (Panna)",
    altStone: "Green Tourmaline / Peridot",
    color: "Lush Vivid Green",
    metal: "Gold / Silver / Bronze",
    finger: "Little Finger (Kanishtha)",
    day: "Wednesday morning",
    mantra: "Om Bram Breem Broum Sah Budhaya Namah",
    rudraksha: "4-Mukhi or 10-Mukhi Rudraksha",
    deity: "Lord Vishnu / Saraswati",
    benefits: "Commercial prosperity, analytical intellect, speech mastery & business acumen."
  },
  Jupiter: {
    stone: "Yellow Sapphire (Pukhraj)",
    altStone: "Yellow Topaz / Citrine",
    color: "Lemon / Golden Yellow",
    metal: "22K Yellow Gold",
    finger: "Index Finger (Tarjani)",
    day: "Thursday morning during Shukla Paksha",
    mantra: "Om Gram Greem Groum Sah Gurave Namah",
    rudraksha: "5-Mukhi Rudraksha",
    deity: "Guru Brihaspati / Dakshinamurthy",
    benefits: "Divine grace, wealth accumulation, marital bliss, spiritual wisdom & progeny."
  },
  Venus: {
    stone: "Diamond (Heera) or White Zircon",
    altStone: "White Opal",
    color: "Dazzling Brilliant White",
    metal: "Platinum / White Gold / Silver",
    finger: "Middle or Little Finger",
    day: "Friday morning at Sunrise",
    mantra: "Om Dram Dreem Droum Sah Shukraya Namah",
    rudraksha: "6-Mukhi Rudraksha",
    deity: "Goddess Mahalakshmi",
    benefits: "Luxury, romantic magnetism, creative arts, vehicle acquisition & charisma."
  },
  Saturn: {
    stone: "Blue Sapphire (Neelam)",
    altStone: "Amethyst (Katela) / Blue Topaz",
    color: "Royal Cornflower Blue",
    metal: "Silver / White Gold / Panchdhatu",
    finger: "Middle Finger (Madhyama)",
    day: "Saturday evening during Twilight",
    mantra: "Om Pram Preem Proum Sah Shanaischaraya Namah",
    rudraksha: "7-Mukhi or 14-Mukhi Rudraksha",
    deity: "Lord Shani / Bhairava",
    benefits: "Sudden karmic upliftment, structural discipline, enduring fame & longevity."
  },
  Rahu: {
    stone: "Hessonite Garnet (Gomed)",
    altStone: "Spessartite",
    color: "Honey-Amber / Cow-urine tint",
    metal: "Silver / Ashtadhatu",
    finger: "Middle Finger (Madhyama)",
    day: "Saturday night / Wednesday night",
    mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah",
    rudraksha: "8-Mukhi Rudraksha",
    deity: "Goddess Durga / Saraswati",
    benefits: "Dissolving illusions, victory in technology/foreign ventures & political wins."
  },
  Ketu: {
    stone: "Chrysoberyl Cat's Eye (Lehsuniya)",
    altStone: "Tiger's Eye",
    color: "Greenish-Yellow with moving Chatoyant band",
    metal: "Silver / Panchdhatu",
    finger: "Ring Finger or Little Finger",
    day: "Tuesday night / Thursday night",
    mantra: "Om Stram Streem Stroum Sah Ketave Namah",
    rudraksha: "9-Mukhi Rudraksha",
    deity: "Lord Ganesha",
    benefits: "Occult mastery, spiritual detachment, protection from unseen negative energies."
  }
};

/**
 * Calculate personalized Gemstone prescriptions based on Parashari principles
 * @param {Object} chart - The generated Kundli chart object
 */
export function calculateGemstones(chart) {
  if (!chart || !chart.houses) return null;

  // 1st House Lord -> Jeevan Ratna (Life stone)
  const lagnaLord = chart.houses[1].rashi.lord;
  // 9th House Lord -> Bhagya Ratna (Fortune stone)
  const bhagyaLord = chart.houses[9].rashi.lord;
  // 5th House Lord -> Vidya/Karma Ratna (Wisdom stone)
  const vidyaLord = chart.houses[5].rashi.lord;

  const jeevan = {
    role: "Jeevan Ratna (Life Stone)",
    purpose: "Fortifies physical immunity, vital prana, and lifelong aura protection.",
    planet: lagnaLord,
    data: GEMSTONE_DATABASE[lagnaLord] || GEMSTONE_DATABASE.Sun
  };

  const bhagya = {
    role: "Bhagya Ratna (Fortune Stone)",
    purpose: "Activates divine luck, spiritual mentors, wealth flow, and unexpected breakthroughs.",
    planet: bhagyaLord,
    data: GEMSTONE_DATABASE[bhagyaLord] || GEMSTONE_DATABASE.Jupiter
  };

  const vidya = {
    role: "Vidya Ratna (Wisdom Stone)",
    purpose: "Ignites sharp intellect, creative mastery, speculative returns, and higher knowledge.",
    planet: vidyaLord,
    data: GEMSTONE_DATABASE[vidyaLord] || GEMSTONE_DATABASE.Mercury
  };

  // Malefic Dusthana Warnings (6th, 8th, 12th lords)
  const dusthanaLords = [
    chart.houses[6].rashi.lord,
    chart.houses[8].rashi.lord,
    chart.houses[12].rashi.lord
  ];

  const maleficWarnings = [];
  if (dusthanaLords.includes("Saturn") && lagnaLord !== "Saturn" && bhagyaLord !== "Saturn") {
    maleficWarnings.push("Blue Sapphire (Neelam) must only be worn after a 3-day trial under pillow; Saturn governs a dusthana house.");
  }
  if (dusthanaLords.includes("Mars") && lagnaLord !== "Mars" && bhagyaLord !== "Mars") {
    maleficWarnings.push("Red Coral (Moonga) should be approached cautiously to avoid sudden aggression or inflammation.");
  }

  return {
    prescriptions: [jeevan, bhagya, vidya],
    lifeStone: { gem: jeevan.data.stone, planet: jeevan.planet, finger: jeevan.data.finger, benefits: jeevan.purpose },
    fortuneStone: { gem: bhagya.data.stone, planet: bhagya.planet, finger: bhagya.data.finger, benefits: bhagya.purpose },
    wisdomStone: { gem: vidya.data.stone, planet: vidya.planet, finger: vidya.data.finger, benefits: vidya.purpose },
    maleficWarnings,
    generalRemedy: "Always energize any sacred gemstone with 108 chants of its planetary Beej Mantra before wearing for the first time."
  };
}

export const GemstoneEngine = {
  getGemstonePrescriptions: calculateGemstones,
  calculateGemstones
};

