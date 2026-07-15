import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const performanceTuneCode = `<PdfViewer
  url="/huge-book.pdf"
  debounceDelay={500}       // delays canvas re-renders during column drags
  zoomDebounceDelay={700}   // delays HD canvas compiles during quick zoom clicks
  preloadAhead={2}          // loads 2 pages ahead/behind in scroll viewport
/>`

const performanceProps = [
  {
    name: 'debounceDelay',
    type: 'number',
    defaultValue: '300',
    description: 'The delay (ms) applied before re-rendering the sheet layout elements when a container ResizeObserver emits dimension changes.',
  },
  {
    name: 'zoomDebounceDelay',
    type: 'number',
    defaultValue: '500',
    description: 'The delay (ms) applied after the user stops zooming (clicks, wheel, gestures) before recompiling high-definition PDF canvas layers.',
  },
  {
    name: 'preloadAhead',
    type: 'number',
    defaultValue: '1',
    description: 'The number of adjacent sheets preloaded ahead and behind the active visible viewport window in continuous mode.',
  },
]

export function PdfViewerPerformancePage() {
  return (
    <DocPage
      title="PdfViewer Performance & Resizing"
      description="Fine-tune rendering performance: configure container debouncing, optimize zoom compiling delays, and balance memory bounds with lazy viewport buffers."
    >
      <DocSection id="resize-debounce" title="The Debounced Resize Engine">
        <p className="text-zinc-300 leading-relaxed">
          Rendering a high-definition PDF canvas is a CPU and GPU intensive task. In modern web layouts (such as drag-and-drop column resizers or collapsible side panels), window resizes trigger continuous dimension updates.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          If the document viewer attempted to re-render the HD PDF sheets on every frame of a resize operation (e.g. 60 times per second), the browser thread would instantly lock up.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          To solve this, <code className="text-emerald-400 font-mono">PdfViewer</code> implements an advanced <strong className="text-zinc-100">Debounced Settle & Squeeze Pipeline</strong>:
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-3 text-zinc-400">
          <li>
            <strong className="text-zinc-200">1. Squeeze Placeholders:</strong> As the container resizes, we freeze page rendering and instantly scale page sheets using lightweight, hardware-accelerated CSS transforms.
          </li>
          <li>
            <strong className="text-zinc-200">2. Settle Debounce:</strong> We wait for a quiet period (controlled by <code className="text-emerald-400 font-mono">debounceDelay</code>) indicating the resizing action has finished.
          </li>
          <li>
            <strong className="text-zinc-200">3. HD Settle & Re-render:</strong> Once settled, we re-render the underlying canvas sheets to match the precise resolution of the final container width.
          </li>
        </ol>
      </DocSection>

      <DocSection id="debounce" title="Configuring Resize & Zoom Debounce">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For lower-end devices or very long documents (100+ pages), increase <code className="text-emerald-400 font-mono">debounceDelay</code> and <code className="text-emerald-400 font-mono">zoomDebounceDelay</code> to prioritize smooth animations during sidebar transitions:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="High-Debounce Tuned Instance">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            debounceDelay={600}
            zoomDebounceDelay={800}
          />
        </LiveDemo>

        <p className="mt-3 text-sm text-zinc-500 italic">
          Try collapsing/expanding the sidebars or changing zoom scales. You will notice the layout adapts instantly, while the sharp text rendering resolves half a second after scrolling/zooming ceases.
        </p>
      </DocSection>

      <DocSection id="preload" title="Memory Allocation (preloadAhead)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In continuous mode, the viewer uses a virtual scroll area that mounts canvas elements only when they are visible. The <code className="text-emerald-400 font-mono">preloadAhead</code> prop controls the buffer size—how many pages above and below the active screen viewport are mounted in the background.
        </p>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Setting <code className="text-emerald-400 font-mono">preloadAhead={1}</code> is excellent for most networks, pre-rendering the next page before the user scrolls to it. Increase to <code className="text-zinc-100 font-mono">2</code> or <code className="text-zinc-100 font-mono">3</code> for faster reading on high-spec systems, or set to <code className="text-zinc-100 font-mono">0</code> to minimize memory usage.
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Preload Ahead Set to 2">
          <PdfViewer url={SAMPLES.multipagePdf} preloadAhead={2} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={performanceTuneCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="performance-props" title="Props Reference (Performance Tuning)">
        <PropTable rows={performanceProps} />
      </DocSection>
    </DocPage>
  )
}
