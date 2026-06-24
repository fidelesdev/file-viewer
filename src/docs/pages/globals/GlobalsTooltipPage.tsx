import { useEffect } from 'react'
import {
  FileViewer,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

function TooltipDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      tooltip: {
        delayDuration: 0,
        classNames: { content: 'bg-emerald-950 text-emerald-100' },
      },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return (
    <FileViewer
      mode="inline"
      open
      onOpenChange={() => undefined}
      name={SAMPLE_NAMES.multipagePdf}
      extension="pdf"
      url={SAMPLES.multipagePdf}
    />
  )
}

export function GlobalsTooltipPage() {
  return (
    <DocPage
      title="Global tooltip"
      description="tooltip.* defaults affect FileViewerTooltip across viewers."
    >
      <DocSection id="tooltip-config" title="tooltip defaults">
        <LiveDemo heightClass="h-80" label="Instant tooltips, custom content class">
          <TooltipDemo />
        </LiveDemo>
        <CodeBlock
          code={`setFileViewerDefaults({
  tooltip: {
    delayDuration: 0,
    skipDelayDuration: 0,
    classNames: { content: 'bg-emerald-950' },
  },
})`}
        />
      </DocSection>
    </DocPage>
  )
}
