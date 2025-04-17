import { resolve } from 'path';
import { defineConfig } from 'vite';
import { getFavorites } from './src/js/storage';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        favorites: resolve(__dirname, 'src/favorites/index.html'),
        records: resolve(__dirname, 'src/records/index.html'),
        movie_detail: resolve(__dirname, 'src/movie_detail/index.html'),
      },
    },
  },
});
