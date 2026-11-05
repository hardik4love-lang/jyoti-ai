/**
 * Jyoti AI - Comprehensive Multi-Page Kundli PDF Report Generator
 * Pure client-side printable Vedic Janam Kundli report.
 * Zero external libraries, works offline, 100% free.
 */

import { generateNorthIndianSvg, generateSouthIndianSvg } from './chart-renderer.js';
import { GemstoneEngine } from './gemstone-engine.js';

export class ReportGenerator {
  /**
   * Generates printable HTML string for the active chart
   */
  static generateReportHtml(chart) {
    if (!chart) return "";

    const user = chart.user || {};
    const lagna = chart.lagna || {};
    const moon = chart.moonSign || {};
    const nakshatra = chart.nakshatra || {};
    const dasha = chart.dasha || {};
    const doshas = chart.doshas || {};
    const planets = chart.planets || {};

    // Get Gemstone Recommendations
    const gemstones = GemstoneEngine.getGemstonePrescriptions(chart);

    // Generate SVGs
    const d1NorthSvg = generateNorthIndianSvg(chart, "D1");
    const d9NorthSvg = generateNorthIndianSvg(chart, "D9");

    // Planet rows
    const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const planetRows = planetOrder.map(pName => {
      const p = planets[pName];
      if (!p) return "";
      const degStr = `${Math.floor(p.degreeInSign)}° ${Math.round((p.degreeInSign % 1) * 60)}'`;
      return `
        <tr>
          <td><strong>${p.sanskrit} (${p.english})</strong></td>
          <td>${p.signName}</td>
          <td>${degStr}</td>
          <td>${p.nakshatra} (P${p.pada})</td>
          <td>${p.house}th House</td>
          <td><span class="badge ${p.isRetrograde ? 'retro' : 'direct'}">${p.isRetrograde ? 'Retrograde (R)' : 'Direct'}</span></td>
        </tr>
      `;
    }).join("");

    return `
      <div class="kundli-report-container">
        <!-- Page 1: Header & Vital Planetary Identity -->
        <div class="report-header">
          <div class="report-brand">
            <span class="report-om">ॐ</span>
            <div>
              <h1 class="report-title">JYOTI AI • SACRED JANAM KUNDLI</h1>
              <p class="report-subtitle">Vedic Horoscopic & Astro-Mathematical Ephemeris Analysis (Lahiri Ayanamsha)</p>
            </div>
          </div>
          <div class="report-stamp">
            100% PRIVATE • VERIFIED EPHEMERIS
          </div>
        </div>

        <!-- Native Details Card -->
        <div class="report-section native-details-box">
          <table class="report-table-compact">
            <tr>
              <td><strong>Native Name:</strong> ${user.name || "Seeker"}</td>
              <td><strong>Gender:</strong> ${user.gender || "Not specified"}</td>
              <td><strong>Birth Date:</strong> ${user.dob || "—"}</td>
            </tr>
            <tr>
              <td><strong>Birth Time:</strong> ${user.tob || "—"}</td>
              <td><strong>Birth Location:</strong> Lat: ${user.lat?.toFixed(4) || "—"}, Lon: ${user.lon?.toFixed(4) || "—"}</td>
              <td><strong>Timezone:</strong> GMT +${user.timezone || 5.5}</td>
            </tr>
            <tr>
              <td><strong>Ascendant (Lagna):</strong> ${lagna.english} (${lagna.sign})</td>
              <td><strong>Moon Sign (Rashi):</strong> ${moon.english} (${moon.sign})</td>
              <td><strong>Janma Nakshatra:</strong> ${nakshatra.name} (Pada ${nakshatra.pada})</td>
            </tr>
          </table>
        </div>

        <!-- Dual Chart Section: D-1 Rashi & D-9 Navamsha -->
        <div class="report-section">
          <h2 class="section-title">Sacred Kundli Charts (D-1 Rashi & D-9 Navamsha)</h2>
          <div class="dual-chart-row">
            <div class="chart-col">
              <h3 class="chart-subheading">D-1 Rashi Chakra (Physical Manifestation)</h3>
              <div class="chart-print-svg">${d1NorthSvg}</div>
            </div>
            <div class="chart-col">
              <h3 class="chart-subheading">D-9 Navamsha Chakra (Spiritual & Marital Destiny)</h3>
              <div class="chart-print-svg">${d9NorthSvg}</div>
            </div>
          </div>
        </div>

        <!-- Planetary Positions Table -->
        <div class="report-section">
          <h2 class="section-title">Planetary Coordinate Matrix (Graha Sphuta)</h2>
          <table class="report-data-table">
            <thead>
              <tr>
                <th>Celestial Graha</th>
                <th>Zodiac Sign</th>
                <th>Degree in Sign</th>
                <th>Nakshatra & Pada</th>
                <th>Bhava (House)</th>
                <th>Motion</th>
              </tr>
            </thead>
            <tbody>
              ${planetRows}
            </tbody>
          </table>
        </div>

        <!-- Vimshottari Mahadasha Timeline & Dosha Analysis -->
        <div class="report-section page-break-before">
          <h2 class="section-title">Vimshottari Dasha & Dosha Diagnosis</h2>
          <div class="report-grid-2">
            <div class="report-card">
              <h3>Vimshottari Dasha State</h3>
              <p><strong>Active Mahadasha:</strong> ${dasha.current?.mahadasha || "—"}</p>
              <p><strong>Active Antardasha:</strong> ${dasha.current?.antardasha || "—"}</p>
              <p class="report-tip">The active dasha reflects the primary planetary frequency currently presiding over karmic lessons, life focus, and life events.</p>
            </div>
            <div class="report-card">
              <h3>Dosha Diagnostic Analysis</h3>
              <p><strong>Manglik Dosha (Kuja Dosha):</strong> ${doshas.manglik?.intensity || "None"}</p>
              <p><strong>Manglik Details:</strong> ${doshas.manglik?.details || "No significant Mars affliction detected."}</p>
              <p><strong>Shani Sade Sati:</strong> ${doshas.sadeSati?.active ? doshas.sadeSati.phase : "Inactive"}</p>
              <p><strong>Sade Sati Details:</strong> ${doshas.sadeSati?.details || "Saturn is currently transiting peacefully relative to natal Moon."}</p>
            </div>
          </div>
        </div>

        <!-- Gemstone & Classical Remedial Guidance -->
        <div class="report-section">
          <h2 class="section-title">Parashara Gemstone & Upaya Prescriptions</h2>
          <div class="gemstone-report-grid">
            <div class="gem-box">
              <span class="gem-badge">LIFE STONE (JEEVAN RATNA)</span>
              <h4>${gemstones.lifeStone?.gem || "Natural Gem"}</h4>
              <p><strong>Lord:</strong> ${gemstones.lifeStone?.planet || "Lagna Lord"} | <strong>Finger:</strong> ${gemstones.lifeStone?.finger || "Ring Finger"}</p>
              <p class="gem-desc">${gemstones.lifeStone?.benefits || "Strengthens vitality, longevity, and personality aura."}</p>
            </div>
            <div class="gem-box">
              <span class="gem-badge">FORTUNE STONE (BHAGYA RATNA)</span>
              <h4>${gemstones.fortuneStone?.gem || "Fortune Gem"}</h4>
              <p><strong>Lord:</strong> ${gemstones.fortuneStone?.planet || "9th Lord"} | <strong>Finger:</strong> ${gemstones.fortuneStone?.finger || "Index Finger"}</p>
              <p class="gem-desc">${gemstones.fortuneStone?.benefits || "Amplifies divine grace, spiritual evolution, and luck."}</p>
            </div>
            <div class="gem-box">
              <span class="gem-badge">WISDOM STONE (VIDYA RATNA)</span>
              <h4>${gemstones.wisdomStone?.gem || "Wisdom Gem"}</h4>
              <p><strong>Lord:</strong> ${gemstones.wisdomStone?.planet || "5th Lord"} | <strong>Finger:</strong> ${gemstones.wisdomStone?.finger || "Little / Ring Finger"}</p>
              <p class="gem-desc">${gemstones.wisdomStone?.benefits || "Enhances intellect, creative intuition, and memory."}</p>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="report-footer">
          <p>Generated by Jyoti AI (Reva-Zero) • 100% Free, Private, and Anti-Scam Vedic Guidance</p>
          <p>No UPI debits • No recurring subscriptions • Mathematical Vedic Ephemeris</p>
        </div>
      </div>
    `;
  }

