import type { ViewerFileItem } from '@/features/file-viewer'
import { SAMPLES, SAMPLE_NAMES } from './assets'

export const DEMO_FILES: ViewerFileItem[] = [
  {
    id: 'multipage-pdf',
    name: SAMPLE_NAMES.multipagePdf,
    extension: 'pdf',
    url: SAMPLES.multipagePdf,
  },
  {
    id: 'photo-jpg',
    name: SAMPLE_NAMES.photoJpg,
    extension: 'jpg',
    url: SAMPLES.photoJpg,
  },
  {
    id: 'single-page-pdf',
    name: SAMPLE_NAMES.singlePagePdf,
    extension: 'pdf',
    url: SAMPLES.singlePagePdf,
  },
]
