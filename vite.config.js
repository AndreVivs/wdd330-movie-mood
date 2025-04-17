import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        favorites: resolve(__dirname, 'src/favorites/index.html'),
        records: resolve(__dirname, 'src/records/index.html'),
      },
    },
  },
});
