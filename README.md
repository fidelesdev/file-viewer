[npm version](https://www.npmjs.com/package/@fdls/file-viewer)
[License: MIT](https://opensource.org/licenses/MIT)

# @fdls/file-viewer

> React components for in-app file preview: a shell (`FileViewer`), PDF viewer, and image viewer with pan/zoom.

This library provides a drop-in file viewing experience with a clean UI, robust PDF rendering, and image pan/zoom capabilities. It ships its own internal UI primitives (tooltips, dialogs, icons), so you **do not** need to install external UI libraries to use it.

## Table of contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Supported File Types](#supported-file-types)
- [Quick Start](#quick-start)
  - [1. Configure the PDF Worker](#1-configure-the-pdf-worker)
  - [2. Use the FileViewer Component](#2-use-the-fileviewer-component)
- [Usage Guide](#usage-guide)
  - [Inline vs Modal Layouts](#inline-vs-modal-layouts)
  - [Global Defaults](#global-defaults)
  - [Styling (plain CSS)](#styling-plain-css)
  - [Header customization](#header-customization)
  - [Upgrading to v0.4](#upgrading-to-v04)
  - [Framework Guides (Vite & Next.js)](#framework-guides-vite--nextjs)
- [API Reference](#api-reference)
  - [FileViewer](#fileviewer)
  - [PdfViewer](#pdfviewer)
  - [ImageViewer](#imageviewer)
  - [setFileViewerDefaults](#setfileviewerdefaults)
- [Local Development](#local-development)
- [License](#license)

---

## Getting Started

Your app must already use **React 18+**. The installer will automatically resolve and install the necessary peer dependencies.

## Installation

```sh
npm install @fdls/file-viewer
```

Or with Yarn:

```sh
yarn add @fdls/file-viewer
```

Or with pnpm:

```sh
pnpm add @fdls/file-viewer
```

---

## Supported File Types

The `FileViewer` component automatically chooses the correct internal viewer based on the `extension` prop.


| Type       | Supported Extensions    | Description                                                                                                                                                          |
| ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PDF**    | `.pdf`                  | Multi-page document viewer with continuous scroll, pagination, and zoom.                                                                                             |
| **Images** | `.jpg`, `.jpeg`, `.png` | Interactive image viewer with pan and zoom controls.                                                                                                                 |
| **Others** | *Coming soon*           | We plan to support more extensions in the future! For now, unsupported types display a fallback message (which you can override using the `renderUnsupported` prop). |


---

## Quick Start

### 1. Configure the PDF Worker

You **must** configure the PDF worker path in your application's entry point before any PDFs are rendered.

```tsx
// main.tsx (Vite) or providers.tsx (Next.js)
import { configureFileViewerPdfWorker } from '@fdls/file-viewer'

// Uses the recommended CDN URL automatically
configureFileViewerPdfWorker()
```

### 2. Use the FileViewer Component

The styles are automatically loaded when you import from `@fdls/file-viewer`.

```tsx
import { useState } from 'react'
import { FileViewer } from '@fdls/file-viewer'

export function DocumentPreview() {
  const [open, setOpen] = useState(true)

  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="annual-report.pdf"
      extension="pdf"
      url="https://example.com/files/annual-report.pdf"
      language="english" // or 'portuguese'
    />
  )
}
```

---

## Usage Guide

### Inline vs Modal Layouts

The `FileViewer` can be rendered in two modes:


| `mode`                 | Behavior                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `**inline**` (default) | Fills the parent container. The close button is hidden by default. A full-screen expand button is shown on the header. |
| `**modal**`            | Full-screen dialog overlay with focus-trap. Close via header button or Escape.                                         |


### Global Defaults

You can configure global behaviors (like language or UI tweaks) once at app startup:

```ts
import { setFileViewerDefaults } from '@fdls/file-viewer'

setFileViewerDefaults({
  language: 'portuguese',
  fileViewer: { mode: 'inline' },
  pdfViewer: { viewMode: 'continuous', zoomDebounceDelay: 500 },
})
```

**Merge priority:** Instance props > Global Defaults > Built-in defaults.

### Styling (plain CSS)

The library ships **plain CSS** as `dist/style.css` (no Tailwind in the published package). Importing any export from `@fdls/file-viewer` loads that stylesheet automatically (Vite, Webpack, Next.js with `transpilePackages`). It works alongside Tailwind v3/v4 or without Tailwind.

Override visuals with `className` / `style` on the outer shell, or per-slot `classNames` / `styles`:

```tsx
<FileViewer
  className="my-viewer h-full rounded-lg"
  style={{ maxHeight: '80vh' }}
  styles={{ header: { backgroundColor: '#1e40af' } }}
  classNames={{ header: 'my-app-viewer-header' }}
/>
```

In **modal** mode, `dialogClassNames.content` styles the full-screen overlay layer (`Dialog.Content`); `className` styles the visible panel (`.fv-shell-root`).

### Header customization

The header API has three levels — use the shallowest one that fits:

| Level | Use case | API |
| ----- | -------- | --- |
| **1 — Config** | Hide/show built-ins or tweak styles | `showFullscreenButton`, `showPrintButton`, `showDownloadButton`, `hideCloseButton`, `classNames` / `styles` |
| **2 — Extend** | Add actions without replacing built-ins | `extraHeaderActions` |
| **3 — Compose** | Reorder or replace header/close UI | `renderHeaderActions({ defaultActions, ... })`, `renderCloseButton({ defaultCloseButton, close, mode })` |

**Level 2 — add a Share button (right of built-ins, default):**

```tsx
<FileViewer extraHeaderActions={<ShareButton />} {...props} />
```

**Level 2 — extras on the left:**

```tsx
<FileViewer
  extraHeaderActions={<ShareButton />}
  extraHeaderActionsSide="left"
  {...props}
/>
```

Or style the wrappers directly:

```tsx
<FileViewer
  extraHeaderActions={<ShareButton />}
  classNames={{
    headerActionsExtra: 'order-first mr-auto',
    headerActionsBuiltins: 'ml-auto',
  }}
/>
```

**Level 3 — compose with defaults:**

```tsx
<FileViewer
  renderHeaderActions={({ defaultActions }) => (
    <>
      {defaultActions}
      <ShareButton />
    </>
  )}
  renderCloseButton={({ defaultCloseButton }) => (
    <MyTooltip label="Close">{defaultCloseButton}</MyTooltip>
  )}
  {...props}
/>
```

When `renderHeaderActions` is set, `extraHeaderActions` is ignored. Built-in fullscreen toggle: enter (`Maximize2`) in inline mode, exit (`Minimize2`) in the inline full-screen preview modal. Action order: fullscreen toggle → print → download.

`FileViewerHeaderActionsContext` exposes `toggleFullscreen()` and `isFullscreen` for custom actions.

### Upgrading to v0.4

See [CHANGELOG.md](./CHANGELOG.md) for the full list. Quick reference:

| Removed / renamed (0.3.x) | Replacement (0.4) |
| ------------------------- | ----------------- |
| `classNames.root`, `styles.root` | `className`, `style` |
| `dialogClassNames.panel`, `dialogClassNames.backdrop` | `className` (panel) / remove backdrop (unused) |
| `showOpenInModalButton` | `showFullscreenButton` |
| `onOpenInModal` | `onFullscreen` |
| `classNames.openInModalButton` | `classNames.fullscreenButton` |

### Framework Guides (Vite & Next.js)

#### Next.js (App Router)

> **Turbopack (`next dev --turbo`)**  
> PDF preview does **not** work with Turbopack on **Next.js 14.x and earlier**. `pdfjs-dist` relies on `/* webpackIgnore: true */` on a dynamic worker import, which Turbopack only respects reliably from **Next.js 15** onward ([vercel/next.js#65406](https://github.com/vercel/next.js/issues/65406)).  
> On older Next versions you may see `Module not found` when compiling `pdfjs-dist/build/pdf.mjs`.  
> **Workarounds:** run dev **without** `--turbo` (`next dev`), or **upgrade to Next.js 15+** if you need Turbopack in development.

1. Add to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ['@fdls/file-viewer'],
}
```

1. Create or modify your **Client Component provider** (e.g., `providers.tsx`). This is where you initialize client-side logic for your app:

```tsx
'use client'

import { configureFileViewerPdfWorker } from '@fdls/file-viewer'
import { useEffect } from 'react'

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the PDF worker once when the app starts
    configureFileViewerPdfWorker()
  }, [])

  return <>{children}</>
}
```

2. Wrap your `layout.tsx` with this provider and import `FileViewer` in any `'use client'` page.

#### Vite

1. Call `configureFileViewerPdfWorker()` in `main.tsx`.
2. Use `FileViewer` in your components.

---

## API Reference

### FileViewer

The main shell component containing the header toolbar and the appropriate viewer (PDF or Image).


| Prop                   | Type                      | Default                           | Description                                                |
| ---------------------- | ------------------------- | --------------------------------- | ---------------------------------------------------------- |
| `open`                 | `boolean`                 | —                                 | Controlled visibility state                                |
| `onOpenChange`         | `(open: boolean) => void` | —                                 | Callback when close button is clicked or Escape is pressed |
| `url`                  | `string`                  | —                                 | File URL                                                   |
| `name`                 | `string`                  | —                                 | Display name in the header                                 |
| `extension`            | `string`                  | —                                 | File extension (drives the viewer choice)                  |
| `mode`                 | `'inline' \| 'modal'`     | `'inline'`                        | Inline container or full-screen dialog                     |
| `language`             | `'english' \| 'portuguese'` | `'english'`                     | UI language                                                |
| `className`            | `string`                  | —                                 | Classes on the outer shell (`.fv-shell-root`)              |
| `style`                | `CSSProperties`           | —                                 | Inline styles on the outer shell                           |
| `hideCloseButton`      | `boolean`                 | `true` (inline) / `false` (modal) | Hide header close control                                  |
| `showFullscreenButton` | `boolean`                 | `true` (inline only)              | Full-screen expand control in inline mode                  |
| `showPrintButton`      | `boolean`                 | `true`                            | Show print action                                          |
| `showDownloadButton`   | `boolean`                 | `true`                            | Show download action                                       |
| `extraHeaderActions`   | `ReactNode \| fn`         | —                                 | Extra toolbar actions (wrappers: `headerActionsExtra`)     |
| `extraHeaderActionsSide` | `'left' \| 'right'` | `'right'`                  | Extra actions to the left or right of built-in controls    |
| `renderHeaderActions`  | `(props) => ReactNode`    | —                                 | Compose or replace header actions (`defaultActions` in props) |
| `renderCloseButton`    | `(props) => ReactNode`    | —                                 | Compose or replace close button (`defaultCloseButton` in props) |
| `onDownload`           | `() => void`              | —                                 | Custom download handler (default uses `url`)               |
| `onFullscreen`         | `() => void`              | —                                 | Custom fullscreen handler (default opens internal modal)   |
| `dialogClassNames`     | `{ content?: string }`    | —                                 | Modal overlay layer only                                   |
| `pdfViewerProps`       | `Object`                  | —                                 | Props passed down to the PdfViewer                         |


### PdfViewer

Standalone PDF viewer component with continuous scroll, pagination, and zoom.


| Prop                | Type      | Default       | Description                                 |
| ------------------- | --------- | ------------- | ------------------------------------------- |
| `url`               | `string`  | —             | PDF URL                                     |
| `viewMode`          | `'single' | 'continuous'` | `'continuous'`                              |
| `preloadAhead`      | `number`  | `1`           | Pages mounted outside viewport (continuous) |
| `zoomDebounceDelay` | `number`  | `500`         | Canvas re-render debounce (ms)              |


### ImageViewer

Standalone Image viewer with pan/zoom and auto-hide floating toolbar.
Accepts `url`, `name`, `language`, and custom styles.

### setFileViewerDefaults

Function to merge settings globally.
`setFileViewerDefaults(partial)` / `getFileViewerDefaults()` / `resetFileViewerDefaults()`

---

## Local Development

If you want to run the playground locally:

```sh
git clone https://github.com/fidelesdev/file-viewer.git
cd file-viewer
npm install
npm run dev
```

## License

[MIT](LICENSE) © file-viewer contributors