use wasm_bindgen::prelude::*;
use crate::character::{DragonCharacter, generate_random_character};
use crate::relationship::Relationship;
use crate::communication::{generate_communication, process_communication, Communication, CommunicationResponse};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[wasm_bindgen]
pub enum DragonElement {
    Fire,
    Water,
    Earth,
    Wind,
    Lightning,
    Ice,
}

impl DragonElement {
    pub fn as_str(&self) -> &'static str {
        match self {
            DragonElement::Fire => "Fire",
            DragonElement::Water => "Water",
            DragonElement::Earth => "Earth",
            DragonElement::Wind => "Wind",
            DragonElement::Lightning => "Lightning",
            DragonElement::Ice => "Ice",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "Fire" => Some(DragonElement::Fire),
            "Water" => Some(DragonElement::Water),
            "Earth" => Some(DragonElement::Earth),
            "Wind" => Some(DragonElement::Wind),
            "Lightning" => Some(DragonElement::Lightning),
            "Ice" => Some(DragonElement::Ice),
            _ => None,
        }
    }
}

// Helper function to convert string to DragonElement
pub fn element_from_str(s: &str) -> Option<DragonElement> {
    DragonElement::from_str(s)
}

#[wasm_bindgen]
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct InteractionResult {
    description: String,
    opinion_change: i32,
}

