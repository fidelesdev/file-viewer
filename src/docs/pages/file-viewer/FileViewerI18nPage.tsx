import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo } from '../../components/ModalDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const globalI18nCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Set the entire app to default to Portuguese
setFileViewerDefaults({
  language: 'portuguese',
})`

const i18nCustomOverrideCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Customize specific dictionary strings globally to match your enterprise naming guidelines.
setFileViewerDefaults({
  language: 'portuguese',
  translations: {
    portuguese: {
      fileViewer: {
        // Change default "Fechar" to "Fechar Visualizador"
        closeAriaLabel: 'Fechar Visualizador',
        printTooltip: 'Enviar para impressora corporativa',
      },
      multiFileViewer: {
        // Change empty state message
        emptyFilesMessage: 'Nenhum documento anexado ao processo.',
      }
    }
  }
})`

const i18nSpanishCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Since the translation dictionary is deeply reactive, you can override
// English defaults with Spanish values to add Spanish support!
setFileViewerDefaults({
  language: 'english', // Use English as the base engine mapping
  translations: {
    english: {
      fileViewer: {
        closeAriaLabel: 'Cerrar',
        printTooltip: 'Imprimir archivo',
        downloadTooltip: 'Descargar archivo',
        fullscreenTooltip: 'Pantalla completa',
        unsupportedFileType: ({ extension }) => \`El archivo \${extension} no es compatible.\`
      },
      pdfViewer: {
        pageLabel: 'Página',
        zoomInTooltip: 'Acercar',
        zoomOutTooltip: 'Alejar',
        fitWidthTooltip: 'Ajustar ancho',
      }
    }
  }
})`

const i18nSchemaRef = [
  { name: 'fileViewer.closeAriaLabel', type: 'string', description: 'Screen-reader label for the close action.' },
  { name: 'fileViewer.printTooltip', type: 'string', description: 'Hover tooltip and reader text for the print button.' },
  { name: 'fileViewer.downloadTooltip', type: 'string', description: 'Hover tooltip for the export download trigger.' },
  { name: 'fileViewer.unsupportedFileType', type: '(params: { extension: string }) => string', description: 'Message displayed when file extension cannot be previewed.' },
  { name: 'pdfViewer.pageLabel', type: 'string', description: '"Page" text label prefix.' },
  { name: 'pdfViewer.pageInputAriaLabel', type: '(params: { value: string }) => string', description: 'Accessibility label on the numeric page input element.' },
  { name: 'multiFileViewer.emptyFilesMessage', type: 'string', description: 'Placeholder label rendered when the files list array is empty.' },
]

export function FileViewerI18nPage() {
  return (
    <DocPage
      title="FileViewer Internationalization"
      description="Translate UI strings, override ARIA accessibility messages, and customize tooltip languages globally or per instance."
    >
      <DocSection id="overview" title="Built-in Multilingual Architecture">
        <p className="text-zinc-300 leading-relaxed">
          The internationalization (i18n) model in <code className="text-emerald-400 font-mono">@fdls/file-viewer</code> is built with high compliance for <strong className="text-zinc-100">accessibility (A11y)</strong> standards. Every visible button, tooltip, input field, and screen-reader announcement is dynamically routed through an localizable dictionary.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The package bundles full translation sheets for two languages natively:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-zinc-400">
          <li><code className="text-zinc-200 font-mono">'english'</code> (Default)</li>
          <li><code className="text-zinc-200 font-mono">'portuguese'</code> (Portuguese - Brazil / Portugal)</li>
        </ul>
      </DocSection>

      <DocSection id="instance-switching" title="Instance Language Switching">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Control target languages per instance using the <code className="text-emerald-400 font-mono">language</code> prop directly. Hover over buttons or review ARIA tags to inspect translated nodes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Language: English (Default)</p>
            <InlineFileViewerDemo
              fileViewerProps={{ ...base, language: 'english' }}
              label="English UI"
              heightClass="h-72"
            />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Language: Portuguese</p>
            <InlineFileViewerDemo
              fileViewerProps={{ ...base, language: 'portuguese' }}
              label="Portuguese UI"
              heightClass="h-72"
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="global-prov" title="Global Locale Configuration">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Rather than passing <code className="text-zinc-100 font-mono">language="portuguese"</code> onto every file previewer card, define it once at application entry using <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>. This ensures all sub-viewers automatically adopt your target locale:
        </p>
        <CodeBlock code={globalI18nCode} language="tsx" />
      </DocSection>

      <DocSection id="overrides" title="Custom Dictionary String Overrides">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          If your company uses specific terminology (e.g. "Anexo" instead of "Arquivo", or "Baixar Cópia" instead of "Transferir"), override specific keys in our built-in languages without redefining the entire translation layer:
        </p>
        <CodeBlock code={i18nCustomOverrideCode} language="tsx" />
      </DocSection>

      <DocSection id="custom-languages" title="Extending to Custom Languages (e.g., Spanish)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          By overriding English keys in the global translation sheets, you can easily localise the entire interface into any unsupported language, such as Spanish:
        </p>
        <CodeBlock code={i18nSpanishCode} language="tsx" />
      </DocSection>

      <DocSection id="schema-ref" title="Essential Translation Schema Reference">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          The following list displays the most common keys in our translation dictionary that you can target for overrides:
        </p>
        <PropTable rows={i18nSchemaRef} />
      </DocSection>
    </DocPage>
  )
}
