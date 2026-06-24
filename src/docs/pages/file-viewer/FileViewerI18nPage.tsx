import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

export function FileViewerI18nPage() {
  return (
    <DocPage
      title="FileViewer i18n"
      description="language prop switches UI strings between english and portuguese."
    >
      <DocSection id="english" title="language: english">
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, language: 'english' }}
          label="English tooltips and labels"
        />
      </DocSection>

      <DocSection id="portuguese" title="language: portuguese">
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, language: 'portuguese' }}
          label="Portuguese tooltips and labels"
        />
      </DocSection>
    </DocPage>
  )
}
