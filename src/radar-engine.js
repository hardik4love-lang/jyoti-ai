/**
 * Jyoti AI - Crush & Ex Truth Radar Engine
 * Calculates instant interpersonal chemistry using Vedic Swara Shastra & Sound Vibrations.
 * Generates high-urgency, seductive compatibility cards with zero birth time required.
 * Generates 1-tap viral WhatsApp & Instagram share links.
 */

const TRUTH_ARCHETYPES = [
  {
    type: "Twin Flames with Karmic Friction",
    scoreRange: [86, 96],
    whoFalls: "falls first, while",
    whoFallsSuffix: "controls the emotional temperature.",
    friction: "Unspoken expectations. One person tests loyalty through silence; the other demands immediate verbal reassurance.",
    obsession: "The electric eye contact and how effortlessly conversations stretch from midnight into 3:00 AM.",
    verdict: "High-intensity bond. You trigger each other's deepest growth points—either you evolve together or you ignite in flames."
  },
  {
    type: "Obsessive Magnetic Power Play",
    scoreRange: [78, 88],
    whoFalls: "pretends to be unbothered, while",
    whoFallsSuffix: "quietly stalks their profile daily.",
    friction: "Neither person wants to surrender control. Pride and defensive sarcasm replace honest vulnerability.",
    obsession: "The undeniable physical magnetism and the lingering feeling that this connection isn't finished yet.",
    verdict: "Unresolved karmic loop. The silence between you is louder than any spoken conversation."
  },
  {
    type: "Healing Sanctuary & Safe Harbor",
    scoreRange: [82, 94],
    whoFalls: "anchors the stability, while",
    whoFallsSuffix: "brings spontaneous magic and warmth.",
    friction: "Fear of getting too comfortable. One person worries that peaceful love lacks passion.",
    obsession: "The sheer emotional safety. You can sit in pure silence together without feeling awkward.",
    verdict: "Rare divine blessing. Protect this bond from third-party opinions and social media drama."
  },
  {
    type: "The Electric Chemistry Catalyst",
    scoreRange: [74, 85],
    whoFalls: "chases the thrill, while",
    whoFallsSuffix: "keeps their emotional guard up.",
    friction: "Timing. One person is ready for sovereign commitment; the other is still healing from past betrayal.",
    obsession: "The mental banter, sharp wit, and intoxicating chemistry in public settings.",
    verdict: "Catalyst soulmate. Meeting this person fundamentally changes your standards forever."
  }
];

export class CrushRadarEngine {
  /**
   * Evaluates name-based Vedic chemistry
   * @param {string} name1 - Seeker's name
   * @param {string} name2 - Crush / Ex's name
   * @returns {Object} Unfiltered truth radar metrics
   */
  static analyzeTruth(name1, name2) {
    const clean1 = (name1 || "Seeker").trim();
    const clean2 = (name2 || "Crush").trim();

    // Deterministic hash from name vibrations
    let hash = 0;
    const combined = `${clean1.toLowerCase()}_${clean2.toLowerCase()}`;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const archetype = TRUTH_ARCHETYPES[absHash % TRUTH_ARCHETYPES.length];
    const score = archetype.scoreRange[0] + (absHash % (archetype.scoreRange[1] - archetype.scoreRange[0] + 1));

    // Dynamic who falls harder
    const fallsFirst = (absHash % 2 === 0) ? clean1 : clean2;
    const controlsDial = (fallsFirst === clean1) ? clean2 : clean1;
    const whoFallsText = `${fallsFirst} ${archetype.whoFalls} ${controlsDial} ${archetype.whoFallsSuffix}`;

    return {
      name1: clean1,
      name2: clean2,
      score,
      archetype: archetype.type,
      whoFallsText,
      fatalFriction: archetype.friction,
      secretObsession: archetype.obsession,
      cosmicVerdict: archetype.verdict,
      timestamp: new Date().toLocaleDateString()
    };
  }

  /**
   * Generates viral WhatsApp share link pre-loaded with names
   */
  static getWhatsAppTruthLink(name1, name2) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hardik4love-lang.github.io";
    const path = typeof window !== "undefined" ? window.location.pathname : "/jyoti-ai/";
    const payload = btoa(encodeURIComponent(JSON.stringify({ n1: name1, n2: name2 })));
    const targetUrl = `${origin}${path}#truth=${payload}`;
    
    const text = `👀 ${name1} just ran our Crush & Ex Truth Radar on Jyoti AI and unlocked our unspoken chemistry score...\n\nTap our private link to reveal what she found about us:\n${targetUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  /**
   * Checks if user opened app via a shared #truth= link
   */
  static checkIncomingTruthLink() {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (!hash || !hash.includes("#truth=")) return null;

    try {
      const b64 = hash.replace("#truth=", "");
      const raw = decodeURIComponent(atob(b64));
      const parsed = JSON.parse(raw);
      if (parsed && parsed.n1 && parsed.n2) {
        return parsed;
      }
    } catch (e) {}
    return null;
  }
}
