/** Plain string, or a function that receives structured values for formatting. */
export type FormattableMessage<P extends Record<string, unknown>> =
  | string
  | ((params: P) => string)

export type UnsupportedFileTypeParams = { extension: string }

export type PdfPageInputAriaLabelParams = { value: string }

export type ViewerLanguage = 'english' | 'portuguese'

export interface ViewFileTranslations {
  closeAriaLabel: string
  printAriaLabel: string
  downloadAriaLabel: string
  downloadInProgressAriaLabel: string
  unsupportedFileType: FormattableMessage<UnsupportedFileTypeParams>
}

export interface ImageViewerTranslations {
  zoomOutAriaLabel: string
  fitScreenAriaLabel: string
  zoomInAriaLabel: string
  zoomOutTooltip: string
  fitScreenTooltip: string
  zoomInTooltip: string
}

export interface PdfViewerTranslations {
  pageLabel: string
  pageInputAriaLabel: FormattableMessage<PdfPageInputAriaLabelParams>
  previousPageAriaLabel: string
  nextPageAriaLabel: string
  previousPageTooltip: string
  nextPageTooltip: string
  zoomOutAriaLabel: string
  fitWidthAriaLabel: string
  zoomInAriaLabel: string
  zoomOutTooltip: string
  fitWidthTooltip: string
  zoomInTooltip: string
}

export interface FileViewerTranslations {
  viewFile: ViewFileTranslations
  imageViewer: ImageViewerTranslations
  pdfViewer: PdfViewerTranslations
}

export const fileViewerTranslationsByLanguage: Record<
  ViewerLanguage,
  FileViewerTranslations
> = {
  english: {
    viewFile: {
      closeAriaLabel: 'Close',
      printAriaLabel: 'Print',
      downloadAriaLabel: 'Download',
      downloadInProgressAriaLabel: 'Downloading…',
      unsupportedFileType: ({ extension }) =>
        `No preview is available for file type "${extension}".`,
    },
    imageViewer: {
      zoomOutAriaLabel: 'Zoom out',
      fitScreenAriaLabel: 'Fit image',
      zoomInAriaLabel: 'Zoom in',
      zoomOutTooltip: 'Zoom out',
      fitScreenTooltip: 'Fit image',
      zoomInTooltip: 'Zoom in',
    },
    pdfViewer: {
      pageLabel: 'Page',
      pageInputAriaLabel: ({ value }) => `Page ${value}`,
      previousPageAriaLabel: 'Previous page',
      nextPageAriaLabel: 'Next page',
      previousPageTooltip: 'Previous page',
      nextPageTooltip: 'Next page',
      zoomOutAriaLabel: 'Zoom out',
      fitWidthAriaLabel: 'Fit width',
      zoomInAriaLabel: 'Zoom in',
      zoomOutTooltip: 'Zoom out',
      fitWidthTooltip: 'Fit width',
      zoomInTooltip: 'Zoom in',
    },
  },
  portuguese: {
    viewFile: {
      closeAriaLabel: 'Fechar',
      printAriaLabel: 'Imprimir',
      downloadAriaLabel: 'Transferir',
      downloadInProgressAriaLabel: 'A transferir…',
      unsupportedFileType: ({ extension }) =>
        `Ainda não existem visualizações para arquivos do tipo "${extension}".`,
    },
    imageViewer: {
      zoomOutAriaLabel: 'Diminuir zoom',
      fitScreenAriaLabel: 'Ajustar imagem',
      zoomInAriaLabel: 'Aumentar zoom',
      zoomOutTooltip: 'Diminuir zoom',
      fitScreenTooltip: 'Ajustar imagem',
      zoomInTooltip: 'Aumentar zoom',
    },
    pdfViewer: {
      pageLabel: 'Página',
      pageInputAriaLabel: ({ value }) => `Página ${value}`,
      previousPageAriaLabel: 'Página anterior',
      nextPageAriaLabel: 'Próxima página',
      previousPageTooltip: 'Página anterior',
      nextPageTooltip: 'Próxima página',
      zoomOutAriaLabel: 'Diminuir zoom',
      fitWidthAriaLabel: 'Ajustar à largura',
      zoomInAriaLabel: 'Aumentar zoom',
      zoomOutTooltip: 'Diminuir zoom',
      fitWidthTooltip: 'Ajustar à largura',
      zoomInTooltip: 'Aumentar zoom',
    },
  },
}

/** English defaults (same object as `fileViewerTranslationsByLanguage.english`). */
export const defaultFileViewerTranslations: FileViewerTranslations =
  fileViewerTranslationsByLanguage.english

export function getFileViewerTranslations(
  language: ViewerLanguage,
): FileViewerTranslations {
  return fileViewerTranslationsByLanguage[language]
}

export function resolveFormattedMessage<P extends Record<string, unknown>>(
  message: FormattableMessage<P>,
  params: P,
): string {
  return typeof message === 'function' ? message(params) : message
}
