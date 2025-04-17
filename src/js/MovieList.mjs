// MovieList.mjs
import MovieServiceHome from './ExternalServices.mjs';

export default class MovieList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    //this.movies = [];
  }

  async init() {
    try {
      const movies = await MovieServiceHome.getPopularMovies();
      const filtered = movies.filter((m) => m.vote_average >= 6).slice(0, 20);
      this.renderMovies(filtered);
    } catch (err) {
      console.error('Error loading movies:', err);
      this.container.innerHTML = `<p class="error">Failed to load movies. Try again later.</p>`;
    }
  }

  renderMovies(movies) {
    // if (!this.movies.length) return;
    this.container.innerHTML = `
      <h2 class="section-title">Popular Movies</h2>
      <div class="movie-grid">
        ${movies.map(this.movieCardTemplate).join('')}
      </div>
    `;
  }

  movieCardTemplate(movie) {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    return `
      <div class="movie-card">
        <img src="${poster}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.release_date}</p>
      </div>
    `;
  }
}
