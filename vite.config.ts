import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { localDrawApi } from './vite-plugin-local-api.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), localDrawApi()],
})
