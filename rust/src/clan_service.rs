use wasm_bindgen::prelude::*;
use crate::dragon::{Dragon, DragonElement};
use crate::clan::DragonClan;
use crate::name_generator::generate_clan_name;
use crate::notification;
use rand::Rng;

/// Read-only dragon information exposed to TypeScript
/// This hides the internal Dragon struct
#[wasm_bindgen]
pub struct DragonInfo {
    name: String,
    element: String,
    age: u32,
    interaction_style: String,
}

#[wasm_bindgen]
impl DragonInfo {
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn element(&self) -> String {
        self.element.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn age(&self) -> u32 {
        self.age
    }

    #[wasm_bindgen(getter)]
    pub fn interaction_style(&self) -> String {
        self.interaction_style.clone()
    }
}

impl DragonInfo {
    fn from_dragon(dragon: &Dragon) -> Self {
        DragonInfo {
            name: dragon.name(),
            element: dragon.element(),
            age: dragon.age(),
            interaction_style: dragon.get_interaction_style(),
        }
    }
}

/// Interaction result with dragon indices instead of Dragon objects
#[wasm_bindgen]
pub struct InteractionEvent {
    description: String,
    dragon1_index: usize,
    dragon2_index: usize,
    opinion_change: i32,
}

#[wasm_bindgen]
impl InteractionEvent {
    #[wasm_bindgen(getter)]
    pub fn description(&self) -> String {
        self.description.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn dragon1_index(&self) -> usize {
        self.dragon1_index
    }

    #[wasm_bindgen(getter)]
    pub fn dragon2_index(&self) -> usize {
        self.dragon2_index
    }

    #[wasm_bindgen(getter)]
    pub fn opinion_change(&self) -> i32 {
        self.opinion_change
    }
}

/// Clan statistics exposed to TypeScript
#[wasm_bindgen]
pub struct ClanStats {
    name: String,
    dragon_count: usize,
}

#[wasm_bindgen]
impl ClanStats {
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn dragon_count(&self) -> usize {
        self.dragon_count
    }
}

/// The main service that hides all internal Rust objects
/// This is the only interface the UI should use
#[wasm_bindgen]
pub struct ClanService {
    clan: Option<DragonClan>,
}

#[wasm_bindgen]
impl ClanService {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        ClanService { clan: None }
    }

    /// Create a new clan with random name and initial dragons
    pub fn create_clan(&mut self, initial_dragon_count: usize) {
        let clan_name = generate_clan_name();
        let mut clan = DragonClan::new(clan_name.clone());

        // Add initial dragons
        for _ in 0..initial_dragon_count {
            let dragon = Self::create_random_dragon();
            clan.add_dragon(dragon);
        }

        self.clan = Some(clan);

        // Emit event
        let event_data = js_sys::Object::new();
        js_sys::Reflect::set(&event_data, &"type".into(), &"clan-created".into()).unwrap();
        js_sys::Reflect::set(&event_data, &"clanName".into(), &clan_name.into()).unwrap();
        js_sys::Reflect::set(&event_data, &"dragonCount".into(), &(initial_dragon_count as u32).into()).unwrap();
        crate::notification::get_notification_service().emit(crate::notification::EventType::ClanCreated, &event_data.into());
    }

    /// Get clan statistics
    pub fn get_clan_stats(&self) -> Option<ClanStats> {
        self.clan.as_ref().map(|clan| ClanStats {
            name: clan.name(),
            dragon_count: clan.get_dragon_count(),
        })
    }

    /// Get all dragons as read-only info
    pub fn get_dragons(&self) -> Vec<DragonInfo> {
        if let Some(clan) = &self.clan {
            (0..clan.get_dragon_count())
                .filter_map(|i| {
                    clan.get_dragon(i).map(|dragon| DragonInfo::from_dragon(&dragon))
                })
                .collect()
        } else {
            Vec::new()
        }
    }

    /// Get a specific dragon by index
    pub fn get_dragon(&self, index: usize) -> Option<DragonInfo> {
        self.clan
            .as_ref()?
            .get_dragon(index)
            .map(|dragon| DragonInfo::from_dragon(&dragon))
    }

    /// Get dragon count
    pub fn get_dragon_count(&self) -> usize {
        self.clan
            .as_ref()
            .map(|clan| clan.get_dragon_count())
            .unwrap_or(0)
    }

