import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

export function PdfViewerPaginationPage() {
  return (
    <DocPage
      title="PdfViewer pagination"
      description="Default pagination UI, custom renderPagination, null to hide entire toolbar."
    >
      <DocSection id="default" title="Default pagination">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} />
        </LiveDemo>
      </DocSection>

      <DocSection id="single-page" title="Single-page PDF (no pagination block)">
        <LiveDemo heightClass="h-64">
          <PdfViewer url={SAMPLES.singlePagePdf} />
        </LiveDemo>
        <p className="text-sm text-zinc-500">
          Zoom controls still appear when numPages &lt;= 1.
        </p>
      </DocSection>

      <DocSection id="custom" title="Custom renderPagination">
        <LiveDemo heightClass="h-80">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderPagination={({
              pageNumber,
              numPages,
              previousPage,
              nextPage,
            }) => (
              <div className="flex items-center gap-2 text-sm">
                <button type="button" onClick={previousPage}>
                  ‹
                </button>
                <span>
                  {pageNumber} / {numPages}
                </span>
                <button type="button" onClick={nextPage}>
                  ›
                </button>
              </div>
            )}
          />
        </LiveDemo>
      </DocSection>

      <DocSection id="null-pagination" title="renderPagination={null}">
        <LiveDemo heightClass="h-80" label="Entire floating toolbar hidden">
          <PdfViewer url={SAMPLES.multipagePdf} renderPagination={null} />
        </LiveDemo>
        <CodeBlock code={`<PdfViewer renderPagination={null} ... />`} />
      </DocSection>

      <DocSection id="default-page" title="defaultPage">
        <LiveDemo heightClass="h-80">
          <PdfViewer url={SAMPLES.multipagePdf} defaultPage={3} />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
