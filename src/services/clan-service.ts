import { ClanService as WasmClanService, DragonInfo, DragonElement, InteractionEvent, ClanStats, initWasm } from '../wasm-wrapper.js';

/**
 * Event types that can be emitted by the ClanService
 */
export type ClanServiceEvent = 
  | { type: 'clan-created'; clanName: string; dragonCount: number }
  | { type: 'dragon-added'; dragon: DragonInfo }
  | { type: 'dragon-removed'; dragonName: string }
  | { type: 'interaction-simulated'; event: InteractionEvent }
  | { type: 'clan-reset'; clanName: string; dragonCount: number }
  | { type: 'error'; message: string; error?: Error };

/**
 * Callback type for event listeners
 */
export type ClanServiceEventListener = (event: ClanServiceEvent) => void;

/**
 * Interface for the Clan Service
 * This provides a clean API for the UI layer to interact with the domain logic
 */
export interface IClanService {
  /**
   * Initialize the service (must be called before use)
   */
  initialize(): Promise<void>;

  /**
   * Create a new clan with random name and initial dragons
   */
  createClan(initialDragonCount?: number): Promise<void>;

  /**
   * Get all dragons in the clan
   */
  getDragons(): DragonInfo[];

  /**
   * Get a specific dragon by index
   */
  getDragon(index: number): DragonInfo | null;

  /**
   * Add a random dragon to the clan
   */
  addRandomDragon(): Promise<DragonInfo>;

  /**
   * Add a dragon with specific attributes
   */
  addDragon(name: string, element: DragonElement, age: number): Promise<DragonInfo>;

  /**
   * Remove a dragon by index
   */
  removeDragon(index: number): Promise<boolean>;

  /**
   * Simulate a single interaction between dragons
   */
  simulateInteraction(): Promise<InteractionEvent | null>;

  /**
   * Simulate multiple interactions
   */
  simulateInteractions(count: number): Promise<InteractionEvent[]>;

  /**
   * Reset the clan (clear and create new)
   */
  resetClan(initialDragonCount?: number): Promise<void>;

  /**
   * Get clan statistics
   */
  getClanStats(): ClanStats | null;

  /**
   * Get relationship info between two dragons
   */
  getRelationshipInfo(dragon1Index: number, dragon2Index: number): string | null;

  /**
   * Get opinion of dragon1 about dragon2
   */
  getOpinion(dragon1Index: number, dragon2Index: number): number | null;

  /**
   * Get character info for a dragon
   */
  getDragonCharacterInfo(index: number): string | null;

  /**
   * Subscribe to service events
   */
  on(event: ClanServiceEvent['type'], listener: ClanServiceEventListener): void;

  /**
   * Unsubscribe from service events
   */
  off(event: ClanServiceEvent['type'], listener: ClanServiceEventListener): void;
}

/**
 * Implementation of the Clan Service
 * This wraps the Rust ClanService and provides event handling
 */
export class ClanService implements IClanService {
  private wasmService!: WasmClanService; // Initialized in initialize()
  private initialized = false;
  private eventListeners: Map<ClanServiceEvent['type'], Set<ClanServiceEventListener>> = new Map();

  /**
   * Initialize WASM and the service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await initWasm();
      this.wasmService = new WasmClanService();
      this.initialized = true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to initialize WASM', error: err });
      throw err;
    }
  }

  /**
   * Create a new clan with random name and initial dragons
   */
  async createClan(initialDragonCount: number = 6): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      this.wasmService.createClan(initialDragonCount);
      const stats = this.wasmService.getClanStats();
      if (stats) {
        this.emit({
          type: 'clan-created',
          clanName: stats.name,
          dragonCount: stats.dragonCount,
        });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to create clan', error: err });
      throw err;
    }
  }

  /**
   * Get all dragons in the clan
   */
  getDragons(): DragonInfo[] {
    return this.wasmService.getDragons();
  }

  /**
   * Get a specific dragon by index
   */
  getDragon(index: number): DragonInfo | null {
    return this.wasmService.getDragon(index);
  }

  /**
   * Add a random dragon to the clan
   */
  async addRandomDragon(): Promise<DragonInfo> {
    try {
      const dragon = this.wasmService.addRandomDragon();
      if (!dragon) {
        throw new Error('Failed to add dragon');
      }
      this.emit({ type: 'dragon-added', dragon });
      return dragon;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to add dragon', error: err });
      throw err;
    }
  }

  /**
   * Add a dragon with specific attributes
   */
  async addDragon(name: string, element: DragonElement, age: number): Promise<DragonInfo> {
    try {
      const dragon = this.wasmService.addDragon(name, element, age);
      if (!dragon) {
        throw new Error('Failed to add dragon');
      }
      this.emit({ type: 'dragon-added', dragon });
      return dragon;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to add dragon', error: err });
      throw err;
    }
  }

  /**
   * Remove a dragon by index
   */
  async removeDragon(index: number): Promise<boolean> {
    try {
      const dragon = this.wasmService.getDragon(index);
      const success = this.wasmService.removeDragon(index);
      if (success && dragon) {
        this.emit({ type: 'dragon-removed', dragonName: dragon.name });
      }
      return success;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to remove dragon', error: err });
      return false;
    }
  }

  /**
   * Simulate a single interaction between dragons
   */
  async simulateInteraction(): Promise<InteractionEvent | null> {
    try {
      const event = this.wasmService.simulateInteraction();
      if (event) {
        this.emit({ type: 'interaction-simulated', event });
      }
      return event;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to simulate interaction', error: err });
      return null;
    }
  }

  /**
   * Simulate multiple interactions
   */
  async simulateInteractions(count: number): Promise<InteractionEvent[]> {
    try {
      const events = this.wasmService.simulateInteractions(count);
      events.forEach(event => {
        this.emit({ type: 'interaction-simulated', event });
      });
      return events;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to simulate interactions', error: err });
      return [];
    }
  }

  /**
   * Reset the clan (clear and create new)
   */
  async resetClan(initialDragonCount: number = 6): Promise<void> {
    try {
      this.wasmService.resetClan(initialDragonCount);
      const stats = this.wasmService.getClanStats();
      if (stats) {
        this.emit({
          type: 'clan-reset',
          clanName: stats.name,
          dragonCount: stats.dragonCount,
        });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to reset clan', error: err });
      throw err;
    }
  }

  /**
   * Get clan statistics
   */
  getClanStats(): ClanStats | null {
    return this.wasmService.getClanStats();
  }

  /**
   * Get relationship info between two dragons
   */
  getRelationshipInfo(dragon1Index: number, dragon2Index: number): string | null {
    return this.wasmService.getRelationshipInfo(dragon1Index, dragon2Index);
  }

  /**
   * Get opinion of dragon1 about dragon2
   */
  getOpinion(dragon1Index: number, dragon2Index: number): number | null {
    return this.wasmService.getOpinion(dragon1Index, dragon2Index);
  }

  /**
   * Get character info for a dragon
   */
  getDragonCharacterInfo(index: number): string | null {
    return this.wasmService.getDragonCharacterInfo(index);
  }

  /**
   * Subscribe to service events
   */
  on(event: ClanServiceEvent['type'], listener: ClanServiceEventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  /**
   * Unsubscribe from service events
   */
  off(event: ClanServiceEvent['type'], listener: ClanServiceEventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: ClanServiceEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }
}

/**
 * Singleton instance of the ClanService
 * The UI should use this instance
 */
export const clanService = new ClanService();

