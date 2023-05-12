import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({reactivityTransform: true}),
    AutoImport({imports: [
        'vue',
        'vue-router',
        'vuex',
      ],
      dts: './src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })],
  // 别名
  resolve: {
    alias: {
      '@': '/src',
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  // 解决跨域问题
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8090/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径把路径变成空字符
      }
    }
  }
})