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
- [x] Fullscreen inline no `MultiFileViewer` preservando listagem lateral
- [ ] Drawer mobile para listagem em modal

## PdfViewer — resize / scroll (sessão 2026-07-08)

### Entregue nesta sessão
- [x] Debounce de resize do container (sem re-render de canvas em tempo real)
- [x] Centralização horizontal durante colapso/expansão da sidebar (`overflow-x: hidden` + inset)
- [x] Restauração de página após resize (não depender só de `scrollTop` em px)
- [x] Reescala proporcional de `renderedHeights` quando a largura de render muda
- [x] Suprimir transição CSS de página durante resize (`isApplyingResize`)
- [x] Loop de estabilização (`scrollHeight` estável) antes do scroll corretivo
- [x] Ocultar conteúdo + scrollbars durante settle (`data-applying-resize`)
- [x] Congelar paginação e `IntersectionObserver` durante settle
- [x] Scroll de navegação (prev/next page) contido no container (`scroll-element-within-container`)

### Refino de arquitetura (recomendado — não é bloqueio de release)
- [ ] Extrair **`ResizeTransaction`** com fases explícitas: `idle → pending → applying → restoring → settled`
- [ ] Unificar flags/refs espalhados (`isPendingContainerResize`, `isApplyingResize`, `isApplyingResizeRef`, `pageToRestoreOnResizeRef`, loop RAF) em um único módulo/hook (ex.: `usePdfResizeSettle`)
- [ ] Fonte de verdade única para “página lógica” durante transação (IO, paginação e scrollbar leem só isso)
- [ ] Testes manuais/documentados: PDF 100+ páginas, resize maior→menor e menor→maior, sidebar animada, zoom após resize

## FileViewer — gaps essenciais (lib geral)

- [ ] Suporte a mais extensões além de pdf / jpg / jpeg / png
- [ ] Visualizador de texto plano (.txt, .md)
- [ ] Visualizador ou fallback estruturado para office (docx, xlsx) — avaliar escopo
- [ ] Testes automatizados (unit) para `FileViewer` / viewers
- [ ] Testes e2e Playwright para fluxos críticos no playground
- [ ] Fechar issue #1 após release que atenda listagem lateral + pilha
- [x] `ImageViewer`: `hasImageLoaded` com imagem em cache ao alternar arquivo (image → PDF → image)
- [x] `FileListPanel`: colapso com `styles.fileList.width` via `--fv-multi-file-list-width` (não inline `width`)

## Refatoração de Documentação — Guia de Tutoriais e Referências

- [x] **Introdução e Setup**
  - [x] Começando (`getting-started`): Refatorar para incluir melhores exemplos práticos de instalação, importação de CSS e setup sem fricção.
- [x] **Módulo: FileViewer**
  - [x] Conceitos Básicos (`file-viewer`): Detalhar funcionamento do preview de arquivo único.
  - [x] Modos de Visualização (`file-viewer/modes`): Enriquecer explicação de modos inline e modal.
  - [x] Níveis de Customização do Header:
    - [x] Level 1 (`header/level-1`): Configuração declarativa rápida.
    - [x] Level 2 (`header/level-2`): Slots e inserções extras de botões.
    - [x] Level 3 (`header/level-3`): Sobrescrita completa do componente de Header.
  - [x] Níveis de Customização da Toolbar:
    - [x] Level 1 (`toolbar/level-1`): Visibilidade de ações nativas.
    - [x] Level 2 (`toolbar/level-2`): Injeção de itens e separadores extras.
    - [x] Level 3 (`toolbar/level-3`): Sobrescrita total da barra de ferramentas.
  - [x] Estilização (`file-viewer/styling`): Documentar detalhadamente classes globais e CSS variables.
  - [x] Callbacks (`file-viewer/callbacks`): Casos reais de tracking e analytics.
  - [x] Tradução e I18n (`file-viewer/i18n`): Guia de overrides de strings.
- [x] **Módulo: MultiFileViewer**
  - [x] Visão Geral (`file-viewer/multi`): Detalhar arquitetura do visualizador múltiplo e seus layouts (sidebar, stack V/H).
  - [x] Níveis de Customização da Listagem:
    - [x] Level 1 (`multi/level-1`): Configurações declarativas básicas e ordenação.
    - [x] Level 2 (`multi/level-2`): Slots para inserção de componentes na listagem (ex.: headers extras).
    - [x] Level 3 (`multi/level-3`): Render customizado completo de itens e lista (`renderFileListItem`).
- [x] **Módulo: PdfViewer**
  - [x] Visão Geral (`pdf-viewer`): Explicação do motor do visualizador de PDF (react-pdf).
  - [x] Modos de Exibição (`pdf-viewer/view-modes`): Diferenças entre visualização contínua e página por página.
  - [x] Paginação e Navegação (`pdf-viewer/pagination`): APIs de controle programático de página.
  - [x] Customização de Toolbar (`pdf-viewer/toolbar`): Modificações exclusivas do PdfViewer.
  - [x] Pipeline de Renderização (`pdf-viewer/rendering`): Entendimento de canvas vs text layer vs annotation layer.
  - [x] Performance e Resize (`pdf-viewer/performance`): Debounce de resize, re-escalonamento de placeholder e virtualização de render.
  - [x] Estilização (`pdf-viewer/styling`): Vars CSS e seletores do PdfViewer.
  - [x] Callbacks (`pdf-viewer/callbacks`): Handlers de sucesso, falha e renderização de página.
- [x] **Módulo: ImageViewer**
  - [x] Visão Geral (`image-viewer`): Preview de imagens de alta performance.
  - [x] Toolbar (`image-viewer/toolbar`): Customizações e injeções de ferramentas de imagem.
  - [x] Estilização (`image-viewer/styling`): Aspectos visuais e classes para ImageViewer.
  - [x] Interações (`image-viewer/interaction`): Zoom por gesto, double-tap, pan e reset de viewport.
- [x] **Módulo: Globals e Primitivos**
  - [x] Configurações Globais (`globals/defaults`): Guia detalhado de uso de `setFileViewerDefaults`.
  - [x] Tooltip Global (`globals/tooltip`): Provedor global e customização de tooltips.
  - [x] Auto-Hide (`globals/auto-hide`): Mecanismo de ocultação automática de toolbars.
  - [x] Traduções (`globals/translations`): Centralização de dicionários e localização.
  - [x] Referência de API (`api-reference`): Documentar todas as tipagens exportadas de forma limpa e automática.
  - [x] Componente Tooltip (`components/tooltip`): API do utilitário interno exposto de tooltip.

## Concluído

### UX MultiFileViewer + viewers — 2026-07-08
- Sidebar colapsável: padding padronizado, label some/aparece instantâneo, ícone collapse alinhado (`fv-icon--sm`)
- MultiFileViewer fullscreen com listagem lateral
- PdfViewer: pipeline completo de resize/settle/restore (ver seção acima)

### v0.5.0 — 2026-06-23
- MultiFileViewer completo (core, customização L1–L3, a11y, docs, release 0.5.0)
