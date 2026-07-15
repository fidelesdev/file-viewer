import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const level2Code = `<PdfViewer
  url="/terms.pdf"
  extraToolbarActionsSide="left" // prepend on the left
  extraToolbarActions={({ zoomReset }) => (
    <button
      onClick={zoomReset}
      className="px-2.5 py-1 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded font-semibold transition"
    >
      Reset Zoom
    </button>
  )}
/>`

const level3Code = `<PdfViewer
  url="/terms.pdf"
  renderToolbarActions={({ defaultActions, viewMode }) => (
    <>
      {/* Prepend a dynamic indicator tag */}
      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2 select-none">
        Layout: {viewMode}
      </span>
      {/* Recompose with standard pagination and zoom buttons */}
      {defaultActions}
    </>
  )}
/>`

const pdfToolbarProps = [
  {
    name: 'extraToolbarActions',
    type: 'ReactNode | ((context: PdfToolbarActionsContext) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Custom element or functional callback to inject beside default zoom/page arrow controls.',
  },
  {
    name: 'extraToolbarActionsSide',
    type: '"left" | "right"',
    defaultValue: '"right"',
    description: 'Dictates whether the custom action cluster is prepended (left) or appended (right) to default controls.',
  },
  {
    name: 'renderToolbarActions',
    type: '(props: PdfToolbarActionsRenderProps) => ReactNode',
    defaultValue: 'undefined',
    description: 'Bypasses default action group assembly. Supplies pre-wired defaultActions alongside reactive context methods.',
  },
]

export function PdfViewerToolbarPage() {
  return (
    <DocPage
      title="PdfViewer Toolbar Customization"
      description="Customize the floating toolbar: toggle visible control clusters, inject custom document actions, or recompose layouts using reactive contexts."
    >
      <DocSection id="overview" title="Standalone Toolbar Integration">
        <p className="text-zinc-300 leading-relaxed">
          The standalone <code className="text-emerald-400 font-mono">PdfViewer</code> exposes the exact same 3-level custom toolbar capabilities that are available on the parent <code className="text-zinc-100 font-mono">&lt;FileViewer /&gt;</code> shell.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          This consistency ensures that any custom business buttons (such as page bookmarks, document sign-offs, text-search panels, or page rotations) can be integrated seamlessly, whether you mount the document inside an inline card or an expansive modal window.
        </p>
      </DocSection>

      <DocSection id="level-2" title="Level 2 — Injecting custom Controls (extraToolbarActions)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Inject custom triggers into the floating toolbar using <code className="text-emerald-400 font-mono">extraToolbarActions</code>. By passing a callback, you gain access to the PDF context. Below, we prepend a quick "Reset Zoom" shortcut to the left of the standard controls:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Level 2 Extra Action Prepend (Left)">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            extraToolbarActions={({ zoomReset }) => (
              <button
                type="button"
                onClick={zoomReset}
                className="px-2.5 py-1 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded font-semibold transition"
              >
                Reset Zoom
              </button>
            )}
            extraToolbarActionsSide="left"
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={level2Code} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level-3" title="Level 3 — Recomposing Toolbar Layouts (renderToolbarActions)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For total structural changes, use <code className="text-emerald-400 font-mono">renderToolbarActions</code>. Recompose with <code className="text-zinc-100 font-mono">defaultActions</code> to keep the fully pre-wired pagination arrows and zoom icons while injecting custom elements around them:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Level 3 Recomposed Toolbar Layout">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderToolbarActions={({ defaultActions, viewMode }) => (
              <>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2 select-none border-r border-zinc-800 mr-1.5">
                  Layout: {viewMode}
                </span>
                {defaultActions}
              </>
            )}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={level3Code} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (PdfViewer Toolbar)">
        <PropTable rows={pdfToolbarProps} />
      </DocSection>
    </DocPage>
  )
}
