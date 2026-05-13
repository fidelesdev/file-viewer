/** Opens the browser print dialog for a PDF URL without navigating the current tab. */
export function printPdfFromUrl(url: string): void {
  const iframe = document.createElement('iframe')
  iframe.setAttribute(
    'style',
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden',
  )
  iframe.setAttribute('aria-hidden', 'true')
  iframe.src = url

  const removeIframe = () => {
    iframe.remove()
  }

  const onLoad = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } finally {
      window.setTimeout(removeIframe, 500)
    }
  }

  iframe.addEventListener('load', onLoad, { once: true })
  iframe.addEventListener('error', removeIframe, { once: true })
  document.body.appendChild(iframe)
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
