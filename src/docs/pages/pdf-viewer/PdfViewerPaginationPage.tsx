import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const customPaginationCode = `<PdfViewer
  url="/terms-of-service.pdf"
  renderPagination={({
    pageNumber,
    numPages,
    previousPage,
    nextPage,
    goToPage,
  }) => (
    <div className="flex items-center gap-4 bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-800 text-xs">
      <button onClick={() => goToPage(1)} className="hover:text-emerald-400">First</button>
      <button onClick={previousPage} className="font-bold hover:text-emerald-400">‹ Previous</button>
      <span>{pageNumber} / {numPages}</span>
      <button onClick={nextPage} className="font-bold hover:text-emerald-400">Next ›</button>
    </div>
  )}
/>`

const hideToolbarCode = `<PdfViewer
  url="/uncontrolled.pdf"
  renderPagination={null} // completely suppresses the floating toolbar widget
/>`

const paginationArgsRef = [
  { name: 'pageNumber', type: 'number', description: 'The active logical page index currently focused (1-indexed).' },
  { name: 'numPages', type: 'number', description: 'The total pages of the compiled document.' },
  { name: 'previousPage', type: '() => void', description: 'Trigger function to scroll/slide back by 1 page.' },
  { name: 'nextPage', type: '() => void', description: 'Trigger function to scroll/slide forward by 1 page.' },
  { name: 'goToPage', type: '(page: number) => void', description: 'Trigger function to navigate directly to any target page.' },
  { name: 'isFirstPage', type: 'boolean', description: 'True when the user is on page 1.' },
  { name: 'isLastPage', type: 'boolean', description: 'True when the page matches the total document count.' },
  { name: 'viewMode', type: '"single" | "continuous"', description: 'The active layout style.' },
]

export function PdfViewerPaginationPage() {
  return (
    <DocPage
      title="PdfViewer Pagination & Navigation"
      description="Manage page navigation: set initial entry pages, customize floating indicator layouts, or suppress toolbars completely."
    >
      <DocSection id="overview" title="The Navigation Framework">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">PdfViewer</code> handles navigation using a dual input mechanism. Users can slide scrollbars or use continuous scroll, click previous/next buttons, or type an explicit page index into the input box and press Enter.
        </p>
      </DocSection>

      <DocSection id="default" title="Default Interactive Pagination">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          By default, the floating toolbar features a fully styled numeric pagination stepper. In continuous mode, this stepper is locked to the scroll position, updating dynamically as different pages cross the viewport focus line.
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Default Pagination Stepper">
          <PdfViewer url={SAMPLES.multipagePdf} />
        </LiveDemo>
      </DocSection>

      <DocSection id="single-page" title="Automatic Suppression for Single-Page Documents">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If a loaded PDF contains exactly <strong className="text-zinc-100">1 page</strong>, the floating toolbar automatically hides all pagination controls (arrows, page inputs, slashes). This reduces UI clutter for small receipts or single invoice documents, while <strong className="text-emerald-400 font-medium">retaining zoom controls</strong>.
        </p>

        <LiveDemo heightClass="h-64" label="Single-Page PDF Automatic Suppression">
          <PdfViewer url={SAMPLES.singlePagePdf} />
        </LiveDemo>
      </DocSection>

      <DocSection id="custom" title="Custom Stepper layout (renderPagination)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If your design system requires custom pagination controls (e.g. text labels instead of arrows, or first/last buttons), pass a custom layout using <code className="text-emerald-400 font-mono">renderPagination</code>:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Custom pagination render callback">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderPagination={({
              pageNumber,
              numPages,
              previousPage,
              nextPage,
            }) => (
              <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-semibold">
                <button type="button" onClick={previousPage} className="hover:text-emerald-400 transition">
                  ‹ Prev
                </button>
                <span className="text-zinc-400">
                  {pageNumber} / {numPages}
                </span>
                <button type="button" onClick={nextPage} className="hover:text-emerald-400 transition">
                  Next ›
                </button>
              </div>
            )}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={customPaginationCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="null-pagination" title="Bypassing the Entire Toolbar">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In compact document card previews, terms-of-service columns, or layouts where zoom/scroll controls are handled externally, pass <code className="text-emerald-400 font-mono">renderPagination={null}</code> to completely disable and hide the floating toolbar widget.
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Entire Floating Toolbar Hidden">
          <PdfViewer url={SAMPLES.multipagePdf} renderPagination={null} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={hideToolbarCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="default-page" title="Configuring starting pages (defaultPage)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use the <code className="text-emerald-400 font-mono">defaultPage</code> prop to configure the document viewer to load at a specific page on mount (e.g., opening a report on page 3):
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Pre-loaded on Page 3">
          <PdfViewer url={SAMPLES.multipagePdf} defaultPage={3} />
        </LiveDemo>
      </DocSection>

      <DocSection id="args-ref" title="renderPagination Callback Arguments Reference">
        <PropTable rows={paginationArgsRef} />
      </DocSection>
    </DocPage>
  )
}
