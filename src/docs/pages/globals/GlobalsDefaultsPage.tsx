import { useEffect } from 'react'
import {
  FileViewer,
  getFileViewerDefaults,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'
import { useState } from 'react'

function DefaultsDemo() {
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    resetFileViewerDefaults()
    return () => resetFileViewerDefaults()
  }, [])

  const applyDefaults = () => {
    setFileViewerDefaults({
      fileViewer: {
        showPrintButton: false,
        className: 'rounded-lg',
      },
      pdfViewer: {
        zoomDebounceDelay: 400,
      },
    })
    setApplied(true)
  }

  const reset = () => {
    resetFileViewerDefaults()
    setApplied(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={applyDefaults}
          className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white"
        >
          Apply defaults
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded bg-zinc-800 px-3 py-1.5 text-sm"
        >
          resetFileViewerDefaults()
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Applied: {applied ? 'yes' : 'no'} — getFileViewerDefaults() merges
        fileViewer, pdfViewer, imageViewer, toolbar, tooltip, autoHide,
        translations.
      </p>
      <LiveDemo heightClass="h-80">
        <FileViewer
          mode="inline"
          open
          onOpenChange={() => undefined}
          name={SAMPLE_NAMES.multipagePdf}
          extension="pdf"
          url={SAMPLES.multipagePdf}
        />
      </LiveDemo>
    </div>
  )
}

export function GlobalsDefaultsPage() {
  return (
    <DocPage
      title="Global defaults"
      description="setFileViewerDefaults, getFileViewerDefaults, and resetFileViewerDefaults."
    >
      <DocSection id="set-defaults" title="setFileViewerDefaults">
        <DefaultsDemo />
        <CodeBlock
          code={`setFileViewerDefaults({
  language: 'english',
  fileViewer: { showPrintButton: false },
  pdfViewer: { preloadAhead: 2 },
  imageViewer: { ... },
  toolbar: { classNames: { ... } },
  tooltip: { delayDuration: 300 },
  autoHide: { timeout: 2000 },
  translations: { ... },
})`}
        />
      </DocSection>

      <DocSection id="get-defaults" title="getFileViewerDefaults">
        <CodeBlock
          code={`const defaults = getFileViewerDefaults()
// Read-only snapshot of merged global config`}
        />
        <p className="text-sm text-zinc-500">
          Current language default:{' '}
          {getFileViewerDefaults().language ?? '(not set)'}
        </p>
      </DocSection>
    </DocPage>
  )
}
