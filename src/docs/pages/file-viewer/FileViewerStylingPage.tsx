import { useState } from 'react'
import type { FileViewerClassNames } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineFileViewerDemo, ModalDemo } from '../../components/ModalDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const shellSlots = [
  { key: 'header', label: 'header' },
  { key: 'headerTitle', label: 'headerTitle' },
  { key: 'headerActions', label: 'headerActions' },
  { key: 'viewer', label: 'viewer' },
  { key: 'loader', label: 'loader' },
]

export function FileViewerStylingPage() {
  const [slotClasses, setSlotClasses] = useState<Partial<FileViewerClassNames>>({})

  return (
    <DocPage
      title="FileViewer styling"
      description="className / style on the shell and per-slot classNames / styles."
    >
      <DocSection id="shell-class" title="className / style">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            className: 'rounded-xl ring-2 ring-emerald-500/30',
            style: { minHeight: '100%' },
          }}
        />
      </DocSection>

      <DocSection id="slot-highlighter" title="classNames slots">
        <SlotHighlighter
          slots={shellSlots}
          onChange={(active) =>
            setSlotClasses(active as Partial<FileViewerClassNames>)
          }
        />
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, classNames: slotClasses }}
        />
      </DocSection>

      <DocSection id="dialog-content" title="dialogClassNames.content (modal)">
        <ModalDemo
          triggerLabel="Modal with custom overlay class"
          fileViewerProps={{
            ...base,
            dialogClassNames: { content: 'bg-zinc-950/90' },
          }}
        />
        <CodeBlock code={`dialogClassNames={{ content: 'bg-zinc-950/90' }}`} />
      </DocSection>
    </DocPage>
  )
}
