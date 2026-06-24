import { useState } from 'react'

export function useDemoFileViewer(initialOpen = true) {
  const [open, setOpen] = useState(initialOpen)
  return { open, onOpenChange: setOpen }
}
