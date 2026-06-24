import { useState } from 'react'
import { FileViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

export function FileViewerBasicsPage() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <DocPage
      title="FileViewer overview"
      description="Controlled shell component: open state, file metadata, and loading."
    >
      <DocSection id="controlled-state" title="open / onOpenChange">
        <p>
          FileViewer is fully controlled. Toggle visibility with{' '}
          <code className="text-emerald-400">open</code> and{' '}
          <code className="text-emerald-400">onOpenChange</code>.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
          >
            Open
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
        <LiveDemo>
          <FileViewer
            mode="inline"
            open={open}
            onOpenChange={setOpen}
            name={SAMPLE_NAMES.multipagePdf}
            extension="pdf"
            url={SAMPLES.multipagePdf}
          />
        </LiveDemo>
        <CodeBlock
          code={`const [open, setOpen] = useState(true)

<FileViewer open={open} onOpenChange={setOpen} ... />`}
        />
      </DocSection>

      <DocSection id="metadata" title="url, name, extension">
        <p>
          <code className="text-emerald-400">extension</code> drives viewer
          selection (pdf vs image). <code className="text-emerald-400">name</code>{' '}
          appears in the header and image alt text.
        </p>
        <InlineFileViewerDemo
          fileViewerProps={{
            name: SAMPLE_NAMES.photoJpg,
            extension: 'jpg',
            url: SAMPLES.photoJpg,
          }}
        />
      </DocSection>

      <DocSection id="is-loading" title="isLoading">
        <button
          type="button"
          onClick={() => setLoading((current) => !current)}
          className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
        >
          Toggle isLoading ({loading ? 'on' : 'off'})
        </button>
        <InlineFileViewerDemo
          fileViewerProps={{
            name: SAMPLE_NAMES.multipagePdf,
            extension: 'pdf',
            url: SAMPLES.multipagePdf,
            isLoading: loading,
          }}
        />
      </DocSection>
    </DocPage>
  )
}
