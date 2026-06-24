import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerViewModesPage() {
  return (
    <DocPage
      title="PdfViewer view modes"
      description="continuous scrolls all pages; single shows one page at a time."
    >
      <DocSection id="continuous" title="viewMode: continuous (default)">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} viewMode="continuous" />
        </LiveDemo>
      </DocSection>

      <DocSection id="single" title="viewMode: single">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} viewMode="single" />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
