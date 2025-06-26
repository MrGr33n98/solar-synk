import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  // O plugin tsconfigPaths lê os aliases diretamente do tsconfig.json,
  // então a seção 'resolve.alias' não é mais necessária.
  plugins: [react(), tsconfigPaths()],

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
