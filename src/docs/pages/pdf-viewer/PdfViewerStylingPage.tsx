import { useState } from 'react'
import type { PdfViewerClassNames } from '@/features/file-viewer'
import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES } from '../../demos/assets'

const pdfSlots = [
  { key: 'root', label: 'root' },
  { key: 'scrollArea', label: 'scrollArea' },
  { key: 'page', label: 'page' },
  { key: 'pagination', label: 'pagination (toolbar)' },
  { key: 'toolbarBuiltins', label: 'toolbarBuiltins' },
]

export function PdfViewerStylingPage() {
  const [classNames, setClassNames] = useState<Partial<PdfViewerClassNames>>({})

  return (
    <DocPage
      title="PdfViewer styling"
      description="classNames / styles slots and legacy className, pageClassName, paginationClassName."
    >
      <DocSection id="legacy" title="Legacy class props">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            className="ring-1 ring-zinc-700"
            pageClassName="shadow-lg"
            paginationClassName="ring-1 ring-emerald-500/40"
          />
        </LiveDemo>
      </DocSection>

      <DocSection id="slots" title="classNames slots">
        <SlotHighlighter
          slots={pdfSlots}
          onChange={(active) =>
            setClassNames(active as Partial<PdfViewerClassNames>)
          }
        />
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} classNames={classNames} />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
