use crate::dragon::DragonElement;

/*
Thought space on values:
- Socionomy - A conceptual space describing how individuals and groups relate along the spectrum from autonomy to collective integration.
- Chronotaxis - The ordering of priorities between what has been inherited and what must evolve.
- Praxisguard - The dynamic tension between advancing objectives (praxis) and guarding assets (protection).
*/

#[derive(Debug, Clone, Copy)]
pub struct DragonValues {
    // Non-conflicting individual values
    pub honor: u32,
    pub wisdom: u32,
    
    // Conflicting pairs represented as axes (0-100)
    // Higher value = more of the first value, lower = more of the second
    /// Freedom (high) vs Community (low) axis
    /// 0 = max community, 100 = max freedom
    pub freedom_vs_community: u32,
    /// Tradition (high) vs Growth (low) axis
    /// 0 = max growth, 100 = max tradition
    pub tradition_vs_growth: u32,
    /// Power (high) vs Harmony (low) axis
    /// 0 = max harmony, 100 = max power
    pub power_vs_harmony: u32,
    /// Achievement (high) vs Protection (low) axis
    /// 0 = max protection, 100 = max achievement
    pub achievement_vs_protection: u32,
}

impl DragonValues {
    /// Get individual value from an axis
    /// For axes where higher = first value, lower = second value
    fn get_first_from_axis(axis: u32) -> u32 {
        axis
    }
    
    fn get_second_from_axis(axis: u32) -> u32 {
        100u32.saturating_sub(axis)
    }
    
    // Convenience getters for individual values (for backward compatibility)
    pub fn freedom(&self) -> u32 {
        Self::get_first_from_axis(self.freedom_vs_community)
    }
    
    pub fn community(&self) -> u32 {
        Self::get_second_from_axis(self.freedom_vs_community)
    }
    
    pub fn tradition(&self) -> u32 {
        Self::get_first_from_axis(self.tradition_vs_growth)
    }
    
    pub fn growth(&self) -> u32 {
        Self::get_second_from_axis(self.tradition_vs_growth)
    }
    
    pub fn power(&self) -> u32 {
        Self::get_first_from_axis(self.power_vs_harmony)
    }
    
    pub fn harmony(&self) -> u32 {
        Self::get_second_from_axis(self.power_vs_harmony)
    }
    
    pub fn achievement(&self) -> u32 {
        Self::get_first_from_axis(self.achievement_vs_protection)
    }
    
    pub fn protection(&self) -> u32 {
        Self::get_second_from_axis(self.achievement_vs_protection)
    }
}

// Removed calculate_value_alignment and get_value - no longer used since relationships are emergent

fn random_value() -> u32 {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let value1 = rng.gen_range(0..=100);
    let value2 = rng.gen_range(0..=100);
    ((value1 + value2) / 2) as u32
}

pub fn generate_dragon_values(element: Option<DragonElement>) -> DragonValues {
    // Generate random axis values (0-100)
    // For axes: higher = first value, lower = second value
    let mut values = DragonValues {
        honor: random_value(),
        wisdom: random_value(),
        freedom_vs_community: random_value(),
        tradition_vs_growth: random_value(),
        power_vs_harmony: random_value(),
        achievement_vs_protection: random_value(),
    };

    // Element-based value adjustments
    // Adjust axes by moving toward the preferred value
    if let Some(element) = element {
        match element {
            DragonElement::Fire => {
                // Higher power, higher achievement, lower harmony
                values.power_vs_harmony = (values.power_vs_harmony + 20).min(100);
                values.achievement_vs_protection = (values.achievement_vs_protection + 15).min(100);
            }
            DragonElement::Water => {
                // Higher harmony, higher protection, higher wisdom
                values.power_vs_harmony = values.power_vs_harmony.saturating_sub(20);
                values.achievement_vs_protection = values.achievement_vs_protection.saturating_sub(15);
                values.wisdom = (values.wisdom + 10).min(100);
            }
            DragonElement::Earth => {
                // Higher tradition, higher honor, lower growth
                values.tradition_vs_growth = (values.tradition_vs_growth + 25).min(100);
                values.honor = (values.honor + 15).min(100);
            }
            DragonElement::Wind => {
                // Higher freedom, higher growth, lower tradition
                values.freedom_vs_community = (values.freedom_vs_community + 25).min(100);
                values.tradition_vs_growth = values.tradition_vs_growth.saturating_sub(20);
            }
            DragonElement::Lightning => {
                // Higher achievement, higher power, lower harmony
                values.achievement_vs_protection = (values.achievement_vs_protection + 20).min(100);
                values.power_vs_harmony = (values.power_vs_harmony + 15).min(100);
            }
            DragonElement::Ice => {
                // Higher wisdom, higher harmony, lower community
                values.wisdom = (values.wisdom + 25).min(100);
                values.power_vs_harmony = values.power_vs_harmony.saturating_sub(15);
                values.freedom_vs_community = values.freedom_vs_community.saturating_sub(15);
            }
        }
    }

    // Ensure all values are in valid range
    values.honor = values.honor.min(100);
    values.wisdom = values.wisdom.min(100);
    values.freedom_vs_community = values.freedom_vs_community.min(100);
    values.tradition_vs_growth = values.tradition_vs_growth.min(100);
    values.power_vs_harmony = values.power_vs_harmony.min(100);
    values.achievement_vs_protection = values.achievement_vs_protection.min(100);

    values
}
