import { Dragon, DragonElement } from './dragon.js';
import { DragonClan } from './clan.js';
import { generateDragonName } from './nameGenerator.js';

// Helper function to create a dragon with random name, element, and age
function createRandomDragon(): Dragon {
  const elements: DragonElement[] = ['Fire', 'Water', 'Earth', 'Wind', 'Lightning', 'Ice'];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const name = generateDragonName(element);
  const age = Math.floor(Math.random() * 15) + 1; // Age between 1 and 15
  return new Dragon(name, element, age);
}

// Create a clan with some initial dragons
const clan = new DragonClan('The Fireborn Clan');

// Add 12 dragons to the clan with randomly generated attributes
for (let i = 0; i < 6; i++) {
  clan.addDragon(createRandomDragon());
}

console.log('=== Dragon Clan Simulator ===\n');
console.log(`Clan: ${clan.name}`);
console.log(`Members: ${clan.getDragonCount()}\n`);

// Simulate some interactions
console.log('--- Dragon Interactions ---\n');
clan.simulateInteractions(50);

// Display clan status
console.log('\n--- Clan Status ---\n');
clan.displayStatus();

// Display character details
clan.displayCharacterDetails();

// Display relationships
clan.displayRelationships();

// Display relationship matrix
clan.displayRelationshipMatrix();
