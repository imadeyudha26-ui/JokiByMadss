import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  publicDir: 'joki-ml/assets',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'joki-ml/index.html',
        'joki-ml/login.html',
        'joki-ml/order.html',
        'joki-ml/pesanan.html',
        'joki-ml/admin.html',
      ],
    },
  },
})
