[![npm version](https://img.shields.io/npm/v/file-viewer.svg)](https://www.npmjs.com/package/file-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# file-viewer

> React components for in-app file preview: a shell (`ViewFile`), PDF viewer (`react-pdf`), and image viewer with pan/zoom.

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
    - [PDF.js worker](#pdfjs-worker)
    - [React-PDF layer CSS](#react-pdf-layer-css)
  - [Peer dependencies](#peer-dependencies)
  - [Migration from 0.1.x](#migration-from-01x)
  - [Local development (this repo)](#local-development-this-repo)
    - [Serving the playground](#serving-the-playground)
    - [Building the library](#building-the-library)
    - [Building the playground](#building-the-playground)
    - [Publishing to npm (maintainers)](#publishing-to-npm-maintainers)
  - [API](#api)
    - [ViewFile](#viewfile)
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

**Before you install:** read [Prerequisites](#prerequisites) and install peer dependencies.

```sh
npm install file-viewer
npm install react react-dom react-pdf pdfjs-dist react-to-print react-zoom-pan-pinch
```

Or with Yarn:

```sh
yarn add file-viewer
yarn add react react-dom react-pdf pdfjs-dist react-to-print react-zoom-pan-pinch
```

### Peer dependencies

| Package | Purpose |
| ------- | ------- |
| `react`, `react-dom` | UI runtime |
| `react-pdf`, `pdfjs-dist` | PDF rendering |
| `react-to-print` | Print action in `ViewFile` |
| `react-zoom-pan-pinch` | Image pan/zoom in `ImageViewer` |

Dialog, scroll area, tooltips, and toolbar icons are **bundled inside** `file-viewer` (no `@radix-ui/*` or `lucide-react` in your app).

### Migration from 0.1.x

If you installed `0.1.x`, remove these peers from your app (they are no longer required):

- `@radix-ui/react-dialog`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-tooltip`
- `lucide-react`

Reinstall peers using the table above, then bump to `file-viewer@^0.2.0`.

## Usage

### Quick start

```tsx
import { ViewFile } from 'file-viewer'
import 'file-viewer/style.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

export function DocumentPreview() {
  const [open, setOpen] = useState(true)

  return (
    <ViewFile
      open={open}
      onOpenChange={setOpen}
      name="report.pdf"
      extension="pdf"
      url="/files/report.pdf"
    />
  )
}
```

Supported preview extensions in `ViewFile`: **pdf**, **jpg**, **jpeg**, **png**. Other types show a fallback message (or `renderUnsupported`).

### Global defaults

Configure once at app startup; each call merges incrementally.

```ts
import { setFileViewerDefaults } from 'file-viewer'

setFileViewerDefaults({
  language: 'portuguese',
  viewFile: { mode: 'inline' },
  pdfViewer: { viewMode: 'continuous', zoomDebounceDelay: 500 },
})

setFileViewerDefaults({
  translations: {
    portuguese: { viewFile: { downloadTooltip: 'Baixar arquivo' } },
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

### Styling (Tailwind & CSS)

Components ship with **Tailwind CSS v4** utility classes.

**Option A — Your app uses Tailwind v4:** scan the package `dist` so built-in classes are generated:

```css
@import "tailwindcss";
@source "./node_modules/file-viewer/dist";
```

**Option B — Pre-built CSS:** import the bundle produced at publish time:

```ts
import 'file-viewer/style.css'
```

**Customization without Tailwind:** use `styles` (`React.CSSProperties`) on `ViewFile`, `PdfViewer`, `ImageViewer`, or via `setFileViewerDefaults`.

**Dynamic `classNames` from props** (e.g. `classNames={{ header: 'text-[#235685]' }}`): Tailwind only emits utilities it finds during the build scan. Classes passed as **runtime strings** are not visible to the compiler unless they also appear as **static** text in files covered by `@source` (your app source), or you add them to a **safelist** / theme. Prefer `styles` for one-off colors, or define fixed utility classes in your own CSS.

### PDF.js worker

`PdfViewer` sets `pdfjs.GlobalWorkerOptions.workerSrc` from `pdfjs-dist`. Vite usually resolves this automatically; other bundlers may need to copy the worker to `public/` — see [pdf.js getting started](https://mozilla.github.io/pdf.js/getting_started/).

### React-PDF layer CSS

Import once in your app entry:

```ts
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
```

## Local development (this repo)

### Serving the playground

```sh
npm run dev
```

Opens the Vite demo (`src/app/App.tsx`) with inline `ViewFile` and sample PDF/image scenarios.

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

### ViewFile

Shell with header (title, print, download, optional full-screen), and lazy-loaded PDF or image viewer.

```tsx
<ViewFile
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
  viewFile: {
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

Shared types: `ViewFileClassNames`, `PdfViewerClassNames`, `ImageViewerClassNames`, `ViewerToolbarClassNames`, `FileViewerTooltipClassNames`, and matching `*Styles` (`SlotStyle` = `CSSProperties`).

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