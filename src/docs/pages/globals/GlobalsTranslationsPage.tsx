import { useEffect } from 'react'
import {
  FileViewer,
  resetFileViewerDefaults,
  setFileViewerDefaults,
} from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { LiveDemo } from '../../components/LiveDemo'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

function TranslationsDemo() {
  useEffect(() => {
    setFileViewerDefaults({
      translations: {
        english: {
          fileViewer: {
            downloadAriaLabel: 'Save file',
            downloadTooltip: 'Save to cloud / local storage',
          },
        },
      },
    })
    return () => resetFileViewerDefaults()
  }, [])

  return (
    <FileViewer
      mode="inline"
      open
      onOpenChange={() => undefined}
      name={SAMPLE_NAMES.multipagePdf}
      extension="pdf"
      url={SAMPLES.multipagePdf}
      language="english"
    />
  )
}

const customSpanishConfigCode = `import { setFileViewerDefaults } from '@fdls/file-viewer'

// Extend the library with a custom language (e.g., Spanish) by overriding English keys
setFileViewerDefaults({
  language: 'english', // Use english as base
  translations: {
    english: {
      fileViewer: {
        closeAriaLabel: 'Cerrar visualizador',
        downloadTooltip: 'Descargar archivo',
        printTooltip: 'Imprimir documento',
        fullscreenTooltip: 'Pantalla completa',
      },
      pdfViewer: {
        previousPageTooltip: 'Página anterior',
        nextPageTooltip: 'Página siguiente',
        zoomInTooltip: 'Acercar',
        zoomOutTooltip: 'Alejar',
        pageOfLabel: 'de', // "Página 1 de 5"
      },
      multiFileViewer: {
        emptyFilesMessage: 'No hay archivos para mostrar',
        searchPlaceholder: 'Buscar archivo...',
      }
    }
  }
})`

const translationSchemaTree = `{
  fileViewer: {
    closeAriaLabel: string;
    downloadAriaLabel: string;
    downloadTooltip: string;
    printAriaLabel: string;
    printTooltip: string;
    fullscreenAriaLabel: string;
    fullscreenTooltip: string;
    restoreFullscreenAriaLabel: string;
    restoreFullscreenTooltip: string;
    fallbackMessage: string;
    fallbackDownloadButton: string;
  },
  multiFileViewer: {
    emptyFilesMessage: string;
    collapseFileListAriaLabel: string;
    expandFileListAriaLabel: string;
    searchPlaceholder: string;
  },
  pdfViewer: {
    previousPageAriaLabel: string;
    previousPageTooltip: string;
    nextPageAriaLabel: string;
    nextPageTooltip: string;
    pageInputAriaLabel: string;
    zoomInAriaLabel: string;
    zoomInTooltip: string;
    zoomOutAriaLabel: string;
    zoomOutTooltip: string;
    fitToWidthAriaLabel: string;
    fitToWidthTooltip: string;
    fitToScreenAriaLabel: string;
    fitToScreenTooltip: string;
    pageOfLabel: string;
  },
  imageViewer: {
    zoomInAriaLabel: string;
    zoomInTooltip: string;
    zoomOutAriaLabel: string;
    zoomOutTooltip: string;
    fitToScreenAriaLabel: string;
    fitToScreenTooltip: string;
  }
}`

export function GlobalsTranslationsPage() {
  return (
    <DocPage
      title="Global Translations & Dictionary Schemas"
      description="Tailor localized messages globally: learn the nested translation structures, perform selective dictionary overrides, and extend to custom languages."
    >
      <DocSection id="overview" title="Localization and Accessibility Context">
        <p className="text-zinc-300 leading-relaxed">
          Creating a truly accessible digital workspace requires clear ARIA labels, descriptive tooltips, and readable screen reader attributes.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          The <code className="text-emerald-400 font-mono">FileViewer</code> suite comes pre-configured with complete translation dictionaries for <strong className="text-zinc-100">English</strong> and <strong className="text-zinc-100">Portuguese</strong>.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          By utilizing the global <code className="text-emerald-400 font-mono">translations</code> block in <code className="text-emerald-400 font-mono">setFileViewerDefaults</code>, you can perform partial updates to specific translation keys or translate the entire interface into new languages (such as Spanish, French, or German) with minimal effort.
        </p>
      </DocSection>

      <DocSection id="interactive" title="Selective Translation Override Sandbox">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          In the sandbox below, we override the default download tooltip text from "Download" to "Save to cloud / local storage". Hover over the download icon on the top right to verify the updated tooltip:
        </p>

        <LiveDemo heightClass="h-80" label="Customized Hover Tooltips Demo">
          <TranslationsDemo />
        </LiveDemo>
      </DocSection>

      <DocSection id="custom-lang" title="Translating to Unsupported Languages (e.g. Spanish)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Translate the entire UI into an unsupported language by overriding the base English translation keys:
        </p>
        <CodeBlock code={customSpanishConfigCode} language="tsx" />
      </DocSection>

      <DocSection id="schema" title="Complete Dictionary Type Schema">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          These nested properties represent the full, type-safe dictionary schema used across all viewers. Every property is fully optional during partial overrides:
        </p>
        <CodeBlock code={translationSchemaTree} language="typescript" />
      </DocSection>
    </DocPage>
  )
}
