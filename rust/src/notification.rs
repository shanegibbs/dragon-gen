use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use std::cell::RefCell;

/// Event types that can be emitted
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum EventType {
    ClanCreated,
    DragonAdded,
    DragonRemoved,
    InteractionSimulated,
    ClanReset,
    Error,
}

/// Generic notification service that can emit events to JavaScript
/// Uses a static instance to allow global access
/// Note: WASM is single-threaded, so we use RefCell instead of Mutex
pub struct NotificationService {
    callbacks: RefCell<HashMap<EventType, Vec<JsValue>>>,
}

impl NotificationService {
    fn new() -> Self {
        NotificationService {
            callbacks: RefCell::new(HashMap::new()),
        }
    }

    /// Subscribe to an event type with a JavaScript callback
    /// The callback will receive a JsValue representing the event data
    pub fn subscribe(&self, event_type: EventType, callback: JsValue) {
        let mut callbacks = self.callbacks.borrow_mut();
        let callbacks_for_type = callbacks.entry(event_type).or_insert_with(Vec::new);
        callbacks_for_type.push(callback);
    }

    /// Unsubscribe from an event type
    pub fn unsubscribe(&self, event_type: EventType, callback: &JsValue) {
        let mut callbacks = self.callbacks.borrow_mut();
        if let Some(callbacks_for_type) = callbacks.get_mut(&event_type) {
            // For WASM, we'll use a simple approach: compare by converting to string
            // This isn't perfect but works for our use case
            let callback_str = format!("{:p}", callback.as_ref() as *const _);
            callbacks_for_type.retain(|cb| {
                let cb_str = format!("{:p}", cb.as_ref() as *const _);
                cb_str != callback_str
            });
        }
    }

    /// Emit an event to all subscribers
    pub fn emit(&self, event_type: EventType, event_data: &JsValue) {
        let callbacks = self.callbacks.borrow();
        if let Some(callbacks_for_type) = callbacks.get(&event_type) {
            for callback in callbacks_for_type {
                // Try to call as a function
                if let Some(func) = callback.dyn_ref::<js_sys::Function>() {
                    let _ = func.call1(&JsValue::NULL, event_data);
                }
            }
        }
    }
}

// Global notification service instance
// For WASM (single-threaded), we use a simple static with RefCell
thread_local! {
    pub static NOTIFICATION_SERVICE: RefCell<Option<NotificationService>> = RefCell::new(None);
}

pub fn get_notification_service() -> &'static NotificationService {
    NOTIFICATION_SERVICE.with(|service| {
        let mut service_opt = service.borrow_mut();
        if service_opt.is_none() {
            *service_opt = Some(NotificationService::new());
        }
        // SAFETY: We just initialized it, and it lives in thread_local storage
        unsafe { &*(service_opt.as_ref().unwrap() as *const NotificationService) }
    })
}

/// Subscribe to an event type (exposed to WASM)
#[wasm_bindgen]
pub fn subscribe_to_event(event_type: EventType, callback: &JsValue) {
    get_notification_service().subscribe(event_type, callback.clone());
}

/// Unsubscribe from an event type (exposed to WASM)
#[wasm_bindgen]
pub fn unsubscribe_from_event(event_type: EventType, callback: &JsValue) {
    get_notification_service().unsubscribe(event_type, callback);
}

