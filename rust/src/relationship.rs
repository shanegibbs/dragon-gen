#[derive(Debug, Clone)]
pub struct Relationship {
    opinion: i32,
    interaction_count: u32,
}

impl Relationship {
    /// Create a new relationship starting from neutral (0)
    /// Relationships are only created when dragons actually interact
    pub fn new() -> Self {
        Relationship {
            opinion: 0,
            interaction_count: 0,
        }
    }

    /// Update opinion based purely on interaction
    /// No pre-computed compatibility bias - relationships emerge from interactions
    pub fn update_opinion(&mut self, change: i32) {
        self.interaction_count += 1;

        // Early interactions have more impact, later interactions have diminishing returns
        let decay_factor = (10.0 / (self.interaction_count as f64 + 10.0)).min(0.5);
        let interaction_weight = decay_factor;
        let current_weight = 1.0 - interaction_weight;

        // Apply the opinion change with decay factor
        let interaction_value = self.opinion + change;
        self.opinion = ((self.opinion as f64 * current_weight)
            + (interaction_value as f64 * interaction_weight)) as i32;

        self.opinion = self.opinion.max(-100).min(100);
    }

    pub fn get_relationship_description(&self) -> String {
        if self.opinion >= 80 {
            "close friends".to_string()
        } else if self.opinion >= 50 {
            "friends".to_string()
        } else if self.opinion >= 20 {
            "friendly".to_string()
        } else if self.opinion >= -20 {
            "neutral".to_string()
        } else if self.opinion >= -50 {
            "distant".to_string()
        } else if self.opinion >= -80 {
            "unfriendly".to_string()
        } else {
            "rivals".to_string()
        }
    }

    pub fn get_relationship_status(&self) -> String {
        if self.opinion >= 80 {
            "❤️".to_string()
        } else if self.opinion >= 50 {
            "😊".to_string()
        } else if self.opinion >= 20 {
            "🙂".to_string()
        } else if self.opinion >= -20 {
            "😐".to_string()
        } else if self.opinion >= -50 {
            "😒".to_string()
        } else if self.opinion >= -80 {
            "😠".to_string()
        } else {
            "💢".to_string()
        }
    }

    pub fn opinion(&self) -> i32 {
        self.opinion
    }

    pub fn interaction_count(&self) -> u32 {
        self.interaction_count
    }
}

