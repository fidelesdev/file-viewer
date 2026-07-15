import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { CodeBlock } from '../components/CodeBlock'
import { PropTable } from '../components/PropTable'
import { InlineFileViewerDemo } from '../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../demos/assets'

const installCode = `# Installation using npm
npm install @fdls/file-viewer

# Installation using yarn
yarn add @fdls/file-viewer

# Installation using pnpm
pnpm add @fdls/file-viewer`

const workerCode = `import { configureFileViewerPdfWorker } from '@fdls/file-viewer'

// Call this once in your application entry point (e.g., main.tsx or index.tsx)
configureFileViewerPdfWorker()`

const cssCode = `// Import CSS variables and component styles in your global style sheet or entry file
import '@fdls/file-viewer/style.css'`

const minimalCode = `import { useState } from 'react'
import { FileViewer } from '@fdls/file-viewer'

export function MyDocumentPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition"
      >
        Preview Document
      </button>

      <FileViewer
        open={open}
        onOpenChange={setOpen}
        name="annual-report-2026.pdf"
        extension="pdf"
        url="https://example.com/files/report.pdf"
        mode="modal"
      />
    </div>
  )
}`

const nextjsWorkerCode = `// For Next.js (App Router), call this in a client component or template
'use client'

import { useEffect } from 'react'
import { configureFileViewerPdfWorker } from '@fdls/file-viewer'

export function PdfWorkerInitializer() {
  useEffect(() => {
    configureFileViewerPdfWorker()
  }, [])

  return null
}`

const firstStepsProps = [
  {
    name: 'open',
    type: 'boolean',
    defaultValue: 'undefined',
    description: 'Controls the visibility of the viewer. When true, the file viewer is mounted and displayed.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    defaultValue: 'undefined',
    description: 'Callback fired when the viewer requested to close (e.g., clicking close button or pressing Escape).',
  },
  {
    name: 'name',
    type: 'string',
    defaultValue: 'undefined',
    description: 'The display name of the file shown in the header. (e.g., "contract.pdf").',
  },
  {
    name: 'extension',
    type: 'string',
    defaultValue: 'undefined',
    description: 'The lowercased file extension without the dot (e.g., "pdf", "png", "jpg", "jpeg"). This determines which internal engine is loaded.',
  },
  {
    name: 'url',
    type: 'string',
    defaultValue: 'undefined',
    description: 'The direct source URL of the file. Required for loading the content.',
  },
  {
    name: 'mode',
    type: '"inline" | "modal"',
    defaultValue: '"inline"',
    description: 'The layout mode. "inline" fits the viewer inside its relative parent container. "modal" launches a full-screen accessible portal overlay.',
  },
]

export function GettingStartedPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Learn how to install, configure, and integrate @fdls/file-viewer into your React application with support for high-performance PDF and image previews."
    >
      <DocSection id="introduction" title="Why in-app file preview?">
        <p className="text-zinc-300 leading-relaxed">
          Traditional web applications typically handle file viewing by forcing users to download files or by opening them in a blank browser tab. This disrupts user flow, splits analytics tracking, and degrades overall application cohesion.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          <code className="text-emerald-400 font-mono">@fdls/file-viewer</code> provides an elegant, highly customizable, and unified solution for rendering file previews directly inside your React layout. Under the hood, it abstracts away complex visualizers:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2 text-zinc-400">
          <li>
            <strong className="text-zinc-200">PDF Engine (react-pdf):</strong> Supported by standard Web Workers to prevent main-thread blocking, offering continuous scroll, pagination, zooming, aspect ratio retention during resizes, and virtual rendering.
          </li>
          <li>
            <strong className="text-zinc-200">Image Engine (react-zoom-pan-pinch):</strong> Powered by hardware-accelerated transforms for double-tap zoom, gesture pinch, panning, mouse wheel zoom focal lock, and viewport limits.
          </li>
          <li>
            <strong className="text-zinc-200">Level 1-3 Extensibility:</strong> Flexibly adapt styles, override default behaviors, inject custom icons, or completely rewrite header/toolbar logic.
          </li>
        </ul>
      </DocSection>

      <DocSection id="install" title="Installation">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Install the package via your preferred package manager. Ensure you also have <code className="text-emerald-400">react</code> and <code className="text-emerald-400">react-dom</code> (v18 or above) installed.
        </p>
        <CodeBlock code={installCode} language="bash" />
      </DocSection>

      <DocSection id="pdf-worker" title="Configuring the PDF Worker">
        <p className="text-zinc-300 leading-relaxed">
          To process PDF files asynchronously without locking up your UI thread, the underlying PDF engine (<code className="text-zinc-100 font-mono">pdfjs-dist</code>) requires a backend Web Worker. The package exports a helper called <code className="text-emerald-400 font-mono">configureFileViewerPdfWorker()</code> that automatically configures this worker resolution route.
        </p>
        <p className="mt-2 text-zinc-300 leading-relaxed">
          Call this helper <strong className="text-zinc-200">once</strong> at the absolute entry point of your application before any component mounts.
        </p>
        <div className="mt-4">
          <CodeBlock code={workerCode} language="tsx" />
        </div>

        <h4 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">Integrating with Next.js (App Router)</h4>
        <p className="text-zinc-300 mb-3 leading-relaxed">
          In Next.js, Web Worker setup needs to run client-side. You can create a simple initialization component to load the worker safely in client environments:
        </p>
        <CodeBlock code={nextjsWorkerCode} language="tsx" />
      </DocSection>

      <DocSection id="styles" title="Importing Styles">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The file viewer provides a comprehensive, pre-compiled theme. Import the core CSS bundle into your global styles or entry layout file to inherit all layout systems, animations, tooltips, and default colors.
        </p>
        <CodeBlock code={cssCode} language="tsx" />
        <p className="mt-3 text-sm text-zinc-500 italic">
          Tip: You can customize all spacing, sizes, and colors of this style layer by overriding standard Tailwind CSS or raw CSS variables detailed in the Styling pages.
        </p>
      </DocSection>

      <DocSection id="minimal-example" title="Your First Previewer">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Now, you can import and mount the component. Below is a minimal setup using <code className="text-zinc-100 font-mono">mode="modal"</code>. When opened, it mounts a screen-sized responsive modal layer with built-in action headers, escape keys, and close commands.
        </p>
        <CodeBlock code={minimalCode} language="tsx" />

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">Live Interactive Demo</h4>
          <InlineFileViewerDemo
            fileViewerProps={{
              name: SAMPLE_NAMES.multipagePdf,
              extension: 'pdf',
              url: SAMPLES.multipagePdf,
            }}
          />
        </div>
      </DocSection>

      <DocSection id="essential-props" title="Essential Props Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These are the essential props you must supply to get a functional preview of a single document or image.
        </p>
        <PropTable rows={firstStepsProps} />
      </DocSection>
    </DocPage>
  )
}
