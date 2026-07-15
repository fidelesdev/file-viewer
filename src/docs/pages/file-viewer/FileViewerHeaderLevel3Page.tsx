import { FileViewerTooltip } from '@/features/file-viewer'
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

const recomposeHeaderCode = `import { FileViewer } from '@fdls/file-viewer'

export function RecomposedHeader() {
  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="report.pdf"
      extension="pdf"
      url="/report.pdf"
      renderHeaderActions={({ defaultActions, name }) => (
        <div className="flex items-center justify-between w-full">
          {/* Custom element injected on the left of actions */}
          <span className="mr-auto text-xs text-zinc-500 font-mono select-none">
            Viewing: {name}
          </span>
          {/* Default print/download buttons inserted here */}
          <div className="flex gap-1">
            {defaultActions}
          </div>
        </div>
      )}
    />
  )
}`

const fullCustomHeaderCode = `import { FileViewer } from '@fdls/file-viewer'

export function FullCustomHeader() {
  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="scanned_receipt.jpg"
      extension="jpg"
      url="/receipt.jpg"
      // Completely bypasses the default action button cluster
      renderHeaderActions={({ download, print, isDownloading }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => void download()}
            disabled={isDownloading}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition"
          >
            {isDownloading ? 'Downloading...' : 'Export Copy'}
          </button>
          
          <button
            onClick={print}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs transition"
          >
            Send to Office Printer
          </button>
        </div>
      )}
    />
  )
}`

const customCloseCode = `import { FileViewer, FileViewerTooltip } from '@fdls/file-viewer'

export function CustomClosePreview() {
  return (
    <FileViewer
      open={open}
      onOpenChange={setOpen}
      name="receipt.jpg"
      extension="jpg"
      url="/receipt.jpg"
      hideCloseButton={false}
      // Wrap the pre-wired button in a tooltip or customized tag
      renderCloseButton={({ defaultCloseButton, close, mode }) => (
        <FileViewerTooltip content="Dismiss this window instantly">
          <div className="hover:scale-105 transition-transform">
            {defaultCloseButton}
          </div>
        </FileViewerTooltip>
      )}
    />
  )
}`

const level3HeaderProps = [
  {
    name: 'renderHeaderActions',
    type: '(props: FileViewerHeaderActionsRenderProps) => ReactNode',
    defaultValue: 'undefined',
    description: 'Completely replaces the right-hand actions cluster. Receives context variables and pre-assembled defaultActions.',
  },
  {
    name: 'renderCloseButton',
    type: '(props: FileViewerCloseButtonRenderProps) => ReactNode | null',
    defaultValue: 'undefined',
    description: 'Completely replaces the left-hand close button container. Receives the pre-assembled defaultCloseButton and a direct close handler.',
  },
]

const renderHeaderPropsRef = [
  {
    name: 'defaultActions',
    type: 'ReactNode',
    description: 'A React fragment containing the pre-assembled built-in icons (Fullscreen, Print, and Download), respecting the Level 1 visibility configurations.',
  },
  {
    name: 'mode',
    type: '"inline" | "modal"',
    description: 'The active presentation layer of the document viewer.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'The display name of the current file (metadata).',
  },
  {
    name: 'extension',
    type: 'string',
    description: 'The file extension parsed by the shell.',
  },
  {
    name: 'url',
    type: 'string',
    description: 'The direct source URL parameter.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'True when the asset undergoes initial preloading phases.',
  },
  {
    name: 'isDownloading',
    type: 'boolean',
    description: 'True while a download triggers is active.',
  },
  {
    name: 'isFullscreen',
    type: 'boolean',
    description: 'True if an inline layout was expanded into the temporary modal portal.',
  },
  {
    name: 'print',
    type: '() => void',
    description: 'Pre-wired method to trigger printing pipelines.',
  },
  {
    name: 'download',
    type: '() => Promise<void>',
    description: 'Pre-wired method to trigger download pipelines with file preservation.',
  },
  {
    name: 'toggleFullscreen',
    type: '() => void',
    description: 'Pre-wired method to transition from inline to modal fullscreen layout.',
  },
]

