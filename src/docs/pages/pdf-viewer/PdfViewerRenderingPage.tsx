import { LoaderCircle } from '@/features/file-viewer/components/icons'
import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerRenderingPage() {
  return (
    <DocPage
      title="PdfViewer rendering"
      description="Control text layer, annotation layer, and custom loading UI."
    >
      <DocSection id="no-text-layer" title="renderTextLayer: false">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} renderTextLayer={false} />
        </LiveDemo>
      </DocSection>

      <DocSection id="no-annotations" title="renderAnnotationLayer: false">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderAnnotationLayer={false}
          />
        </LiveDemo>
      </DocSection>

      <DocSection id="custom-loading" title="renderLoading">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderLoading={
              <div className="flex h-full items-center justify-center gap-2 text-zinc-400">
                <LoaderCircle className="fv-icon fv-icon--spin" />
                Loading PDF…
              </div>
            }
          />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
