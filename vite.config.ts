import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { devApi } from './vite-api-plugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
}))
