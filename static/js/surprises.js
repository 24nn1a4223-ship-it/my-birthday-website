/**
 * surprises.js
 * Interactive Birthday Surprises:
 * 1. 3D Mystery Gift Box unboxing
 * 2. Floating Balloon Pop mini-game with secret messages
 * 3. Candle Blow-Out & Celebration Fireworks
 * 4. Scratch-Off Reveal Card
 */

class InteractiveSurprises {
  constructor() {
    this.poppedBalloonsCount = 0;
    this.balloonContainer = document.getElementById('balloon-arena');
    this.giftBox = document.getElementById('mystery-gift-box');
    this.scratchCanvas = document.getElementById('scratch-card-canvas');
    this.isScratchedDone = false;

    this.surpriseMessages = [
      "🌟 You make the world so much brighter!",
      "💖 Never stop smiling your gorgeous smile!",
      "🚀 To the stars and beyond this year!",
      "🍰 Eat all the cake you want today—calories don't count!",
      "🎉 Best friend award goes to YOU!",
      "🌈 Wishing you 365 days of good vibes and success!",
      "💎 You are a rare and precious gem!",
      "🔥 Keep being the legend you are!"
    ];

    this.initGiftBox();
    this.initBalloons();
    this.initCandleBlow();
    this.initScratchCard();
  }

