import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerPerformancePage() {
  return (
    <DocPage
      title="PdfViewer performance"
      description="Debounce and preload tuning for resize, zoom, and lazy page mounting."
    >
      <DocSection id="debounce" title="debounceDelay / zoomDebounceDelay">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            debounceDelay={600}
            zoomDebounceDelay={800}
          />
        </LiveDemo>
        <p className="text-sm text-zinc-500">
          Higher values reduce canvas re-renders during resize/zoom at the cost of
          sharperness delay.
        </p>
      </DocSection>

      <DocSection id="preload" title="preloadAhead">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} preloadAhead={2} />
        </LiveDemo>
        <p className="text-sm text-zinc-500">
          Pages mounted outside the viewport in continuous mode (default 1).
        </p>
      </DocSection>
    </DocPage>
  )
}
