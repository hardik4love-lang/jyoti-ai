/**
 * Jyoti AI - Viral Cosmic & Soulmate Card Generator (HTML5 Canvas)
 * Exports high-resolution, aesthetic 9:16 Instagram Story & WhatsApp cards
 * 100% client-side with 0 server compute cost.
 */

export class CosmicCardGenerator {
  // 1. Cosmic Passport Card (General Chart)
  static generateCard(chart, archetype = "The Cosmic Alchemist") {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Cosmic Luxury Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, "#080914");
    bgGradient.addColorStop(0.4, "#13142e");
    bgGradient.addColorStop(0.8, "#0a0b18");
    bgGradient.addColorStop(1, "#05060b");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Celestial Glowing Rings (Aura)
    ctx.save();
    const auraGradient = ctx.createRadialGradient(540, 750, 50, 540, 750, 550);
    auraGradient.addColorStop(0, "rgba(244, 196, 83, 0.25)");
    auraGradient.addColorStop(0.5, "rgba(140, 82, 255, 0.15)");
    auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(540, 750, 550, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Geometric Sacred Rings
    ctx.strokeStyle = "rgba(244, 196, 83, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(540, 750, 360, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(140, 82, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(540, 750, 420, 0, Math.PI * 2);
    ctx.stroke();

    // Top Branding
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 180);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.letterSpacing = "6px";
    ctx.fillText("PERSONAL SACRED COSMIC PASSPORT", 540, 230);

    // Center Name & Archetype
    ctx.font = "bold 88px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(chart.user.name, 540, 580);

    ctx.font = "italic 46px serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`"${archetype}"`, 540, 660);

