#[derive(Debug, Clone)]
pub struct Relationship {
    opinion: i32,
    interaction_count: u32,
    last_interaction: String,
    target_opinion: i32,
}

impl Relationship {
    pub fn new(initial_opinion: i32, target_opinion: i32) -> Self {
        Relationship {
            opinion: initial_opinion,
            interaction_count: 0,
            last_interaction: String::new(),
            target_opinion,
        }
    }

    pub fn set_target_opinion(&mut self, target: i32) {
        self.target_opinion = target.max(-100).min(100);
    }

    pub fn update_opinion(&mut self, change: i32, interaction_description: &str, compatibility: Option<i32>) {
        self.interaction_count += 1;
        self.last_interaction = interaction_description.to_string();

        if let Some(compatibility) = compatibility {
            let base_target = (compatibility as f64 * 0.7) as i32;
            self.target_opinion = base_target.max(-100).min(100);
        }

        let interaction_value = self.opinion + change;
        let decay_factor = (10.0 / (self.interaction_count as f64 + 10.0)).min(0.5);
        let target_weight = 0.1;
        let interaction_weight = decay_factor;
        let current_weight = 1.0 - interaction_weight - target_weight;

        self.opinion = ((self.opinion as f64 * current_weight)
            + (interaction_value as f64 * interaction_weight)
            + (self.target_opinion as f64 * target_weight)) as i32;

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

