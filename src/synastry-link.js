/**
 * Jyoti AI - 2-Player Viral Synastry Deep-Link Engine
 * Encodes & decodes sender birth charts into lightweight serverless URL hashes (#synastry=...)
 * Creates an asymmetric viral acquisition loop (K-factor > 1.5) with $0 server cost.
 */

export class SynastryLinkManager {
  /**
   * Generates a 2-player sync link preloaded with the sender's birth coordinates
   * @param {Object} chart - Generated Kundli chart
   * @returns {string} Fully qualified URL with hash
   */
  static generateShareLink(chart) {
    if (!chart || !chart.user) return window.location.href;

    const payload = {
      n: chart.user.name,
      g: chart.user.gender || "Male",
      d: chart.user.dob,
      t: chart.user.tob,
      c: chart.user.city || "Jamnagar, Gujarat",
      lat: chart.user.lat || 22.4707,
      lon: chart.user.lon || 70.0577,
      tz: chart.user.timezone || 5.5,
      lagna: chart.lagna?.english || "Aries",
      moon: chart.moonSign?.english || "Libra",
      nakshatra: chart.nakshatra?.name || "Swati"
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const b64 = btoa(encodeURIComponent(jsonStr));
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}#synastry=${b64}`;
    } catch (err) {
      console.warn("Could not encode synastry link:", err);
      return window.location.href;
    }
  }

  /**
   * Detects and parses incoming shared synastry link on app launch
   * @returns {Object|null} Preloaded sender profile
   */
  static checkIncomingLink() {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (!hash || !hash.includes("#synastry=")) return null;

    try {
      const encoded = hash.replace("#synastry=", "");
      const decoded = decodeURIComponent(atob(encoded));
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.n && parsed.d) {
        return {
          name: parsed.n,
          gender: parsed.g || "Male",
          dob: parsed.d,
          tob: parsed.t || "12:00",
          city: parsed.c || "India",
          lat: parseFloat(parsed.lat) || 22.4707,
          lon: parseFloat(parsed.lon) || 70.0577,
          tz: parseFloat(parsed.tz) || 5.5,
          lagna: parsed.lagna,
          moon: parsed.moon,
          nakshatra: parsed.nakshatra
        };
      }
    } catch (e) {
      console.warn("Invalid synastry hash:", e);
    }
    return null;
  }

  /**
   * Formats viral WhatsApp share text
   */
  static getWhatsAppShareUrl(chart) {
    const link = this.generateShareLink(chart);
    const senderName = chart?.user?.name || "I";
    const text = `🔮 ${senderName} wants to check your Vedic Synastry & 36 Gunas score!\n\nOpen our private cosmic match link to see if our planetary energies are Twin Flames or Karmic Lessons: \n${link}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }
}
