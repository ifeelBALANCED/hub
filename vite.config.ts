import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  process.env = { ...process.env, ...env }

  const isDev = mode === 'development'
  const host = env.VITE_HOST || 'localhost'
  const port = Number(env.VITE_PORT) || 5173
  const previewPort = Number(env.VITE_PREVIEW_PORT) || 4173
  const appEnv = mode

  const plugins = [
    vue(),
    vueJsx(),
    tailwindcss(),
    isDev && vueDevTools(),
    isDev && analyzer(),
  ].filter(Boolean)

  return {
    mode: appEnv,
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      host,
      port,
      open: false,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: previewPort,
      host: '0.0.0.0',
      cors: true,
      strictPort: true,
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: isDev,
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'naive-ui'],
    },

    define: {
      __APP_ENV__: JSON.stringify(appEnv),
    },
  }
})
