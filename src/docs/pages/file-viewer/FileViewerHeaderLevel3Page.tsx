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

export function FileViewerHeaderLevel3Page() {
  return (
    <DocPage
      title="Header — Level 3"
      description="renderHeaderActions and renderCloseButton replace default assembly. When renderHeaderActions is set, extraHeaderActions is ignored."
    >
      <DocSection id="render-header" title="renderHeaderActions">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            renderHeaderActions: ({ defaultActions, name }) => (
              <>
                <span className="mr-auto truncate text-xs text-zinc-500">
                  Custom: {name}
                </span>
                {defaultActions}
              </>
            ),
          }}
        />
        <CodeBlock
          code={`renderHeaderActions={({ defaultActions, name }) => (
  <>
    <span>{name}</span>
    {defaultActions}
  </>
)}`}
        />
      </DocSection>

      <DocSection id="fullscreen-context" title="toggleFullscreen / isFullscreen">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            renderHeaderActions: ({
              defaultActions,
              isFullscreen,
              toggleFullscreen,
            }) => (
              <>
                {defaultActions}
                <FileViewerTooltip
                  content={isFullscreen ? 'Exit preview' : 'Enter preview'}
                >
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="text-xs text-emerald-400"
                  >
                    {isFullscreen ? 'Exit FS' : 'Enter FS'}
                  </button>
                </FileViewerTooltip>
              </>
            ),
          }}
        />
      </DocSection>

      <DocSection id="render-close" title="renderCloseButton">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            hideCloseButton: false,
            renderCloseButton: ({ defaultCloseButton }) => (
              <FileViewerTooltip content="Dismiss viewer">
                <span className="inline-flex">{defaultCloseButton}</span>
              </FileViewerTooltip>
            ),
          }}
        />
        <CodeBlock
          code={`renderCloseButton={({ defaultCloseButton, close, mode }) => (
  <Tooltip>{defaultCloseButton}</Tooltip>
)}`}
        />
      </DocSection>
    </DocPage>
  )
}