#[wasm_bindgen]
impl InteractionResult {
    #[wasm_bindgen(constructor)]
    pub fn new(description: String, opinion_change: i32) -> Self {
        InteractionResult {
            description,
            opinion_change,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn description(&self) -> String {
        self.description.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn opinion_change(&self) -> i32 {
        self.opinion_change
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Dragon {
    name: String,
    element: DragonElement,
    age: u32,
    energy: u32,
    mood: String,
    character: DragonCharacter,
    relationships: HashMap<String, Relationship>,
}

#[wasm_bindgen]
impl Dragon {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, element_str: String, age: u32) -> Self {
        let element = DragonElement::from_str(&element_str)
            .unwrap_or(DragonElement::Fire);
        let character = generate_random_character(Some(element));
        
        Dragon {
            name,
            element,
            age,
            energy: 100,
            mood: "content".to_string(),
            character,
            relationships: HashMap::new(),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn element(&self) -> String {
        self.element.as_str().to_string()
    }

    #[wasm_bindgen(getter)]
    pub fn age(&self) -> u32 {
        self.age
    }

    #[wasm_bindgen(getter)]
    pub fn energy(&self) -> u32 {
        self.energy
    }

    #[wasm_bindgen(getter)]
    pub fn mood(&self) -> String {
        self.mood.clone()
    }

    /// Get existing relationship, or None if no relationship exists yet
    /// Relationships are only created through actual interactions
    fn get_relationship(&self, other: &Dragon) -> Option<&Relationship> {
        let other_name = other.name.clone();
        self.relationships.get(&other_name)
    }

    /// Get mutable relationship, creating it only if it doesn't exist
    /// This should only be called during actual interactions
    fn get_or_create_relationship(&mut self, other: &Dragon) -> &mut Relationship {
        let other_name = other.name.clone();
        self.relationships.entry(other_name.clone())
            .or_insert_with(|| Relationship::new())
    }

    /// Get opinion of another dragon
    /// Returns 0 (neutral) if no relationship exists yet
    pub fn get_opinion_of(&self, other: &Dragon) -> i32 {
        self.get_relationship(other)
            .map(|r| r.opinion())
            .unwrap_or(0)
    }

    pub fn update_opinion_from_interaction(
        &mut self,
        other: &Dragon,
        interaction_description: &str,
        base_opinion_change: i32,
    ) {
        let relationship = self.get_or_create_relationship(other);
        relationship.update_opinion(base_opinion_change, interaction_description);
    }

    /// Generate a communication to send to another dragon
    /// The communication is based on this dragon's values and traits
    /// Internal method - not exposed to WASM
    fn communicate_with(&self, other: &Dragon) -> Communication {
        let existing_opinion = self.get_opinion_of(other);
        let sender_name = self.name.clone();
        let receiver_name = other.name.clone();
        generate_communication(
            self.character.values(),
            self.character.traits(),
            &sender_name,
            &receiver_name,
            self.element.as_str(),
            other.element.as_str(),
            existing_opinion,
        )
    }

    /// Interact with another dragon using the communication system
    pub fn interact_with(&mut self, other: &Dragon) -> InteractionResult {
        // Generate communication from this dragon
        let communication = self.communicate_with(other);
        
        // Process the communication from the other dragon's perspective
        // We need to clone to avoid borrow checker issues, then update the original
        let other_name = other.name.clone();
        let sender_name = self.name.clone();
        let existing_opinion = self.get_opinion_of(other);
        let response = process_communication(
            &communication,
            other.character.values(),
            other.character.traits(),
            &other_name,
            &sender_name,
            existing_opinion,
        );

        // Update this dragon's opinion based on the response
        // The sender's opinion changes based on how their communication was received
        let sender_opinion_change = calculate_sender_opinion_change(&communication, &response);
        let relationship = self.get_or_create_relationship(other);
        let description = format!("{}: {} | {}: {}", 
            sender_name, communication.content,
            other_name, response.response_content
        );
        relationship.update_opinion(sender_opinion_change, &description);

        // Create combined description for display
        let full_description = format!("{} → {}: {} | {} → {}: {} ({})",
            sender_name, other_name, communication.content,
            other_name, sender_name, response.response_content,
            response.interpretation
        );

        InteractionResult::new(full_description, response.opinion_change)
    }

    pub fn rest(&mut self) {
        self.energy = (self.energy + 20).min(100);
        if self.energy > 80 {
            self.mood = "happy".to_string();
        }
    }

    pub fn get_info(&self) -> String {
        let style = self.character.get_interaction_style();
        format!(
            "{} - {} Dragon, Age: {}, Energy: {}%, Mood: {}, Style: {}",
            self.name, self.element.as_str(), self.age, self.energy, self.mood, style
        )
    }

    pub fn get_character_info(&self) -> String {
        let traits = self.character.traits();
        let values = self.character.values();
        let style = self.character.get_interaction_style();
        
        let mut trait_entries: Vec<(String, u32)> = vec![
            ("Friendliness".to_string(), traits.friendliness),
            ("Aggression".to_string(), traits.aggression),
            ("Sociability".to_string(), traits.sociability),
            ("Curiosity".to_string(), traits.curiosity),
            ("Playfulness".to_string(), traits.playfulness),
            ("Dominance".to_string(), traits.dominance),
            ("Patience".to_string(), traits.patience),
        ];
        trait_entries.sort_by(|a, b| b.1.cmp(&a.1));
        
        let mut value_entries: Vec<(String, u32)> = vec![
            ("Honor".to_string(), values.honor),
            ("Freedom".to_string(), values.freedom),
            ("Tradition".to_string(), values.tradition),
            ("Growth".to_string(), values.growth),
            ("Community".to_string(), values.community),
            ("Achievement".to_string(), values.achievement),
            ("Harmony".to_string(), values.harmony),
            ("Power".to_string(), values.power),
            ("Wisdom".to_string(), values.wisdom),
            ("Protection".to_string(), values.protection),
        ];
        value_entries.sort_by(|a, b| b.1.cmp(&a.1));
        
        let traits_str: String = trait_entries.iter()
            .map(|(key, value)| format!("  {}: {}/100", key, value))
            .collect::<Vec<_>>()
            .join("\n");
        
        let values_str: String = value_entries.iter()
            .map(|(key, value)| format!("  {}: {}/100", key, value))
            .collect::<Vec<_>>()
            .join("\n");
        
        format!(
            "{}'s Details:\n  Element: {}\n  Age: {}\n  Energy: {}%\n  Mood: {}\n\n  Character:\n  Style: {}\n\n  Traits:\n{}\n\n  Values:\n{}",
            self.name, self.element.as_str(), self.age, self.energy, self.mood, style, traits_str, values_str
        )
    }

    pub fn get_relationship_info(&self, other: &Dragon) -> String {
        if let Some(relationship) = self.get_relationship(other) {
            let status = relationship.get_relationship_status();
            let description = relationship.get_relationship_description();
            format!(
                "{} {} ({}/100, {} interactions)",
                status, description, relationship.opinion(), relationship.interaction_count()
            )
        } else {
            "😐 neutral (0/100, 0 interactions)".to_string()
        }
    }

    #[wasm_bindgen]
    pub fn get_interaction_style(&self) -> String {
        self.character.get_interaction_style()
    }
}

/// Calculate how the sender's opinion changes based on the response to their communication
fn calculate_sender_opinion_change(_communication: &Communication, response: &CommunicationResponse) -> i32 {
    use crate::communication::CommunicationTone;
    // If the response is positive, the sender feels good about the communication
    // If negative, the sender may feel rejected or misunderstood
    match response.response_tone {
        CommunicationTone::Positive | CommunicationTone::Warm => {
            // Positive response makes sender feel good
            (response.opinion_change as f64 * 0.5) as i32 + 2
        }
        CommunicationTone::Negative | CommunicationTone::Challenging => {
            // Negative response makes sender feel bad
            (response.opinion_change as f64 * 0.3) as i32 - 2
        }
        _ => {
            // Neutral response has minimal impact on sender
            (response.opinion_change as f64 * 0.2) as i32
        }
    }
}

