import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const STATIC_DIR = path.resolve(__dirname, '../api_producto_mongo/src/main/resources/static')
const TEMPLATES_DIR = path.resolve(__dirname, '../api_producto_mongo/src/main/resources/templates')

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'move-index-to-templates',
      closeBundle() {
        const src = path.join(STATIC_DIR, 'index.html')
        const dest = path.join(TEMPLATES_DIR, 'index.html')

        if (fs.existsSync(src)) {
          fs.mkdirSync(TEMPLATES_DIR, { recursive: true })
          fs.copyFileSync(src, dest)
          fs.unlinkSync(src)
          console.log('✅ index.html → templates/')
        }

      }
    }
  ],
  build: {
    outDir: STATIC_DIR,
    emptyOutDir: true,   // limpia SOLO static/, no resources/
    assetsDir: '',
    rollupOptions: {
      output: {
        // 👇 SIN hash → nombres limpios
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    }
  }
})