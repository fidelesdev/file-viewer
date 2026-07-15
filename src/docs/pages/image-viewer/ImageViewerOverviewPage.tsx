import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const standaloneCode = `import { ImageViewer } from '@fdls/file-viewer'

export function StandaloneImage() {
  return (
    <div className="w-full h-[500px] border border-zinc-800 rounded-lg overflow-hidden">
      <ImageViewer
        url="https://example.com/assets/blueprints.png"
        name="structural-blueprints.png"
        language="english"
      />
    </div>
  )
}`

const imageViewerPropsRef = [
  {
    name: 'url',
    type: 'string',
    defaultValue: '—',
    description: 'The direct source URL of the image. Required.',
  },
  {
    name: 'name',
    type: 'string',
    defaultValue: '—',
    description: 'The filename metadata used for accessibility alt attributes and action logs. Required.',
  },
  {
    name: 'language',
    type: 'ViewerLanguage',
    defaultValue: '"english"',
    description: 'Adjusts the languages of floating zoom button tooltips and ARIA indicators.',
  },
  {
    name: 'classNames',
    type: 'ImageViewerClassNames',
    defaultValue: 'undefined',
    description: 'Target style slots to override CSS layouts (root, loader, image, toolbar, etc.).',
  },
  {
    name: 'styles',
    type: 'ImageViewerStyles',
    defaultValue: 'undefined',
    description: 'React.CSSProperties mapping injected onto target slots.',
  },
]

export function ImageViewerOverviewPage() {
  return (
    <DocPage
      title="ImageViewer Overview"
      description="Standalone Image Preview Engine: render JPEGs, JPGs, and PNGs with high-performance hardware-accelerated pan, pinch, gesture zooms, and auto-hiding toolbars."
    >
      <DocSection id="concept" title="Standalone Image Preview Engine">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">ImageViewer</code> is a high-performance visualizer designed for previewing standard raster image formats (<code className="text-zinc-100 font-mono">.jpg</code>, <code className="text-zinc-100 font-mono">.jpeg</code>, and <code className="text-zinc-100 font-mono">.png</code>). It runs perfectly standalone outside of the main shell, making it excellent for rendering inline photos, receipt captures, user profile pictures, or interactive blueprints.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Under the hood, it is powered by <strong className="text-zinc-100">react-zoom-pan-pinch</strong>, which utilizes hardware-accelerated CSS 3D transforms. This offloads gesture rendering completely to the client's GPU, delivering 60 FPS panning, zooming, and trackpad pinches.
        </p>
      </DocSection>

      <DocSection id="dynamic-scale" title="Dynamic Max-Zoom Calculations">
        <p className="text-zinc-300 leading-relaxed">
          Rather than hardcoding arbitrary zoom boundaries, the visualizer implements a <strong className="text-zinc-100">Natural Resolution Inspection pipeline</strong>.
        </p>
        <p className="mt-2 text-zinc-300 leading-relaxed">
          On image load, the engine inspects the image's natural pixel dimensions and compares them to the active client container width. It calculates a tailored zoom upper bound (floored at 4x and capped at 16x) that allows high-resolution photos to be inspected down to the pixel, while preventing smaller screenshots from becoming excessively pixelated.
        </p>
      </DocSection>

      <DocSection id="minimal" title="Minimal Standalone Usage">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Supply a direct source <code className="text-emerald-400 font-mono">url</code> and a descriptive <code className="text-emerald-400 font-mono">name</code>. Hover over the photo to activate the auto-hiding navigation toolbar, and drag or double-click to pan and zoom:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Standalone ImageViewer Panel">
          <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={standaloneCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (ImageViewer)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The following properties control the standalone <code className="text-zinc-100 font-mono">&lt;ImageViewer /&gt;</code> component:
        </p>
        <PropTable rows={imageViewerPropsRef} />
      </DocSection>
    </DocPage>
  )
}
