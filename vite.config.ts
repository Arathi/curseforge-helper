import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 使'@'指向src目录
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: [
          'https://www.curseforge.com/minecraft/mc-mods/search*'
        ],
      },
      build: {
        externalGlobals: {
        },
      },
    }),
  ],
});
