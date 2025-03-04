import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
const env = loadEnv(process.cwd(), '')

export default defineConfig({
  plugins: [react()],
  server: {
    port: env.VITE_PORT || 3000
  }
})
