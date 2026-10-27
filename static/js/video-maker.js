/**
 * video-maker.js
 * Surprise Video Creator & Slideshow Engine.
 * Supports multiple photo uploads, captions, Ken Burns & fade transitions,
 * audio sync, and canvas recording to export a downloadable video file.
 */

class VideoMaker {
  constructor() {
    this.slides = []; // Array of { id, img, caption, duration }
    this.currentIndex = 0;
    this.isPlaying = false;
    this.playbackTimer = null;
    this.transitionProgress = 0;
    this.animFrameId = null;

    // Canvas settings
    this.canvas = document.getElementById('video-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.slideDuration = 3.5; // seconds per photo
    this.transitionDuration = 0.8; // seconds transition

    // Recording state
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;

    this.initElements();
    this.bindEvents();
    this.loadDefaultSampleSlides();
  }

  initElements() {
    this.multiPhotoInput = document.getElementById('video-photo-input');
    this.slidesListEl = document.getElementById('slides-timeline-list');
    this.btnPlay = document.getElementById('video-play-btn');
    this.btnRecord = document.getElementById('video-export-btn');
    this.progressBar = document.getElementById('video-progress-bar');
    this.musicSelect = document.getElementById('video-music-select');
    this.customMusicInput = document.getElementById('video-custom-music');
    this.transitionSelect = document.getElementById('video-transition-select');
    this.overlaySelect = document.getElementById('video-overlay-select');
  }

  bindEvents() {
    if (this.multiPhotoInput) {
      this.multiPhotoInput.addEventListener('change', (e) => this.handleMultiplePhotos(e));
    }

    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => this.togglePlay());
    }

    if (this.btnRecord) {
      this.btnRecord.addEventListener('click', () => this.exportVideo());
    }

