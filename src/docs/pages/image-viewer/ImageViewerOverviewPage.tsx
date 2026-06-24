import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

export function ImageViewerOverviewPage() {
  return (
    <DocPage
      title="ImageViewer overview"
      description="Standalone image viewer with pan, zoom, and auto-hide toolbar."
    >
      <DocSection id="minimal" title="Minimal usage">
        <LiveDemo heightClass="h-96">
          <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
        </LiveDemo>
        <CodeBlock
          code={`<ImageViewer url="/samples/photo.jpg" name="photo.jpg" />`}
        />
      </DocSection>
    </DocPage>
  )
}
