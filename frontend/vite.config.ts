import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@stackframe/react': path.resolve(__dirname, './src/lib/stack-frame.tsx'),
    },
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
