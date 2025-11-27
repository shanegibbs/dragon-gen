import { DragonElement } from './dragon.js';

/**
 * Core values that guide a dragon's decisions and moral framework
 * Each value ranges from 0 to 100
 */
export interface DragonValues {
  /** Commitment to integrity, keeping promises, and maintaining personal dignity (0-100) */
  honor: number;
  /** Value for independence, autonomy, and resistance to constraints (0-100) */
  freedom: number;
  /** Respect for established customs, ancestral wisdom, and maintaining the old ways (0-100) */
  tradition: number;
  /** Belief in progress, learning, self-improvement, and embracing change (0-100) */
  growth: number;
  /** Prioritizing the collective good, cooperation, and clan welfare over individual interests (0-100) */
  community: number;
  /** Value for personal success, recognition, and demonstrating capability (0-100) */
  achievement: number;
  /** Value for balance, peace, avoiding conflict, and maintaining equilibrium (0-100) */
  harmony: number;
  /** Value for strength, influence, and the ability to affect outcomes (0-100) */
  power: number;
  /** Value for knowledge, understanding, and making well-considered decisions (0-100) */
  wisdom: number;
  /** Value for caring for others, defending the vulnerable, and ensuring safety (0-100) */
  protection: number;
}

/**
 * Calculates value alignment between two dragons
 * Returns a score from -100 (very conflicting) to 100 (very aligned)
 */
export function calculateValueAlignment(values1: DragonValues, values2: DragonValues): number {
  let alignment = 0;

  // Complementary value pairs (similar values = positive alignment)
  const complementaryPairs: Array<[keyof DragonValues, keyof DragonValues]> = [
    ['honor', 'honor'],
    ['tradition', 'tradition'],
    ['community', 'community'],
    ['protection', 'protection'],
    ['wisdom', 'wisdom'],
    ['harmony', 'harmony'],
    ['growth', 'growth'],
    ['freedom', 'freedom'],
    ['achievement', 'achievement'],
    ['power', 'power'],
  ];

  for (const [value1, value2] of complementaryPairs) {
    const diff = Math.abs(values1[value1] - values2[value2]);
    // Closer values = higher alignment (max 10 points per value)
    alignment += (100 - diff) / 10;
  }

  // Conflicting value pairs (opposites create tension)
  const conflictPairs: Array<[keyof DragonValues, keyof DragonValues]> = [
    ['freedom', 'community'], // Individual vs collective
    ['tradition', 'growth'], // Old ways vs change
    ['power', 'harmony'], // Influence vs peace
    ['achievement', 'protection'], // Success vs care
  ];

  for (const [value1, value2] of conflictPairs) {
    const diff = Math.abs(values1[value1] - values2[value2]);
    // Large differences in conflicting values reduce alignment
    if (diff > 50) {
      alignment -= diff / 10; // Up to -5 points per conflict
    }
  }

  // Special cases: very high values in complementary areas
  if (values1.honor > 70 && values2.honor > 70) {
    alignment += 15; // Both highly honorable
  }
  if (values1.community > 70 && values2.community > 70) {
    alignment += 15; // Both value community
  }
  if (values1.harmony > 70 && values2.harmony > 70) {
    alignment += 15; // Both seek peace
  }

  // Special cases: conflicting high values
  if (values1.freedom > 70 && values2.community > 70) {
    alignment -= 20; // Freedom vs community conflict
  }
  if (values1.tradition > 70 && values2.growth > 70) {
    alignment -= 20; // Tradition vs growth conflict
  }
  if (values1.power > 70 && values2.harmony > 70) {
    alignment -= 20; // Power vs harmony conflict
  }

  // Normalize to -100 to 100 range
  return Math.max(-100, Math.min(100, alignment));
}

/**
 * Generates random values for a dragon
 * Uses a bell curve distribution (most values around 50, extremes less common)
 */
function randomValue(): number {
  const value1 = Math.random() * 100;
  const value2 = Math.random() * 100;
  return Math.round((value1 + value2) / 2);
}

/**
 * Generates values for a dragon with element-based adjustments
 */
export function generateDragonValues(element?: DragonElement): DragonValues {
  const values: DragonValues = {
    honor: randomValue(),
    freedom: randomValue(),
    tradition: randomValue(),
    growth: randomValue(),
    community: randomValue(),
    achievement: randomValue(),
    harmony: randomValue(),
    power: randomValue(),
    wisdom: randomValue(),
    protection: randomValue(),
  };

  // Element-based value adjustments
  if (element) {
    switch (element) {
      case 'Fire':
        values.power = Math.min(100, values.power + 20);
        values.achievement = Math.min(100, values.achievement + 15);
        values.harmony = Math.max(0, values.harmony - 15);
        break;
      case 'Water':
        values.harmony = Math.min(100, values.harmony + 20);
        values.protection = Math.min(100, values.protection + 15);
        values.wisdom = Math.min(100, values.wisdom + 10);
        break;
      case 'Earth':
        values.tradition = Math.min(100, values.tradition + 25);
        values.honor = Math.min(100, values.honor + 15);
        values.growth = Math.max(0, values.growth - 15);
        break;
      case 'Wind':
        values.freedom = Math.min(100, values.freedom + 25);
        values.growth = Math.min(100, values.growth + 20);
        values.tradition = Math.max(0, values.tradition - 15);
        break;
      case 'Lightning':
        values.achievement = Math.min(100, values.achievement + 20);
        values.power = Math.min(100, values.power + 15);
        values.harmony = Math.max(0, values.harmony - 15);
        break;
      case 'Ice':
        values.wisdom = Math.min(100, values.wisdom + 25);
        values.harmony = Math.min(100, values.harmony + 15);
        values.community = Math.max(0, values.community - 15);
        break;
    }
  }

  // Ensure all values are in valid range
  for (const key of Object.keys(values) as Array<keyof DragonValues>) {
    values[key] = Math.max(0, Math.min(100, values[key]));
  }

  return values;
}

/**
 * Gets a summary of a dragon's top values
 */
export function getTopValues(values: DragonValues, count: number = 3): Array<{ name: string; score: number }> {
  const valueEntries = Object.entries(values) as Array<[keyof DragonValues, number]>;
  return valueEntries
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

