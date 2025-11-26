export type DragonElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice';

export class Dragon {
  public name: string;
  public element: DragonElement;
  public age: number;
  public energy: number = 100;
  public mood: 'happy' | 'content' | 'tired' | 'hungry' | 'excited' = 'content';

  constructor(name: string, element: DragonElement, age: number) {
    this.name = name;
    this.element = element;
    this.age = age;
  }

  public interactWith(other: Dragon): string {
    // Dragons interact based on their elements and moods
    const interactions = [
      `${this.name} (${this.element}) greets ${other.name} (${other.element})`,
      `${this.name} shares a story with ${other.name}`,
      `${this.name} and ${other.name} play together`,
      `${this.name} helps ${other.name} with something`,
    ];

    // Element-based interactions
    if (this.element === 'Fire' && other.element === 'Water') {
      return `${this.name} (Fire) and ${other.name} (Water) have a friendly elemental discussion`;
    } else if (this.element === 'Earth' && other.element === 'Wind') {
      return `${this.name} (Earth) and ${other.name} (Wind) collaborate on a project`;
    }

    // Random interaction
    return interactions[Math.floor(Math.random() * interactions.length)];
  }

  public rest(): void {
    this.energy = Math.min(100, this.energy + 20);
    if (this.energy > 80) {
      this.mood = 'happy';
    }
  }

  public getInfo(): string {
    return `${this.name} - ${this.element} Dragon, Age: ${this.age}, Energy: ${this.energy}%, Mood: ${this.mood}`;
  }
}

