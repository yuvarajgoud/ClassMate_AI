import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://classmateaiproo.ap-south-1.elasticbeanstalk.com', // backend URL
        changeOrigin: true,
        secure: false, // only for HTTP backend
      }
    }
  }
})
