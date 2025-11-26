/**
 * Represents a dragon's opinion of another dragon
 * Opinion ranges from -100 (very negative) to 100 (very positive)
 */
export class Relationship {
  public opinion: number = 0; // Starts neutral
  public interactionCount: number = 0;
  public lastInteraction: string = '';
  private targetOpinion: number = 0; // The opinion this relationship is converging toward

  constructor(initialOpinion: number = 0, targetOpinion: number = 0) {
    this.opinion = initialOpinion;
    this.targetOpinion = targetOpinion;
  }

  /**
   * Sets the target opinion this relationship should converge toward
   * Based on character compatibility
   */
  public setTargetOpinion(target: number): void {
    this.targetOpinion = Math.max(-100, Math.min(100, target));
  }

  /**
   * Updates the opinion based on an interaction
   * Uses a weighted average approach that converges toward stability
   * @param change Amount to change opinion by (can be positive or negative)
   * @param interactionDescription Description of what happened
   * @param compatibility The base compatibility score (used for target calculation)
   */
  public updateOpinion(change: number, interactionDescription: string, compatibility?: number): void {
    this.interactionCount++;
    this.lastInteraction = interactionDescription;

    // Update target opinion if compatibility is provided
    if (compatibility !== undefined) {
      // Target is based on compatibility, but adjusted by interaction outcomes
      // Target converges to about 60-80% of compatibility range
      const baseTarget = compatibility * 0.7; // 70% of compatibility as target
      this.targetOpinion = Math.max(-100, Math.min(100, baseTarget));
    }

    // Calculate the "value" of this interaction (what the opinion should move toward)
    // This is the current opinion plus the change
    const interactionValue = this.opinion + change;

    // Use exponential moving average with diminishing impact
    // Early interactions have more weight, later ones have less
    // The decay factor increases with interaction count
    const decayFactor = Math.min(0.5, 10 / (this.interactionCount + 10)); // Starts at 1.0, decays to ~0.1-0.5
    
    // Weighted average: move current opinion toward the new interaction value
    // But also pull toward the target opinion
    const targetWeight = 0.1; // Small pull toward compatibility-based target
    const interactionWeight = decayFactor;
    const currentWeight = 1 - interactionWeight - targetWeight;

    // Calculate new opinion as weighted average
    this.opinion = 
      (this.opinion * currentWeight) + 
      (interactionValue * interactionWeight) + 
      (this.targetOpinion * targetWeight);

    // Clamp to valid range
    this.opinion = Math.max(-100, Math.min(100, Math.round(this.opinion * 10) / 10));
  }

  /**
   * Gets a description of the relationship
   */
  public getRelationshipDescription(): string {
    if (this.opinion >= 80) return 'close friends';
    if (this.opinion >= 50) return 'friends';
    if (this.opinion >= 20) return 'friendly';
    if (this.opinion >= -20) return 'neutral';
    if (this.opinion >= -50) return 'distant';
    if (this.opinion >= -80) return 'unfriendly';
    return 'rivals';
  }

  /**
   * Gets the relationship status as an emoji or symbol
   */
  public getRelationshipStatus(): string {
    if (this.opinion >= 80) return '❤️';
    if (this.opinion >= 50) return '😊';
    if (this.opinion >= 20) return '🙂';
    if (this.opinion >= -20) return '😐';
    if (this.opinion >= -50) return '😒';
    if (this.opinion >= -80) return '😠';
    return '💢';
  }
}

