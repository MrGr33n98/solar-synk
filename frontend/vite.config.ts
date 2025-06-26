import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@/components/ui',
        replacement: path.resolve(
          __dirname,
          './src/extensions/shadcn/components'
        ),
      },
      {
        find: '@/components/hooks',
        replacement: path.resolve(
          __dirname,
          './src/extensions/shadcn/hooks'
        ),
      },
      {
        find: '@/hooks',
        replacement: path.resolve(
          __dirname,
          './src/extensions/shadcn/hooks'
        ),
      },
      {
        find: '@/lib',
        replacement: path.resolve(__dirname, './src/lib'),
      },
      { find: 'brain', replacement: path.resolve(__dirname, './src/brain') },
      {
        find: 'types',
        replacement: path.resolve(
          __dirname,
          './src/brain/data-contracts.ts'
        ),
      },
      {
        find: 'components',
        replacement: path.resolve(__dirname, './src/components'),
      },
      { find: 'pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: 'app/auth', replacement: path.resolve(__dirname, './src/app/auth') },
      { find: 'app', replacement: path.resolve(__dirname, './src/app') },
      { find: 'utils', replacement: path.resolve(__dirname, './src/utils') },
      {
        find: '@stackframe/react',
        replacement: path.resolve(__dirname, './src/lib/stackframe.tsx'),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
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
