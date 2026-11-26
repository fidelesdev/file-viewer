const PRINT_IFRAME_CLEANUP_FALLBACK_MS = 5 * 60 * 1000

let activePrintCleanup: (() => void) | null = null
let activePrintRequestId = 0

function isCrossOriginHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.href)
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.origin !== window.location.origin
    )
  } catch {
    return false
  }
}

function printPdfViaIframe(
  targetUrl: string,
  fallbackUrl: string,
  objectUrlToRevoke?: string,
): void {
  const iframe = document.createElement('iframe')
  iframe.setAttribute(
    'style',
    'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none',
  )
  iframe.setAttribute('aria-hidden', 'true')
  iframe.tabIndex = -1

  let cleanedUp = false
  let fallbackTimer: number | undefined

  const cleanup = () => {
    if (cleanedUp) return
    cleanedUp = true
    if (fallbackTimer !== undefined) {
      window.clearTimeout(fallbackTimer)
    }
    window.removeEventListener('pagehide', cleanup)
    try {
      iframe.contentWindow?.removeEventListener('afterprint', cleanup)
    } catch {
      // Ignore cross-origin access restrictions
    }
    iframe.remove()
    if (objectUrlToRevoke) {
      URL.revokeObjectURL(objectUrlToRevoke)
    }
    if (activePrintCleanup === cleanup) {
      activePrintCleanup = null
    }
  }

  activePrintCleanup = cleanup
  window.addEventListener('pagehide', cleanup, { once: true })

  const onLoad = () => {
    try {
      iframe.contentWindow?.addEventListener('afterprint', cleanup, {
        once: true,
      })
    } catch {
      // Ignore cross-origin access restrictions
    }

    fallbackTimer = window.setTimeout(cleanup, PRINT_IFRAME_CLEANUP_FALLBACK_MS)

    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      cleanup()
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
  }

  iframe.addEventListener('load', onLoad, { once: true })
  iframe.addEventListener('error', cleanup, { once: true })
  iframe.src = targetUrl
  document.body.appendChild(iframe)
}

/** Opens the browser print dialog for a PDF URL without navigating the current tab. */
export function printPdfFromUrl(url: string): void {
  activePrintCleanup?.()
  const requestId = ++activePrintRequestId

  if (!isCrossOriginHttpUrl(url)) {
    printPdfViaIframe(url, url)
    return
  }

  void (async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF (${response.status})`)
      }
      const rawBlob = await response.blob()
      if (requestId !== activePrintRequestId) return

      const pdfBlob =
        rawBlob.type === 'application/pdf'
          ? rawBlob
          : new Blob([rawBlob], { type: 'application/pdf' })
      const objectUrl = URL.createObjectURL(pdfBlob)
      printPdfViaIframe(objectUrl, url, objectUrl)
    } catch {
      if (requestId !== activePrintRequestId) return
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  })()
}

export async function downloadFileFromUrl(
  url: string,
  filename: string,
): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000)
  } catch {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}
