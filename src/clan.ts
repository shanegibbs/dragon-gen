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

      const interaction = dragon1.interactWith(dragon2);
      console.log(`[${i + 1}] ${interaction}`);
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
}

