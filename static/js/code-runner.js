/**
 * code-runner.js
 * In-browser Code Execution Playground for Birthday Greetings.
 * Allows entering/pasting HTML/CSS/JavaScript code, executing it live
 * in a secure sandboxed iframe, and viewing interactive greeting outputs.
 */

const CODE_TEMPLATES = {
  balloons: {
    name: "🎈 Template 1: Balloon Popper & Confetti Burst",
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, #2b1055, #7597de);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }
  h1 {
    font-size: 2.8rem;
    text-shadow: 0 0 20px #ff007f;
    margin-bottom: 8px;
    animation: bounce 2s infinite ease-in-out;
  }
  p { font-size: 1.2rem; opacity: 0.9; }
  .balloon-container {
    display: flex;
    gap: 25px;
    margin-top: 30px;
  }
  .balloon {
    width: 80px;
    height: 100px;
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    cursor: pointer;
    position: relative;
    box-shadow: inset -10px -10px 0 rgba(0,0,0,0.15);
    transition: transform 0.2s;
    animation: floatUp 3s infinite ease-in-out alternate;
  }
  .balloon:hover { transform: scale(1.15); }
  .balloon::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 36px;
    width: 2px;
    height: 35px;
    background: rgba(255,255,255,0.7);
  }
  .b-pink { background: #ff2a85; }
  .b-cyan { background: #00f2fe; animation-delay: 0.5s; }
  .b-gold { background: #fbc531; animation-delay: 1s; }
  .b-purple { background: #9c88ff; animation-delay: 1.5s; }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes floatUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-25px); }
  }
</style>
</head>
<body>
  <h1>🎉 HAPPY BIRTHDAY! 🎉</h1>
  <p>Click any balloon to pop it and reveal secret wishes!</p>
  
  <div class="balloon-container">
    <div class="balloon b-pink" onclick="pop(this, 'May all your dreams come true! 🌟')"></div>
    <div class="balloon b-cyan" onclick="pop(this, 'Stay happy, healthy & blessed! 💖')"></div>
    <div class="balloon b-gold" onclick="pop(this, 'Wishing you boundless success! 🚀')"></div>
    <div class="balloon b-purple" onclick="pop(this, 'You are truly one of a kind! 🎂')"></div>
  </div>

  <div id="secret-note" style="margin-top: 40px; font-size: 1.5rem; font-weight: bold; color: #ffeaa7;"></div>

  <script>
    function pop(el, message) {
      el.style.transform = 'scale(1.5)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
      document.getElementById('secret-note').innerHTML = "💌 " + message;
      console.log("Popped balloon with surprise: " + message);
    }
  </script>
</body>
</html>`
  },

  neonHeart: {
    name: "💖 Template 2: Glowing Neon Heart & Dynamic Wishes",
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #090a0f;
    color: #fff;
    font-family: sans-serif;
  }
  .heart {
    position: relative;
    width: 100px;
    height: 90px;
    animation: pulse 1.2s infinite;
    cursor: pointer;
  }
  .heart:before, .heart:after {
    position: absolute;
    content: "";
    left: 50px;
    top: 0;
    width: 50px;
    height: 80px;
    background: #ff0055;
    border-radius: 50px 50px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
    box-shadow: 0 0 40px #ff0055, 0 0 80px #ff0055;
  }
  .heart:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.15); filter: drop-shadow(0 0 25px #ff0077); }
    100% { transform: scale(0.95); }
  }
  .neon-text {
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 40px;
    text-align: center;
    color: #fff;
    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00a8ff;
  }
  .sub {
    font-size: 1.1rem;
    color: #a4b0be;
    margin-top: 15px;
  }
</style>
</head>
<body>
  <div class="heart" onclick="alert('💖 Sending you infinite birthday love!')"></div>
  <div class="neon-text">HAPPY BIRTHDAY!</div>
  <div class="sub">Click the glowing heart for a surprise ❤️</div>
</body>
</html>`
  },

  cake: {
    name: "🎂 Template 3: 3D Cake with Blowable Candles",
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #1e1e2f;
    color: white;
    font-family: system-ui, sans-serif;
  }
  .cake {
    position: relative;
    width: 250px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }
  .layer {
    width: 100%;
    height: 60px;
    background: #ff758c;
    border-radius: 20px 20px 0 0;
    box-shadow: inset 0 -15px 0 #e63946;
  }
  .layer.top {
    width: 180px;
    height: 50px;
    background: #ffd166;
    box-shadow: inset 0 -10px 0 #f4a261;
    border-radius: 15px 15px 0 0;
  }
  .candle {
    position: absolute;
    top: 45px;
    width: 16px;
    height: 45px;
    background: repeating-linear-gradient(45deg, #fff, #fff 5px, #ff4757 5px, #ff4757 10px);
    border-radius: 4px;
    z-index: 10;
  }
  .flame {
    position: absolute;
    top: -24px;
    left: 1px;
    width: 14px;
    height: 22px;
    background: #ff9f43;
    border-radius: 50% 50% 20% 20%;
    box-shadow: 0 0 20px #ff9f43, 0 0 35px #ee5253;
    animation: flicker 0.2s infinite alternate;
    transition: all 0.3s ease;
  }
  @keyframes flicker {
    0% { transform: scale(1) rotate(-2deg); }
    100% { transform: scale(1.1) rotate(2deg); }
  }
  .flame.blown {
    opacity: 0;
    transform: translateY(-20px) scale(0);
  }
  .btn-blow {
    margin-top: 40px;
    padding: 12px 30px;
    font-size: 1.1rem;
    font-weight: bold;
    background: #00d2d3;
    color: #012b2b;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 210, 211, 0.4);
    transition: transform 0.2s;
  }
  .btn-blow:hover { transform: scale(1.05); }
</style>
</head>
<body>
  <div class="cake">
    <div class="candle">
      <div class="flame" id="flame"></div>
    </div>
    <div class="layer top"></div>
    <div class="layer"></div>
  </div>

  <button class="btn-blow" onclick="blowCandle()">💨 Blow Out The Candle!</button>
  <h2 id="msg" style="margin-top: 25px; color: #ff9ff3;"></h2>

  <script>
    function blowCandle() {
      const flame = document.getElementById('flame');
      flame.classList.add('blown');
      document.getElementById('msg').innerHTML = "✨ Your Wish Has Been Made! Happy Birthday! ✨";
      console.log("Candle blown out successfully!");
    }
  </script>
</body>
</html>`
  },

  matrixWishes: {
    name: "🚀 Template 4: Matrix Rain of Birthday Wishes",
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: black;
    overflow: hidden;
    font-family: monospace;
  }
  canvas { display: block; }
  .greeting-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #00ff66;
    text-shadow: 0 0 25px #00ff66;
    background: rgba(0,0,0,0.7);
    padding: 30px;
    border: 2px solid #00ff66;
    border-radius: 16px;
  }
</style>
</head>
<body>
  <canvas id="c"></canvas>
  <div class="greeting-overlay">
    <h1 style="font-size: 2.5rem; margin-bottom: 10px;">HAPPY BIRTHDAY!</h1>
    <p style="font-size: 1.2rem;">System Initialized: Another Year of Awesomeness Loaded!</p>
  </div>

  <script>
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const words = "HAPPY BIRTHDAY JOY LOVE HEALTH SMILES 🎉 🎂 💖 🎁 🌟 0 1 0 1";
    const letters = words.split("");
    const fontSize = 16;
    const columns = c.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#00ff66";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(draw, 35);
  </script>
</body>
</html>`
  }
};

class CodeRunner {
  constructor() {
    this.editorTextarea = document.getElementById('code-editor-input');
    this.templateSelect = document.getElementById('code-template-select');
    this.btnRun = document.getElementById('run-code-btn');
    this.btnClear = document.getElementById('clear-code-btn');
    this.btnCopy = document.getElementById('copy-code-btn');
    this.previewFrame = document.getElementById('code-preview-frame');
    this.consoleOutput = document.getElementById('code-console-output');

    this.init();
  }

  init() {
    if (this.templateSelect) {
      // Populate templates
      Object.entries(CODE_TEMPLATES).forEach(([key, val]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = val.name;
        this.templateSelect.appendChild(opt);
      });

      this.templateSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        if (CODE_TEMPLATES[key]) {
          this.editorTextarea.value = CODE_TEMPLATES[key].code;
          this.runCode();
        }
      });
    }

    if (this.btnRun) {
      this.btnRun.addEventListener('click', () => this.runCode());
    }

    if (this.btnClear) {
      this.btnClear.addEventListener('click', () => {
        this.editorTextarea.value = '';
        this.previewFrame.srcdoc = '';
        this.logToConsole("Editor cleared. Paste your code and hit 'Run Code'.", "info");
      });
    }

    if (this.btnCopy) {
      this.btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(this.editorTextarea.value);
        window.showToast("Code copied to clipboard!", "success");
      });
    }

    // Ctrl+Enter / Cmd+Enter keyboard shortcut
    if (this.editorTextarea) {
      this.editorTextarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.runCode();
        }
      });

      // Load default template #1
      this.editorTextarea.value = CODE_TEMPLATES.balloons.code;
    }

    // Run first template on initial load
    setTimeout(() => this.runCode(), 100);
  }

  logToConsole(msg, type = 'log') {
    if (!this.consoleOutput) return;
    const entry = document.createElement('div');
    entry.className = `console-msg msg-${type}`;
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="time">[${time}]</span> <span class="text">${this.escapeHtml(msg)}</span>`;
    this.consoleOutput.appendChild(entry);
    this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  runCode() {
    if (!this.editorTextarea || !this.previewFrame) return;

    const rawCode = this.editorTextarea.value.trim();
    if (!rawCode) {
      window.showToast("Please enter or paste some code first!", "error");
      return;
    }

    if (this.consoleOutput) {
      this.consoleOutput.innerHTML = '';
    }
    this.logToConsole("Executing code...", "info");

    // Intercept console.log and errors from iframe
    const consoleInterceptorScript = `
      <script>
        (function() {
          const origLog = console.log;
          const origError = console.error;
          const origWarn = console.warn;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'log', message: args.join(' ') }, '*');
            origLog.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: args.join(' ') }, '*');
            origError.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', message: args.join(' ') }, '*');
            origWarn.apply(console, args);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: 'Error at line ' + line + ': ' + msg }, '*');
          };
        })();
      </script>
    `;

    // Inject interceptor before closing head or at beginning
    let instrumentedCode = rawCode;
    if (instrumentedCode.includes('<head>')) {
      instrumentedCode = instrumentedCode.replace('<head>', '<head>' + consoleInterceptorScript);
    } else {
      instrumentedCode = consoleInterceptorScript + instrumentedCode;
    }

    // Set srcdoc
    this.previewFrame.srcdoc = instrumentedCode;
    this.logToConsole("Code executed successfully! Output updated in preview.", "success");
    window.showToast("🚀 Code Executed!", "success");
  }
}

// Global message listener for iframe console logs
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'CONSOLE_LOG') {
    const runner = window.codeRunnerInstance;
    if (runner) {
      runner.logToConsole(e.data.message, e.data.level);
    }
  }
});

window.CodeRunner = CodeRunner;
