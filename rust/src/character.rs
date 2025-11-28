use crate::dragon::DragonElement;
use crate::values::{DragonValues, generate_dragon_values, calculate_value_alignment};

#[derive(Debug, Clone, Copy)]
pub struct CharacterTraits {
    pub friendliness: u32,
    pub aggression: u32,
    pub sociability: u32,
    pub curiosity: u32,
    pub playfulness: u32,
    pub dominance: u32,
    pub patience: u32,
}

#[derive(Debug, Clone)]
pub struct CharacterPreferences {
    pub preferred_elements: Vec<DragonElement>,
    pub disliked_elements: Vec<DragonElement>,
    pub preferred_traits: Vec<String>,
    pub disliked_traits: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct DragonCharacter {
    pub traits: CharacterTraits,
    pub preferences: CharacterPreferences,
    pub values: DragonValues,
}

impl DragonCharacter {
    pub fn new(
        traits: Option<CharacterTraits>,
        preferences: Option<CharacterPreferences>,
        values: Option<DragonValues>,
    ) -> Self {
        DragonCharacter {
            traits: traits.unwrap_or_else(|| CharacterTraits {
                friendliness: random_trait(),
                aggression: random_trait(),
                sociability: random_trait(),
                curiosity: random_trait(),
                playfulness: random_trait(),
                dominance: random_trait(),
                patience: random_trait(),
            }),
            preferences: preferences.unwrap_or_else(|| CharacterPreferences {
                preferred_elements: vec![],
                disliked_elements: vec![],
                preferred_traits: vec![],
                disliked_traits: vec![],
            }),
            values: values.unwrap_or_else(|| generate_dragon_values(None)),
        }
    }

    pub fn get_compatibility_with(&self, other: &DragonCharacter, other_element: DragonElement) -> i32 {
        let mut score = 0;

        // Trait compatibility
        let trait_pairs = vec![
            ("friendliness", "friendliness"),
            ("sociability", "sociability"),
            ("playfulness", "playfulness"),
            ("patience", "patience"),
        ];

        for (trait1, trait2) in trait_pairs {
            let diff = (get_trait(&self.traits, trait1) as i32 - get_trait(&other.traits, trait2) as i32).abs();
            score += (100 - diff) / 10;
        }

        // Dominance compatibility
        let dominance_diff = (self.traits.dominance as i32 - other.traits.dominance as i32).abs();
        if dominance_diff < 30 {
            score += 10;
        } else if dominance_diff > 70 {
            score += 15;
        }

        // Aggression compatibility
        if self.traits.aggression < 30 && other.traits.aggression < 30 {
            score += 20;
        } else if self.traits.aggression > 70 && other.traits.aggression > 70 {
            score -= 30;
        }

        // Element preferences
        if self.preferences.preferred_elements.contains(&other_element) {
            score += 25;
        }
        if self.preferences.disliked_elements.contains(&other_element) {
            score -= 30;
        }

        // Trait preferences
        for preferred_trait in &self.preferences.preferred_traits {
            if get_trait(&other.traits, preferred_trait) > 60 {
                score += 10;
            }
        }

        for disliked_trait in &self.preferences.disliked_traits {
            if get_trait(&other.traits, disliked_trait) > 60 {
                score -= 15;
            }
        }

        // Value alignment (30% weight)
        let value_alignment = calculate_value_alignment(&self.values, &other.values);
        score += (value_alignment as f64 * 0.3) as i32;

        // Normalize to -100 to 100 range
        score.max(-100).min(100)
    }

    pub fn get_interaction_style(&self) -> String {
        if self.traits.aggression > 70 {
            "aggressive".to_string()
        } else if self.traits.friendliness > 70 && self.traits.playfulness > 60 {
            "playful".to_string()
        } else if self.traits.friendliness > 70 {
            "friendly".to_string()
        } else if self.traits.sociability < 30 {
            "shy".to_string()
        } else if self.traits.curiosity > 70 {
            "curious".to_string()
        } else {
            "serious".to_string()
        }
    }

    pub fn traits(&self) -> &CharacterTraits {
        &self.traits
    }

    pub fn values(&self) -> &DragonValues {
        &self.values
    }
}

fn get_trait(traits: &CharacterTraits, name: &str) -> u32 {
    match name {
        "friendliness" => traits.friendliness,
        "aggression" => traits.aggression,
        "sociability" => traits.sociability,
        "curiosity" => traits.curiosity,
        "playfulness" => traits.playfulness,
        "dominance" => traits.dominance,
        "patience" => traits.patience,
        _ => 0,
    }
}

fn random_trait() -> u32 {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let value1 = rng.gen_range(0..=100);
    let value2 = rng.gen_range(0..=100);
    ((value1 + value2) / 2) as u32
}

pub fn generate_random_character(element: Option<DragonElement>) -> DragonCharacter {
    let mut traits = CharacterTraits {
        friendliness: random_trait(),
        aggression: random_trait(),
        sociability: random_trait(),
        curiosity: random_trait(),
        playfulness: random_trait(),
        dominance: random_trait(),
        patience: random_trait(),
    };

    let mut preferences = CharacterPreferences {
        preferred_elements: vec![],
        disliked_elements: vec![],
        preferred_traits: vec![],
        disliked_traits: vec![],
    };

    let values = generate_dragon_values(element);

    // Element-based character adjustments
    if let Some(element) = element {
        match element {
            DragonElement::Fire => {
                traits.aggression = (traits.aggression + 20).min(100);
                traits.dominance = (traits.dominance + 15).min(100);
                preferences.preferred_elements = vec![DragonElement::Fire, DragonElement::Lightning];
                preferences.disliked_elements = vec![DragonElement::Water, DragonElement::Ice];
            }
            DragonElement::Water => {
                traits.patience = (traits.patience + 20).min(100);
                traits.friendliness = (traits.friendliness + 15).min(100);
                preferences.preferred_elements = vec![DragonElement::Water, DragonElement::Ice];
                preferences.disliked_elements = vec![DragonElement::Fire, DragonElement::Lightning];
            }
            DragonElement::Earth => {
                traits.patience = (traits.patience + 25).min(100);
                traits.curiosity = traits.curiosity.saturating_sub(15);
                preferences.preferred_elements = vec![DragonElement::Earth, DragonElement::Wind];
            }
            DragonElement::Wind => {
                traits.curiosity = (traits.curiosity + 20).min(100);
                traits.playfulness = (traits.playfulness + 15).min(100);
                preferences.preferred_elements = vec![DragonElement::Wind, DragonElement::Lightning];
            }
            DragonElement::Lightning => {
                traits.aggression = (traits.aggression + 15).min(100);
                traits.curiosity = (traits.curiosity + 20).min(100);
                preferences.preferred_elements = vec![DragonElement::Lightning, DragonElement::Fire];
                preferences.disliked_elements = vec![DragonElement::Earth];
            }
            DragonElement::Ice => {
                traits.sociability = traits.sociability.saturating_sub(20);
                traits.patience = (traits.patience + 25).min(100);
                preferences.preferred_elements = vec![DragonElement::Ice, DragonElement::Water];
                preferences.disliked_elements = vec![DragonElement::Fire];
            }
        }
    }

    DragonCharacter::new(Some(traits), Some(preferences), Some(values))
}

