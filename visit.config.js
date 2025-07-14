import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/'  // 👈 Important for GitHub Pages!
})
