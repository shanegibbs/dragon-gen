# Dragon Personalities and Interactions

This document explains how dragon personalities work and how they interact with each other in the Dragon Clan Simulator.

## Character Traits

Each dragon has six independent personality traits and one trait axis (representing a conflicting pair), each measured on a scale from 0 to 100:

### Independent Traits

#### Friendliness (0-100)
- **Low (0-30)**: Reserved, cautious, or standoffish
- **Medium (31-70)**: Generally approachable, balanced social behavior
- **High (71-100)**: Warm, welcoming, and open to others

#### Sociability (0-100)
- **Low (0-30)**: Prefers solitude, introverted, shy
- **Medium (31-70)**: Enjoys some social time, balanced
- **High (71-100)**: Thrives in groups, extroverted, seeks company

#### Curiosity (0-100)
- **Low (0-30)**: Content with familiar things, less exploratory
- **Medium (31-70)**: Moderate interest in new experiences
- **High (71-100)**: Eager to explore, discover, and learn

#### Playfulness (0-100)
- **Low (0-30)**: Serious, focused, business-like
- **Medium (31-70)**: Can have fun but also serious when needed
- **High (71-100)**: Fun-loving, energetic, enjoys games and activities

#### Dominance (0-100)
- **Low (0-30)**: Submissive, follows others, prefers not to lead
- **Medium (31-70)**: Balanced leadership, can lead or follow
- **High (71-100)**: Natural leader, takes charge, assertive

### Trait Axes

Some traits are naturally conflicting and are represented as axes where a dragon cannot have both traits high simultaneously:

#### Aggression vs Patience Axis (0-100)
This axis represents the conflict between being confrontational and being calm:
- **High axis value (71-100)**: High Aggression - Confrontational, competitive, quick to challenge
- **Low axis value (0-30)**: High Patience - Very tolerant, calm, takes time to consider
- **Medium (31-70)**: Balanced between assertiveness and patience

A dragon cannot be both quick to challenge and take time to consider simultaneously. The axis ensures internal consistency in personality.

## Element-Based Personality Tendencies

Each dragon's element influences their base personality traits. For trait axes, adjustments move the axis toward the preferred trait.

For detailed information about each element's personality tendencies, typical styles, and characteristics, see [dragon-elements.md](dragon-elements.md).

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

## Internal Value System

Each dragon has an internal value system that represents their core principles and beliefs. These values guide their decisions, judgments, and moral framework. Unlike personality traits (which describe *how* a dragon behaves), values describe *what* a dragon believes in and prioritizes.

### Core Values (0-100 scale)

1. **Honor**: Commitment to integrity, keeping promises, and maintaining personal dignity
2. **Freedom**: Value for independence, autonomy, and resistance to constraints
3. **Tradition**: Respect for established customs, ancestral wisdom, and maintaining the old ways
4. **Growth**: Belief in progress, learning, self-improvement, and embracing change
5. **Community**: Prioritizing the collective good, cooperation, and clan welfare over individual interests
6. **Achievement**: Value for personal success, recognition, and demonstrating capability
7. **Harmony**: Value for balance, peace, avoiding conflict, and maintaining equilibrium
8. **Power**: Value for strength, influence, and the ability to affect outcomes
9. **Wisdom**: Value for knowledge, understanding, and making well-considered decisions
10. **Protection**: Value for caring for others, defending the vulnerable, and ensuring safety

### Element-Based Value Tendencies

Each dragon element influences their base values. For detailed information about each element's value tendencies, typical values, and philosophy, see [dragon-elements.md](dragon-elements.md).

### Value Alignment

Dragons with aligned values form stronger bonds, while conflicting values can create tension:
- **Complementary values**: Similar high values in areas like Honor, Tradition, Community, or Harmony create positive alignment
- **Conflicting values**: Opposing high values (e.g., Freedom vs Community, Tradition vs Growth, Power vs Harmony) reduce alignment
- **Value conflicts are discovered through communication** - dragons don't know each other's values until they interact

## Communication System

Dragons interact through a structured communication system. Each interaction consists of:
1. **Communication Generation**: The sender generates a communication based on their own values and traits
2. **Communication Processing**: The receiver interprets and responds based on their own values and traits
3. **Opinion Updates**: Both dragons update their opinions based on the communication exchange

### How Communications Are Generated

Communications are generated **purely from the sender's perspective**:
- **Value-based communications**: When a sender has high values (>70), they express those values
- **Trait-based communications**: Based on the sender's personality traits (playful, friendly, curious, shy, aggressive)
- **Opinion influence**: The sender's existing opinion of the receiver affects communication intensity and tone
- **No receiver knowledge**: The sender does NOT know the receiver's internal values or traits when generating communications

### How Communications Are Processed

