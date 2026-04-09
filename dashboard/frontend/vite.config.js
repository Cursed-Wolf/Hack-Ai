import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================================
// DEV ONLY: Serve the static login page from the same origin
// so Firebase Auth state is shared between login & dashboard.
// In production, Firebase Hosting rewrites handle this.
// ============================================================
function serveLoginPlugin() {
  const loginDir = path.resolve(__dirname, '../../login')

  return {
    name: 'serve-login-page',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = (req.url || '').split('?')[0]

        // Handle /login → serve login/index.html
        if (urlPath === '/login' || urlPath === '/login/') {
          const filePath = path.join(loginDir, 'index.html')
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }

        // Handle /login/* → serve static files
        if (!urlPath.startsWith('/login/')) return next()

        const relativePath = urlPath.slice('/login/'.length)
        const filePath = path.join(loginDir, relativePath)

        // Security: prevent directory traversal
        if (!filePath.startsWith(loginDir)) return next()

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath)
          const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
          }
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    serveLoginPlugin()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
