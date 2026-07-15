import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { PropTable } from '../components/PropTable'
import { CodeBlock } from '../components/CodeBlock'

const fileViewerProps = [
  { name: 'open', type: 'boolean', defaultValue: '—', description: 'Controls the visibility state of the FileViewer (required).' },
  { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: '—', description: 'Callback executed when the open state changes, such as clicking close controls (required).' },
  { name: 'url', type: 'string', defaultValue: '—', description: 'The absolute URL pointing to the target file resource (required).' },
  { name: 'name', type: 'string', defaultValue: '—', description: 'The filename metadata, used in headers and accessibility alt descriptions (required).' },
  { name: 'extension', type: 'string', defaultValue: '—', description: 'The lowercased file format indicator (e.g. "pdf", "jpg", "png") that determines the active rendering viewer. (required)' },
  { name: 'mode', type: '"inline" | "modal"', defaultValue: '"inline"', description: 'Selects the layout architecture. "modal" renders in a portal overlay.' },
  { name: 'language', type: '"english" | "portuguese"', defaultValue: '"english"', description: 'Instance-level localization choice.' },
  { name: 'hideCloseButton', type: 'boolean', defaultValue: 'false', description: 'Hides the top-right close cross icon button.' },
  { name: 'showDownloadButton', type: 'boolean', defaultValue: 'true', description: 'Shows the file download action trigger in the header.' },
  { name: 'showPrintButton', type: 'boolean', defaultValue: 'true', description: 'Shows the print action trigger in the header.' },
  { name: 'showFullscreenButton', type: 'boolean', defaultValue: 'true', description: 'Shows the portal-expansion fullscreen button for inline instances.' },
  { name: 'onDownload', type: '() => void', defaultValue: 'undefined', description: 'Custom click handler that intercepts or audits file downloads.' },
  { name: 'onFullscreen', type: '() => void', defaultValue: 'undefined', description: 'Custom click handler that intercepts default fullscreen transitions.' },
  { name: 'renderUnsupported', type: 'ReactNode | ((context: { url: string; extension: string; name: string }) => ReactNode)', defaultValue: 'undefined', description: 'Custom fallback widget for unsupported file extensions.' },
  { name: 'extraHeaderActions', type: 'ReactNode | ((context: HeaderActionsContext) => ReactNode)', defaultValue: 'undefined', description: 'Level 2 header action extensions.' },
  { name: 'extraToolbarActions', type: 'ReactNode | ((context: ViewerToolbarContext) => ReactNode)', defaultValue: 'undefined', description: 'Level 2 toolbar action extensions.' },
  { name: 'renderHeaderActions', type: '(context: HeaderActionsRenderProps) => ReactNode', defaultValue: 'undefined', description: 'Level 3 complete header actions override.' },
  { name: 'renderToolbarActions', type: '(context: ViewerToolbarRenderProps) => ReactNode', defaultValue: 'undefined', description: 'Level 3 complete toolbar actions override.' },
  { name: 'classNames', type: 'FileViewerClassNames', defaultValue: 'undefined', description: 'CSS class target slots.' },
  { name: 'styles', type: 'FileViewerStyles', defaultValue: 'undefined', description: 'Injected react inline style overrides.' },
  { name: 'pdfViewerProps', type: 'Partial<PdfViewerProps>', defaultValue: 'undefined', description: 'Direct passthrough parameters scoped to the internal PdfViewer.' },
  { name: 'imageViewerProps', type: 'Partial<ImageViewerProps>', defaultValue: 'undefined', description: 'Direct passthrough parameters scoped to the internal ImageViewer.' },
]

const multiFileViewerProps = [
  { name: 'files', type: 'FileItem[]', defaultValue: '[]', description: 'The array of document file descriptors containing url, name, and extension (required).' },
  { name: 'activeIndex', type: 'number', defaultValue: '0', description: 'Controlled index for selecting active active sheet sheets.' },
  { name: 'onActiveIndexChange', type: '(index: number) => void', defaultValue: 'undefined', description: 'Callback triggered when clicking file list items.' },
  { name: 'layout', type: '"sidebar" | "stack"', defaultValue: '"sidebar"', description: 'Layout choice: "sidebar" displays collapsible items, "stack" nests document tiles.' },
  { name: 'fileListCollapsible', type: 'boolean', defaultValue: 'true', description: 'Enables or disables manual collapsing of the vertical sidebar.' },
  { name: 'defaultFileListCollapsed', type: 'boolean', defaultValue: 'false', description: 'Determines the initial vertical list panel state.' },
  { name: 'hideFileListWhenSingle', type: 'boolean', defaultValue: 'false', description: 'Automatically collapses sidebar layouts if the files list size is 1.' },
  { name: 'extraFileListHeader', type: 'ReactNode | ((context: FileListHeaderContext) => ReactNode)', defaultValue: 'undefined', description: 'Level 2 progress indicators or filter bars.' },
  { name: 'renderFileList', type: '(context: FileListRenderProps) => ReactNode', defaultValue: 'undefined', description: 'Level 3 custom panel container override.' },
  { name: 'renderFileListItem', type: '(context: FileListItemRenderProps) => ReactNode', defaultValue: 'undefined', description: 'Level 3 custom individual tile item override.' },
]

