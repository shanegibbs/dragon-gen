import { DragonCharacter, generateRandomCharacter } from './character.js';
import { Relationship } from './relationship.js';
import { calculateValueAlignment } from './values.js';

export type DragonElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice';

export interface InteractionResult {
  description: string;
  opinionChange: number; // How much this dragon's opinion of the other changes
}

export class Dragon {
  public name: string;
  public element: DragonElement;
  public age: number;
  public energy: number = 100;
  public mood: 'happy' | 'content' | 'tired' | 'hungry' | 'excited' = 'content';
  public character: DragonCharacter;
  private relationships: Map<string, Relationship> = new Map();

  constructor(name: string, element: DragonElement, age: number, character?: DragonCharacter) {
    this.name = name;
    this.element = element;
    this.age = age;
    this.character = character ?? generateRandomCharacter(element);
  }

  /**
   * Gets or creates a relationship with another dragon
   */
  private getRelationship(other: Dragon): Relationship {
    if (!this.relationships.has(other.name)) {
      // Initial opinion based on character compatibility
      const compatibility = this.character.getCompatibilityWith(other.character, other.element);
      const initialOpinion = Math.round(compatibility * 0.3); // Start with 30% of compatibility as initial opinion
      const targetOpinion = Math.round(compatibility * 0.7); // Target is 70% of compatibility
      const relationship = new Relationship(initialOpinion, targetOpinion);
      this.relationships.set(other.name, relationship);
    }
    return this.relationships.get(other.name)!;
  }

  /**
   * Gets the current opinion of another dragon
   */
  public getOpinionOf(other: Dragon): number {
    const relationship = this.getRelationship(other);
    return relationship.opinion;
  }

  /**
   * Updates opinion based on an interaction that occurred
   * This is called after an interaction to update this dragon's opinion
   */
  public updateOpinionFromInteraction(other: Dragon, interactionDescription: string, baseOpinionChange: number): void {
    const relationship = this.getRelationship(other);
    const compatibility = this.character.getCompatibilityWith(other.character, other.element);
    
    // Adjust opinion change based on existing relationship
    // Early interactions have more impact, later ones stabilize
    const existingOpinion = relationship.opinion;
    let adjustedChange = baseOpinionChange;
    
    // Diminishing returns: reduce change impact as relationship matures
    const interactionCount = relationship.interactionCount;
    const decayFactor = Math.max(0.3, 1.0 - (interactionCount * 0.05)); // Reduces impact over time
    adjustedChange = adjustedChange * decayFactor;
    
    relationship.updateOpinion(adjustedChange, interactionDescription, compatibility);
  }

