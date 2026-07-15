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
import { useState } from 'react'
import { PropTable } from '../../components/PropTable'

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
        className: 'rounded-lg border-2 border-dashed border-emerald-500/50',
      },
      pdfViewer: {
        zoomDebounceDelay: 600,
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
          className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition"
        >
          Apply Global Custom Defaults
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition"
        >
          resetFileViewerDefaults()
        </button>
      </div>
      <p className="text-xs text-zinc-400">
        Applied State: <strong className={applied ? "text-emerald-400" : "text-amber-400"}>{applied ? 'YES (No Print Button, Dashed Emerald border)' : 'NO (Standard Styles)'}</strong>
      </p>
      <LiveDemo heightClass="h-80" label="Reactive Global Defaults Sandbox">
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

const defaultsSetCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Call once at the entry point of your application (e.g., index.tsx or App.tsx)
setFileViewerDefaults({
  language: 'portuguese',                // set default UI language
  fileViewer: {
    showPrintButton: false,             // turn off printing globally
    showFullscreenButton: true,         // enable fullscreen globally
  },
  pdfViewer: {
    preloadAhead: 2,                    // load 2 pages ahead during scrolling
    zoomDebounceDelay: 400,             // smooth fast zoom operations
  },
  tooltip: {
    delayDuration: 200,                 // responsive hover interactions
  },
  autoHide: {
    timeout: 1500,                      // smooth toolbar fade-out
  }
})`

const defaultsGetCode = `import { getFileViewerDefaults } from '@fdls/file-viewer'

// Fetch a read-only snapshot of the active global configuration tree
const currentDefaults = getFileViewerDefaults()

console.log('Language default:', currentDefaults.language)
console.log('Preload default:', currentDefaults.pdfViewer?.preloadAhead)`

const defaultsResetCode = `import { resetFileViewerDefaults } from '@fdls/file-viewer'

// Restores all file-viewer, pdf, image, and tooltip configurations to original library settings
resetFileViewerDefaults()`

const defaultsMethodsRef = [
  {
    name: 'setFileViewerDefaults',
    type: '(defaults: FileViewerDefaults) => void',
    defaultValue: '—',
    description: 'Deep-merges custom enterprise presets into the core global configuration registry.',
  },
  {
    name: 'getFileViewerDefaults',
    type: '() => FileViewerDefaults',
    defaultValue: '—',
    description: 'Returns a read-only snapshot of the active global configuration tree.',
  },
  {
    name: 'resetFileViewerDefaults',
    type: '() => void',
    defaultValue: '—',
    description: 'Bypasses custom configurations and restores the original pre-built library defaults.',
  },
]

export function GlobalsDefaultsPage() {
  return (
    <DocPage
      title="Global Defaults Configuration"
      description="Centrally enforce consistency: configure global design presets, toggle default toolbars, override default languages, and deep-merge component settings."
    >
      <DocSection id="overview" title="The Enterprise-Scale Configuration Problem">
        <p className="text-zinc-300 leading-relaxed">
          In large enterprise platforms containing dozens of isolated modules and split dashboard workflows, configuring individual parameters—such as hover tooltip timings, file translation dictionaries, and floating toolbar fade-outs—on every single instance of <code className="text-emerald-400 font-mono">&lt;FileViewer /&gt;</code> scattered across the codebase introduces significant boilerplate.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          To solve this and ensure complete visual and behavioral consistency, the library provides a <strong className="text-zinc-100">Centralized Defaults Engine</strong>. By invoking global configuration methods at your application entry point, you can define consistent presets that instantly apply to all components.
        </p>
      </DocSection>

      <DocSection id="interactive" title="Live Configuration Sandbox">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Click the "Apply Global Custom Defaults" button below to remove the print action and apply a custom dashed emerald border. Then click "Reset" to instantly restore original library defaults:
        </p>
        <DefaultsDemo />
      </DocSection>

      <DocSection id="api-set" title="Defining Presets (setFileViewerDefaults)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          We recommend calling <code className="text-emerald-400 font-mono">setFileViewerDefaults</code> inside your root application entry file (e.g. <code className="text-zinc-100 font-mono">index.tsx</code>, <code className="text-zinc-100 font-mono">main.tsx</code>, or <code className="text-zinc-100 font-mono">_app.tsx</code>):
        </p>
        <CodeBlock code={defaultsSetCode} language="tsx" />
      </DocSection>

      <DocSection id="api-get-reset" title="Inspecting & Resetting Defaults">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Use <code className="text-emerald-400 font-mono">getFileViewerDefaults()</code> to safely read active settings, or <code className="text-emerald-400 font-mono">resetFileViewerDefaults()</code> to clear custom configurations, which is particularly useful during unit test teardowns:
        </p>
        <div className="space-y-4">
          <CodeBlock code={defaultsGetCode} language="tsx" />
          <CodeBlock code={defaultsResetCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="methods-reference" title="API Methods Reference">
        <PropTable rows={defaultsMethodsRef} />
      </DocSection>
    </DocPage>
  )
}
