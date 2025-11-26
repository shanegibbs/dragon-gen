import { Dragon, DragonElement } from './dragon.js';
import { DragonClan } from './clan.js';
import { generateDragonName } from './nameGenerator.js';

// Helper function to create a dragon with a random name
function createRandomDragon(element: DragonElement, age?: number): Dragon {
  const name = generateDragonName(element);
  const dragonAge = age ?? Math.floor(Math.random() * 10) + 1;
  return new Dragon(name, element, dragonAge);
}

// Create a clan with some initial dragons
const clan = new DragonClan('The Fireborn Clan');

// Add some dragons to the clan with randomly generated names
clan.addDragon(createRandomDragon('Fire', 5));
clan.addDragon(createRandomDragon('Water', 4));
clan.addDragon(createRandomDragon('Earth', 6));
clan.addDragon(createRandomDragon('Wind', 3));

console.log('=== Dragon Clan Simulator ===\n');
console.log(`Clan: ${clan.name}`);
console.log(`Members: ${clan.getDragonCount()}\n`);

// Simulate some interactions
console.log('--- Dragon Interactions ---\n');
clan.simulateInteractions(5);

// Display clan status
console.log('\n--- Clan Status ---\n');
clan.displayStatus();

