import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import './styles/index.css'
import { setFileViewerDefaults } from './features/file-viewer'
import { App } from './app/App.tsx'

setFileViewerDefaults({ 
  language: 'portuguese',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
