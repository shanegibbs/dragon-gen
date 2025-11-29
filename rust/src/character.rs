use crate::dragon::DragonElement;
use crate::values::{DragonValues, generate_dragon_values};

#[derive(Debug, Clone, Copy)]
pub struct CharacterTraits {
    // Non-conflicting individual traits (0-100)
    
    /// Warmth and openness toward others
    /// Low (0-30): Reserved, cautious, or standoffish
    /// Medium (31-70): Generally approachable, balanced social behavior
    /// High (71-100): Warm, welcoming, and open to others
    pub friendliness: u32,
    
    /// Preference for social interaction vs solitude
    /// Low (0-30): Prefers solitude, introverted, shy
    /// Medium (31-70): Enjoys some social time, balanced
    /// High (71-100): Thrives in groups, extroverted, seeks company
    pub sociability: u32,
    
    /// Interest in exploring and discovering new things
    /// Low (0-30): Content with familiar things, less exploratory
    /// Medium (31-70): Moderate interest in new experiences
    /// High (71-100): Eager to explore, discover, and learn
    pub curiosity: u32,
    
    /// Tendency toward fun and lightheartedness vs seriousness
    /// Low (0-30): Serious, focused, business-like
    /// Medium (31-70): Can have fun but also serious when needed
    /// High (71-100): Fun-loving, energetic, enjoys games and activities
    pub playfulness: u32,
    
    /// Natural leadership and assertiveness
    /// Low (0-30): Submissive, follows others, prefers not to lead
    /// Medium (31-70): Balanced leadership, can lead or follow
    /// High (71-100): Natural leader, takes charge, assertive
    pub dominance: u32,
    
    // Conflicting pairs represented as axes (0-100)
    // Higher value = more of the first trait, lower = more of the second
    
    /// Aggression (high) vs Patience (low) axis
    /// 0 = max patience (very tolerant, calm, takes time to consider)
    /// 100 = max aggression (confrontational, competitive, quick to challenge)
    /// These traits conflict: you cannot be both quick to challenge and take time to consider
    pub aggression_vs_patience: u32,
}

#[derive(Debug, Clone)]
pub struct DragonCharacter {
    pub traits: CharacterTraits,
    pub values: DragonValues,
}

impl CharacterTraits {
    /// Get individual trait from an axis
    /// For axes where higher = first trait, lower = second trait
    fn get_first_from_axis(axis: u32) -> u32 {
        axis
    }
    
    fn get_second_from_axis(axis: u32) -> u32 {
        100u32.saturating_sub(axis)
    }
    
    // Convenience getters for individual traits (for backward compatibility)
    pub fn aggression(&self) -> u32 {
        Self::get_first_from_axis(self.aggression_vs_patience)
    }
    
    pub fn patience(&self) -> u32 {
        Self::get_second_from_axis(self.aggression_vs_patience)
    }
}

impl DragonCharacter {
    pub fn new(
        traits: Option<CharacterTraits>,
        values: Option<DragonValues>,
    ) -> Self {
        DragonCharacter {
            traits: traits.unwrap_or_else(|| CharacterTraits {
                friendliness: random_trait(),
                sociability: random_trait(),
                curiosity: random_trait(),
                playfulness: random_trait(),
                dominance: random_trait(),
                aggression_vs_patience: random_trait(),
            }),
            values: values.unwrap_or_else(|| generate_dragon_values(None)),
        }
    }

    pub fn get_interaction_style(&self) -> String {
        if self.traits.aggression() > 70 {
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
    // Generate random axis values (0-100)
    // For axes: higher = first trait, lower = second trait
    let mut traits = CharacterTraits {
        friendliness: random_trait(),
        sociability: random_trait(),
        curiosity: random_trait(),
        playfulness: random_trait(),
        dominance: random_trait(),
        aggression_vs_patience: random_trait(),
    };

    let values = generate_dragon_values(element);

    // Element-based character adjustments
    // Adjust axes by moving toward the preferred trait
    if let Some(element) = element {
        match element {
            DragonElement::Fire => {
                // Higher aggression, higher dominance
                traits.aggression_vs_patience = (traits.aggression_vs_patience + 20).min(100);
                traits.dominance = (traits.dominance + 15).min(100);
            }
            DragonElement::Water => {
                // Higher patience, higher friendliness
                traits.aggression_vs_patience = traits.aggression_vs_patience.saturating_sub(20);
                traits.friendliness = (traits.friendliness + 15).min(100);
            }
            DragonElement::Earth => {
                // Higher patience, lower curiosity
                traits.aggression_vs_patience = traits.aggression_vs_patience.saturating_sub(25);
                traits.curiosity = traits.curiosity.saturating_sub(15);
            }
            DragonElement::Wind => {
                // Higher curiosity, higher playfulness
                traits.curiosity = (traits.curiosity + 20).min(100);
                traits.playfulness = (traits.playfulness + 15).min(100);
            }
            DragonElement::Lightning => {
                // Higher aggression, higher curiosity
                traits.aggression_vs_patience = (traits.aggression_vs_patience + 15).min(100);
                traits.curiosity = (traits.curiosity + 20).min(100);
            }
            DragonElement::Ice => {
                // Lower sociability, higher patience
                traits.sociability = traits.sociability.saturating_sub(20);
                traits.aggression_vs_patience = traits.aggression_vs_patience.saturating_sub(25);
            }
        }
    }

    // Ensure all values are in valid range
    traits.friendliness = traits.friendliness.min(100);
    traits.sociability = traits.sociability.min(100);
    traits.curiosity = traits.curiosity.min(100);
    traits.playfulness = traits.playfulness.min(100);
    traits.dominance = traits.dominance.min(100);
    traits.aggression_vs_patience = traits.aggression_vs_patience.min(100);

    DragonCharacter::new(Some(traits), Some(values))
}
