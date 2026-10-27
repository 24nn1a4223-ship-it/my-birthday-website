/**
 * wishes-creator.js
 * Handles personalized birthday wishes creation, themes, quotes, and HTML card exporting.
 */

const QUOTES_DATABASE = {
  heartfelt: [
    "May your day be filled with warm smiles, joyful laughter, and boundless love. Happy Birthday!",
    "You bring so much light and sunshine into the lives of everyone around you. Wishing you the happiest of birthdays!",
    "Another year older, another year wiser, and even more wonderful. May all your heartfelt wishes come true today!",
    "Count your life by smiles, not tears. Count your age by friends, not years. Have a magical birthday celebration!",
    "On this special day, I celebrate the incredible person you are. Thank you for being such a blessing in my life."
  ],
  funny: [
    "Happy Birthday! Don't worry about getting older—you're still younger than you will be tomorrow!",
    "Another year closer to touching your toes and having your back make weird noises. Cheers to you!",
    "I was going to bake you a cake, but the fire department said no to that many candles. Happy Birthday!",
    "Happy Birthday! I am so glad you were born, otherwise who would I complain to about everything?",
    "Age is merely the number of years the world has been enjoying your fantastic presence. Rock on!"
  ],
  inspirational: [
    "Live your life with joy, chase your biggest dreams fearlessly, and never lose your beautiful spark. Happy Birthday!",
    "The future belongs to those who believe in the beauty of their dreams. Here's to an incredible year ahead!",
    "Every year is a brand new chapter with blank pages waiting to be filled with greatness. Make this year unforgettable!",
    "May this new trip around the sun bring you endless opportunities, fierce courage, and overflowing happiness!"
  ],
  sweet: [
    "Wishing you a day as sweet, bright, and delightful as you are! Happy Birthday!",
    "Sending you big hugs, infinite love, and sweetest birthday wishes straight from the heart!",
    "May your birthday cake be extra sweet and your presents be plentiful. You deserve the best day ever!"
  ]
};

const THEMES = {
  rose: {
    name: "🌸 Sunset Blush",
    bgGradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    cardBg: "rgba(255, 255, 255, 0.88)",
    textColor: "#5e153b",
    accentColor: "#e63946",
    glowColor: "rgba(255, 117, 140, 0.5)",
    fontFamily: "'Playfair Display', Georgia, serif"
  },
  neon: {
    name: "🌌 Cosmic Neon",
    bgGradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    cardBg: "rgba(20, 20, 35, 0.82)",
    textColor: "#e0f2fe",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.6)",
    fontFamily: "'Outfit', sans-serif"
  },
  gold: {
    name: "✨ Golden Royale",
    bgGradient: "linear-gradient(135deg, #1f1c18, #2e261a, #110e0a)",
    cardBg: "rgba(35, 28, 16, 0.85)",
    textColor: "#fef3c7",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    fontFamily: "'Cinzel', Georgia, serif"
  },
  mint: {
    name: "🌿 Emerald Sparkle",
    bgGradient: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)",
    cardBg: "rgba(255, 255, 255, 0.92)",
    textColor: "#134e4a",
    accentColor: "#0f766e",
    glowColor: "rgba(20, 184, 166, 0.5)",
    fontFamily: "'Poppins', sans-serif"
  },
  candy: {
    name: "🍭 Carnival Fiesta",
    bgGradient: "linear-gradient(135deg, #f72585, #7209b7, #3a0ca3, #4361ee, #4cc9f0)",
    cardBg: "rgba(255, 255, 255, 0.95)",
    textColor: "#3a0ca3",
    accentColor: "#f72585",
    glowColor: "rgba(247, 37, 133, 0.5)",
    fontFamily: "'Fredoka', cursive, sans-serif"
  }
};

class WishesCreator {
  constructor() {
    this.uploadedPhotoData = null;
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.confettiParticles = [];
    this.confettiAnimId = null;

    this.initElements();
    this.bindEvents();
    this.updatePreview();
  }

