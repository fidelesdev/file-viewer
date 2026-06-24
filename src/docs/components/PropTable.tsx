type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

type PropTableProps = {
  rows: PropRow[]
}

export function PropTable({ rows }: PropTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Prop</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Default</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 text-zinc-300">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="px-4 py-3 font-mono text-emerald-400">{row.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                {row.type}
              </td>
              <td className="px-4 py-3 text-zinc-500">{row.defaultValue ?? '—'}</td>
              <td className="px-4 py-3 text-zinc-400">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
