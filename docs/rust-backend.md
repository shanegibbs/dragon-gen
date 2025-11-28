# Rust Backend Architecture

The Dragon Clan Simulator backend has been converted from TypeScript to Rust and compiled to WebAssembly (WASM) for improved performance.

## Overview

All core game logic runs in Rust and is compiled to WebAssembly, allowing it to run at near-native speed in the browser. The TypeScript frontend provides a wrapper layer that maintains compatibility with the original API.

## Architecture

### Rust Modules

- **`dragon.rs`** - Dragon entity, interactions, and relationship management
- **`character.rs`** - Character traits, preferences, and compatibility calculations
- **`values.rs`** - Dragon values and value alignment calculations
- **`relationship.rs`** - Relationship state and opinion tracking
- **`clan.rs`** - Clan management and interaction simulation
- **`name_generator.rs`** - Name generation for dragons and clans

### WASM Bindings

The Rust code uses `wasm-bindgen` to create JavaScript-compatible bindings. The generated bindings are in `rust/pkg/`.

### TypeScript Wrapper

The `wasm-wrapper.ts` file provides a TypeScript interface that:
- Initializes the WASM module
- Wraps Rust types in TypeScript classes
- Maintains API compatibility with the original TypeScript implementation

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

## Migration Notes

The original TypeScript backend files are still present but are no longer used:
- `src/dragon.ts` (replaced by `rust/src/dragon.rs`)
- `src/character.ts` (replaced by `rust/src/character.rs`)
- `src/values.ts` (replaced by `rust/src/values.rs`)
- `src/relationship.ts` (replaced by `rust/src/relationship.rs`)
- `src/clan.ts` (replaced by `rust/src/clan.rs`)
- `src/nameGenerator.ts` (replaced by `rust/src/name_generator.rs`)

These files are kept for reference but should not be imported directly.

