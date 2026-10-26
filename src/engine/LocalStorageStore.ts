import type { PersonalBestRecord } from './types';

class SafeStorage {
  private memoryFallback: Map<string, string> = new Map();

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // In private browsing or sandbox mode, fall back to memory
    }
    return this.memoryFallback.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback
    }
    this.memoryFallback.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback
    }
    this.memoryFallback.delete(key);
  }

  getPersonalBest(slug: string): PersonalBestRecord | null {
    const raw = this.getItem(`gf_pb_${slug}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PersonalBestRecord;
    } catch {
      return null;
    }
  }

  savePersonalBest(slug: string, record: PersonalBestRecord): boolean {
    const current = this.getPersonalBest(slug);
    let isBetter = false;

    if (!current) {
      isBetter = true;
    } else if (record.stars > current.stars) {
      isBetter = true;
    } else if (record.stars === current.stars && record.accuracy > current.accuracy) {
      isBetter = true;
    } else if (
      record.stars === current.stars &&
      record.accuracy === current.accuracy &&
      record.timeSpent < current.timeSpent
    ) {
      isBetter = true;
    }

    if (isBetter) {
      this.setItem(`gf_pb_${slug}`, JSON.stringify(record));
      return true;
    }
    return false;
  }
}

export const safeStorage = new SafeStorage();
