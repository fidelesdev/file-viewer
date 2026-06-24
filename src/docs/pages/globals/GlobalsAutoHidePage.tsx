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

function AutoHideGlobalDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      autoHide: { proximityThreshold: 80, timeout: 800 },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return (
    <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
  )
}

export function GlobalsAutoHidePage() {
  return (
    <DocPage
      title="Global auto-hide"
      description="autoHide.proximityThreshold and autoHide.timeout control floating toolbar visibility."
    >
      <DocSection id="auto-hide-config" title="autoHide defaults">
        <LiveDemo heightClass="h-96">
          <AutoHideGlobalDemo />
        </LiveDemo>
        <CodeBlock
          code={`setFileViewerDefaults({
  autoHide: {
    proximityThreshold: 80,
    timeout: 800,
  },
})`}
        />
      </DocSection>
    </DocPage>
  )
}
