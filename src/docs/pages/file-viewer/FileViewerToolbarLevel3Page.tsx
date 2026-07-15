import type {
  ImageToolbarActionsRenderProps,
  PdfToolbarActionsRenderProps,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const pdfBase = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const imageBase = {
  name: SAMPLE_NAMES.photoJpg,
  extension: 'jpg',
  url: SAMPLES.photoJpg,
} as const

const recomposePdfCode = `<FileViewer
  {...props}
  renderToolbarActions={({
    defaultActions,
    pageNumber,
    numPages,
  }: PdfToolbarActionsRenderProps) => (
    <>
      {/* Prepend a custom page indicator block before default controls */}
      <span className="text-xs text-zinc-400 font-semibold px-2 border-r border-zinc-800 mr-1 select-none">
        Page {pageNumber} of {numPages}
      </span>
      {/* Native back, forward, and zoom controls mapped here */}
      {defaultActions}
    </>
  )}
/>`

const flatImageCode = `<FileViewer
  {...props}
  // Completely overrides the default action cluster and renders
  // simple, customized, flat action tags instead
  renderToolbarActions={({
    scale,
    zoomIn,
    zoomOut,
    resetTransform,
  }: ImageToolbarActionsRenderProps) => (
    <div className="flex items-center gap-3 px-2 py-1 text-xs">
      <button onClick={zoomOut} className="text-zinc-400 hover:text-white transition font-bold text-sm">
        −
      </button>
      <span className="font-mono text-zinc-300 font-semibold">{Math.round(scale * 100)}%</span>
      <button onClick={zoomIn} className="text-zinc-400 hover:text-white transition font-bold text-sm">
        +
      </button>
      <div className="h-3 w-[1px] bg-zinc-800" />
      <button onClick={resetTransform} className="text-emerald-400 hover:text-emerald-300 font-medium transition">
        Recenter
      </button>
    </div>
  )}
/>`

const level3ToolbarProps = [
  {
    name: 'renderToolbarActions',
    type: '((props: PdfToolbarActionsRenderProps) => ReactNode) | ((props: ImageToolbarActionsRenderProps) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Bypasses the default floating toolbar action assembly. Supplies pre-wired defaultActions alongside control context methods.',
  },
]

const pdfRenderPropsRef = [
  { name: 'defaultActions', type: 'ReactNode', description: 'A pre-built cluster containing default PDF pagination arrows, page inputs, zoom controls, and separators.' },
  { name: 'pageNumber', type: 'number', description: 'The current active page (1-indexed).' },
  { name: 'numPages', type: 'number', description: 'The total loaded pages of the PDF file.' },
  { name: 'viewMode', type: '"single" | "continuous"', description: 'The active display layout of the canvas.' },
  { name: 'isFirstPage', type: 'boolean', description: 'True on page 1.' },
  { name: 'isLastPage', type: 'boolean', description: 'True on the final page.' },
  { name: 'previousPage', type: '() => void', description: 'Trigger to scroll/paginate to the previous page.' },
  { name: 'nextPage', type: '() => void', description: 'Trigger to scroll/paginate to the next page.' },
  { name: 'goToPage', type: '(page: number) => void', description: 'Callback to navigate immediately to any target page.' },
  { name: 'zoomIn', type: '() => void', description: 'Method to increment PDF zoom scale.' },
  { name: 'zoomOut', type: '() => void', description: 'Method to decrement PDF zoom scale.' },
  { name: 'zoomReset', type: '() => void', description: 'Method to restore fit-to-width layout zoom.' },
]

const imageRenderPropsRef = [
  { name: 'defaultActions', type: 'ReactNode', description: 'A pre-built cluster containing default Image zoom scale text labels, divider lines, and zoom controls.' },
  { name: 'scale', type: 'number', description: 'The current image scale multiplier (float).' },
  { name: 'zoomIn', type: '() => void', description: 'Trigger to increment scale factor.' },
  { name: 'zoomOut', type: '() => void', description: 'Trigger to decrement scale factor.' },
  { name: 'resetTransform', type: '() => void', description: 'Snaps image coordinates and scale back to natural bounds.' },
]

export function FileViewerToolbarLevel3Page() {
  return (
    <DocPage
      title="Toolbar — Level 3"
      description="Compose the toolbar: completely rewrite, structure, and assemble the floating action toolbar, or selectively recompose with built-in action chunks."
    >
      <DocSection id="overview" title="Level 3 Concept: Composition & Overwrite">
        <p className="text-zinc-300 leading-relaxed">
          The <strong className="text-zinc-100">Level 3 Customization</strong> gives you absolute structural freedom over the floating toolbar. If you want to bypass the default layout, icons, input boxes, or divider elements and design a custom, branded control panel, Level 3 is the perfect tool.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Just like the Level 3 Header API, you can <strong className="text-emerald-400 font-medium">Recompose</strong> your custom toolbar by placing the pre-assembled <code className="text-zinc-100 font-mono">defaultActions</code> inside your layout wrapper, or discard it entirely and wire custom buttons to the provided callbacks.
        </p>
      </DocSection>

      <DocSection id="recompose-pdf" title="PDF Toolbar Recomposition">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          By referencing the <code className="text-zinc-100 font-mono">defaultActions</code> variable in your callback, you can inject descriptive labels, indicators, or category tags while preserving the fully responsive built-in page inputs and zoom arrows:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...pdfBase,
            renderToolbarActions: ({
              defaultActions,
              pageNumber,
              numPages,
            }: PdfToolbarActionsRenderProps) => (
              <>
                <span className="text-xs text-zinc-400 font-semibold px-2 border-r border-zinc-800 mr-1.5 select-none">
                  Page {pageNumber} of {numPages}
                </span>
                {defaultActions}
              </>
            ),
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={recomposePdfCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="custom-image" title="Designing custom Toolbar Layouts">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Alternatively, if you want a minimal toolbar without complex layouts (like using text characters instead of SVG icons, or centering a layout selector), draw your custom tags and bind click events to the injected viewport controllers:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...imageBase,
            renderToolbarActions: ({
              scale,
              zoomIn,
              zoomOut,
              resetTransform,
            }: ImageToolbarActionsRenderProps) => (
              <div className="flex items-center gap-3 px-2 py-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="text-zinc-400 hover:text-white transition text-sm font-bold"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="font-mono text-zinc-300">{Math.round(scale * 100)}%</span>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="text-zinc-400 hover:text-white transition text-sm font-bold"
                  aria-label="Zoom in"
                >
                  +
                </button>
                <div className="h-3.5 w-[1px] bg-zinc-800" />
                <button
                  type="button"
                  onClick={resetTransform}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  Recenter Image
                </button>
              </div>
            ),
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={flatImageCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level3-props" title="Props Reference (Level 3 Customization)">
        <PropTable rows={level3ToolbarProps} />
      </DocSection>

      <DocSection id="pdf-props-ref" title="PDF Render Callback Arguments">
        <PropTable rows={pdfRenderPropsRef} />
      </DocSection>

      <DocSection id="image-props-ref" title="Image Render Callback Arguments">
        <PropTable rows={imageRenderPropsRef} />
      </DocSection>
    </DocPage>
  )
}