When a receiver processes a communication:
- **Value interpretation**: If the sender expresses a value, the receiver checks if they share it
  - **Shared high value**: Positive response (+10-15 opinion)
  - **Conflicting value**: Negative response (-5 opinion)
  - **Neutral value**: Polite acknowledgment (-3 to +5 opinion)
- **Trait-based responses**: The receiver's traits determine how they respond
  - **Playful receiver + playful communication**: Enthusiastic response (+12 opinion)
  - **Shy receiver + shy communication**: Appreciates gentle approach (+6 opinion)
  - **Aggressive receiver + confrontational communication**: Rises to challenge (-10 to -20 opinion)
- **Opinion formation**: The receiver forms opinions based on how communications align with their values and traits

### Communication Types

- **Value Alignment**: Sender expresses a value they care about (honor, community, wisdom, etc.)
- **Playful**: Sender invites play or fun activities
- **Friendly**: Sender greets warmly or offers help
- **Curious**: Sender asks questions or suggests exploration
- **Shy**: Sender tentatively approaches
- **Confrontational**: Sender challenges or confronts
- **Neutral**: Standard polite communication

### Existing Relationships

- **Positive existing opinion**: Makes communications more intense and warm
- **Negative existing opinion**: Makes communications more neutral or confrontational
- **No relationship yet**: Dragons with no prior interactions start from neutral (0) when they first communicate

## Relationship Building

### Emergent Relationships
- **Relationships are not pre-computed** - they only exist and develop through actual interactions
- Dragons start with **no relationship** (neutral, 0 opinion) until they interact
- When dragons first interact, a relationship is created starting from neutral (0)
- All relationship development is **purely emergent** from structured interactions

### Opinion Changes
- **Early interactions**: Have more impact (up to 100% of base change)
- **Later interactions**: Have diminishing impact (down to ~50% after many interactions)
- **No pre-computed bias**: Relationships develop organically based on how dragons actually interact through communications

### Relationship Status

Opinions translate to relationship descriptions:

- **80-100**: ❤️ Close friends
- **50-79**: 😊 Friends
- **20-49**: 🙂 Friendly
- **-19 to 19**: 😐 Neutral
- **-49 to -20**: 😒 Distant
- **-79 to -50**: 😠 Unfriendly
- **-100 to -80**: 💢 Rivals

### Relationship Evolution

Over many interactions, relationships evolve naturally:
- Early interactions have the most impact on forming the relationship
- Later interactions have diminishing returns, allowing relationships to stabilize
- Relationships develop organically based on actual interactions, not predetermined compatibility
- Each interaction contributes to the relationship, creating unique dynamics between dragons

## Example Communications

### Value-Based Communication Example
- **Sender**: High honor (85), expresses honor to receiver
- **Receiver**: High honor (80)
- **Communication**: "Sender (Fire) makes a solemn promise to Receiver (Water)"
- **Response**: "Receiver enthusiastically agrees with Sender about honor"
- **Result**: +12 opinion (shared high value)

### Value Conflict Example
- **Sender**: High freedom (85), expresses freedom to receiver
- **Receiver**: High community (80)
- **Communication**: "Sender (Wind) emphasizes the importance of individual freedom to Receiver (Earth)"
- **Response**: "Receiver disagrees with Sender's perspective on freedom"
- **Result**: -5 opinion (conflicting values)

### Playful Communication Example
- **Sender**: Playful style, high friendliness and playfulness
- **Receiver**: Playful style, high playfulness
- **Communication**: "Sender (Wind) invites Receiver (Fire) to play an energetic game"
- **Response**: "Receiver joins in the fun enthusiastically"
- **Result**: +12 opinion (shared playfulness)

### Shy Communication Example
- **Sender**: Shy style, low sociability
- **Receiver**: Any style
- **Communication**: "Sender (Ice) tentatively approaches Receiver (Water)"
- **Response**: "Receiver responds warmly to the tentative approach"
- **Result**: +3 to +6 opinion (depending on receiver's traits)

## Summary

The personality and value system creates unique, dynamic relationships between dragons:
- Each dragon has distinct traits and values
- Elements influence base personality tendencies and values
- **Communications are generated from the sender's perspective** - based only on sender's values, traits, and opinion of receiver
- **Communications are processed from the receiver's perspective** - receiver interprets based on their own values and traits
- Value conflicts are discovered through communication, not pre-computed
- **Relationships are emergent** - they only exist and develop through actual communications
- Relationships start from neutral (0) when dragons first interact
- Relationships evolve organically over time based on structured communications
- Each communication exchange creates unique dynamics based on how values and traits align or conflict

This creates a rich social simulation where dragons form friendships, rivalries, and everything in between based on their individual personalities, values, and how they actually communicate over time. Relationships are not pre-computed but emerge naturally from the structured communication system between dragons.

