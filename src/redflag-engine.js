/**
 * Jyoti AI - Cosmic Red Flags & Unfiltered Psychological Roast Engine
 * Replaces generic fortune-cookie flattery with brutal, uncannily accurate
 * astrological self-sabotage analysis derived from classical natal placements.
 * 100% deterministic, zero external API cost.
 */

const MOON_RED_FLAGS = {
  Aries: {
    archetype: "The Adrenaline Addict",
    dating: "You fall in love in 48 hours and lose interest in 49. You confuse anxiety and sudden dopamine spikes with 'destiny'.",
    career: "You start 5 new projects with religious fervor, hit the first administrative obstacle, and pretend the project never existed.",
    blindspot: "You assume that anyone taking longer than 4 minutes to reply is secretly conspiring against your bloodline."
  },
  Taurus: {
    archetype: "The Stubborn Anchored Hermit",
    dating: "You will stay in a dead, unfulfilling relationship for 4 years simply because you already bought matching couch cushions.",
    career: "Your comfort zone isn't a zone—it's a high-security bunker. You resist career upgrades because learning new software feels like personal violence.",
    blindspot: "You think holding a grudge is an aerobic exercise that builds character."
  },
  Gemini: {
    archetype: "The Intellectual Ghost",
    dating: "You dissect emotions like a laboratory specimen so you never have to actually feel them. You text back in 2 seconds or 2 weeks.",
    career: "You have 14 tabs open in your brain at all times and finish whichever one requires the least emotional commitment.",
    blindspot: "You mistake having a witty commentary on your trauma for actually having healed from it."
  },
  Cancer: {
    archetype: "The Emotional Hostage Negotiator",
    dating: "You keep mental spreadsheets of every sacrifice you made that nobody asked for, then weaponize them during Tuesday dinner.",
    career: "You take corporate feedback so personally that an email ending with a period sends you into a 3-day spiritual retreat.",
    blindspot: "You test people's loyalty by pushing them away, then get furious when they actually respect your boundary."
  },
  Leo: {
    archetype: "The Royal Martyr",
    dating: "You require applause for basic adult participation in a relationship. If you aren't the main character, you rewrite the script.",
    career: "You would rather fail dramatically in the spotlight than quietly execute a profitable plan in the background.",
    blindspot: "You confuse external validation with self-worth and wonder why compliments only satisfy you for 20 minutes."
  },
  Virgo: {
    archetype: "The Hyper-Critical Project Manager",
    dating: "You don't date partners; you audit them. You view their flaws as remodeling projects and get resentful when they don't want to be renovated.",
    career: "You spend 4 hours perfecting the formatting of a spreadsheet instead of sending the actual invoice.",
    blindspot: "You believe that worrying is an act of love and control is an act of care."
  },
  Libra: {
    archetype: "The Conflict-Phobic Chameleon",
    dating: "You would rather stay in a lukewarm situation for 3 years than endure an awkward 4-minute breakup conversation.",
    career: "Deciding what to eat for lunch requires a UN security council debate; deciding career direction paralyzes you for months.",
    blindspot: "You agree with whoever spoke to you last just to keep the atmospheric pressure pleasant."
  },
  Scorpio: {
    archetype: "The FBI Surveillance Partner",
    dating: "You treat vulnerability like giving away state secrets. You search for betrayal until you manufacture it just to prove your paranoia right.",
    career: "You don't collaborate; you strategically assess who has leverage and quietly prepare contingency blackmail.",
    blindspot: "You think suspicious skepticism is high emotional intelligence."
  },
  Sagittarius: {
    archetype: "The Philosophical Escape Artist",
    dating: "The second emotional intimacy requires actual vulnerability, you book a flight or suddenly need 'space to align with the cosmos'.",
    career: "You have supreme grand visions for humanity but cannot organize your desk or file your tax returns on time.",
    blindspot: "You use philosophical humor and spirituality as an escape hatch from human responsibility."
  },
  Capricorn: {
    archetype: "The Emotionally Bankrupt CEO",
    dating: "You treat romance like an annual performance review. If vulnerability doesn't increase quarterly ROI, you deem it inefficient.",
    career: "You believe rest is a character defect and work yourself into exhaustion to avoid being alone with your unaddressed thoughts.",
    blindspot: "You mistake emotional numbness for maturity."
  },
  Aquarius: {
    archetype: "The Detached Alien Observer",
    dating: "You love humanity as an abstract concept, but actual humans with real messy feelings make your nervous system short-circuit.",
    career: "You refuse to use proven playbooks simply because they are popular, choosing the most unnecessarily complicated rebel path.",
    blindspot: "You think being contrarian is a personality."
  },
  Pisces: {
    archetype: "The Romantic Illusionist",
    dating: "You fall in love with the potential you hallucinated in someone rather than the human standing right in front of you.",
    career: "You float through deadlines hoping the celestial universe will sort out your spreadsheet through sheer divine manifestation.",
    blindspot: "You romanticize suffering because you think heartbreak gives your poetry more artistic credibility."
  }
};

export function auditCosmicRedFlags(chart) {
  if (!chart || !chart.moonSign) return null;

  const moonSign = chart.moonSign.english;
  const lagnaSign = chart.lagna?.english || "Aries";
  const moonData = MOON_RED_FLAGS[moonSign] || MOON_RED_FLAGS.Aries;
  const isManglik = chart.doshas?.manglik?.isManglik || false;

  const flags = [
    {
      category: "TOXIC DATING PATTERN",
      title: moonData.archetype,
      text: moonData.dating,
      placement: `Chandra in ${moonSign}`
    },
    {
      category: "CAREER SELF-SABOTAGE",
      title: "The Friction Trap",
      text: moonData.career,
      placement: `Lagna in ${lagnaSign}`
    },
    {
      category: "EMOTIONAL BLINDSPOT",
      title: "The Defense Mechanism",
      text: moonData.blindspot,
      placement: `Rahu / Moon Axis`
    }
  ];

  if (isManglik) {
    flags.push({
      category: "COMBUSTION WARNING",
      title: "The Mars Fuse",
      text: "Your passion and your impatience share the exact same trigger. You create emergencies just to feel the thrill of resolving them.",
      placement: "Kuja Dosha (Manglik)"
    });
  }

  const brutalVerdict = `Your cosmic chart proves you are brilliant at advising everyone else on their lives while your own emotional steering wheel is handled by a sleep-deprived ${moonSign} Moon.`;

  return {
    archetype: moonData.archetype,
    flags,
    brutalVerdict,
    shareQuote: `🚩 Jyoti AI just read my ${moonSign} Moon for filth: "${moonData.dating}"`
  };
}
