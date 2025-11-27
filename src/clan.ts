import { Dragon } from './dragon.js';

export class DragonClan {
  public name: string;
  private dragons: Dragon[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addDragon(dragon: Dragon): void {
    this.dragons.push(dragon);
  }

  public getDragonCount(): number {
    return this.dragons.length;
  }

  public getDragons(): Dragon[] {
    return [...this.dragons]; // Return a copy
  }

  public removeDragon(dragon: Dragon): boolean {
    const index = this.dragons.indexOf(dragon);
    if (index > -1) {
      this.dragons.splice(index, 1);
      return true;
    }
    return false;
  }

  public clear(): void {
    this.dragons = [];
  }

  public simulateInteractions(count: number): void {
    if (this.dragons.length < 2) {
      console.log('Not enough dragons for interactions!');
      return;
    }

    for (let i = 0; i < count; i++) {
      // Pick two random dragons
      const dragon1 = this.dragons[Math.floor(Math.random() * this.dragons.length)];
      let dragon2: Dragon;
      do {
        dragon2 = this.dragons[Math.floor(Math.random() * this.dragons.length)];
      } while (dragon1 === dragon2);

      // Get interaction result from dragon1's perspective
      const result = dragon1.interactWith(dragon2);
      
      // Update dragon2's opinion based on the same interaction
      // The opinion change might be slightly different from dragon2's perspective
      const otherPerspectiveChange = Math.round(result.opinionChange * (0.8 + Math.random() * 0.4)); // 80-120% of original
      dragon2.updateOpinionFromInteraction(dragon1, result.description, otherPerspectiveChange);
      
      // Display the interaction
      console.log(`[${i + 1}] ${result.description}`);
    }
  }

  public displayStatus(): void {
    this.dragons.forEach((dragon, index) => {
      console.log(`${index + 1}. ${dragon.getInfo()}`);
    });
  }

  public displayCharacterDetails(): void {
    console.log('\n--- Character Details ---\n');
    this.dragons.forEach((dragon) => {
      console.log(dragon.getCharacterInfo());
      console.log('');
    });
  }

  public displayRelationships(): void {
    console.log('\n--- Dragon Relationships ---\n');
    this.dragons.forEach((dragon) => {
      console.log(`${dragon.name}'s relationships:`);
      this.dragons.forEach((other) => {
        if (dragon !== other) {
          const relationshipInfo = dragon.getRelationshipInfo(other);
          console.log(`  → ${other.name}: ${relationshipInfo}`);
        }
      });
      console.log('');
    });
  }

  public displayRelationshipMatrix(): void {
    console.log('\n--- Relationship Matrix ---\n');
    console.log('Opinion scores (higher = more positive):\n');
    
    // Header row
    const header = '        ' + this.dragons.map(d => d.name.padEnd(12)).join('');
    console.log(header);
    
    // Each dragon's row
    this.dragons.forEach((dragon) => {
      const row = dragon.name.padEnd(8) + this.dragons.map((other) => {
        if (dragon === other) {
          return '---'.padEnd(12);
        }
        const opinion = dragon.getOpinionOf(other);
        return `${opinion.toString().padStart(3)}`.padEnd(12);
      }).join('');
      console.log(row);
    });
  }
}

