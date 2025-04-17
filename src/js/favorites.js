import { loadHeader, getLocalStorage, postLocalStorage } from './utils.mjs';
import { renderMovieCards } from './MovieCard.mjs';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
});

const container = document.getElementById('favorites-container');

function renderFavorites() {
  const favorites = getLocalStorage('favorites');

  if (!favorites.length) {
    container.innerHTML = '<p class="empty">You have no favorite movies.</p>';
    return;
  }

  renderMovieCards(container, favorites, 'My Favorite Movies', true);

  // Agregar funcionalidad de eliminación
  setTimeout(() => {
    document
      .querySelectorAll('.movie-card .add-favorite')
      .forEach((btn, index) => {
        btn.textContent = 'Remove from Favorites';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const movieId = favorites[index].id;
          const updated = favorites.filter((m) => m.id !== movieId);
          postLocalStorage('favorites', updated);
          renderFavorites(); // volver a renderizar
        });
      });
  }, 0);
}

renderFavorites();
