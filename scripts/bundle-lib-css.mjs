/**
 * Bundles plain CSS for @fdls/file-viewer (no Tailwind).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(rootDir, 'dist/style.css')

const reactPdfTextLayer = require.resolve(
  'react-pdf/dist/esm/Page/TextLayer.css',
)
const reactPdfAnnotationLayer = require.resolve(
  'react-pdf/dist/esm/Page/AnnotationLayer.css',
)

const libCssFiles = [
  reactPdfTextLayer,
  reactPdfAnnotationLayer,
  join(rootDir, 'src/features/file-viewer/pdf-viewer.css'),
  join(rootDir, 'src/features/file-viewer/styles/variables.css'),
  join(rootDir, 'src/features/file-viewer/styles/animations.css'),
  join(rootDir, 'src/features/file-viewer/styles/icons.css'),
  join(rootDir, 'src/features/file-viewer/styles/primitives.css'),
  join(rootDir, 'src/features/file-viewer/styles/file-viewer-shell.css'),
  join(rootDir, 'src/features/file-viewer/styles/toolbar.css'),
  join(rootDir, 'src/features/file-viewer/styles/image-viewer.css'),
  join(rootDir, 'src/features/file-viewer/styles/pdf-viewer-layout.css'),
]

function minifyCss(css) {
  // Do NOT collapse spaces before ':' — that turns `.textLayer :is(span)` into
  // `.textLayer:is(span)` (invalid) and breaks react-pdf text layer positioning.
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .trim()
}

const parts = libCssFiles.map((filePath) => readFileSync(filePath, 'utf8'))
const bundled = parts.join('\n')
const output = minifyCss(bundled)

if (/@layer\b/.test(output)) {
  console.error('bundle-lib-css: @layer found in output')
  process.exit(1)
}

if (/@import\s+['"]tailwindcss['"]/.test(output)) {
  console.error('bundle-lib-css: tailwindcss import found in output')
  process.exit(1)
}

if (/color-mix\s*\([^)]*AccentColor/i.test(output)) {
  console.error(
    'bundle-lib-css: color-mix(AccentColor) breaks Next.js Turbopack / Lightning CSS',
  )
  process.exit(1)
}

if (/\.textLayer:is\(/.test(output)) {
  console.error(
    'bundle-lib-css: broken selector ".textLayer:is" — descendant space before :is() was removed',
  )
  process.exit(1)
}

if (!/\.textLayer :is\(span/.test(output)) {
  console.error(
    'bundle-lib-css: missing ".textLayer :is(span" — react-pdf text layer styles are invalid',
  )
  process.exit(1)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, output)
console.log(`bundle-lib-css: wrote ${outPath} (${output.length} bytes)`)