    /// Get clan name
    pub fn get_clan_name(&self) -> String {
        self.clan
            .as_ref()
            .map(|clan| clan.name())
            .unwrap_or_else(|| "No Clan".to_string())
    }

    /// Add a random dragon to the clan
    pub fn add_random_dragon(&mut self) -> Option<DragonInfo> {
        let clan = self.clan.as_mut()?;
        let dragon = Self::create_random_dragon();
        let dragon_info = DragonInfo::from_dragon(&dragon);
        clan.add_dragon(dragon);
        
        // Emit event
        let event_data = js_sys::Object::new();
        js_sys::Reflect::set(&event_data, &"type".into(), &"dragon-added".into()).unwrap();
        js_sys::Reflect::set(&event_data, &"dragon".into(), &Self::dragon_info_to_js_value(&dragon_info)).unwrap();
        notification::get_notification_service().emit(notification::EventType::DragonAdded, &event_data.into());
        
        Some(dragon_info)
    }

    /// Add a dragon with specific attributes
    pub fn add_dragon(&mut self, name: String, element_str: String, age: u32) -> Option<DragonInfo> {
        let clan = self.clan.as_mut()?;
        let dragon = Dragon::new(name.clone(), element_str.clone(), age);
        let dragon_info = DragonInfo::from_dragon(&dragon);
        clan.add_dragon(dragon);
        
        // Emit event
        let event_data = js_sys::Object::new();
        js_sys::Reflect::set(&event_data, &"type".into(), &"dragon-added".into()).unwrap();
        js_sys::Reflect::set(&event_data, &"dragon".into(), &Self::dragon_info_to_js_value(&dragon_info)).unwrap();
        notification::get_notification_service().emit(notification::EventType::DragonAdded, &event_data.into());
        
        Some(dragon_info)
    }

    /// Remove a dragon by index
    pub fn remove_dragon(&mut self, index: usize) -> bool {
        if let Some(clan) = &mut self.clan {
            // Get dragon name before removing (need immutable borrow first)
            let dragon_name = {
                if let Some(dragon) = clan.get_dragon(index) {
                    dragon.name()
                } else {
                    String::new()
                }
            };
            
            let success = clan.remove_dragon(index);
            
            if success {
                // Emit event
                let event_data = js_sys::Object::new();
                js_sys::Reflect::set(&event_data, &"type".into(), &"dragon-removed".into()).unwrap();
                js_sys::Reflect::set(&event_data, &"dragonName".into(), &dragon_name.into()).unwrap();
                notification::get_notification_service().emit(notification::EventType::DragonRemoved, &event_data.into());
            }
            
            success
        } else {
            false
        }
    }

    /// Simulate a single interaction
    pub fn simulate_interaction(&mut self) -> Option<InteractionEvent> {
        let clan = self.clan.as_mut()?;
        
        if clan.get_dragon_count() < 2 {
            return None;
        }

        let interactions = clan.simulate_interactions_with_indices(1);
        if interactions.is_empty() {
            return None;
        }

        let interaction = &interactions[0];
        let event = InteractionEvent {
            description: interaction.result.description(),
            dragon1_index: interaction.dragon1_idx,
            dragon2_index: interaction.dragon2_idx,
            opinion_change: interaction.result.opinion_change(),
        };
        
        // Emit event
        let event_data = js_sys::Object::new();
        js_sys::Reflect::set(&event_data, &"type".into(), &"interaction-simulated".into()).unwrap();
        js_sys::Reflect::set(&event_data, &"event".into(), &Self::interaction_event_to_js_value(&event)).unwrap();
        notification::get_notification_service().emit(notification::EventType::InteractionSimulated, &event_data.into());
        
        Some(event)
    }

    /// Simulate multiple interactions
    pub fn simulate_interactions(&mut self, count: usize) -> Vec<InteractionEvent> {
        let clan = match self.clan.as_mut() {
            Some(clan) => clan,
            None => return Vec::new(),
        };

        if clan.get_dragon_count() < 2 {
            return Vec::new();
        }

        let interactions = clan.simulate_interactions_with_indices(count);
        
        let events: Vec<InteractionEvent> = interactions
            .iter()
            .map(|interaction| {
                InteractionEvent {
                    description: interaction.result.description(),
                    dragon1_index: interaction.dragon1_idx,
                    dragon2_index: interaction.dragon2_idx,
                    opinion_change: interaction.result.opinion_change(),
                }
            })
            .collect();
        
        // Emit events for each interaction
        for event in &events {
            let event_data = js_sys::Object::new();
            js_sys::Reflect::set(&event_data, &"type".into(), &"interaction-simulated".into()).unwrap();
            js_sys::Reflect::set(&event_data, &"event".into(), &Self::interaction_event_to_js_value(event)).unwrap();
            notification::get_notification_service().emit(notification::EventType::InteractionSimulated, &event_data.into());
        }
        
        events
    }

