import { DragonElement } from './dragon.js';

/**
 * Character traits that determine how a dragon behaves and interacts
 * Values range from 0 to 100
 */
export interface CharacterTraits {
  /** How friendly and approachable the dragon is (0-100) */
  friendliness: number;
  /** How aggressive or confrontational the dragon is (0-100) */
  aggression: number;
  /** How much the dragon enjoys social interactions (0-100) */
  sociability: number;
  /** How curious and exploratory the dragon is (0-100) */
  curiosity: number;
  /** How playful the dragon is (0-100) */
  playfulness: number;
  /** How dominant or submissive the dragon is (0-100, higher = more dominant) */
  dominance: number;
  /** How patient the dragon is (0-100) */
  patience: number;
}

/**
 * Preferences that influence how dragons respond to others
 */
export interface CharacterPreferences {
  /** Elements this dragon prefers (positive interactions) */
  preferredElements: DragonElement[];
  /** Elements this dragon dislikes (negative interactions) */
  dislikedElements: DragonElement[];
  /** Personality traits this dragon is attracted to */
  preferredTraits: (keyof CharacterTraits)[];
  /** Personality traits this dragon avoids */
  dislikedTraits: (keyof CharacterTraits)[];
}

/**
 * Complete character profile for a dragon
 */
export class DragonCharacter {
  public traits: CharacterTraits;
  public preferences: CharacterPreferences;

  constructor(traits?: Partial<CharacterTraits>, preferences?: Partial<CharacterPreferences>) {
    this.traits = {
      friendliness: traits?.friendliness ?? this.randomTrait(),
      aggression: traits?.aggression ?? this.randomTrait(),
      sociability: traits?.sociability ?? this.randomTrait(),
      curiosity: traits?.curiosity ?? this.randomTrait(),
      playfulness: traits?.playfulness ?? this.randomTrait(),
      dominance: traits?.dominance ?? this.randomTrait(),
      patience: traits?.patience ?? this.randomTrait(),
    };

    this.preferences = {
      preferredElements: preferences?.preferredElements ?? [],
      dislikedElements: preferences?.dislikedElements ?? [],
      preferredTraits: preferences?.preferredTraits ?? [],
      dislikedTraits: preferences?.dislikedTraits ?? [],
    };
  }

  /**
   * Generates a random trait value (0-100)
   * Uses a bell curve distribution (most values around 50, extremes less common)
   */
  private randomTrait(): number {
    // Generate two random numbers and average them for a bell curve effect
    const value1 = Math.random() * 100;
    const value2 = Math.random() * 100;
    return Math.round((value1 + value2) / 2);
  }

  /**
   * Calculates compatibility score with another dragon's character
   * Returns a value from -100 (very incompatible) to 100 (very compatible)
   */
  public getCompatibilityWith(other: DragonCharacter, otherElement: DragonElement): number {
    let score = 0;

    // Trait compatibility
    const traitPairs: Array<[keyof CharacterTraits, keyof CharacterTraits]> = [
      ['friendliness', 'friendliness'],
      ['sociability', 'sociability'],
      ['playfulness', 'playfulness'],
      ['patience', 'patience'],
    ];

    for (const [trait1, trait2] of traitPairs) {
      const diff = Math.abs(this.traits[trait1] - other.traits[trait2]);
      score += (100 - diff) / 10; // Closer values = higher compatibility
    }

    // Dominance compatibility (opposites attract, but similar can work too)
    const dominanceDiff = Math.abs(this.traits.dominance - other.traits.dominance);
    if (dominanceDiff < 30) {
      score += 10; // Similar dominance levels work well
    } else if (dominanceDiff > 70) {
      score += 15; // Very different can also work (complementary)
    }

    // Aggression compatibility (low aggression pairs well with most)
    if (this.traits.aggression < 30 && other.traits.aggression < 30) {
      score += 20; // Both peaceful
    } else if (this.traits.aggression > 70 && other.traits.aggression > 70) {
      score -= 30; // Both aggressive = conflict
    }

    // Element preferences
    if (this.preferences.preferredElements.includes(otherElement)) {
      score += 25;
    }
    if (this.preferences.dislikedElements.includes(otherElement)) {
      score -= 30;
    }

    // Trait preferences
    for (const preferredTrait of this.preferences.preferredTraits) {
      if (other.traits[preferredTrait] > 60) {
        score += 10;
      }
    }

    for (const dislikedTrait of this.preferences.dislikedTraits) {
      if (other.traits[dislikedTrait] > 60) {
        score -= 15;
      }
    }

    // Normalize to -100 to 100 range
    return Math.max(-100, Math.min(100, score));
  }

  /**
   * Determines the interaction style based on traits
   */
  public getInteractionStyle(): 'friendly' | 'playful' | 'serious' | 'aggressive' | 'shy' | 'curious' {
    if (this.traits.aggression > 70) return 'aggressive';
    if (this.traits.friendliness > 70 && this.traits.playfulness > 60) return 'playful';
    if (this.traits.friendliness > 70) return 'friendly';
    if (this.traits.sociability < 30) return 'shy';
    if (this.traits.curiosity > 70) return 'curious';
    return 'serious';
  }
}

/**
 * Generates a random character for a dragon
 */
export function generateRandomCharacter(element?: DragonElement): DragonCharacter {
  const traits: Partial<CharacterTraits> = {};
  const preferences: Partial<CharacterPreferences> = {
    preferredElements: [],
    dislikedElements: [],
    preferredTraits: [],
    dislikedTraits: [],
  };

  // Element-based character adjustments
  if (element) {
    switch (element) {
      case 'Fire':
        traits.aggression = Math.min(100, (traits.aggression ?? 50) + 20);
        traits.dominance = Math.min(100, (traits.dominance ?? 50) + 15);
        preferences.preferredElements = ['Fire', 'Lightning'];
        preferences.dislikedElements = ['Water', 'Ice'];
        break;
      case 'Water':
        traits.patience = Math.min(100, (traits.patience ?? 50) + 20);
        traits.friendliness = Math.min(100, (traits.friendliness ?? 50) + 15);
        preferences.preferredElements = ['Water', 'Ice'];
        preferences.dislikedElements = ['Fire', 'Lightning'];
        break;
      case 'Earth':
        traits.patience = Math.min(100, (traits.patience ?? 50) + 25);
        traits.curiosity = Math.max(0, (traits.curiosity ?? 50) - 15);
        preferences.preferredElements = ['Earth', 'Wind'];
        break;
      case 'Wind':
        traits.curiosity = Math.min(100, (traits.curiosity ?? 50) + 20);
        traits.playfulness = Math.min(100, (traits.playfulness ?? 50) + 15);
        preferences.preferredElements = ['Wind', 'Lightning'];
        break;
      case 'Lightning':
        traits.aggression = Math.min(100, (traits.aggression ?? 50) + 15);
        traits.curiosity = Math.min(100, (traits.curiosity ?? 50) + 20);
        preferences.preferredElements = ['Lightning', 'Fire'];
        preferences.dislikedElements = ['Earth'];
        break;
      case 'Ice':
        traits.sociability = Math.max(0, (traits.sociability ?? 50) - 20);
        traits.patience = Math.min(100, (traits.patience ?? 50) + 25);
        preferences.preferredElements = ['Ice', 'Water'];
        preferences.dislikedElements = ['Fire'];
        break;
    }
  }

  return new DragonCharacter(traits, preferences);
}

