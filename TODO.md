# @fdls/file-viewer — TODO

> Checklist de entregas essenciais. Manter atualizado até cada item estar concluído.

## v0.5.0 — MultiFileViewer (issue #1)

### Core
- [x] Componente `MultiFileViewer` exportado na lib
- [x] Tipo `ViewerFileItem` + props (layout, stack, activeIndex)
- [x] Layout `sidebar`
- [x] Layout `stack` — orientação `vertical`
- [x] Layout `stack` — orientação `horizontal`
- [x] `stackPosition` top / bottom
- [x] Modos `inline` e `modal`
- [x] Reset de viewer ao trocar arquivo (`key` por url/id)

### Customização do painel (Level 1–3)
- [x] Slots `classNames` / `styles` (`fileList`, itens, preview, …)
- [x] CSS vars `--fv-multi-file-list-*` (width / max-height / strip-height)
- [x] `extraFileListHeader` (Level 2)
- [x] `renderFileListItem` / `renderFileList` (Level 3)
- [x] `setFileViewerDefaults({ multiFileViewer })` + `resolveMultiFileViewerProps`

### UX / a11y
- [x] Navegação por teclado na lista
- [x] `aria-*` / roles corretos (listbox / tablist)
- [x] Traduções EN + PT para strings da listagem
- [x] `hideFileListWhenSingle`
- [x] Estado vazio (`files.length === 0`)
- [x] Arquivo unsupported na lista (`renderUnsupported` por item)

### Docs & release
- [x] Página docs — layouts (sidebar / stack V / stack H)
- [x] Página docs — customização Level 1 / 2 / 3
- [x] README + CHANGELOG 0.5.0
- [x] Demo mixed PDF + imagem no playground
- [x] `npx tsc --noEmit` + `build:lib` + `build` OK

## MultiFileViewer — follow-ups (pós-v0.5.0)

- [ ] Thumbnails reais no item da lista (miniatura PDF / imagem)
- [ ] Drag-and-drop reorder da lista
- [ ] Lazy preload de URLs adjacentes (index ± 1)
- [ ] Virtualização para listas grandes (100+ arquivos)
- [ ] Loading / error state **por item** na listagem
- [ ] Busca / filtro na listagem
- [x] Sidebar colapsável no `MultiFileViewer`
- [ ] Drawer mobile para listagem em modal

## FileViewer — gaps essenciais (lib geral)

- [ ] Suporte a mais extensões além de pdf / jpg / jpeg / png
- [ ] Visualizador de texto plano (.txt, .md)
- [ ] Visualizador ou fallback estruturado para office (docx, xlsx) — avaliar escopo
- [ ] Testes automatizados (unit) para `FileViewer` / viewers
- [ ] Testes e2e Playwright para fluxos críticos no playground
- [ ] Fechar issue #1 após release que atenda listagem lateral + pilha

## Concluído

### v0.5.0 — 2026-06-23
- MultiFileViewer completo (core, customização L1–L3, a11y, docs, release 0.5.0)
