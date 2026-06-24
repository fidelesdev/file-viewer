export function normalizeViewerExtension(extension: string): string {
  return extension.toLowerCase().replace(/^\./, '')
}

export function isPdfExtension(extension: string): boolean {
  return normalizeViewerExtension(extension) === 'pdf'
}

export function isImageExtension(extension: string): boolean {
  return ['jpg', 'jpeg', 'png'].includes(normalizeViewerExtension(extension))
}

export function isSupportedViewerExtension(extension: string): boolean {
  return isPdfExtension(extension) || isImageExtension(extension)
}

export function getViewerFileKey(
  file: { id?: string; url: string },
  index: number,
): string {
  return file.id ?? file.url ?? String(index)
}

export function clampActiveIndex(index: number, length: number): number {
  if (length <= 0) {
    return 0
  }
  return Math.min(Math.max(index, 0), length - 1)
}
