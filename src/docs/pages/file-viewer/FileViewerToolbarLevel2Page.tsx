import type {
  ImageToolbarActionsContext,
  PdfToolbarActionsContext,
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

const passThroughCode = `<FileViewer
  {...props}
  // This prop automatically intercepts the file type and passes
  // appropriate controls to the active viewer's toolbar!
  extraToolbarActions={(context) => {
    // If the active viewer is a PDF:
    if ('pageNumber' in context) {
      return (
        <button onClick={() => context.goToPage(1)} className="text-xs text-emerald-400">
          Reset Page
        </button>
      )
    }
    
    // If the active viewer is an Image:
    return (
      <button onClick={context.resetTransform} className="text-xs text-amber-400">
        Reset Zoom
      </button>
    )
  }}
/>`

const pdfExampleCode = `<FileViewer
  open={open}
  onOpenChange={setOpen}
  name="brochure.pdf"
  extension="pdf"
  url="/brochure.pdf"
  extraToolbarActionsSide="left" // places custom button on the left of default zoom controls
  extraToolbarActions={({ goToPage, pageNumber, numPages }: PdfToolbarActionsContext) => (
    <button
      onClick={() => goToPage(Math.min(pageNumber + 1, numPages))}
      className="px-2.5 py-1 bg-zinc-800 text-xs text-zinc-100 rounded hover:bg-zinc-700 font-medium transition"
    >
      Next Page →
    </button>
  )}
/>`

const imageExampleCode = `<FileViewer
  open={open}
  onOpenChange={setOpen}
  name="landscape.png"
  extension="png"
  url="/landscape.png"
  extraToolbarActions={({ scale, resetTransform }: ImageToolbarActionsContext) => (
    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
      <span>Scale: {Math.round(scale * 100)}%</span>
      <button
        onClick={resetTransform}
        className="text-emerald-400 hover:text-emerald-300 transition underline"
      >
        Reset View
      </button>
    </div>
  )}
/>`

const level2ToolbarProps = [
  {
    name: 'extraToolbarActions',
    type: 'ReactNode | ((context: PdfToolbarActionsContext | ImageToolbarActionsContext) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Custom ReactNode or callback function injected beside default pagination and zoom icons.',
  },
  {
    name: 'extraToolbarActionsSide',
    type: '"left" | "right"',
    defaultValue: '"right"',
    description: 'Dictates whether the custom button cluster is placed on the left or right side of the built-in control elements.',
  },
]

const pdfContextRef = [
  { name: 'pageNumber', type: 'number', description: 'The current active page number (1-indexed).' },
  { name: 'numPages', type: 'number', description: 'The total loaded pages of the PDF file.' },
  { name: 'viewMode', type: '"single" | "continuous"', description: 'The current PDF rendering display layout.' },
  { name: 'isFirstPage', type: 'boolean', description: 'True when the user is on page 1.' },
  { name: 'isLastPage', type: 'boolean', description: 'True when pageNumber matches numPages.' },
  { name: 'previousPage', type: '() => void', description: 'Triggers navigation to the preceding page index.' },
  { name: 'nextPage', type: '() => void', description: 'Triggers navigation to the subsequent page index.' },
  { name: 'goToPage', type: '(page: number) => void', description: 'Pre-wired method to slide smoothly to any target page.' },
  { name: 'zoomIn', type: '() => void', description: 'Increments the PDF zoom step by 1.3x (capped at 4x).' },
  { name: 'zoomOut', type: '() => void', description: 'Decrements the PDF zoom step by 1.3x (capped at 0.5x).' },
  { name: 'zoomReset', type: '() => void', description: 'Snaps the PDF view width back to fit-to-screen (100%).' },
]

const imageContextRef = [
  { name: 'scale', type: 'number', description: 'The current float scale multiplier of the image canvas.' },
  { name: 'zoomIn', type: '() => void', description: 'Triggers multiplicative zoom increment.' },
  { name: 'zoomOut', type: '() => void', description: 'Triggers multiplicative zoom decrement.' },
  { name: 'resetTransform', type: '() => void', description: 'Flattens image zoom scale and repositions coordinates to center.' },
]

export function FileViewerToolbarLevel2Page() {
  return (
    <DocPage
      title="Toolbar — Level 2"
      description="Extend the toolbar: append or prepend custom controls directly inside the floating toolbar widget using reactive viewer context handlers."
    >
      <DocSection id="overview" title="The Pass-Through Architecture">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">extraToolbarActions</code> feature utilizes a unified <strong className="text-zinc-100">Pass-Through Delegation model</strong>. Rather than forcing you to configure separate buttons on individual PDF or Image visualizer instances, you declare them once on the parent <code className="text-zinc-100 font-mono">&lt;FileViewer /&gt;</code> shell.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The shell detects the file format and delegates these actions to the active sub-viewer. If you pass a callback function, the active viewer invokes it and injects its own specific context object, enabling rich document and viewport integrations.
        </p>
        <div className="mt-4">
          <CodeBlock code={passThroughCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="pdf-extra" title="PDF Toolbar Extension">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          When rendering a PDF, the callback receives a rich <code className="text-emerald-400 font-mono">PdfToolbarActionsContext</code> containing pagination variables and zoom multipliers. Below, we prepend a quick "Jump to Page" control:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...pdfBase,
            extraToolbarActionsSide: 'left',
            extraToolbarActions: ({ goToPage, pageNumber, numPages }: PdfToolbarActionsContext) => (
              <button
                type="button"
                onClick={() => goToPage(Math.min(pageNumber + 1, numPages))}
                className="rounded px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-800 ring-1 ring-zinc-700 transition font-medium"
              >
                Skip Page →
              </button>
            ),
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={pdfExampleCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="image-extra" title="Image Toolbar Extension">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For images, the callback is injected with the <code className="text-emerald-400 font-mono">ImageToolbarActionsContext</code> containing pan and zoom transform parameters. Below, we append an interactive real-time scale display with a click-to-reset link:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...imageBase,
            extraToolbarActions: ({ scale, resetTransform }: ImageToolbarActionsContext) => (
              <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5 px-2">
                Zoom: {Math.round(scale * 100)}%
                <button
                  type="button"
                  onClick={resetTransform}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition underline"
                >
                  Fit Screen
                </button>
              </span>
            ),
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={imageExampleCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (Level 2 Extension)">
        <PropTable rows={level2ToolbarProps} />
      </DocSection>

      <DocSection id="pdf-context-ref" title="PDF Context Reference (PdfToolbarActionsContext)">
        <PropTable rows={pdfContextRef} />
      </DocSection>

      <DocSection id="image-context-ref" title="Image Context Reference (ImageToolbarActionsContext)">
        <PropTable rows={imageContextRef} />
      </DocSection>
    </DocPage>
  )
}
