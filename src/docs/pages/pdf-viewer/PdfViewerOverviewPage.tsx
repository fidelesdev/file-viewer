import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const standaloneCode = `import { PdfViewer } from '@fdls/file-viewer'

export function StandalonePdf() {
  return (
    <div className="w-full h-[500px] border border-zinc-800 rounded-lg overflow-hidden">
      <PdfViewer
        url="https://example.com/assets/whitepaper.pdf"
        viewMode="continuous"
        renderTextLayer={true}
        renderAnnotationLayer={true}
        onLoadSuccess={(numPages) => console.log(\`PDF loaded with \${numPages} pages.\`)}
      />
    </div>
  )
}`

const standalonePropsList = [
  {
    name: 'url',
    type: 'string',
    defaultValue: '—',
    description: 'The direct source URL of the PDF document. Required.',
  },
  {
    name: 'viewMode',
    type: '"single" | "continuous"',
    defaultValue: '"continuous"',
    description: 'The scroll display format. "continuous" binds continuous vertical scroll pages. "single" renders one isolated page at a time.',
  },
  {
    name: 'debounceDelay',
    type: 'number',
    defaultValue: '300',
    description: 'Debounce delay (ms) for resizing calculations when the container width undergoes resizing transitions.',
  },
  {
    name: 'zoomDebounceDelay',
    type: 'number',
    defaultValue: '500',
    description: 'Debounce delay (ms) before re-rendering the high-definition canvas after a zoom event is completed.',
  },
  {
    name: 'renderTextLayer',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables text selection layers over the canvas, letting users select, search, and copy text directly.',
  },
  {
    name: 'renderAnnotationLayer',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables interactive PDF annotations, rendering clickable hyperlinks, table of contents links, and document forms.',
  },
]

export function PdfViewerOverviewPage() {
  return (
    <DocPage
      title="PdfViewer Overview"
      description="Standalone PDF Canvas Viewer: render, zoom, copy text, and click hyperlinks in PDF documents without relying on the outer FileViewer shell."
    >
      <DocSection id="concept" title="Standalone PDF Rendering Engine">
        <p className="text-zinc-300 leading-relaxed">
          While <code className="text-zinc-100 font-mono">&lt;FileViewer /&gt;</code> provides a comprehensive shell equipped with title headers, closing portal triggers, and print managers, you can mount the underlying <code className="text-emerald-400 font-mono">PdfViewer</code> completely standalone.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          This standalone configuration is the ideal solution for building inline document readers, terms-of-service checkers, slide-decks visualizers, or inline reporting dashboards. It is powered by <strong className="text-zinc-100">react-pdf (Mozilla PDF.js engine)</strong> and runs completely isolated in your designated layout column.
        </p>
      </DocSection>

      <DocSection id="minimal" title="Minimal Standalone Usage">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Simply supply a valid <code className="text-emerald-400 font-mono">url</code>. The component automatically measures its container, preloads the document web worker, and renders the continuous page list with floating zoom and pagination tools:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Standalone PdfViewer Instance">
          <PdfViewer url={SAMPLES.multipagePdf} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={standaloneCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (Core PdfViewer)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These core properties can be passed directly to standalone <code className="text-zinc-100 font-mono">&lt;PdfViewer /&gt;</code> elements or through the <code className="text-zinc-100 font-mono">pdfViewerProps</code> configuration mapping on the parent shell:
        </p>
        <PropTable rows={standalonePropsList} />
      </DocSection>
    </DocPage>
  )
}
