use wasm_bindgen::prelude::*;
use crate::dragon::{DragonElement, element_from_str};
use rand::Rng;

const NAME_SYLLABLES: &[&str] = &[
    "Aer", "Ign", "Aqu", "Terr", "Zeph", "Cryo", "Pyro", "Nyx", "Lux", "Umbr",
    "Dra", "Vor", "Kyr", "Zar", "Xen", "Nex", "Rex", "Vex", "Zor", "Kor",
    "Thal", "Mal", "Val", "Gal", "Kal", "Tal", "Sal", "Dal", "Fal", "Hal"
];

const NAME_MIDDLES: &[&str] = &[
    "on", "en", "in", "an", "un", "ar", "or", "ir", "ur", "er",
    "ath", "eth", "ith", "oth", "uth", "ach", "ech", "ich", "och", "uch",
    "ra", "la", "na", "ma", "ta", "sa", "da", "fa", "ga", "ka"
];

const NAME_SUFFIXES: &[&str] = &[
    "is", "us", "as", "os", "es", "ix", "ax", "ox", "ex", "yx",
    "ion", "eon", "ian", "ean", "oan", "urn", "orn", "arn", "ern", "urn",
    "th", "nth", "rth", "lth", "mth", "dra", "ra", "la", "na", "ma"
];

struct ElementNames {
    prefixes: &'static [&'static str],
    suffixes: &'static [&'static str],
}

const ELEMENT_NAMES: &[(DragonElement, ElementNames)] = &[
    (
        DragonElement::Fire,
        ElementNames {
            prefixes: &["Ign", "Pyro", "Flar", "Blaz", "Ember", "Scorch", "Infer", "Cind"],
            suffixes: &["is", "ion", "ra", "th", "ix", "ax"],
        },
    ),
    (
        DragonElement::Water,
        ElementNames {
            prefixes: &["Aqu", "Hydr", "Mar", "Tid", "Flow", "Riv", "Oce", "Wav"],
            suffixes: &["a", "ia", "is", "us", "an", "en"],
        },
    ),
    (
        DragonElement::Earth,
        ElementNames {
            prefixes: &["Terr", "Ston", "Rock", "Cryst", "Gran", "Clay", "Mud", "Grav"],
            suffixes: &["a", "is", "us", "an", "on", "th"],
        },
    ),
    (
        DragonElement::Wind,
        ElementNames {
            prefixes: &["Aer", "Zeph", "Gust", "Breez", "Storm", "Temp", "Cycl", "Whirl"],
            suffixes: &["a", "is", "us", "on", "an", "ix"],
        },
    ),
    (
        DragonElement::Lightning,
        ElementNames {
            prefixes: &["Volt", "Thund", "Bolt", "Spark", "Flash", "Strik", "Shock", "Electr"],
            suffixes: &["a", "is", "us", "on", "ix", "ax"],
        },
    ),
    (
        DragonElement::Ice,
        ElementNames {
            prefixes: &["Cryo", "Frost", "Glac", "Ic", "Frig", "Chill", "Freez", "Cryst"],
            suffixes: &["a", "is", "us", "on", "an", "ix"],
        },
    ),
];

#[wasm_bindgen]
pub fn generate_dragon_name(element_str: Option<String>) -> String {
    let element = element_str.and_then(|s| element_from_str(&s));
    generate_dragon_name_internal(element)
}

fn generate_dragon_name_internal(element: Option<DragonElement>) -> String {
    let mut rng = rand::thread_rng();
    
    if let Some(element) = element {
        if rng.gen_bool(0.7) {
            return generate_element_name(element);
        }
    }

    let prefix = NAME_SYLLABLES[rng.gen_range(0..NAME_SYLLABLES.len())];
    let middle = if rng.gen_bool(0.5) {
        NAME_MIDDLES[rng.gen_range(0..NAME_MIDDLES.len())]
    } else {
        ""
    };
    let suffix = NAME_SUFFIXES[rng.gen_range(0..NAME_SUFFIXES.len())];

    format!("{}{}{}", prefix, middle, suffix)
}

fn generate_element_name(element: DragonElement) -> String {
    let mut rng = rand::thread_rng();
    
    for (elem, names) in ELEMENT_NAMES {
        if *elem == element {
            let prefix = names.prefixes[rng.gen_range(0..names.prefixes.len())];
            let suffix = names.suffixes[rng.gen_range(0..names.suffixes.len())];
            return format!("{}{}", prefix, suffix);
        }
    }
    
    generate_dragon_name_internal(None)
}

#[wasm_bindgen]
pub fn generate_multiple_names(count: usize, element_str: Option<String>) -> Vec<String> {
    let element = element_str.and_then(|s| element_from_str(&s));
    let mut names = std::collections::HashSet::new();
    while names.len() < count {
        names.insert(generate_dragon_name_internal(element));
    }
    names.into_iter().collect()
}

const CLAN_ADJECTIVES: &[&str] = &[
    "Fireborn", "Storm", "Ancient", "Eternal", "Shadow", "Crystal", "Thunder",
    "Dragon", "Mystic", "Sacred", "Frozen", "Blazing", "Golden", "Silver",
    "Iron", "Steel", "Frost", "Flame", "Wind", "Earth", "Lightning", "Ice",
    "Noble", "Royal", "Wild", "Fierce", "Mighty", "Legendary", "Divine",
    "Dark", "Bright", "Savage", "Wise", "Bold", "Swift", "Strong"
];

const CLAN_NOUNS: &[&str] = &[
    "Clan", "Order", "Brotherhood", "Sisterhood", "Guild", "Circle", "Council",
    "Alliance", "Legion", "Guard", "Keep", "Tower", "Sanctuary", "Haven",
    "Stronghold", "Fortress", "Realm", "Domain", "Tribe", "Nation", "Empire",
    "Dynasty", "House", "Bloodline", "Lineage", "Horde", "Flight", "Wing"
];

#[wasm_bindgen]
pub fn generate_clan_name() -> String {
    let mut rng = rand::thread_rng();
    let adjective = CLAN_ADJECTIVES[rng.gen_range(0..CLAN_ADJECTIVES.len())];
    let noun = CLAN_NOUNS[rng.gen_range(0..CLAN_NOUNS.len())];
    format!("The {} {}", adjective, noun)
}

