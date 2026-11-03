/**
 * Jyoti AI - Astrological Intelligence & Conversational Service
 * Dual Mode:
 *   1. Local Jyotish Reasoning Engine (100% Free, Works Offline, Zero API Key needed)
 *   2. Cloud LLM Mode (Google Gemini Free Tier / Groq Llama 3)
 */

export class AIService {
  constructor() {
    const isBrowser = typeof localStorage !== "undefined";
    this.geminiApiKey = isBrowser ? (localStorage.getItem("jyoti_gemini_key") || "") : "";
    this.groqApiKey = isBrowser ? (localStorage.getItem("jyoti_groq_key") || "") : "";
    this.preferredProvider = isBrowser ? (localStorage.getItem("jyoti_provider") || "local") : "local";
    this.personaMode = isBrowser ? (localStorage.getItem("jyoti_persona") || "gentle") : "gentle"; // 'gentle' or 'roast'
  }

  setPersonaMode(mode) {
    this.personaMode = mode;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("jyoti_persona", mode);
    }
  }

  setCredentials({ provider, geminiKey, groqKey, persona }) {
    const isBrowser = typeof localStorage !== "undefined";
    if (persona) {
      this.personaMode = persona;
      if (isBrowser) localStorage.setItem("jyoti_persona", persona);
    }
    if (provider) {
      this.preferredProvider = provider;
      if (isBrowser) localStorage.setItem("jyoti_provider", provider);
    }
    if (geminiKey !== undefined) {
      this.geminiApiKey = geminiKey.trim();
      if (isBrowser) localStorage.setItem("jyoti_gemini_key", this.geminiApiKey);
    }
    if (groqKey !== undefined) {
      this.groqApiKey = groqKey.trim();
      if (isBrowser) localStorage.setItem("jyoti_groq_key", this.groqApiKey);
    }
  }

  getCredentials() {
    return {
      provider: this.preferredProvider,
      hasGemini: !!this.geminiApiKey,
      hasGroq: !!this.groqApiKey
    };
  }

  // Build the complete contextual Jyotish prompt payload
  buildSystemPrompt(chart) {
    const planetList = chart.planets
      .map(p => `• ${p.name}: House ${p.house} (${p.englishRashi} / ${p.rashi} at ${p.degreeInSign})`)
      .join("\n");

    return `You are "Jyoti" — a wise, empathetic, and deeply learned Vedic Astrologer (Jyotishi).
You offer authentic insights rooted in classical Parashara Jyotish combined with compassionate life counseling.

USER PROFILE & VERIFIED BIRTH CHART:
- Name: ${chart.user.name} (${chart.user.gender})
- Date of Birth: ${chart.user.dob} at ${chart.user.tob}
- Ascendant (Lagna): ${chart.lagna.sign} (${chart.lagna.english}) at ${chart.lagna.degree}°, Lord: ${chart.lagna.lord}, Element: ${chart.lagna.element}
- Moon Sign (Chandra Rashi): ${chart.moonSign.sign} (${chart.moonSign.english}), Lord: ${chart.moonSign.lord}
- Nakshatra: ${chart.nakshatra.name} (Pada ${chart.nakshatra.pada}), Ruled by ${chart.nakshatra.lord}, Deity: ${chart.nakshatra.deity}
- Sun Sign: ${chart.sunSign.sign} (${chart.sunSign.english})
- Active Vimshottari Mahadasha: ${chart.dasha.current.mahadasha} | Active Antardasha: ${chart.dasha.current.antardasha} (Cycle ends ~${chart.dasha.current.endsAt})
- Manglik Status: ${chart.doshas.manglik.intensity} (${chart.doshas.manglik.explanation})
- Saturn Sade Sati: ${chart.doshas.sadeSati.phase} (${chart.doshas.sadeSati.remedy})
- Lucky Colors: ${chart.recommendations.luckyColor} | Lucky Number: ${chart.recommendations.luckyNumber} | Auspicious Direction: ${chart.recommendations.luckyDirection}

PLANETARY PLACEMENTS (12 HOUSES):
${planetList}

CORE PRINCIPLES:
1. ALWAYS reference the user's specific Lagna, active Mahadasha (${chart.dasha.current.mahadasha}), and relevant houses (e.g. 10th for Career, 7th for Relationships, 2nd/11th for Wealth, 6th/8th for Health).
2. Maintain a warm, encouraging, elder-like tone. Use gentle Hindi/Sanskrit terms naturally (Kundli, Dasha, Graha, Bhava, Karma, Upaya).
3. Always offer empowering, constructive remedies (Sattvic habits, meditation, charity/daan, mantras, discipline).
4. Strictly avoid fear-mongering, fatalistic predictions, or false promises. Keep advice practical and ethical.`;
  }

  // Master method to get response
  async askQuestion(userMessage, chart, conversationHistory = []) {
    // If user configured Cloud LLM and keys exist, use them
    if (this.preferredProvider === "gemini" && this.geminiApiKey) {
      try {
        return await this.callGemini(userMessage, chart, conversationHistory);
      } catch (err) {
        console.warn("Gemini call failed, falling back to local Jyotish engine:", err);
      }
    } else if (this.preferredProvider === "groq" && this.groqApiKey) {
      try {
        return await this.callGroq(userMessage, chart, conversationHistory);
      } catch (err) {
        console.warn("Groq call failed, falling back to local Jyotish engine:", err);
      }
    }

    // Default: High-fidelity Local Jyotish Reasoning Engine (100% Free & Offline)
    return this.runLocalJyotishEngine(userMessage, chart);
  }

  // Google Gemini Free Tier API Call
  async callGemini(userMessage, chart, conversationHistory) {
    const systemPrompt = this.buildSystemPrompt(chart);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;

    // Format chat history
    const contents = [
      { role: "user", parts: [{ text: systemPrompt + "\n\nPlease introduce yourself briefly to the native and invite them to ask their question." }] },
      { role: "model", parts: [{ text: `Namaste ${chart.user.name} ji! 🙏 I have analyzed your Kundli with your ${chart.lagna.english} Lagna and ${chart.nakshatra.name} Nakshatra. Under your current ${chart.dasha.current.mahadasha}-${chart.dasha.current.antardasha} dasha, I am here to guide you with complete clarity. How may I assist your life path today?` }] }
    ];

    conversationHistory.slice(-6).forEach(msg => {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      });
    });

    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 900
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Groq Cloud Free Tier API Call
  async callGroq(userMessage, chart, conversationHistory) {
    const systemPrompt = this.buildSystemPrompt(chart);
    const messages = [
      { role: "system", content: systemPrompt }
    ];

    conversationHistory.slice(-6).forEach(msg => {
      messages.push({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      });
    });

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 850
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Local Offline Vedic Jyotish Knowledge Engine (Deterministic & Free)
  runLocalJyotishEngine(query, chart) {
    const q = query.toLowerCase();
    const lagna = chart.lagna;
    const moon = chart.moonSign;
    const nakshatra = chart.nakshatra;
    const dasha = chart.dasha.current;
    const name = chart.user.name;

    // IF IN ROAST MODE: Deliver witty, razor-sharp, relatable Co-Star style cosmic truth!
    if (this.personaMode === "roast") {
      if (q.includes("career") || q.includes("job") || q.includes("work")) {
        return `### 🔥 Cosmic Roast: Career Edition for ${name}

Let’s be brutally honest: with **${lagna.english} Lagna**, your primary career obstacle isn't your resume—it's your tendency to overthink decisions for 3 weeks and then make an impulsive choice in 3 seconds.

1. **The Hard Reality:**
   • Your 10th house is governed by **${chart.houses[10].rashi.lord}**. You want the CEO title and freedom, but you secretly resent meetings before 11 AM.
   • Under **${dasha.mahadasha} Mahadasha**, blaming bad office politics won’t work. The stars are forcing you to finish the projects you started 6 months ago.
2. **The Unfiltered Upaya:**
   • Stop tweaking your LinkedIn bio. Close the 42 open browser tabs and execute one hard task today.`;
      }

      if (q.includes("love") || q.includes("marriage") || q.includes("relationship") || q.includes("partner")) {
        return `### 💔 Cosmic Roast: Love & Relationship Edition for ${name}

Let’s unpack your Kalatra Bhava (7th House in **${chart.houses[7].rashi.english}**):

1. **Why You’re Complicated:**
   • You claim you want peace and stability, but your **${nakshatra.name} Moon** gets bored the second someone actually treats you nicely and communicates like a mature adult.
   • ${chart.doshas.manglik.intensity !== "None" ? `You have **${chart.doshas.manglik.intensity} Manglik energy**, meaning you view minor disagreements as Shakespearean dramas.` : "You don't have Manglik dosha, so you can't blame Mars when you leave people on read for 48 hours."}
2. **The Fix:**
   • Lower your emotional fortress by 10%. They can't read your mind, even if you think the stars told them to.`;
      }

      if (q.includes("wealth") || q.includes("money") || q.includes("finance")) {
        return `### 💸 Cosmic Roast: Money Edition for ${name}

Your 2nd house of savings is in **${chart.houses[2].rashi.english}**, and your bank account is judging you:

1. **Financial Truth:**
   • Retail therapy is not a Vedic remedy. Under **${dasha.mahadasha} Mahadasha**, treating yourself after a mildly stressful Tuesday is why your savings aren't compounding.
2. **The Fix:**
   • Put that money into an index fund or gold bond instead of ordering food at midnight. Your future self will thank Saturn.`;
      }

      return `### ⚡ Unfiltered Cosmic Assessment for ${name}

Welcome to your reality check. You are an **${lagna.english} Lagna** with Moon in **${nakshatra.name}**:

• **The Vibe:** You carry yourself like you have everything figured out, but inside you're operating on pure intuition, caffeine, and celestial spite.
• **Your Superpower:** Uncanny ability to read a room in 5 seconds and predict catastrophe before it happens.
• **Your Fatal Flaw:** Forgetting to live in the present because you're already calculating what will happen in your next Dasha.

Ask me about your **Career**, **Love**, or **Finances** if you can handle the unvarnished cosmic truth!`;
    }

    // GENTLE SAGE MODE (Classical, warm, uplifting Parashari guidance)
    // 1. Career / Job / Profession / Business
    if (q.includes("career") || q.includes("job") || q.includes("profession") || q.includes("business") || q.includes("work") || q.includes("promotion")) {
      const h10 = chart.houses[10];
      const h10Planets = h10.planets.length > 0 ? h10.planets.join(", ") : "no direct malefic influences";
      return `### 🌟 Career & Professional Insights for ${name}

Based on your **${lagna.english} (${lagna.sign}) Lagna**, your 10th house of profession (Karma Bhava) falls in **${h10.rashi.english}**, ruled by **${h10.rashi.lord}**.

1. **Current Influences:**
   • House 10 is currently occupied by: **${h10Planets}**.
   • You are operating under the **${dasha.mahadasha} Mahadasha** and **${dasha.antardasha} Antardasha**. The energy of ${dasha.mahadasha} stimulates deliberate strategic ambition, meaning shortcuts will not yield results, but systematic mastery will bring recognition.
   
2. **Key Career Strengths:**
   • With ${lagna.sign} Ascendant, you naturally excel in roles requiring ${lagna.element === 'Fire' ? 'leadership, swift decision-making, and execution' : lagna.element === 'Earth' ? 'practical planning, operations, and financial acumen' : lagna.element === 'Air' ? 'communication, technology, networking, and creative ideation' : 'emotional intuition, public dealing, counseling, and deep research'}.
   • Your Moon in **${nakshatra.name}** gives you mental resilience and a gift for problem-solving under pressure.

3. **Guidance for Progression:**
   • If considering a job switch or expansion, align your actions around **${lagna.lord}** and **${h10.rashi.lord}** energy. Avoid impulsive friction with superiors.
   • **Actionable Upaya (Remedy):** Wear clean, ironed clothes in ${chart.recommendations.luckyColor}. Maintain high ethical conduct in professional dealings and offer water to the rising Sun daily.`;
    }

    // 2. Love / Marriage / Relationships / Partner
    if (q.includes("love") || q.includes("marriage") || q.includes("partner") || q.includes("relationship") || q.includes("spouse") || q.includes("wedding")) {
      const h7 = chart.houses[7];
      const manglik = chart.doshas.manglik;
      const h7Planets = h7.planets.length > 0 ? h7.planets.join(", ") : "harmonious aspects";
      return `### 💖 Relationship & Marriage Horoscope for ${name}

In Vedic Astrology, the 7th house (Kalatra Bhava) governs marriage, partnerships, and lifelong companionship. For your **${lagna.english} Lagna**, your 7th house is **${h7.rashi.english}**, governed by **${h7.rashi.lord}**.

1. **Partnership Dynamics:**
   • Your 7th house houses: **${h7Planets}**. This denotes that you seek an intellectual and emotionally mature partner who respects your personal sovereignty.
   • **Manglik Dosha Check:** ${manglik.intensity === "None" ? "✅ **No significant Manglik Dosha** is present in your natal chart, ensuring ease of emotional harmony." : `⚠️ **${manglik.intensity} Manglik presence:** ${manglik.explanation}`}

2. **Dasha Impact on Relationships:**
   • The active **${dasha.mahadasha}-${dasha.antardasha}** period demands transparent communication. Do not let minor ego clashes simmer into misunderstandings.
   
3. **Recommended Timing & Remedies:**
   • Favorable connection periods activate when Venus or Jupiter transits your 1st, 5th, or 7th houses.
   • **Astrological Upaya:** Cultivate mutual respect; honor partnerships on Fridays (associated with Venus). Practice gratitude and avoid harsh words during emotional discussions.`;
    }

    // 3. Wealth / Money / Finance
    if (q.includes("wealth") || q.includes("money") || q.includes("finance") || q.includes("investment") || q.includes("financial")) {
      const h2 = chart.houses[2];
      const h11 = chart.houses[11];
      return `### 💰 Wealth, Savings & Prosperity Analysis for ${name}

Financial prosperity in Jyotish is gauged through the **2nd house** (accumulated wealth & Dhana) and the **11th house** (gains, income & Labha).

1. **Dhana Bhavas Breakdown:**
   • **2nd House of Savings:** Governed by **${h2.rashi.lord}** in **${h2.rashi.english}**.
   • **11th House of Inflow & Profits:** Governed by **${h11.rashi.lord}** in **${h11.rashi.english}**.
   
2. **Current Financial Cycle:**
   • Under **${dasha.mahadasha} Mahadasha**, steady compounding and diversified investments will outperform speculative gambles. Avoid high-risk leveraged trading if Rahu or Ketu afflict your Dhana houses.
   
3. **Remedy for Abundance:**
   • Your favorable numerological vibration is **${chart.recommendations.luckyNumber}**.
   • **Upaya:** Donate green lentils or grains to cows or those in need on Wednesdays/Thursdays. Keep your north-east financial corner clutter-free.`;
    }

    // 4. Health / Wellness
    if (q.includes("health") || q.includes("wellness") || q.includes("mental") || q.includes("stress") || q.includes("disease")) {
      const sadeSati = chart.doshas.sadeSati;
      return `### 🌿 Health & Vitality Guidance for ${name}

Your physical vitality is determined by your **Lagna lord (${lagna.lord})** and the planetary state of the **6th house (Roga Bhava)**.

1. **Planetary Constitution:**
   • With a **${lagna.element}** predominant constitution, you should watch out for ${lagna.element === 'Fire' ? 'excess body heat, acidity, and burnout from overwork' : lagna.element === 'Earth' ? 'digestive sluggishness, metabolism balance, and stiffness' : lagna.element === 'Air' ? 'nervous anxiety, irregular sleep patterns, and restlessness' : 'water retention, emotional stress cycles, and respiratory sensitivities'}.
   • **Sade Sati Status:** ${sadeSati.active ? `⚠️ Active (${sadeSati.phase}) — prioritize nervous system calm, grounding walks in nature, and regular sleep rhythms.` : "✅ No active Sade Sati pressure on your mental serenity."}

2. **Remedies for Longevity & Vitality:**
   • Practice 10 minutes of Pranayama (Anulom Vilom) in your auspicious direction (**${chart.recommendations.luckyDirection}**).
   • Stay hydrated and incorporate warm herbal infusions (tulsi, ginger, turmeric).`;
    }

    // 5. General Kundli Reading / Overview / Introduction
    return `### 🙏 Vedic Kundli Reading for ${name}

Namaste! Here is the foundational astrological synthesis of your birth chart based on classical **Parashari Jyotish**:

• **Ascendant (Lagna):** **${lagna.english} (${lagna.sign})** at ${lagna.degree}° — Governed by **${lagna.lord}** (${lagna.element} Element). This bestows you with strong character, innate resilience, and an authentic inner compass.
• **Chandra Rashi (Moon Sign):** **${moon.english} (${moon.sign})** — Represents your internal emotional nature and intuitive perception.
• **Janma Nakshatra:** **${nakshatra.name} (Pada ${nakshatra.pada})** — Presided over by the celestial deity **${nakshatra.deity}** and ruled by **${nakshatra.lord}**.
• **Active Vimshottari Dasha:** You are currently traversing the **${dasha.mahadasha} Mahadasha** and **${dasha.antardasha} Antardasha** (influencing your path until ~${dasha.endsAt}).
• **Planetary Balances:**
  - Manglik: ${chart.doshas.manglik.intensity}
  - Sade Sati: ${chart.doshas.sadeSati.phase}

**Favorable Vibrations:**
• **Lucky Color:** ${chart.recommendations.luckyColor}
• **Lucky Number:** ${chart.recommendations.luckyNumber}
• **Auspicious Direction:** ${chart.recommendations.luckyDirection}

Feel free to ask me specific questions regarding your **Career**, **Marriage & Love**, **Finances**, **Health**, or **Remedies**!`;
  }
}
