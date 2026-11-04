/**
 * Jyoti AI - Daily Cosmic Streak & Retention Gamification Engine
 * Tracks user daily visits, rewards persistent devotion, and triggers
 * subtle haptic feedback and celebratory animations.
 */

const STORAGE_KEY_STREAK = "jyoti_cosmic_streak";
const STORAGE_KEY_LAST_DATE = "jyoti_streak_last_date";

export class StreakEngine {
  static getTodayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  static getStreak() {
    if (typeof localStorage === "undefined") return { count: 1, isNewToday: false };
    const saved = localStorage.getItem(STORAGE_KEY_STREAK);
    const count = parseInt(saved, 10);
    return {
      count: isNaN(count) || count < 1 ? 1 : count,
      lastDate: localStorage.getItem(STORAGE_KEY_LAST_DATE) || ""
    };
  }

  static updateStreak() {
    if (typeof localStorage === "undefined") return { count: 1, isNewToday: false };

    const today = this.getTodayString();
    const { count, lastDate } = this.getStreak();

    if (!lastDate) {
      localStorage.setItem(STORAGE_KEY_STREAK, "1");
      localStorage.setItem(STORAGE_KEY_LAST_DATE, today);
      return { count: 1, isNewToday: true };
    }

    if (lastDate === today) {
      return { count, isNewToday: false };
    }

    const prevDate = new Date(lastDate);
    const currentDate = new Date(today);
    const diffTime = currentDate - prevDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let newCount = count;
    if (diffDays === 1) {
      // Consecutive day!
      newCount = count + 1;
      this.triggerHapticCelebration();
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      newCount = 1;
    }

    localStorage.setItem(STORAGE_KEY_STREAK, String(newCount));
    localStorage.setItem(STORAGE_KEY_LAST_DATE, today);

    return { count: newCount, isNewToday: true };
  }

  static triggerHapticCelebration() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([30, 60, 30, 80, 50]);
      } catch (e) {
        // Safe fallback
      }
    }
  }
}
