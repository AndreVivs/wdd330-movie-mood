export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function saveFavorite(movie) {
  const current = getFavorites();
  const exists = current.find((fav) => fav.id === movie.id);
  if (exists) {
    alert('Already in favorites!');
    return;
  }
  const updated = [...current, movie];
  localStorage.setItem('favorites', JSON.stringify(updated));
  alert(`"${movie.title}" added to favorites!`);
}

export function addToWatchedStorage(movie) {
  const key = 'watched';
  const current = JSON.parse(localStorage.getItem(key)) || [];
  const exists = current.some((item) => item.id === movie.id);

  if (!exists) {
    current.push(movie);
    localStorage.setItem(key, JSON.stringify(current));
  }
}

export function getWatchedMovies() {
  return JSON.parse(localStorage.getItem('watched')) || [];
}

export function deleteWatchedMovie(id) {
  const current = JSON.parse(localStorage.getItem('watched')) || [];
  const updated = current.filter((movie) => movie.id !== id);
  localStorage.setItem('watched', JSON.stringify(updated));
}
