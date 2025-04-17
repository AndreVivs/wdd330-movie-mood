import { initUI } from './ui.js';
import { attachEventListeners } from './events.js';
import { loadHeader } from './utils.mjs';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  initUI();
  attachEventListeners();
});
