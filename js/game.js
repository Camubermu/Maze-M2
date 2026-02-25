import { State, CONFIG } from './state.js';
import { generateMaze } from './maze.js';
import { Sounds } from './sound.js';
import {
  redraw, updateHUD, renderLives, shakeCanvas,
  showLevelOverlay, hideLevelOverlay,
  showVictory, hideVictory,
  showGameOver, hideGameOver
} from './ui.js';

// === Nuevo juego ===
export function newGame() {
  State.level = 1;
  State.score = 0;
  startLevel(true);
}

// === Inicio de nivel ===
export function startLevel(fromStartOverlay = false) {
  // al comenzar el nivel siempre hay 3 vidas
  State.lives = CONFIG.livesPerLevel;
  State.playerRow = 0;
  State.playerCol = 0;
  State.maze = generateMaze(CONFIG.rows, CONFIG.cols);
  updateHUD();
  renderLives();
  redraw();

  // Mostramos inicio de nivel (sin pantalla de inicio)
  showLevelOverlay();
}

// === Comienzo del juego ===
export function beginPlay() {
  hideLevelOverlay();
  State.gameActive = true;
}

// === Control de movimiento ===
export function onMoveKey(code) {
  if (!State.gameActive) return;

  const cell = State.maze[State.playerRow][State.playerCol];
  let moved = false;

  if (code === 32) { // Space → derecha
    if (!cell.walls.right && State.playerCol < CONFIG.cols - 1) {
      State.playerCol++; moved = true;
    } else { wrongMove(); return; }
  }
  else if (code === 8) { // Backspace → izquierda
    if (!cell.walls.left && State.playerCol > 0) {
      State.playerCol--; moved = true;
    } else { wrongMove(); return; }
  }
  else if (code === 13) { // Enter → abajo
    if (!cell.walls.bottom && State.playerRow < CONFIG.rows - 1) {
      State.playerRow++; moved = true;
    } else { wrongMove(); return; }
  }

  if (moved) {
    Sounds.step();
    redraw();
    checkFinish();
  }
}

// === Movimiento incorrecto ===
function wrongMove() {
  Sounds.hit();
  if (State.lives > 0) {
    State.lives--;
    renderLives();
    shakeCanvas();
    if (State.lives === 0) Sounds.lifeLost();
  }
  if (State.lives === 0) {
    State.gameActive = false;
    showGameOver(State.level);
  }
}

// === Reintentar el mismo nivel ===
export function retrySameLevel() {
  hideGameOver();
  // volvemos a iniciar el mismo nivel con 3 vidas nuevas
  startLevel(false);
}

// === Verificación de meta ===
function checkFinish() {
  const atFinish = (
    State.playerRow === CONFIG.rows - 1 &&
    State.playerCol === CONFIG.cols - 1
  );
  if (!atFinish) return;

  Sounds.levelWin();
  State.score++;
  updateHUD();

  // Victoria final
  if (State.score >= CONFIG.maxScoreToWin) {
    State.gameActive = false;
    Sounds.gameWin();
    showVictory();
    return;
  }

  // Siguiente nivel
  State.level++;
  State.gameActive = false;
  startLevel(false);
}

// === Después de la victoria volvemos al nivel 1 ===
export function closeVictoryAndBackToMenu() {
  hideVictory();
  State.level = 1;
  State.score = 0;
  startLevel(true);
}
