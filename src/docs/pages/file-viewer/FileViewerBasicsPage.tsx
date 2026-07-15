import { useState } from 'react'
import { FileViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const lazyExplanationCode = `// Internally, FileViewer optimizes your bundle size using React.lazy:
const LazyPdfViewer = lazy(() => import('./PdfViewer'))
const LazyImageViewer = lazy(() => import('./ImageViewer'))

// It mounts them inside <Suspense> fallback components to prevent
// heavy PDF parser libraries from bloating your main JavaScript chunk.`

const basicStateCode = `import { useState } from 'react'
import { FileViewer } from '@fdls/file-viewer'

export function ControlledViewer() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button onClick={() => setOpen(true)} className="px-3 py-1 bg-zinc-800 text-white rounded">
          Open Preview
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-1 bg-zinc-800 text-white rounded">
          Hide Preview
        </button>
      </div>

      <FileViewer
        mode="inline"
        open={open}
        onOpenChange={setOpen}
        name="documentation-sample.pdf"
        extension="pdf"
        url="https://example.com/sample.pdf"
      />
    </div>
  )
}`

const unsupportedCode = `const customFallback = (
  <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
    <div className="text-4xl mb-2">📁</div>
    <h5 className="font-semibold text-zinc-200">Visualização Indisponível</h5>
    <p className="text-zinc-500 text-sm mt-1 mb-4">
      Não conseguimos pré-visualizar arquivos deste formato no navegador.
    </p>
    <a
      href="https://example.com/files/document.xlsx"
      download
      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition"
    >
      Baixar Planilha Excel
    </a>
  </div>
)

return (
  <FileViewer
    open={open}
    onOpenChange={setOpen}
    name="folha_de_pagamento.xlsx"
    extension="xlsx"
    url="https://example.com/files/document.xlsx"
    renderUnsupported={customFallback}
  />
)`

const propsList = [
  {
    name: 'open',
    type: 'boolean',
    defaultValue: '—',
    description: 'Whether the file viewer is visible. Fully controlled prop.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    defaultValue: '—',
    description: 'Callback executed whenever the viewer triggers a close intent.',
  },
  {
    name: 'name',
    type: 'string',
    defaultValue: '—',
    description: 'Displays as the document title on the top bar.',
  },
  {
    name: 'extension',
    type: 'string',
    defaultValue: '—',
    description: 'The file extension. Drives the routing logic between PDF or image preview systems.',
  },
  {
    name: 'url',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Direct file URL. Preloads and binds to download or print actions.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Triggers a full-surface loading spinner overlay when files are being downloaded by external mechanisms.',
  },
  {
    name: 'renderUnsupported',
    type: 'ReactNode',
    defaultValue: 'undefined',
    description: 'Custom element mounted when the specified extension is not supported natively.',
  },
]

export function FileViewerBasicsPage() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <DocPage
      title="FileViewer Basics"
      description="Understand the core architecture of the shell document viewer, the controlled state pattern, lazy bundles, and loading states."
    >
      <DocSection id="architecture" title="Shell Component Pattern">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">FileViewer</code> is designed using the <strong className="text-zinc-200">Shell Orchestration Pattern</strong>. Rather than bundling heavy parser libraries directly, it acts as a layout container containing a top bar, a download/print controller, and a viewport area.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          When the file URL is resolved, the shell inspects the file extension to dynamically load the specific sub-viewer (e.g., <code className="text-zinc-100 font-mono">PdfViewer</code> or <code className="text-zinc-100 font-mono">ImageViewer</code>) asynchronously. This prevents heavy PDF libraries like <code className="text-zinc-300 font-mono">pdfjs-dist</code> from inflating your application's initial bundle size if the user is only previewing JPEG files.
        </p>
        <div className="mt-4">
          <CodeBlock code={lazyExplanationCode} language="typescript" />
        </div>
      </DocSection>

      <DocSection id="controlled-state" title="Controlled State">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The viewer relies on a fully-controlled state contract via <code className="text-emerald-400 font-mono">open</code> and <code className="text-emerald-400 font-mono">onOpenChange</code>. This allows full synchronization with parent states (like selecting files from table rows, managing drawer sliders, or closing visualizers on page transitions).
        </p>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700 font-medium transition"
          >
            Mount / Open Viewer
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700 font-medium transition"
          >
            Unmount / Close Viewer
          </button>
        </div>

        <LiveDemo label="Live Interactive Control Demo">
          <FileViewer
            mode="inline"
            open={open}
            onOpenChange={setOpen}
            name={SAMPLE_NAMES.multipagePdf}
            extension="pdf"
            url={SAMPLES.multipagePdf}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={basicStateCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="metadata" title="File Routing and Metadata">
        <p className="text-zinc-300 leading-relaxed">
          The routing behavior is determined entirely by the <code className="text-emerald-400 font-mono">extension</code> prop. Valid extensions include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-zinc-400">
          <li><strong className="text-zinc-200">pdf:</strong> Triggers the multi-page, Continuous Scroll PDF canvas.</li>
          <li><strong className="text-zinc-200">png, jpg, jpeg:</strong> Triggers the high-performance hardware-accelerated image zooming & panning engine.</li>
        </ul>

        <p className="mt-4 text-zinc-300 mb-4 leading-relaxed">
          Below is an example of an image format resolved through the same unified <code className="text-zinc-100 font-mono">&lt;FileViewer /&gt;</code> interface:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            name: SAMPLE_NAMES.photoJpg,
            extension: 'jpg',
            url: SAMPLES.photoJpg,
          }}
        />
      </DocSection>

      <DocSection id="fallback" title="Fallback for Unsupported Formats">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For unrecognized extensions (e.g., <code className="text-zinc-100 font-mono">xlsx</code>, <code className="text-zinc-100 font-mono">docx</code>, <code className="text-zinc-100 font-mono">zip</code>), you can provide a custom interface via the <code className="text-emerald-400 font-mono">renderUnsupported</code> prop to let users download the raw asset.
        </p>
        <CodeBlock code={unsupportedCode} language="tsx" />
      </DocSection>

      <DocSection id="is-loading" title="Orchestrating Loading Overlays">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          When downloading large documents or fetching resources from secured cloud storage (like AWS S3 or Google Cloud Storage signed URLs), set the <code className="text-emerald-400 font-mono">isLoading</code> prop. This displays an elegant loading spinner overlay over the preview pane, disabling download and print headers to prevent race conditions.
        </p>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setLoading((current) => !current)}
            className="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500 transition font-medium"
          >
            Toggle isLoading ({loading ? 'ON' : 'OFF'})
          </button>
        </div>

        <InlineFileViewerDemo
          fileViewerProps={{
            name: SAMPLE_NAMES.multipagePdf,
            extension: 'pdf',
            url: SAMPLES.multipagePdf,
            isLoading: loading,
          }}
        />
      </DocSection>

      <DocSection id="basic-props" title="Props Reference (State & Metadata)">
        <PropTable rows={propsList} />
      </DocSection>
    </DocPage>
  )
}
