/**
 * app.js
 * Main application coordinator, navigation router, and toast notification manager.
 */

// Toast notification helper
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  const icons = {
    success: '🎉',
    error: '⚠️',
    info: '💡'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '✨'}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
};

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs Logic
  const navButtons = document.querySelectorAll('.nav-tab-btn');
  const viewSections = document.querySelectorAll('.app-section-view');

  function switchTab(targetTabId) {
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetTabId);
    });

    viewSections.forEach(sec => {
      sec.classList.toggle('active', sec.id === targetTabId);
    });

    if (targetTabId === 'tab-code' && window.codeRunnerInstance) {
      setTimeout(() => window.codeRunnerInstance.runCode(), 60);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      switchTab(target);
    });
  });

  // Sound Toggle Button
  const muteBtn = document.getElementById('toggle-sound-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      window.soundSynth.isMuted = !window.soundSynth.isMuted;
      if (window.soundSynth.isMuted) {
        window.soundSynth.stopMusic();
        muteBtn.innerHTML = '🔇 Sound: Off';
        muteBtn.classList.add('muted');
        window.showToast("Audio muted.", "info");
      } else {
        muteBtn.innerHTML = '🔊 Sound: On';
        muteBtn.classList.remove('muted');
        window.showToast("Audio unmuted! 🎵", "success");
      }
    });
  }

  // Quick Action Jump buttons (e.g. from hero banner)
  document.querySelectorAll('[data-jump-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = el.getAttribute('data-jump-tab');
      switchTab(tabId);
    });
  });

  // Initialize Modules
  try {
    window.wishesCreatorInstance = new window.WishesCreator();
    window.videoMakerInstance = new window.VideoMaker();
    window.codeRunnerInstance = new window.CodeRunner();
    window.surprisesInstance = new window.InteractiveSurprises();
  } catch (err) {
    console.error("Module initialization error:", err);
  }

  // Save button click listener
  const saveBtn = document.getElementById('save-all-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '⏳ Saving...';
      await window.saveAllSurpriseData();
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 Save Surprise';
    });
  }

  // Auto-restore saved greetings & photos
  setTimeout(() => {
    window.loadAllSurpriseData();
  }, 250);

  // Welcome greeting
  setTimeout(() => {
    window.showToast("Welcome to Birthday Magic Studio! ✨ Start creating your surprise!", "success");
  }, 600);
});

// Global Save Surprise function (Saves to Server + LocalStorage)
window.saveAllSurpriseData = async function() {
  const wishesData = window.wishesCreatorInstance ? window.wishesCreatorInstance.getFormData() : {};
  let slidesData = [];
  if (window.videoMakerInstance && window.videoMakerInstance.slides) {
    slidesData = window.videoMakerInstance.slides.map(s => ({
      id: s.id,
      caption: s.caption,
      url: s.img ? s.img.src : ''
    }));
  }

  const payload = {
    wishes: wishesData,
    slides: slidesData,
    savedAt: new Date().toISOString()
  };

  // 1. Save in local browser storage
  try {
    localStorage.setItem('saved_birthday_surprise', JSON.stringify(payload));
  } catch (e) {
    console.warn("LocalStorage quota error:", e);
  }

  // 2. Save on Python Server permanently
  try {
    const res = await fetch('/api/save-surprise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      window.showToast("💾 Saved successfully! Your greetings and photos will now stay forever!", "success");
    } else {
      window.showToast("💾 Saved locally on your device!", "success");
    }
  } catch (err) {
    window.showToast("💾 Saved locally in your browser!", "success");
  }
};

// Global Load Surprise function (Restores on page refresh/open)
window.loadAllSurpriseData = async function() {
  let data = null;

  // Try server first
  try {
    const res = await fetch('/api/get-surprise');
    if (res.ok) {
      const json = await res.json();
      if (json && json.status === 'success' && json.data) {
        data = json.data;
      }
    }
  } catch (e) {}

  // Fallback to localStorage if server has no saved data yet
  if (!data) {
    try {
      const local = localStorage.getItem('saved_birthday_surprise');
      if (local) data = JSON.parse(local);
    } catch (e) {}
  }

  if (data) {
    if (data.wishes && window.wishesCreatorInstance) {
      window.wishesCreatorInstance.loadWishesData(data.wishes);
    }
    if (data.slides && data.slides.length && window.videoMakerInstance) {
      window.videoMakerInstance.loadSlidesData(data.slides);
    }
    console.log("Restored saved surprise greetings and photos!");
  }
};
