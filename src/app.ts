import './app.css';
import { clanService } from './services/clan-service.js';
import { DragonInfo, DragonElement } from './wasm-wrapper.js';
import { generateDragonName } from './wasm-wrapper.js';

// Helper function to create a random dragon and add it to the clan
async function createRandomDragon(): Promise<DragonInfo> {
  const elements: DragonElement[] = ['Fire', 'Water', 'Earth', 'Wind', 'Lightning', 'Ice'];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const name = generateDragonName(element);
  const age = Math.floor(Math.random() * 15) + 1; // Age between 1 and 15
  return await clanService.addDragon(name, element, age);
}

// Initialize the app
async function initApp() {
  try {
    // Initialize service (this also initializes WASM)
    console.log('Initializing service...');
    await clanService.initialize();
    console.log('Service initialized, creating clan...');
    
    const app = document.getElementById('app');
    if (!app) {
      console.error('App element not found!');
      return;
    }

    // Create a clan with some initial dragons
    console.log('Creating clan with 6 dragons...');
    await clanService.createClan(6);
    const stats = clanService.getClanStats();
    console.log('Clan created:', stats?.name, 'with', stats?.dragonCount, 'dragons');

    // Create UI
    try {
      const clanName = stats?.name || 'Unknown Clan';
      const dragonCount = stats?.dragonCount || 0;
      app.innerHTML = `
    <div class="container">
      <header>
        <h1><span class="emoji">🐉</span> <span class="gradient-text">Dragon Clan Simulator</span></h1>
      </header>
      
      <div class="main-layout">
        <div class="main-content">
          <div class="clan-info">
            <h2>Clan: ${clanName}</h2>
            <p>Members: ${dragonCount}</p>
          </div>

          <div class="controls">
            <button id="simulate-btn" class="btn btn-primary">Simulate 10 Interactions</button>
            <button id="simulate-100-btn" class="btn btn-primary">Simulate 100 Interactions</button>
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
      console.log('Rendering clan info...');
      renderClanInfo();
      console.log('Rendering dragons...');
      renderDragons();
      console.log('Rendering relationships...');
      renderRelationships();
      console.log('Initial render complete');
    } catch (renderError) {
      console.error('Error during UI rendering:', renderError);
      throw renderError;
    }
  
  // Add initial event log entry
  const stats2 = clanService.getClanStats();
  addEventLogEntry(`Clan "${stats2?.name || 'Unknown'}" initialized with ${stats2?.dragonCount || 0} dragons`, 'info');

  // Event listeners
  let interactionCount = 0;
  let autoSimulateInterval: number | null = null;
  let isAutoSimulating = false;

  async function triggerSingleInteraction() {
    const stats = clanService.getClanStats();
    if (!stats || stats.dragonCount < 2) {
      addEventLogEntry('Not enough dragons for interactions!', 'info');
      stopAutoSimulate();
      return;
    }

    const interactions = await clanService.simulateInteractions(1);
    interactionCount += 1;
    
    if (interactions.length > 0) {
      const interaction = interactions[0];
      addEventLogEntry(interaction.description, 'interaction');
      renderDragons();
      renderRelationships();
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
    
    autoSimulateInterval = window.setTimeout(async () => {
      await triggerSingleInteraction();
      if (isAutoSimulating) {
        scheduleNextInteraction();
      }
    }, delay);
  }

  document.getElementById('simulate-btn')?.addEventListener('click', async () => {
    const count = 10;
    const interactions = await clanService.simulateInteractions(count);
    interactionCount += count;
    
    // Add each interaction to the event log
    interactions.forEach(interaction => {
      addEventLogEntry(interaction.description, 'interaction');
    });
    
    // Add summary
    addEventLogEntry(`Simulated ${count} interactions (${interactionCount} total)`, 'action');
    
    renderDragons();
    renderRelationships();
  });

  document.getElementById('simulate-100-btn')?.addEventListener('click', async () => {
    const count = 100;
    const interactions = await clanService.simulateInteractions(count);
    interactionCount += count;
    
    // Add each interaction to the event log
    interactions.forEach(interaction => {
      addEventLogEntry(interaction.description, 'interaction');
    });
    
    // Add summary
    addEventLogEntry(`Simulated ${count} interactions (${interactionCount} total)`, 'action');
    
    renderDragons();
    renderRelationships();
  });

  document.getElementById('auto-simulate-btn')?.addEventListener('click', () => {
    if (isAutoSimulating) {
      stopAutoSimulate();
    } else {
      startAutoSimulate();
    }
  });

  document.getElementById('add-dragon-btn')?.addEventListener('click', async () => {
    const newDragon = await createRandomDragon();
    addEventLogEntry(`Added new dragon: ${newDragon.name} (${newDragon.element})`, 'action');
    renderClanInfo();
    renderDragons();
    renderRelationships();
  });

  document.getElementById('reset-btn')?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset the clan?')) {
      stopAutoSimulate();
      await clanService.resetClan(6);
      interactionCount = 0;
      const stats = clanService.getClanStats();
      addEventLogEntry(`Clan reset: ${stats?.name || 'Unknown'} with ${stats?.dragonCount || 0} new dragons`, 'action');
      renderClanInfo();
      renderDragons();
      renderRelationships();
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
  } catch (error) {
    console.error('Error initializing app:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="container">
          <h1>Error Loading Application</h1>
          <p>There was an error initializing the application. Please check the console for details.</p>
          <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        </div>
      `;
    }
  }
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

function renderClanInfo() {
  const clanInfo = document.querySelector('.clan-info');
  if (clanInfo) {
    const stats = clanService.getClanStats();
    clanInfo.innerHTML = `
      <h2>Clan: ${stats?.name || 'Unknown'}</h2>
      <p>Members: ${stats?.dragonCount || 0}</p>
    `;
  }
}

function renderDragons() {
  const dragonsList = document.getElementById('dragons-list');
  if (!dragonsList) return;

  try {
    const dragons = clanService.getDragons();
    console.log('Rendering', dragons.length, 'dragons');
    
    // Render dragons one at a time to isolate errors
    const htmlParts: string[] = [];
    for (let index = 0; index < dragons.length; index++) {
      const dragon = dragons[index];
      if (!dragon) {
        console.error(`Dragon at index ${index} is null`);
        continue;
      }
      console.log(`Rendering dragon ${index + 1}: ${dragon.name}`);
      
      // Get basic properties first (these should work)
      const name = dragon.name;
      const element = dragon.element;
      const age = dragon.age;
      const style = dragon.interactionStyle;
      
      // Try to get character info, but don't fail if it doesn't work
      let characterInfo = '';
      try {
        console.log(`  Getting character info for ${name}...`);
        characterInfo = clanService.getDragonCharacterInfo(index) || '';
        console.log(`  Character info length: ${characterInfo.length}`);
      } catch (error) {
        console.error(`Error getting character info for dragon ${name}:`, error);
        // Create a basic fallback
        characterInfo = `${name}'s Details:\n  Element: ${element}\n  Age: ${age}\n\n  Character information temporarily unavailable.`;
      }
    
      const html = `
      <div class="dragon-card">
        <div class="dragon-header">
          <h3>${name}</h3>
          <span class="element-badge element-${element.toLowerCase()}">${element}</span>
        </div>
        <div class="dragon-info">
          <p><strong>Age:</strong> ${age}</p>
          <p><strong>Style:</strong> ${style}</p>
        </div>
        <details class="dragon-details">
          <summary>Character Details</summary>
          <pre>${characterInfo || 'Character information unavailable'}</pre>
        </details>
      </div>
    `;
      htmlParts.push(html);
    }
    
    dragonsList.innerHTML = htmlParts.join('');
  } catch (error) {
    console.error('Error in renderDragons:', error);
    dragonsList.innerHTML = '<p>Error rendering dragons. Check console for details.</p>';
  }
}

function renderRelationships() {
  const relationshipsList = document.getElementById('relationships-list');
  if (!relationshipsList) return;

  const dragons = clanService.getDragons();
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

  dragons.forEach((dragon, dragon1Index) => {
    html += `<tr><th>${dragon.name}</th>`;
    dragons.forEach((other, dragon2Index) => {
      if (dragon1Index === dragon2Index) {
        html += '<td class="self">—</td>';
      } else {
        try {
          const opinion = clanService.getOpinion(dragon1Index, dragon2Index) || 0;
          const relationship = clanService.getRelationshipInfo(dragon1Index, dragon2Index) || 'Unknown relationship';
          const status = relationship.split(' ')[0]; // Get status word
          const className = opinion > 50 ? 'positive' : opinion < -50 ? 'negative' : 'neutral';
          html += `<td class="${className}" title="${relationship}">${opinion}</td>`;
        } catch (error) {
          console.error(`Error getting relationship between ${dragon.name} and ${other.name}:`, error);
          html += '<td class="neutral" title="Error loading relationship">0</td>';
        }
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  relationshipsList.innerHTML = html;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initApp().catch(console.error));
} else {
  initApp().catch(console.error);
}
