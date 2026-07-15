import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { EventLogPanel, useEventLog } from '../../components/EventLog'
import { SAMPLES } from '../../demos/assets'

const metricsTrackingCode = `import { PdfViewer } from '@fdls/file-viewer'
import { saveUserReadProgress, logDocumentError } from '@/services/logging'

export function MonitoredPdfReader() {
  return (
    <PdfViewer
      url="https://secure-storage.com/annual-report.pdf"
      // 1. Log success and total page bounds
      onLoadSuccess={(numPages) => {
        console.log(\`Report parsed successfully. Total sheets: \${numPages}\`)
      }}
      // 2. Report S3/Network failures to logging servers
      onLoadError={(error) => {
        logDocumentError('ANNUAL_REPORT_FAIL', {
          errorMessage: error.message,
          timestamp: new Date().toISOString()
        })
      }}
      // 3. Track reading progress in real-time as users scroll
      onPageChange={(page) => {
        saveUserReadProgress('annual-report', {
          lastViewedPage: page,
          timestamp: new Date().toISOString()
        })
      }}
    />
  )
}`

const callbacksPropsRef = [
  {
    name: 'onLoadSuccess',
    type: '(numPages: number) => void',
    defaultValue: 'undefined',
    description: 'Callback fired once the Web Worker successfully parses and resolves the PDF document.',
  },
  {
    name: 'onLoadError',
    type: '(error: Error) => void',
    defaultValue: 'undefined',
    description: 'Callback fired if the network request fails, CORs validation is blocked, or the worker encounters file corruption.',
  },
  {
    name: 'onPageChange',
    type: '(pageNumber: number) => void',
    defaultValue: 'undefined',
    description: 'Callback executed whenever a new page gains majority visibility focus in the continuous viewport, or is explicitly selected.',
  },
]

export function PdfViewerCallbacksPage() {
  const { entries, log, clear } = useEventLog()

  return (
    <DocPage
      title="PdfViewer Callbacks"
      description="Connect PDF loaders to document metric systems: track reading progress, log worker exceptions, and execute database bookmark locks."
    >
      <DocSection id="overview" title="The Document Lifecycle Callback Pipeline">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">PdfViewer</code> lifecycle triggers precise events during worker preloading, sheet compiling, page scrolling, and error handling. Hooking into these callbacks is critical for tracking user engagement, ensuring compliance audit trails, and managing UI state (e.g. unlocking button forms once a user scrolls to the final page).
        </p>
      </DocSection>

      <DocSection id="callbacks" title="Live Event Handlers Demo">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Scroll through the document pages, change zoom levels, or paginate using the stepper inputs. The live log panel below records and timestamps each active event:
        </p>

        <div className="mb-4">
          <EventLogPanel entries={entries} onClear={clear} />
        </div>

        <LiveDemo heightClass="h-[30rem]" label="Interactive Callbacks Logger">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            onLoadSuccess={(numPages) => log(`onLoadSuccess: Compiled successfully with ${numPages} pages.`)}
            onLoadError={(error) => log(`onLoadError: Worker reported exception: "${error.message}"`)}
            onPageChange={(page) => log(`onPageChange: Reader focused on Page ${page}.`)}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={metricsTrackingCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="callbacks-ref" title="Props Reference (Event Callbacks)">
        <PropTable rows={callbacksPropsRef} />
      </DocSection>
    </DocPage>
  )
}
