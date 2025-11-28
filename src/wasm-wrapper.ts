import init, { Dragon as WasmDragon, DragonClan as WasmDragonClan, InteractionResult as WasmInteractionResult, generate_dragon_name as wasmGenerateDragonName, generate_clan_name as wasmGenerateClanName } from '../rust/pkg/dragon_gen.js';

let wasmInitialized = false;

export async function initWasm() {
  if (!wasmInitialized) {
    try {
      await init();
      wasmInitialized = true;
      console.log('WASM initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WASM:', error);
      throw error;
    }
  }
}

// Re-export types and functions
export type DragonElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice';

export interface InteractionResult {
  description: string;
  opinionChange: number;
}

// Wrapper classes to match the original TypeScript API
export class Dragon {
  private wasmDragon: WasmDragon;

  constructor(name: string, element: DragonElement, age: number) {
    this.wasmDragon = new WasmDragon(name, element, age);
  }

  get name(): string {
    return this.wasmDragon.name;
  }

  get element(): DragonElement {
    return this.wasmDragon.element as DragonElement;
  }

  get age(): number {
    return this.wasmDragon.age;
  }

  get energy(): number {
    return this.wasmDragon.energy;
  }

  get mood(): string {
    return this.wasmDragon.mood;
  }

  get character(): any {
    // Return a proxy object that provides the needed methods
    // We need to capture the wasmDragon reference directly
    const wasmDragon = this.wasmDragon;
    const dragonName = this.name;
    return {
      getInteractionStyle: () => {
        try {
          return wasmDragon.get_interaction_style();
        } catch (error) {
          console.error('Error getting interaction style for', dragonName, ':', error);
          return 'serious'; // Default style
        }
      },
    };
  }

  interactWith(other: Dragon): InteractionResult {
    const result = this.wasmDragon.interact_with(other.wasmDragon);
    return {
      description: result.description,
      opinionChange: result.opinion_change,
    };
  }

  getOpinionOf(other: Dragon): number {
    try {
      return this.wasmDragon.get_opinion_of(other.wasmDragon);
    } catch (error) {
      console.error('Error getting opinion:', error, 'self:', this.name, 'other:', other.name);
      return 0; // Default to neutral
    }
  }

  updateOpinionFromInteraction(other: Dragon, interactionDescription: string, baseOpinionChange: number): void {
    this.wasmDragon.update_opinion_from_interaction(other.wasmDragon, interactionDescription, baseOpinionChange);
  }

  rest(): void {
    this.wasmDragon.rest();
  }

  getInfo(): string {
    return this.wasmDragon.get_info();
  }

  getCharacterInfo(): string {
    try {
      if (!this.wasmDragon) {
        console.error('WASM dragon is null for', this.name);
        return `${this.name}'s Details:\n  Error: WASM dragon reference is invalid`;
      }
      return this.wasmDragon.get_character_info();
    } catch (error) {
      console.error('Error getting character info:', error, 'dragon:', this.name);
      return `${this.name}'s Details:\n  Error loading character information`;
    }
  }

  getRelationshipInfo(other: Dragon): string {
    try {
      return this.wasmDragon.get_relationship_info(other.wasmDragon);
    } catch (error) {
      console.error('Error getting relationship info:', error, 'self:', this.name, 'other:', other.name);
      return '😐 neutral (0/100, 0 interactions)'; // Default relationship
    }
  }

  getInteractionStyle(): string {
    try {
      if (!this.wasmDragon) {
        console.error('WASM dragon is null for', this.name);
        return 'serious';
      }
      return this.wasmDragon.get_interaction_style();
    } catch (error) {
      console.error('Error getting interaction style:', error, 'dragon:', this.name);
      return 'serious'; // Default style
    }
  }

  // Internal method to get the WASM dragon for clan operations
  getWasmDragon(): WasmDragon {
    return this.wasmDragon;
  }
}

