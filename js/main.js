import { initUI } from './ui.js';
import { newGame, beginPlay, retrySameLevel, closeVictoryAndBackToMenu } from './game.js';
import { attachInput } from './input.js';
import { State, CONFIG } from './state.js';
import { redraw } from './ui.js';

// === Inicio al cargar la página ===
window.addEventListener('load', () => {
  initUI();
  attachInput();

  // 🔹 Iniciamos inmediatamente el primer nivel sin ventana inicial
  newGame();

  // Botones
  document.getElementById('levelStartButton').addEventListener('click', () => beginPlay());
  document.getElementById('gameOverOk').addEventListener('click', () => retrySameLevel());
  document.getElementById('closeVictory').addEventListener('click', () => closeVictoryAndBackToMenu());
});

// === 🔹 Adaptación para iframe y cambio de tamaño ===

// Actualización del tamaño del canvas manteniendo proporciones
function resizeCanvas() {
  const container = document.querySelector('.game-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight - 60;

  const mazeW = CONFIG.cols * CONFIG.cellSize;
  const mazeH = CONFIG.rows * CONFIG.cellSize;
  const scale = Math.min(width / mazeW, height / mazeH);

  State.canvas.width = mazeW * scale;
  State.canvas.height = mazeH * scale;
  State.ctx.setTransform(scale, 0, 0, scale, 0, 0);

  // ✅ Verificamos para no llamar redraw antes de tiempo
  if (State.maze) {
    redraw();
  }
}

// escuchamos el cambio de tamaño de la ventana
window.addEventListener('resize', resizeCanvas);

// ejecutamos en el primer inicio
setTimeout(resizeCanvas, 100);
