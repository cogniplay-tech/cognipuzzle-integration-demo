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
  server: { port: 3882, strictPort: true },
})
