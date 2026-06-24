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

function TranslationsDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      translations: {
        english: {
          fileViewer: {
            downloadAriaLabel: 'Save file',
            downloadTooltip: 'Save to disk',
          },
        },
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
      language="english"
    />
  )
}

export function GlobalsTranslationsPage() {
  return (
    <DocPage
      title="Global translations"
      description="Partial translation overrides via setFileViewerDefaults."
    >
      <DocSection id="override" title="translations partial merge">
        <LiveDemo heightClass="h-80" label="Download tooltip: Save to disk">
          <TranslationsDemo />
        </LiveDemo>
        <CodeBlock
          code={`setFileViewerDefaults({
  translations: {
    english: {
      fileViewer: {
        downloadTooltip: 'Save to disk',
      },
    },
  },
})`}
        />
      </DocSection>
    </DocPage>
  )
}
