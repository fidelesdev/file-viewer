import { setFileViewerDefaults, resetFileViewerDefaults } from '@/features/file-viewer'
import { useEffect } from 'react'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

function GlobalToolbarDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      toolbar: {
        classNames: {
          toolbar: 'ring-2 ring-emerald-500/50 bg-zinc-950/90 shadow-lg px-4 py-2 rounded-full',
          iconButton: 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10',
          divider: 'bg-emerald-500/20',
        },
      },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return <InlineFileViewerDemo fileViewerProps={base} heightClass="h-72" />
}

const globalDefaultsCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Call this once in your application entry file to apply consistent branding.
setFileViewerDefaults({
  toolbar: {
    classNames: {
      toolbar: 'ring-2 ring-emerald-500/50 bg-zinc-950/90 shadow-xl px-4 py-2 rounded-full',
      iconButton: 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10',
      divider: 'bg-emerald-500/20',
    },
  },
})`

const localOverrideCode = `<FileViewer
  {...props}
  pdfViewerProps={{
    classNames: {
      toolbarBuiltins: 'border border-zinc-700 bg-zinc-900/40 rounded-l-lg p-1',
      toolbarExtra: 'border border-emerald-500 bg-emerald-500/10 rounded-r-lg p-1 border-l-0',
    },
  }}
/>`

const level1ToolbarSlots = [
  {
    name: 'toolbar',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name injected directly onto the main outer floating toolbar container widget.',
  },
  {
    name: 'divider',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to vertical separator bar elements inside the toolbar.',
  },
  {
    name: 'iconButton',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to all native icon buttons (zooms, next, back, fit-to-screen triggers).',
  },
]

const specificViewerSlots = [
  {
    name: 'pdfViewerProps.classNames.toolbarBuiltins',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to the built-in pagination/zoom segment of the PDF toolbar.',
  },
  {
    name: 'pdfViewerProps.classNames.toolbarExtra',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to the extra custom action segment of the PDF toolbar.',
  },
  {
    name: 'imageViewerProps.classNames.toolbarBuiltins',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to the built-in zoom segment of the Image toolbar.',
  },
  {
    name: 'imageViewerProps.classNames.toolbarExtra',
    type: 'string',
    defaultValue: '—',
    description: 'Target class name applied to the extra custom action segment of the Image toolbar.',
  },
]

export function FileViewerToolbarLevel1Page() {
  return (
    <DocPage
      title="Toolbar — Level 1"
      description="Declarative Toolbar Customization: apply global layout presets, override floating panel styles, and inject custom classes directly into toolbar layout slots."
    >
      <DocSection id="overview" title="Level 1 Concept: CSS Slots & Presets">
        <p className="text-zinc-300 leading-relaxed">
          The <strong className="text-zinc-100">Level 1 Toolbar Customization</strong> system is designed to help you style the floating toolbar widget. The floating toolbar is a critical, interactive component that sits over the document canvas and hosts pagination inputs, zoom scales, and zoom controllers.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          Instead of writing custom layout layers, you can customize the floating toolbar globally via <code className="text-emerald-400 font-mono">setFileViewerDefaults</code> or configure styling variables per viewer using individual styling slots.
        </p>
      </DocSection>

      <DocSection id="global-presets" title="Global Theme Configuration">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          To maintain visual consistency across all pages and viewers in your application, configure the toolbar globally. Below, the live example renders a customized emerald toolbar applied via global presets:
        </p>

        <GlobalToolbarDemo />

        <div className="mt-4">
          <CodeBlock code={globalDefaultsCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="local-slots" title="Specific Viewer Overrides">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If you want to style specific viewers differently (e.g., giving the image viewer a different color scheme from the PDF viewer), you can pass targeting class names inside the respective props layer.
        </p>

        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            pdfViewerProps: {
              classNames: {
                toolbarBuiltins: 'ring-1 ring-zinc-700/60 bg-zinc-900/40 rounded-l-lg px-2 py-1',
                toolbarExtra: 'ring-1 ring-emerald-500 bg-emerald-500/10 rounded-r-lg px-2 py-1 border-l-0',
              },
            },
          }}
          heightClass="h-64"
        />

        <div className="mt-4">
          <CodeBlock code={localOverrideCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="global-slots-table" title="Global Toolbar Styling Slots">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These slots are available on the global <code className="text-zinc-100 font-mono">toolbar</code> settings object inside <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>:
        </p>
        <PropTable rows={level1ToolbarSlots} />
      </DocSection>

      <DocSection id="viewer-slots-table" title="Viewer-Specific Custom Slots">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These style slots reside on the specific PDF or Image sub-viewer configurations:
        </p>
        <PropTable rows={specificViewerSlots} />
      </DocSection>
    </DocPage>
  )
}
