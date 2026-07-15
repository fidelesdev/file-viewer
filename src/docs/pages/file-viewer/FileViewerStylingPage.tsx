import { useState } from 'react'
import type { FileViewerClassNames } from '@/features/file-viewer'
import { DocPage } from '../../layout/DocPage'
import { DocSection } from '../../layout/DocSection'
import { CodeBlock } from '../../components/CodeBlock'
import { PropTable } from '../../components/PropTable'
import { InlineFileViewerDemo, ModalDemo } from '../../components/ModalDemo'
import { SlotHighlighter } from '../../components/SlotHighlighter'
import { SAMPLES, SAMPLE_NAMES } from '../../demos/assets'

const base = {
  name: SAMPLE_NAMES.multipagePdf,
  extension: 'pdf',
  url: SAMPLES.multipagePdf,
} as const

const shellSlots = [
  { key: 'header', label: 'header' },
  { key: 'headerTitle', label: 'headerTitle' },
  { key: 'headerActions', label: 'headerActions' },
  { key: 'viewer', label: 'viewer' },
  { key: 'loader', label: 'loader' },
]

const globalStylingCode = `/* Override variables in your global globals.css or tailwind.css */
:root {
  /* Brand Theme Colors */
  --fv-color-text: #f8fafc;
  --fv-bg-panel: rgba(15, 23, 42, 0.95); /* slate-900 background */
  --fv-bg-toolbar: rgba(30, 41, 59, 0.85); /* slate-800 toolbar */
  --fv-border-toolbar: rgba(71, 85, 105, 0.4);
  
  /* Borders & Shadows */
  --fv-radius-lg: 1rem;
  --fv-radius-full: 9999px;
  --fv-shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.3);
  
  /* Layout Sizing */
  --fv-max-page-width: 55rem;
  --fv-multi-file-list-width: 18rem;
}`

const slotExampleCode = `<FileViewer
  open={open}
  onOpenChange={setOpen}
  name="preview.png"
  extension="png"
  url="/preview.png"
  classNames={{
    header: 'bg-zinc-900 border-b border-zinc-800 px-6 py-4',
    headerTitle: 'text-emerald-400 font-semibold',
    viewer: 'bg-zinc-950 p-8',
  }}
  styles={{
    header: { height: '4rem' },
  }}
/>`

const colorVars = [
  { name: '--fv-color-text', type: '#ffffff', description: 'Base text color inside headers, lists, and toolbar text labels.' },
  { name: '--fv-color-text-muted', type: 'rgba(255, 255, 255, 0.9)', description: 'Semi-prominent text color applied to icon paths and sub-labels.' },
  { name: '--fv-color-text-muted-70', type: 'rgba(255, 255, 255, 0.7)', description: 'Muted text label opacity layer.' },
  { name: '--fv-color-text-muted-40', type: 'rgba(255, 255, 255, 0.4)', description: 'Highly muted label opacity layer.' },
  { name: '--fv-bg-panel', type: 'rgba(38, 38, 38, 0.95)', description: 'Background of the core shell viewport and layout wrappers.' },
  { name: '--fv-bg-toolbar', type: 'rgba(23, 23, 23, 0.6)', description: 'Background fill of the floating toolbar block.' },
  { name: '--fv-bg-tooltip', type: 'rgba(23, 23, 23, 0.75)', description: 'Background fill of active tooltips.' },
  { name: '--fv-bg-page', type: '#ffffff', description: 'The display background of the PDF document sheet page.' },
  { name: '--fv-bg-page-placeholder', type: 'rgba(128, 128, 128, 0.25)', description: 'Canvas background for unrendered pages inside the continuous scroll view window.' },
]

const layoutVars = [
  { name: '--fv-toolbar-height', type: '3.25rem', description: 'Height dimension of the floating toolbar.' },
  { name: '--fv-max-page-width', type: '50rem', description: 'Maximum horizontal scaling limit of a PDF document page.' },
  { name: '--fv-multi-file-list-width', type: '15rem', description: 'Width of the MultiFileViewer side list navigation panel.' },
  { name: '--fv-multi-file-list-collapsed-width', type: '2.75rem', description: 'Width of the MultiFileViewer side list when collapsed.' },
  { name: '--fv-multi-file-list-strip-height', type: '3.25rem', description: 'Line-height strip size of list items.' },
  { name: '--fv-radius-md', type: '0.375rem', description: 'Border radius for standard rounded shapes.' },
  { name: '--fv-radius-lg', type: '0.5rem', description: 'Border radius for modal corners and outer viewports.' },
]

