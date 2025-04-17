import { TMBDService } from './ExternalServices.mjs';

export default class EmotionMovieList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.appContainer = document.getElementById('app');
    this.genres = [];
  }

  async init() {
    try {
      const response = await TMBDService.getMovieGenderes();
      this.genres = response.genres;
      console.log('Géneros disponibles:', this.genres);
      this.renderSelector();
      this.addEventListener();
    } catch (err) {
      console.error('Error loading genres:', err);
      this.container.innerHTML = `<p class="error">Failed to load genres. Try again later.</p>`;
    }
  }

  renderSelector() {
    this.container.innerHTML = `
      <label for="genre">Choose a mood in genre:</label>
      <select id="genre">
        <option value="">Moods</option>
        ${this.genres
          .map((genre) => `<option value="${genre.id}">${genre.name}</option>`)
          .join('')}
      </select>
    `;
  }

  addEventListener() {
    const select = document.getElementById('genre');
    select.addEventListener('change', async (e) => {
      const genreId = e.target.value;
      if (!genreId) return;

      try {
        const movies = await TMBDService.getMoviesByGenre(genreId);
        const filtered = movies.filter((m) => m.vote_average >= 6).slice(0, 20);
        this.renderMovies(filtered);
      } catch (error) {
        console.error('Error fetching movies by genre:', error);
        this.appContainer.innerHTML = `<p class="error">Failed to load movies for that genre.</p>`;
      }
    });
  }

  //mood was changed for genres to display mor emovies and see the application.
  renderMovies(movies) {
    this.appContainer.innerHTML = `
      <h2 class="section-title">Movies for your mood</h2>
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
