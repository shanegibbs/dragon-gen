use crate::dragon::DragonElement;
use crate::values::{DragonValues, generate_dragon_values};

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
pub struct DragonCharacter {
    pub traits: CharacterTraits,
    pub values: DragonValues,
}

impl DragonCharacter {
    pub fn new(
        traits: Option<CharacterTraits>,
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
            values: values.unwrap_or_else(|| generate_dragon_values(None)),
        }
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

    let values = generate_dragon_values(element);

    // Element-based character adjustments
    if let Some(element) = element {
        match element {
            DragonElement::Fire => {
                traits.aggression = (traits.aggression + 20).min(100);
                traits.dominance = (traits.dominance + 15).min(100);
            }
            DragonElement::Water => {
                traits.patience = (traits.patience + 20).min(100);
                traits.friendliness = (traits.friendliness + 15).min(100);
            }
            DragonElement::Earth => {
                traits.patience = (traits.patience + 25).min(100);
                traits.curiosity = traits.curiosity.saturating_sub(15);
            }
            DragonElement::Wind => {
                traits.curiosity = (traits.curiosity + 20).min(100);
                traits.playfulness = (traits.playfulness + 15).min(100);
            }
            DragonElement::Lightning => {
                traits.aggression = (traits.aggression + 15).min(100);
                traits.curiosity = (traits.curiosity + 20).min(100);
            }
            DragonElement::Ice => {
                traits.sociability = traits.sociability.saturating_sub(20);
                traits.patience = (traits.patience + 25).min(100);
            }
        }
    }

    DragonCharacter::new(Some(traits), Some(values))
}

