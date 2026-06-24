import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

export function MultiFileViewerLevel1Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 1"
      description="Style file list slots with classNames / styles. Override panel width and strip height via styles.fileList or CSS variables."
    >
      <DocSection id="file-list-width" title="Custom sidebar width">
        <InlineMultiFileViewerDemo
          label="styles.fileList.width = 22rem"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            styles: {
              fileList: { width: '22rem' },
            },
          }}
        />
        <CodeBlock
          code={`styles={{ fileList: { width: '22rem' } }}
// or on root:
style={{ '--fv-multi-file-list-width': '22rem' } as CSSProperties}`}
        />
      </DocSection>

      <DocSection id="stack-strip-height" title="Custom stack strip height">
        <InlineMultiFileViewerDemo
          label="Horizontal stack strip height"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'stack',
            styles: {
              fileList: { height: '4rem' },
            },
          }}
        />
      </DocSection>

      <DocSection id="hide-single" title="hideFileListWhenSingle">
        <InlineMultiFileViewerDemo
          label="Single file — list hidden"
          multiFileViewerProps={{
            files: [DEMO_FILES[0]],
            hideFileListWhenSingle: true,
          }}
        />
      </DocSection>
    </DocPage>
  )
}
