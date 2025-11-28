use wasm_bindgen::prelude::*;

mod dragon;
mod character;
mod values;
mod relationship;
mod clan;
mod name_generator;

pub use dragon::*;
pub use character::*;
pub use values::*;
pub use relationship::*;
pub use clan::*;
pub use name_generator::*;


#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, dragon-gen!");
}
