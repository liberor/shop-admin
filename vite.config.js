import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"src")
    }
  },
  plugins: [vue(),WindiCSS()],
  server: {
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }

})
