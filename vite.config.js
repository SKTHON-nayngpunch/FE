import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@apis", replacement: "/src/apis" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@images", replacement: "/src/assets/images" },
      { find: "@components", replacement: "/src/components" },
      { find: "@commons", replacement: "/src/components/commons" },
      { find: "@layout", replacement: "/src/components/layout" },
      { find: "@data", replacement: "/src/data" },
      { find: "@hooks", replacement: "/src/hooks" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@utils", replacement: "/src/utils" },
    ],
  }
})
