//ExternalServices.mjs
const hfToken = import.meta.env.HUGFACE_KEY;
const tmdbKey = import.meta.env.TMBD_KEY;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: 'servicesError',
      message: jsonResponse,
    };
  }
}

//
export default class MovieServiceHome {
  static async getPopularMovies(count = 25) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=1`,
    );
    const data = await convertToJson(res);
    return data.results.slice(0, count);
  }

  static async getMovieGenderes() {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}&language=en`,
    );

    const data = await convertToJson(res);
    return data;
  }
}

// Hugging Face Emotion API
export class HuggingFaceService {
  static async detectMoodFromText(text) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      },
    );

    const data = await convertToJson(response);
    return data[0][0].label;
  }

  static translateMood(english) {
    const map = {
      joy: 'happy',
      sadness: 'sad',
      anger: 'angry',
      fear: 'anxious',
      disgust: 'disgusted',
      neutral: 'neutral',
      surprise: 'surprised',
    };
    return map[english] || 'surprised';
  }
}

export class TMBDService {
  static async getMovieGenderes() {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}&language=en`,
    );

    const data = await convertToJson(res);
    return data;
  }
  static async searchMoviesByMood(mood) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(mood)}&api_key=${tmdbKey}&language=en-US`,
    );
    const movieData = await convertToJson(response);
    return movieData.results.slice(0, 8);
  }

  static async getMoviesByGenre(genreId) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=en-US&with_genres=${genreId}`,
    );
    const data = await convertToJson(res);
    return data.results;
  }

  static async getMovieDetails(movieId) {
    const [details, reviews, providers] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}&language=en-US`,
      ).then((r) => r.json()),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${tmdbKey}&language=en-US`,
      ).then((r) => r.json()),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${tmdbKey}`,
      ).then((r) => r.json()),
    ]);

    return {
      ...details,
      reviews: reviews.results || [],
      providers: providers.results?.US?.flatrate || [],
    };
  }
}
