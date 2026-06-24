import { useEffect } from 'react'
import {
  ImageViewer,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

function AutoHideDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      autoHide: { proximityThreshold: 120, timeout: 1200 },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return (
    <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
  )
}

export function ImageViewerInteractionPage() {
  return (
    <DocPage
      title="ImageViewer interaction"
      description="Pan/zoom via react-zoom-pan-pinch and toolbar auto-hide via global autoHide defaults."
    >
      <DocSection id="pan-zoom" title="Pan and zoom">
        <p className="text-sm text-zinc-400">
          Drag to pan. Use toolbar buttons or mouse wheel to zoom. Double-click
          behavior follows library defaults.
        </p>
        <LiveDemo heightClass="h-96">
          <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
        </LiveDemo>
      </DocSection>

      <DocSection id="auto-hide" title="autoHide defaults">
        <LiveDemo heightClass="h-96" label="Toolbar hides after 1.2s idle">
          <AutoHideDemo />
        </LiveDemo>
        <CodeBlock
          code={`setFileViewerDefaults({
  autoHide: { proximityThreshold: 120, timeout: 1200 },
})`}
        />
      </DocSection>
    </DocPage>
  )
}