  initElements() {
    this.nameInput = document.getElementById('wish-name');
    this.ageInput = document.getElementById('wish-age');
    this.relationSelect = document.getElementById('wish-relation');
    this.senderInput = document.getElementById('wish-sender');
    this.messageInput = document.getElementById('wish-message');
    this.quoteCategory = document.getElementById('quote-category');
    this.themeSelect = document.getElementById('wish-theme');
    this.animationSelect = document.getElementById('wish-animation');
    this.photoInput = document.getElementById('wish-photo-input');
    this.photoPreviewImg = document.getElementById('wish-photo-preview');
    this.removePhotoBtn = document.getElementById('remove-photo-btn');
    this.cardPreview = document.getElementById('card-live-preview');
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeConfettiCanvas();
      window.addEventListener('resize', () => this.resizeConfettiCanvas());
    }
  }

  bindEvents() {
    // Live update triggers
    const liveInputs = [
      this.nameInput, this.ageInput, this.relationSelect,
      this.senderInput, this.messageInput, this.themeSelect, this.animationSelect
    ];
    liveInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.updatePreview());
        input.addEventListener('change', () => this.updatePreview());
      }
    });

    // Random quote button
    const quoteBtn = document.getElementById('random-quote-btn');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', () => this.insertRandomQuote());
    }

    // Photo file upload
    if (this.photoInput) {
      this.photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
    }
    if (this.removePhotoBtn) {
      this.removePhotoBtn.addEventListener('click', () => {
        this.uploadedPhotoData = null;
        if (this.photoPreviewImg) this.photoPreviewImg.src = '';
        if (this.photoInput) this.photoInput.value = '';
        document.getElementById('photo-upload-container')?.classList.remove('has-image');
        this.updatePreview();
      });
    }

    // Download Standalone Card Button
    const downloadCardBtn = document.getElementById('download-card-html-btn');
    if (downloadCardBtn) {
      downloadCardBtn.addEventListener('click', () => this.downloadStandaloneCard());
    }

    // Play Celebration audio & burst confetti button
    const celebrateBtn = document.getElementById('celebrate-card-btn');
    if (celebrateBtn) {
      celebrateBtn.addEventListener('click', () => {
        window.soundSynth.playBirthdayMelody();
        this.burstConfetti(120);
        window.showToast("🎉 Playing Birthday Melody! Have fun!", "success");
      });
    }
  }

  resizeConfettiCanvas() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = this.confettiCanvas.parentElement.clientWidth || window.innerWidth;
    this.confettiCanvas.height = this.confettiCanvas.parentElement.clientHeight || window.innerHeight;
  }

  handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.showToast("Please choose a valid image file (JPG, PNG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedPhotoData = event.target.result;
      if (this.photoPreviewImg) {
        this.photoPreviewImg.src = this.uploadedPhotoData;
        document.getElementById('photo-upload-container')?.classList.add('has-image');
      }
      this.updatePreview();
      window.showToast("Photo uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  }

  insertRandomQuote() {
    const cat = this.quoteCategory ? this.quoteCategory.value : 'heartfelt';
    const list = QUOTES_DATABASE[cat] || QUOTES_DATABASE.heartfelt;
    const randomQuote = list[Math.floor(Math.random() * list.length)];
    if (this.messageInput) {
      this.messageInput.value = randomQuote;
      this.updatePreview();
      window.showToast("✨ Quote inserted!", "info");
    }
  }

  getFormData() {
    return {
      name: (this.nameInput?.value || '').trim() || "Alex",
      age: (this.ageInput?.value || '').trim(),
      relation: this.relationSelect?.value || 'Friend',
      sender: (this.senderInput?.value || '').trim() || "With Love",
      message: (this.messageInput?.value || '').trim() || "May your special day be brimming with boundless smiles, sweet moments, and all the love your heart can hold!",
      themeKey: this.themeSelect?.value || 'rose',
      animation: this.animationSelect?.value || 'confetti',
      photo: this.uploadedPhotoData
    };
  }

  updatePreview() {
    const data = this.getFormData();
    const theme = THEMES[data.themeKey] || THEMES.rose;
    const previewContainer = this.cardPreview;
    if (!previewContainer) return;

    // Apply theme styles to live preview wrapper
    previewContainer.style.background = theme.bgGradient;

    const ageBadge = data.age ? `<div class="card-age-badge">${data.age}</div>` : '';
    const relationBadge = data.relation ? `<span class="card-relation-tag">To my wonderful ${data.relation}</span>` : '';

    const photoHtml = data.photo ? `
      <div class="card-hero-photo-wrapper">
        <div class="card-hero-photo-frame">
          <img src="${data.photo}" alt="${data.name}" class="card-hero-photo" />
        </div>
        <div class="photo-sparkle-stars">✨ 🌟 💫</div>
      </div>
    ` : `
      <div class="card-cake-icon">🎂</div>
    `;

    previewContainer.innerHTML = `
      <div class="birthday-card-inner" style="background: ${theme.cardBg}; color: ${theme.textColor}; box-shadow: 0 20px 40px ${theme.glowColor}; font-family: ${theme.fontFamily};">
        <div class="card-decorations">
          <span class="decor-balloons">🎈🎈</span>
          <span class="decor-party">🎉</span>
        </div>
        
        ${relationBadge}
        
        <h1 class="card-title" style="color: ${theme.accentColor};">
          Happy Birthday, <br/>
          <span class="highlight-name">${data.name}</span>!
        </h1>

        ${ageBadge}
        ${photoHtml}

        <p class="card-custom-message">"${data.message}"</p>

        <div class="card-footer-signature">
          <span>Warmest Wishes,</span>
          <strong>${data.sender}</strong>
        </div>
      </div>
    `;

    // Trigger visual confetti if confetti is selected
    if (data.animation === 'confetti') {
      this.burstConfetti(25);
    }
  }

  burstConfetti(amount = 40) {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    const colors = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0', '#ffd166', '#06d6a0'];
    
    for (let i = 0; i < amount; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: -10,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 6,
        velY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    if (!this.confettiAnimId) {
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiCtx || !this.confettiCanvas) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.velX;
      p.y += p.velY;
      p.rotation += p.rotSpeed;

      this.confettiCtx.save();
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.confettiCtx.restore();

      // Remove particles off screen
      if (p.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      this.confettiAnimId = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiAnimId = null;
    }
  }

  // Generate self-contained standalone HTML card file
  downloadStandaloneCard() {
    const data = this.getFormData();
    const theme = THEMES[data.themeKey] || THEMES.rose;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy Birthday ${data.name}! 🎉</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${theme.bgGradient};
      font-family: ${theme.fontFamily};
      padding: 20px;
      overflow-x: hidden;
    }
    .card-container {
      background: ${theme.cardBg};
      color: ${theme.textColor};
      box-shadow: 0 25px 50px -12px ${theme.glowColor}, 0 0 0 1px rgba(255,255,255,0.2);
      border-radius: 28px;
      padding: 40px 30px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      position: relative;
      animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(12px);
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.85) translateY(30px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: ${theme.accentColor};
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 20px;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 2.2rem;
      line-height: 1.2;
      margin-bottom: 20px;
      color: ${theme.accentColor};
    }
    .photo-frame {
      width: 170px;
      height: 170px;
      margin: 15px auto 25px;
      border-radius: 50%;
      padding: 6px;
      background: linear-gradient(45deg, ${theme.accentColor}, #ffd166);
      box-shadow: 0 10px 25px ${theme.glowColor};
    }
    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .message {
      font-size: 1.15rem;
      line-height: 1.6;
      margin: 20px 0;
      font-style: italic;
    }
    .signature {
      margin-top: 25px;
      border-top: 1px dashed rgba(0,0,0,0.15);
      padding-top: 15px;
      font-size: 0.95rem;
    }
    .btn-play {
      margin-top: 20px;
      padding: 12px 28px;
      border: none;
      border-radius: 50px;
      background: ${theme.accentColor};
      color: white;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 8px 16px ${theme.glowColor};
      transition: all 0.2s ease;
    }
    .btn-play:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px ${theme.glowColor};
    }
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <div class="card-container">
    <div class="badge">Happy Birthday!</div>
    <h1>Happy Birthday, <br/>${data.name}!</h1>
    ${data.photo ? `<div class="photo-frame"><img src="${data.photo}" alt="${data.name}" /></div>` : '<div style="font-size: 60px; margin: 15px;">🎂</div>'}
    <p class="message">"${data.message}"</p>
    <div class="signature">With Love,<br/><strong>${data.sender}</strong></div>
    <button class="btn-play" onclick="playSong()">🎵 Play Birthday Tune & Confetti!</button>
  </div>

  <script>
    // Confetti logic
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = [];
    const colors = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0', '#ffd166'];
    for(let i=0; i<80; i++) {
      pieces.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height,
        s: Math.random()*8+4,
        c: colors[Math.floor(Math.random()*colors.length)],
        vy: Math.random()*3+2,
        vx: (Math.random()-0.5)*4
      });
    }
    function renderConfetti() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.s, p.s);
        if(p.y > canvas.height) p.y = -10;
      });
      requestAnimationFrame(renderConfetti);
    }
    renderConfetti();

    // Birthday tune synthesis
    function playSong() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioCtx();
      const C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25;
      const notes = [
        {f:C4, d:0.3}, {f:C4, d:0.2}, {f:D4, d:0.5}, {f:C4, d:0.5}, {f:F4, d:0.5}, {f:E4, d:0.8},
        {f:C4, d:0.3}, {f:C4, d:0.2}, {f:D4, d:0.5}, {f:C4, d:0.5}, {f:G4, d:0.5}, {f:F4, d:0.8},
        {f:C4, d:0.3}, {f:C4, d:0.2}, {f:C5, d:0.5}, {f:A4, d:0.5}, {f:F4, d:0.4}, {f:E4, d:0.4}, {f:D4, d:0.8},
        {f:B4, d:0.3}, {f:B4, d:0.2}, {f:A4, d:0.5}, {f:F4, d:0.5}, {f:G4, d:0.5}, {f:F4, d:1.0}
      ];
      let t = actx.currentTime + 0.1;
      notes.forEach(n => {
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = n.f;
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(g);
        g.connect(actx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d + 0.08;
      });
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Birthday_Card_${data.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast("🎉 Standalone Birthday Card downloaded! You can send this file to anyone!", "success");
  }
}

window.WishesCreator = WishesCreator;
