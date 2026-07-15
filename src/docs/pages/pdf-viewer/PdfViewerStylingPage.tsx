import { useState } from 'react'
import type { PdfViewerClassNames } from '@/features/file-viewer'
import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES } from '../../demos/assets'
import { CodeBlock } from '../../components/CodeBlock'

const pdfSlots = [
  { key: 'root', label: 'root' },
  { key: 'scrollArea', label: 'scrollArea' },
  { key: 'page', label: 'page' },
  { key: 'pagination', label: 'pagination' },
  { key: 'toolbarBuiltins', label: 'toolbarBuiltins' },
]

const legacyPropsCode = `<PdfViewer
  url="/document.pdf"
  className="ring-1 ring-zinc-700"
  pageClassName="shadow-lg hover:shadow-xl transition-shadow"
  paginationClassName="bg-zinc-900 border border-zinc-850"
/>`

const slotsCode = `<PdfViewer
  url="/document.pdf"
  classNames={{
    root: 'rounded-lg border border-zinc-800',
    scrollArea: 'bg-zinc-950',
    page: 'ring-2 ring-emerald-500/20 shadow-2xl my-6',
    pagination: 'bg-emerald-950/25 border border-emerald-500/20 text-emerald-400',
  }}
/>`

const slotsPropsRef = [
  { name: 'root', type: 'string', description: 'Target class injected onto the outermost container block.' },
  { name: 'scrollArea', type: 'string', description: 'Styles the outer scroll-root container block.' },
  { name: 'scrollViewport', type: 'string', description: 'Styles the viewport scroll container.' },
  { name: 'scrollbar', type: 'string', description: 'Target class of the custom scrollbar track.' },
  { name: 'scrollbarThumb', type: 'string', description: 'Target class of the scrolling thumb indicator.' },
  { name: 'page', type: 'string', description: 'Styles the sheet container surrounding each PDF canvas.' },
  { name: 'pageInner', type: 'string', description: 'Styles the immediate wrapper wrapper container surrounding the canvas.' },
  { name: 'pageInput', type: 'string', description: 'Styles the interactive numeric page input input field.' },
  { name: 'pagination', type: 'string', description: 'Styles the outer floating toolbar container.' },
  { name: 'toolbarBuiltins', type: 'string', description: 'Styles the pre-built button cluster.' },
  { name: 'toolbarExtra', type: 'string', description: 'Styles the extra injected buttons wrapper.' },
]

const tokensList = [
  { name: '--fv-bg-page', type: '#ffffff', description: 'Background of loaded PDF sheets.' },
  { name: '--fv-bg-page-placeholder', type: 'rgba(128, 128, 128, 0.25)', description: 'Color fill of placeholders while pages are compiling or unrendered.' },
  { name: '--fv-pdf-text-selection', type: 'rgba(53, 132, 228, 0.25)', description: 'Color highlight of text segments inside selected text ranges.' },
  { name: '--fv-max-page-width', type: '50rem', description: 'The absolute horizontal scaling upper limit of PDF sheets.' },
]

export function PdfViewerStylingPage() {
  const [classNames, setClassNames] = useState<Partial<PdfViewerClassNames>>({})

  return (
    <DocPage
      title="PdfViewer Styling"
      description="Brand standalone PDF visualizers: customize page shadows, configure scrollbars, style floating toolbars, and target style slots."
    >
      <DocSection id="overview" title="The Document Layout System">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">PdfViewer</code> layout is structured with a specialized scrolling viewport, customizable scrollbar tracks, and canvas margins. All layers support target slots and custom style overrides.
        </p>
      </DocSection>

      <DocSection id="legacy" title="Legacy Class Props">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For quick styling, pass standard single-class parameters directly as props: <code className="text-emerald-400 font-mono">className</code>, <code className="text-emerald-400 font-mono">pageClassName</code>, and <code className="text-emerald-400 font-mono">paginationClassName</code>:
        </p>

        <LiveDemo heightClass="h-[28rem]" label="Standard Props Styling">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            className="ring-1 ring-zinc-700"
            pageClassName="shadow-lg border-2 border-zinc-800/10"
            paginationClassName="ring-1 ring-emerald-500/40"
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={legacyPropsCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="slots" title="Detailed Custom Slots (classNames)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Click the visual layout targets below to highlight specific class slot borders and see exactly which HTML containers you are targeting with the <code className="text-zinc-100 font-mono">classNames</code> prop:
        </p>

        <div className="mb-4">
          <SlotHighlighter
            slots={pdfSlots}
            onChange={(active) =>
              setClassNames(active as Partial<PdfViewerClassNames>)
            }
          />
        </div>

        <LiveDemo heightClass="h-[30rem]" label="Active Class Target Previews">
          <PdfViewer url={SAMPLES.multipagePdf} classNames={classNames} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={slotsCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="tokens" title="PDF Design Tokens (CSS Variables)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These design tokens are unique to PDF canvases. Set them inside global styles or on specific container blocks:
        </p>
        <PropTable rows={tokensList.map((t) => ({ name: t.name, type: t.type, defaultValue: '—', description: t.description }))} />
      </DocSection>

      <DocSection id="slots-props-table" title="Class Slot Reference (PdfViewerClassNames)">
        <PropTable rows={slotsPropsRef} />
      </DocSection>
    </DocPage>
  )
}
