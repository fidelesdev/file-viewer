import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/index.css'
import './features/file-viewer/styles/index.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import {
  configureFileViewerPdfWorker,
  getFileViewerPdfWorkerSrc,
  setFileViewerDefaults,
} from './features/file-viewer'
import { App } from './app/App.tsx'

configureFileViewerPdfWorker({
  workerSrc: getFileViewerPdfWorkerSrc(),
})

setFileViewerDefaults({
  language: 'portuguese',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