const pdfViewerProps = [
  { name: 'url', type: 'string', defaultValue: '—', description: 'The direct source URL of the PDF document. (required)' },
  { name: 'viewMode', type: '"single" | "continuous"', defaultValue: '"continuous"', description: 'Page layout. "continuous" vertically scrolls pages, "single" focuses page-by-page.' },
  { name: 'renderTextLayer', type: 'boolean', defaultValue: 'true', description: 'Renders the selection text overlay allowing clipboard copy/highlight.' },
  { name: 'renderAnnotationLayer', type: 'boolean', defaultValue: 'true', description: 'Compiles and overlay elements like clickable hyperlinks and forms.' },
  { name: 'preloadAhead', type: 'number', defaultValue: '1', description: 'Number of pages cached ahead and behind the active viewport in continuous view.' },
  { name: 'debounceDelay', type: 'number', defaultValue: '300', description: 'The delay (ms) applied before re-rendering sheets on container changes.' },
  { name: 'zoomDebounceDelay', type: 'number', defaultValue: '500', description: 'The delay (ms) applied after zooming before rebuilding HD canvases.' },
  { name: 'renderPagination', type: 'ReactNode | ((props: PaginationRenderProps) => ReactNode) | null', defaultValue: 'undefined', description: 'Custom pagination controls; null completely suppresses the pagination bar.' },
]

const imageViewerProps = [
  { name: 'url', type: 'string', defaultValue: '—', description: 'The direct source URL of the image. (required)' },
  { name: 'name', type: 'string', defaultValue: '—', description: 'The metadata filename for alt attributes and action logs. (required)' },
  { name: 'language', type: 'ViewerLanguage', defaultValue: '"english"', description: 'Language preference for interactive controls and ARIA descriptions.' },
  { name: 'classNames', type: 'ImageViewerClassNames', defaultValue: 'undefined', description: 'CSS class target slots.' },
]

const defaultsTreeCode = `export interface FileViewerDefaults {
  language?: 'english' | 'portuguese';
  fileViewer?: {
    mode?: 'inline' | 'modal';
    hideCloseButton?: boolean;
    showFullscreenButton?: boolean;
    showPrintButton?: boolean;
    showDownloadButton?: boolean;
    className?: string;
  };
  multiFileViewer?: {
    layout?: 'sidebar' | 'stack';
    fileListCollapsible?: boolean;
    defaultFileListCollapsed?: boolean;
    hideFileListWhenSingle?: boolean;
  };
  pdfViewer?: {
    viewMode?: 'single' | 'continuous';
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    preloadAhead?: number;
    debounceDelay?: number;
    zoomDebounceDelay?: number;
  };
  imageViewer?: {
    language?: 'english' | 'portuguese';
  };
  tooltip?: {
    delayDuration?: number;
    skipDelayDuration?: number;
    classNames?: {
      content?: string;
      arrow?: string;
    };
  };
  autoHide?: {
    proximityThreshold?: number;
    timeout?: number;
  };
}`

export function ApiReferencePage() {
  return (
    <DocPage
      title="Complete API Reference & Prop Specs"
      description="Access the comprehensive, consolidated list of all properties, event callback signatures, and global defaults types available in the library."
    >
      <DocSection id="file-viewer-props" title="FileViewer Props Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The following properties control the main shell wrapper <code className="text-zinc-100 font-mono">&lt;FileViewer /&gt;</code>:
        </p>
        <PropTable rows={fileViewerProps} />
      </DocSection>

      <DocSection id="multi-file-viewer-props" title="MultiFileViewer Props Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These settings apply when managing multiple documents using <code className="text-zinc-100 font-mono">&lt;MultiFileViewer /&gt;</code>:
        </p>
        <PropTable rows={multiFileViewerProps} />
      </DocSection>

      <DocSection id="pdf-viewer-props" title="PdfViewer Props Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Properties scoped exclusively to the standalone <code className="text-zinc-100 font-mono">&lt;PdfViewer /&gt;</code> component:
        </p>
        <PropTable rows={pdfViewerProps} />
      </DocSection>

      <DocSection id="image-viewer-props" title="ImageViewer Props Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Properties scoped exclusively to the standalone <code className="text-zinc-100 font-mono">&lt;ImageViewer /&gt;</code> component:
        </p>
        <PropTable rows={imageViewerProps} />
      </DocSection>

      <DocSection id="defaults-tree" title="FileViewerDefaults Type Structure">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The typescript interface defining the deep-merged configuration tree passed to <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>:
        </p>
        <CodeBlock code={defaultsTreeCode} language="typescript" />
      </DocSection>
    </DocPage>
  )
}
