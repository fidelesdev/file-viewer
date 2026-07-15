import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineMultiFileViewerDemo } from '../../components/MultiFileViewerDemo'
import { DEMO_FILES } from '../../demos/multi-file-samples'

const inlineStyleCode = `<MultiFileViewer
  files={files}
  layout="sidebar"
  styles={{
    // Expand the navigation list panel width
    fileList: { width: '22rem' },
    // Animate list items slightly on focus
    fileListItem: { transition: 'transform 150ms ease' },
  }}
/>`

const cssVarOverrideCode = `/* In your global stylesheet or via inline variables style: */
.custom-workspace-viewer {
  --fv-multi-file-list-width: 20rem;
  --fv-multi-file-list-collapsed-width: 3.5rem;
  --fv-multi-file-list-strip-height: 4rem;
  --fv-multi-file-list-toolbar-height: 3.5rem;
}`

const hideSingleCode = `<MultiFileViewer
  files={singleFileArray} // Array contains exactly 1 item
  hideFileListWhenSingle={true} // Automatically hides sidebar to maximize viewport area
/>`

const level1MultiProps = [
  {
    name: 'hideFileListWhenSingle',
    type: 'boolean',
    defaultValue: 'false',
    description: 'When true, automatically hides the list navigation sidebar/row when files.length is equal to 1 or less.',
  },
  {
    name: 'classNames',
    type: 'MultiFileViewerClassNames',
    defaultValue: 'undefined',
    description: 'Map of target class strings to style elements in the MultiFileViewer shell (e.g. fileListShell, preview).',
  },
  {
    name: 'styles',
    type: 'MultiFileViewerStyles',
    defaultValue: 'undefined',
    description: 'Map of CSSProperties objects to style elements in the MultiFileViewer shell (e.g. fileList, empty).',
  },
]

const cssVarsList = [
  { name: '--fv-multi-file-list-width', type: '15rem', description: 'Width of the list navigation sidebar in default expand state.' },
  { name: '--fv-multi-file-list-collapsed-width', type: '2.75rem', description: 'Width of the list navigation sidebar when collapsed.' },
  { name: '--fv-multi-file-list-strip-height', type: '3.25rem', description: 'The height of each vertical list item entry strip.' },
  { name: '--fv-multi-file-list-toolbar-height', type: '3rem', description: 'The height of the list column header toolbar.' },
]

export function MultiFileViewerLevel1Page() {
  return (
    <DocPage
      title="MultiFileViewer — Level 1"
      description="Declarative list customization: adjust panel widths, configure horizontal row heights, hide navigation panels dynamically, and override CSS variables."
    >
      <DocSection id="overview" title="Level 1 Concept: Layout Dimensions">
        <p className="text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Level 1 Customization</strong> for MultiFileViewer gives you simple declarative variables to style the navigation panel and items. 
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          By adjusting panel sizes, hiding indicators when list arrays are small, or applying class maps, you can customize the multi-file list box while preserving full keyboard navigability and access parameters.
        </p>
      </DocSection>

      <DocSection id="file-list-width" title="Custom Sidebar Column Width">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          By default, the sidebar navigation panel is restricted to <code className="text-zinc-100 font-mono">15rem</code>. If your documents have very long filenames, expand the column width using <code className="text-emerald-400 font-mono">styles.fileList.width</code> to prevent text truncation:
        </p>

        <InlineMultiFileViewerDemo
          label="Sidebar List Panel (Width: 22rem)"
          multiFileViewerProps={{
            files: DEMO_FILES,
            layout: 'sidebar',
            styles: {
              fileList: { width: '22rem' },
            },
          }}
          heightClass="h-[28rem]"
        />

        <div className="mt-4">
          <CodeBlock code={inlineStyleCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="css-variables" title="Design Tokens (CSS Overrides)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The dimensions, transition speeds, and borders of the list column are managed through standard CSS variables. Override these variables inside a custom class to style both horizontal chip strips and vertical columns:
        </p>
        <CodeBlock code={cssVarOverrideCode} language="css" />
      </DocSection>

      <DocSection id="hide-single" title="Dynamic Panel Collapsing (hideFileListWhenSingle)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If your database contains records with a variable number of attachments, displaying a navigation list for a single file is redundant and wastes view area. Enable <code className="text-emerald-400 font-mono">hideFileListWhenSingle</code> to automatically hide the navigation list when only one item exists:
        </p>

        <InlineMultiFileViewerDemo
          label="Single File Input — Sidebar Navigation Automatically Hidden"
          multiFileViewerProps={{
            files: [DEMO_FILES[0]],
            hideFileListWhenSingle: true,
          }}
          heightClass="h-[24rem]"
        />

        <div className="mt-4">
          <CodeBlock code={hideSingleCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level1-props" title="Props Reference (Level 1 Multi-File)">
        <PropTable rows={level1MultiProps} />
      </DocSection>

      <DocSection id="css-vars-reference" title="CSS Variable Reference (Multi-File)">
        <PropTable rows={cssVarsList.map((v) => ({ name: v.name, type: v.type, defaultValue: '—', description: v.description }))} />
      </DocSection>
    </DocPage>
  )
}
