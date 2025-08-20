import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // React 18 配置
      jsxRuntime: 'automatic'
    }),
    viteMockServe({
      mockPath: 'mock',
      localEnable: true,
      prodEnable: true,
      supportTs: false,
      logger: true,
      watchFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 啟用開發功能
  server: {
    hmr: true,
    watch: {
      usePolling: false
    },
    proxy: {
      '/arkapi': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/arkapi/, ''),
      },
    },
  },
  // 啟用優化
  build: {
    minify: true,
    sourcemap: false
  },
})