    if (this.customMusicInput) {
      this.customMusicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          window.soundSynth.setCustomAudio(file);
          window.showToast("Custom background song loaded!", "success");
        }
      });
    }

    if (this.canvas) {
      // Set default HD aspect ratio 16:9 (1280x720) or 1080x1080
      this.canvas.width = 1280;
      this.canvas.height = 720;
    }
  }

  // Sample starter slides so user immediately sees what the video creator looks like!
  loadDefaultSampleSlides() {
    const starterPhotos = [
      {
        url: this.generateSampleCardDataUrl("🎂 Happy Birthday!", "#ff758c", "#ff7eb3"),
        caption: "A very special day for a very special person!"
      },
      {
        url: this.generateSampleCardDataUrl("✨ Memories & Smiles", "#7928ca", "#ff0080"),
        caption: "Thank you for all the laughter and unforgettable moments."
      },
      {
        url: this.generateSampleCardDataUrl("🌟 Best Year Ever!", "#0070f3", "#00dfd8"),
        caption: "Wishing you love, boundless joy, and success ahead!"
      }
    ];

    starterPhotos.forEach(item => {
      const img = new Image();
      img.onload = () => {
        this.slides.push({
          id: 'slide_' + Math.random().toString(36).substr(2, 9),
          img: img,
          caption: item.caption
        });
        this.renderSlidesTimeline();
        if (this.slides.length === 1) {
          this.renderStaticFrame(0);
        }
      };
      img.src = item.url;
    });
  }

  generateSampleCardDataUrl(title, color1, color2) {
    const c = document.createElement('canvas');
    c.width = 1280;
    c.height = 720;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // Decorative circles
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1100, 500, 240, 0, Math.PI * 2);
    ctx.fill();

    // Central card
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.roundRect ? ctx.roundRect(340, 160, 600, 400, 30) : ctx.fillRect(340, 160, 600, 400);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 640, 340);

    ctx.fillStyle = '#64748b';
    ctx.font = '24px sans-serif';
    ctx.fillText("Upload your photos to personalize this surprise video!", 640, 410);

    return c.toDataURL('image/png');
  }

  handleMultiplePhotos(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let loadedCount = 0;
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.slides.push({
            id: 'slide_' + Math.random().toString(36).substr(2, 9),
            img: img,
            caption: `Special memory #${this.slides.length + 1} 💖`
          });
          loadedCount++;
          if (loadedCount === files.length) {
            this.renderSlidesTimeline();
            this.renderStaticFrame(this.slides.length - 1);
            window.showToast(`Added ${loadedCount} new photo(s) to the video!`, "success");
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  }

  renderSlidesTimeline() {
    if (!this.slidesListEl) return;
    this.slidesListEl.innerHTML = '';

    this.slides.forEach((slide, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = `slide-timeline-item ${index === this.currentIndex ? 'active' : ''}`;
      itemEl.innerHTML = `
        <div class="slide-thumb-wrapper">
          <img src="${slide.img.src}" alt="Slide ${index + 1}" />
          <span class="slide-num">${index + 1}</span>
        </div>
        <div class="slide-details">
          <input type="text" class="slide-caption-input" value="${slide.caption}" placeholder="Add sweet caption here..." />
        </div>
        <div class="slide-actions">
          <button class="btn-icon move-up" title="Move Up" ${index === 0 ? 'disabled' : ''}>⬆️</button>
          <button class="btn-icon move-down" title="Move Down" ${index === this.slides.length - 1 ? 'disabled' : ''}>⬇️</button>
          <button class="btn-icon delete-slide" title="Remove Photo">🗑️</button>
        </div>
      `;

      // Event handlers
      const captionInput = itemEl.querySelector('.slide-caption-input');
      captionInput.addEventListener('input', (e) => {
        slide.caption = e.target.value;
        if (index === this.currentIndex) this.renderStaticFrame(index);
      });

      itemEl.querySelector('.move-up')?.addEventListener('click', () => {
        if (index > 0) {
          const temp = this.slides[index];
          this.slides[index] = this.slides[index - 1];
          this.slides[index - 1] = temp;
          this.renderSlidesTimeline();
          this.renderStaticFrame(index - 1);
        }
      });

      itemEl.querySelector('.move-down')?.addEventListener('click', () => {
        if (index < this.slides.length - 1) {
          const temp = this.slides[index];
          this.slides[index] = this.slides[index + 1];
          this.slides[index + 1] = temp;
          this.renderSlidesTimeline();
          this.renderStaticFrame(index + 1);
        }
      });

      itemEl.querySelector('.delete-slide')?.addEventListener('click', () => {
        if (this.slides.length <= 1) {
          window.showToast("You need at least 1 photo for the video!", "error");
          return;
        }
        this.slides.splice(index, 1);
        this.currentIndex = Math.max(0, index - 1);
        this.renderSlidesTimeline();
        this.renderStaticFrame(this.currentIndex);
      });

      itemEl.addEventListener('click', (e) => {
        if (!e.target.matches('button') && !e.target.matches('input')) {
          this.currentIndex = index;
          this.renderSlidesTimeline();
          this.renderStaticFrame(index);
        }
      });

      this.slidesListEl.appendChild(itemEl);
    });
  }

  // Draw a single frame with Ken Burns zoom, overlay, and styled caption banner
  drawSlide(slide, zoomProgress = 0, opacity = 1) {
    if (!this.ctx || !slide || !slide.img) return;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background blurred fill
    this.ctx.drawImage(slide.img, -50, -50, w + 100, h + 100);
    this.ctx.fillStyle = 'rgba(10, 10, 20, 0.55)';
    this.ctx.fillRect(0, 0, w, h);

    // Ken Burns zoom scale calculation
    const scale = 1.0 + (zoomProgress * 0.12);
    const imgAspect = slide.img.width / slide.img.height;
    const canvasAspect = w / h;

    let drawW, drawH;
    if (imgAspect > canvasAspect) {
      drawH = h * 0.88 * scale;
      drawW = drawH * imgAspect;
    } else {
      drawW = w * 0.88 * scale;
      drawH = drawW / imgAspect;
    }

    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2 - 20;

    // Soft photo shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    this.ctx.shadowBlur = 35;
    this.ctx.shadowOffsetY = 15;

    // Render Photo
    this.ctx.drawImage(slide.img, drawX, drawY, drawW, drawH);
    this.ctx.restore();

    // Draw festive frame overlay if selected
    this.drawFestiveDecorations();

    // Draw caption banner at bottom
    if (slide.caption) {
      this.drawCaption(slide.caption);
    }
  }

  drawFestiveDecorations() {
    const overlay = this.overlaySelect ? this.overlaySelect.value : 'sparkles';
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    if (overlay === 'sparkles') {
      // Golden corner flourishes
      this.ctx.fillStyle = '#ffd700';
      this.ctx.font = '36px sans-serif';
      this.ctx.fillText('✨', 40, 60);
      this.ctx.fillText('✨', w - 70, 60);
      this.ctx.fillText('🌟', 40, h - 140);
      this.ctx.fillText('🌟', w - 70, h - 140);
    } else if (overlay === 'balloons') {
      this.ctx.font = '40px sans-serif';
      this.ctx.fillText('🎈', 50, 70);
      this.ctx.fillText('🎈', w - 80, 70);
      this.ctx.fillText('🎉', 50, h - 140);
      this.ctx.fillText('🎂', w - 80, h - 140);
    }
    this.ctx.restore();
  }

  drawCaption(text) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    // Glassmorphic caption banner
    const bannerHeight = 85;
    const bannerY = h - bannerHeight - 30;
    const bannerWidth = w * 0.82;
    const bannerX = (w - bannerWidth) / 2;

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;

    if (this.ctx.roundRect) {
      this.ctx.beginPath();
      this.ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 20);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    }

    // Text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 30px "Outfit", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, w / 2, bannerY + (bannerHeight / 2));

    this.ctx.restore();
  }

  renderStaticFrame(index) {
    if (!this.slides.length) return;
    const slide = this.slides[index] || this.slides[0];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawSlide(slide, 0, 1);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.slides.length) {
      window.showToast("Please add photos first!", "error");
      return;
    }

    this.isPlaying = true;
    if (this.btnPlay) this.btnPlay.innerHTML = "⏸️ Pause Video";

    // Play selected audio
    const musicChoice = this.musicSelect ? this.musicSelect.value : 'synth';
    if (musicChoice === 'synth') {
      window.soundSynth.playBirthdayMelody();
    } else if (musicChoice === 'custom') {
      window.soundSynth.playCustomAudio();
    }

    const totalSlideDurationMs = this.slideDuration * 1000;
    let startTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isPlaying) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalSlideDurationMs, 1);

      const currentSlide = this.slides[this.currentIndex];
      const nextSlide = this.slides[(this.currentIndex + 1) % this.slides.length];

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const transitionThresh = (totalSlideDurationMs - (this.transitionDuration * 1000)) / totalSlideDurationMs;

      if (progress < transitionThresh || this.slides.length === 1) {
        // Normal playback with subtle Ken Burns zoom
        this.drawSlide(currentSlide, progress, 1);
      } else {
        // Smooth cross-fade transition
        const tProgress = (progress - transitionThresh) / (1 - transitionThresh);
        this.drawSlide(currentSlide, 1, 1 - tProgress);
        this.drawSlide(nextSlide, 0, tProgress);
      }

      // Update progress bar
      if (this.progressBar) {
        const overallProgress = ((this.currentIndex + progress) / this.slides.length) * 100;
        this.progressBar.style.width = `${overallProgress}%`;
      }

      if (progress >= 1) {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.renderSlidesTimeline();
        startTime = performance.now();
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  pause() {
    this.isPlaying = false;
    if (this.btnPlay) this.btnPlay.innerHTML = "▶️ Play Surprise Video";
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.soundSynth.stopMusic();
  }

  // Export video recording using MediaRecorder API
  exportVideo() {
    if (!this.slides.length) {
      window.showToast("Add photos before exporting video!", "error");
      return;
    }

    if (this.isRecording) return;
    this.isRecording = true;
    this.pause();
    this.currentIndex = 0;

    window.showToast("🎬 Recording video... Please wait while it renders!", "info");
    if (this.btnRecord) {
      this.btnRecord.disabled = true;
      this.btnRecord.innerHTML = "⏳ Recording Video...";
    }

    // Capture Canvas stream at 30 FPS
    const stream = this.canvas.captureStream(30);
    this.recordedChunks = [];

    // Optional audio track integration
    let combinedStream = stream;
    if (window.soundSynth.ctx && window.soundSynth.ctx.destination) {
      try {
        const dest = window.soundSynth.ctx.createMediaStreamDestination();
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) {
          combinedStream.addTrack(audioTrack);
        }
      } catch (e) {}
    }

    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(combinedStream);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Birthday_Surprise_Video_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.isRecording = false;
      if (this.btnRecord) {
        this.btnRecord.disabled = false;
        this.btnRecord.innerHTML = "⬇️ Export / Download Video";
      }
      this.pause();
      window.showToast("🎉 Video successfully exported and downloaded!", "success");
    };

    this.mediaRecorder.start();
    this.play();

    // Auto-stop after 1 full cycle of all slides
    const totalVideoMs = this.slides.length * this.slideDuration * 1000;
    setTimeout(() => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    }, totalVideoMs + 500);
  }
}

window.VideoMaker = VideoMaker;
