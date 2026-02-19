// Popup UI controller
const features = [
  { id: 'monitorBypass', title: 'Monitor Bypass', description: 'Block screen/camera monitoring', enabled: false },
  { id: 'proxyRouting', title: 'Traffic Routing', description: 'Route through proxy chains', enabled: false },
  { id: 'dnsBypass', title: 'DNS Filter Bypass', description: 'Use encrypted DNS', enabled: false },
  { id: 'sslBypass', title: 'SSL Inspection Bypass', description: 'Ignore SSL pinning', enabled: false },
  { id: 'urlFilterBypass', title: 'URL Filter Bypass', description: 'Rewrite blocked URLs', enabled: false },
  { id: 'extensionKiller', title: 'Extension Killer', description: 'Disable monitoring extensions', enabled: false },
  { id: 'fingerprintRandomizer', title: 'Fingerprint Randomizer', description: 'Randomize browser fingerprint', enabled: false },
  { id: 'contentUnblocker', title: 'Content Unblocker', description: 'Bypass content filters', enabled: false }
];

// Load saved settings
chrome.storage.sync.get(features.reduce((acc, f) => ({ ...acc, [f.id]: false }), {}), (saved) => {
  features.forEach(f => {
    f.enabled = saved[f.id] || false;
  });
  renderFeatures();
});

// Render feature grid
function renderFeatures() {
  const grid = document.getElementById('featureGrid');
  grid.innerHTML = features.map(f => `
    <div class="feature-card ${f.enabled ? 'enabled' : ''}" data-id="${f.id}">
      <div class="title">${f.title}</div>
      <div class="status">${f.enabled ? 'Active' : f.description}</div>
      <div class="toggle-switch">
        <input type="checkbox" id="${f.id}" ${f.enabled ? 'checked' : ''}>
        <label for="${f.id}"></label>
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  features.forEach(f => {
    const checkbox = document.getElementById(f.id);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        toggleFeature(f.id, e.target.checked);
      });
    }
  });
}

// Toggle feature
function toggleFeature(featureId, enabled) {
  const feature = features.find(f => f.id === featureId);
  if (feature) {
    feature.enabled = enabled;
    
    // Update UI
    const card = document.querySelector(`[data-id="${featureId}"]`);
    if (card) {
      if (enabled) {
        card.classList.add('enabled');
        card.querySelector('.status').textContent = 'Active';
      } else {
        card.classList.remove('enabled');
        card.querySelector('.status').textContent = feature.description;
      }
    }
    
    // Save to storage
    chrome.storage.sync.set({ [featureId]: enabled });
    
    // Send to background
    chrome.runtime.sendMessage({
      type: 'updateSettings',
      settings: { [featureId]: enabled }
    });
    
    // Update stats
    updateStats();
  }
}

// Update statistics
function updateStats() {
  const activeCount = features.filter(f => f.enabled).length;
  document.getElementById('activeRules').textContent = activeCount;
  
  // Show warning if too many features enabled
  const warning = document.getElementById('warningMessage');
  if (activeCount > 3) {
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }
}

// Initialize stats
updateStats();

// Simulate blocked count (would come from background in real implementation)
setInterval(() => {
  const blocked = Math.floor(Math.random() * 50);
  document.getElementById('blockedCount').textContent = blocked;
}, 3000);
