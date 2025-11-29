use wasm_bindgen::prelude::*;

mod dragon;
mod character;
mod values;
mod relationship;
mod clan;
mod name_generator;
mod notification;
mod clan_service;

// Export only what the UI needs - hide internal implementation
pub use dragon::DragonElement; // Type definitions for elements
pub use dragon::InteractionResult; // Used internally by clan_service, kept for compatibility
pub use name_generator::{generate_dragon_name, generate_clan_name};

// Export the service - this is the main interface
pub use clan_service::*;
// Export notification system
pub use notification::{EventType, subscribe_to_event, unsubscribe_from_event};


#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, dragon-gen!");
}
