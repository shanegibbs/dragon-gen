# Service Layer Architecture

## Overview

The service layer provides an abstraction between the UI and the Rust backend. This creates a clean separation of concerns and makes the codebase more maintainable and testable. The service layer uses `DragonInfo` (read-only data structures) rather than exposing internal domain objects.

## Architecture Layers

```
┌─────────────────────────────────────┐
│         UI Layer (app.ts)          │
│  - Event handlers                  │
│  - DOM manipulation                │
│  - User interactions               │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│    Service Layer (clan-service.ts)  │
│  - Business logic orchestration     │
│  - Event emission                   │
│  - Error handling                   │
│  - Higher-level operations          │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│  WASM Wrapper (wasm-wrapper.ts)     │
│  - TypeScript wrappers              │
│  - WASM binding adapters            │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│    Rust/WASM Layer (rust/src/)      │
│  - Core domain logic                │
│  - Dragon/Clan implementations      │
└─────────────────────────────────────┘
```

## Benefits

### 1. **Separation of Concerns**
- UI code focuses on presentation and user interaction
- Service layer handles business logic and orchestration
- Domain objects remain focused on their core responsibilities

### 2. **Testability**
- Service interface can be easily mocked for UI testing
- Domain logic can be tested independently
- Integration tests can test service + domain together

### 3. **Maintainability**
- Changes to domain objects don't directly affect UI
- Service layer can evolve independently
- Clear boundaries make refactoring safer

### 4. **Error Handling**
- Centralized error handling in service layer
- Consistent error reporting to UI
- Better error recovery strategies

### 5. **Event-Driven Architecture**
- Service emits events for state changes
- UI can react to events reactively
- Loose coupling between components

### 6. **Future-Proofing**
- Easy to swap implementations (e.g., different backend)
- Can add caching, persistence, or other cross-cutting concerns
- Can add validation, logging, analytics without touching UI

## Service Interface

The `IClanService` interface defines the contract:

```typescript
interface IClanService {
  initialize(): Promise<void>;
  createClan(initialDragonCount?: number): Promise<void>;
  getDragons(): DragonInfo[];
  getDragon(index: number): DragonInfo | null;
  addRandomDragon(): Promise<DragonInfo>;
  addDragon(name: string, element: DragonElement, age: number): Promise<DragonInfo>;
  removeDragon(index: number): Promise<boolean>;
  simulateInteraction(): Promise<InteractionEvent | null>;
  simulateInteractions(count: number): Promise<InteractionEvent[]>;
  resetClan(initialDragonCount?: number): Promise<void>;
  getClanStats(): ClanStats | null;
  getRelationshipInfo(dragon1Index: number, dragon2Index: number): string | null;
  getOpinion(dragon1Index: number, dragon2Index: number): number | null;
  getDragonCharacterInfo(index: number): string | null;
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
}
```

Note: The service returns `DragonInfo` (read-only data) rather than `Dragon` objects. See [rust-service-implementation.md](rust-service-implementation.md) for details.

## Event System

The service emits events for important state changes:

- `clan-created` - When a new clan is created
- `dragon-added` - When a dragon is added to the clan
- `dragon-removed` - When a dragon is removed
- `interaction-simulated` - When dragons interact
- `clan-reset` - When the clan is reset
- `error` - When an error occurs

## Related Documentation

For implementation details of the Rust ClanService, see [rust-service-implementation.md](rust-service-implementation.md).

For general Rust backend architecture, see [rust-backend.md](rust-backend.md).

## Usage Example

```typescript
import { clanService } from './services/clan-service.js';

// Initialize
await clanService.initialize();

// Create clan
await clanService.createClan(6);

// Subscribe to events
clanService.on('dragon-added', (event) => {
  updateUI();
});

// Use service methods
const stats = clanService.getClanStats();
const interactions = await clanService.simulateInteractions(10);
```

## Testing Benefits

With the service layer, you can easily create mock implementations:

```typescript
class MockClanService implements IClanService {
  // Mock implementation for testing
  async createClan() { /* ... */ }
  // ...
}
```

This allows UI tests to run without WASM initialization.

## Future Enhancements

The service layer can be extended with:

- **Persistence**: Save/load clan state
- **Caching**: Cache dragon data
- **Validation**: Validate operations before execution
- **Analytics**: Track usage patterns
- **Undo/Redo**: History management
- **Multi-clan support**: Manage multiple clans

