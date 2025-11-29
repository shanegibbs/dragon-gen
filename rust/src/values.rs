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
    pub fn new() -> Self {
        DragonValues {
            honor: 0,
            freedom: 0,
            tradition: 0,
            growth: 0,
            community: 0,
            achievement: 0,
            harmony: 0,
            power: 0,
            wisdom: 0,
            protection: 0,
        }
    }
}

pub fn calculate_value_alignment(values1: &DragonValues, values2: &DragonValues) -> i32 {
    let mut alignment = 0;

    // Complementary value pairs
    let complementary_pairs = vec![
        ("honor", "honor"),
        ("tradition", "tradition"),
        ("community", "community"),
        ("protection", "protection"),
        ("wisdom", "wisdom"),
        ("harmony", "harmony"),
        ("growth", "growth"),
        ("freedom", "freedom"),
        ("achievement", "achievement"),
        ("power", "power"),
    ];

    for (value1, value2) in complementary_pairs {
        let diff = (get_value(values1, value1) as i32 - get_value(values2, value2) as i32).abs();
        alignment += (100 - diff) / 10;
    }

    // Conflicting value pairs
    let conflict_pairs = vec![
        ("freedom", "community"),
        ("tradition", "growth"),
        ("power", "harmony"),
        ("achievement", "protection"),
    ];

    for (value1, value2) in conflict_pairs {
        let diff = (get_value(values1, value1) as i32 - get_value(values2, value2) as i32).abs();
        if diff > 50 {
            alignment -= diff / 10;
        }
    }

    // Special cases: very high values in complementary areas
    if values1.honor > 70 && values2.honor > 70 {
        alignment += 15;
    }
    if values1.community > 70 && values2.community > 70 {
        alignment += 15;
    }
    if values1.harmony > 70 && values2.harmony > 70 {
        alignment += 15;
    }

    // Special cases: conflicting high values
    if values1.freedom > 70 && values2.community > 70 {
        alignment -= 20;
    }
    if values1.tradition > 70 && values2.growth > 70 {
        alignment -= 20;
    }
    if values1.power > 70 && values2.harmony > 70 {
        alignment -= 20;
    }

    // Normalize to -100 to 100 range
    alignment.max(-100).min(100)
}

fn get_value(values: &DragonValues, name: &str) -> u32 {
    match name {
        "honor" => values.honor,
        "freedom" => values.freedom,
        "tradition" => values.tradition,
        "growth" => values.growth,
        "community" => values.community,
        "achievement" => values.achievement,
        "harmony" => values.harmony,
        "power" => values.power,
        "wisdom" => values.wisdom,
        "protection" => values.protection,
        _ => 0,
    }
}

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

pub fn get_top_values(values: &DragonValues, count: usize) -> Vec<(String, u32)> {
    let mut value_entries = vec![
        ("honor".to_string(), values.honor),
        ("freedom".to_string(), values.freedom),
        ("tradition".to_string(), values.tradition),
        ("growth".to_string(), values.growth),
        ("community".to_string(), values.community),
        ("achievement".to_string(), values.achievement),
        ("harmony".to_string(), values.harmony),
        ("power".to_string(), values.power),
        ("wisdom".to_string(), values.wisdom),
        ("protection".to_string(), values.protection),
    ];
    value_entries.sort_by(|a, b| b.1.cmp(&a.1));
    value_entries.into_iter().take(count).collect()
}

