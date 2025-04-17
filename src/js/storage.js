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
