import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { PropTable } from '../components/PropTable'

const fileViewerProps = [
  { name: 'mode', type: "'inline' | 'modal'", defaultValue: 'inline', description: 'Layout mode' },
  { name: 'open', type: 'boolean', description: 'Controlled visibility' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Visibility callback' },
  { name: 'name', type: 'string', description: 'Display name in header' },
  { name: 'extension', type: 'string', description: 'Drives viewer selection' },
  { name: 'url', type: 'string', description: 'File URL' },
  { name: 'language', type: "'english' | 'portuguese'", defaultValue: 'english', description: 'UI language' },
  { name: 'extraHeaderActions', type: 'ReactNode | fn', description: 'Header level 2' },
  { name: 'extraToolbarActions', type: 'ReactNode | fn', description: 'Toolbar level 2' },
  { name: 'renderHeaderActions', type: 'fn', description: 'Header level 3' },
  { name: 'renderToolbarActions', type: 'fn', description: 'Toolbar level 3' },
  { name: 'pdfViewerProps', type: 'object', description: 'Passthrough to PdfViewer' },
]

const pdfViewerProps = [
  { name: 'url', type: 'string', description: 'PDF URL' },
  { name: 'viewMode', type: "'single' | 'continuous'", defaultValue: 'continuous', description: 'Page layout' },
  { name: 'renderPagination', type: 'fn | null', description: 'Custom pagination; null hides toolbar' },
  { name: 'extraToolbarActions', type: 'ReactNode | fn', description: 'Toolbar level 2' },
  { name: 'renderToolbarActions', type: 'fn', description: 'Toolbar level 3' },
  { name: 'onPageChange', type: '(page: number) => void', description: 'Page change callback' },
]

const imageViewerProps = [
  { name: 'url', type: 'string', description: 'Image URL' },
  { name: 'name', type: 'string', description: 'Alt text' },
  { name: 'extraToolbarActions', type: 'ReactNode | fn', description: 'Toolbar level 2' },
  { name: 'renderToolbarActions', type: 'fn', description: 'Toolbar level 3' },
]

export function ApiReferencePage() {
  return (
    <DocPage
      title="API reference"
      description="Consolidated prop tables. See live examples in each section of the sidebar."
    >
      <DocSection id="file-viewer-props" title="FileViewer props">
        <PropTable rows={fileViewerProps} />
      </DocSection>

      <DocSection id="pdf-viewer-props" title="PdfViewer props">
        <PropTable rows={pdfViewerProps} />
      </DocSection>

      <DocSection id="image-viewer-props" title="ImageViewer props">
        <PropTable rows={imageViewerProps} />
      </DocSection>

      <DocSection id="defaults-tree" title="FileViewerDefaults tree">
        <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
{`setFileViewerDefaults({
  language?: 'english' | 'portuguese'
  fileViewer?: { mode, hideCloseButton, showFullscreenButton, ... }
  pdfViewer?: { viewMode, renderPagination, ... }
  imageViewer?: { classNames, extraToolbarActions, ... }
  toolbar?: { classNames, styles }
  tooltip?: { delayDuration, classNames, ... }
  autoHide?: { proximityThreshold, timeout }
  translations?: DeepPartial<Record<language, FileViewerTranslations>>
})`}
        </pre>
      </DocSection>
    </DocPage>
  )
}
