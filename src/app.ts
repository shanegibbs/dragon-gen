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
        <h1><span class="emoji">🐉</span> <span class="gradient-text">Dragon Clan Simulator</span></h1>
      </header>
      
      <div class="main-layout">
        <div class="main-content">
          <div class="clan-info">
            <h2>Clan: ${clan.name}</h2>
            <p>Members: ${clan.getDragonCount()}</p>
          </div>

          <div class="controls">
            <button id="simulate-btn" class="btn btn-primary">Simulate 10 Interactions</button>
            <button id="auto-simulate-btn" class="btn btn-secondary">Start Auto-Simulate</button>
            <button id="add-dragon-btn" class="btn btn-secondary">Add Random Dragon</button>
            <button id="reset-btn" class="btn btn-danger">Reset Clan</button>
          </div>
          
          <div class="dragons-section">
            <h2>Dragons</h2>
            <div id="dragons-list" class="dragons-list"></div>
          </div>

          <div class="relationships-section">
            <h2>Relationships</h2>
            <div id="relationships-list" class="relationships-list"></div>
          </div>
        </div>

        <div class="event-log-panel">
          <div class="event-log-header">
            <h2>Event Log</h2>
            <button id="clear-log-btn" class="btn btn-secondary btn-small">Clear</button>
          </div>
          <div id="event-log" class="event-log"></div>
        </div>
      </div>
    </div>
  `;

  // Render initial state
  renderClanInfo(clan);
  renderDragons(clan);
  renderRelationships(clan);
  
  // Add initial event log entry
  addEventLogEntry(`Clan "${clan.name}" initialized with ${clan.getDragonCount()} dragons`, 'info');

  // Event listeners
  let interactionCount = 0;
  let autoSimulateInterval: number | null = null;
  let isAutoSimulating = false;

  function triggerSingleInteraction() {
    if (clan.getDragonCount() < 2) {
      addEventLogEntry('Not enough dragons for interactions!', 'info');
      stopAutoSimulate();
      return;
    }

    const interactions = clan.simulateInteractions(1);
    interactionCount += 1;
    
    if (interactions.length > 0) {
      const interaction = interactions[0];
      addEventLogEntry(interaction.description, 'interaction');
      renderDragons(clan);
      renderRelationships(clan);
    }
  }

  function startAutoSimulate() {
    if (isAutoSimulating) return;
    
    isAutoSimulating = true;
    const autoSimulateBtn = document.getElementById('auto-simulate-btn');
    if (autoSimulateBtn) {
      autoSimulateBtn.textContent = 'Stop Auto-Simulate';
      autoSimulateBtn.classList.remove('btn-secondary');
      autoSimulateBtn.classList.add('btn-danger');
    }
    
    addEventLogEntry('Auto-simulation started', 'action');
    
    // Schedule the first interaction
    scheduleNextInteraction();
  }

  function stopAutoSimulate() {
    if (!isAutoSimulating) return;
    
    isAutoSimulating = false;
    if (autoSimulateInterval !== null) {
      clearTimeout(autoSimulateInterval);
      autoSimulateInterval = null;
    }
    
    const autoSimulateBtn = document.getElementById('auto-simulate-btn');
    if (autoSimulateBtn) {
      autoSimulateBtn.textContent = 'Start Auto-Simulate';
      autoSimulateBtn.classList.remove('btn-danger');
      autoSimulateBtn.classList.add('btn-secondary');
    }
    
    addEventLogEntry('Auto-simulation stopped', 'action');
  }

  function scheduleNextInteraction() {
    if (!isAutoSimulating) return;
    
    // Random delay between 3-10 seconds (3000-10000ms)
    const delay = 3000 + Math.random() * 7000;
    
    autoSimulateInterval = window.setTimeout(() => {
      triggerSingleInteraction();
      if (isAutoSimulating) {
        scheduleNextInteraction();
      }
    }, delay);
  }

  document.getElementById('simulate-btn')?.addEventListener('click', () => {
    const count = 10;
    const interactions = clan.simulateInteractions(count);
    interactionCount += count;
    
    // Add each interaction to the event log
    interactions.forEach(interaction => {
      addEventLogEntry(interaction.description, 'interaction');
    });
    
    // Add summary
    addEventLogEntry(`Simulated ${count} interactions (${interactionCount} total)`, 'action');
    
    renderDragons(clan);
    renderRelationships(clan);
  });

  document.getElementById('auto-simulate-btn')?.addEventListener('click', () => {
    if (isAutoSimulating) {
      stopAutoSimulate();
    } else {
      startAutoSimulate();
    }
  });

  document.getElementById('add-dragon-btn')?.addEventListener('click', () => {
    const newDragon = createRandomDragon();
    clan.addDragon(newDragon);
    addEventLogEntry(`Added new dragon: ${newDragon.name} (${newDragon.element})`, 'action');
    renderClanInfo(clan);
    renderDragons(clan);
    renderRelationships(clan);
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the clan?')) {
      stopAutoSimulate();
      clan.clear();
      // Generate a new clan name
      clan.name = generateClanName();
      // Add 6 new dragons
      for (let i = 0; i < 6; i++) {
        clan.addDragon(createRandomDragon());
      }
      interactionCount = 0;
      addEventLogEntry(`Clan reset: ${clan.name} with ${clan.getDragonCount()} new dragons`, 'action');
      renderClanInfo(clan);
      renderDragons(clan);
      renderRelationships(clan);
    }
  });

  document.getElementById('clear-log-btn')?.addEventListener('click', () => {
    const eventLog = document.getElementById('event-log');
    if (eventLog) {
      eventLog.innerHTML = '';
    }
  });

  // Start auto-simulation by default
  startAutoSimulate();
}

function addEventLogEntry(message: string, type: 'interaction' | 'info' | 'action' = 'info') {
  const eventLog = document.getElementById('event-log');
  if (!eventLog) return;

  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `event-log-entry event-log-${type}`;
  entry.innerHTML = `
    <span class="event-time">[${timestamp}]</span>
    <span class="event-message">${message}</span>
  `;
  
  // Add to top of log
  eventLog.insertBefore(entry, eventLog.firstChild);
  
  // Limit log to 100 entries
  while (eventLog.children.length > 100) {
    eventLog.removeChild(eventLog.lastChild!);
  }
  
  // Auto-scroll to top
  eventLog.scrollTop = 0;
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

