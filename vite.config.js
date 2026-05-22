import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'canada-immigration-advisor' with your actual GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/canada-immigration-advisor/',
})
