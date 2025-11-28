use wasm_bindgen::prelude::*;
use crate::character::{DragonCharacter, generate_random_character};
use crate::relationship::Relationship;
use crate::values::calculate_value_alignment;
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

    fn get_relationship(&mut self, other: &Dragon) -> &mut Relationship {
        let other_name = other.name.clone();
        if !self.relationships.contains_key(&other_name) {
            let compatibility = self.character.get_compatibility_with(&other.character, other.element);
            let initial_opinion = (compatibility as f64 * 0.3) as i32;
            let target_opinion = (compatibility as f64 * 0.7) as i32;
            self.relationships.insert(
                other_name.clone(),
                Relationship::new(initial_opinion, target_opinion),
            );
        }
        self.relationships.get_mut(&other_name).unwrap()
    }

    pub fn get_opinion_of(&mut self, other: &Dragon) -> i32 {
        let relationship = self.get_relationship(other);
        relationship.opinion()
    }

    pub fn update_opinion_from_interaction(
        &mut self,
        other: &Dragon,
        interaction_description: &str,
        base_opinion_change: i32,
    ) {
        let compatibility = self.character.get_compatibility_with(&other.character, other.element);
        let relationship = self.get_relationship(other);
        let interaction_count = relationship.interaction_count();
        let decay_factor = (1.0 - (interaction_count as f64 * 0.05)).max(0.3);
        let adjusted_change = (base_opinion_change as f64 * decay_factor) as i32;
        relationship.update_opinion(adjusted_change, interaction_description, Some(compatibility));
    }

    pub fn interact_with(&mut self, other: &Dragon) -> InteractionResult {
        let existing_opinion = {
            let relationship = self.get_relationship(other);
            relationship.opinion()
        };
        let compatibility = self.character.get_compatibility_with(&other.character, other.element);
        let my_style = self.character.get_interaction_style();
        let other_style = other.character.get_interaction_style();
        let value_alignment = calculate_value_alignment(&self.character.values(), &other.character.values());

        let opinion_modifier = existing_opinion as f64 / 100.0;
        let adjusted_compatibility = compatibility as f64 + (opinion_modifier * 30.0);
        let value_modifier = value_alignment as f64 / 100.0;
        let final_compatibility = adjusted_compatibility + (value_modifier * 20.0);

        let my_values = self.character.values();
        let other_values = other.character.values();
        let mut value_based_interaction = false;
        let mut description = String::new();
        let mut opinion_change = 0;

        // Value-based interactions
        if my_values.honor > 70 && other_values.honor > 70 && final_compatibility > -20.0 {
            description = format!(
                "{} ({}) and {} ({}) make a solemn promise together - their shared honor creates a bond",
                self.name, self.element.as_str(), other.name, other.element.as_str()
            );
            opinion_change = 10 + if value_alignment > 50 { 5 } else { 0 };
            value_based_interaction = true;
        } else if my_values.community > 70 && other_values.community > 70 && final_compatibility > 0.0 {
            description = format!(
                "{} ({}) and {} ({}) work together for the clan's benefit - their shared values strengthen their bond",
                self.name, self.element.as_str(), other.name, other.element.as_str()
            );
            opinion_change = 8 + if value_alignment > 50 { 4 } else { 0 };
            value_based_interaction = true;
        } else if my_values.harmony > 70 && other_values.harmony > 70 && final_compatibility > -30.0 {
            description = format!(
                "{} ({}) and {} ({}) seek peaceful resolution to a disagreement - their shared value for harmony prevails",
                self.name, self.element.as_str(), other.name, other.element.as_str()
            );
            opinion_change = 6 + if value_alignment > 50 { 3 } else { 0 };
            value_based_interaction = true;
        } else if my_values.wisdom > 70 && other_values.wisdom > 70 && final_compatibility > 0.0 {
            description = format!(
                "{} ({}) and {} ({}) engage in deep philosophical discussion - their shared wisdom creates understanding",
                self.name, self.element.as_str(), other.name, other.element.as_str()
            );
            opinion_change = 7 + if value_alignment > 50 { 3 } else { 0 };
            value_based_interaction = true;
        } else if value_alignment < -30 && final_compatibility < 20.0 {
            if my_values.freedom > 70 && other_values.community > 70 {
                description = format!(
                    "{} ({}) and {} ({}) disagree on priorities - individual freedom vs collective good",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = -5;
                value_based_interaction = true;
            } else if my_values.tradition > 70 && other_values.growth > 70 {
                description = format!(
                    "{} ({}) and {} ({}) debate the value of tradition versus progress",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = -4;
                value_based_interaction = true;
            } else if my_values.power > 70 && other_values.harmony > 70 {
                description = format!(
                    "{} ({}) and {} ({}) clash over approaches - one seeks influence, the other seeks peace",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = -6;
                value_based_interaction = true;
            }
        }

        // Very incompatible interactions
        if !value_based_interaction && final_compatibility < -50.0 {
            if self.character.traits().aggression > 70 {
                description = format!(
                    "{} ({}) confronts {} ({}) - they don't get along",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = -15 - if existing_opinion < 0 { 5 } else { 0 };
            } else if other.character.traits().aggression > 70 {
                description = format!(
                    "{} ({}) avoids {} ({}) - {} seems hostile",
                    self.name, self.element.as_str(), other.name, other.element.as_str(), other.name
                );
                opinion_change = -10;
            } else {
                description = format!(
                    "{} ({}) and {} ({}) keep their distance - awkward silence",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = -5;
            }
        }
        // Incompatible but not hostile
        else if !value_based_interaction && final_compatibility < 0.0 {
            use rand::Rng;
            let mut rng = rand::thread_rng();
            let neutral_interactions = vec![
                format!("{} ({}) exchanges a brief nod with {} ({})", self.name, self.element.as_str(), other.name, other.element.as_str()),
                format!("{} ({}) and {} ({}) have a polite but distant conversation", self.name, self.element.as_str(), other.name, other.element.as_str()),
                format!("{} ({}) acknowledges {} ({}) but doesn't engage much", self.name, self.element.as_str(), other.name, other.element.as_str()),
            ];
            description = neutral_interactions[rng.gen_range(0..neutral_interactions.len())].clone();
            opinion_change = -2 + rng.gen_range(0..4);
        }
        // Compatible interactions
        else if !value_based_interaction && final_compatibility > 50.0 {
            if my_style == "playful" && other_style == "playful" {
                description = format!(
                    "{} ({}) and {} ({}) play an energetic game together!",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = 12 + if existing_opinion > 0 { 3 } else { 0 };
            } else if my_style == "curious" || other_style == "curious" {
                description = format!(
                    "{} ({}) and {} ({}) explore something interesting together",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = 10;
            } else if my_style == "friendly" || other_style == "friendly" {
                description = format!(
                    "{} ({}) and {} ({}) share a warm, friendly conversation",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = 8;
            } else {
                description = format!(
                    "{} ({}) and {} ({}) collaborate effectively on a task",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = 7;
            }
        }
        // Moderate compatibility
        else if !value_based_interaction {
            use rand::Rng;
            let mut rng = rand::thread_rng();
            if my_style == "shy" || other_style == "shy" {
                let shy_interactions = vec![
                    format!("{} ({}) tentatively approaches {} ({})", self.name, self.element.as_str(), other.name, other.element.as_str()),
                    format!("{} ({}) and {} ({}) have a quiet conversation", self.name, self.element.as_str(), other.name, other.element.as_str()),
                ];
                description = shy_interactions[rng.gen_range(0..shy_interactions.len())].clone();
                opinion_change = 3 + rng.gen_range(0..3);
            } else if my_style == "aggressive" && final_compatibility > 0.0 {
                description = format!(
                    "{} ({}) challenges {} ({}) to a friendly competition",
                    self.name, self.element.as_str(), other.name, other.element.as_str()
                );
                opinion_change = 5;
            } else {
                let moderate_interactions = vec![
                    format!("{} ({}) greets {} ({})", self.name, self.element.as_str(), other.name, other.element.as_str()),
                    format!("{} ({}) shares a story with {} ({})", self.name, self.element.as_str(), other.name, other.element.as_str()),
                    format!("{} ({}) and {} ({}) chat about their day", self.name, self.element.as_str(), other.name, other.element.as_str()),
                    format!("{} ({}) helps {} ({}) with something", self.name, self.element.as_str(), other.name, other.element.as_str()),
                ];

                if self.element == DragonElement::Fire && other.element == DragonElement::Water && final_compatibility > 20.0 {
                    description = format!(
                        "{} (Fire) and {} (Water) have an interesting elemental discussion",
                        self.name, other.name
                    );
                    opinion_change = 6;
                } else if self.element == DragonElement::Earth && other.element == DragonElement::Wind && final_compatibility > 20.0 {
                    description = format!(
                        "{} (Earth) and {} (Wind) collaborate on a project",
                        self.name, other.name
                    );
                    opinion_change = 6;
                } else {
                    description = moderate_interactions[rng.gen_range(0..moderate_interactions.len())].clone();
                    opinion_change = 2 + rng.gen_range(0..4);
                }
            }
        }

        {
            let relationship = self.get_relationship(other);
            relationship.update_opinion(opinion_change, &description, Some(compatibility));
        }

        InteractionResult::new(description, opinion_change)
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

    pub fn get_relationship_info(&mut self, other: &Dragon) -> String {
        let relationship = self.get_relationship(other);
        let status = relationship.get_relationship_status();
        let description = relationship.get_relationship_description();
        format!(
            "{} {} ({}/100, {} interactions)",
            status, description, relationship.opinion(), relationship.interaction_count()
        )
    }

    #[wasm_bindgen]
    pub fn get_interaction_style(&self) -> String {
        self.character.get_interaction_style()
    }
}

