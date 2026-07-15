import { useEffect } from 'react'
import {
  FileViewer,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'
import { PropTable } from '../../components/PropTable'

function TooltipDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      tooltip: {
        delayDuration: 0,
        skipDelayDuration: 0,
        classNames: { content: 'bg-emerald-950 text-emerald-100 border border-emerald-500/30' },
      },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return (
    <FileViewer
      mode="inline"
      open
      onOpenChange={() => undefined}
      name={SAMPLE_NAMES.multipagePdf}
      extension="pdf"
      url={SAMPLES.multipagePdf}
    />
  )
}

const tooltipConfigCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Customize hover timers and visual presets globally
setFileViewerDefaults({
  tooltip: {
    delayDuration: 150,        // delay (ms) before fading in tooltip
    skipDelayDuration: 300,    // hover navigation skip delay window (ms)
    classNames: {
      content: 'bg-emerald-950 text-emerald-100 border border-emerald-500/30 shadow-xl',
      arrow: 'fill-emerald-500/30',
    }
  }
})`

const tooltipDefaultsRef = [
  {
    name: 'delayDuration',
    type: 'number',
    defaultValue: '500',
    description: 'The hover delay in milliseconds required before rendering the tooltip text content container.',
  },
  {
    name: 'skipDelayDuration',
    type: 'number',
    defaultValue: '300',
    description: 'The window in milliseconds during which adjacent tooltip triggers will instantly mount without waiting for delayDuration.',
  },
  {
    name: 'classNames',
    type: 'FileViewerTooltipClassNames',
    defaultValue: 'undefined',
    description: 'Target style slots (content, arrow, trigger) to customize tooltips.',
  },
]

export function GlobalsTooltipPage() {
  return (
    <DocPage
      title="Global Tooltip Customization"
      description="Refine hover helpers: adjust global activation delays, configure snappy adjacent trigger skips, and style tooltips."
    >
      <DocSection id="overview" title="Icon Buttons and Visual Accessibility">
        <p className="text-zinc-300 leading-relaxed">
          The floating toolbars in <code className="text-emerald-400 font-mono">PdfViewer</code> and <code className="text-emerald-400 font-mono">ImageViewer</code> utilize clean, compact icon buttons to keep the visual focus on your content. To comply with WCAG 2.1 accessibility standards (and ensure clear visual cues for mouse users), every icon button is paired with a tooltip.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The global <code className="text-emerald-400 font-mono">tooltip</code> settings allow you to customize activation timing, adjust hover skip behaviors, and style tooltips to match your brand's theme.
        </p>
      </DocSection>

      <DocSection id="interactive" title="Instant Hover Sandbox">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In the sandbox below, tooltips are configured with <strong className="text-zinc-100 font-mono">delayDuration: 0</strong> (instant activation) and stylized with a custom emerald outline. Hover over the zoom controls to feel the snappy, instant transition:
        </p>

        <LiveDemo heightClass="h-80" label="Instant Emerald Tooltips Sandbox">
          <TooltipDemo />
        </LiveDemo>
      </DocSection>

      <DocSection id="config" title="Global Customization (tooltip defaults)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Configure tooltip behavior and styles globally using <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>:
        </p>
        <CodeBlock code={tooltipConfigCode} language="tsx" />
      </DocSection>

      <DocSection id="props-ref" title="Props Reference (TooltipDefaults)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These settings can be passed in the <code className="text-zinc-100 font-mono">tooltip</code> block of <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>:
        </p>
        <PropTable rows={tooltipDefaultsRef} />
      </DocSection>
    </DocPage>
  )
}
