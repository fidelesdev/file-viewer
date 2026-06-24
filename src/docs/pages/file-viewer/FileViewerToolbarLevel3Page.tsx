import type {
  ImageToolbarActionsRenderProps,
  PdfToolbarActionsRenderProps,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
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

export function FileViewerToolbarLevel3Page() {
  return (
    <DocPage
      title="Toolbar — Level 3"
      description="renderToolbarActions replaces the entire floating toolbar assembly. extraToolbarActions is ignored when set."
    >
      <DocSection id="compose-pdf" title="PDF — compose with defaultActions">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...pdfBase,
            renderToolbarActions: ({
              defaultActions,
              pageNumber,
              numPages,
            }: PdfToolbarActionsRenderProps) => (
              <>
                <span className="text-xs text-zinc-500">
                  Page {pageNumber}/{numPages}
                </span>
                {defaultActions}
              </>
            ),
          }}
        />
      </DocSection>

      <DocSection id="replace-image" title="Image — full replacement">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...imageBase,
            renderToolbarActions: ({
              scale,
              zoomIn,
              zoomOut,
              resetTransform,
            }: ImageToolbarActionsRenderProps) => (
              <div className="flex items-center gap-2 text-sm">
                <button type="button" onClick={zoomOut} aria-label="Zoom out">
                  −
                </button>
                <span>{Math.round(scale * 100)}%</span>
                <button type="button" onClick={zoomIn} aria-label="Zoom in">
                  +
                </button>
                <button type="button" onClick={resetTransform}>
                  Fit
                </button>
              </div>
            ),
          }}
        />
        <CodeBlock
          code={`renderToolbarActions={({ defaultActions, zoomIn }) => (
  <>
    {defaultActions}
    <MyButton onClick={zoomIn} />
  </>
)}`}
        />
      </DocSection>
    </DocPage>
  )
}
