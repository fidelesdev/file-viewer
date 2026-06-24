import { setFileViewerDefaults, resetFileViewerDefaults } from '@/features/file-viewer'
import { useEffect } from 'react'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
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
        classNames: { toolbar: 'ring-2 ring-emerald-500/50' },
      },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return <InlineFileViewerDemo fileViewerProps={base} />
}

export function FileViewerToolbarLevel1Page() {
  return (
    <DocPage
      title="Toolbar — Level 1"
      description="Style floating toolbar via global toolbar.* defaults or per-viewer toolbarBuiltins / toolbarExtra slots."
    >
      <DocSection id="global-toolbar" title="Global toolbar.classNames">
        <GlobalToolbarDemo />
        <CodeBlock
          code={`setFileViewerDefaults({
  toolbar: {
    classNames: { toolbar: 'ring-2 ring-emerald-500/50' },
  },
})`}
        />
      </DocSection>

      <DocSection id="viewer-slots" title="toolbarBuiltins / toolbarExtra">
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            pdfViewerProps: {
              classNames: {
                toolbarBuiltins: 'ring-1 ring-zinc-600 rounded-full px-1',
                toolbarExtra: 'ring-1 ring-emerald-600 rounded-full px-1',
              },
            },
          }}
        />
      </DocSection>
    </DocPage>
  )
}
