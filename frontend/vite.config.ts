import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'app': path.resolve(__dirname, './src/app'),
      'app/auth': path.resolve(__dirname, './src/app/auth.ts'),
      'components': path.resolve(__dirname, './src/components'),
      'components/*': path.resolve(__dirname, './src/components/*'),
      'brain': path.resolve(__dirname, './src/brain'),
      'brain/*': path.resolve(__dirname, './src/brain/*'),
      '@/hooks': path.resolve(__dirname, './src/extensions/shadcn/hooks'),
      '@/components/hooks': path.resolve(__dirname, './src/extensions/shadcn/hooks'),
      '@/components/ui': path.resolve(__dirname, './src/extensions/shadcn/components'),
    },
  },
  define: {
    '__APP_ID__': JSON.stringify('dev-app-id'), // Define um valor para o desenvolvimento
  },
});
