import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/shopping-cart-react',
  build: {
    rollupOptions: {
      external: [
        'axios',
        'react-icons/fa6'
      ]
    }
  }
})