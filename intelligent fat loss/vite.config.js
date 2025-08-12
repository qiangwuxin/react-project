import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock' 
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    viteMockServe({  
      mockPath: 'mock',
      localEnable: true,
      prodEnable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})