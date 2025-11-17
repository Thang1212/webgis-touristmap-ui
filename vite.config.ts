/** 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: true,
    port: 3030,
    proxy: {
      "/api": {
        target: "http://localhost:8000/",
        changeOrigin: true,  
        secure: false,
      },
    },
  },
})
*/

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // ✅ nạp biến từ .env

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      hmr: true,
      port: 3030,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8000/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
