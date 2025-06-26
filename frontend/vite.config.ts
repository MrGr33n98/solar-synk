import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Prioritize shadcn aliases for component resolution
      '@/lib/': path.resolve(__dirname, './src/lib/'),
      '@/hooks/': path.resolve(__dirname, './src/extensions/shadcn/hooks/'),
      '@/components/hooks/': path.resolve(__dirname, './src/extensions/shadcn/hooks/'),
      '@/components/ui/': path.resolve(__dirname, './src/extensions/shadcn/components/'),
      '@stackframe/react': path.resolve(__dirname, './src/lib/stackframe.tsx'),
      
      // General aliases
      '@': path.resolve(__dirname, './src'),
      brain: path.resolve(__dirname, './src/brain'),
      types: path.resolve(__dirname, './src/brain/data-contracts.ts'),
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      app: path.resolve(__dirname, './src/app'),
      'app/auth': path.resolve(__dirname, './src/app/auth'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
  define: {
    __APP_ID__: JSON.stringify('dev-app-id'),
    __API_PATH__: JSON.stringify('/api'),
    __API_URL__: JSON.stringify('http://localhost:8000/api'),
    __API_HOST__: JSON.stringify('localhost:8000'),
    __API_PREFIX_PATH__: JSON.stringify('/api'),
    __WS_API_URL__: JSON.stringify('ws://localhost:8000'),
    __APP_BASE_PATH__: JSON.stringify('/'),
    __APP_TITLE__: JSON.stringify('Solar Sync'),
    __APP_FAVICON_LIGHT__: JSON.stringify('/light.ico'),
    __APP_FAVICON_DARK__: JSON.stringify('/dark.ico'),
    __APP_DEPLOY_USERNAME__: JSON.stringify(''),
    __APP_DEPLOY_APPNAME__: JSON.stringify(''),
    __APP_DEPLOY_CUSTOM_DOMAIN__: JSON.stringify(''),
    // Provide a default empty config for optional auth extension
    __STACK_AUTH_CONFIG__: JSON.stringify('{}'),
  },
  server: {
    port: 5173,
    proxy: {
      '/routes': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});