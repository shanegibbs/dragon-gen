use crate::dragon::DragonElement;

#[derive(Debug, Clone, Copy)]
pub struct DragonValues {
    pub honor: u32,
    pub freedom: u32,
    pub tradition: u32,
    pub growth: u32,
    pub community: u32,
    pub achievement: u32,
    pub harmony: u32,
    pub power: u32,
    pub wisdom: u32,
    pub protection: u32,
}

impl DragonValues {
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
    let mut values = DragonValues {
        honor: random_value(),
        freedom: random_value(),
        tradition: random_value(),
        growth: random_value(),
        community: random_value(),
        achievement: random_value(),
        harmony: random_value(),
        power: random_value(),
        wisdom: random_value(),
        protection: random_value(),
    };

    // Element-based value adjustments
    if let Some(element) = element {
        match element {
            DragonElement::Fire => {
                values.power = (values.power + 20).min(100);
                values.achievement = (values.achievement + 15).min(100);
                values.harmony = values.harmony.saturating_sub(15);
            }
            DragonElement::Water => {
                values.harmony = (values.harmony + 20).min(100);
                values.protection = (values.protection + 15).min(100);
                values.wisdom = (values.wisdom + 10).min(100);
            }
            DragonElement::Earth => {
                values.tradition = (values.tradition + 25).min(100);
                values.honor = (values.honor + 15).min(100);
                values.growth = values.growth.saturating_sub(15);
            }
            DragonElement::Wind => {
                values.freedom = (values.freedom + 25).min(100);
                values.growth = (values.growth + 20).min(100);
                values.tradition = values.tradition.saturating_sub(15);
            }
            DragonElement::Lightning => {
                values.achievement = (values.achievement + 20).min(100);
                values.power = (values.power + 15).min(100);
                values.harmony = values.harmony.saturating_sub(15);
            }
            DragonElement::Ice => {
                values.wisdom = (values.wisdom + 25).min(100);
                values.harmony = (values.harmony + 15).min(100);
                values.community = values.community.saturating_sub(15);
            }
        }
    }

    // Ensure all values are in valid range
    values.honor = values.honor.min(100);
    values.freedom = values.freedom.min(100);
    values.tradition = values.tradition.min(100);
    values.growth = values.growth.min(100);
    values.community = values.community.min(100);
    values.achievement = values.achievement.min(100);
    values.harmony = values.harmony.min(100);
    values.power = values.power.min(100);
    values.wisdom = values.wisdom.min(100);
    values.protection = values.protection.min(100);

    values
}

// Removed get_top_values - no longer used

