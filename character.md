# Dragon Personalities and Interactions

This document explains how dragon personalities work and how they interact with each other in the Dragon Clan Simulator.

## Character Traits

Each dragon has seven core personality traits, each measured on a scale from 0 to 100:

### Friendliness (0-100)
- **Low (0-30)**: Reserved, cautious, or standoffish
- **Medium (31-70)**: Generally approachable, balanced social behavior
- **High (71-100)**: Warm, welcoming, and open to others

### Aggression (0-100)
- **Low (0-30)**: Peaceful, avoids conflict, prefers harmony
- **Medium (31-70)**: Can be assertive when needed, balanced
- **High (71-100)**: Confrontational, competitive, quick to challenge

### Sociability (0-100)
- **Low (0-30)**: Prefers solitude, introverted, shy
- **Medium (31-70)**: Enjoys some social time, balanced
- **High (71-100)**: Thrives in groups, extroverted, seeks company

### Curiosity (0-100)
- **Low (0-30)**: Content with familiar things, less exploratory
- **Medium (31-70)**: Moderate interest in new experiences
- **High (71-100)**: Eager to explore, discover, and learn

### Playfulness (0-100)
- **Low (0-30)**: Serious, focused, business-like
- **Medium (31-70)**: Can have fun but also serious when needed
- **High (71-100)**: Fun-loving, energetic, enjoys games and activities

### Dominance (0-100)
- **Low (0-30)**: Submissive, follows others, prefers not to lead
- **Medium (31-70)**: Balanced leadership, can lead or follow
- **High (71-100)**: Natural leader, takes charge, assertive

### Patience (0-100)
- **Low (0-30)**: Impulsive, quick to act, easily frustrated
- **Medium (31-70)**: Generally patient but has limits
- **High (71-100)**: Very tolerant, calm, takes time to consider

## Element-Based Personality Tendencies

Each dragon's element influences their base personality traits:

### 🔥 Fire Dragons
- **Tendencies**: Higher aggression (+20), higher dominance (+15)
- **Preferred Elements**: Fire, Lightning
- **Disliked Elements**: Water, Ice
- **Typical Style**: Often aggressive or serious, natural leaders

### 💧 Water Dragons
- **Tendencies**: Higher patience (+20), higher friendliness (+15)
- **Preferred Elements**: Water, Ice
- **Disliked Elements**: Fire, Lightning
- **Typical Style**: Usually friendly or serious, calm and patient

### 🌍 Earth Dragons
- **Tendencies**: Higher patience (+25), lower curiosity (-15)
- **Preferred Elements**: Earth, Wind
- **Disliked Elements**: None (neutral)
- **Typical Style**: Usually serious, steady and reliable

### 💨 Wind Dragons
- **Tendencies**: Higher curiosity (+20), higher playfulness (+15)
- **Preferred Elements**: Wind, Lightning
- **Disliked Elements**: None (neutral)
- **Typical Style**: Often playful or curious, energetic and exploratory

### ⚡ Lightning Dragons
- **Tendencies**: Higher aggression (+15), higher curiosity (+20)
- **Preferred Elements**: Lightning, Fire
- **Disliked Elements**: Earth
- **Typical Style**: Often aggressive or curious, intense and dynamic

### ❄️ Ice Dragons
- **Tendencies**: Lower sociability (-20), higher patience (+25)
- **Preferred Elements**: Ice, Water
- **Disliked Elements**: Fire
- **Typical Style**: Often shy or serious, reserved and patient

## Interaction Styles

Based on their trait combinations, dragons exhibit one of six interaction styles:

### Friendly
- **Requirements**: Friendliness > 70
- **Behavior**: Warm, welcoming, approachable
- **Interactions**: Tends to have positive, warm conversations

### Playful
- **Requirements**: Friendliness > 70 AND Playfulness > 60
- **Behavior**: Energetic, fun-loving, enjoys games
- **Interactions**: Loves to play games and have fun together

