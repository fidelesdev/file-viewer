import { useEffect } from 'react'
import {
  ImageViewer,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
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

const autoHideConfigCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Call once at application entry to adjust floating toolbar visibility rules
setFileViewerDefaults({
  autoHide: {
    timeout: 1200,             // wait 1.2 seconds before fading out
    proximityThreshold: 100,  // keep visible if cursor is within 100px
  }
})`

const interactionPropsRef = [
  {
    name: 'timeout',
    type: 'number',
    defaultValue: '1500',
    description: 'Idle delay in milliseconds before the floating toolbar fades out during inactivity.',
  },
  {
    name: 'proximityThreshold',
    type: 'number',
    defaultValue: '120',
    description: 'Distance boundary in pixels from the floating toolbar. If the cursor is within this radius, auto-hiding is paused.',
  },
]

export function ImageViewerInteractionPage() {
  return (
    <DocPage
      title="ImageViewer Interactions & Auto-Hide"
      description="Deep dive into interactive pan, touch gestures, double-tap shortcuts, and the advanced floating toolbar auto-hide proximity engine."
    >
      <DocSection id="pan-zoom" title="Interactive Gestures (Pan & Zoom)">
        <p className="text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">ImageViewer</code> provides an intuitive, high-fidelity experience inspired by modern desktop photo managers and mobile gallery viewports.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-lg">
            <h5 className="font-semibold text-zinc-100 mb-1">🖱️ Smooth Panning</h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When zoomed in past natural bounds, click and hold (or tap and drag) to smoothly pan across high-resolution details in 3D-space.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-lg">
            <h5 className="font-semibold text-zinc-100 mb-1">pinch Dynamic Pinching</h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fully supports trackpad pinching or multi-touch mobile pinch-to-zoom gestures with smooth deceleration physics.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-lg">
            <h5 className="font-semibold text-zinc-100 mb-1">⚡ Double-Tap Action</h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Double-click or double-tap the canvas area to instantly toggle between fitting the image on screen and zooming to its natural 100% scale.
            </p>
          </div>
        </div>

        <LiveDemo heightClass="h-[30rem]" label="Interactive Gesture Sandbox">
          <ImageViewer url={SAMPLES.photoJpg} name={SAMPLE_NAMES.photoJpg} />
        </LiveDemo>
      </DocSection>

      <DocSection id="proximity" title="The Proximity-Based Auto-Hide Engine">
        <p className="text-zinc-300 leading-relaxed">
          To ensure that floating action menus do not obstruct the image details, the toolbar includes a <strong className="text-zinc-100">Proximity-Based Auto-Hide Engine</strong>.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The toolbar automatically fades out when there is no mouse movement or touch input within the panel boundaries for <code className="text-zinc-100 font-mono">1.5 seconds</code>.
        </p>
        <p className="mt-4 text-zinc-300 mb-4 leading-relaxed">
          However, to prevent frustrating layout flickers as a user moves their mouse near the controls, the engine uses a <strong className="text-zinc-100">Proximity Buffer Zone</strong> (controlled by <code className="text-emerald-400 font-mono">proximityThreshold</code>). If the cursor is within the threshold distance (default: <code className="text-zinc-100 font-mono">120px</code>), the auto-hide timer is paused, keeping the toolbar visible.
        </p>

        <LiveDemo heightClass="h-96" label="Auto-Hide Custom Sandbox (Timeout: 1.2s)">
          <AutoHideDemo />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={autoHideConfigCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (Auto-Hide Config)">
        <PropTable rows={interactionPropsRef} />
      </DocSection>
    </DocPage>
  )
}
