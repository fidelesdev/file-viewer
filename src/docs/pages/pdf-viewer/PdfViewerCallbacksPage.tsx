import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { EventLogPanel, useEventLog } from '../../components/EventLog'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerCallbacksPage() {
  const { entries, log, clear } = useEventLog()

  return (
    <DocPage
      title="PdfViewer callbacks"
      description="onLoadSuccess, onLoadError, and onPageChange with live event log."
    >
      <DocSection id="callbacks" title="Event handlers">
        <EventLogPanel entries={entries} onClear={clear} />
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            onLoadSuccess={(numPages) => log(`onLoadSuccess: ${numPages} pages`)}
            onLoadError={(error) => log(`onLoadError: ${error.message}`)}
            onPageChange={(page) => log(`onPageChange: page ${page}`)}
          />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
