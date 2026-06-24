import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

export function MultiFileViewerLevel3Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 3"
      description="renderFileListItem and renderFileList replace default list UI."
    >
      <DocSection id="render-item" title="renderFileListItem">
        <InlineMultiFileViewerDemo
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            renderFileListItem: ({ defaultItem, isActive, file }) => (
              <div
                data-active={isActive}
                className="data-[active=true]:ring-1 data-[active=true]:ring-emerald-500/60"
              >
                {defaultItem}
                <span className="sr-only">{file.extension}</span>
              </div>
            ),
          }}
        />
        <CodeBlock
          code={`renderFileListItem={({ defaultItem, isActive }) => (
  <div data-active={isActive} className="data-[active=true]:ring-1 ...">
    {defaultItem}
  </div>
)}`}
        />
      </DocSection>
    </DocPage>
  )
}
