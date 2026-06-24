import { useState } from 'react'
import type { ImageViewerClassNames } from '@/features/file-viewer'
import { ImageViewer } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { LiveDemo } from '../../components/LiveDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const imageSlots = [
  { key: 'root', label: 'root' },
  { key: 'image', label: 'image' },
  { key: 'toolbar', label: 'toolbar' },
  { key: 'loader', label: 'loader' },
]

export function ImageViewerStylingPage() {
  const [classNames, setClassNames] = useState<Partial<ImageViewerClassNames>>({})

  return (
    <DocPage
      title="ImageViewer styling"
      description="Per-slot classNames and styles on the image viewer."
    >
      <DocSection id="slots" title="classNames slots">
        <SlotHighlighter
          slots={imageSlots}
          onChange={(active) =>
            setClassNames(active as Partial<ImageViewerClassNames>)
          }
        />
        <LiveDemo heightClass="h-96">
          <ImageViewer
            url={SAMPLES.photoJpg}
            name={SAMPLE_NAMES.photoJpg}
            classNames={classNames}
          />
        </LiveDemo>
      </DocSection>
    </DocPage>
  )
}
