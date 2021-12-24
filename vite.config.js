import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port:8287,
    host: '0.0.0.0',
    open:false,
    proxy:{
      '/api':{
        target:'http://localhost:8282',
        changeOrigin:true,
        ws:true,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        // 引入 var.less 这样就可以在全局中使用 var.less中预定义的变量了
        additionalData: '@import "./src/assets/style/common.less";',
      },
    },
  },
})
