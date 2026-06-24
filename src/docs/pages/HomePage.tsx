import { Link } from 'react-router-dom'
import { DocPage } from '../layout/DocPage'
import { DocSection } from '../layout/DocSection'
import { docsNavigation } from '../navigation'

export function HomePage() {
  return (
    <DocPage
      title="Introduction"
      description="@fdls/file-viewer is a React library for in-app file preview: a shell (FileViewer), PDF viewer, and image viewer with pan/zoom. This site demonstrates every customization level with live examples."
    >
      <DocSection id="supported-types" title="Supported file types">
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Extensions</th>
                <th className="px-4 py-3">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr>
                <td className="px-4 py-3">PDF</td>
                <td className="px-4 py-3 font-mono text-xs">.pdf</td>
                <td className="px-4 py-3">PdfViewer — scroll, pagination, zoom</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Image</td>
                <td className="px-4 py-3 font-mono text-xs">.jpg, .jpeg, .png</td>
                <td className="px-4 py-3">ImageViewer — pan/zoom toolbar</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Other</td>
                <td className="px-4 py-3 font-mono text-xs">*</td>
                <td className="px-4 py-3">Fallback via renderUnsupported</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="customization-levels" title="Customization levels">
        <p>
          Both the header and floating toolbar follow a three-level API. Use the
          shallowest level that fits your product:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-zinc-400">
          <li>
            <strong className="text-zinc-200">Level 1 — Config:</strong> toggles,
            classNames, styles, global defaults
          </li>
          <li>
            <strong className="text-zinc-200">Level 2 — Extend:</strong>{' '}
            extraHeaderActions / extraToolbarActions + side
          </li>
          <li>
            <strong className="text-zinc-200">Level 3 — Compose:</strong>{' '}
            renderHeaderActions / renderToolbarActions with defaultActions
          </li>
        </ol>
      </DocSection>

      <DocSection id="explore" title="Explore the docs">
        <ul className="space-y-4">
          {docsNavigation.map((group) => (
            <li key={group.title}>
              <p className="mb-2 font-medium text-zinc-200">{group.title}</p>
              <ul className="space-y-1 pl-4">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  )
}
