import init, { 
  ClanService as WasmClanService,
  DragonInfo as WasmDragonInfo,
  DragonElement as WasmDragonElement,
  InteractionEvent as WasmInteractionEvent,
  ClanStats as WasmClanStats,
  generate_dragon_name as wasmGenerateDragonName,
  generate_clan_name as wasmGenerateClanName,
  EventType as WasmEventType,
  subscribe_to_event as wasmSubscribeToEvent,
  unsubscribe_from_event as wasmUnsubscribeFromEvent,
} from '../rust/pkg/dragon_gen.js';

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

// Re-export types
export type DragonElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Lightning' | 'Ice';

// Dragon info interface (read-only, no internal Dragon object exposed)
export interface DragonInfo {
  name: string;
  element: DragonElement;
  age: number;
  interactionStyle: string;
}

// Interaction event interface
export interface InteractionEvent {
  description: string;
  dragon1Index: number;
  dragon2Index: number;
  opinionChange: number;
}

// Clan stats interface
export interface ClanStats {
  name: string;
  dragonCount: number;
}

// Wrapper for the Rust ClanService
export class ClanService {
  private wasmService: WasmClanService;

  constructor() {
    this.wasmService = new WasmClanService();
  }

  /**
   * Create a new clan with random name and initial dragons
   */
  createClan(initialDragonCount: number = 6): void {
    this.wasmService.create_clan(initialDragonCount);
  }

  /**
   * Get clan statistics
   */
  getClanStats(): ClanStats | null {
    const stats = this.wasmService.get_clan_stats();
    if (!stats) return null;
    return {
      name: stats.name, // Property, not method
      dragonCount: stats.dragon_count, // Property, not method
    };
  }

  /**
   * Get all dragons as read-only info
   */
  getDragons(): DragonInfo[] {
    const wasmDragons = this.wasmService.get_dragons();
    return wasmDragons.map((d: WasmDragonInfo) => this.convertDragonInfo(d));
  }

  /**
   * Get a specific dragon by index
   */
  getDragon(index: number): DragonInfo | null {
    const dragon = this.wasmService.get_dragon(index);
    if (!dragon) return null;
    return this.convertDragonInfo(dragon);
  }

  /**
   * Get dragon count
   */
  getDragonCount(): number {
    return this.wasmService.get_dragon_count();
  }

  /**
   * Get clan name
   */
  getClanName(): string {
    return this.wasmService.get_clan_name();
  }

  /**
   * Add a random dragon to the clan
   */
  addRandomDragon(): DragonInfo | null {
    const dragon = this.wasmService.add_random_dragon();
    if (!dragon) return null;
    return this.convertDragonInfo(dragon);
  }

  /**
   * Add a dragon with specific attributes
   */
  addDragon(name: string, element: DragonElement, age: number): DragonInfo | null {
    const dragon = this.wasmService.add_dragon(name, element, age);
    if (!dragon) return null;
    return this.convertDragonInfo(dragon);
  }

  /**
   * Remove a dragon by index
   */
  removeDragon(index: number): boolean {
    return this.wasmService.remove_dragon(index);
  }

  /**
   * Simulate a single interaction
   */
  simulateInteraction(): InteractionEvent | null {
    const event = this.wasmService.simulate_interaction();
    if (!event) return null;
    return this.convertInteractionEvent(event);
  }

  /**
   * Simulate multiple interactions
   */
  simulateInteractions(count: number): InteractionEvent[] {
    const events = this.wasmService.simulate_interactions(count);
    return events.map((e: WasmInteractionEvent) => this.convertInteractionEvent(e));
  }

  /**
   * Reset the clan (clear and create new)
   */
  resetClan(initialDragonCount: number = 6): void {
    this.wasmService.reset_clan(initialDragonCount);
  }

  /**
   * Get relationship info between two dragons
   */
  getRelationshipInfo(dragon1Index: number, dragon2Index: number): string | null {
    return this.wasmService.get_relationship_info(dragon1Index, dragon2Index) || null;
  }

  /**
   * Get opinion of dragon1 about dragon2
   */
  getOpinion(dragon1Index: number, dragon2Index: number): number | null {
    return this.wasmService.get_opinion(dragon1Index, dragon2Index) || null;
  }

  /**
   * Get character info for a dragon
   */
  getDragonCharacterInfo(index: number): string | null {
    return this.wasmService.get_dragon_character_info(index) || null;
  }

  /**
   * Convert WASM DragonInfo to TypeScript interface
   */
  private convertDragonInfo(wasmDragon: WasmDragonInfo): DragonInfo {
    return {
      name: wasmDragon.name, // Property, not method
      element: wasmDragon.element as DragonElement, // Property, not method
      age: wasmDragon.age, // Property, not method
      interactionStyle: wasmDragon.interaction_style, // Property, not method
    };
  }

  /**
   * Convert WASM InteractionEvent to TypeScript interface
   */
  private convertInteractionEvent(wasmEvent: WasmInteractionEvent): InteractionEvent {
    return {
      description: wasmEvent.description, // Property, not method
      dragon1Index: wasmEvent.dragon1_index, // Property, not method
      dragon2Index: wasmEvent.dragon2_index, // Property, not method
      opinionChange: wasmEvent.opinion_change, // Property, not method
    };
  }
}

// Name generator functions
export function generateDragonName(element?: DragonElement): string {
  try {
    return wasmGenerateDragonName(element || undefined);
  } catch (error) {
    console.error('Error generating dragon name:', error, 'element:', element);
    return `Dragon${Math.floor(Math.random() * 1000)}`;
  }
}

export function generateClanName(): string {
  try {
    return wasmGenerateClanName();
  } catch (error) {
    console.error('Error generating clan name:', error);
    return 'The Dragon Clan';
  }
}

// Event type enum (matches Rust EventType)
// The WASM bindings export EventType as an object with numeric values
export const EventType = WasmEventType;

/**
 * Subscribe to events from the Rust notification system
 * @param eventType The type of event to subscribe to (from EventType enum)
 * @param callback Function to call when the event is emitted
 */
export function subscribeToEvent(eventType: WasmEventType, callback: (event: any) => void): void {
  try {
    wasmSubscribeToEvent(eventType, callback);
  } catch (error) {
    console.error('Error subscribing to event:', error);
  }
}

/**
 * Unsubscribe from events from the Rust notification system
 * @param eventType The type of event to unsubscribe from (from EventType enum)
 * @param callback The callback function to remove
 */
export function unsubscribeFromEvent(eventType: WasmEventType, callback: (event: any) => void): void {
  try {
    wasmUnsubscribeFromEvent(eventType, callback);
  } catch (error) {
    console.error('Error unsubscribing from event:', error);
  }
}
