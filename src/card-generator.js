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

    // Luxury Editorial Footer
    ctx.textAlign = "center";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.letterSpacing = "4px";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 1680);

    ctx.font = "22px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.letterSpacing = "2px";
    ctx.fillText("SACRED SIDEREAL MATHEMATICS  •  hardik4love-lang.github.io/jyoti-ai", 540, 1730);

    return canvas.toDataURL("image/png");
  }

  // 3. Cosmic Red Flag & Unfiltered Roast Receipt Card (9:16)
  static generateRedFlagCard(chart, audit) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Obsidian Space Black Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, "#030408");
    bgGradient.addColorStop(0.5, "#0b0c16");
    bgGradient.addColorStop(1, "#020306");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Crimson & Violet Warning Halo
    ctx.save();
    const halo = ctx.createRadialGradient(540, 480, 40, 540, 480, 500);
    halo.addColorStop(0, "rgba(244, 63, 94, 0.28)");
    halo.addColorStop(0.6, "rgba(168, 85, 247, 0.12)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(540, 480, 500, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Top Header Badge
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("🚩  C O S M I C   R E D   F L A G S", 540, 170);

    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.letterSpacing = "6px";
    ctx.fillText("UNFILTERED NATAL PSYCHOLOGY AUDIT", 540, 220);

    // User Name & Moon Rashi
    ctx.font = "bold 72px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(chart.user.name, 540, 360);

    ctx.font = "italic bold 36px serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`"${audit.archetype}"`, 540, 420);

    ctx.font = "26px system-ui, sans-serif";
    ctx.fillStyle = "#fda4af";
    ctx.fillText(`Chandra in ${chart.moonSign.english}  •  Lagna in ${chart.lagna?.english || "Aries"}`, 540, 470);

    // Render 3 Flag Boxes
    let y = 560;
    audit.flags.forEach((f, idx) => {
      ctx.fillStyle = "rgba(18, 20, 38, 0.85)";
      ctx.strokeStyle = idx === 0 ? "rgba(244, 63, 94, 0.45)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(100, y, 880, 260, 24);
      ctx.fill();
      ctx.stroke();

      // Category Pill
      ctx.textAlign = "left";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.fillStyle = idx === 0 ? "#f43f5e" : "#f59e0b";
      ctx.fillText(`● ${f.category} [${f.placement}]`, 140, y + 48);

      // Quote / Call-out text (auto wrap)
      ctx.font = "26px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#e2e8f0";
      const words = f.text.split(" ");
      let line = "";
      let lineY = y + 96;
      for (const w of words) {
        const testLine = line + w + " ";
        if (ctx.measureText(testLine).width > 800) {
          ctx.fillText(line, 140, lineY);
          line = w + " ";
          lineY += 38;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 140, lineY);

      y += 295;
    });

    // Brutal Verdict Footer Box
    ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
    ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, y + 10, 880, 150, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("CRITICAL KARMIC SUMMARY", 540, y + 55);

    ctx.font = "22px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Your chart proves you can advise everyone except yourself.", 540, y + 95);
    ctx.fillText("Stop romanticizing chaos.", 540, y + 130);

    // Luxury Watermark
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 1800);

    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Discover your cosmic red flags at hardik4love-lang.github.io/jyoti-ai", 540, 1845);

    return canvas.toDataURL("image/png");
  }

  // 4. 2-Player Dual Synastry Bond Card (9:16)
  static generateDualSynastryCard(chartA, chartB, matchResult) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Luxury Dark Gradient
    const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
    bg.addColorStop(0, "#080612");
    bg.addColorStop(0.5, "#150e28");
    bg.addColorStop(1, "#06040e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // Twin Flame Radial Glow
    ctx.save();
    const halo = ctx.createRadialGradient(540, 650, 60, 540, 650, 550);
    halo.addColorStop(0, "rgba(236, 72, 153, 0.35)");
    halo.addColorStop(0.5, "rgba(244, 196, 83, 0.2)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(540, 650, 550, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Top Header
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("💑  V E D I C   S Y N A S T R Y", 540, 170);

    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillStyle = "#f472b6";
    ctx.letterSpacing = "6px";
    ctx.fillText("2-PLAYER COSMIC BOND RECEIPT", 540, 220);

    // Couple Names Banner
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${chartA.user.name}  &  ${chartB.user.name}`, 540, 360);

    // Match Score Hero Circle
    const score = matchResult.totalPoints || 26;
    const pct = Math.round((score / 36) * 100);

    ctx.strokeStyle = "#f4c453";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(540, 580, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 76px system-ui, sans-serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`${score}`, 540, 590);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("OUT OF 36 GUNAS", 540, 635);

    // Status Label
    ctx.font = "italic bold 36px serif";
    ctx.fillStyle = "#fbcfe8";
    ctx.fillText(`"${matchResult.status || "Magnetic Karmic Resonance"}" (${pct}%)`, 540, 760);

    // 3 Synastry Breakdown Cards
    const cards = [
      { title: "WHO FALLS HARDER", val: `${chartA.user.name} Leads, ${chartB.user.name} Anchors`, sub: "5th & 7th House Venusian Aspect Balance", color: "#f472b6" },
      { title: "THE FATAL FRICTION", val: matchResult.nadiPoints === 0 ? "Genetic & Energetic Nadi Tension" : "Ego & Communication Timing Clashes", sub: "Where your shadow sides collide", color: "#f59e0b" },
      { title: "PAST LIFE BOND (KARMIC TIE)", val: "Soul Contract Synced", sub: "Rahu-Ketu Nodes cross-aspect personal Moon", color: "#38bdf8" }
    ];

    let startY = 850;
    cards.forEach((c, idx) => {
      const cardY = startY + (idx * 210);
      ctx.fillStyle = "rgba(22, 16, 42, 0.85)";
      ctx.strokeStyle = "rgba(236, 72, 153, 0.3)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(120, cardY, 840, 180, 24);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.fillStyle = c.color;
      ctx.fillText(c.title, 540, cardY + 45);

      ctx.font = "bold 34px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(c.val, 540, cardY + 98);

      ctx.font = "22px system-ui, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(c.sub, 540, cardY + 142);
    });

    // Luxury Watermark
    ctx.textAlign = "center";
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 1680);

    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Calculate your private crush compatibility at hardik4love-lang.github.io/jyoti-ai", 540, 1725);

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

  static downloadRedFlagCard(chart, audit) {
    const dataUrl = this.generateRedFlagCard(chart, audit);
    const link = document.createElement("a");
    link.download = `${chart.user.name.replace(/\s+/g, '_')}_Cosmic_Red_Flags.png`;
    link.href = dataUrl;
    link.click();
  }

  static downloadDualSynastryCard(chartA, chartB, matchResult) {
    const dataUrl = this.generateDualSynastryCard(chartA, chartB, matchResult);
    const link = document.createElement("a");
    link.download = `${chartA.user.name}_and_${chartB.user.name}_Synastry_Bond.png`;
    link.href = dataUrl;
    link.click();
  }

  // 5. Crush & Ex Truth Radar Card (9:16)
  static generateTruthRadarCard(truth) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    // Luxury Seductive Dark Gradient
    const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
    bg.addColorStop(0, "#08040f");
    bg.addColorStop(0.5, "#180a26");
    bg.addColorStop(1, "#05020a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // Rose & Violet Halo
    ctx.save();
    const halo = ctx.createRadialGradient(540, 600, 50, 540, 600, 500);
    halo.addColorStop(0, "rgba(244, 63, 94, 0.35)");
    halo.addColorStop(0.5, "rgba(168, 85, 247, 0.2)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(540, 600, 500, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Top Header
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("🔥  C R U S H   &   E X   R A D A R", 540, 170);

    ctx.font = "bold 24px system-ui, sans-serif";
    ctx.fillStyle = "#f472b6";
    ctx.letterSpacing = "6px";
    ctx.fillText("UNSPOKEN CHEMISTRY AUDIT", 540, 220);

    // Couple Names
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${truth.name1}  ⚡  ${truth.name2}`, 540, 360);

    // Score Circle
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(540, 560, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 76px system-ui, sans-serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText(`${truth.score}%`, 540, 575);

    ctx.font = "22px system-ui, sans-serif";
    ctx.fillStyle = "#fda4af";
    ctx.fillText("MAGNETISM INDEX", 540, 620);

    ctx.font = "italic bold 38px serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText(`"${truth.archetype}"`, 540, 740);

    // 3 Insight Boxes
    const boxes = [
      { cat: "WHO FALLS HARDER", text: truth.whoFallsText, color: "#f472b6" },
      { cat: "THE FATAL FRICTION", text: truth.fatalFriction, color: "#f59e0b" },
      { cat: "THE SECRET OBSESSION", text: truth.secretObsession, color: "#c084fc" }
    ];

    let startY = 830;
    boxes.forEach((b, idx) => {
      const boxY = startY + (idx * 220);
      ctx.fillStyle = "rgba(22, 14, 38, 0.85)";
      ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(110, boxY, 860, 190, 24);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.fillStyle = b.color;
      ctx.fillText(`● ${b.cat}`, 150, boxY + 45);

      ctx.font = "26px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#e2e8f0";
      const words = b.text.split(" ");
      let line = "";
      let lineY = boxY + 90;
      for (const w of words) {
        const testLine = line + w + " ";
        if (ctx.measureText(testLine).width > 780) {
          ctx.fillText(line, 150, lineY);
          line = w + " ";
          lineY += 36;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 150, lineY);
    });

    // Cosmic Verdict Footer
    ctx.fillStyle = "rgba(244, 196, 83, 0.12)";
    ctx.strokeStyle = "rgba(244, 196, 83, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(110, 1520, 860, 140, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillStyle = "#f4c453";
    ctx.fillText("COSMIC VERDICT", 540, 1565);

    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(truth.cosmicVerdict, 540, 1615);

    // Luxury Watermark
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "#ffdf7e";
    ctx.fillText("ॐ  J Y O T I   A I", 540, 1780);

    ctx.font = "20px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Audit your crush chemistry at hardik4love-lang.github.io/jyoti-ai", 540, 1825);

    return canvas.toDataURL("image/png");
  }

  static downloadTruthRadarCard(truth) {
    const dataUrl = this.generateTruthRadarCard(truth);
    const link = document.createElement("a");
    link.download = `${truth.name1}_and_${truth.name2}_Truth_Radar.png`;
    link.href = dataUrl;
    link.click();
  }
}
