import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

const counterCode = `<MultiFileViewer
  files={files}
  layout="sidebar"
  // Inject a dynamic progress counter on top of the list box
  extraFileListHeader={({ files, activeIndex }) => (
    <div className="flex items-center justify-between w-full px-1 text-xs text-zinc-400 font-semibold select-none">
      <span>Files Reviewed</span>
      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
        {activeIndex + 1} / {files.length}
      </span>
    </div>
  )}
/>`

const actionHeaderCode = `<MultiFileViewer
  files={files}
  layout="sidebar"
  // Inject an action bar above the files list
  extraFileListHeader={({ files }) => (
    <div className="flex items-center justify-between w-full pb-2 border-b border-zinc-800">
      <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
        Attachments ({files.length})
      </span>
      <button
        onClick={() => {
          alert("Initiating bulk downloading of " + files.length + " items in a secure ZIP archive!");
        }}
        className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded text-3xs font-bold border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition"
      >
        Download All
      </button>
    </div>
  )}
/>`

const level2MultiProps = [
  {
    name: 'extraFileListHeader',
    type: 'ReactNode | ((context: FileListHeaderContext) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Custom ReactNode or callback to inject content directly above the file list entries inside the list panel wrapper.',
  },
]

const headerContextRef = [
  { name: 'files', type: 'ViewerFileItem[]', description: 'The current array of files loaded in the MultiFileViewer.' },
  { name: 'activeIndex', type: 'number', description: 'The index of the active document being previewed.' },
  { name: 'layout', type: '"sidebar" | "stack"', description: 'The active display format of the list panel.' },
  { name: 'fileListCollapsed', type: 'boolean', description: 'True if the sidebar layout is currently collapsed.' },
]

export function MultiFileViewerLevel2Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 2"
      description="Extend the file list: inject dynamic progress counters, quick-action headers, or search boxes above the list navigation panel."
    >
      <DocSection id="overview" title="Level 2 Concept: File List Extensions">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 2 Customization</strong> allows developers to extend the default file list panel. Using the <code className="text-emerald-400 font-mono">extraFileListHeader</code> slot, you can inject custom UI modules directly above the navigation items.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          This is extremely valuable for including auxiliary information such as progress counters, file categorization headers, or interactive actions (like adding attachments, downloading a ZIP archive of all files, or sorting records).
        </p>
      </DocSection>

      <DocSection id="extra-header" title="Adding a File Progress Counter">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Pass a callback function to <code className="text-emerald-400 font-mono">extraFileListHeader</code> to receive the reactive states. Below, we calculate and display a live document inspection progress indicator:
        </p>

        <InlineMultiFileViewerDemo
          label="Custom Header with Progress Indicator"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            extraFileListHeader: ({ files, activeIndex, fileListCollapsed }) => {
              if (fileListCollapsed) return null;
              return (
                <div className="flex items-center justify-between w-full text-xs text-zinc-400 font-semibold select-none bg-zinc-900/40 p-2 rounded border border-zinc-800/60">
                  <span>Attachments</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    {activeIndex + 1} / {files.length}
                  </span>
                </div>
              );
            },
          }}
          heightClass="h-[28rem]"
        />

        <div className="mt-4">
          <CodeBlock code={counterCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="bulk-actions" title="Injecting Bulk Action Triggers">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Similarly, you can embed functional action buttons alongside your titles. Below, we add a bulk exporter shortcut directly inside the sidebar header:
        </p>

        <InlineMultiFileViewerDemo
          label="Sidebar Header with custom Download All Trigger"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            extraFileListHeader: ({ files, fileListCollapsed }) => {
              if (fileListCollapsed) return null;
              return (
                <div className="flex items-center justify-between w-full pb-2 border-b border-zinc-800">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    Anexos ({files.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Iniciando download em lote de ${files.length} arquivos...`);
                    }}
                    className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-3xs font-bold border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition"
                  >
                    Baixar Tudo
                  </button>
                </div>
              );
            },
          }}
          heightClass="h-[28rem]"
        />

        <div className="mt-4">
          <CodeBlock code={actionHeaderCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level2-props" title="Props Reference (Level 2 Multi-File)">
        <PropTable rows={level2MultiProps} />
      </DocSection>

      <DocSection id="context-reference" title="Header Context Object Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The callback function provided to <code className="text-zinc-100 font-mono">extraFileListHeader</code> receives a single context argument containing these properties:
        </p>
        <PropTable rows={headerContextRef} />
      </DocSection>
    </DocPage>
  )
}
