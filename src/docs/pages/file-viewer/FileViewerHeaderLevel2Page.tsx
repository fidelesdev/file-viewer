import {
  FileViewerTooltip,
} from '@/features/file-viewer'
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

function ShareButton() {
  return (
    <FileViewerTooltip content="Share this file">
      <button
        type="button"
        className="rounded px-2 py-1 text-xs text-emerald-400 ring-1 ring-emerald-500/50"
        aria-label="Share"
      >
        Share
      </button>
    </FileViewerTooltip>
  )
}

export function FileViewerHeaderLevel2Page() {
  return (
    <DocPage
      title="Header — Level 2"
      description="extraHeaderActions appends custom actions beside built-in controls."
    >
      <DocSection id="extra-right" title="extraHeaderActions (default right)">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: <ShareButton />,
          }}
        />
        <CodeBlock code={`<FileViewer extraHeaderActions={<ShareButton />} ... />`} />
      </DocSection>

      <DocSection id="extra-left" title="extraHeaderActionsSide: left">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: <ShareButton />,
            extraHeaderActionsSide: 'left',
          }}
        />
      </DocSection>

      <DocSection id="extra-render-fn" title="extraHeaderActions as render function">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: ({ download, isDownloading }) => (
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => void download()}
                className="rounded px-2 py-1 text-xs text-zinc-300 ring-1 ring-zinc-600"
              >
                {isDownloading ? 'Saving…' : 'Quick save'}
              </button>
            ),
          }}
        />
        <CodeBlock
          code={`extraHeaderActions={({ download, isDownloading }) => (
  <button onClick={() => download()} disabled={isDownloading}>
    Quick save
  </button>
)}`}
        />
      </DocSection>

      <DocSection id="wrapper-slots" title="headerActionsBuiltins / headerActionsExtra">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: <ShareButton />,
            classNames: {
              headerActionsExtra: 'order-first mr-2',
              headerActionsBuiltins: 'ml-auto',
            },
          }}
        />
      </DocSection>
    </DocPage>
  )
}
