import { DragonElement } from './dragon.js';

// Fantasy name syllables for generating dragon names
const nameSyllables = {
  prefixes: [
    'Aer', 'Ign', 'Aqu', 'Terr', 'Zeph', 'Cryo', 'Pyro', 'Nyx', 'Lux', 'Umbr',
    'Dra', 'Vor', 'Kyr', 'Zar', 'Xen', 'Nex', 'Rex', 'Vex', 'Zor', 'Kor',
    'Thal', 'Mal', 'Val', 'Gal', 'Kal', 'Tal', 'Sal', 'Dal', 'Fal', 'Hal'
  ],
  middles: [
    'on', 'en', 'in', 'an', 'un', 'ar', 'or', 'ir', 'ur', 'er',
    'ath', 'eth', 'ith', 'oth', 'uth', 'ach', 'ech', 'ich', 'och', 'uch',
    'ra', 'la', 'na', 'ma', 'ta', 'sa', 'da', 'fa', 'ga', 'ka'
  ],
  suffixes: [
    'is', 'us', 'as', 'os', 'es', 'ix', 'ax', 'ox', 'ex', 'yx',
    'ion', 'eon', 'ian', 'ean', 'oan', 'urn', 'orn', 'arn', 'ern', 'urn',
    'th', 'nth', 'rth', 'lth', 'mth', 'dra', 'ra', 'la', 'na', 'ma'
  ]
};

// Element-specific name components
const elementNames: Record<DragonElement, { prefixes: string[], suffixes: string[] }> = {
  Fire: {
    prefixes: ['Ign', 'Pyro', 'Flar', 'Blaz', 'Ember', 'Scorch', 'Infer', 'Cind'],
    suffixes: ['is', 'ion', 'ra', 'th', 'ix', 'ax']
  },
  Water: {
    prefixes: ['Aqu', 'Hydr', 'Mar', 'Tid', 'Flow', 'Riv', 'Oce', 'Wav'],
    suffixes: ['a', 'ia', 'is', 'us', 'an', 'en']
  },
  Earth: {
    prefixes: ['Terr', 'Ston', 'Rock', 'Cryst', 'Gran', 'Clay', 'Mud', 'Grav'],
    suffixes: ['a', 'is', 'us', 'an', 'on', 'th']
  },
  Wind: {
    prefixes: ['Aer', 'Zeph', 'Gust', 'Breez', 'Storm', 'Temp', 'Cycl', 'Whirl'],
    suffixes: ['a', 'is', 'us', 'on', 'an', 'ix']
  },
  Lightning: {
    prefixes: ['Volt', 'Thund', 'Bolt', 'Spark', 'Flash', 'Strik', 'Shock', 'Electr'],
    suffixes: ['a', 'is', 'us', 'on', 'ix', 'ax']
  },
  Ice: {
    prefixes: ['Cryo', 'Frost', 'Glac', 'Ic', 'Frig', 'Chill', 'Freez', 'Cryst'],
    suffixes: ['a', 'is', 'us', 'on', 'an', 'ix']
  }
};

/**
 * Generates a random dragon name
 * @param element Optional element type to generate an element-themed name
 * @returns A randomly generated dragon name
 */
export function generateDragonName(element?: DragonElement): string {
  if (element && Math.random() > 0.3) {
    // 70% chance to use element-specific name
    return generateElementName(element);
  }
  
  // Generate a fantasy name using syllables
  const prefix = nameSyllables.prefixes[Math.floor(Math.random() * nameSyllables.prefixes.length)];
  const middle = Math.random() > 0.5 
    ? nameSyllables.middles[Math.floor(Math.random() * nameSyllables.middles.length)]
    : '';
  const suffix = nameSyllables.suffixes[Math.floor(Math.random() * nameSyllables.suffixes.length)];
  
  return prefix + middle + suffix;
}

/**
 * Generates an element-themed dragon name
 * @param element The dragon's element type
 * @returns An element-themed name
 */
function generateElementName(element: DragonElement): string {
  const elementData = elementNames[element];
  const prefix = elementData.prefixes[Math.floor(Math.random() * elementData.prefixes.length)];
  const suffix = elementData.suffixes[Math.floor(Math.random() * elementData.suffixes.length)];
  
  return prefix + suffix;
}

/**
 * Generates multiple unique dragon names
 * @param count Number of names to generate
 * @param element Optional element type
 * @returns Array of unique names
 */
export function generateMultipleNames(count: number, element?: DragonElement): string[] {
  const names = new Set<string>();
  
  while (names.size < count) {
    const name = generateDragonName(element);
    names.add(name);
  }
  
  return Array.from(names);
}