  // ================= 1. MYSTERY GIFT BOX =================
  initGiftBox() {
    const giftWrapper = document.getElementById('gift-interactive-wrapper');
    const resetBtn = document.getElementById('reset-gift-btn');

    if (giftWrapper) {
      giftWrapper.addEventListener('click', (e) => {
        // Prevent clicking reset button triggering wrap
        if (e.target.closest('#reset-gift-btn')) return;

        if (!giftWrapper.classList.contains('opened')) {
          giftWrapper.classList.add('opened');
          window.soundSynth.playChime();
          this.triggerConfettiBurst(giftWrapper);
          window.showToast("🎁 You opened the surprise gift box!", "success");
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        giftWrapper?.classList.remove('opened');
        window.showToast("Gift wrapped back up!", "info");
      });
    }
  }

  triggerConfettiBurst(container) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'gift-burst-particle';
      const colors = ['#f72585', '#ffd166', '#06d6a0', '#118ab2', '#7209b7'];
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 300}px`);
      p.style.setProperty('--dy', `${-Math.random() * 250 - 50}px`);
      container.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  // ================= 2. BALLOON POP ARENA =================
  initBalloons() {
    const spawnBtn = document.getElementById('spawn-balloons-btn');
    if (spawnBtn) {
      spawnBtn.addEventListener('click', () => this.spawnBalloons(8));
    }

    // Initial spawn
    if (this.balloonContainer) {
      this.spawnBalloons(6);
    }
  }

  spawnBalloons(count = 6) {
    if (!this.balloonContainer) return;
    const colors = [
      { bg: 'linear-gradient(135deg, #ff4757, #ff6b81)', glow: 'rgba(255, 71, 87, 0.4)' },
      { bg: 'linear-gradient(135deg, #1e90ff, #70a1ff)', glow: 'rgba(30, 144, 255, 0.4)' },
      { bg: 'linear-gradient(135deg, #2ed573, #7bed9f)', glow: 'rgba(46, 213, 115, 0.4)' },
      { bg: 'linear-gradient(135deg, #ffa502, #eccc68)', glow: 'rgba(255, 165, 2, 0.4)' },
      { bg: 'linear-gradient(135deg, #9b59b6, #e056fd)', glow: 'rgba(155, 89, 182, 0.4)' },
      { bg: 'linear-gradient(135deg, #ff78ae, #ff9ff3)', glow: 'rgba(255, 120, 174, 0.4)' }
    ];

    for (let i = 0; i < count; i++) {
      const col = colors[Math.floor(Math.random() * colors.length)];
      const balloon = document.createElement('div');
      balloon.className = 'interactive-balloon';
      balloon.style.background = col.bg;
      balloon.style.boxShadow = `0 10px 25px ${col.glow}`;
      balloon.style.left = `${Math.random() * 80 + 5}%`;
      balloon.style.animationDuration = `${Math.random() * 4 + 7}s`;
      balloon.style.animationDelay = `${Math.random() * 2}s`;

      const msg = this.surpriseMessages[Math.floor(Math.random() * this.surpriseMessages.length)];

      balloon.addEventListener('click', () => {
        window.soundSynth.playPop();
        this.popBalloon(balloon, msg);
      });

      this.balloonContainer.appendChild(balloon);
    }
  }

  popBalloon(balloonEl, message) {
    const rect = balloonEl.getBoundingClientRect();
    const containerRect = this.balloonContainer.getBoundingClientRect();
    const posX = rect.left - containerRect.left + 35;
    const posY = rect.top - containerRect.top + 45;

    // Remove balloon
    balloonEl.remove();
    this.poppedBalloonsCount++;

    // Update popped counter
    const counterEl = document.getElementById('popped-counter');
    if (counterEl) counterEl.textContent = this.poppedBalloonsCount;

    // Burst visual particles
    for (let i = 0; i < 12; i++) {
      const spark = document.createElement('div');
      spark.className = 'balloon-pop-particle';
      spark.style.left = `${posX}px`;
      spark.style.top = `${posY}px`;
      spark.style.setProperty('--tx', `${(Math.random() - 0.5) * 120}px`);
      spark.style.setProperty('--ty', `${(Math.random() - 0.5) * 120}px`);
      this.balloonContainer.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }

    // Display revealed secret message
    const wishesTray = document.getElementById('collected-wishes-tray');
    if (wishesTray) {
      const item = document.createElement('div');
      item.className = 'revealed-wish-card';
      item.innerHTML = `<span>🎈</span> <p>${message}</p>`;
      wishesTray.prepend(item);
    }
  }

  // ================= 3. CANDLE BLOW-OUT =================
  initCandleBlow() {
    const blowBtn = document.getElementById('blow-candle-btn');
    const cakeFlames = document.querySelectorAll('.cake-candle-flame');
    const cakeWishStatus = document.getElementById('cake-wish-status');

    if (blowBtn) {
      blowBtn.addEventListener('click', () => {
        window.soundSynth.playBlow();
        cakeFlames.forEach(f => f.classList.add('blown-out'));

        if (cakeWishStatus) {
          cakeWishStatus.innerHTML = `
            <div class="wish-granted-banner">
              <h3>✨ May All Your Birthday Wishes Come True! ✨</h3>
              <p>The universe has received your wish!</p>
            </div>
          `;
        }

        setTimeout(() => {
          window.soundSynth.playFanfare();
          this.triggerCakeFireworks();
        }, 400);

        blowBtn.disabled = true;
        blowBtn.innerHTML = "🎉 Wish Granted!";
      });
    }

    // Allow relighting candles
    const relightBtn = document.getElementById('relight-candle-btn');
    if (relightBtn) {
      relightBtn.addEventListener('click', () => {
        cakeFlames.forEach(f => f.classList.remove('blown-out'));
        if (cakeWishStatus) cakeWishStatus.innerHTML = '<p class="make-wish-hint">Make a silent wish in your heart, then blow the candles!</p>';
        if (blowBtn) {
          blowBtn.disabled = false;
          blowBtn.innerHTML = "💨 Blow Candles!";
        }
        window.showToast("Candles relit! Ready for another wish!", "info");
      });
    }
  }

  triggerCakeFireworks() {
    const cakeStage = document.getElementById('cake-stage-container');
    if (!cakeStage) return;

    for (let i = 0; i < 20; i++) {
      const fw = document.createElement('div');
      fw.className = 'firework-particle';
      const colors = ['#ff0055', '#00e5ff', '#ffbe0b', '#8338ec', '#3a86ff'];
      fw.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      fw.style.left = `${Math.random() * 80 + 10}%`;
      fw.style.top = `${Math.random() * 50 + 10}%`;
      fw.style.setProperty('--fx', `${(Math.random() - 0.5) * 160}px`);
      fw.style.setProperty('--fy', `${(Math.random() - 0.5) * 160}px`);
      cakeStage.appendChild(fw);
      setTimeout(() => fw.remove(), 1000);
    }
  }

  // ================= 4. SCRATCH-OFF CARD =================
  initScratchCard() {
    if (!this.scratchCanvas) return;
    const ctx = this.scratchCanvas.getContext('2d');
    const width = (this.scratchCanvas.width = 400);
    const height = (this.scratchCanvas.height = 240);

    // Fill silver foil layer
    const paintFoil = () => {
      this.isScratchedDone = false;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#d1d5db');
      grad.addColorStop(0.5, '#f3f4f6');
      grad.addColorStop(1, '#9ca3af');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Label on top of foil
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Scratch Here To Reveal! ✨', width / 2, height / 2);
    };

    paintFoil();

    let isScratching = false;

    const scratch = (x, y) => {
      if (this.isScratchedDone) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      this.checkScratchProgress(ctx, width, height);
    };

    const getPos = (e) => {
      const rect = this.scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (width / rect.width),
        y: (clientY - rect.top) * (height / rect.height)
      };
    };

    this.scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('mouseup', () => {
      isScratching = false;
    });

    this.scratchCanvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    // Touch support for phones
    this.scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }, { passive: true });

    this.scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    }, { passive: true });

    const resetScratchBtn = document.getElementById('reset-scratch-btn');
    if (resetScratchBtn) {
      resetScratchBtn.addEventListener('click', () => {
        paintFoil();
        window.showToast("Scratch card reset!", "info");
      });
    }
  }

  checkScratchProgress(ctx, width, height) {
    if (this.isScratchedDone) return;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      let transparentPixels = 0;
      const totalPixels = imgData.data.length / 4;

      for (let i = 3; i < imgData.data.length; i += 16) {
        if (imgData.data[i] === 0) {
          transparentPixels += 4;
        }
      }

      if (transparentPixels / totalPixels > 0.42) {
        this.isScratchedDone = true;
        ctx.clearRect(0, 0, width, height);
        window.soundSynth.playChime();
        window.showToast("🎉 Secret message fully revealed!", "success");
      }
    } catch (e) {}
  }
}

window.InteractiveSurprises = InteractiveSurprises;
