import { 
  ClanService as WasmClanService, 
  DragonInfo, 
  DragonElement, 
  InteractionEvent, 
  ClanStats, 
  initWasm,
  EventType,
  subscribeToEvent,
  unsubscribeFromEvent,
} from '../wasm-wrapper.js';

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
  private rustEventCallbacks: Map<typeof EventType[keyof typeof EventType], (event: any) => void> = new Map();

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
      this.setupRustEventSubscriptions();
      this.initialized = true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit({ type: 'error', message: 'Failed to initialize WASM', error: err });
      throw err;
    }
  }

  /**
   * Set up subscriptions to Rust events and forward them to TypeScript listeners
   */
  private setupRustEventSubscriptions(): void {
    // Map Rust event types to TypeScript event types
    const eventMappings: Array<{ rust: typeof EventType[keyof typeof EventType]; ts: ClanServiceEvent['type'] }> = [
      { rust: EventType.ClanCreated, ts: 'clan-created' },
      { rust: EventType.DragonAdded, ts: 'dragon-added' },
      { rust: EventType.DragonRemoved, ts: 'dragon-removed' },
      { rust: EventType.InteractionSimulated, ts: 'interaction-simulated' },
      { rust: EventType.ClanReset, ts: 'clan-reset' },
    ];

    for (const mapping of eventMappings) {
      const callback = (rustEvent: any) => {
        // Convert Rust event format to TypeScript event format
        let tsEvent: ClanServiceEvent;
        
        switch (mapping.ts) {
          case 'clan-created':
            tsEvent = {
              type: 'clan-created',
              clanName: rustEvent.clanName || '',
              dragonCount: rustEvent.dragonCount || 0,
            };
            break;
          case 'dragon-added':
            tsEvent = {
              type: 'dragon-added',
              dragon: rustEvent.dragon,
            };
            break;
          case 'dragon-removed':
            tsEvent = {
              type: 'dragon-removed',
              dragonName: rustEvent.dragonName || '',
            };
            break;
          case 'interaction-simulated':
            tsEvent = {
              type: 'interaction-simulated',
              event: rustEvent.event,
            };
            break;
          case 'clan-reset':
            tsEvent = {
              type: 'clan-reset',
              clanName: rustEvent.clanName || '',
              dragonCount: rustEvent.dragonCount || 0,
            };
            break;
          default:
            return; // Unknown event type
        }
        
        this.emit(tsEvent);
      };
      
      this.rustEventCallbacks.set(mapping.rust, callback);
      subscribeToEvent(mapping.rust, callback);
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
      // Event is emitted by Rust code
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
      // Event is emitted by Rust code
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
      // Event is emitted by Rust code
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
      const success = this.wasmService.removeDragon(index);
      // Event is emitted by Rust code
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
      // Event is emitted by Rust code
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
      // Events are emitted by Rust code
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
      // Event is emitted by Rust code
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
   * Cleanup: unsubscribe from Rust events
   */
  private cleanup(): void {
    for (const [eventType, callback] of this.rustEventCallbacks.entries()) {
      unsubscribeFromEvent(eventType, callback);
    }
    this.rustEventCallbacks.clear();
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

