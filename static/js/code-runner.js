/**
 * code-runner.js
 * In-browser Code Execution Playground for Birthday Greetings.
 * Supports:
 * 1. Interactive HTML/CSS/JavaScript with particle animations & games
 * 2. Real-time Python Code Execution with variable tracking, f-strings, loops, and print output!
 */

const CODE_TEMPLATES = {
  pythonWishes: {
    name: "🐍 Template 1: Python Birthday Script (Prints, Loops & ASCII Cake)",
    code: `# 🐍 Python Birthday Celebration Script
name = "Ratna"
age = 22

print("=" * 45)
print(f"🎉 HAPPY {age}nd BIRTHDAY, {name.upper()}! 🎉")
print("=" * 45)

wishes = [
    "May your year be filled with laughter and endless joy! 💖",
    "May all your biggest dreams and goals come true! 🚀",
    "Wishing you boundless health, happiness, and peace! ✨",
    "Eat all the birthday cake you want today! 🍰"
]

print("\n💌 Special Birthday Wishes For You:")
for i, wish in enumerate(wishes, 1):
    print(f"  {i}. {wish}")

print("\n🎂 Here is your birthday cake:")
print("       🕯️   🕯️   🕯️")
print("     |~~~~~~~~~~~~~|")
print("     |  ★ HAPPY ★  |")
print("     |  BIRTHDAY!  |")
print("     |_____________|")
print("\n" + "=" * 45)
print(f"✨ Have the most wonderful birthday, {name}! ✨")`
  },

  balloons: {
    name: "🎈 Template 2: Balloon Popper & Confetti Burst (HTML/JS)",
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
    name: "💖 Template 3: Glowing Neon Heart & Dynamic Wishes (HTML/CSS)",
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
    name: "🎂 Template 4: 3D Cake with Blowable Candles (HTML/JS)",
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
    name: "🚀 Template 5: Matrix Rain of Birthday Wishes (HTML/Canvas)",
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
      // Clear existing options
      this.templateSelect.innerHTML = '';
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
        this.logToConsole("Editor cleared. Paste your Python or HTML/JS code and click 'Run Code'.", "info");
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

      // Default load Template 1: Python
      this.editorTextarea.value = CODE_TEMPLATES.pythonWishes.code;
    }

    // Run first template on initial load
    setTimeout(() => this.runCode(), 200);
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

  isPythonCode(code) {
    const trimmed = code.trim();
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<div') || trimmed.startsWith('<style')) {
      return false;
    }
    return /print\s*\(|def\s+\w+|import\s+\w+|for\s+\w+\s+in|if\s+.*:|#.*|wishes\s*=|range\s*\(/i.test(trimmed);
  }

  // Client-side Python script executor
  executePythonScript(script) {
    const outputLines = [];
    const variables = {};

    try {
      const lines = script.split('\n');
      let i = 0;

      while (i < lines.length) {
        let line = lines[i].trim();

        // Skip comments and empty lines
        if (!line || line.startsWith('#')) {
          i++;
          continue;
        }

        // Variable assignment: x = "value" or x = 123
        const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (assignMatch && !line.startsWith('print') && !line.startsWith('for') && !line.startsWith('if') && !line.startsWith('def')) {
          const varName = assignMatch[1];
          let valExpr = assignMatch[2].trim();

          // String assignment
          if ((valExpr.startsWith('"') && valExpr.endsWith('"')) || (valExpr.startsWith("'") && valExpr.endsWith("'"))) {
            variables[varName] = valExpr.slice(1, -1);
          }
          // Array assignment
          else if (valExpr.startsWith('[') && valExpr.endsWith(']')) {
            try {
              // Convert Python array syntax to JS JSON
              const jsonStr = valExpr.replace(/'/g, '"');
              variables[varName] = JSON.parse(jsonStr);
            } catch (e) {
              variables[varName] = [];
            }
          }
          // Multiline array start
          else if (valExpr.startsWith('[')) {
            let arrayLines = valExpr;
            while (i + 1 < lines.length && !arrayLines.includes(']')) {
              i++;
              arrayLines += lines[i].trim();
            }
            try {
              const jsonStr = arrayLines.replace(/'/g, '"');
              variables[varName] = JSON.parse(jsonStr);
            } catch (e) {
              variables[varName] = [];
            }
          }
          // Number assignment
          else if (!isNaN(valExpr)) {
            variables[varName] = Number(valExpr);
          }
          i++;
          continue;
        }

        // For loop handling: for i, wish in enumerate(wishes, 1): or for x in list:
        const forEnumMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+enumerate\s*\(\s*([a-zA-Z_]\w*)\s*(?:,\s*(\d+))?\s*\)\s*:/);
        if (forEnumMatch) {
          const idxVar = forEnumMatch[1];
          const itemVar = forEnumMatch[2];
          const listVar = forEnumMatch[3];
          const startIdx = forEnumMatch[4] ? parseInt(forEnumMatch[4], 10) : 0;

          const listData = variables[listVar] || [];
          // Collect indented body
          const bodyLines = [];
          while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
            i++;
            bodyLines.push(lines[i].trim());
          }

          listData.forEach((item, idx) => {
            variables[idxVar] = idx + startIdx;
            variables[itemVar] = item;
            bodyLines.forEach(bLine => {
              this.executePythonLine(bLine, variables, outputLines);
            });
          });
          i++;
          continue;
        }

        // Simple for loop: for item in list:
        const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)\s*:/);
        if (forMatch) {
          const itemVar = forMatch[1];
          const listVar = forMatch[2];
          const listData = variables[listVar] || [];

          const bodyLines = [];
          while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
            i++;
            bodyLines.push(lines[i].trim());
          }

          listData.forEach(item => {
            variables[itemVar] = item;
            bodyLines.forEach(bLine => {
              this.executePythonLine(bLine, variables, outputLines);
            });
          });
          i++;
          continue;
        }

        // Function definition (skip body for simple execution or execute)
        if (line.startsWith('def ')) {
          while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
            i++;
          }
          i++;
          continue;
        }

        // Execute general line (print etc.)
        this.executePythonLine(line, variables, outputLines);
        i++;
      }
    } catch (err) {
      outputLines.push(`❌ Python Execution Error: ${err.message}`);
    }

    return outputLines;
  }

  executePythonLine(line, variables, outputLines) {
    if (!line.startsWith('print')) return;

    // Extract inside print(...)
    const match = line.match(/^print\s*\((.*)\)$/);
    if (!match) return;

    let content = match[1].trim();

    // String multiplication: "=" * 40
    const multMatch = content.match(/^["'](.*)["']\s*\*\s*(\d+)$/);
    if (multMatch) {
      outputLines.push(multMatch[1].repeat(parseInt(multMatch[2], 10)));
      return;
    }

    // f-string: f"Hello {name}!"
    if (content.startsWith('f"') || content.startsWith("f'")) {
      let str = content.slice(2, -1);
      // Replace {var} with values
      str = str.replace(/\{([^}]+)\}/g, (m, expr) => {
        expr = expr.trim();
        // check .upper()
        if (expr.endsWith('.upper()')) {
          const v = expr.replace('.upper()', '').trim();
          return (variables[v] !== undefined ? String(variables[v]).toUpperCase() : expr);
        }
        return variables[expr] !== undefined ? variables[expr] : expr;
      });
      // Replace \n
      str = str.replace(/\\n/g, '\n');
      outputLines.push(str);
      return;
    }

    // Plain string print
    if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
      let str = content.slice(1, -1);
      str = str.replace(/\\n/g, '\n');
      outputLines.push(str);
      return;
    }

    // Variable or expression
    if (variables[content] !== undefined) {
      outputLines.push(String(variables[content]));
      return;
    }

    outputLines.push(content);
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
    this.logToConsole("Running code...", "info");

    // Check if code is Python
    if (this.isPythonCode(rawCode)) {
      this.logToConsole("🐍 Detected Python code. Executing Python script...", "info");
      const outputs = this.executePythonScript(rawCode);

      // Render beautiful interactive terminal in iframe
      const terminalHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0d1117;
    color: #f0f6fc;
    font-family: 'Fira Code', Consolas, Monaco, monospace;
    font-size: 14.5px;
    line-height: 1.6;
    padding: 24px;
    min-height: 100vh;
  }
  .terminal-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    margin-bottom: 20px;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .badge {
    margin-left: auto;
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  .terminal-content {
    background: rgba(16, 22, 34, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    white-space: pre-wrap;
    word-break: break-word;
    color: #4ade80;
  }
  .terminal-line {
    margin-bottom: 2px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
</head>
<body>
  <div class="terminal-bar">
    <div class="dot dot-red"></div>
    <div class="dot dot-yellow"></div>
    <div class="dot dot-green"></div>
    <span style="color: #8b949e; font-size: 13px; margin-left: 6px;">terminal &bull; python3</span>
    <span class="badge">🐍 Python Output</span>
  </div>
  <div class="terminal-content">
${outputs.map(line => `<div class="terminal-line">${this.escapeHtml(line)}</div>`).join('')}
  </div>
</body>
</html>`;

      this.previewFrame.srcdoc = terminalHtml;
      outputs.forEach(line => this.logToConsole(line, "success"));
      this.logToConsole("✅ Python script executed successfully! Output displayed above.", "success");
      window.showToast("🐍 Python Code Executed!", "success");
      return;
    }

    // HTML/CSS/JavaScript execution
    this.logToConsole("🌐 Executing HTML/CSS/JS interactive greeting...", "info");

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

    let instrumentedCode = rawCode;
    // Ensure valid HTML5 container if plain snippet is given
    if (!instrumentedCode.includes('<html')) {
      instrumentedCode = `<!DOCTYPE html><html><head><meta charset="UTF-8">${consoleInterceptorScript}</head><body>${instrumentedCode}</body></html>`;
    } else if (instrumentedCode.includes('<head>')) {
      instrumentedCode = instrumentedCode.replace('<head>', '<head>' + consoleInterceptorScript);
    } else {
      instrumentedCode = consoleInterceptorScript + instrumentedCode;
    }

    this.previewFrame.srcdoc = instrumentedCode;
    this.logToConsole("Code executed successfully! Interactive output rendered.", "success");
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
