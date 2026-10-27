/**
 * audio-synth.js
 * Synthesizes music and sound effects using the Web Audio API.
 * Requires ZERO external sound files or internet connection.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimeout = null;
    this.customAudio = null;
    this.isMuted = false;
  }

  // Initialize AudioContext on first user interaction (browser policy requirement)
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single musical tone
  playTone(freq, duration = 0.3, type = 'sine', gainVal = 0.2, delay = 0) {
    if (this.isMuted) return;
    this.init();

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Smooth attack and decay envelope
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(gainVal, this.ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn("Audio error:", e);
      }
    }, delay * 1000);
  }

  // Synthesize balloon pop sound
  playPop() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Frequency sweep down
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Noise burst for the pop snap
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Synthesize magical chime/sparkle for gift opening
  playChime() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.45, 'triangle', 0.15, idx * 0.07);
    });
  }

  // Synthesize candle blow / wind sound
  playBlow() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to simulate soft air blowing
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Synthesize celebration fanfare cheer
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    const chords = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.4 },  // E5
      { f: 783.99, d: 0.6 },  // G5
      { f: 1046.50, d: 0.8 }  // C6
    ];
    let time = 0;
    chords.forEach((chord) => {
      this.playTone(chord.f, chord.d, 'square', 0.1, time);
      this.playTone(chord.f * 0.5, chord.d, 'sine', 0.15, time);
      time += chord.d * 0.75;
    });
  }

  // Play full "Happy Birthday to You" melody loop
  playBirthdayMelody(onEnd = null) {
    if (this.isPlayingMusic) return;
    this.init();
    this.isPlayingMusic = true;

    // Frequencies for "Happy Birthday" (Key of C)
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;

    const notes = [
      // Hap-py Birth-day to you
      { f: C4, d: 0.35, g: 0.2 }, { f: C4, d: 0.25, g: 0.2 }, { f: D4, d: 0.5, g: 0.22 },
      { f: C4, d: 0.5, g: 0.22 }, { f: F4, d: 0.5, g: 0.24 }, { f: E4, d: 0.9, g: 0.24 },

      // Hap-py Birth-day to you
      { f: C4, d: 0.35, g: 0.2 }, { f: C4, d: 0.25, g: 0.2 }, { f: D4, d: 0.5, g: 0.22 },
      { f: C4, d: 0.5, g: 0.22 }, { f: G4, d: 0.5, g: 0.24 }, { f: F4, d: 0.9, g: 0.24 },

      // Hap-py Birth-day dear [Name]
      { f: C4, d: 0.35, g: 0.2 }, { f: C4, d: 0.25, g: 0.2 }, { f: C5, d: 0.5, g: 0.25 },
      { f: A4, d: 0.5, g: 0.25 }, { f: F4, d: 0.45, g: 0.22 }, { f: E4, d: 0.45, g: 0.22 }, { f: D4, d: 0.9, g: 0.22 },

      // Hap-py Birth-day to you!
      { f: B4, d: 0.35, g: 0.22 }, { f: B4, d: 0.25, g: 0.22 }, { f: A4, d: 0.5, g: 0.24 },
      { f: F4, d: 0.5, g: 0.24 }, { f: G4, d: 0.5, g: 0.25 }, { f: F4, d: 1.2, g: 0.28 }
    ];

    let totalDuration = 0;
    notes.forEach((item) => {
      this.playTone(item.f, item.d * 0.9, 'triangle', item.g, totalDuration);
      // Add subtle harmonic chime
      this.playTone(item.f * 2, item.d * 0.7, 'sine', item.g * 0.35, totalDuration);
      totalDuration += item.d + 0.08;
    });

    this.musicTimeout = setTimeout(() => {
      this.isPlayingMusic = false;
      if (onEnd) onEnd();
    }, totalDuration * 1000);
  }

  // Stop currently playing synthesized melody
  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
    }
  }

  // Handle custom audio upload
  setCustomAudio(file) {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    const url = URL.createObjectURL(file);
    this.customAudio = new Audio(url);
    this.customAudio.loop = true;
    return this.customAudio;
  }

  playCustomAudio() {
    if (this.customAudio && !this.isMuted) {
      this.customAudio.play().catch(e => console.warn(e));
    }
  }
}

// Global instance
window.soundSynth = new AudioSynthesizer();
