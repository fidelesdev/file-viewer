import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

export function ImageViewerToolbarPage() {
  return (
    <DocPage
      title="ImageViewer toolbar"
      description="Three-level toolbar API on standalone ImageViewer."
    >
      <DocSection id="level-2" title="extraToolbarActions">
        <LiveDemo heightClass="h-96">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            extraToolbarActions={({ zoomIn }) => (
              <button
                type="button"
                onClick={zoomIn}
                className="text-xs text-emerald-400"
              >
                Boost
              </button>
            )}
          />
        </LiveDemo>
      </DocSection>

      <DocSection id="level-3" title="renderToolbarActions">
        <LiveDemo heightClass="h-96">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            renderToolbarActions={({
              defaultActions,
              scale,
              resetTransform,
            }) => (
              <>
                <button
                  type="button"
                  onClick={resetTransform}
                  className="text-xs text-zinc-400"
                >
                  {Math.round(scale * 100)}%
                </button>
                {defaultActions}
              </>
            )}
          />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
