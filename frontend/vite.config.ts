import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001/',
                changeOrigin: true,
            },
            '/random-name':{
                target: 'https://names.drycodes.com/1?nameOptions=funnyWords&separator=space&format=json',
                changeOrigin: true,
            }
        },
    },
})