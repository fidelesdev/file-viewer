import { Route, Routes } from 'react-router-dom'
import { DocsLayout } from './layout/DocsLayout'
import { HomePage } from './pages/HomePage'
import { GettingStartedPage } from './pages/GettingStartedPage'
import { FileViewerBasicsPage } from './pages/file-viewer/FileViewerBasicsPage'
import { FileViewerModesPage } from './pages/file-viewer/FileViewerModesPage'
import { FileViewerHeaderLevel1Page } from './pages/file-viewer/FileViewerHeaderLevel1Page'
import { FileViewerHeaderLevel2Page } from './pages/file-viewer/FileViewerHeaderLevel2Page'
import { FileViewerHeaderLevel3Page } from './pages/file-viewer/FileViewerHeaderLevel3Page'
import { FileViewerToolbarLevel1Page } from './pages/file-viewer/FileViewerToolbarLevel1Page'
import { FileViewerToolbarLevel2Page } from './pages/file-viewer/FileViewerToolbarLevel2Page'
import { FileViewerToolbarLevel3Page } from './pages/file-viewer/FileViewerToolbarLevel3Page'
import { FileViewerStylingPage } from './pages/file-viewer/FileViewerStylingPage'
import { FileViewerCallbacksPage } from './pages/file-viewer/FileViewerCallbacksPage'
import { FileViewerI18nPage } from './pages/file-viewer/FileViewerI18nPage'
import { MultiFileViewerOverviewPage } from './pages/file-viewer/MultiFileViewerOverviewPage'
import { MultiFileViewerLevel1Page } from './pages/file-viewer/MultiFileViewerLevel1Page'
import { MultiFileViewerLevel2Page } from './pages/file-viewer/MultiFileViewerLevel2Page'
import { MultiFileViewerLevel3Page } from './pages/file-viewer/MultiFileViewerLevel3Page'
import { PdfViewerOverviewPage } from './pages/pdf-viewer/PdfViewerOverviewPage'
import { PdfViewerViewModesPage } from './pages/pdf-viewer/PdfViewerViewModesPage'
import { PdfViewerPaginationPage } from './pages/pdf-viewer/PdfViewerPaginationPage'
import { PdfViewerToolbarPage } from './pages/pdf-viewer/PdfViewerToolbarPage'
import { PdfViewerRenderingPage } from './pages/pdf-viewer/PdfViewerRenderingPage'
import { PdfViewerPerformancePage } from './pages/pdf-viewer/PdfViewerPerformancePage'
import { PdfViewerStylingPage } from './pages/pdf-viewer/PdfViewerStylingPage'
import { PdfViewerCallbacksPage } from './pages/pdf-viewer/PdfViewerCallbacksPage'
import { ImageViewerOverviewPage } from './pages/image-viewer/ImageViewerOverviewPage'
import { ImageViewerToolbarPage } from './pages/image-viewer/ImageViewerToolbarPage'
import { ImageViewerStylingPage } from './pages/image-viewer/ImageViewerStylingPage'
import { ImageViewerInteractionPage } from './pages/image-viewer/ImageViewerInteractionPage'
import { GlobalsDefaultsPage } from './pages/globals/GlobalsDefaultsPage'
import { GlobalsTooltipPage } from './pages/globals/GlobalsTooltipPage'
import { GlobalsAutoHidePage } from './pages/globals/GlobalsAutoHidePage'
import { GlobalsTranslationsPage } from './pages/globals/GlobalsTranslationsPage'
import { ApiReferencePage } from './pages/ApiReferencePage'
import { TooltipComponentPage } from './pages/TooltipComponentPage'

export function DocsRoutes() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<HomePage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />

        <Route path="file-viewer" element={<FileViewerBasicsPage />} />
        <Route path="file-viewer/modes" element={<FileViewerModesPage />} />
        <Route
          path="file-viewer/header/level-1"
          element={<FileViewerHeaderLevel1Page />}
        />
        <Route
          path="file-viewer/header/level-2"
          element={<FileViewerHeaderLevel2Page />}
        />
        <Route
          path="file-viewer/header/level-3"
          element={<FileViewerHeaderLevel3Page />}
        />
        <Route
          path="file-viewer/toolbar/level-1"
          element={<FileViewerToolbarLevel1Page />}
        />
        <Route
          path="file-viewer/toolbar/level-2"
          element={<FileViewerToolbarLevel2Page />}
        />
        <Route
          path="file-viewer/toolbar/level-3"
          element={<FileViewerToolbarLevel3Page />}
        />
        <Route path="file-viewer/styling" element={<FileViewerStylingPage />} />
        <Route path="file-viewer/callbacks" element={<FileViewerCallbacksPage />} />
        <Route path="file-viewer/i18n" element={<FileViewerI18nPage />} />
        <Route path="file-viewer/multi" element={<MultiFileViewerOverviewPage />} />
        <Route
          path="file-viewer/multi/level-1"
          element={<MultiFileViewerLevel1Page />}
        />
        <Route
          path="file-viewer/multi/level-2"
          element={<MultiFileViewerLevel2Page />}
        />
        <Route
          path="file-viewer/multi/level-3"
          element={<MultiFileViewerLevel3Page />}
        />

        <Route path="pdf-viewer" element={<PdfViewerOverviewPage />} />
        <Route path="pdf-viewer/view-modes" element={<PdfViewerViewModesPage />} />
        <Route path="pdf-viewer/pagination" element={<PdfViewerPaginationPage />} />
        <Route path="pdf-viewer/toolbar" element={<PdfViewerToolbarPage />} />
        <Route path="pdf-viewer/rendering" element={<PdfViewerRenderingPage />} />
        <Route path="pdf-viewer/performance" element={<PdfViewerPerformancePage />} />
        <Route path="pdf-viewer/styling" element={<PdfViewerStylingPage />} />
        <Route path="pdf-viewer/callbacks" element={<PdfViewerCallbacksPage />} />

        <Route path="image-viewer" element={<ImageViewerOverviewPage />} />
        <Route path="image-viewer/toolbar" element={<ImageViewerToolbarPage />} />
        <Route path="image-viewer/styling" element={<ImageViewerStylingPage />} />
        <Route path="image-viewer/interaction" element={<ImageViewerInteractionPage />} />

        <Route path="globals/defaults" element={<GlobalsDefaultsPage />} />
        <Route path="globals/tooltip" element={<GlobalsTooltipPage />} />
        <Route path="globals/auto-hide" element={<GlobalsAutoHidePage />} />
        <Route path="globals/translations" element={<GlobalsTranslationsPage />} />

        <Route path="api-reference" element={<ApiReferencePage />} />
        <Route path="components/tooltip" element={<TooltipComponentPage />} />
      </Route>
    </Routes>
  )
}
