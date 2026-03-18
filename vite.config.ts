import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // Gzip for broad compatibility
    compression({ algorithm: 'gzip', ext: '.gz' }),
    // Brotli for modern browsers (better compression ratio)
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Leaflet ecosystem — largest dependency, only needed when a map view is active
          'leaflet': ['leaflet', 'react-leaflet'],
          // Recharts — only needed in Signal Analytics KPI panel
          'recharts': ['recharts'],
          // React runtime — split so it's cached independently
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Warn when any chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,
  },
})
