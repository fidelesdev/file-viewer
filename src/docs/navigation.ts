export type NavItem = {
  title: string
  path: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const docsNavigation: NavGroup[] = [
  {
    title: 'Getting started',
    items: [
      { title: 'Introduction', path: '/' },
      { title: 'Quick start', path: '/getting-started' },
    ],
  },
  {
    title: 'FileViewer',
    items: [
      { title: 'Overview', path: '/file-viewer' },
      { title: 'Modes', path: '/file-viewer/modes' },
      { title: 'Header — Level 1', path: '/file-viewer/header/level-1' },
      { title: 'Header — Level 2', path: '/file-viewer/header/level-2' },
      { title: 'Header — Level 3', path: '/file-viewer/header/level-3' },
      { title: 'Toolbar — Level 1', path: '/file-viewer/toolbar/level-1' },
      { title: 'Toolbar — Level 2', path: '/file-viewer/toolbar/level-2' },
      { title: 'Toolbar — Level 3', path: '/file-viewer/toolbar/level-3' },
      { title: 'Styling', path: '/file-viewer/styling' },
      { title: 'Callbacks', path: '/file-viewer/callbacks' },
      { title: 'i18n', path: '/file-viewer/i18n' },
      { title: 'MultiFileViewer', path: '/file-viewer/multi' },
      { title: 'MultiFileViewer — Level 1', path: '/file-viewer/multi/level-1' },
      { title: 'MultiFileViewer — Level 2', path: '/file-viewer/multi/level-2' },
      { title: 'MultiFileViewer — Level 3', path: '/file-viewer/multi/level-3' },
    ],
  },
  {
    title: 'PdfViewer',
    items: [
      { title: 'Overview', path: '/pdf-viewer' },
      { title: 'View modes', path: '/pdf-viewer/view-modes' },
      { title: 'Pagination', path: '/pdf-viewer/pagination' },
      { title: 'Toolbar', path: '/pdf-viewer/toolbar' },
      { title: 'Rendering', path: '/pdf-viewer/rendering' },
      { title: 'Performance', path: '/pdf-viewer/performance' },
      { title: 'Styling', path: '/pdf-viewer/styling' },
      { title: 'Callbacks', path: '/pdf-viewer/callbacks' },
    ],
  },
  {
    title: 'ImageViewer',
    items: [
      { title: 'Overview', path: '/image-viewer' },
      { title: 'Toolbar', path: '/image-viewer/toolbar' },
      { title: 'Styling', path: '/image-viewer/styling' },
      { title: 'Interaction', path: '/image-viewer/interaction' },
    ],
  },
  {
    title: 'Globals',
    items: [
      { title: 'Defaults', path: '/globals/defaults' },
      { title: 'Tooltip', path: '/globals/tooltip' },
      { title: 'Auto-hide', path: '/globals/auto-hide' },
      { title: 'Translations', path: '/globals/translations' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'API reference', path: '/api-reference' },
      { title: 'Tooltip component', path: '/components/tooltip' },
    ],
  },
]
