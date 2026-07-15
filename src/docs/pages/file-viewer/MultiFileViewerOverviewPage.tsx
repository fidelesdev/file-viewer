import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import {
  InlineMultiFileViewerDemo,
  ModalMultiFileViewerDemo,
} from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

const sidebarCode = `<MultiFileViewer
  open={open}
  onOpenChange={setOpen}
  files={files}
  layout="sidebar" // collapsible vertical side list
  fileListCollapsible={true}
  defaultFileListCollapsed={false}
/>`

const stackCode = `<MultiFileViewer
  open={open}
  onOpenChange={setOpen}
  files={files}
  layout="stack" // horizontal strip layout
  stackPosition="top" // or "bottom"
/>`

const activeIndexCode = `import { useState } from 'react'
import { MultiFileViewer } from '@fdls/file-viewer'

export function ActiveIndexController() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <MultiFileViewer
      open={true}
      onOpenChange={() => {}}
      files={myFiles}
      activeIndex={activeIndex}
      onActiveIndexChange={(index, file) => {
        console.log(\`Viewing file index \${index}: \${file.name}\`)
        setActiveIndex(index)
      }}
    />
  )
}`

const multiViewerPropsRef = [
  {
    name: 'files',
    type: 'ViewerFileItem[]',
    defaultValue: '[]',
    description: 'Array of files to render. Each file requires name, extension, url, and optional pdfViewerProps overrides.',
  },
  {
    name: 'layout',
    type: '"sidebar" | "stack"',
    defaultValue: '"sidebar"',
    description: 'Arrangement format of the navigation list panel. "sidebar" places a collapsible column, "stack" renders a horizontal row.',
  },
  {
    name: 'stackPosition',
    type: '"top" | "bottom"',
    defaultValue: '"top"',
    description: 'Positioning of the horizontal row relative to the file preview viewport (relevant only when layout="stack").',
  },
  {
    name: 'activeIndex',
    type: 'number',
    defaultValue: '—',
    description: 'Controlled index of the currently active file. Must be matched with onActiveIndexChange.',
  },
  {
    name: 'defaultActiveIndex',
    type: 'number',
    defaultValue: '0',
    description: 'The initial active file index when running in uncontrolled mode.',
  },
  {
    name: 'onActiveIndexChange',
    type: '(index: number, file: ViewerFileItem) => void',
    defaultValue: 'undefined',
    description: 'Callback executed when a user selects a file from the list navigation.',
  },
  {
    name: 'hideFileListWhenSingle',
    type: 'boolean',
    defaultValue: 'false',
    description: 'If true, automatically hides the list navigation panel entirely if files.length is 1 or less.',
  },
  {
    name: 'fileListCollapsible',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables collapsible sidebar behaviors when running layout="sidebar".',
  },
  {
    name: 'fileListCollapsed',
    type: 'boolean',
    defaultValue: '—',
    description: 'Controlled collapsible state of the sidebar.',
  },
]

export function MultiFileViewerOverviewPage() {
  return (
    <DocPage
      title="MultiFileViewer Overview"
      description="Orchestrate multiple document and image previews within a single tabbed shell. Supports collapsible sidebars, horizontal stacks, and individual configuration overrides."
    >
      <DocSection id="overview" title="The Composite Document Pattern">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">MultiFileViewer</code> solves the problem of presenting multiple related documents (such as loan files, legal folders, or billing attachments bundles) inside a single component scope.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Rather than mounting independent <code className="text-zinc-300 font-mono">&lt;FileViewer /&gt;</code> components that trigger layout thrashing, the multi-file variant encapsulates a unified state manager. Under the hood, <strong className="text-zinc-100">each document is keyed individually by URL and index</strong>. This means when a user toggles items, the previous viewer is cleanly unmounted, clearing canvas cache and preventing PDF leak jank, while initiating a clean lazy preload for the subsequent document.
        </p>
      </DocSection>

      <DocSection id="layout-sidebar" title='Layout: Sidebar'>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The <code className="text-emerald-400 font-mono">sidebar</code> layout places a highly responsive vertical navigation panel beside the main file viewport. The panel is equipped with keyboard event bindings (Arrow keys navigation, Home/End triggers) and accessible <code className="text-zinc-100 font-mono">listbox</code> and <code className="text-zinc-100 font-mono">tablist</code> ARIA semantic rules.
        </p>

        <InlineMultiFileViewerDemo
          label="Vertical Collapsible Sidebar List Layout"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            defaultActiveIndex: 0,
            fileListCollapsible: true,
          }}
          heightClass="h-[30rem]"
        />

        <div className="mt-4">
          <CodeBlock code={sidebarCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="layout-stack" title="Layout: Stack (Horizontal Strip)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The <code className="text-emerald-400 font-mono">stack</code> layout places a horizontal chip list above or below the viewport. This format is perfect for embedding file lists into tighter vertical card wrappers where displaying a sidebar would restrict horizontal spacing.
        </p>

        <InlineMultiFileViewerDemo
          label="Horizontal Chip Strip Layout (Position: Top)"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'stack',
            stackPosition: 'top',
          }}
          heightClass="h-[30rem]"
        />

        <div className="mt-4">
          <CodeBlock code={stackCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="controlled-state" title="Controlled Index Orchestration">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Maintain full authority over which attachment is rendered by binding the index state to your active business flows:
        </p>
        <CodeBlock code={activeIndexCode} language="tsx" />
      </DocSection>

      <DocSection id="modal-mode" title="Multi-File Modal overlay">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Configure <code className="text-zinc-100 font-mono">mode="modal"</code> to render the entire tabbed document review layout inside a screen-fixed, scroll-blocked accessible layer.
        </p>

        <div className="mb-4">
          <ModalMultiFileViewerDemo
            multiFileViewerProps={{
              files: DEMO_FILES,
              layout: 'sidebar',
            }}
          />
        </div>
      </DocSection>

      <DocSection id="props-reference" title="Props Reference (Layouts & Navigation)">
        <PropTable rows={multiViewerPropsRef} />
      </DocSection>
    </DocPage>
  )
}
