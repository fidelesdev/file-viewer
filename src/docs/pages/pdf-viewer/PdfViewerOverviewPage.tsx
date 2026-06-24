import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerOverviewPage() {
  return (
    <DocPage
      title="PdfViewer overview"
      description="Standalone PDF viewer without the FileViewer shell."
    >
      <DocSection id="minimal" title="Minimal usage">
        <LiveDemo heightClass="h-[28rem]">
          <PdfViewer url={SAMPLES.multipagePdf} />
        </LiveDemo>
        <CodeBlock code={`<PdfViewer url="/samples/multipage.pdf" />`} />
      </DocSection>
    </DocPage>
  )
}
