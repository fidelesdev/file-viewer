import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/features/file-viewer/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@radix-ui/react-dialog',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-tooltip',
    'lucide-react',
    'pdfjs-dist',
    'react-pdf',
    'react-to-print',
    'react-zoom-pan-pinch',
  ],
})
