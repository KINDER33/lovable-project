
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Désactiver le tagger en production
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Pas de sourcemap en production
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
          icons: ['lucide-react'],
        },
        // Noms de fichiers optimisés pour la production
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    // Optimisations supplémentaires
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'globalThis',
    // Supprimer les références de développement
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Optimisation du serveur de développement
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