const renderClosePropsRef = [
  {
    name: 'defaultCloseButton',
    type: 'ReactNode',
    description: 'The pre-built close action (complying with Dialog.Close inside modals or trigger bindings inline).',
  },
  {
    name: 'mode',
    type: '"inline" | "modal"',
    description: 'The presentation environment of the viewer.',
  },
  {
    name: 'close',
    type: '() => void',
    description: 'Unified action to fire unmounting, closing, or exiting temporary portals.',
  },
]

export function FileViewerHeaderLevel3Page() {
  return (
    <DocPage
      title="Header — Level 3"
      description="Compose the header: take complete control over custom layout structures. Completely replace, rearrange, or wrap actions and close buttons."
    >
      <DocSection id="overview" title="Level 3 Concept: Composition">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 3 Customization</strong> represents the maximum degree of flexibility supported by the Header API. Rather than injecting items around native controls, you bypass the default container layout completely and provide custom render functions.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The core advantage of this level is <strong className="text-emerald-400 font-medium">Recomposition</strong>. The shell supplies the fully wired, functional default controls (like <code className="text-zinc-100 font-mono">defaultActions</code> and <code className="text-zinc-100 font-mono">defaultCloseButton</code>) inside the callback props. You can render these default elements wherever you want in your custom layout, or skip them entirely.
        </p>
        <p className="mt-2 text-sm text-amber-400/80 italic">
          Note: When renderHeaderActions is set, the Level 2 extraHeaderActions prop is ignored.
        </p>
      </DocSection>

      <DocSection id="recompose-actions" title="Recomposing Built-in Actions">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          This pattern allows you to inject custom tags, system status tags, or file indicators directly to the left of the default control buttons, keeping the native print and download buttons intact.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            renderHeaderActions: ({ defaultActions, name }) => (
              <>
                <span className="mr-auto truncate text-xs text-zinc-500 font-mono select-none">
                  Custom Shell Namespace: {name}
                </span>
                {defaultActions}
              </>
            ),
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={recomposeHeaderCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="bypass-actions" title="Bypassing Native Controls Completely">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If you do not want to display standard icons (or if your team wants to render custom, descriptive buttons instead of icon triggers), simply omit <code className="text-zinc-100 font-mono">defaultActions</code> and draw your own layout. Bind custom buttons directly to the injected <code className="text-zinc-100 font-mono">download</code> and <code className="text-zinc-100 font-mono">print</code> methods.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            renderHeaderActions: ({ download, print, isDownloading }) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() => void download()}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition font-semibold"
                >
                  {isDownloading ? 'Saving...' : 'Export File'}
                </button>
                <button
                  type="button"
                  onClick={print}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition font-semibold"
                >
                  Print Copy
                </button>
              </div>
            ),
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={fullCustomHeaderCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="custom-close" title="Composing custom Close Buttons">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Similarly, the <code className="text-emerald-400 font-mono">renderCloseButton</code> callback gives you total command over the close trigger layout. You can wrap the pre-wired <code className="text-zinc-100 font-mono">defaultCloseButton</code> in custom tooltips, animate its transitions, or render a custom link element.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            hideCloseButton: false,
            renderCloseButton: ({ defaultCloseButton }) => (
              <FileViewerTooltip content="Dismiss viewer">
                <span className="inline-flex hover:scale-110 active:scale-95 transition-transform">
                  {defaultCloseButton}
                </span>
              </FileViewerTooltip>
            ),
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={customCloseCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level3-props" title="Props Reference (Level 3 Composition)">
        <PropTable rows={level3HeaderProps} />
      </DocSection>

      <DocSection id="render-header-props" title="renderHeaderActions Callback Arguments">
        <PropTable rows={renderHeaderPropsRef} />
      </DocSection>

      <DocSection id="render-close-props" title="renderCloseButton Callback Arguments">
        <PropTable rows={renderClosePropsRef} />
      </DocSection>
    </DocPage>
  )
}
