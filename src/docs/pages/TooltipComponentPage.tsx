import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from '@/features/file-viewer'
import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { CodeBlock } from '../components/CodeBlock'

export function TooltipComponentPage() {
  return (
    <DocPage
      title="FileViewerTooltip"
      description="Public tooltip primitives for custom header and toolbar actions."
    >
      <DocSection id="usage" title="Basic usage">
        <FileViewerTooltipProvider>
          <div className="flex gap-4 rounded-lg border border-zinc-800 p-8">
            <FileViewerTooltip content="Primary action">
              <button
                type="button"
                className="rounded bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
              >
                Hover me
              </button>
            </FileViewerTooltip>
            <FileViewerTooltip content="Disabled" disabled>
              <button
                type="button"
                disabled
                className="rounded bg-zinc-800 px-4 py-2 text-sm opacity-50"
              >
                Disabled
              </button>
            </FileViewerTooltip>
          </div>
        </FileViewerTooltipProvider>
        <CodeBlock
          code={`<FileViewerTooltipProvider>
  <FileViewerTooltip content="Primary action">
    <button type="button">Hover me</button>
  </FileViewerTooltip>
</FileViewerTooltipProvider>`}
        />
      </DocSection>
    </DocPage>
  )
}
