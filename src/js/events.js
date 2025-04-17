import { searchMoviesByMood, getMovieDetails } from './search.js';
import { detectMoodFromText, translateMood } from './EmotionMovieList.mjs';
import { renderResultsHTML, appendResultsHTML } from './ui.js';
import { saveFavorite } from './storage.js';

export function attachEventListeners() {
  document.getElementById('mood').addEventListener('change', async (e) => {
    const mood = e.target.value;
    if (!mood) return;
    renderResultsHTML('');
    const movies = await searchMoviesByMood(mood);
    showMovies(movies);
  });

  document.getElementById('analyze').addEventListener('click', async () => {
    const input = document.getElementById('textMood').value.trim();
    if (!input) return alert('Please describe how you feel.');
    renderResultsHTML('<p>Analyzing mood...</p>');

    try {
      const emotion = await detectMoodFromText(input);
      const mood = translateMood(emotion);
      appendResultsHTML(`<p>Detected mood: <strong>${mood}</strong></p>`);
      const movies = await searchMoviesByMood(mood);
      showMovies(movies);
    } catch (err) {
      appendResultsHTML('<p>Error analyzing mood.</p>');
      console.error(err);
    }
  });
}

function showMovies(movies) {
  if (!movies.length) {
    appendResultsHTML('<p>No movies found.</p>');
    return;
  }

  const html = movies
    .map(
      (movie) => `
    <div class="movie-card" data-id="${movie.id}">
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>${movie.overview || 'No description available.'}</p>
    </div>
  `,
    )
    .join('');
  appendResultsHTML(html);

  document.querySelectorAll('.movie-card').forEach((card) => {
    card.addEventListener('click', async () => {
      if (card.classList.contains('expanded')) return;
      const movieId = card.getAttribute('data-id');
      const details = await getMovieDetails(movieId);
      const reviews =
        details.reviews
          .slice(0, 2)
          .map((r) => `<p>"${r.content}" – <em>${r.author}</em></p>`)
          .join('') || 'No reviews.';
      const providers =
        details.providers
          .map((p) => `<span>${p.provider_name}</span>`)
          .join(', ') || 'No providers.';

      const extraHTML = `
        <div class="movie-details">
          <p><strong>Release Date:</strong> ${details.release_date}</p>
          <p><strong>Rating:</strong> ${details.vote_average} / 10</p>
          <p><strong>Reviews:</strong><br>${reviews}</p>
          <p><strong>Available on:</strong> ${providers}</p>
          <button class="watch-now" onclick="window.open('https://www.themoviedb.org/movie/${movieId}', '_blank')">Watch Now</button>
          <button class="favorite-btn" data-id="${movieId}" data-title="${details.title}">Add to Favorites ❤️</button>
        </div>
      `;
      card.insertAdjacentHTML('beforeend', extraHTML);
      card.classList.add('expanded');

      card.querySelector('.favorite-btn').addEventListener('click', () => {
        const movie = {
          id: details.id,
          title: details.title,
          poster_path: details.poster_path,
        };
        saveFavorite(movie);
      });
    });
  });
}
