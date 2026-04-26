import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['firebase/auth', 'firebase/app']
  }
})

=======
})
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
