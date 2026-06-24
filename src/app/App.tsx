import { BrowserRouter } from 'react-router-dom'
import { DocsRoutes } from '@/docs/routes'

export function App() {
  return (
    <BrowserRouter>
      <DocsRoutes />
    </BrowserRouter>
  )
}
