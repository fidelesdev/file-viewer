import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const level2Code = `<ImageViewer
  url="/diagram.png"
  name="diagram.png"
  extraToolbarActionsSide="right"
  extraToolbarActions={({ scale, resetTransform }) => (
    <button
      onClick={resetTransform}
      className="px-2 py-1 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded hover:bg-emerald-500/20 font-bold transition"
    >
      Reset ({Math.round(scale * 100)}%)
    </button>
  )}
/>`

const level3Code = `<ImageViewer
  url="/diagram.png"
  name="diagram.png"
  renderToolbarActions={({ scale, zoomIn, zoomOut, resetTransform }) => (
    <div className="flex items-center gap-4 text-xs font-semibold px-2 py-0.5">
      <button onClick={zoomOut} className="hover:text-emerald-400 text-sm font-bold">Zoom −</button>
      <span className="font-mono text-zinc-300">{Math.round(scale * 100)}%</span>
      <button onClick={zoomIn} className="hover:text-emerald-400 text-sm font-bold">Zoom +</button>
      <button onClick={resetTransform} className="text-emerald-400 hover:text-emerald-300 font-bold">Fit View</button>
    </div>
  )}
/>`

const imageToolbarProps = [
  {
    name: 'extraToolbarActions',
    type: 'ReactNode | ((context: ImageToolbarActionsContext) => ReactNode)',
    defaultValue: 'undefined',
    description: 'Custom ReactNode or callback function injected beside default zoom and fit-to-screen controls.',
  },
  {
    name: 'extraToolbarActionsSide',
    type: '"left" | "right"',
    defaultValue: '"right"',
    description: 'Forces the positioning of extra custom actions relative to the default builtin control block.',
  },
  {
    name: 'renderToolbarActions',
    type: '(props: ImageToolbarActionsRenderProps) => ReactNode',
    defaultValue: 'undefined',
    description: 'Completely bypasses default action container layouts. Supplies pre-wired defaultActions alongside viewport transform context methods.',
  },
]

export function ImageViewerToolbarPage() {
  return (
    <DocPage
      title="ImageViewer Toolbar Customization"
      description="Customize the floating actions: toggle builtin zoom indicators, inject metadata labels, or completely replace the action panel."
    >
      <DocSection id="overview" title="Standalone Toolbar Alignment">
        <p className="text-zinc-300 leading-relaxed">
          The standalone <code className="text-emerald-400 font-mono">ImageViewer</code> exposes the same flexible 3-level toolbar customization system used throughout the library. This allows you to easily inject customized actions—such as "Download", "Share", "Rotate Image", or "View Metadata"—directly inside the floating panel.
        </p>
      </DocSection>

      <DocSection id="level-2" title="Level 2 — Injecting Custom Actions (extraToolbarActions)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use the <code className="text-emerald-400 font-mono">extraToolbarActions</code> prop to append customized actions while retaining the default controls. Below, we inject a custom reset button that displays the active zoom percentage:
        </p>

        <LiveDemo heightClass="h-96" label="Injected Action on Image Toolbar">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            extraToolbarActions={({ scale, resetTransform }) => (
              <button
                type="button"
                onClick={resetTransform}
                className="px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded hover:bg-emerald-500/20 font-bold transition mr-1"
              >
                Reset ({Math.round(scale * 100)}%)
              </button>
            )}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={level2Code} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="level-3" title="Level 3 — Recomposing Custom Panels (renderToolbarActions)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use <code className="text-emerald-400 font-mono">renderToolbarActions</code> to gain complete structural control over the toolbar layout. In the example below, we completely replace the standard panel buttons with a minimal, flat text-based interface:
        </p>

        <LiveDemo heightClass="h-96" label="Custom Flat Text Toolbar Layout">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            renderToolbarActions={({ scale, zoomIn, zoomOut, resetTransform }) => (
              <div className="flex items-center gap-3 text-xs font-semibold px-2 py-0.5">
                <button type="button" onClick={zoomOut} className="hover:text-emerald-400 transition text-sm font-bold">−</button>
                <span className="font-mono text-zinc-300">{Math.round(scale * 100)}%</span>
                <button type="button" onClick={zoomIn} className="hover:text-emerald-400 transition text-sm font-bold">+</button>
                <div className="h-3.5 w-[1px] bg-zinc-800" />
                <button type="button" onClick={resetTransform} className="text-emerald-400 hover:text-emerald-300 transition">Recenter</button>
              </div>
            )}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={level3Code} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (ImageViewer Toolbar)">
        <PropTable rows={imageToolbarProps} />
      </DocSection>
    </DocPage>
  )
}
