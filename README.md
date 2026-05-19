[![npm version](https://img.shields.io/npm/v/@fdls/file-viewer.svg)](https://www.npmjs.com/package/@fdls/file-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

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
  - [Styling (Tailwind & CSS)](#styling-tailwind--css)
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

| Type | Supported Extensions | Description |
| :--- | :--- | :--- |
| **PDF** | `.pdf` | Multi-page document viewer with continuous scroll, pagination, and zoom. |
| **Images** | `.jpg`, `.jpeg`, `.png` | Interactive image viewer with pan and zoom controls. |
| **Others** | *Coming soon* | We plan to support more extensions in the future! For now, unsupported types display a fallback message (which you can override using the `renderUnsupported` prop). |

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

| `mode` | Behavior |
| :--- | :--- |
| **`inline`** (default) | Fills the parent container. The close button is hidden by default. A full-screen expand button is shown on the header. |
| **`modal`** | Full-screen dialog overlay with focus-trap. Close via header button or Escape. |

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

Override visuals with `styles` (`CSSProperties`) or extra `classNames` on each component:

```tsx
<FileViewer
  styles={{ header: { backgroundColor: '#1e40af' } }}
  classNames={{ header: 'my-app-viewer-header' }}
/>
```

### Framework Guides (Vite & Next.js)

#### Next.js (App Router)
1. Add to `next.config.ts`:
```ts
const nextConfig = {
  transpilePackages: ['@fdls/file-viewer'],
}
```
2. Create a Client Component provider (`providers.tsx`) and call `configureFileViewerPdfWorker()` inside it.
3. Import and use `FileViewer` in your `'use client'` components.

#### Vite
1. Call `configureFileViewerPdfWorker()` in `main.tsx`.
2. Use `FileViewer` in your components.

---

## API Reference

### FileViewer
The main shell component containing the header toolbar and the appropriate viewer (PDF or Image).

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `open` | `boolean` | — | Controlled visibility state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when close button is clicked or Escape is pressed |
| `url` | `string` | — | File URL |
| `name` | `string` | — | Display name in the header |
| `extension` | `string` | — | File extension (drives the viewer choice) |
| `mode` | `'inline' \| 'modal'` | `'inline'` | Layout mode |
| `language` | `'english' \| 'portuguese'` | `'english'` | Language for UI strings |
| `hideCloseButton` | `boolean` | `true` (inline) / `false` (modal) | Hide header close control |
| `onDownload` | `() => void` | — | Custom download handler (default uses `url`) |
| `pdfViewerProps` | `Object` | — | Props passed down to the PdfViewer |

### PdfViewer
Standalone PDF viewer component with continuous scroll, pagination, and zoom.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | — | PDF URL |
| `viewMode` | `'single' \| 'continuous'` | `'continuous'` | Page layout |
| `preloadAhead` | `number` | `1` | Pages mounted outside viewport (continuous) |
| `zoomDebounceDelay` | `number` | `500` | Canvas re-render debounce (ms) |

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
