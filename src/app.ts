import './app.css';
import { Dragon, DragonElement } from './dragon.js';
import { DragonClan } from './clan.js';
import { generateDragonName, generateClanName } from './nameGenerator.js';

// Helper function to create a dragon with random name, element, and age
function createRandomDragon(): Dragon {
  const elements: DragonElement[] = ['Fire', 'Water', 'Earth', 'Wind', 'Lightning', 'Ice'];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const name = generateDragonName(element);
  const age = Math.floor(Math.random() * 15) + 1; // Age between 1 and 15
  return new Dragon(name, element, age);
}

// Initialize the app
function initApp() {
  const app = document.getElementById('app');
  if (!app) return;

  // Create a clan with some initial dragons
  const clan = new DragonClan(generateClanName());

  // Add 6 dragons to the clan with randomly generated attributes
  for (let i = 0; i < 6; i++) {
    clan.addDragon(createRandomDragon());
  }

  // Create UI
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🐉 Dragon Clan Simulator</h1>
      </header>
      
      <div class="clan-info">
        <h2>Clan: ${clan.name}</h2>
        <p>Members: ${clan.getDragonCount()}</p>
      </div>

      <div class="controls">
        <button id="simulate-btn" class="btn btn-primary">Simulate 10 Interactions</button>
        <button id="add-dragon-btn" class="btn btn-secondary">Add Random Dragon</button>
        <button id="reset-btn" class="btn btn-danger">Reset Clan</button>
      </div>

      <div id="output" class="output"></div>
      
      <div class="dragons-section">
        <h2>Dragons</h2>
        <div id="dragons-list" class="dragons-list"></div>
      </div>

      <div class="relationships-section">
        <h2>Relationships</h2>
        <div id="relationships-list" class="relationships-list"></div>
      </div>
    </div>
  `;

  // Render initial state
  renderClanInfo(clan);
  renderDragons(clan);
  renderRelationships(clan);

  // Event listeners
  let interactionCount = 0;
  document.getElementById('simulate-btn')?.addEventListener('click', () => {
    const count = 10;
    clan.simulateInteractions(count);
    interactionCount += count;
    updateOutput(`Simulated ${interactionCount} total interactions`);
    renderDragons(clan);
    renderRelationships(clan);
  });

  document.getElementById('add-dragon-btn')?.addEventListener('click', () => {
    clan.addDragon(createRandomDragon());
    updateOutput(`Added new dragon: ${clan.getDragons()[clan.getDragons().length - 1].name}`);
    renderClanInfo(clan);
    renderDragons(clan);
    renderRelationships(clan);
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the clan?')) {
      clan.clear();
      // Generate a new clan name
      clan.name = generateClanName();
      // Add 6 new dragons
      for (let i = 0; i < 6; i++) {
        clan.addDragon(createRandomDragon());
      }
      interactionCount = 0;
      updateOutput('Clan reset with new dragons');
      renderClanInfo(clan);
      renderDragons(clan);
      renderRelationships(clan);
    }
  });
}

function updateOutput(message: string) {
  const output = document.getElementById('output');
  if (output) {
    const timestamp = new Date().toLocaleTimeString();
    output.innerHTML = `<div class="output-message">[${timestamp}] ${message}</div>`;
  }
}

function renderClanInfo(clan: DragonClan) {
  const clanInfo = document.querySelector('.clan-info');
  if (clanInfo) {
    clanInfo.innerHTML = `
      <h2>Clan: ${clan.name}</h2>
      <p>Members: ${clan.getDragonCount()}</p>
    `;
  }
}

function renderDragons(clan: DragonClan) {
  const dragonsList = document.getElementById('dragons-list');
  if (!dragonsList) return;

  const dragons = clan.getDragons();
  dragonsList.innerHTML = dragons.map((dragon, index) => {
    const style = dragon.character.getInteractionStyle();
    return `
      <div class="dragon-card">
        <div class="dragon-header">
          <h3>${dragon.name}</h3>
          <span class="element-badge element-${dragon.element.toLowerCase()}">${dragon.element}</span>
        </div>
        <div class="dragon-info">
          <p><strong>Age:</strong> ${dragon.age}</p>
          <p><strong>Energy:</strong> ${dragon.energy}%</p>
          <p><strong>Mood:</strong> ${dragon.mood}</p>
          <p><strong>Style:</strong> ${style}</p>
        </div>
        <details class="dragon-details">
          <summary>Character Details</summary>
          <pre>${dragon.getCharacterInfo()}</pre>
        </details>
      </div>
    `;
  }).join('');
}

function renderRelationships(clan: DragonClan) {
  const relationshipsList = document.getElementById('relationships-list');
  if (!relationshipsList) return;

  const dragons = clan.getDragons();
  if (dragons.length < 2) {
    relationshipsList.innerHTML = '<p>Not enough dragons to show relationships.</p>';
    return;
  }

  // Create relationship matrix
  let html = '<table class="relationship-matrix"><thead><tr><th></th>';
  dragons.forEach(d => {
    html += `<th>${d.name}</th>`;
  });
  html += '</tr></thead><tbody>';

  dragons.forEach((dragon) => {
    html += `<tr><th>${dragon.name}</th>`;
    dragons.forEach((other) => {
      if (dragon === other) {
        html += '<td class="self">—</td>';
      } else {
        const opinion = dragon.getOpinionOf(other);
        const relationship = dragon.getRelationshipInfo(other);
        const status = relationship.split(' ')[0]; // Get status word
        const className = opinion > 50 ? 'positive' : opinion < -50 ? 'negative' : 'neutral';
        html += `<td class="${className}" title="${relationship}">${opinion}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  relationshipsList.innerHTML = html;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

