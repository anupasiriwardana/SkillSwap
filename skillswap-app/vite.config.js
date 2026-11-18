import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// In development the browser talks to Vite only; /api is forwarded to the Spring Boot API,
// so no CORS setup is needed. In Docker, nginx does the same job.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep rarely-changing libraries in their own cacheable chunks
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          data: ['@tanstack/react-query', 'axios'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