  /**
   * Opens print dialog for the report
   */
  static printKundli(chart) {
    if (!chart) {
      alert("Please cast your Kundli first before printing your report.");
      return;
    }

    // Open a clean print window
    const printWindow = window.open("", "_blank", "width=900,height=1000");
    if (!printWindow) {
      alert("Please allow popups to download/print your Kundli PDF report.");
      return;
    }

    const reportContent = this.generateReportHtml(chart);

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Jyoti AI - Sacred Kundli Report - ${chart.user?.name || "Seeker"}</title>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { background: #fff; color: #1e293b; padding: 24px; line-height: 1.5; font-size: 13px; }
          .kundli-report-container { max-width: 820px; margin: 0 auto; }
          .report-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b45309; padding-bottom: 12px; margin-bottom: 16px; }
          .report-brand { display: flex; align-items: center; gap: 12px; }
          .report-om { font-size: 32px; font-weight: bold; color: #b45309; }
          .report-title { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: 0.05em; }
          .report-subtitle { font-size: 11px; color: #64748b; }
          .report-stamp { font-size: 10px; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #10b981; padding: 4px 8px; border-radius: 4px; }
          
          .report-section { margin-bottom: 18px; }
          .section-title { font-size: 14px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
          
          .report-table-compact { width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; }
          .report-table-compact td { padding: 8px 12px; border: 1px solid #e2e8f0; }
          
          .dual-chart-row { display: flex; gap: 16px; justify-content: space-between; }
          .chart-col { flex: 1; text-align: center; }
          .chart-subheading { font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #475569; }
          .chart-print-svg { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; background: #fafafa; }
          .chart-print-svg svg { width: 100%; height: 260px; }
          
          .report-data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 6px; }
          .report-data-table th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-weight: 700; color: #334155; border: 1px solid #cbd5e1; }
          .report-data-table td { padding: 6px 10px; border: 1px solid #e2e8f0; }
          .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; }
          .badge.direct { background: #f0fdf4; color: #15803d; }
          .badge.retro { background: #fef2f2; color: #b91c1c; }
          
          .report-grid-2 { display: flex; gap: 14px; }
          .report-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 12px; }
          .report-card h3 { font-size: 13px; color: #b45309; margin-bottom: 8px; }
          .report-card p { margin-bottom: 4px; }
          .report-tip { margin-top: 8px; font-size: 11px; color: #64748b; font-style: italic; }
          
          .gemstone-report-grid { display: flex; gap: 12px; }
          .gem-box { flex: 1; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 10px; }
          .gem-badge { font-size: 9px; font-weight: 800; color: #92400e; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
          .gem-box h4 { font-size: 13px; color: #78350f; margin-bottom: 4px; }
          .gem-desc { font-size: 11px; color: #451a03; margin-top: 4px; }
          
          .report-footer { margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 12px; text-align: center; font-size: 11px; color: #94a3b8; }
          
          @media print {
            body { padding: 0; }
            .page-break-before { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        ${reportContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}
