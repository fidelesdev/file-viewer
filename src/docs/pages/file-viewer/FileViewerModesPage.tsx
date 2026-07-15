import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo, ModalDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const baseProps = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const inlineCode = `import { FileViewer } from '@fdls/file-viewer'

export function SplitDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4 h-[600px] w-full">
      {/* List / Form Panel */}
      <div className="p-4 border border-zinc-800 rounded-lg">
        <h3 className="font-semibold text-zinc-200">Review Request</h3>
        {/* ... form content ... */}
      </div>

      {/* Embedded In-App Preview Panel */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <FileViewer
          open={true}
          onOpenChange={() => {}}
          name="contract-v2.pdf"
          extension="pdf"
          url="https://example.com/contract.pdf"
          mode="inline"
        />
      </div>
    </div>
  )
}`

const modalCode = `import { useState } from 'react'
import { FileViewer } from '@fdls/file-viewer'

export function ModalTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500"
      >
        View Full Document
      </button>

      <FileViewer
        open={open}
        onOpenChange={setOpen}
        name="contract-v2.pdf"
        extension="pdf"
        url="https://example.com/contract.pdf"
        mode="modal"
      />
    </>
  )
}`

const customFullscreenCode = `// You can prevent the default portal-expansion and handle fullscreen yourself
// (e.g., using browser document.documentElement.requestFullscreen() or router pathing)
<FileViewer
  mode="inline"
  open={open}
  onOpenChange={setOpen}
  name="receipt.png"
  extension="png"
  url="https://example.com/receipt.png"
  onFullscreen={() => {
    alert("Triggering custom full screen router or native API wrapper!")
  }}
/>`

const modeProps = [
  {
    name: 'mode',
    type: '"inline" | "modal"',
    defaultValue: '"inline"',
    description: 'The layout mode. "inline" fills the parent element. "modal" renders a screen-fixed portal overlay.',
  },
  {
    name: 'hideCloseButton',
    type: 'boolean',
    defaultValue: 'true (inline) / false (modal)',
    description: 'Force the header close button visibility state. When set to true in modal mode, make sure you provide another exit mechanism.',
  },
  {
    name: 'showFullscreenButton',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables the inline fullscreen expansion control. Clicking this opens the document in a temporary modal layer.',
  },
  {
    name: 'onFullscreen',
    type: '() => void',
    defaultValue: 'undefined',
    description: 'Called instead of launching the default inline-to-modal expansion portal when clicking the fullscreen control.',
  },
  {
    name: 'inlineFullscreenActive',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Forces the fullscreen icon to display as "Exit Fullscreen". Useful if a parent container owns the fullscreen state.',
  },
]

export function FileViewerModesPage() {
  return (
    <DocPage
      title="FileViewer Modes"
      description="Compare and configure the two structural layouts: 'inline' for modular side-by-side splits, and 'modal' for full-viewport portals."
    >
      <DocSection id="inline-mode" title="mode: inline (Default)">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">inline</code> mode configures the shell to size itself based on its immediate parent container (<code className="text-zinc-100 font-mono">width: 100%; height: 100%</code>).
        </p>
        <p className="mt-2 text-zinc-300 mb-4 leading-relaxed">
          This is the optimal pattern for designing dual-pane admin interfaces, split-view document reviews, email inbox attachments panels, or modular workspace panels. It seamlessly blends within your current layout flow without interrupting focus.
        </p>

        <InlineFileViewerDemo fileViewerProps={baseProps} heightClass="h-96" />

        <div className="mt-4">
          <CodeBlock code={inlineCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="modal-mode" title="mode: modal">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">modal</code> mode shifts the rendering context entirely. It implements a screen-fixed portal using an accessible overlay, utilizing:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4 space-y-1 text-zinc-400">
          <li><strong className="text-zinc-200">Scroll Lock:</strong> Prevents background page scrolling while the viewer is active.</li>
          <li><strong className="text-zinc-200">Focus Trap:</strong> Restricts keyboard tab rings within the active modal to maintain high accessibility.</li>
          <li><strong className="text-zinc-200">Escape Binding:</strong> Closes the viewer overlay instantly upon pressing the Escape key.</li>
        </ul>

        <div className="mb-4">
          <ModalDemo fileViewerProps={baseProps} triggerLabel="Launch Document Modal" />
        </div>

        <CodeBlock code={modalCode} language="tsx" />
      </DocSection>

      <DocSection id="fullscreen-transition" title="Inline Fullscreen Expansion">
        <p className="text-zinc-300 leading-relaxed">
          One of the core features of <code className="text-emerald-400 font-mono">mode="inline"</code> is its built-in expansion pipeline. When <code className="text-zinc-100 font-mono">showFullscreenButton</code> is enabled (default), an expand button is injected into the action header.
        </p>
        <p className="mt-2 text-zinc-300 leading-relaxed">
          Clicking this button automatically opens the exact document in a full-screen modal layer. Under the hood, this <strong className="text-zinc-200">preserves zoom levels, scroll heights, and page numbers</strong>, delivering a zero-interruption responsive transition.
        </p>

        <h4 className="text-sm font-semibold text-zinc-200 mt-6 mb-2">Overriding with custom Fullscreen handlers</h4>
        <p className="text-zinc-300 mb-3 leading-relaxed">
          If your application requires custom viewport scaling (e.g., using browser-level Fullscreen API on specific DOM nodes, or pushing to a dedicated full-bleed route), hook into the <code className="text-emerald-400 font-mono">onFullscreen</code> callback. This overrides the default temporary portal expansion.
        </p>
        <CodeBlock code={customFullscreenCode} language="tsx" />
      </DocSection>

      <DocSection id="hide-close" title="Managing Close Buttons">
        <p className="text-zinc-300 leading-relaxed">
          By default, the close button matches the layout context:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4 space-y-1 text-zinc-400">
          <li><strong className="text-zinc-200">inline:</strong> The close button is <strong className="text-emerald-400 font-medium">hidden</strong> by default, as the layout is typically persistent.</li>
          <li><strong className="text-zinc-200">modal:</strong> The close button is <strong className="text-emerald-400 font-medium">visible</strong> by default, bound to close triggers.</li>
        </ul>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use the <code className="text-emerald-400 font-mono">hideCloseButton</code> prop to force your desired visibility state on either layout mode:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Inline Mode (Close Force-Shown)</p>
            <InlineFileViewerDemo
              fileViewerProps={{ ...baseProps, hideCloseButton: false }}
              label="inline with close button visible"
              heightClass="h-72"
            />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Modal Mode (Close Hidden)</p>
            <ModalDemo
              fileViewerProps={{ ...baseProps, hideCloseButton: true }}
              triggerLabel="Modal without close button"
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="mode-props" title="Props Reference (Layout & Modal)">
        <PropTable rows={modeProps} />
      </DocSection>
    </DocPage>
  )
}
