// main.js
import { loadHeader } from './utils.mjs';
import MovieList from './MovieList.mjs';
import EmotionMovieList from './EmotionMovieList.mjs';
import TextMovieList from './TextMovieList.mjs';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
});

const containerId = 'app'; // No es necesario el '#'
const movieList = new MovieList(containerId); // Se pasa solo el id del contenedor

movieList.init();

const emotionsContainerId = 'by-emotion'; // No es necesario el '#'
const emotionsMovieList = new EmotionMovieList(emotionsContainerId); // Se pasa solo el id del contenedor

emotionsMovieList.init();

const textContainerId = 'by-text'; // No es necesario el '#'
const textMovieList = new TextMovieList(textContainerId); // Se pasa solo el id del contenedor

textMovieList.init();
