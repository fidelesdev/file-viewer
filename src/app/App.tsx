import { FileImage, FileText, FileQuestion } from '@/features/file-viewer/components/icons'
import { useState } from 'react'

import { ViewFile } from '@/features/file-viewer'

const SAMPLE_PDF = 'src/large.pdf'

const SAMPLE_JPG = 'large-image.png'

export function App() {
  const [open, setOpen] = useState(false)
  const [scenario, setScenario] = useState<'pdf' | 'jpg' | 'unknown'>('pdf')

  const openScenario = (next: typeof scenario) => {
    setScenario(next)
    setOpen(true)
  }

  const name =
    scenario === 'pdf'
      ? 'tracemonkey-pldi-09.pdf'
      : scenario === 'jpg'
        ? 'photo-sample.jpg'
        : 'readme.xyz'

  const extension =
    scenario === 'pdf' ? 'pdf' : scenario === 'jpg' ? 'jpg' : 'xyz'

  const url =
    scenario === 'pdf'
      ? SAMPLE_PDF
      : scenario === 'jpg'
        ? SAMPLE_JPG
        : SAMPLE_JPG

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-10 p-8">
      <header className="text-center space-y-2 max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Teste dos componentes
        </h1>
        <p className="text-zinc-400 text-sm">
          Use os botões abaixo para abrir o modal{' '}
          <code className="text-emerald-400/90">ViewFile</code> com PDF, imagem
          ou formato sem visualizador.
        </p>
      </header>

      <nav
        className="flex flex-wrap gap-4 justify-center"
        aria-label="Cenários de teste"
      >
        <button
          type="button"
          onClick={() => openScenario('pdf')}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-3 text-sm font-medium ring-1 ring-zinc-700 hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Abrir exemplo PDF"
        >
          <FileText className="w-5 h-5" aria-hidden />
          PDF de exemplo
        </button>

        <button
          type="button"
          onClick={() => openScenario('jpg')}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-3 text-sm font-medium ring-1 ring-zinc-700 hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Abrir exemplo JPG"
        >
          <FileImage className="w-5 h-5" aria-hidden />
          Imagem JPG
        </button>

        <button
          type="button"
          onClick={() => openScenario('unknown')}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-3 text-sm font-medium ring-1 ring-zinc-700 hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Abrir extensão sem suporte"
        >
          <FileQuestion className="w-5 h-5" aria-hidden />
          Formato não suportado
        </button>
      </nav>

      <div className="w-full max-w-4xl h-[600px] border border-zinc-800 rounded-lg overflow-hidden bg-black/50">
        <ViewFile
          open={open}
          onOpenChange={setOpen}
          name={name}
          extension={extension}
          url={url}
        />
      </div>
    </div>
  )
}
