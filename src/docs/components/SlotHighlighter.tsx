import { useState } from 'react'

type SlotOption = {
  key: string
  label: string
}

type SlotHighlighterProps = {
  slots: SlotOption[]
  onChange: (activeSlots: Record<string, string>) => void
}

const HIGHLIGHT_CLASS = 'outline outline-2 outline-emerald-500 outline-offset-2'

export function SlotHighlighter({ slots, onChange }: SlotHighlighterProps) {
  const [active, setActive] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    const next = { ...active, [key]: !active[key] }
    setActive(next)

    const classNames: Record<string, string> = {}
    for (const slot of slots) {
      if (next[slot.key]) {
        classNames[slot.key] = HIGHLIGHT_CLASS
      }
    }
    onChange(classNames)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => (
        <label
          key={slot.key}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <input
            type="checkbox"
            checked={Boolean(active[slot.key])}
            onChange={() => toggle(slot.key)}
            className="accent-emerald-500"
          />
          {slot.label}
        </label>
      ))}
    </div>
  )
}
