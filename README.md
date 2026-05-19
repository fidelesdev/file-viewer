[![npm version](https://img.shields.io/npm/v/file-viewer.svg)](https://www.npmjs.com/package/file-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# file-viewer

> React components for in-app file preview: a shell (`FileViewer`), PDF viewer (`react-pdf`), and image viewer with pan/zoom.

## Prerequisites

This library targets **React 18+** and **Node.js 18+** (recommended for local development).

Peer dependencies must be installed in your app (see [Installation](#installation)).

```sh
node -v && npm -v
```

## Table of contents

- [file-viewer](#file-viewer)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Quick start](#quick-start)
    - [Global defaults](#global-defaults)
    - [Inline vs modal](#inline-vs-modal)
    - [Styling (Tailwind & CSS)](#styling-tailwind--css)
    - [PDF.js worker (required for PDF)](#pdfjs-worker-required-for-pdf)
    - [React-PDF layer CSS](#react-pdf-layer-css)
  - [Peer dependencies](#peer-dependencies)
  - [Migration from 0.1.x](#migration-from-01x)
  - [Local development (this repo)](#local-development-this-repo)
    - [Serving the playground](#serving-the-playground)
    - [Building the library](#building-the-library)
    - [Building the playground](#building-the-playground)
    - [Publishing to npm (maintainers)](#publishing-to-npm-maintainers)
  - [API](#api)
    - [FileViewer](#fileviewer)
    - [setFileViewerDefaults](#setfileviewerdefaults)
    - [PdfViewer](#pdfviewer)
    - [ImageViewer](#imageviewer)
    - [Translations](#translations)
    - [Customization slots](#customization-slots)
  - [Contributing](#contributing)
  - [Built with](#built-with)
  - [Versioning](#versioning)
  - [License](#license)

## Getting Started

`file-viewer` is meant to be consumed as an npm package. Clone this repository only if you want to develop or run the playground.

```sh
git clone https://github.com/fidelesdev/file-viewer.git
cd file-viewer
npm install
npm run dev
```

## Installation

Your app must already use **React 18+**. Then install only the library — **npm 7+**, **Yarn 2+**, and **pnpm** install [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies) from `file-viewer` automatically (no separate `npm install react-pdf …` in your project).

```sh
npm install file-viewer
```

```sh
yarn add file-viewer
```

```sh
pnpm add file-viewer
```

### Peer dependencies (declared in `file-viewer`)

These are listed in this package’s `package.json`; the installer resolves them for you. You do not add them manually unless you use **npm 6** or disable peer auto-install.

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `react`, `react-dom` | 18 or 19 | UI runtime (from your app) |
| `react-pdf` | 9.x | PDF rendering |
| `pdfjs-dist` | **~4.8.69** (same as react-pdf 9) | PDF.js engine — do not use 4.9+ / 4.10+ |
| `react-to-print` | 3.x | Print in `FileViewer` |
| `react-zoom-pan-pinch` | 4.x | Image pan/zoom |

Dialog, scroll area, tooltips, and toolbar icons are **bundled inside** `file-viewer` (no `@radix-ui/*` or `lucide-react`).

### Migration from 0.1.x

If you installed `0.1.x`, remove these peers from your app (they are no longer required):

- `@radix-ui/react-dialog`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-tooltip`
- `lucide-react`

Then install `file-viewer@^0.2.0` only; peers are declared on the package.

## Usage

### Quick start

Styles load automatically when you import from `file-viewer`. **PDF preview** requires a one-time worker setup in your app entry (see [PDF.js worker](#pdfjs-worker-required-for-pdf)).

```tsx
// main.tsx or app entry — before rendering PDFs
import {
  configureFileViewerPdfWorker,
  getFileViewerPdfWorkerSrc,
} from 'file-viewer'

configureFileViewerPdfWorker({
  workerSrc: getFileViewerPdfWorkerSrc(),
})
```

```tsx
import { FileViewer } from 'file-viewer'

export function DocumentPreview() {
  const [open, setOpen] = useState(true)

  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="report.pdf"
      extension="pdf"
      url="/files/report.pdf"
    />
  )
}
```

Supported preview extensions in `FileViewer`: **pdf**, **jpg**, **jpeg**, **png**. Other types show a fallback message (or `renderUnsupported`).

### Global defaults

Configure once at app startup; each call merges incrementally.

```ts
import { setFileViewerDefaults } from 'file-viewer'

setFileViewerDefaults({
  language: 'portuguese',
  fileViewer: { mode: 'inline' },
  pdfViewer: { viewMode: 'continuous', zoomDebounceDelay: 500 },
})

setFileViewerDefaults({
  translations: {
    portuguese: { fileViewer: { downloadTooltip: 'Baixar arquivo' } },
  },
})
```


| API                              | Description                         |
| -------------------------------- | ----------------------------------- |
| `setFileViewerDefaults(partial)` | Merge into global defaults          |
| `getFileViewerDefaults()`        | Read current defaults (debug/tests) |
| `resetFileViewerDefaults()`      | Reset to library built-ins          |


**Merge priority:** instance props → `setFileViewerDefaults` → built-in defaults.

**Never global** (instance only): `open`, `url`, `name`, `extension`, and callbacks such as `onOpenChange`, `onDownload`.

### Inline vs modal


| `mode`             | Behavior                                                   |
| ------------------ | ---------------------------------------------------------- |
| `inline` (default) | Fills the parent container; close button hidden by default |
| `modal`            | Full-screen dialog overlay with backdrop                   |


In **inline** mode, a header action can open the same file in a built-in full-screen modal (“Visualizar em tela cheia”), unless you pass `onOpenInModal` for custom behavior.

### Styling (automatic)

The published build runs **Tailwind v4** over this library and ships the result as `dist/style.css`. Importing any export from `file-viewer` pulls that CSS in (Vite, Webpack, Next with `transpilePackages`).

**Optional manual import** (same file, if your bundler does not follow CSS from `node_modules`):

```ts
import 'file-viewer/style.css'
```

**Option — Your app already uses Tailwind v4:** you may scan the package instead of relying on the pre-built CSS:

```css
@import "tailwindcss";
@source "./node_modules/file-viewer/dist";
```

**Customization without Tailwind:** use `styles` (`React.CSSProperties`) on `FileViewer`, `PdfViewer`, `ImageViewer`, or via `setFileViewerDefaults`.

**Dynamic `classNames` from props** (e.g. `classNames={{ header: 'text-[#235685]' }}`): Tailwind only emits utilities it finds during the build scan. Classes passed as **runtime strings** are not visible to the compiler unless they also appear as **static** text in files covered by `@source` (your app source), or you add them to a **safelist** / theme. Prefer `styles` for one-off colors, or define fixed utility classes in your own CSS.

### PDF.js worker (required for PDF)

`file-viewer` does **not** set the PDF.js worker path inside the published bundle (that would point to a non-existent file under `node_modules/file-viewer/dist/`). Call **`configureFileViewerPdfWorker`** once in your app entry, **before** any `FileViewer` / `PdfViewer` renders a PDF.

#### Recommended (matches react-pdf API version)

Uses `pdfjs.version` from react-pdf (e.g. `4.8.69`), so API and worker stay in sync:

```ts
// src/main.tsx
import {
  configureFileViewerPdfWorker,
  getFileViewerPdfWorkerSrc,
} from 'file-viewer'

configureFileViewerPdfWorker({
  workerSrc: getFileViewerPdfWorkerSrc(),
})

// or simply (same default):
// configureFileViewerPdfWorker()
```

Requires network (unpkg). Fine for dev; for production you can self-host the same file or pin a local copy.

#### Version mismatch (`4.8.69` vs `4.10.x`)

If you see *The API version does not match the Worker version*, your app resolved a **newer** `pdfjs-dist` worker (often `4.10.x`) while react-pdf 9 uses **4.8.69** for the API.

Fix:

```sh
npm install pdfjs-dist@4.8.69
```

Or use `getFileViewerPdfWorkerSrc()` instead of `new URL('pdfjs-dist/...', import.meta.url)`.

Optional `package.json` override:

```json
{
  "overrides": {
    "pdfjs-dist": "4.8.69"
  }
}
```

#### Vite — local worker (offline)

Only after pinning `pdfjs-dist@4.8.69`:

```ts
import { configureFileViewerPdfWorker } from 'file-viewer'

configureFileViewerPdfWorker({
  workerSrc: new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).href,
})
```

Or with `?url`:

```ts
import { configureFileViewerPdfWorker } from 'file-viewer'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

configureFileViewerPdfWorker({ workerSrc: pdfWorker })
```

#### Next.js (App Router)

In a Client Component loaded early (e.g. `providers.tsx` with `'use client'`):

```tsx
'use client'

import { configureFileViewerPdfWorker } from 'file-viewer'

import {
  configureFileViewerPdfWorker,
  getFileViewerPdfWorkerSrc,
} from 'file-viewer'

configureFileViewerPdfWorker({
  workerSrc: getFileViewerPdfWorkerSrc(),
})
```

Ensure `pdfjs-dist@4.8.69` is installed and `transpilePackages: ['file-viewer']` is set in `next.config.ts`.

#### API

| Export | Description |
| ------ | ----------- |
| `configureFileViewerPdfWorker({ workerSrc? })` | Sets `pdfjs.GlobalWorkerOptions.workerSrc` |
| `getFileViewerPdfWorkerSrc()` | CDN URL locked to `pdfjs.version` (recommended) |
| `getFileViewerPdfWorkerCdnUrl()` | Alias of `getFileViewerPdfWorkerSrc` |
| `isFileViewerPdfWorkerConfigured()` | `true` after configure was called |

See [pdf.js getting started](https://mozilla.github.io/pdf.js/getting_started/) for more context.

### React-PDF layer CSS

Included in the bundled `style.css` (react-pdf 9 text/annotation layers). No extra imports.

### Vite

1. Call `configureFileViewerPdfWorker` in `main.tsx` (see [PDF.js worker](#pdfjs-worker-required-for-pdf)).
2. Use `FileViewer` in your components:

```tsx
import { FileViewer } from 'file-viewer'
```

### Next.js (App Router)

Add to `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['file-viewer'],
}

export default nextConfig
```

Call `configureFileViewerPdfWorker` in a Client Component loaded at startup, then use `FileViewer`. Shell components include `'use client'`.

## Local development (this repo)

### Serving the playground

```sh
npm run dev
```

Opens the Vite demo (`src/app/App.tsx`) with inline `FileViewer` and sample PDF/image scenarios.

### Building the library

```sh
npm run build:lib
```

Outputs ESM + types to `dist/` (`index.js`, `index.d.ts`, `style.css`).

Typecheck:

```sh
npx tsc --noEmit
```

### Building the playground

```sh
npm run build
```

Production build of the demo into `playground-dist/` (does not replace library `dist/` from `build:lib`).

Preview:

```sh
npm run preview
```

## API

### FileViewer

Shell with header (title, print, download, optional full-screen), and lazy-loaded PDF or image viewer.

```tsx
<FileViewer
  mode="inline"
  open={open}
  onOpenChange={setOpen}
  name="document.pdf"
  extension="pdf"
  url="https://example.com/doc.pdf"
  language="portuguese"
  hideCloseButton
  showOpenInModalButton
  onOpenInModal={() => { /* optional custom handler */ }}
  pdfViewerProps={{ viewMode: 'single' }}
  classNames={{ header: 'my-header' }}
  styles={{ header: { color: '#fff' } }}
  dialogClassNames={{ panel: 'rounded-lg' }}
/>
```


| Prop                                | Type                                       | Default                            | Description                                   |
| ----------------------------------- | ------------------------------------------ | ---------------------------------- | --------------------------------------------- |
| `mode`                              | `'inline' | 'modal'`                       | `'inline'`                         | Layout mode                                   |
| `open`                              | `boolean`                                  | —                                  | Controlled visibility                         |
| `onOpenChange`                      | `(open: boolean) => void`                  | —                                  | Open state callback                           |
| `name`                              | `string`                                   | —                                  | Display name                                  |
| `extension`                         | `string`                                   | —                                  | File extension (drives viewer choice)         |
| `url`                               | `string`                                   | —                                  | File URL                                      |
| `isLoading`                         | `boolean`                                  | —                                  | Shows loader in viewer area                   |
| `language`                          | `'english' | 'portuguese'`                 | `'english'`                        | UI strings                                    |
| `hideCloseButton`                   | `boolean`                                  | `true` in inline, `false` in modal | Hide header close control                     |
| `showOpenInModalButton`             | `boolean`                                  | `true`                             | Full-screen button (inline only)              |
| `onOpenInModal`                     | `() => void`                               | —                                  | Override built-in modal preview               |
| `onDownload`                        | `() => void`                               | —                                  | Custom download; default uses `url`           |
| `pdfViewerProps`                    | `Omit<PdfViewerProps, 'url' | 'language'>` | —                                  | Passed to embedded PDF viewer                 |
| `renderUnsupported`                 | `ReactNode`                                | —                                  | Custom unsupported-type UI                    |
| `classNames` / `styles`             | slot maps                                  | —                                  | Per-slot styling                              |
| `dialogClassNames` / `dialogStyles` | layer maps                                 | —                                  | Modal layers (`backdrop`, `content`, `panel`) |


There is **no** `hideHeader` prop yet; use `classNames.header` with `hidden` or `styles.header` as a workaround.

### setFileViewerDefaults

```ts
setFileViewerDefaults({
  language: 'portuguese',
  fileViewer: {
    hideCloseButton: true,
    showOpenInModalButton: true,
    classNames: { header: 'app-viewer-header' },
    pdfViewerProps: { viewMode: 'continuous' },
  },
  pdfViewer: { preloadAhead: 1, zoomDebounceDelay: 500 },
  imageViewer: { classNames: { root: 'image-root' } },
  toolbar: { classNames: { toolbar: 'my-toolbar' } },
  tooltip: { delayDuration: 300 },
  autoHide: { proximityThreshold: 160, timeout: 3000 },
  translations: { /* deep partial per language */ },
})
```

### PdfViewer

Standalone PDF viewer (continuous scroll or single page, zoom, pagination toolbar).

```tsx
import { PdfViewer } from 'file-viewer'

<PdfViewer
  url="/doc.pdf"
  viewMode="continuous"
  language="english"
  preloadAhead={1}
  zoomDebounceDelay={500}
  debounceDelay={300}
  classNames={{ page: 'my-page' }}
/>
```


| Prop                                                  | Type                      | Default        | Description                                      |
| ----------------------------------------------------- | ------------------------- | -------------- | ------------------------------------------------ |
| `url`                                                 | `string`                  | —              | PDF URL                                          |
| `viewMode`                                            | `'single' | 'continuous'` | `'continuous'` | Page layout                                      |
| `debounceDelay`                                       | `number`                  | `300`          | Resize debounce (ms)                             |
| `zoomDebounceDelay`                                   | `number`                  | `500`          | Zoom canvas re-render debounce (ms)              |
| `preloadAhead`                                        | `number`                  | `1`            | Pages mounted outside viewport (continuous)      |
| `renderPagination`                                    | `function | null`         | default UI     | Custom pagination; `null` hides                  |
| `className` / `pageClassName` / `paginationClassName` | `string`                  | —              | Legacy aliases → `classNames`                    |
| `classNames` / `styles`                               | slot maps                 | —              | `root`, `scrollArea`, `page`, `pagination`, etc. |


Page width in both modes is capped at **50rem** (same sizing rules).

### ImageViewer

```tsx
import { ImageViewer } from 'file-viewer'

<ImageViewer url="/photo.jpg" name="photo.jpg" language="portuguese" />
```

Pan/zoom via `react-zoom-pan-pinch`, floating toolbar with auto-hide.

### Translations

- Bundled: `english`, `portuguese`
- `getFileViewerTranslations(language)` — applies global overlay from `setFileViewerDefaults({ translations })`
- `resolveFormattedMessage` — for `FormattableMessage` entries
- Exports: `fileViewerTranslationsByLanguage`, `defaultFileViewerTranslations`

### Customization slots

Shared types: `FileViewerClassNames`, `PdfViewerClassNames`, `ImageViewerClassNames`, `ViewerToolbarClassNames`, `FileViewerTooltipClassNames`, and matching `*Styles` (`SlotStyle` = `CSSProperties`).

See `src/features/file-viewer/customization-types.ts` for all keys.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin my-feature`
5. Open a pull request

Run `npx tsc --noEmit` and `npm run build:lib` before submitting.

## Built with

- [React](https://react.dev/)
- [react-pdf](https://github.com/wojtekmaj/react-pdf) / [pdf.js](https://mozilla.github.io/pdf.js/)
- [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch)
- Internal UI primitives (dialog, scroll area, tooltip) and inline SVG icons — no Radix UI or Lucide at runtime
- [Tailwind CSS](https://tailwindcss.com/) v4 (utilities in components; optional pre-built `file-viewer/style.css`)
- [Vite](https://vitejs.dev/) + [tsup](https://tsup.egoist.dev/) (playground + library build)

## Versioning

This project uses [SemVer](https://semver.org/). See `package.json` for the current version.

## License

[MIT](LICENSE) © file-viewer contributors