const zIndexVars = [
  { name: '--fv-z-dialog-content', type: '100', description: 'Layer height for the main Modal Dialog Content.' },
  { name: '--fv-z-tooltip', type: '200', description: 'Layer height for hovering helper tooltips.' },
  { name: '--fv-z-toolbar', type: '10', description: 'Layer height of the active floating toolbar.' },
  { name: '--fv-z-scrollbar', type: '20', description: 'Layer height of the PDF container scroll thumb track.' },
]

export function FileViewerStylingPage() {
  const [slotClasses, setSlotClasses] = useState<Partial<FileViewerClassNames>>({})

  return (
    <DocPage
      title="FileViewer Styling"
      description="Style the document viewer to fit your branding guidelines using global CSS Variables, local style slots, or Tailwind class strings."
    >
      <DocSection id="overview" title="The Unified Styling Model">
        <p className="text-zinc-300 leading-relaxed">
          The styling system of <code className="text-emerald-400 font-mono">@fdls/file-viewer</code> utilizes a tiered customization model. It provides <strong className="text-zinc-100">Design Tokens (CSS Variables)</strong> for wide-sweeping adjustments, combined with <strong className="text-zinc-100">Specific Styling Slots</strong> for fine-grained class merges.
        </p>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          All slots are designed to merge safely. The internal Tailwind styles are injected as baseline layers, meaning your layout will never break or collapse when overriding class slots with custom borders, sizes, or flex structures.
        </p>
      </DocSection>

      <DocSection id="css-variables" title="Design Tokens (CSS Variables)">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          You can completely restyle the colors, borders, shadows, heights, and panel dimensions by defining the system design tokens inside your global CSS file. This is the cleanest way to adapt the viewer to dark mode, brand color transitions, or rounder layouts.
        </p>
        <CodeBlock code={globalStylingCode} language="css" />
      </DocSection>

      <DocSection id="shell-class" title="Container Class Injections">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          For basic card layouts, pass a standard <code className="text-emerald-400 font-mono">className</code> or inline <code className="text-emerald-400 font-mono">style</code> to the main container. Below, we apply an outer emerald ring and subtle rounded border directly:
        </p>
        <InlineFileViewerDemo
          fileViewerProps={{
            ...base,
            className: 'rounded-xl ring-2 ring-emerald-500/30 overflow-hidden shadow-2xl',
            style: { minHeight: '100%' },
          }}
          heightClass="h-72"
        />
      </DocSection>

      <DocSection id="slot-highlighter" title="Interactive ClassName Slot Selector">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          Click the visual layout targets below to highlight specific class slot borders and see exactly which HTML containers you are targeting with the <code className="text-zinc-100 font-mono">classNames</code> prop:
        </p>
        <div className="mb-4">
          <SlotHighlighter
            slots={shellSlots}
            onChange={(active) =>
              setSlotClasses(active as Partial<FileViewerClassNames>)
            }
          />
        </div>
        <InlineFileViewerDemo
          fileViewerProps={{ ...base, classNames: slotClasses }}
          heightClass="h-72"
        />
        <div className="mt-4">
          <CodeBlock code={slotExampleCode} language="tsx" />
        </div>
      </DocSection>

      <DocSection id="dialog-content" title="Modal Overlay Customization">
        <p className="text-zinc-300 mb-4 leading-relaxed">
          When using <code className="text-zinc-100 font-mono">mode="modal"</code>, you can override the styling of the mounting dialog content box (e.g. background blur opacity layer or border outlines) via the <code className="text-emerald-400 font-mono">dialogClassNames.content</code> property.
        </p>
        <div className="mb-4">
          <ModalDemo
            triggerLabel="Open customized Modal Overlay"
            fileViewerProps={{
              ...base,
              dialogClassNames: { content: 'bg-zinc-950/95 border border-emerald-500/20 backdrop-blur-md' },
            }}
          />
        </div>
        <CodeBlock code={`dialogClassNames={{ content: 'bg-zinc-950/95 border border-emerald-500/20 backdrop-blur-md' }}`} language="tsx" />
      </DocSection>

      <DocSection id="color-token-table" title="Design Token Reference: Colors & Fills">
        <PropTable rows={colorVars.map((v) => ({ name: v.name, type: v.type, defaultValue: '—', description: v.description }))} />
      </DocSection>

      <DocSection id="layout-token-table" title="Design Token Reference: Dimensions & Layouts">
        <PropTable rows={layoutVars.map((v) => ({ name: v.name, type: v.type, defaultValue: '—', description: v.description }))} />
      </DocSection>

      <DocSection id="z-token-table" title="Design Token Reference: Layering (Z-Index)">
        <PropTable rows={zIndexVars.map((v) => ({ name: v.name, type: v.type, defaultValue: '—', description: v.description }))} />
      </DocSection>
    </DocPage>
  )
}