    // Sacred Om Emblem
    ctx.beginPath();
    ctx.arc(540, 800, 75, 0, Math.PI * 2);
    ctx.fillStyle = "#1b1938";
    ctx.fill();
    ctx.strokeStyle = "#f4c453";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = "bold 64px serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ", 540, 822);

    // Pillars
    const pillars = [
      { label: "ASCENDANT (LAGNA)", val: `${chart.lagna.english} (${chart.lagna.sign})`, sub: `Lord: ${chart.lagna.lord} • ${chart.lagna.element}` },
      { label: "MOON SIGN (CHANDRA)", val: `${chart.moonSign.english} (${chart.moonSign.sign})`, sub: `Inner Psyche & Emotion` },
      { label: "JANMA NAKSHATRA", val: `${chart.nakshatra.name} (Pada ${chart.nakshatra.pada})`, sub: `Deity: ${chart.nakshatra.deity}` },
      { label: "ACTIVE DASHA CYCLE", val: `${chart.dasha.current.mahadasha} - ${chart.dasha.current.antardasha}`, sub: `Vimshottari Timeline` }
    ];

    let startY = 1000;
    pillars.forEach((p, idx) => {
      ctx.fillStyle = "rgba(22, 25, 52, 0.75)";
      ctx.strokeStyle = "rgba(244, 196, 83, 0.25)";
      ctx.lineWidth = 1.5;
      
      const cardX = 140;
      const cardW = 800;
      const cardH = 115;
      const y = startY + (idx * 135);

      ctx.beginPath();
      ctx.roundRect(cardX, y, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillStyle = "#f4c453";
      ctx.fillText(p.label, cardX + 35, y + 42);

      ctx.font = "bold 34px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.val, cardX + 35, y + 84);

      ctx.textAlign = "right";
      ctx.font = "22px system-ui, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(p.sub, cardX + cardW - 35, y + 68);
    });

    // Footer
    ctx.textAlign = "center";
    ctx.font = "26px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`Power Color: ${chart.recommendations.luckyColor}   •   Lucky Number: ${chart.recommendations.luckyNumber}   •   Auspicious: ${chart.recommendations.luckyDirection}`, 540, 1630);

    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillStyle = "#4ade80";
    ctx.fillText("🛡️ 100% Free Forever  •  Zero ₹699 Subscriptions  •  Client-Side Private", 540, 1750);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Cast your sacred chart instantly at jyoti.ai", 540, 1800);

    return canvas.toDataURL("image/png");
  }

  // 2. Viral Soulmate Story Card (Instagram / WhatsApp format)
  static generateSoulmateCard(chart, soul) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Romantic Cosmic Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, "#12081f");
    bgGradient.addColorStop(0.35, "#2b0d38");
    bgGradient.addColorStop(0.75, "#150921");
    bgGradient.addColorStop(1, "#07040d");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Glowing Rose-Gold Aura
    ctx.save();
    const auraGradient = ctx.createRadialGradient(540, 700, 80, 540, 700, 600);
    auraGradient.addColorStop(0, "rgba(244, 63, 94, 0.35)");
    auraGradient.addColorStop(0.5, "rgba(244, 196, 83, 0.2)");
    auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(540, 700, 600, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sacred Ring
    ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(540, 700, 380, 0, Math.PI * 2);
    ctx.stroke();

    // Top Header
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("💍  J Y O T I   A I", 540, 180);

    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#f472b6";
    ctx.letterSpacing = "4px";
    ctx.fillText("VEDIC SOULMATE BLUEPRINT", 540, 230);

    // User's Name
    ctx.font = "bold 80px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(chart.user.name, 540, 480);

    ctx.font = "30px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Your Destined Partner is:", 540, 550);

    // Soulmate Archetype Banner
    ctx.font = "italic bold 58px serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`"${soul.archetype.title}"`, 540, 650);

    ctx.font = "32px system-ui, sans-serif";
    ctx.fillStyle = "#fbcfe8";
    ctx.fillText(`7th House in ${chart.houses[7].rashi.english} (${chart.houses[7].rashi.name})`, 540, 720);

    // 4 Core Highlight Cards
    const cards = [
      { title: "DESTINED MARRIAGE WINDOW", val: soul.favorableAge, sub: `Peak Astrological Timing: ${soul.yearWindow}`, color: "#f4c453" },
      { title: "SPOUSE'S NAME FIRST LETTER", val: soul.probableLetters.join("  •  "), sub: "Primary Celestial Syllables", color: "#c084fc" },
      { title: "CONNECTION DYNAMIC", val: `${soul.marriageType}`, sub: `Love: ${soul.lovePercentage}%  •  Arranged: ${soul.arrangedPercentage}%`, color: "#60a5fa" },
      { title: "MEETING DIRECTION", val: soul.meetingDirection, sub: "From your birth sanctuary", color: "#34d399" }
    ];

    let startY = 860;
    cards.forEach((c, idx) => {
      const cardX = 120;
      const cardW = 840;
      const cardH = 150;
      const y = startY + (idx * 175);

      ctx.fillStyle = "rgba(20, 10, 35, 0.8)";
      ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(cardX, y, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillStyle = c.color;
      ctx.fillText(c.title, 540, y + 42);

      ctx.font = "bold 44px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(c.val, 540, y + 92);

      ctx.font = "22px system-ui, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(c.sub, 540, y + 130);
    });

    // Viral Footer
    ctx.textAlign = "center";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillStyle = "#4ade80";
    ctx.fillText("🛡️ 100% Free Forever  •  Zero Subscriptions  •  Client-Side Private", 540, 1680);

    ctx.font = "26px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Discover your soulmate instantly at jyoti.ai", 540, 1740);

    return canvas.toDataURL("image/png");
  }

  static downloadCard(chart, archetype) {
    const dataUrl = this.generateCard(chart, archetype);
    const link = document.createElement("a");
    link.download = `${chart.user.name.replace(/\s+/g, '_')}_Cosmic_Passport.png`;
    link.href = dataUrl;
    link.click();
  }

  static downloadSoulmateCard(chart, soul) {
    const dataUrl = this.generateSoulmateCard(chart, soul);
    const link = document.createElement("a");
    link.download = `${chart.user.name.replace(/\s+/g, '_')}_Soulmate_Blueprint.png`;
    link.href = dataUrl;
    link.click();
  }
}
