# Rust ClanService Implementation

## Overview

The ClanService is implemented in Rust and completely hides the internal `Dragon` and `DragonClan` objects from the TypeScript/UI layer. This provides better encapsulation and ensures the UI can only interact with dragons through the service interface.

For general information about the Rust backend architecture, see [rust-backend.md](rust-backend.md). For the service layer architecture, see [service-layer-architecture.md](service-layer-architecture.md).

## Architecture

```
┌─────────────────────────────────────┐
│         UI Layer (app.ts)           │
│  - Event handlers                   │
│  - DOM manipulation                 │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│  TypeScript Service (optional)      │
│  - Event forwarding                 │
│  - Error handling                   │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│  TypeScript Wrapper (wasm-wrapper)  │
│  - Thin TypeScript-friendly API     │
└──────────────┬──────────────────────┘
               │
               │ WASM Bindings
               ▼
┌─────────────────────────────────────┐
│    Rust ClanService                 │
│  - Main business logic              │
│  - Event emission                   │
│  - Hides Dragon/DragonClan          │
└──────────────┬──────────────────────┘
               │
               │ Uses
               ▼
┌─────────────────────────────────────┐
│    Notification System               │
│  - Generic event system              │
│  - JavaScript callback management    │
└─────────────────────────────────────┘
               │
               │ Uses (internal)
               ▼
┌─────────────────────────────────────┐
│    Rust Internal Objects            │
│  - Dragon (not exported)            │
│  - DragonClan (not exported)        │
└─────────────────────────────────────┘
```

## Implementation Details

### Rust Side

1. **ClanService** (`rust/src/clan_service.rs`) - Main service struct exposed to WASM
   - Wraps `DragonClan` internally (not exposed)
   - Never exposes `Dragon` objects directly
   - Emits events through the notification system for state changes

2. **NotificationService** (`rust/src/notification.rs`) - Generic event system
   - Manages JavaScript callback subscriptions
   - Provides `subscribe_to_event` and `unsubscribe_from_event` functions
   - Used by ClanService to emit events to TypeScript

3. **DragonInfo** - Read-only dragon data structure
   - Exposed to TypeScript instead of `Dragon`
   - Contains: name, element, age, interactionStyle

4. **InteractionEvent** - Interaction results with indices
   - Contains: description, dragon1Index, dragon2Index, opinionChange
   - Uses indices instead of Dragon objects

5. **ClanStats** - Clan statistics
   - Contains: name, dragonCount

### TypeScript Side

1. **wasm-wrapper.ts** - Thin wrapper around Rust service
   - Provides TypeScript-friendly interfaces
   - Converts WASM types to TypeScript types
   - Exposes `subscribeToEvent` and `unsubscribeFromEvent` for Rust events
   - Exports `EventType` enum for event type constants

2. **services/clan-service.ts** - Service layer with event forwarding
   - Subscribes to Rust events on initialization
   - Forwards Rust events to TypeScript listeners
   - Maintains backward compatibility with existing event API
   - Handles error events (emitted by TypeScript layer)

## Exported Types

From Rust, only these are exported:
- `ClanService` - The main service
- `DragonInfo` - Read-only dragon data
- `InteractionEvent` - Interaction results
- `ClanStats` - Clan statistics
- `DragonElement` - Element enum (still needed)
- `EventType` - Event type enum for the notification system
- `subscribe_to_event()` - Subscribe to Rust events
- `unsubscribe_from_event()` - Unsubscribe from Rust events
- `generate_dragon_name()` - Name generator
- `generate_clan_name()` - Clan name generator

**NOT exported:**
- `Dragon` - Completely hidden
- `DragonClan` - Completely hidden
- `NotificationService` - Internal implementation detail
- Internal Rust types

## Usage Example

```typescript
import { ClanService } from './wasm-wrapper.js';
import { initWasm } from './wasm-wrapper.js';

// Initialize
await initWasm();

// Create service
const service = new ClanService();
service.createClan(6);

// Get dragons (returns DragonInfo[], not Dragon[])
const dragons = service.getDragons();
dragons.forEach(dragon => {
  console.log(dragon.name, dragon.element);
});

// Simulate interactions
const events = service.simulateInteractions(10);
events.forEach(event => {
  console.log(event.description);
  // Access dragons by index
  const dragon1 = service.getDragon(event.dragon1Index);
  const dragon2 = service.getDragon(event.dragon2Index);
});
```

## Benefits

1. **Encapsulation** - Internal objects completely hidden
2. **Type Safety** - Clear interface boundaries
3. **Performance** - Logic stays in Rust
4. **Maintainability** - Changes to internal structure don't affect UI
5. **Security** - UI can't directly manipulate internal state

## API Usage

All operations must go through `ClanService`. The service returns `DragonInfo` objects (read-only data) rather than `Dragon` objects:

```typescript
// Create service and clan
const service = new ClanService();
await service.initialize();
service.createClan(6);

// Add a dragon - returns DragonInfo, not Dragon
const dragonInfo = await service.addDragon(name, element, age);

// Access dragon data through DragonInfo
console.log(dragonInfo.name, dragonInfo.element, dragonInfo.age);
```

## Building

After making changes to Rust code, rebuild the WASM package:

```bash
cd rust
wasm-pack build --target web
```

Or use the npm script:

```bash
npm run build:wasm
```

This will regenerate the WASM bindings. The dev server (Vite) will automatically pick up the changes via hot-reload.

**Note:** Make sure to source your Rust environment if needed:
```bash
source ~/.bashrc
source ~/.cargo/env
```

