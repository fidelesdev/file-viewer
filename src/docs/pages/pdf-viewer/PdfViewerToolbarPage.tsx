import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerToolbarPage() {
  return (
    <DocPage
      title="PdfViewer toolbar"
      description="Toolbar customization on standalone PdfViewer (same 3-level API)."
    >
      <DocSection id="level-2" title="extraToolbarActions">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            extraToolbarActions={({ zoomReset }) => (
              <button
                type="button"
                onClick={zoomReset}
                className="text-xs text-emerald-400"
              >
                Reset
              </button>
            )}
            extraToolbarActionsSide="left"
          />
        </LiveDemo>
      </DocSection>

      <DocSection id="level-3" title="renderToolbarActions">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderToolbarActions={({ defaultActions, viewMode }) => (
              <>
                <span className="text-xs uppercase text-zinc-500">{viewMode}</span>
                {defaultActions}
              </>
            )}
          />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
