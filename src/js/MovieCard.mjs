// MovieCard.mjs
import { getLocalStorage, postLocalStorage } from './utils.mjs';
import { addToWatchedStorage } from './storage.js';

export function movieCardTemplate(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://via.placeholder.com/300x450?text=No+Image`;

  return `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
      <p>${movie.release_date}</p>
    </div>
  `;
}

export function expandedCardTemplate(
  movie,
  isFavorites = false,
  isWatched = false,
) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://via.placeholder.com/300x450?text=No+Image`;

  const watchLabel = isWatched ? 'Watch Again' : 'Watch Now';
  const favoriteLabel = isWatched
    ? 'Delete'
    : isFavorites
      ? 'Remove from Favorites'
      : 'Add to Favorites';

  return `
    <div class="movie-card expanded" data-id="${movie.id}">
      <img src="${poster}" alt="${movie.title}" />
      <div class="movie-details">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.release_date}</p>
        <p>${movie.overview || 'No description available.'}</p>
        <button class="watch-now">${watchLabel}</button>
        <button class="add-favorite">${favoriteLabel}</button>
      </div>
    </div>
  `;
}

export function addMovieCardListeners(
  container,
  movies,
  isFavorites = false,
  isWatched = false,
) {
  const grid = container.querySelector('.movie-grid');

  grid.replaceWith(grid.cloneNode(true));
  const newGrid = container.querySelector('.movie-grid');

  newGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;
    const movie = movies.find((m) => m.id == movieId);

    const currentExpanded = container.querySelector('.movie-card.expanded');

    if (currentExpanded && currentExpanded.dataset.id == movieId) {
      card.outerHTML = movieCardTemplate(movie, isFavorites);
      setTimeout(
        () => addMovieCardListeners(container, movies, isFavorites, isWatched),
        0,
      );
      return;
    }

    if (currentExpanded) {
      const prevMovieId = currentExpanded.dataset.id;
      const prevMovie = movies.find((m) => m.id == prevMovieId);
      currentExpanded.outerHTML = movieCardTemplate(prevMovie, isFavorites);
    }

    card.outerHTML = expandedCardTemplate(movie, isFavorites, isWatched);
    setTimeout(() => setupExpandedListeners(movie, isFavorites, isWatched), 0);
  });
}

export function renderMovieCards(
  container,
  movies,
  sectionTitle = '',
  isFavorites = false,
  isWatched = false,
) {
  if (!movies?.length) {
    container.innerHTML = '<p class="error">No movies found.</p>';
    return;
  }

  container.innerHTML = `
    ${sectionTitle ? `<h2 class="section-title">${sectionTitle}</h2>` : ''}
    <div class="movie-grid">
      ${movies.map((movie) => movieCardTemplate(movie, isFavorites)).join('')}
    </div>
  `;

  addMovieCardListeners(container, movies, isFavorites, isWatched);
}

async function setupExpandedListeners(
  movie,
  isFavorites = false,
  isWatched = false,
) {
  const card = document.querySelector(`.movie-card[data-id="${movie.id}"]`);

  // WATCH NOW
  const watchNowBtn = card.querySelector('.watch-now');
  watchNowBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToWatchedStorage(movie);
    window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
  });

  // FAVORITE / REMOVE / DELETE
  card.querySelector('.add-favorite').addEventListener('click', (e) => {
    e.stopPropagation();

    if (isWatched) {
      const watched = getLocalStorage('watched');
      const updated = watched.filter((m) => m.id !== movie.id);
      postLocalStorage('watched', updated);
      card.remove();
      return;
    }

    let favorites = getLocalStorage('favorites');

    if (isFavorites) {
      favorites = favorites.filter((m) => m.id !== movie.id);
      postLocalStorage('favorites', favorites);
      card.remove();
    } else {
      if (!favorites.some((m) => m.id === movie.id)) {
        favorites.push(movie);
        postLocalStorage('favorites', favorites);
        alert(`${movie.title} added to favorites!`);
      } else {
        alert(`${movie.title} is already in your favorites.`);
      }
    }
  });
}