  /**
   * Interacts with another dragon and returns both the description and opinion change
   */
  public interactWith(other: Dragon): InteractionResult {
    const relationship = this.getRelationship(other);
    const existingOpinion = relationship.opinion;
    const compatibility = this.character.getCompatibilityWith(other.character, other.element);
    const myStyle = this.character.getInteractionStyle();
    const otherStyle = other.character.getInteractionStyle();
    const valueAlignment = calculateValueAlignment(this.character.values, other.character.values);

    // Existing opinion influences the interaction
    // If opinion is very negative, interactions are more likely to be negative
    // If opinion is very positive, interactions are more likely to be positive
    const opinionModifier = existingOpinion / 100; // -1 to 1
    const adjustedCompatibility = compatibility + (opinionModifier * 30);
    
    // Value alignment also influences interactions
    // High value alignment can improve interactions, conflicts can worsen them
    const valueModifier = valueAlignment / 100; // -1 to 1
    const finalCompatibility = adjustedCompatibility + (valueModifier * 20);

    let description: string;
    let opinionChange: number;

    // Value-based interactions (can override or enhance standard interactions)
    const myValues = this.character.values;
    const otherValues = other.character.values;
    let valueBasedInteraction = false;

    // High honor interactions
    if (myValues.honor > 70 && otherValues.honor > 70 && finalCompatibility > -20) {
      description = `${this.name} (${this.element}) and ${other.name} (${other.element}) make a solemn promise together - their shared honor creates a bond`;
      opinionChange = 10 + (valueAlignment > 50 ? 5 : 0);
      valueBasedInteraction = true;
    }
    // High community interactions
    else if (myValues.community > 70 && otherValues.community > 70 && finalCompatibility > 0) {
      description = `${this.name} (${this.element}) and ${other.name} (${other.element}) work together for the clan's benefit - their shared values strengthen their bond`;
      opinionChange = 8 + (valueAlignment > 50 ? 4 : 0);
      valueBasedInteraction = true;
    }
    // High harmony interactions
    else if (myValues.harmony > 70 && otherValues.harmony > 70 && finalCompatibility > -30) {
      description = `${this.name} (${this.element}) and ${other.name} (${other.element}) seek peaceful resolution to a disagreement - their shared value for harmony prevails`;
      opinionChange = 6 + (valueAlignment > 50 ? 3 : 0);
      valueBasedInteraction = true;
    }
    // High wisdom interactions
    else if (myValues.wisdom > 70 && otherValues.wisdom > 70 && finalCompatibility > 0) {
      description = `${this.name} (${this.element}) and ${other.name} (${other.element}) engage in deep philosophical discussion - their shared wisdom creates understanding`;
      opinionChange = 7 + (valueAlignment > 50 ? 3 : 0);
      valueBasedInteraction = true;
    }
    // Value conflicts
    else if (valueAlignment < -30 && finalCompatibility < 20) {
      // Freedom vs Community conflict
      if (myValues.freedom > 70 && otherValues.community > 70) {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) disagree on priorities - individual freedom vs collective good`;
        opinionChange = -5;
        valueBasedInteraction = true;
      }
      // Tradition vs Growth conflict
      else if (myValues.tradition > 70 && otherValues.growth > 70) {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) debate the value of tradition versus progress`;
        opinionChange = -4;
        valueBasedInteraction = true;
      }
      // Power vs Harmony conflict
      else if (myValues.power > 70 && otherValues.harmony > 70) {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) clash over approaches - one seeks influence, the other seeks peace`;
        opinionChange = -6;
        valueBasedInteraction = true;
      }
    }

    // Very incompatible interactions
    if (!valueBasedInteraction && finalCompatibility < -50) {
      if (this.character.traits.aggression > 70) {
        description = `${this.name} (${this.element}) confronts ${other.name} (${other.element}) - they don't get along`;
        opinionChange = -15 - (existingOpinion < 0 ? 5 : 0); // Extra penalty if already negative
      } else if (other.character.traits.aggression > 70) {
        description = `${this.name} (${this.element}) avoids ${other.name} (${other.element}) - ${other.name} seems hostile`;
        opinionChange = -10;
      } else {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) keep their distance - awkward silence`;
        opinionChange = -5;
      }
    }
    // Incompatible but not hostile
    else if (!valueBasedInteraction && finalCompatibility < 0) {
      const neutralInteractions = [
        `${this.name} (${this.element}) exchanges a brief nod with ${other.name} (${other.element})`,
        `${this.name} (${this.element}) and ${other.name} (${other.element}) have a polite but distant conversation`,
        `${this.name} (${this.element}) acknowledges ${other.name} (${other.element}) but doesn't engage much`,
      ];
      description = neutralInteractions[Math.floor(Math.random() * neutralInteractions.length)];
      opinionChange = -2 + Math.floor(Math.random() * 4); // -2 to +1
    }
    // Compatible interactions based on character styles
    else if (!valueBasedInteraction && finalCompatibility > 50) {
      // High compatibility - positive interactions
      if (myStyle === 'playful' && otherStyle === 'playful') {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) play an energetic game together!`;
        opinionChange = 12 + (existingOpinion > 0 ? 3 : 0); // Bonus if already positive
      } else if (myStyle === 'curious' || otherStyle === 'curious') {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) explore something interesting together`;
        opinionChange = 10;
      } else if (myStyle === 'friendly' || otherStyle === 'friendly') {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) share a warm, friendly conversation`;
        opinionChange = 8;
      } else {
        description = `${this.name} (${this.element}) and ${other.name} (${other.element}) collaborate effectively on a task`;
        opinionChange = 7;
      }
    }
    // Moderate compatibility - standard interactions
    else {
      if (myStyle === 'shy' || otherStyle === 'shy') {
        const shyInteractions = [
          `${this.name} (${this.element}) tentatively approaches ${other.name} (${other.element})`,
          `${this.name} (${this.element}) and ${other.name} (${other.element}) have a quiet conversation`,
        ];
        description = shyInteractions[Math.floor(Math.random() * shyInteractions.length)];
        opinionChange = 3 + Math.floor(Math.random() * 3); // 3-5
      } else if (myStyle === 'aggressive' && finalCompatibility > 0) {
        description = `${this.name} (${this.element}) challenges ${other.name} (${other.element}) to a friendly competition`;
        opinionChange = 5;
      } else {
        // Default moderate interactions
        const moderateInteractions = [
          `${this.name} (${this.element}) greets ${other.name} (${other.element})`,
          `${this.name} (${this.element}) shares a story with ${other.name} (${other.element})`,
          `${this.name} (${this.element}) and ${other.name} (${other.element}) chat about their day`,
          `${this.name} (${this.element}) helps ${other.name} (${other.element}) with something`,
        ];

        // Element-based interactions (only if compatible)
        if (this.element === 'Fire' && other.element === 'Water' && finalCompatibility > 20) {
          description = `${this.name} (Fire) and ${other.name} (Water) have an interesting elemental discussion`;
          opinionChange = 6;
        } else if (this.element === 'Earth' && other.element === 'Wind' && finalCompatibility > 20) {
          description = `${this.name} (Earth) and ${other.name} (Wind) collaborate on a project`;
          opinionChange = 6;
        } else {
          description = moderateInteractions[Math.floor(Math.random() * moderateInteractions.length)];
          opinionChange = 2 + Math.floor(Math.random() * 4); // 2-5
        }
      }
    }

    // Update the relationship with compatibility info
    relationship.updateOpinion(opinionChange, description, compatibility);

    return { description, opinionChange };
  }

  public rest(): void {
    this.energy = Math.min(100, this.energy + 20);
    if (this.energy > 80) {
      this.mood = 'happy';
    }
  }

  public getInfo(): string {
    const style = this.character.getInteractionStyle();
    return `${this.name} - ${this.element} Dragon, Age: ${this.age}, Energy: ${this.energy}%, Mood: ${this.mood}, Style: ${style}`;
  }

  /**
   * Gets detailed character information
   */
  public getCharacterInfo(): string {
    const traits = this.character.traits;
    const values = this.character.values;
    const style = this.character.getInteractionStyle();
    
    // Sort traits by value in descending order
    const sortedTraits = Object.entries(traits)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => {
        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
        return `  ${capitalized}: ${value}/100`;
      });
    
    // Sort values by value in descending order
    const sortedValues = Object.entries(values)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => {
        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
        return `  ${capitalized}: ${value}/100`;
      });
    
    return `${this.name}'s Details:
  Element: ${this.element}
  Age: ${this.age}
  Energy: ${this.energy}%
  Mood: ${this.mood}
  
  Character:
  Style: ${style}
  
  Traits:
${sortedTraits.join('\n')}
  
  Values:
${sortedValues.join('\n')}`;
  }

  /**
   * Gets all relationships this dragon has
   */
  public getRelationships(): Map<string, Relationship> {
    return new Map(this.relationships);
  }

  /**
   * Gets relationship information with another dragon
   */
  public getRelationshipInfo(other: Dragon): string {
    const relationship = this.getRelationship(other);
    const status = relationship.getRelationshipStatus();
    const description = relationship.getRelationshipDescription();
    return `${status} ${description} (${relationship.opinion}/100, ${relationship.interactionCount} interactions)`;
  }
}

