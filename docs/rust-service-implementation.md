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
│  - Event emission                   │
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
│  - Hides Dragon/DragonClan          │
└──────────────┬──────────────────────┘
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

### Rust Side (`rust/src/clan_service.rs`)

1. **ClanService** - Main service struct exposed to WASM
   - Wraps `DragonClan` internally (not exposed)
   - Never exposes `Dragon` objects directly

2. **DragonInfo** - Read-only dragon data structure
   - Exposed to TypeScript instead of `Dragon`
   - Contains: name, element, age, energy, mood, interactionStyle

3. **InteractionEvent** - Interaction results with indices
   - Contains: description, dragon1Index, dragon2Index, opinionChange
   - Uses indices instead of Dragon objects

4. **ClanStats** - Clan statistics
   - Contains: name, dragonCount

### TypeScript Side

1. **wasm-wrapper.ts** - Thin wrapper around Rust service
   - Provides TypeScript-friendly interfaces
   - Converts WASM types to TypeScript types

2. **services/clan-service.ts** - Optional event layer
   - Adds event emission
   - Can be used directly or bypassed

## Exported Types

From Rust, only these are exported:
- `ClanService` - The main service
- `DragonInfo` - Read-only dragon data
- `InteractionEvent` - Interaction results
- `ClanStats` - Clan statistics
- `DragonElement` - Element enum (still needed)
- `generate_dragon_name()` - Name generator
- `generate_clan_name()` - Clan name generator

**NOT exported:**
- `Dragon` - Completely hidden
- `DragonClan` - Completely hidden
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

