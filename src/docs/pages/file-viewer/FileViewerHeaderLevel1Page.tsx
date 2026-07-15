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

const toggleCode = `<FileViewer
  open={open}
  onOpenChange={setOpen}
  name="document.pdf"
  extension="pdf"
  url="/path/to/document.pdf"
  showFullscreenButton={true} // toggles expand button
  showPrintButton={false}      // disables printing
  showDownloadButton={true}   // enables downloading
/>`

const mergeStylesCode = `// Style slots resolve hierarchically:
// Internal layout defaults → Global defaults (setFileViewerDefaults) → Instance props (classNames)

<FileViewer
  classNames={{
    header: 'bg-zinc-900 border-b border-zinc-800 px-6 py-4',
    headerTitle: 'text-lg font-bold text-zinc-100 uppercase tracking-wide',
    printButton: 'hover:text-amber-500 hover:bg-amber-500/10 transition-colors',
    downloadButton: 'hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors',
  }}
  styles={{
    header: { height: '4.5rem' },
    headerTitle: { letterSpacing: '0.05em' },
  }}
  {...props}
/>`

const level1HeaderProps = [
  {
    name: 'showFullscreenButton',
    type: 'boolean',
    defaultValue: 'true',
    description: 'When true, renders an icon trigger to transition inline previews into a temporary modal screen.',
  },
  {
    name: 'showPrintButton',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables printing. PDFs are delegated to an iframe render, images to an off-screen print canvas.',
  },
  {
    name: 'showDownloadButton',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to show the file downloader trigger in the header.',
  },
  {
    name: 'classNames',
    type: 'FileViewerClassNames',
    defaultValue: 'undefined',
    description: 'Map of target class strings to override specific HTML tags in the shell hierarchy.',
  },
  {
    name: 'styles',
    type: 'FileViewerStyles',
    defaultValue: 'undefined',
    description: 'Map of React.CSSProperties objects to inject inline styles into specific HTML tags.',
  },
]

export function FileViewerHeaderLevel1Page() {
  return (
    <DocPage
      title="Header — Level 1"
      description="Declarative Header Customization: toggle built-in actions, configure buttons, and inject CSS variables or styles directly into layout slots."
    >
      <DocSection id="overview" title="Level 1 Customization Concept">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 1 Customization</strong> is the safest, fastest way to configure the header. Instead of managing JSX tags, layout grids, or button event binds, you pass simple declarative booleans or styling keys.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          This mode is highly encouraged unless you need to support custom business rules (like e-signature, PDF page watermarking, or document deletion triggers). Built-in actions maintain fully managed accessibility (<code className="text-zinc-400">aria-label</code>, focus control, loading spinner toggling, and keyboard bindings).
        </p>
      </DocSection>

      <DocSection id="show-toggles" title="Toggling Built-in Actions">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The header features three main action buttons: Fullscreen, Print, and Download. Toggle their existence via explicit boolean flags:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">All Controls Enabled (Default)</p>
            <InlineFileViewerDemo
              fileViewerProps={{ ...base, showFullscreenButton: true, showPrintButton: true, showDownloadButton: true }}
              label="Fullscreen, Print, and Download on"
              heightClass="h-64"
            />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Controls Selective Override</p>
            <InlineFileViewerDemo
              fileViewerProps={{ ...base, showFullscreenButton: false, showPrintButton: false, showDownloadButton: true }}
              label="Fullscreen & Print off, Download on"
              heightClass="h-64"
            />
          </div>
        </div>

        <CodeBlock code={toggleCode} language="tsx" />
      </DocSection>

      <DocSection id="header-slots" title="Styling Slots (classNames & styles)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          To fit the document viewer inside your company's design system or custom branding, the shell exposes dedicated styling slots. Class names passed here merge safely with internal tailwind layers, guaranteeing your layouts do not collapse.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            classNames: {
              header: 'border-b border-emerald-500/20 bg-emerald-950/10 px-6 py-4',
              headerTitle: 'text-emerald-400 font-bold uppercase tracking-widest text-xs',
              downloadButton: 'text-emerald-300 hover:bg-emerald-500/15',
              printButton: 'text-emerald-300 hover:bg-emerald-500/15',
            },
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={mergeStylesCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level1-props" title="Props Reference (Level 1 Header)">
        <PropTable rows={level1HeaderProps} />
      </DocSection>
    </DocPage>
  )
}