    /// Reset the clan (clear and create new)
    pub fn reset_clan(&mut self, initial_dragon_count: usize) {
        let new_name = if let Some(clan) = &mut self.clan {
            clan.clear();
            let name = generate_clan_name();
            clan.set_name(name.clone());
            name
        } else {
            self.create_clan(initial_dragon_count);
            return;
        };

        // Add new dragons
        for _ in 0..initial_dragon_count {
            let dragon = Self::create_random_dragon();
            if let Some(clan) = &mut self.clan {
                clan.add_dragon(dragon);
            }
        }
        
        // Emit event
        let event_data = js_sys::Object::new();
        js_sys::Reflect::set(&event_data, &"type".into(), &"clan-reset".into()).unwrap();
        js_sys::Reflect::set(&event_data, &"clanName".into(), &new_name.into()).unwrap();
        js_sys::Reflect::set(&event_data, &"dragonCount".into(), &(initial_dragon_count as u32).into()).unwrap();
        notification::get_notification_service().emit(notification::EventType::ClanReset, &event_data.into());
    }

    /// Get relationship info between two dragons
    /// Returns neutral relationship info if no relationship exists yet
    pub fn get_relationship_info(&self, dragon1_index: usize, dragon2_index: usize) -> Option<String> {
        let clan = self.clan.as_ref()?;
        clan.get_relationship_info_by_indices(dragon1_index, dragon2_index)
    }

    /// Get opinion of dragon1 about dragon2
    /// Returns 0 if no relationship exists yet
    pub fn get_opinion(&self, dragon1_index: usize, dragon2_index: usize) -> Option<i32> {
        let clan = self.clan.as_ref()?;
        clan.get_opinion_by_indices(dragon1_index, dragon2_index)
    }

    /// Get character info for a dragon
    pub fn get_dragon_character_info(&self, index: usize) -> Option<String> {
        let clan = self.clan.as_ref()?;
        let dragon = clan.get_dragon(index)?;
        Some(dragon.get_character_info())
    }

    /// Helper to create a random dragon
    fn create_random_dragon() -> Dragon {
        let elements = [
            DragonElement::Fire,
            DragonElement::Water,
            DragonElement::Earth,
            DragonElement::Wind,
            DragonElement::Lightning,
            DragonElement::Ice,
        ];
        
        let mut rng = rand::thread_rng();
        let element = elements[rng.gen_range(0..elements.len())];
        // Use the public generate_dragon_name function
        let name = crate::name_generator::generate_dragon_name(Some(element.as_str().to_string()));
        let age = rng.gen_range(1..=15);
        
        Dragon::new(name, element.as_str().to_string(), age)
    }

    /// Helper to convert DragonInfo to JsValue
    fn dragon_info_to_js_value(dragon_info: &DragonInfo) -> JsValue {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &"name".into(), &dragon_info.name().into()).unwrap();
        js_sys::Reflect::set(&obj, &"element".into(), &dragon_info.element().into()).unwrap();
        js_sys::Reflect::set(&obj, &"age".into(), &(dragon_info.age() as u32).into()).unwrap();
        js_sys::Reflect::set(&obj, &"interactionStyle".into(), &dragon_info.interaction_style().into()).unwrap();
        obj.into()
    }

    /// Helper to convert InteractionEvent to JsValue
    fn interaction_event_to_js_value(event: &InteractionEvent) -> JsValue {
        let obj = js_sys::Object::new();
        js_sys::Reflect::set(&obj, &"description".into(), &event.description().into()).unwrap();
        js_sys::Reflect::set(&obj, &"dragon1Index".into(), &(event.dragon1_index() as u32).into()).unwrap();
        js_sys::Reflect::set(&obj, &"dragon2Index".into(), &(event.dragon2_index() as u32).into()).unwrap();
        js_sys::Reflect::set(&obj, &"opinionChange".into(), &(event.opinion_change() as i32).into()).unwrap();
        obj.into()
    }
}

