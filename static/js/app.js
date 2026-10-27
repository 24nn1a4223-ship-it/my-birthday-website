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

  // Welcome greeting
  setTimeout(() => {
    window.showToast("Welcome to Birthday Magic Studio! ✨ Start creating your surprise!", "success");
  }, 600);
});
