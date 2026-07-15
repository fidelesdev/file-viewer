import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

const customItemCode = `<MultiFileViewer
  files={files}
  layout="sidebar"
  // Completely override how individual file items are rendered
  renderFileListItem={({ defaultItem, isActive, file, select }) => {
    // Custom business rules based on the file name or properties
    const isSensitive = file.name.toLowerCase().includes('confidential') || file.name.toLowerCase().includes('report');
    
    return (
      <div
        onClick={select}
        data-active={isActive}
        data-sensitive={isSensitive}
        className="group relative cursor-pointer border-b border-zinc-800/40 p-1 transition-colors
          data-[active=true]:bg-emerald-950/20 data-[active=true]:border-emerald-500/30
          data-[sensitive=true]:hover:bg-amber-950/10"
      >
        {/* Render default list item structure */}
        {defaultItem}

        {/* Append a custom security badge if sensitive */}
        {isSensitive && (
          <span className="absolute top-1 right-2 bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
            CONFIDENTIAL
          </span>
        )}
      </div>
    )
  }}
/>`

const customListContainerCode = `<MultiFileViewer
  files={files}
  layout="sidebar"
  // Replace the entire files list container block
  renderFileList={({ defaultList, files, activeIndex }) => (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-200">Documents Vault</h4>
        <p className="text-[10px] text-zinc-500 mt-0.5">Secure Cloud Storage</p>
      </div>
      
      {/* Scrollable list items panel */}
      <div className="flex-1 overflow-y-auto">
        {defaultList}
      </div>

      <div className="p-3 bg-zinc-900/50 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Viewing {activeIndex + 1} of {files.length}
      </div>
    </div>
  )}
/>`

const level3PropsRef = [
  {
    name: 'renderFileListItem',
    type: '(props: FileListItemRenderProps) => ReactNode',
    defaultValue: 'undefined',
    description: 'Bypasses default list item rendering. Supplies pre-wired defaultItem alongside item variables and selection callbacks.',
  },
  {
    name: 'renderFileList',
    type: '(props: FileListRenderProps) => ReactNode',
    defaultValue: 'undefined',
    description: 'Bypasses default outer list column layout rendering. Supplies pre-wired defaultList alongside structural metrics.',
  },
]

const renderItemPropsRef = [
  { name: 'defaultItem', type: 'ReactNode', description: 'The pre-assembled default list item (containing layouts, icons, labels, and collapsed tooltip triggers).' },
  { name: 'isActive', type: 'boolean', description: 'True when the specific file index is currently being previewed in the viewport.' },
  { name: 'file', type: 'ViewerFileItem', description: 'The current file entry details (name, extension, url, id).' },
  { name: 'index', type: 'number', description: 'The list index position of the item.' },
  { name: 'select', type: '() => void', description: 'Pre-wired click action trigger to make this file active.' },
]

const renderListPropsRef = [
  { name: 'defaultList', type: 'ReactNode', description: 'A pre-assembled stack of all file items, with built-in layout adapters.' },
  { name: 'files', type: 'ViewerFileItem[]', description: 'The complete array of loaded file entries.' },
  { name: 'activeIndex', type: 'number', description: 'The index of the active document.' },
  { name: 'onSelect', type: '(index: number) => void', description: 'Pre-wired method to trigger active file index updates.' },
  { name: 'layout', type: '"sidebar" | "stack"', description: 'The display format configuration.' },
  { name: 'fileListCollapsed', type: 'boolean', description: 'True if the sidebar layout is minimized.' },
]

export function MultiFileViewerLevel3Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 3"
      description="Compose file lists: Completely rewrite list containers, style custom item layouts, and append dynamic status indicators or category badges."
    >
      <DocSection id="overview" title="Level 3 Concept: Complete Composition">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 3 Customization</strong> provides ultimate control over list items and containers in MultiFileViewer. If you need to build custom attachment cards, attach validation badges, add custom icons, or completely structure the list panel layout, Level 3 is your solution.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Just like other Level 3 APIs, you can <strong className="text-emerald-400 font-medium">Recompose</strong> your layouts using the provided pre-built elements (<code className="text-zinc-100 font-mono">defaultItem</code> or <code className="text-zinc-100 font-mono">defaultList</code>) to keep all built-in collapsing and tooltip functions intact while injecting custom features.
        </p>
      </DocSection>

      <DocSection id="render-item" title="Overriding List Items (renderFileListItem)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The <code className="text-emerald-400 font-mono">renderFileListItem</code> callback controls the layout of individual entries in the list. Below, we check filenames to dynamically append a custom orange "Confidential" tag to specific items:
        </p>

        <InlineMultiFileViewerDemo
          label="Custom File List Items with Security Badges"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            renderFileListItem: ({ defaultItem, isActive, file, select }) => {
              const isSensitive = file.name.toLowerCase().includes('contract') || file.name.toLowerCase().includes('demo');
              return (
                <div
                  onClick={select}
                  data-active={isActive}
                  className="group relative cursor-pointer border-b border-zinc-800/40 p-0.5 transition-colors
                    data-[active=true]:bg-emerald-950/20 data-[active=true]:border-emerald-500/30"
                >
                  {defaultItem}
                  {isSensitive && (
                    <span className="absolute top-1.5 right-2 bg-amber-500/10 text-amber-500 text-[9px] px-1 rounded font-bold group-data-[collapsed=true]/sidebar:hidden">
                      SECURE
                    </span>
                  )}
                </div>
              );
            },
          }}
          heightClass="h-[30rem]"
        />

        <div className="mt-4">
          <CodeBlock code={customItemCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="render-list" title="Overriding the List Container (renderFileList)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          To modify the outer layout panel (e.g., adding headers with custom logos or rendering a specific footer layout), use the <code className="text-emerald-400 font-mono">renderFileList</code> callback:
        </p>

        <InlineMultiFileViewerDemo
          label="Custom Files List Container Layout"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            renderFileList: ({ defaultList, files, activeIndex, fileListCollapsed }) => {
              if (fileListCollapsed) return defaultList;
              return (
                <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
                  <div className="p-3 bg-zinc-900 border-b border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-200">Vault Previewer</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Secure Document Bundle</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {defaultList}
                  </div>

                  <div className="p-2.5 bg-zinc-900/50 border-t border-zinc-800 text-center text-xs text-zinc-400 font-medium">
                    Index: {activeIndex + 1} of {files.length}
                  </div>
                </div>
              );
            },
          }}
          heightClass="h-[32rem]"
        />

        <div className="mt-4">
          <CodeBlock code={customListContainerCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level3-props" title="Props Reference (Level 3 Multi-File)">
        <PropTable rows={level3PropsRef} />
      </DocSection>

      <DocSection id="render-item-props" title="renderFileListItem Callback Arguments">
        <PropTable rows={renderItemPropsRef} />
      </DocSection>

      <DocSection id="render-list-props" title="renderFileList Callback Arguments">
        <PropTable rows={renderListPropsRef} />
      </DocSection>
    </DocPage>
  )
}
