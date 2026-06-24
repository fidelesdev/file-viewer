import { useState, type ReactNode } from 'react'
import { FileViewer } from '@/features/file-viewer'
import type { FileViewerProps } from '@/features/file-viewer'
import { LiveDemo } from './LiveDemo'

type ModalDemoProps = {
  triggerLabel?: string
  fileViewerProps: Omit<FileViewerProps, 'open' | 'onOpenChange'>
}

export function ModalDemo({
  triggerLabel = 'Open modal preview',
  fileViewerProps,
}: ModalDemoProps) {
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
      <FileViewer
        {...fileViewerProps}
        mode="modal"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}

type InlineFileViewerDemoProps = {
  fileViewerProps: Omit<FileViewerProps, 'open' | 'onOpenChange'>
  heightClass?: string
  label?: string
}

export function InlineFileViewerDemo({
  fileViewerProps,
  heightClass,
  label,
}: InlineFileViewerDemoProps) {
  const [open, setOpen] = useState(true)

  return (
    <LiveDemo heightClass={heightClass} label={label}>
      <FileViewer
        {...fileViewerProps}
        mode="inline"
        open={open}
        onOpenChange={setOpen}
      />
    </LiveDemo>
  )
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-400">
      {children}
    </p>
  )
}
