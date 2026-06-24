import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { CodeBlock } from '../components/CodeBlock'
import { InlineFileViewerDemo } from '../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../demos/assets'

const workerCode = `import { configureFileViewerPdfWorker } from '@fdls/file-viewer'

configureFileViewerPdfWorker()`

const cssCode = `import '@fdls/file-viewer/style.css'`

const minimalCode = `<FileViewer
  open={open}
  onOpenChange={setOpen}
  name="document.pdf"
  extension="pdf"
  url="/path/to/file.pdf"
/>`

export function GettingStartedPage() {
  return (
    <DocPage
      title="Quick start"
      description="Install the package, configure the PDF worker, import styles, and render FileViewer."
    >
      <DocSection id="install" title="Installation">
        <CodeBlock code="npm install @fdls/file-viewer" />
      </DocSection>

      <DocSection id="pdf-worker" title="Configure PDF worker">
        <p>
          Call once in your app entry before rendering any PDF. Required for
          pdfjs-dist worker resolution.
        </p>
        <CodeBlock code={workerCode} />
      </DocSection>

      <DocSection id="styles" title="Import styles">
        <CodeBlock code={cssCode} />
      </DocSection>

      <DocSection id="minimal-example" title="Minimal FileViewer">
        <CodeBlock code={minimalCode} />
        <InlineFileViewerDemo
          fileViewerProps={{
            name: SAMPLE_NAMES.multipagePdf,
            extension: 'pdf',
            url: SAMPLES.multipagePdf,
          }}
        />
      </DocSection>
    </DocPage>
  )
}
