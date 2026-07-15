import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const continuousCode = `<PdfViewer
  url="/document.pdf"
  viewMode="continuous" // vertical scrollable feed (Default)
  preloadAhead={1}       // lazy preloads adjacent pages
/>`

const singlePageCode = `<PdfViewer
  url="/document.pdf"
  viewMode="single" // invoice/slide presentation mode
  defaultPage={1}
/>`

export function PdfViewerViewModesPage() {
  return (
    <DocPage
      title="PdfViewer View Modes"
      description="Compare document display layouts: 'continuous' for a scrolling vertical page feed, or 'single' for invoice card presentations."
    >
      <DocSection id="overview" title="Layout Strategies">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">viewMode</code> property determines how pages are laid out on the viewport. Choosing the appropriate format is essential for matching the document's structure to your user's expectations.
        </p>
      </DocSection>

      <DocSection id="continuous" title="viewMode: continuous (Default)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In <code className="text-emerald-400 font-mono">continuous</code> mode, all pages are stacked vertically with a pre-styled 16px gap, and navigated using vertical scrollbars. This is the optimal presentation for multi-page contracts, text reports, brochures, and ebooks.
        </p>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Under the hood, <strong className="text-zinc-100">continuous mode uses an IntersectionObserver</strong> to track which page is most visible in real-time, syncing the floating pagination inputs as the user scrolls. Additionally, to optimize browser memory and CPU, only visible pages (plus a small buffer controlled by <code className="text-zinc-300 font-mono">preloadAhead</code>) are mounted in the DOM. Unseen pages are rendered as lightweight color placeholders.
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Continuous Feed View Mode">
          <PdfViewer url={SAMPLES.multipagePdf} viewMode="continuous" />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={continuousCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="single" title="viewMode: single">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In <code className="text-emerald-400 font-mono">single</code> mode, only one page is mounted and rendered at any given time. Clicking the next or previous triggers swaps the active page index instantly, resetting the scroll focus to the top.
        </p>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          This slide-presentation format is excellent for displaying isolated, page-contained documents like <strong className="text-zinc-100">single receipts, utility invoices, presentation slides, or visual forms</strong>. Because only one canvas is mounted, it has an incredibly low memory footprint, making it perfect for displaying dense scanned files.
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Page-by-Page View Mode">
          <PdfViewer url={SAMPLES.multipagePdf} viewMode="single" />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={singlePageCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="tradeoffs" title="Architectural Tradeoffs">
        <div className="overflow-x-auto rounded-lg border border-zinc-800 mt-4">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Continuous Mode</th>
                <th className="px-4 py-3">Single Page Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr>
                <td className="px-4 py-3 font-semibold">User Experience</td>
                <td className="px-4 py-3 text-zinc-400">Natural reading flow, scroll gesture navigation.</td>
                <td className="px-4 py-3 text-zinc-400">Step-by-step navigation, focused slide presentation.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">RAM Usage</td>
                <td className="px-4 py-3 text-zinc-400">Moderate. Cached pages are held in memory.</td>
                <td className="px-4 py-3 text-zinc-400">Extremely Low. Only 1 canvas remains in memory.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Preloading</td>
                <td className="px-4 py-3 text-zinc-400">Yes. Adjacent pages are loaded in the background.</td>
                <td className="px-4 py-3 text-zinc-400">No. Swapping triggers direct mounting.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Best Suited For</td>
                <td className="px-4 py-3 text-zinc-400">Contracts, multi-page legal dossiers, books.</td>
                <td className="px-4 py-3 text-zinc-400">Invoices, slide decks, certificates, receipts.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>
    </DocPage>
  )
}
