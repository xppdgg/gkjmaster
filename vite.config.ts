import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  base:'/ms/',
  plugins: [
    vue(),
    // Components({
    //   resolvers:[AntDesignVueResolver()]
    // })
  ],
  build:{
    outDir:'ms'
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://1.94.37.31',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/hailiangweb-2.0')
      }
    }
  }
})
