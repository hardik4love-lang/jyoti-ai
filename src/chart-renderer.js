/**
 * Jyoti AI - High-Precision SVG Kundli Chart Renderer
 * Supports:
 *   1. Traditional North Indian Diamond Chart (Fixed Houses, Dynamic Signs)
 *   2. Traditional South Indian Square Chart (Fixed Signs, Dynamic Houses)
 *   3. Varga Charts: D-1 (Rashi) & D-9 (Navamsha)
 */

export class KundliChartRenderer {
  // Render North Indian Diamond Chart
  static renderNorthIndian(chart, varga = "D1") {
    const isNavamsha = varga === "D9" && chart.navamsha;
    const lagnaRashiId = isNavamsha ? chart.navamsha.lagna.id : chart.houses[1].rashi.id;

    // Center coordinates for labels of Houses 1 through 12
    const houseCoords = {
      1: { x: 200, y: 110, rashiX: 200, yRashi: 165 }, // Top diamond
      2: { x: 105, y: 55, rashiX: 130, yRashi: 75 },   // Top-left outer triangle
      3: { x: 55, y: 105, rashiX: 75, yRashi: 130 },   // Mid-left outer triangle
      4: { x: 110, y: 200, rashiX: 165, yRashi: 200 }, // Left diamond
      5: { x: 55, y: 295, rashiX: 75, yRashi: 270 },   // Lower-left triangle
      6: { x: 105, y: 345, rashiX: 130, yRashi: 325 }, // Bottom-left triangle
      7: { x: 200, y: 290, rashiX: 200, yRashi: 235 }, // Bottom diamond
      8: { x: 295, y: 345, rashiX: 270, yRashi: 325 }, // Bottom-right triangle
      9: { x: 345, y: 295, rashiX: 325, yRashi: 270 }, // Lower-right triangle
      10: { x: 290, y: 200, rashiX: 235, yRashi: 200 },// Right diamond
      11: { x: 345, y: 105, rashiX: 325, yRashi: 130 },// Upper-right triangle
      12: { x: 295, y: 55, rashiX: 270, yRashi: 75 }   // Top-right triangle
    };

    let houseContents = "";

    for (let h = 1; h <= 12; h++) {
      const coord = houseCoords[h];
      const rashiNum = ((lagnaRashiId + h - 2) % 12) + 1;

      let planetList = "";
      if (isNavamsha) {
        planetList = chart.navamsha.planets
          .filter(p => p.rashiId === rashiNum)
          .map(p => p.name.slice(0, 2).toUpperCase())
          .join(" ");
      } else {
        planetList = chart.houses[h].planets
          .map(p => p.slice(0, 2).toUpperCase())
          .join(" ");
      }

      houseContents += `
        <!-- House ${h} -->
        <g class="house-group" data-house="${h}" tabindex="0">
          <text x="${coord.rashiX}" y="${coord.yRashi}" text-anchor="middle" dominant-baseline="central" class="rashi-num">
            ${rashiNum}
          </text>
          <text x="${coord.x}" y="${coord.y}" text-anchor="middle" dominant-baseline="central" class="planet-badge">
            ${planetList || ""}
          </text>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 400 400" class="kundli-svg north-chart" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="North Indian Vedic Kundli Chart">
        <defs>
          <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14142b" />
            <stop offset="100%" stop-color="#0a0a18" />
          </linearGradient>
        </defs>

        <rect width="400" height="400" fill="url(#chartBg)" rx="16" />
        <rect x="15" y="15" width="370" height="370" class="chart-boundary" />
        <line x1="15" y1="15" x2="385" y2="385" class="chart-line" />
        <line x1="15" y1="385" x2="385" y2="15" class="chart-line" />
        <polygon points="200,15 385,200 200,385 15,200" class="chart-line kendra-polygon" />

        ${houseContents}

        <circle cx="200" cy="200" r="16" fill="#1b1735" stroke="#e0a943" stroke-width="1.5" />
        <text x="200" y="205" text-anchor="middle" dominant-baseline="central" fill="#ffdf7e" font-size="14" font-weight="bold">ॐ</text>
        <text x="200" y="375" text-anchor="middle" fill="#f4c453" font-size="9" letter-spacing="1.5">${isNavamsha ? "D-9 NAVAMSHA" : "D-1 RASHI"}</text>
      </svg>
    `;
  }

  // Render South Indian Square Chart
  static renderSouthIndian(chart, varga = "D1") {
    const isNavamsha = varga === "D9" && chart.navamsha;
    const southGrid = [
      { rashiId: 12, col: 0, row: 0 },
      { rashiId: 1,  col: 1, row: 0 },
      { rashiId: 2,  col: 2, row: 0 },
      { rashiId: 3,  col: 3, row: 0 },
      { rashiId: 11, col: 0, row: 1 },
      { rashiId: 4,  col: 3, row: 1 },
      { rashiId: 10, col: 0, row: 2 },
      { rashiId: 5,  col: 3, row: 2 },
      { rashiId: 9,  col: 0, row: 3 },
      { rashiId: 8,  col: 1, row: 3 },
      { rashiId: 7,  col: 2, row: 3 },
      { rashiId: 6,  col: 3, row: 3 }
    ];

    const boxSize = 90;
    const margin = 20;

    let boxesHtml = "";
    southGrid.forEach(cell => {
      const x = margin + cell.col * boxSize;
      const y = margin + cell.row * boxSize;

      let isLagna = false;
      let planetStr = "";
      let houseNum = 0;

      if (isNavamsha) {
        const navLagnaId = chart.navamsha.lagna.id;
        houseNum = ((cell.rashiId - navLagnaId + 12) % 12) + 1;
        isLagna = cell.rashiId === navLagnaId;
        planetStr = chart.navamsha.planets
          .filter(p => p.rashiId === cell.rashiId)
          .map(p => p.name.slice(0, 2).toUpperCase())
          .join(" ");
      } else {
        const lagnaId = chart.houses[1].rashi.id;
        houseNum = ((cell.rashiId - lagnaId + 12) % 12) + 1;
        isLagna = houseNum === 1;
        planetStr = chart.houses[houseNum].planets.map(p => p.slice(0, 2).toUpperCase()).join(" ");
      }

      boxesHtml += `
        <g class="south-box house-group" data-house="${houseNum}" tabindex="0">
          <rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" class="south-cell" />
          <text x="${x + 6}" y="${y + 14}" class="south-sign-label">${cell.rashiId}</text>
          ${isLagna ? `<text x="${x + boxSize - 18}" y="${y + 14}" class="lagna-mark">ASC</text>` : ""}
          <text x="${x + boxSize / 2}" y="${y + boxSize / 2 + 5}" text-anchor="middle" class="planet-badge">${planetStr}</text>
        </g>
      `;
    });

    return `
      <svg viewBox="0 0 400 400" class="kundli-svg south-chart" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="South Indian Vedic Kundli Chart">
        <rect width="400" height="400" fill="#0c0d1b" rx="16" />
        <rect x="20" y="20" width="360" height="360" class="chart-boundary" />
        ${boxesHtml}
        <rect x="110" y="110" width="180" height="180" fill="#131428" stroke="#33375c" stroke-width="1" />
        <text x="200" y="190" text-anchor="middle" fill="#ffdf7e" font-size="28" font-weight="bold">ॐ</text>
        <text x="200" y="215" text-anchor="middle" fill="#a4adc9" font-size="10" letter-spacing="1">SOUTH INDIAN JYOTISH</text>
        <text x="200" y="235" text-anchor="middle" fill="#f4c453" font-size="11" font-weight="bold" letter-spacing="1.5">${isNavamsha ? "D-9 NAVAMSHA" : "D-1 RASHI"}</text>
      </svg>
    `;
  }
}

export function generateNorthIndianSvg(chart, varga = "D1") {
  return KundliChartRenderer.renderNorthIndian(chart, varga);
}

export function generateSouthIndianSvg(chart, varga = "D1") {
  return KundliChartRenderer.renderSouthIndian(chart, varga);
}

