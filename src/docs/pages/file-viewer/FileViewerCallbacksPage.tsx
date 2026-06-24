import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

export function FileViewerCallbacksPage() {
  return (
    <DocPage
      title="FileViewer callbacks"
      description="Custom download, fullscreen handler, and unsupported file fallback."
    >
      <DocSection id="on-download" title="onDownload">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            onDownload: () => {
              window.alert('Custom download handler invoked')
            },
          }}
        />
        <CodeBlock code={`onDownload={() => { /* custom logic */ }}`} />
      </DocSection>

      <DocSection id="on-fullscreen" title="onFullscreen">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            onFullscreen: () => {
              window.alert('Custom fullscreen — e.g. open your own route')
            },
          }}
        />
      </DocSection>

      <DocSection id="render-unsupported" title="renderUnsupported">
        <InlineFileViewerDemo
          fileViewerProps={{
            name: 'archive.zip',
            extension: 'zip',
            url: SAMPLES.multipagePdf,
            renderUnsupported: (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Custom unsupported UI for .zip files
              </div>
            ),
          }}
        />
      </DocSection>
    </DocPage>
  )
}
