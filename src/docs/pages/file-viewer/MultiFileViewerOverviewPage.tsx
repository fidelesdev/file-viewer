import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import {
  InlineMultiFileViewerDemo,
  ModalMultiFileViewerDemo,
} from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

export function MultiFileViewerOverviewPage() {
  return (
    <DocPage
      title="MultiFileViewer"
      description="Preview multiple files with a selectable list — sidebar or horizontal stack."
    >
      <DocSection id="sidebar" title='Layout: sidebar'>
        <InlineMultiFileViewerDemo
          label="Sidebar list (collapsible by default)"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            defaultActiveIndex: 0,
          }}
        />
        <CodeBlock
          code={`<MultiFileViewer
  layout="sidebar"
  files={files}
  open={open}
  onOpenChange={setOpen}
/>`}
        />
      </DocSection>

      <DocSection id="stack" title="Layout: stack (horizontal strip)">
        <InlineMultiFileViewerDemo
          label="Horizontal chip strip above preview"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'stack',
            stackPosition: 'top',
          }}
        />
        <CodeBlock
          code={`<MultiFileViewer
  layout="stack"
  stackPosition="top"
  files={files}
  ...
/>`}
        />
      </DocSection>

      <DocSection id="collapse" title="Collapsible sidebar">
        <InlineMultiFileViewerDemo
          label="Toggle at the top — collapsed shows icons with tooltips"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            fileListCollapsible: true,
          }}
        />
      </DocSection>

      <DocSection id="modal" title="Modal mode">
        <ModalMultiFileViewerDemo
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
          }}
        />
      </DocSection>
    </DocPage>
  )
}
