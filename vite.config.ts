import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          'ui-vendor': ['@tanstack/vue-query', 'axios'],
          'icons-vendor': ['lucide-vue-next'],
          // Component chunks
          'ui-components': [
            './src/components/ui/button/index.ts',
            './src/components/ui/card/index.ts',
            './src/components/ui/input/index.ts',
            './src/components/ui/badge/index.ts',
            './src/components/ui/skeleton/index.ts',
          ],
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name.includes('vendor')) {
            return `js/vendors/${name}-[hash].js`;
          }
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return `img/[name]-[hash].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType ?? '')) {
            return `fonts/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    // Optimize bundle size
    cssCodeSplit: true,
    sourcemap: false,
    // Chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', '@tanstack/vue-query', 'axios', 'lucide-vue-next'],
  },
});