### Serious
- **Requirements**: Default style (when other conditions aren't met)
- **Behavior**: Focused, business-like, practical
- **Interactions**: Professional, task-oriented conversations

### Aggressive
- **Requirements**: Aggression > 70
- **Behavior**: Confrontational, competitive, challenging
- **Interactions**: May challenge others, can be confrontational

### Shy
- **Requirements**: Sociability < 30
- **Behavior**: Reserved, tentative, cautious
- **Interactions**: Quiet conversations, tentative approaches

### Curious
- **Requirements**: Curiosity > 70 (and not aggressive)
- **Behavior**: Exploratory, inquisitive, discovery-focused
- **Interactions**: Enjoys exploring and discovering together

## Compatibility System

Dragons have compatibility scores with each other based on multiple factors:

### Trait Compatibility
- Dragons with similar levels of **friendliness**, **sociability**, **playfulness**, and **patience** tend to get along better
- The closer these traits are, the higher the compatibility

### Dominance Compatibility
- **Similar dominance** (difference < 30): Work well together, understand each other's roles
- **Very different dominance** (difference > 70): Can complement each other (leader/follower dynamic)
- **Moderate differences**: May have some friction

### Aggression Compatibility
- **Both low aggression** (< 30): Very compatible, peaceful interactions
- **Both high aggression** (> 70): High conflict potential, incompatible
- **Mixed aggression**: Can work, but may have occasional friction

### Element Preferences
- Dragons prefer certain elements and dislike others
- **Preferred elements**: +25 compatibility bonus
- **Disliked elements**: -30 compatibility penalty

### Trait Preferences
- Dragons may be attracted to or avoid certain personality traits
- **Preferred traits** (when other dragon has > 60): +10 compatibility
- **Disliked traits** (when other dragon has > 60): -15 compatibility

## How Interactions Work

### Compatibility Ranges

#### Very Incompatible (< -50)
- **Aggressive dragons**: May confront each other directly
- **Non-aggressive dragons**: Will avoid each other or keep distance
- **Result**: Negative opinion changes (-5 to -20)

#### Incompatible (-50 to 0)
- **Behavior**: Polite but distant, brief acknowledgments
- **Result**: Small negative or neutral opinion changes (-2 to +1)

#### Moderate Compatibility (0 to 50)
- **Behavior**: Standard interactions (greetings, stories, chatting, helping)
- **Style-specific**: Shy dragons have quiet conversations, aggressive dragons may challenge to friendly competitions
- **Result**: Small positive opinion changes (+2 to +5)

#### High Compatibility (> 50)
- **Playful + Playful**: Energetic games together (+12-15 opinion)
- **Curious dragons**: Explore interesting things together (+10 opinion)
- **Friendly dragons**: Warm, friendly conversations (+8 opinion)
- **Others**: Effective collaboration (+7 opinion)
- **Result**: Significant positive opinion changes (+7 to +15)

### Existing Relationships

- **Positive existing opinion**: Makes positive interactions more likely and impactful
- **Negative existing opinion**: Makes negative interactions more likely
- **Opinion modifier**: Existing relationship affects compatibility by up to ±30 points

## Relationship Building

### Initial Opinions
- Dragons start with an initial opinion based on 30% of their compatibility score
- This represents first impressions before any interactions

### Opinion Changes
- **Early interactions**: Have more impact (up to 100% of base change)
- **Later interactions**: Have diminishing impact (down to ~17% after 50+ interactions)
- **Stabilization**: Opinions converge toward a stable value based on compatibility

### Relationship Status

Opinions translate to relationship descriptions:

- **80-100**: ❤️ Close friends
- **50-79**: 😊 Friends
- **20-49**: 🙂 Friendly
- **-19 to 19**: 😐 Neutral
- **-49 to -20**: 😒 Distant
- **-79 to -50**: 😠 Unfriendly
- **-100 to -80**: 💢 Rivals

### Stabilization

Over many interactions, relationships stabilize:
- Opinions converge toward ~70% of compatibility score
- Early interactions matter most
- Later interactions fine-tune the relationship
- Prevents relationships from continuously increasing or decreasing

## Example Interactions

### High Compatibility Example
- **Dragon A**: Fire, Playful style, high friendliness
- **Dragon B**: Wind, Playful style, high playfulness
- **Result**: "They play an energetic game together!" (+12-15 opinion)

### Low Compatibility Example
- **Dragon A**: Fire, Aggressive style, high aggression
- **Dragon B**: Water, Friendly style, low aggression
- **Result**: "Dragon A confronts Dragon B - they don't get along" (-15-20 opinion)

### Element Conflict Example
- **Dragon A**: Fire (dislikes Water)
- **Dragon B**: Water (dislikes Fire)
- **Result**: Lower compatibility, more likely to have negative interactions

### Shy Dragon Example
- **Dragon A**: Ice, Shy style, low sociability
- **Dragon B**: Any style
- **Result**: "Dragon A tentatively approaches Dragon B" or "quiet conversation" (+3-5 opinion)

## Summary

The personality system creates unique, dynamic relationships between dragons:
- Each dragon has distinct traits and preferences
- Elements influence base personality tendencies
- Compatibility determines interaction quality
- Relationships evolve and stabilize over time
- Interactions reflect personality differences and similarities

This creates a rich social simulation where dragons form friendships, rivalries, and everything in between based on their individual personalities and how they interact over time.

