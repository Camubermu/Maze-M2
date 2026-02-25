import { State, CONFIG } from './state.js';

export function initUI() {
  State.dom.startOverlay    = document.getElementById('startOverlay');
  State.dom.levelOverlay    = document.getElementById('levelOverlay');
  State.dom.gameOverOverlay = document.getElementById('gameOverOverlay');
  State.dom.victoryOverlay  = document.getElementById('victoryOverlay');

  State.dom.startButton       = document.getElementById('startButton');
  State.dom.levelStartButton  = document.getElementById('levelStartButton');
  State.dom.closeVictory      = document.getElementById('closeVictory');
  State.dom.gameOverOk        = document.getElementById('gameOverOk');

  State.dom.levelTitle     = document.getElementById('levelTitle');
  State.dom.lostLevelText  = document.getElementById('lostLevelText');
  State.dom.scoreDisplay   = document.getElementById('scoreDisplay');
  State.dom.levelBadge     = document.getElementById('levelBadge');
  State.dom.livesContainer = document.getElementById('lives');

  State.canvas = document.getElementById('mazeCanvas');
  State.ctx    = State.canvas.getContext('2d');
  State.canvas.width  = CONFIG.cols * CONFIG.cellSize;
  State.canvas.height = CONFIG.rows * CONFIG.cellSize;

  updateHUD();
  renderLives();
}

// === HUD ===
export function updateHUD() {
  State.dom.scoreDisplay.textContent = `Puntos: ${State.score}`;
  State.dom.levelBadge.textContent   = `Nivel: ${State.level}`;
  State.dom.levelTitle.textContent   = `Nivel ${State.level}`;
}

export function renderLives() {
  const c = State.dom.livesContainer;
  c.innerHTML = '';
  for (let i = 0; i < CONFIG.livesPerLevel; i++) {
    const h = document.createElement('span');
    h.className = 'heart' + (i < State.lives ? '' : ' lost');
    c.appendChild(h);
  }
}

// === Mostrar / Ocultar ===
export function show(el) { if (el) el.style.display = 'flex'; }
export function hide(el) { if (el) el.style.display = 'none'; }

export function showLevelOverlay() { updateHUD(); renderLives(); show(State.dom.levelOverlay); }
export function hideLevelOverlay() { hide(State.dom.levelOverlay); }

export function showGameOver(level) {
  State.dom.lostLevelText.textContent = `Perdiste en el nivel ${level}`;
  show(State.dom.gameOverOverlay);
}
export function hideGameOver() { hide(State.dom.gameOverOverlay); }

export function showVictory() { show(State.dom.victoryOverlay); }
export function hideVictory() { hide(State.dom.victoryOverlay); }

export function shakeCanvas() {
  State.canvas.classList.remove('shake');
  void State.canvas.offsetWidth; // reiniciar animación
  State.canvas.classList.add('shake');
}

// === Imágenes ===
const heroImg = new Image();
heroImg.src = 'assets/hero.png';
const portalImg = new Image();
portalImg.src = 'assets/portal.png';

// === Dibujar laberinto ===
export function redraw() {
  if (!State.maze || !Array.isArray(State.maze) || !State.maze[0]) return;

  const { ctx } = State;
  const { rows, cols, cellSize } = CONFIG;
  ctx.clearRect(0, 0, State.canvas.width, State.canvas.height);

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  // Dibujamos las paredes del laberinto
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = State.maze[i][j];
      const x = j * cellSize, y = i * cellSize;
      if (cell.walls.top)    line(x, y, x + cellSize, y);
      if (cell.walls.right)  line(x + cellSize, y, x + cellSize, y + cellSize);
      if (cell.walls.bottom) line(x + cellSize, y + cellSize, x, y + cellSize);
      if (cell.walls.left)   line(x, y + cellSize, x, y);
    }
  }

  // === Portal (meta) ===
  const pad = cellSize * 0.1;
  const finishX = (cols - 1) * cellSize + pad;
  const finishY = (rows - 1) * cellSize + pad;
  const size = cellSize - pad * 2;
  ctx.save();
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 12;
  if (portalImg.complete) ctx.drawImage(portalImg, finishX, finishY, size, size);
  ctx.restore();

  // === Héroe ===
  const playerX = State.playerCol * cellSize + pad;
  const playerY = State.playerRow * cellSize + pad;
  ctx.save();
  ctx.shadowColor = '#00e6ff';
  ctx.shadowBlur = 6;
  if (heroImg.complete) ctx.drawImage(heroImg, playerX, playerY, size, size);
  ctx.restore();

  // Funciones auxiliares
  function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
