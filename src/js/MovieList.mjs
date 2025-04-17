import MovieServiceHome from './ExternalServices.mjs';
import { renderMovieCards } from './MovieCard.mjs';

export default class MovieList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async init() {
    try {
      const movies = await MovieServiceHome.getPopularMovies();
      const filtered = movies.filter((m) => m.vote_average >= 6).slice(0, 20);
      console.log('VEAMOS LA DATA', filtered);
      renderMovieCards(this.container, filtered, 'Popular Movies', false);
      //this.renderMovies(filtered);
    } catch (err) {
      console.error('Error loading movies:', err);
      this.container.innerHTML = `<p class="error">Failed to load movies. Try again later.</p>`;
    }
  }
}
