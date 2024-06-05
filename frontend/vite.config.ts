import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }},
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173, 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
