import { useState } from 'react'
import {
  MultiFileViewer,
  type MultiFileViewerProps,
} from '@/features/file-viewer'
import { LiveDemo } from './LiveDemo'

type MultiFileViewerDemoProps = {
  multiFileViewerProps: Omit<
    MultiFileViewerProps,
    'open' | 'onOpenChange'
  >
  heightClass?: string
  label?: string
}

export function InlineMultiFileViewerDemo({
  multiFileViewerProps,
  heightClass,
  label,
}: MultiFileViewerDemoProps) {
  const [open, setOpen] = useState(true)

  return (
    <LiveDemo heightClass={heightClass ?? 'h-[32rem]'} label={label}>
      <MultiFileViewer
        {...multiFileViewerProps}
        mode="inline"
        open={open}
        onOpenChange={setOpen}
      />
    </LiveDemo>
  )
}

type ModalMultiFileViewerDemoProps = {
  triggerLabel?: string
  multiFileViewerProps: Omit<
    MultiFileViewerProps,
    'open' | 'onOpenChange' | 'mode'
  >
}

export function ModalMultiFileViewerDemo({
  triggerLabel = 'Open multi-file modal',
  multiFileViewerProps,
}: ModalMultiFileViewerDemoProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
      >
        {triggerLabel}
      </button>
      <MultiFileViewer
        {...multiFileViewerProps}
        mode="modal"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
