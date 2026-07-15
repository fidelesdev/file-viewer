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

function ShareButton() {
  return (
    <FileViewerTooltip content="Share link to clipboard">
      <button
        type="button"
        onClick={() => {
          if (typeof navigator !== 'undefined') {
            void navigator.clipboard.writeText(window.location.href)
            alert('Document link copied to clipboard!')
          }
        }}
        className="rounded px-2.5 py-1 text-xs text-emerald-400 ring-1 ring-emerald-500/40 hover:bg-emerald-500/10 font-medium transition"
        aria-label="Share document link"
      >
        Share
      </button>
    </FileViewerTooltip>
  )
}

const appendCode = `<FileViewer
  {...props}
  extraHeaderActions={<ShareButton />} // appends to the right by default
/>`

const prependCode = `<FileViewer
  {...props}
  extraHeaderActions={<ShareButton />}
  extraHeaderActionsSide="left" // places extra actions to the left of built-ins
/>`

const functionContextCode = `// By passing a render function, your custom controls get access
// to the live context of the active FileViewer shell.
<FileViewer
  {...props}
  extraHeaderActions={({ download, isDownloading, mode }) => (
    <button
      disabled={isDownloading}
      onClick={() => void download()}
      className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving to Cloud...
        </>
      ) : (
        \`Save (\${mode === 'modal' ? 'Modal' : 'Inline'})\`
      )}
    </button>
  )}
/>`

const reorderCode = `// You can customize the positioning layout of builtins and extras
// via Tailwind's flex-order tricks
<FileViewer
  extraHeaderActions={<ShareButton />}
  classNames={{
    headerActionsExtra: 'order-first mr-4', // push extra action to the start
    headerActionsBuiltins: 'ml-auto',      // force built-ins to stay on the right
  }}
  {...props}
/>`

const level2HeaderProps = [
  {
    name: 'extraHeaderActions',
    type: 'ReactNode | ((context: FileViewerHeaderActionsContext) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Custom ReactNode or functional callback to inject beside the native download, print, or fullscreen triggers.',
  },
  {
    name: 'extraHeaderActionsSide',
    type: '"left" | "right"',
    defaultValue: '"right"',
    description: 'Forces the positioning of extra actions relative to the default built-in button cluster.',
  },
  {
    name: 'classNames.headerActionsExtra',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Target class names specifically on the wrapping element of the injected extra actions.',
  },
  {
    name: 'classNames.headerActionsBuiltins',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Target class names on the wrapping container of the built-in action icons.',
  },
]

const contextObjectProps = [
  {
    name: 'mode',
    type: '"inline" | "modal"',
    description: 'The active presentation format of the shell.',
  },
  {
    name: 'url',
    type: 'string | undefined',
    description: 'The direct source file URL currently being resolved.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'The document display name (metadata).',
  },
  {
    name: 'extension',
    type: 'string',
    description: 'The file extension type.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'True when the main source file is undergoing initial preload.',
  },
  {
    name: 'isDownloading',
    type: 'boolean',
    description: 'True while the underlying downloader is running a save sequence.',
  },
  {
    name: 'isFullscreen',
    type: 'boolean',
    description: 'True when an inline component is running inside an expanded modal portal.',
  },
  {
    name: 'print',
    type: '() => void',
    description: 'Callback to fire the native iframe or image print queue.',
  },
  {
    name: 'download',
    type: '() => Promise<void>',
    description: 'Asynchronous function trigger to save the file with proper naming fallback headers.',
  },
  {
    name: 'toggleFullscreen',
    type: '() => void',
    description: 'Callback to expand or exit full screen portal overlays.',
  },
]

export function FileViewerHeaderLevel2Page() {
  return (
    <DocPage
      title="Header — Level 2"
      description="Extend the header: inject custom actions (Share, Tag, Audit buttons) beside built-in controls without writing layout boilerplates."
    >
      <DocSection id="overview" title="Level 2 Concept: Extensibility">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 2 Customization</strong> allows developers to extend the shell header by appending or prepending custom nodes (like e-signatures, audit logs, or share buttons) while <strong className="text-emerald-400 font-medium">keeping all built-in actions active</strong>.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          This strikes an excellent balance between zero-effort setup and feature growth. It keeps the core library responsible for handling downloading/printing, while giving you complete creative freedom on your extra custom tools.
        </p>
      </DocSection>

      <DocSection id="extra-positioning" title="Positioning (extraHeaderActionsSide)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The <code className="text-emerald-400 font-mono">extraHeaderActions</code> prop accepts any React node and positions it to the right of the built-ins by default. Toggle its location to the left with <code className="text-emerald-400 font-mono">extraHeaderActionsSide="left"</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Append Side (Default Right)</p>
            <InlineFileViewerDemo
              fileViewerProps={{
                ...base,
                extraHeaderActions: <ShareButton />,
              }}
              heightClass="h-64"
            />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Prepend Side (Left of Builtins)</p>
            <InlineFileViewerDemo
              fileViewerProps={{
                ...base,
                extraHeaderActions: <ShareButton />,
                extraHeaderActionsSide: 'left',
              }}
              heightClass="h-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock code={appendCode} language="tsx" />
          <CodeBlock code={prependCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="render-function" title="Functional Context Injection">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For buttons that need to interact directly with the active document, pass a <strong className="text-zinc-200">render callback function</strong>. The shell invokes this callback, supplying a detailed <code className="text-emerald-400 font-mono">context</code> argument that exposes download, print, loading, and fullscreen states.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: ({ download, isDownloading, mode }) => (
              <button
                type="button"
                disabled={isDownloading}
                onClick={() => void download()}
                className="flex items-center gap-1.5 rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-100 disabled:opacity-50 transition"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  `Download (${mode})`
                )}
              </button>
            ),
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={functionContextCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="order-tricks" title="Flex Reordering Tricks">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          You can customize the layout structure even further without touching the core header component by overriding specific slot flex classes, like <code className="text-emerald-400 font-mono">classNames.headerActionsExtra</code> or <code className="text-emerald-400 font-mono">classNames.headerActionsBuiltins</code>:
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            extraHeaderActions: <ShareButton />,
            classNames: {
              headerActionsExtra: 'order-first mr-4',
              headerActionsBuiltins: 'ml-auto',
            },
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={reorderCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (Level 2 Extension)">
        <PropTable rows={level2HeaderProps} />
      </DocSection>

      <DocSection id="context-ref" title="Render Context Object Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The context argument injected into the <code className="text-zinc-100 font-mono">extraHeaderActions</code> render callback contains the following reactive properties and trigger parameters:
        </p>
        <PropTable rows={contextObjectProps.map((p) => ({ ...p, type: p.type, description: p.description }))} />
      </DocSection>
    </DocPage>
  )
}
