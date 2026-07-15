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
import { PropTable } from '../../components/PropTable'

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

const autoHideConfigCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Customize the auto-hide engine globally
setFileViewerDefaults({
  autoHide: {
    timeout: 800,              // fade out after 800ms of inactivity
    proximityThreshold: 80,    // pause fade-out if cursor is within 80px
  },
})`

const autoHideDefaultsRef = [
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

export function GlobalsAutoHidePage() {
  return (
    <DocPage
      title="Global Auto-Hide Configuration"
      description="Manage toolbar fade-outs: configure idle timeout timers, adjust cursor proximity thresholds, and optimize visual focus."
    >
      <DocSection id="overview" title="The Overlay Obstruction Problem">
        <p className="text-zinc-300 leading-relaxed">
          High-definition PDF documents, charts, diagrams, and blueprints often contain critical text and fine details near the edges. Having a permanently fixed floating toolbar overlay would inevitably block valuable content, leading to a frustrating user experience.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          To solve this, <code className="text-emerald-400 font-mono">FileViewer</code> includes a sophisticated <strong className="text-zinc-100">Proximity-Based Auto-Hide Engine</strong>.
        </p>
      </DocSection>

      <DocSection id="mechanism" title="How the Proximity Engine Works">
        <p className="text-zinc-300 leading-relaxed">
          The auto-hide engine uses custom event listeners to track user cursor movement and distance:
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-3 text-zinc-400">
          <li>
            <strong className="text-zinc-200">1. Inactivity Timeout:</strong> When the cursor stops moving or leaves the document viewport, a countdown timer (defined by <code className="text-emerald-400 font-mono">timeout</code>) starts. When the timer expires, the toolbar fades out smoothly.
          </li>
          <li>
            <strong className="text-zinc-200">2. Proximity Zone (Proximity Threshold):</strong> To prevent the toolbar from fading out when you are actively moving your cursor near it, the engine calculates the distance in pixels between the cursor and the toolbar's outer bounding rect. If the distance is within the <code className="text-emerald-400 font-mono">proximityThreshold</code>, the fade-out is paused, keeping the toolbar visible.
          </li>
          <li>
            <strong className="text-zinc-200">3. instant Restoration:</strong> Moving the cursor or tapping anywhere inside the viewport instantly wakes up the engine and restores the toolbar's opacity.
          </li>
        </ol>
      </DocSection>

      <DocSection id="interactive" title="Aggressive Timing Sandbox">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In the sandbox below, we set <strong className="text-zinc-100 font-mono">timeout: 800</strong> (quick fade-out) and <strong className="text-zinc-100 font-mono">proximityThreshold: 80</strong> (requires getting closer). Move your mouse into the panel to reveal the toolbar, and observe how quickly it fades out once you stop moving:
        </p>

        <LiveDemo heightClass="h-[30rem]" label="800ms Auto-Hide Sandbox">
          <AutoHideGlobalDemo />
        </LiveDemo>

        <div className="mt-4">
          <CodeBlock code={autoHideConfigCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (AutoHideDefaults)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These settings can be passed in the <code className="text-zinc-100 font-mono">autoHide</code> block of <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>:
        </p>
        <PropTable rows={autoHideDefaultsRef} />
      </DocSection>
    </DocPage>
  )
}
