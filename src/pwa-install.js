/**
 * Jyoti AI - Smart PWA Installation Engine
 * Handles 'beforeinstallprompt' for Android/Desktop Chrome and provides
 * guided "Add to Home Screen" instructions for iOS Safari users.
 */

export class PWAInstaller {
  constructor(bannerContainer, installBtn, closeBtn, iosGuideModal) {
    this.banner = bannerContainer;
    this.installBtn = installBtn;
    this.closeBtn = closeBtn;
    this.iosGuideModal = iosGuideModal;
    this.deferredPrompt = null;

    this.init();
  }

  init() {
    if (typeof window === "undefined") return;

    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isStandalone) {
      if (this.banner) this.banner.style.display = "none";
      return;
    }

    // Capture Android beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (this.banner) {
        this.banner.style.display = "flex";
      }
    });

    if (this.installBtn) {
      this.installBtn.addEventListener("click", () => this.handleInstallClick());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        if (this.banner) this.banner.style.display = "none";
      });
    }
  }

  handleInstallClick() {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted PWA installation");
        }
        this.deferredPrompt = null;
        if (this.banner) this.banner.style.display = "none";
      });
    } else if (isIos) {
      // Show iOS step-by-step tutorial sheet
      if (this.iosGuideModal) {
        this.iosGuideModal.classList.add("active");
      } else {
        alert("To install Jyoti AI on iOS:\n1. Tap the Share button (⎋) at the bottom of Safari.\n2. Scroll down and tap 'Add to Home Screen' (➕).");
      }
    } else {
      alert("To install Jyoti AI, tap your browser's menu (⋮) and select 'Install app' or 'Add to Home screen'.");
    }
  }
}
