import {
  FileViewerTooltip,
  FileViewerTooltipProvider,
} from '@/features/file-viewer'
import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { CodeBlock } from '../components/CodeBlock'
import { PropTable } from '../components/PropTable'
import { LiveDemo } from '../components/LiveDemo'

const basicUsageCode = `import {
  FileViewerTooltipProvider,
  FileViewerTooltip
} from '@fdls/file-viewer'

export function CustomActionsBar() {
  return (
    <FileViewerTooltipProvider>
      <div className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        {/* Wrapping custom actions in the consistent library tooltip primitive */}
        <FileViewerTooltip content="Sync Document with Cloud Database">
          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold text-white transition">
            Sync File
          </button>
        </FileViewerTooltip>

        <FileViewerTooltip content="Download disabled - Insufficient permissions" disabled>
          <span className="cursor-not-allowed">
            <button disabled className="px-3 py-1.5 bg-zinc-800 rounded text-xs font-semibold text-zinc-500 opacity-50">
              Download
            </button>
          </span>
        </FileViewerTooltip>
      </div>
    </FileViewerTooltipProvider>
  )
}`

const tooltipPropsRef = [
  {
    name: 'content',
    type: 'ReactNode',
    defaultValue: '—',
    description: 'The label or React element to render inside the floating tooltip card (required).',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Suppresses the tooltip display. Essential for conditionally disabling hover tips.',
  },
  {
    name: 'delayDuration',
    type: 'number',
    defaultValue: '500',
    description: 'Local override for hover duration (ms) before fading in tooltip content.',
  },
  {
    name: 'side',
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    description: 'Determines the floating card layout position relative to the nested child trigger element.',
  },
  {
    name: 'align',
    type: '"start" | "center" | "end"',
    defaultValue: '"center"',
    description: 'Aligns the tooltip box relative to the target trigger.',
  },
]

export function TooltipComponentPage() {
  return (
    <DocPage
      title="FileViewerTooltip Primitives"
      description="Expose core UI primitives: leverage Radix-based tooltips to build consistent custom headers, lists, and action buttons."
    >
      <DocSection id="overview" title="The Custom Action Consistency Problem">
        <p className="text-zinc-300 leading-relaxed">
          When extending <code className="text-emerald-400 font-mono">FileViewer</code> with Level 2 extensions (<code className="text-zinc-100 font-mono">extraHeaderActions</code>) or Level 3 composition layouts (<code className="text-zinc-100 font-mono">renderFileListItem</code>), introducing custom tooltips from third-party libraries can lead to styling mismatches, inconsistent fade animations, and conflicting hover timing states.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          To solve this, the library exposes its internal <strong className="text-zinc-100">Radix-powered Tooltip primitives</strong> directly to developers. This ensures that every customized action button, badge, or status indicator you build matches the exact pixel styles, hover timings, and accessibility guidelines of the native UI.
        </p>
      </DocSection>

      <DocSection id="usage" title="Standard Usage & Disabled Propagation">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Place <code className="text-emerald-400 font-mono">FileViewerTooltipProvider</code> near your layouts root, then wrap custom action buttons inside <code className="text-emerald-400 font-mono">FileViewerTooltip</code>.
        </p>
        <p className="text-zinc-300 mb-4 leading-relaxed">
          <strong className="text-zinc-200">⚠️ Critical HTML/React Note on Disabled Elements:</strong> Standard browser buttons with the <code className="text-zinc-300 font-mono">disabled</code> attribute do not fire mouse pointer events. Consequently, tooltips wrapped around a standard disabled button will never trigger. To work around this, set the tooltip's <code className="text-emerald-400 font-mono">disabled</code> prop to suppress the tooltip, or wrap the disabled button in a non-disabled container (such as a <code className="text-zinc-300 font-mono">&lt;span className="cursor-not-allowed"&gt;</code>) to correctly capture hover events:
        </p>

        <LiveDemo heightClass="h-44" label="Custom Elements Hover Sandbox">
          <FileViewerTooltipProvider>
            <div className="flex gap-4 rounded-lg border border-zinc-850 p-6 bg-zinc-950/60 justify-center">
              <FileViewerTooltip content="Sync Document with Cloud Database">
                <button
                  type="button"
                  className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition"
                >
                  Sync File
                </button>
              </FileViewerTooltip>
              <FileViewerTooltip content="Download disabled — Insufficient credentials">
                <span className="cursor-not-allowed">
                  <button
                    type="button"
                    disabled
                    className="rounded bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-500 opacity-50 cursor-not-allowed"
                  >
                    Download File
                  </button>
                </span>
              </FileViewerTooltip>
            </div>
          </FileViewerTooltipProvider>
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={basicUsageCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (FileViewerTooltip)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The following properties control individual <code className="text-zinc-100 font-mono">&lt;FileViewerTooltip /&gt;</code> wrappers:
        </p>
        <PropTable rows={tooltipPropsRef} />
      </DocSection>
    </DocPage>
  )
}
