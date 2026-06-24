import type {
  ImageToolbarActionsContext,
  PdfToolbarActionsContext,
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

export function FileViewerToolbarLevel2Page() {
  return (
    <DocPage
      title="Toolbar — Level 2"
      description="extraToolbarActions on FileViewer passes through to the active PDF or image viewer."
    >
      <DocSection id="pdf-extra-right" title="PDF — extraToolbarActions (right)">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...pdfBase,
            extraToolbarActions: ({ zoomIn }: PdfToolbarActionsContext) => (
              <button
                type="button"
                onClick={zoomIn}
                className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                aria-label="Custom zoom in"
              >
                +
              </button>
            ),
          }}
        />
      </DocSection>

      <DocSection id="pdf-extra-left" title="PDF — extraToolbarActionsSide: left">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...pdfBase,
            extraToolbarActionsSide: 'left',
            extraToolbarActions: ({
              goToPage,
              pageNumber,
            }: PdfToolbarActionsContext) => (
              <button
                type="button"
                onClick={() => goToPage(pageNumber + 1)}
                className="rounded px-2 py-1 text-xs ring-1 ring-zinc-600"
              >
                Next
              </button>
            ),
          }}
        />
      </DocSection>

      <DocSection id="image-extra" title="Image — extraToolbarActions">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...imageBase,
            extraToolbarActions: ({
              scale,
              resetTransform,
            }: ImageToolbarActionsContext) => (
              <span className="text-xs text-zinc-400">
                {Math.round(scale * 100)}%{' '}
                <button
                  type="button"
                  onClick={resetTransform}
                  className="ml-1 text-emerald-400"
                >
                  reset
                </button>
              </span>
            ),
          }}
        />
        <CodeBlock
          code={`<FileViewer
  extraToolbarActions={({ zoomIn }) => <button onClick={zoomIn}>+</button>}
  extraToolbarActionsSide="left"
/>`}
        />
      </DocSection>
    </DocPage>
  )
}
