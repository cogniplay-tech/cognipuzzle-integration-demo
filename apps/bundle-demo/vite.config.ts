import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'cogniplay-puzzle',
        },
      },
    }),
  ],
  envDir: '../..',
  server: { port: 3881, strictPort: true },
})
