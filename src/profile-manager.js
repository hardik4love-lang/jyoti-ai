/**
 * Jyoti AI - Multi-Profile Family & Partner Chart Vault
 * Saves multiple Kundli birth charts in local storage (100% private, 0 database cost).
 * Allows instant 1-tap switching between family members, partners, and friends.
 */

const STORAGE_PROFILES = "jyoti_user_profiles";
const STORAGE_ACTIVE_ID = "jyoti_active_profile_id";

export class ProfileManager {
  static getProfiles() {
    if (typeof localStorage === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_PROFILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getActiveProfileId() {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(STORAGE_ACTIVE_ID);
  }

  static getActiveProfile() {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    if (activeId) {
      const match = profiles.find(p => p.id === activeId);
      if (match) return match;
    }
    return profiles[0] || null;
  }

  static setActiveProfileId(id) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_ACTIVE_ID, id);
  }

  static saveProfile(profile) {
    if (typeof localStorage === "undefined") return [];
    const profiles = this.getProfiles();
    const id = profile.id || `profile_${Date.now()}`;
    const newProfile = { ...profile, id, updatedAt: new Date().toISOString() };

    const index = profiles.findIndex(p => p.id === id);
    if (index >= 0) {
      profiles[index] = newProfile;
    } else {
      profiles.push(newProfile);
    }

    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(profiles));
    this.setActiveProfileId(id);
    return profiles;
  }

  static deleteProfile(id) {
    if (typeof localStorage === "undefined") return [];
    let profiles = this.getProfiles();
    profiles = profiles.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(profiles));
    if (profiles.length > 0) {
      this.setActiveProfileId(profiles[0].id);
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_ID);
    }
    return profiles;
  }
}
