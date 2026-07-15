import { useState } from 'react'
import type { ImageViewerClassNames } from '@/features/file-viewer'
import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'
import { CodeBlock } from '../../components/CodeBlock'

const imageSlots = [
  { key: 'root', label: 'root' },
  { key: 'image', label: 'image' },
  { key: 'toolbar', label: 'toolbar' },
  { key: 'loader', label: 'loader' },
]

const customSlotsCode = `<ImageViewer
  url="/portrait.jpg"
  name="portrait.jpg"
  classNames={{
    root: 'rounded-xl border-4 border-dashed border-zinc-800 bg-zinc-950',
    image: 'filter sepia brightness-90',
    toolbar: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/20 px-4 py-2 rounded-lg',
  }}
/>`

const objectFitCode = `/* In your globals.css or local styled block */
.custom-thumbnail-grid {
  --fv-image-object-fit: cover; /* stretches/crops the thumbnail to fill */
  --fv-image-bg: #0c0a09;        /* solid background */
}`

const slotsPropsRef = [
  { name: 'root', type: 'string', description: 'Target class injected onto the outermost viewport container block.' },
  { name: 'image', type: 'string', description: 'Styles the immediate <img> element rendering the preview asset.' },
  { name: 'toolbar', type: 'string', description: 'Styles the absolute floating toolbar overlay element.' },
  { name: 'loader', type: 'string', description: 'Styles the loading overlay panel centered during fetch states.' },
]

const tokensList = [
  { name: '--fv-image-bg', type: '#000000', description: 'The color of the main background panel.' },
  { name: '--fv-image-object-fit', type: 'contain', description: 'CSS object-fit property for the image tag (e.g. contain, cover, fill).' },
  { name: '--fv-image-grid-pattern', type: 'linear-gradient(...)', description: 'Background pattern for transparent PNG images (typically a dual-tone checkerboard gradient).' },
]

export function ImageViewerStylingPage() {
  const [classNames, setClassNames] = useState<Partial<ImageViewerClassNames>>({})

  return (
    <DocPage
      title="ImageViewer Styling"
      description="Brand image viewers: configure transparency checkerboard grids, override object-fit scaling variables, and target specific layout style slots."
    >
      <DocSection id="overview" title="The Image Layout System">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">ImageViewer</code> layout uses a relative, overflow-hidden wrapper with centered positioning for the image element. You can easily adjust borders, dimensions, filters, and backgrounds using the design slots and variables.
        </p>
      </DocSection>

      <DocSection id="slots" title="Detailed Custom Slots (classNames)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Click the visual layout targets below to highlight specific class slot borders and see exactly which HTML elements you are targeting with the <code className="text-zinc-100 font-mono">classNames</code> prop:
        </p>

        <div className="mb-4">
          <SlotHighlighter
            slots={imageSlots}
            onChange={(active) =>
              setClassNames(active as Partial<ImageViewerClassNames>)
            }
          />
        </div>

        <LiveDemo heightClass="h-[30rem]" label="Active Class Target Previews">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            classNames={classNames}
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={customSlotsCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="transparency" title="Handling Transparency & Object-Fit">
        <p className="text-zinc-300 leading-relaxed">
          When rendering transparent PNG files (such as logos, technical icons, or watermarks), solid dark or light backgrounds can hide dark or light details.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          To solve this, <code className="text-emerald-400 font-mono">ImageViewer</code> supports checkerboard background grids out-of-the-box. By default, it uses high-performance CSS gradients to render a subtle transparency pattern.
        </p>
        <p className="mt-4 text-zinc-300 mb-4 leading-relaxed">
          If you want to disable the checkerboard pattern or change the image scale behavior, adjust the CSS custom variables:
        </p>

        <div className="mt-4">
          <CodeBlock code={objectFitCode} language="css" />
        </div>
      </DocSection>

      <DocSection id="tokens" title="Image Design Tokens (CSS Variables)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These design tokens are unique to the Image viewer:
        </p>
        <PropTable rows={tokensList.map((t) => ({ name: t.name, type: t.type, defaultValue: '—', description: t.description }))} />
      </DocSection>

      <DocSection id="slots-props-table" title="Class Slot Reference (ImageViewerClassNames)">
        <PropTable rows={slotsPropsRef} />
      </DocSection>
    </DocPage>
  )
}
