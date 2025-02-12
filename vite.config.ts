import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        // target: process.env.MOUNTAIN_TRAILS_API_URL ? process.env.MOUNTAIN_TRAILS_API_URL : 'http://localhost:5000',
        target: 'https://mountain-trails-api.vercel.app/',
        changeOrigin: true        
      }

    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  }
})
