import { HuggingFaceService, TMBDService } from './ExternalServices.mjs';

export default class TextMovieList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.appContainer = document.getElementById('app');
    this.emotions = [
      'Happy',
      'Sad',
      'Angry',
      'Fearful',
      'Romantic',
      'Excited',
      'Melancholy',
      'In love',
      'Bored',
      'Inspired',
      'Hopeful',
      'Anxious',
    ];
  }

  init() {
    this.renderInput();
    this.addEventListeners();
  }

  renderInput() {
    this.container.innerHTML = `
      <label for="textMood">Write a feeling:</label>
      <input type="text" id="textMood" placeholder="e.g. I feel like dancing" />
      <button id="submitMood">Find Movies</button>

      <label for="moodSelect">Or pick an emotion:</label>
      <select id="moodSelect">
        <option value="">Choose a mood</option>
        ${this.emotions
          .map((mood) => `<option value="${mood}">${mood}</option>`)
          .join('')}
      </select>
    `;
  }

  addEventListeners() {
    const input = document.getElementById('textMood');
    const button = document.getElementById('submitMood');
    const moodSelect = document.getElementById('moodSelect');

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleTextInput(input.value);
      }
    });

    button.addEventListener('click', () => {
      this.handleTextInput(input.value);
    });

    moodSelect.addEventListener('change', () => {
      const mood = moodSelect.value;
      if (mood) this.handleEmotionSelect(mood);
    });
  }

  async handleTextInput(text) {
    if (!text.trim()) return;

    try {
      const detected = await HuggingFaceService.detectMoodFromText(text);
      const mood = HuggingFaceService.translateMood(detected);
      const movies = await TMBDService.searchMoviesByMood(mood);
      const filtered = movies.filter((m) => m.vote_average >= 6).slice(0, 20);
      this.renderMovies(filtered);
    } catch (err) {
      console.error('Error from Hugging Face or TMDB:', err);
      this.appContainer.innerHTML = `<p class="error">Could not find movies for your mood.</p>`;
    }
  }

  async handleEmotionSelect(mood) {
    try {
      const movies = await TMBDService.searchMoviesByMood(mood);
      const filtered = movies.filter((m) => m.vote_average >= 6).slice(0, 20);
      this.renderMovies(filtered);
    } catch (err) {
      console.error('Error fetching mood-based movies:', err);
      this.appContainer.innerHTML = `<p class="error">Could not load movies for "${mood}".</p>`;
    }
  }

  renderMovies(movies) {
    if (!movies || movies.length === 0) {
      this.appContainer.innerHTML = `<p>No movies found for this mood.</p>`;
      return;
    }

    this.appContainer.innerHTML = `
      <h2 class="section-title">Movies based on your mood</h2>
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
