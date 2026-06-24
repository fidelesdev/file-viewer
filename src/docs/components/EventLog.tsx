import { useState } from 'react'

export function useEventLog(maxEntries = 8) {
  const [entries, setEntries] = useState<string[]>([])

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEntries((current) =>
      [`[${timestamp}] ${message}`, ...current].slice(0, maxEntries),
    )
  }

  const clear = () => setEntries([])

  return { entries, log, clear }
}

export function EventLogPanel({
  entries,
  onClear,
  title = 'Event log',
}: {
  entries: string[]
  onClear: () => void
  title?: string
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Clear
        </button>
      </div>
      <ul className="max-h-40 space-y-1 overflow-y-auto p-3 font-mono text-xs text-zinc-400">
        {entries.length === 0 ? (
          <li className="text-zinc-600">No events yet.</li>
        ) : (
          entries.map((entry) => <li key={entry}>{entry}</li>)
        )}
      </ul>
    </div>
  )
}
