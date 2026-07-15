import { LoaderCircle } from '@/features/file-viewer/components/icons'
import { PdfViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES } from '../../demos/assets'

const layersCode = `<PdfViewer
  url="/contract-secured.pdf"
  renderTextLayer={false}        // disables text copying/selection
  renderAnnotationLayer={false}  // disables interactive link clicking
/>`

const loaderCode = `<PdfViewer
  url="/annual-records.pdf"
  renderLoading={
    <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 bg-zinc-950">
      <LoaderCircle className="fv-icon fv-icon--xl fv-icon--spin text-emerald-400" />
      <span className="text-xs font-semibold uppercase tracking-wider">
        Assembling document canvas...
      </span>
    </div>
  }
/>`

const renderPropsList = [
  {
    name: 'renderTextLayer',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables text selection layer mapping, allowing clipboard copy and highlight actions.',
  },
  {
    name: 'renderAnnotationLayer',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Enables interactive PDF annotations like clickable links, forms, and outline anchors.',
  },
  {
    name: 'renderLoading',
    type: 'ReactNode',
    defaultValue: 'null',
    description: 'Custom element displayed in the viewport while the PDF document is undergoing worker compilation.',
  },
]

export function PdfViewerRenderingPage() {
  return (
    <DocPage
      title="PdfViewer Rendering Layers"
      description="Understand and configure the underlying PDF.js page layers: Canvas shapes, Text selections, and Interactive annotations."
    >
      <DocSection id="overview" title="The Three-Layer Architecture">
        <p className="text-zinc-300 leading-relaxed">
          When <code className="text-emerald-400 font-mono">PdfViewer</code> renders a document page, it stacks <strong className="text-zinc-100">three distinct functional layers</strong> vertically inside an absolute container block.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Understanding this hierarchy is essential for configuring security policies (like preventing text copying), enabling link interactions, or styling document grids.
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-3 text-zinc-400">
          <li>
            <strong className="text-zinc-200">1. Canvas Layer (Base):</strong> Draws the actual vector pathing, geometric shapes, raster photos, and typographic outlines onto an HTML5 <code className="text-zinc-300 font-mono">&lt;canvas&gt;</code> element. This layer is strictly a static image representation.
          </li>
          <li>
            <strong className="text-zinc-200">2. Text Layer (Middle):</strong> Generates transparent HTML span elements positioned directly over their canvas counterparts. This enables fully standard text selection, hover highlighting, and clipboard copy operations.
          </li>
          <li>
            <strong className="text-zinc-200">3. Annotation Layer (Top):</strong> Compiles and renders clickable hyperlinks, form input fields, tooltips, and digital signature boxes on top of the document sheet.
          </li>
        </ol>
      </DocSection>

      <DocSection id="no-text-layer" title="Securing Documents (renderTextLayer: false)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If your application displays highly sensitive information and you want to prevent users from easily highlighting and copying raw text into their clipboards, set <code className="text-emerald-400 font-mono">renderTextLayer={false}</code>. This strips out the transparent spans, rendering a read-only canvas block:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Text Selection Disabled">
          <PdfViewer url={SAMPLES.multipagePdf} renderTextLayer={false} />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={layersCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="no-annotations" title="Disabling Hyperlinks (renderAnnotationLayer: false)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          To prevent document forms from being editable, or to disable external web navigation links embedded within PDF brochures, set <code className="text-emerald-400 font-mono">renderAnnotationLayer={false}</code>:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Interactive Annotations Disabled">
          <PdfViewer url={SAMPLES.multipagePdf} renderAnnotationLayer={false} />
        </LiveDemo>
      </DocSection>

      <DocSection id="custom-loading" title="Custom Viewport Loading (renderLoading)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For large documents that take a few seconds to compile through the Web Worker, customize the preloader viewport via <code className="text-emerald-400 font-mono">renderLoading</code>. You can mount loading skeletons, brand icons, or custom status text:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="Custom preloader overlay">
          <PdfViewer
            url={SAMPLES.multipagePdf}
            renderLoading={
              <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 bg-zinc-950">
                <LoaderCircle className="fv-icon fv-icon--xl fv-icon--spin text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Loading document sheets...
                </span>
              </div>
            }
          />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={loaderCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-reference" title="Props Reference (Rendering Layers)">
        <PropTable rows={renderPropsList} />
      </DocSection>
    </DocPage>
  )
}
