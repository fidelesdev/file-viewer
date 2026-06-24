import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineFileViewerDemo, ModalDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const baseProps = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

export function FileViewerModesPage() {
  return (
    <DocPage
      title="FileViewer modes"
      description="inline fits a parent container; modal renders a full-screen overlay."
    >
      <DocSection id="inline-mode" title="mode: inline (default)">
        <InlineFileViewerDemo fileViewerProps={baseProps} heightClass="h-80" />
        <CodeBlock code={`<FileViewer mode="inline" ... />`} />
      </DocSection>

      <DocSection id="modal-mode" title="mode: modal">
        <ModalDemo fileViewerProps={baseProps} triggerLabel="Open PDF modal" />
        <CodeBlock code={`<FileViewer mode="modal" open={open} onOpenChange={setOpen} ... />`} />
      </DocSection>

      <DocSection id="hide-close" title="hideCloseButton">
        <p>
          Default: hidden in inline, visible in modal. Override per instance or
          via global defaults.
        </p>
        <InlineFileViewerDemo
          fileViewerProps={{ ...baseProps, hideCloseButton: false }}
          label="inline with close button visible"
        />
        <ModalDemo
          fileViewerProps={{ ...baseProps, hideCloseButton: true }}
          triggerLabel="Modal without close button"
        />
      </DocSection>
    </DocPage>
  )
}
