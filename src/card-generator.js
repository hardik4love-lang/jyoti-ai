/**
 * Jyoti AI - Viral Cosmic Identity Card Generator (HTML5 Canvas)
 * Exports high-resolution, aesthetic 9:16 Instagram Story & WhatsApp cards
 * 100% client-side with 0 server compute cost.
 */

export class CosmicCardGenerator {
  static generateCard(chart, archetype = "The Cosmic Alchemist") {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // 1. Cosmic Luxury Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, "#080914");
    bgGradient.addColorStop(0.4, "#13142e");
    bgGradient.addColorStop(0.8, "#0a0b18");
    bgGradient.addColorStop(1, "#05060b");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Celestial Glowing Rings (Aura)
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

    // 3. Top Branding
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 180);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.letterSpacing = "6px";
    ctx.fillText("PERSONAL SACRED COSMIC PASSPORT", 540, 230);

    // 4. Center Name & Archetype
    ctx.font = "bold 88px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(chart.user.name, 540, 580);

    ctx.font = "italic 46px serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`"${archetype}"`, 540, 660);

    // 5. Center Sacred Om Emblem
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

    // 6. Astrological Placements Pillar Badges
    const pillars = [
      { label: "ASCENDANT (LAGNA)", val: `${chart.lagna.english} (${chart.lagna.sign})`, sub: `Lord: ${chart.lagna.lord} • ${chart.lagna.element}` },
      { label: "MOON SIGN (CHANDRA)", val: `${chart.moonSign.english} (${chart.moonSign.sign})`, sub: `Inner Psyche & Emotion` },
      { label: "JANMA NAKSHATRA", val: `${chart.nakshatra.name} (Pada ${chart.nakshatra.pada})`, sub: `Deity: ${chart.nakshatra.deity}` },
      { label: "ACTIVE DASHA CYCLE", val: `${chart.dasha.current.mahadasha} - ${chart.dasha.current.antardasha}`, sub: `Vimshottari Timeline` }
    ];

    let startY = 1000;
    pillars.forEach((p, idx) => {
      // Pill card
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

      // Text inside pill
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

    // 7. Footer Vibrations
    ctx.textAlign = "center";
    ctx.font = "26px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(`Power Color: ${chart.recommendations.luckyColor}   •   Lucky Number: ${chart.recommendations.luckyNumber}   •   Auspicious: ${chart.recommendations.luckyDirection}`, 540, 1630);

    // 8. Viral Social Watermark & Contrast
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.fillStyle = "#4ade80";
    ctx.fillText("🛡️ 100% Free Forever  •  Zero ₹699 Subscriptions  •  Client-Side Private", 540, 1750);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Cast your sacred chart instantly at jyoti.ai", 540, 1800);

    return canvas.toDataURL("image/png");
  }

  static downloadCard(chart, archetype) {
    const dataUrl = this.generateCard(chart, archetype);
    const link = document.createElement("a");
    link.download = `${chart.user.name.replace(/\s+/g, '_')}_Cosmic_Passport.png`;
    link.href = dataUrl;
    link.click();
  }
}
