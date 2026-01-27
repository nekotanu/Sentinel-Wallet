import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  //tell vite to also build these files 
  build: {
    rollupOptions: {
      input: {
        ui: "index.html",
        background: "extension/background.ts",
        content: "extension/contentScript.ts",
        injct: "extension/inject.ts"
      }
    }
  }
})
