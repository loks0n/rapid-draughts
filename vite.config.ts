import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: './src/core/index.ts',
        english: './src/english/index.ts',
      },
      formats: ['es', 'cjs'],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: 'src/**/*.ts',
    }),
  ],
});
