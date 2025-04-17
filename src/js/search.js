// search.js
import { MovieService } from './ExternalServices.mjs';

export async function searchMoviesByMood(mood) {
  return await MovieService.searchMoviesByMood(mood);
}

export async function getMovieDetails(movieId) {
  return await MovieService.getMovieDetails(movieId);
}
