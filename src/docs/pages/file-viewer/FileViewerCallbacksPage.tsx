import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const analyticsTrackingCode = `import { FileViewer } from '@fdls/file-viewer'
import { trackAnalyticsEvent } from '@/services/analytics'

export function AuditedFileViewer() {
  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="highly-confidential-brief.pdf"
      extension="pdf"
      url="https://secure-vault.com/brief.pdf"
      // Fire analytics and audit logs on download intent
      onDownload={() => {
        trackAnalyticsEvent('CONFIDENTIAL_FILE_DOWNLOADED', {
          fileName: 'confidential-brief.pdf',
          fileType: 'pdf',
          userRole: 'Administrator',
          timestamp: new Date().toISOString(),
        })
        
        // Retain normal downloading flow
        window.open('https://secure-vault.com/brief.pdf', '_blank')
      }}
    />
  )
}`

const secureUrlCode = `import { FileViewer } from '@fdls/file-viewer'
import { fetchSignedUrlFromS3 } from '@/services/aws-s3'

export function ProtectedS3Viewer() {
  const handleDownload = async () => {
    // 1. Fetch fresh authenticated download link
    const secureDownloadUrl = await fetchSignedUrlFromS3({
      bucket: 'user-uploads',
      key: 'financial_records.pdf',
      expiresInSeconds: 60
    })
    
    // 2. Trigger browser download anchor safely
    const anchor = document.createElement('a')
    anchor.href = secureDownloadUrl
    anchor.download = 'financial_records.pdf'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="financial_records.pdf"
      extension="pdf"
      url="https://user-uploads.s3.amazonaws.com/financial_records.pdf"
      onDownload={handleDownload}
    />
  )
}`

const routerFullscreenCode = `import { useNavigate } from 'react-router-dom'
import { FileViewer } from '@fdls/file-viewer'

export function RouterDrivenViewer() {
  const navigate = useNavigate()

  return (
    <FileViewer
      mode="inline"
      open={true}
      onOpenChange={() => {}}
      name="presentation.pdf"
      extension="pdf"
      url="/files/presentation.pdf"
      // Intercept fullscreen click to transition to a dedicated full-bleed route
      onFullscreen={() => {
        navigate('/document-focus/presentation-pdf')
      }}
    />
  )
}`

const callbacksPropList = [
  {
    name: 'onDownload',
    type: '() => void | Promise<void>',
    defaultValue: 'undefined',
    description: 'Callback executed when clicking the download trigger. Overrides built-in browser downloading behavior completely.',
  },
  {
    name: 'onFullscreen',
    type: '() => void',
    defaultValue: 'undefined',
    description: 'Callback executed when clicking the fullscreen trigger in inline layouts. Bypasses the default temporary modal overlay expansion.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    defaultValue: 'undefined',
    description: 'Fired when the user closes the modal dialog or explicitly clicks on the inline close button.',
  },
]

export function FileViewerCallbacksPage() {
  return (
    <DocPage
      title="FileViewer Callbacks"
      description="Integrate analytics, coordinate secure download tokens, route application expansions, and log file audit events."
    >
      <DocSection id="overview" title="The Auditing & Tracking Purpose">
        <p className="text-zinc-300 leading-relaxed">
          In large enterprise apps, document consumption triggers often require strict auditing for <strong className="text-zinc-100">SOX, HIPAA, GDPR, or security compliance</strong>. It is not enough to open files in tabs; developers must log exactly when, and by whom, a document was previewed, printed, or exported.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">FileViewer</code> callbacks pipeline gives you first-class hooks to intercept actions before they occur, let your security modules run, write to audit databases, and then delegate execution.
        </p>
      </DocSection>

      <DocSection id="on-download" title="Intercepting Downloads (Analytics & Logs)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use the <code className="text-emerald-400 font-mono">onDownload</code> callback to capture export events. In the example below, clicking download triggers a mock GA/Mixpanel event alongside normal download flow:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            onDownload: () => {
              window.alert('[Audit Log]: GA Event CONFIDENTIAL_FILE_DOWNLOADED dispatched successfully!')
            },
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={analyticsTrackingCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="secure-downloads" title="Dynamic Token Tokenization (AWS S3)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          When downloading files hosted in secure private object stores, the download links often expire quickly. Wire <code className="text-emerald-400 font-mono">onDownload</code> with an asynchronous function to fetch fresh authenticated download tokens before executing:
        </p>
        <CodeBlock code={secureUrlCode} language="tsx" />
      </DocSection>

      <DocSection id="on-fullscreen" title="Route-Driven Fullscreen Scaling">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In complex web apps (like Jira or ClickUp), expanding a card should update the browser URL search parameters or push state to the router history. Intercept fullscreen intents to navigate routes cleanly:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            onFullscreen: () => {
              window.alert('[Router]: Navigating to focus router state: /document-focus/multipage-pdf')
            },
          }}
          heightClass="h-72"
        />

        <div className="mt-4">
          <CodeBlock code={routerFullscreenCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="unsupported" title="Custom fallback widgets">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For unrecognized extensions (e.g. <code className="text-zinc-100 font-mono">.zip</code>), you can render a full-surface custom widget via the <code className="text-emerald-400 font-mono">renderUnsupported</code> prop, displaying descriptive instructions or custom unpack links:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            name: 'corporate_assets_2026.zip',
            extension: 'zip',
            url: SAMPLES.multipagePdf,
            renderUnsupported: (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-zinc-900/40">
                <span className="text-3xl mb-2">📦</span>
                <p className="text-sm font-semibold text-zinc-300">File is Compressed (.ZIP)</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  We cannot extract and preview archives inline. Click the header download button to unpack locally.
                </p>
              </div>
            ),
          }}
          heightClass="h-72"
        />
      </DocSection>

      <DocSection id="callbacks-reference" title="Callbacks Props Reference">
        <PropTable rows={callbacksPropList} />
      </DocSection>
    </DocPage>
  )
}
