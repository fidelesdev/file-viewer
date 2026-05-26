# Changelog

All notable changes to `@fdls/file-viewer` are documented in this file.

## [0.4.0] — 2026-05-26

### Breaking changes

- **DOM:** Removed the redundant `.fv-dialog-panel` wrapper. The outer shell is now a single `.fv-shell-root` element.
- **Outer styling:** Use `className` and `style` on `FileViewer` (or `fileViewer.className` / `fileViewer.style` in global defaults) instead of `classNames.root`, `styles.root`, `dialogClassNames.panel`, and `dialogStyles.panel`.
- **Dialog customization:** Removed `dialogClassNames.backdrop` and `dialogClassNames.panel` (backdrop never rendered; panel wrapper removed). Only `dialogClassNames.content` / `dialogStyles.content` remain for the modal overlay layer.
- **Fullscreen rename:**
  - `showOpenInModalButton` → `showFullscreenButton`
  - `onOpenInModal` → `onFullscreen`
  - `classNames.openInModalButton` → `classNames.fullscreenButton`
  - `styles.openInModalButton` → `styles.fullscreenButton`
  - Translation keys `openInModalAriaLabel` / `openInModalTooltip` → `fullscreenAriaLabel` / `fullscreenTooltip`

### Added

- `className` / `style` on `FileViewer` for the outer shell container.
- `showPrintButton` and `showDownloadButton` toggles (default `true`).
- **Header actions — level 2:** `extraHeaderActions` to append custom actions after built-in controls.
- **Header actions — level 3:** `renderHeaderActions({ defaultActions, ...context })` to compose or fully replace the toolbar.
- **Close button — level 3:** `renderCloseButton({ defaultCloseButton, close, mode })` to wrap or replace the close control.
- Exported types: `FileViewerHeaderActionsContext`, `FileViewerHeaderActionsRenderProps`, `FileViewerCloseButtonContext`, `FileViewerCloseButtonRenderProps`.
- Full-screen toggle in inline mode: enter button in inline shell, exit button (`Minimize2`) in the preview modal header.
- `FileViewerHeaderActionsContext.toggleFullscreen` and `isFullscreen` for custom header actions.
- `extraHeaderActionsSide` (`left` | `right`) and wrapper slots `headerActionsBuiltins` / `headerActionsExtra` for positioning extra toolbar actions.

### Fixed

- PDF toolbar (zoom controls) now appears for single-page documents; page navigation is hidden when `numPages <= 1`.

### Migration

```tsx
// Before (0.3.x)
<FileViewer
  dialogClassNames={{ panel: 'h-full', backdrop: 'hidden' }}
  classNames={{ root: 'rounded-lg', openInModalButton: 'btn-icon' }}
  showOpenInModalButton
/>

// After (0.4)
<FileViewer
  className="h-full rounded-lg"
  classNames={{ fullscreenButton: 'btn-icon' }}
  showFullscreenButton
  extraHeaderActions={<ShareButton />}
/>
```

## [0.3.2] — prior release

- Plain CSS bundle (`dist/style.css`), PDF scroll/zoom fixes, tooltip placement fix, modal without backdrop.
