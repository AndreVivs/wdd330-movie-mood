import { loadHeader } from './utils.mjs';
import { renderMovieCards } from './MovieCard.mjs';
import { getWatchedMovies } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();

  const container = document.getElementById('watched-list');
  const watchedMovies = getWatchedMovies();

  renderMovieCards(container, watchedMovies, 'Previously Watched', false, true);
});
