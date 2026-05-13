# file-viewer

React components for previewing files inside your app: a **Radix Dialog** shell (`ViewFile`), a **PDF** viewer built on `react-pdf`, and an **image** viewer with pan/zoom.

## Install

```bash
npm install file-viewer
```

Install **peer dependencies** (versions should satisfy the ranges declared in this package’s `package.json`):

```bash
npm install react react-dom @radix-ui/react-dialog @radix-ui/react-scroll-area @radix-ui/react-tooltip react-pdf pdfjs-dist lucide-react react-to-print react-zoom-pan-pinch
```

## PDF.js worker

`PdfViewer` configures the worker from `pdfjs-dist`. In **Vite**, this usually works out of the box. In other bundlers, you may need to copy the worker to your public folder or adjust asset rules—see [pdf.js documentation](https://mozilla.github.io/pdf.js/getting_started/).

## React-PDF CSS (text & annotation layers)

Import these once in your app entry (the playground does the same in `src/main.tsx`):

```ts
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
```

## Tailwind CSS (styling)

Components use **Tailwind CSS v4** utility classes. If your app already uses Tailwind v4, point the scanner at this package so classes are generated:

```css
@import "tailwindcss";
@source "./node_modules/file-viewer/dist";
```

If you link the package locally (`npm link` / workspace), use a path that resolves to the built `dist` folder (for example `@source "../path/to/file-viewer/dist"`).

Without Tailwind, you must ship or adopt another styling strategy (e.g. a pre-built CSS bundle); that is not included in the default build.

## Language

UI strings are bundled for **`english`** (default) and **`portuguese`**. Pass `language="portuguese"` on `ViewFile`, `PdfViewer`, or `ImageViewer`.

Some entries use `FormattableMessage` (plain string or a callback with typed params), e.g. `viewFile.unsupportedFileType` and `pdfViewer.pageInputAriaLabel`. Use `getFileViewerTranslations(language)` or `resolveFormattedMessage` if you compose your own UI.

Exports include `fileViewerTranslationsByLanguage`, `defaultFileViewerTranslations` (English), and `resolveFormattedMessage`.

## ViewFile dialog layout

The dialog uses a full-viewport **backdrop** (dismiss via `Dialog.Close`), a transparent **content** bridge, and an inner **panel** (header + viewer). Defaults fill the screen edge to edge.

Pass **`dialogClassNames`** with optional `backdrop`, `content`, and `panel` keys. Each string is **merged after** the built-in classes (append Tailwind utilities; use `!` prefix to force overrides when needed).

## Usage

```tsx
import { ViewFile } from 'file-viewer'

export function Example() {
  return (
    <ViewFile
      open
      onOpenChange={() => {}}
      name="document.pdf"
      extension="pdf"
      language="english"
      url="/files/document.pdf"
    />
  )
}
```

Named exports: `ViewFile`, `PdfViewer`, `ImageViewer`, `FileViewerTooltipProvider`, `FileViewerTooltip`, and their TypeScript types (see `src/features/file-viewer/index.ts`).

## Local development (this repo)

- `npm run dev` — Vite demo app.
- `npm run build:lib` — ESM bundle + types into `dist/` via `tsup` (published tarball).
- `npm run build` — production bundle of the **demo** into `playground-dist/` (does not overwrite the library `dist/` from `build:lib`).

## License

MIT
