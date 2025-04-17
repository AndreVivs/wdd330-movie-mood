import { TMBDService } from './ExternalServices.mjs';
import { renderMovieCards } from './MovieCard.mjs';

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
      // console.log('Géneros disponibles:', this.genres);
      this.renderSelector();
      this.addEventListener();
    } catch (err) {
      console.error('Error loading genres:', err);
      this.container.innerHTML = `<p class="error">Failed to load genres. Try again later.</p>`;
    }
  }

  renderSelector() {
    this.container.innerHTML = `
      <label for="genre">Select a movie genre:</label>
      <select id="genre">
        <option value="">Choose a genre</option>
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
        const filtered = movies.filter((m) => m.vote_average >= 7).slice(0, 20);

        this.appContainer.innerHTML = ''; // limpia antes de mostrar
        renderMovieCards(
          this.appContainer,
          filtered,
          'Movies for this genre',
          false,
        );
      } catch (error) {
        console.error('Error fetching movies by genre:', error);
        this.appContainer.innerHTML = `<p class="error">Failed to load movies for that genre.</p>`;
      }
    });
  }
}
