import { DragonCharacter, generateRandomCharacter } from './character.js';

export type DragonElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice';

export class Dragon {
  public name: string;
  public element: DragonElement;
  public age: number;
  public energy: number = 100;
  public mood: 'happy' | 'content' | 'tired' | 'hungry' | 'excited' = 'content';
  public character: DragonCharacter;

  constructor(name: string, element: DragonElement, age: number, character?: DragonCharacter) {
    this.name = name;
    this.element = element;
    this.age = age;
    this.character = character ?? generateRandomCharacter(element);
  }

  public interactWith(other: Dragon): string {
    const compatibility = this.character.getCompatibilityWith(other.character, other.element);
    const myStyle = this.character.getInteractionStyle();
    const otherStyle = other.character.getInteractionStyle();

    // Very incompatible interactions
    if (compatibility < -50) {
      if (this.character.traits.aggression > 70) {
        return `${this.name} (${this.element}) confronts ${other.name} (${other.element}) - they don't get along`;
      } else if (other.character.traits.aggression > 70) {
        return `${this.name} (${this.element}) avoids ${other.name} (${other.element}) - ${other.name} seems hostile`;
      } else {
        return `${this.name} (${this.element}) and ${other.name} (${other.element}) keep their distance - awkward silence`;
      }
    }

    // Incompatible but not hostile
    if (compatibility < 0) {
      const neutralInteractions = [
        `${this.name} (${this.element}) exchanges a brief nod with ${other.name} (${other.element})`,
        `${this.name} (${this.element}) and ${other.name} (${other.element}) have a polite but distant conversation`,
        `${this.name} (${this.element}) acknowledges ${other.name} (${other.element}) but doesn't engage much`,
      ];
      return neutralInteractions[Math.floor(Math.random() * neutralInteractions.length)];
    }

    // Compatible interactions based on character styles
    if (compatibility > 50) {
      // High compatibility - positive interactions
      if (myStyle === 'playful' && otherStyle === 'playful') {
        return `${this.name} (${this.element}) and ${other.name} (${other.element}) play an energetic game together!`;
      } else if (myStyle === 'curious' || otherStyle === 'curious') {
        return `${this.name} (${this.element}) and ${other.name} (${other.element}) explore something interesting together`;
      } else if (myStyle === 'friendly' || otherStyle === 'friendly') {
        return `${this.name} (${this.element}) and ${other.name} (${other.element}) share a warm, friendly conversation`;
      } else {
        return `${this.name} (${this.element}) and ${other.name} (${other.element}) collaborate effectively on a task`;
      }
    }

    // Moderate compatibility - standard interactions
    if (myStyle === 'shy' || otherStyle === 'shy') {
      const shyInteractions = [
        `${this.name} (${this.element}) tentatively approaches ${other.name} (${other.element})`,
        `${this.name} (${this.element}) and ${other.name} (${other.element}) have a quiet conversation`,
      ];
      return shyInteractions[Math.floor(Math.random() * shyInteractions.length)];
    }

    if (myStyle === 'aggressive' && compatibility > 0) {
      return `${this.name} (${this.element}) challenges ${other.name} (${other.element}) to a friendly competition`;
    }

    // Default moderate interactions
    const moderateInteractions = [
      `${this.name} (${this.element}) greets ${other.name} (${other.element})`,
      `${this.name} (${this.element}) shares a story with ${other.name} (${other.element})`,
      `${this.name} (${this.element}) and ${other.name} (${other.element}) chat about their day`,
      `${this.name} (${this.element}) helps ${other.name} (${other.element}) with something`,
    ];

    // Element-based interactions (only if compatible)
    if (this.element === 'Fire' && other.element === 'Water' && compatibility > 20) {
      return `${this.name} (Fire) and ${other.name} (Water) have an interesting elemental discussion`;
    } else if (this.element === 'Earth' && other.element === 'Wind' && compatibility > 20) {
      return `${this.name} (Earth) and ${other.name} (Wind) collaborate on a project`;
    }

    return moderateInteractions[Math.floor(Math.random() * moderateInteractions.length)];
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
    const style = this.character.getInteractionStyle();
    return `${this.name}'s Character:
  Style: ${style}
  Friendliness: ${traits.friendliness}/100
  Sociability: ${traits.sociability}/100
  Playfulness: ${traits.playfulness}/100
  Aggression: ${traits.aggression}/100
  Dominance: ${traits.dominance}/100
  Curiosity: ${traits.curiosity}/100
  Patience: ${traits.patience}/100`;
  }
}

