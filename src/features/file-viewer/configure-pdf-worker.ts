import { pdfjs } from 'react-pdf'

export type ConfigureFileViewerPdfWorkerOptions = {
  /**
   * URL to `pdf.worker.min.mjs`.
   *
   * Prefer `getFileViewerPdfWorkerSrc()` (same version as react-pdf’s API).
   *
   * If you use `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`,
   * pin `pdfjs-dist` to the same version as react-pdf (see `pdfjs.version`), or
   * npm may hoist a newer `pdfjs-dist` and the worker will not match the API.
   */
  workerSrc?: string
}

let configuredWorkerSrc: string | undefined

/**
 * Worker URL for the **same** pdfjs version react-pdf uses (`pdfjs.version`).
 * Use this as `workerSrc` to avoid API/worker mismatches (e.g. 4.8.69 vs 4.10.x).
 */
export function getFileViewerPdfWorkerSrc(): string {
  return `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

/** @deprecated Use `getFileViewerPdfWorkerSrc` */
export const getFileViewerPdfWorkerCdnUrl = getFileViewerPdfWorkerSrc

/** Whether `configureFileViewerPdfWorker` has been called. */
export function isFileViewerPdfWorkerConfigured(): boolean {
  return configuredWorkerSrc !== undefined
}

/**
 * Configures the PDF.js worker used by `FileViewer` / `PdfViewer`.
 *
 * Call once in your app entry **before** rendering PDFs.
 *
 * Default (`workerSrc` omitted): `getFileViewerPdfWorkerSrc()` (unpkg, needs network).
 */
export function configureFileViewerPdfWorker(
  options: ConfigureFileViewerPdfWorkerOptions = {},
): void {
  const workerSrc = options.workerSrc ?? getFileViewerPdfWorkerSrc()
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc
  configuredWorkerSrc = workerSrc
}
