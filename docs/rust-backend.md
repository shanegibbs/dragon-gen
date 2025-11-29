# Rust Backend Architecture

## Overview

All core game logic runs in Rust and is compiled to WebAssembly, allowing it to run at near-native speed in the browser. The TypeScript frontend provides a wrapper layer that interfaces with the Rust backend.

## Architecture

The Rust backend consists of several modules that handle different aspects of the game logic. For detailed information about the service layer implementation, see [rust-service-implementation.md](rust-service-implementation.md).

### Rust Modules

- **`dragon.rs`** - Dragon entity, interactions, and relationship management
- **`character.rs`** - Character traits, preferences, and compatibility calculations
- **`values.rs`** - Dragon values and value alignment calculations
- **`relationship.rs`** - Relationship state and opinion tracking
- **`clan.rs`** - Clan management and interaction simulation
- **`name_generator.rs`** - Name generation for dragons and clans
- **`notification.rs`** - Generic notification system for emitting events to JavaScript
- **`clan_service.rs`** - Service layer that exposes clan operations via WASM

### WASM Bindings

The Rust code uses `wasm-bindgen` to create JavaScript-compatible bindings. The generated bindings are in `rust/pkg/`.

### TypeScript Wrapper

The `wasm-wrapper.ts` file provides a TypeScript interface that:
- Initializes the WASM module
- Wraps Rust types in TypeScript classes
- Provides TypeScript-friendly APIs for the Rust backend

## Building

The Rust backend is built using `wasm-pack`:

```bash
cd rust
wasm-pack build --target web
```

This generates:
- `rust/pkg/dragon_gen.js` - JavaScript bindings
- `rust/pkg/dragon_gen_bg.wasm` - WebAssembly binary
- `rust/pkg/dragon_gen.d.ts` - TypeScript definitions

## Performance Benefits

- **Faster execution** - Rust compiled to WASM runs much faster than JavaScript
- **Better memory management** - Rust's ownership system prevents memory leaks
- **Type safety** - Compile-time guarantees about correctness

## Development

When developing, the WASM module is rebuilt automatically when you run `npm run dev`. For faster iteration during Rust development:

```bash
# In one terminal - watch and rebuild WASM
cd rust && wasm-pack build --target web --watch

# In another terminal - run dev server
npm run dev
```

## Related Documentation

For details on the service layer architecture, see [service-layer-architecture.md](service-layer-architecture.md).

For information about the ClanService implementation, see [rust-service-implementation.md](rust-service-implementation.md).