export class DragonClan {
  private wasmClan: WasmDragonClan;
  private dragons: Dragon[] = [];

  constructor(name: string) {
    this.wasmClan = new WasmDragonClan(name);
  }

  get name(): string {
    return this.wasmClan.name;
  }

  set name(value: string) {
    this.wasmClan.name = value;
  }

  addDragon(dragon: Dragon): void {
    try {
      // Add the WASM dragon to the clan (this takes ownership)
      const wasmDragon = dragon.getWasmDragon();
      this.wasmClan.add_dragon(wasmDragon);
      
      // Retrieve the dragon back from the clan to get a valid reference
      const count = this.wasmClan.get_dragon_count();
      const retrievedWasmDragon = this.wasmClan.get_dragon(count - 1);
      if (retrievedWasmDragon) {
        // Update the dragon wrapper's internal WASM dragon reference
        // to point to the one stored in the clan
        (dragon as any).wasmDragon = retrievedWasmDragon;
        this.dragons.push(dragon);
      } else {
        // Fallback: keep the original dragon
        this.dragons.push(dragon);
      }
    } catch (error) {
      console.error('Error adding dragon to clan:', error);
      // Still add it to our array even if there was an error
      this.dragons.push(dragon);
    }
  }

  getDragonCount(): number {
    return this.wasmClan.get_dragon_count();
  }

  getDragons(): Dragon[] {
    // Return a copy of our dragons array
    return [...this.dragons];
  }

  getDragon(index: number): Dragon | null {
    // Try to get from our array first
    if (index < this.dragons.length) {
      return this.dragons[index];
    }
    // If not in our array, try to get from WASM and wrap it
    const wasmDragon = this.wasmClan.get_dragon(index);
    if (!wasmDragon) {
      return null;
    }
    // Create a wrapper for the WASM dragon
    // Note: We can't easily reconstruct the wrapper from WASM, so we'll return null
    // and rely on our dragons array
    return null;
  }

  removeDragon(dragon: Dragon): boolean {
    const index = this.dragons.indexOf(dragon);
    if (index > -1) {
      this.dragons.splice(index, 1);
      return this.wasmClan.remove_dragon(index);
    }
    return false;
  }

  clear(): void {
    this.wasmClan.clear();
    this.dragons = [];
  }

  simulateInteractions(count: number): Array<{ description: string; dragon1: Dragon; dragon2: Dragon; opinionChange: number }> {
    const interactions: Array<{ description: string; dragon1: Dragon; dragon2: Dragon; opinionChange: number }> = [];
    
    if (this.dragons.length < 2) {
      console.log('Not enough dragons for interactions!');
      return interactions;
    }

    // The WASM code handles interactions internally and updates relationships
    // We simulate one interaction at a time to track which dragons interacted
    for (let i = 0; i < count; i++) {
      const wasmResults = this.wasmClan.simulate_interactions(1);
      if (wasmResults.length > 0) {
        const result = wasmResults[0];
        // Since WASM doesn't tell us which dragons interacted, we'll use placeholder dragons
        // The actual relationship updates happened in WASM
        const dragon1 = this.dragons[0]; // Placeholder
        const dragon2 = this.dragons[1]; // Placeholder
        
        interactions.push({
          description: result.description,
          dragon1,
          dragon2,
          opinionChange: result.opinion_change,
        });
      }
    }

    return interactions;
  }
}

// Name generator functions
export function generateDragonName(element?: DragonElement): string {
  try {
    return wasmGenerateDragonName(element || undefined);
  } catch (error) {
    console.error('Error generating dragon name:', error, 'element:', element);
    // Fallback to a simple name if WASM fails
    return `Dragon${Math.floor(Math.random() * 1000)}`;
  }
}

export function generateClanName(): string {
  try {
    return wasmGenerateClanName();
  } catch (error) {
    console.error('Error generating clan name:', error);
    // Fallback name
    return 'The Dragon Clan';
  }
}

