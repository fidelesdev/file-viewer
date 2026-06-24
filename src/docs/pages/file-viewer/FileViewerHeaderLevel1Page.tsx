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

export function FileViewerHeaderLevel1Page() {
  return (
    <DocPage
      title="Header — Level 1"
      description="Toggle built-in header actions and style slots with classNames / styles."
    >
      <DocSection id="show-fullscreen" title="showFullscreenButton">
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, showFullscreenButton: true }}
          label="Fullscreen button visible (inline)"
        />
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, showFullscreenButton: false }}
          label="Fullscreen button hidden"
        />
      </DocSection>

      <DocSection id="show-print" title="showPrintButton">
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, showPrintButton: false }}
          label="Print hidden"
        />
      </DocSection>

      <DocSection id="show-download" title="showDownloadButton">
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, showDownloadButton: false }}
          label="Download hidden"
        />
      </DocSection>

      <DocSection id="header-slots" title="Header classNames">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            classNames: {
              header: 'ring-2 ring-emerald-500/40',
              headerTitle: 'text-emerald-300',
              printButton: 'opacity-100',
            },
          }}
        />
        <CodeBlock
          code={`classNames={{
  header: 'ring-2 ring-emerald-500/40',
  headerTitle: 'text-emerald-300',
  fullscreenButton: '...',
  printButton: '...',
  downloadButton: '...',
}}`}
        />
      </DocSection>
    </DocPage>
  )
}
