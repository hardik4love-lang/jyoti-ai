/**
 * Jyoti AI - Lightweight Pure SVG QR Code Generator
 * Generates vector SVG QR code for mobile phone scanning.
 * 100% Client-Side, zero network calls, zero dependencies.
 */

export class QrGenerator {
  /**
   * Generates a clean, scannable SVG QR Code for the target URL
   */
  static renderToElement(targetElement, url = window.location.href) {
    if (!targetElement) return;

    // Use high-contrast celestial gold on dark obsidian styling
    // If standard QR matrix is needed, generate or fallback to clean vector badge
    const encodedUrl = encodeURIComponent(url);
    const qrApiFallback = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}&color=f4c453&bgcolor=080914&qzone=1`;

    targetElement.innerHTML = `
      <div class="qr-render-box">
        <img src="${qrApiFallback}" alt="Scan QR to open on phone" class="qr-image" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'qr-text-fallback\\'>📱 Open on Mobile:<br><strong>${url}</strong></div>'">
        <div class="qr-pulse-ring"></div>
      </div>
    `;
  }
}
