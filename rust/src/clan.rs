use wasm_bindgen::prelude::*;
use crate::dragon::{Dragon, InteractionResult};

/// Interaction result with dragon indices
/// This is used internally and not exposed to WASM
pub struct InteractionWithIndices {
    pub dragon1_idx: usize,
    pub dragon2_idx: usize,
    pub result: InteractionResult,
}

#[wasm_bindgen]
pub struct DragonClan {
    name: String,
    dragons: Vec<Dragon>,
}

#[wasm_bindgen]
impl DragonClan {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String) -> Self {
        DragonClan {
            name,
            dragons: vec![],
        }
    }

    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn add_dragon(&mut self, dragon: Dragon) {
        self.dragons.push(dragon);
    }

    #[wasm_bindgen]
    pub fn get_dragon_count(&self) -> usize {
        self.dragons.len()
    }

    #[wasm_bindgen]
    pub fn get_dragon(&self, index: usize) -> Option<Dragon> {
        self.dragons.get(index).cloned()
    }

    pub fn remove_dragon(&mut self, index: usize) -> bool {
        if index < self.dragons.len() {
            self.dragons.remove(index);
            true
        } else {
            false
        }
    }

    pub fn clear(&mut self) {
        self.dragons.clear();
    }

    pub fn simulate_interactions(&mut self, count: usize) -> Vec<InteractionResult> {
        let mut interactions = Vec::new();
        
        if self.dragons.len() < 2 {
            return interactions;
        }

        use rand::Rng;
        let mut rng = rand::thread_rng();

        for _ in 0..count {
            let dragon1_idx = rng.gen_range(0..self.dragons.len());
            let mut dragon2_idx = rng.gen_range(0..self.dragons.len());
            while dragon2_idx == dragon1_idx {
                dragon2_idx = rng.gen_range(0..self.dragons.len());
            }

            // We need to get mutable references, but Rust's borrow checker makes this tricky
            // We'll use indices and unsafe, or restructure. For now, let's use a different approach.
            // Actually, we need to restructure this to work with WASM bindings.
            // Let's create a method that takes indices.
            let result = self.simulate_interaction_between(dragon1_idx, dragon2_idx);
            if let Some(interaction) = result {
                interactions.push(interaction);
            }
        }

        interactions
    }

    fn simulate_interaction_between(&mut self, idx1: usize, idx2: usize) -> Option<InteractionResult> {
        if idx1 >= self.dragons.len() || idx2 >= self.dragons.len() || idx1 == idx2 {
            return None;
        }

        // The interaction system now handles both sides internally
        // Dragon1 generates a communication, and we simulate the response
        let dragon2_clone = self.dragons[idx2].clone();
        let result = {
            let dragon1 = &mut self.dragons[idx1];
            dragon1.interact_with(&dragon2_clone)
        };

        // Update dragon2's opinion based on the interaction
        // The interact_with method already handles the receiver's response internally,
        // but we need to update dragon2's relationship as well
        {
            let dragon1_clone = self.dragons[idx1].clone();
            let description = result.description();
            // Use the opinion change from the result (which is the receiver's perspective)
            let dragon2 = &mut self.dragons[idx2];
            dragon2.update_opinion_from_interaction(&dragon1_clone, &description, result.opinion_change());
        }

        Some(result)
    }

    /// Simulate interactions and return results with indices
    /// This is used by the service layer to track which dragons interacted
    /// This is NOT exposed to WASM - it's an internal method
    pub(crate) fn simulate_interactions_with_indices(&mut self, count: usize) -> Vec<InteractionWithIndices> {
        let mut interactions = Vec::new();
        
        if self.dragons.len() < 2 {
            return interactions;
        }

        use rand::Rng;
        let mut rng = rand::thread_rng();

        for _ in 0..count {
            let dragon1_idx = rng.gen_range(0..self.dragons.len());
            let mut dragon2_idx = rng.gen_range(0..self.dragons.len());
            while dragon2_idx == dragon1_idx {
                dragon2_idx = rng.gen_range(0..self.dragons.len());
            }

            if let Some(result) = self.simulate_interaction_between(dragon1_idx, dragon2_idx) {
                interactions.push(InteractionWithIndices {
                    dragon1_idx,
                    dragon2_idx,
                    result,
                });
            }
        }

        interactions
    }

    /// Get opinion of dragon at idx1 about dragon at idx2
    /// This is NOT exposed to WASM - it's an internal method
    /// Returns 0 if no relationship exists yet
    pub(crate) fn get_opinion_by_indices(&self, idx1: usize, idx2: usize) -> Option<i32> {
        if idx1 >= self.dragons.len() || idx2 >= self.dragons.len() || idx1 == idx2 {
            return None;
        }

        let dragon2 = self.dragons[idx2].clone();
        let dragon1 = &self.dragons[idx1];
        Some(dragon1.get_opinion_of(&dragon2))
    }

    /// Get relationship info between two dragons by indices
    /// This is NOT exposed to WASM - it's an internal method
    /// Returns neutral relationship info if no relationship exists yet
    pub(crate) fn get_relationship_info_by_indices(&self, idx1: usize, idx2: usize) -> Option<String> {
        if idx1 >= self.dragons.len() || idx2 >= self.dragons.len() || idx1 == idx2 {
            return None;
        }

        let dragon2 = self.dragons[idx2].clone();
        let dragon1 = &self.dragons[idx1];
        Some(dragon1.get_relationship_info(&dragon2))
    }
}


