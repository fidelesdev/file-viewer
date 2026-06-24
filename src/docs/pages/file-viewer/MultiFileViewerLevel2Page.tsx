import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

export function MultiFileViewerLevel2Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 2"
      description="extraFileListHeader adds content above the file list."
    >
      <DocSection id="extra-header" title="extraFileListHeader">
        <InlineMultiFileViewerDemo
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            extraFileListHeader: ({ files, activeIndex }) => (
              <span>
                Attachments ({activeIndex + 1}/{files.length})
              </span>
            ),
          }}
        />
        <CodeBlock
          code={`extraFileListHeader={({ files, activeIndex }) => (
  <span>Attachments ({activeIndex + 1}/{files.length})</span>
)}`}
        />
      </DocSection>
    </DocPage>
  )
}
