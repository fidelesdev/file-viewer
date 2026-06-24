# SESSION Export — 2026-06-23

## Índice

1. [Metadados](#metadados)
2. [Projeto](#projeto)
3. [Atividade atual](#atividade-atual)
4. [Histórico da sessão](#histórico-da-sessão)
5. [Pendências](#pendências)
6. [Código e arquivos-chave](#código-e-arquivos-chave)
7. [RULES](#rules)
8. [Documentos de referência](#documentos-de-referência)

---

## Metadados

| Campo | Valor |
|-------|--------|
| **Data/hora exportação** | 2026-06-23 (local) |
| **Workspace** | `/home/s4s-01/Desktop/file-viewer` |
| **Transcript ID** | `c3685bec-8966-420f-8d55-c52d61f5b251` |
| **Branch ativa** | `feat/0001-many-files` @ `6d60a86` (wip) |
| **Branch base** | `master` @ `c94e4c3` (v0.4.1 toolbar API) |
| **Working tree** | Limpo (sem alterações não commitadas) |
| **Último pedido** | `/save-session` — exportar contexto da sessão |

---

## Projeto

### Nome e propósito

**`@fdls/file-viewer`** — biblioteca React npm para preview in-app de arquivos: shell (`FileViewer`), visualizador PDF (scroll, paginação, zoom) e imagem (pan/zoom). UI própria (tooltips, dialog, ícones); sem peer deps de Radix ou icon libs.

### Estrutura (mono-repo)

```
file-viewer/
├── src/
│   ├── app/App.tsx              # Entry playground (BrowserRouter)
│   ├── docs/                    # Site de documentação interativa (NÃO publicado no npm)
│   ├── features/file-viewer/    # Código da lib (publicado em dist/)
│   ├── main.tsx
│   └── styles/index.css
├── public/samples/              # PDFs e imagem para demos
├── dist/                        # Build lib (gitignored)
├── playground-dist/             # Build vite playground (gitignored)
├── scripts/                     # bundle-lib-css, prepend-style-import
├── package.json                 # v0.4.1
├── vite.config.ts               # outDir: playground-dist
└── tsup.config.ts               # build lib
```

### Stack

| Camada | Tecnologia |
|--------|------------|
| Linguagem | TypeScript ~5.8.3 |
| UI | React 19, Tailwind CSS v4 |
| PDF | react-pdf ~9.2, pdfjs-dist 4.8.69 |
| Imagem | react-zoom-pan-pinch ^4 |
| Print | react-to-print ^3 |
| Playground router | react-router-dom ^6.30.4 (devDependency) |
| Build lib | tsup 8 |
| Build playground | Vite 6 |

### Scripts

- `npm run dev` — playground docs em `http://localhost:5173`
- `npm run build` — `tsc --noEmit` + vite → `playground-dist/`
- `npm run build:lib` — tsup + CSS bundle → `dist/`
- `npm run preview` — preview do playground buildado

### Infra / deploy

- Pacote npm público `@fdls/file-viewer`
- Playground **local only** (sem GitHub Pages nesta sessão)
- PDF worker via CDN unpkg (`configureFileViewerPdfWorker`)

### Git

| Branch | Commit | Descrição |
|--------|--------|-----------|
| `master` | `c94e4c3` | v0.4.1 — floating toolbar API (extraToolbarActions, renderToolbarActions, compose-extra-actions-area) |
| `master` | `1362a49` | v0.4.0 — shell achatado, header API 3 níveis, fullscreen rename |
| `feat/0001-many-files` | `6d60a86` | **wip** — interactive docs playground (~58 arquivos, +2722 linhas) |

---

## Atividade atual

### Pedido imediato

Exportar sessão via `/save-session` → este arquivo `SESSION.md`.

### Estado geral do trabalho

| Entrega | Status |
|---------|--------|
| Toolbar flutuante API v0.4.1 | ✅ Commitado em `master` (`c94e4c3`) |
| Fix divider/spacing toolbar | ✅ Incluído no commit v0.4.1 |
| Props `extraToolbarActions` no FileViewer | ✅ Incluído no commit v0.4.1 |
| Interactive docs playground (plano `interactive_docs_playground_702f1e74`) | ✅ Implementado; commit **wip** em `feat/0001-many-files` |
| `/save-session` | ✅ Em andamento → concluído com este arquivo |

### Arquivos tocados na atividade docs (commit `6d60a86`)

- **Novos:** `src/docs/**` (49 arquivos TS/TSX), `public/samples/*`
- **Alterados:** `src/app/App.tsx`, `src/main.tsx`, `src/styles/index.css`, `index.html`, `package.json`, `package-lock.json`

### Decisões

- **Idioma docs:** inglês (`setFileViewerDefaults({ language: 'english' })`)
- **Deploy:** local only (`npm run dev`); sem HashRouter/BrowserRouter para GH Pages
- **react-router-dom v6** (não v7) por compatibilidade Node 18 no ambiente
- **Layout:** NestJS-style — sidebar colapsável esquerda, conteúdo centro, TOC direita
- **Lib não alterada** no commit wip — apenas playground

---

## Histórico da sessão

### 1. Toolbar flutuante API (espelho do header) — v0.4.1

**Pedido:** Implementar plano `toolbar_extra_actions_api_dfc72bdb`.

**Entregue:**
- Tipos: `ViewerExtraActionsSide`, `PdfToolbarActionsContext`, `ImageToolbarActionsContext`, slots `toolbarBuiltins` / `toolbarExtra`
- `compose-extra-actions-area.tsx` — DRY header + toolbars
- `PdfViewer` / `ImageViewer`: `extraToolbarActions`, `extraToolbarActionsSide`, `renderToolbarActions`
- `FileViewer`: mesmas props repassadas ao viewer ativo
- CSS `.fv-toolbar-builtins`, `.fv-toolbar-extra`, fix divider (`align-self: stretch`, `gap: 0.5rem`)
- README, CHANGELOG 0.4.1, bump package.json

**Commit:** `c94e4c3` on `master`

---

### 2. Bugfix toolbar — divider e espaçamento

**Problema:** Separador vertical invisível; gap maior que antes.

**Causa:** Wrapper `.fv-toolbar-builtins` com `gap: 0.75rem`; `height: 100%` no divider dentro de flex sem altura definida.

**Fix:**
- CSS: `align-self: stretch`, gap `0.5rem`, wrappers com `align-items: stretch`
- `compose-extra-actions-area`: sem extras, retorna builtins **wrapped** (nível 1 slots preservados)

---

### 3. Props toolbar no FileViewer

**Pedido:** Expor `extraToolbarActions` diretamente no `FileViewer` (não só via `pdfViewerProps`).

**Entregue:** Props + merge layer em `FileViewer.tsx` e `config.ts` defaults.

---

### 4. Auditoria pré-commit

**Verificado:** sem `any`, tsc OK, build:lib OK. Fix import morto `Download` em `App.tsx`.

**Commit:** `c94e4c3`

---

### 5. Interactive documentation playground

**Pedido:** Site completo com exemplos visuais para cada customização/prop; layout NestJS (sidebar + centro + TOC).

**Plano:** `interactive_docs_playground_702f1e74.plan.md`

**Entregue (commit `6d60a86` wip):**

#### Layout (`src/docs/layout/`)
- `DocsLayout` — header fixo, sidebar, main, TOC
- `DocsSidebar` — nav colapsável, mobile drawer, `data-collapsed`
- `DocsOnThisPage` — TOC com `IntersectionObserver`
- `DocPage`, `DocSection` — anchors + registro para TOC

#### Componentes (`src/docs/components/`)
- `LiveDemo`, `ModalDemo`, `InlineFileViewerDemo`
- `CodeBlock` (copy), `PropTable`, `SlotHighlighter`, `EventLogPanel`

#### 25 rotas (`src/docs/routes.tsx`)

| Grupo | Rotas |
|-------|-------|
| Getting started | `/`, `/getting-started` |
| FileViewer | 11 páginas (overview, modes, header L1–L3, toolbar L1–L3, styling, callbacks, i18n) |
| PdfViewer | 8 páginas |
| ImageViewer | 4 páginas |
| Globals | 4 páginas |
| Reference | `/api-reference`, `/components/tooltip` |

#### Assets (`public/samples/`)
- `multipage.pdf` (~2.9 MB, tracemonkey)
- `single-page.pdf` (~18 KB)
- `photo.jpg` (~12 KB)

#### Verificação
- `npx tsc --noEmit` — OK
- `npm run build` (playground-dist) — OK

---

### 6. Listagem de componentes públicos (Ask mode)

Resposta documentando exports de `@fdls/file-viewer`: `FileViewer`, `PdfViewer`, `ImageViewer`, `FileViewerTooltip*`, funções worker/defaults/i18n, tipos. Internos não exportados: `ViewerFloatingToolbar`, icons, primitives.

---

## Pendências

### Explícitas / recomendadas

- [ ] **Renomear commit `wip`** → mensagem descritiva antes de merge em `master`
- [ ] **Revisar manualmente** todas as 25 rotas no browser (`npm run dev`)
- [ ] **Decidir merge** `feat/0001-many-files` → `master` (PR ou merge local)
- [ ] **Opcional:** code-split routes (chunk 739 KB warning no build)
- [ ] **Opcional:** sidebar collapsed mode — ícones `•` genéricos; melhorar UX colapsada
- [ ] **Opcional:** adicionar `SESSION.md` ao `.gitignore` se não quiser versionar

### NÃO fazer sem pedido explícito

- Commitar `SESSION.md`
- Push para remote
- Alterar código em `src/features/file-viewer/` (lib npm)
- Editar arquivos `.plan.md`
- Deploy GitHub Pages
- Rewrite README npm com conteúdo do playground

---

## Código e arquivos-chave

### Entry playground

```tsx
// src/app/App.tsx
import { BrowserRouter } from 'react-router-dom'
import { DocsRoutes } from '@/docs/routes'

export function App() {
  return (
    <BrowserRouter>
      <DocsRoutes />
    </BrowserRouter>
  )
}
```

### Navegação (fonte única sidebar)

- `src/docs/navigation.ts` — `docsNavigation: NavGroup[]`
- `src/docs/routes.tsx` — `<Routes>` com ~25 `<Route>`

### Samples

```ts
// src/docs/demos/assets.ts
export const SAMPLES = {
  multipagePdf: '/samples/multipage.pdf',
  singlePagePdf: '/samples/single-page.pdf',
  photoJpg: '/samples/photo.jpg',
}
```

### Lib — API toolbar (v0.4.1, master)

Três níveis (header e toolbar):

| Nível | Header | Toolbar |
|-------|--------|---------|
| 1 | toggles, classNames/styles | toolbarBuiltins, toolbarExtra, global toolbar.* |
| 2 | extraHeaderActions + side | extraToolbarActions + side |
| 3 | renderHeaderActions | renderToolbarActions |

Precedência: nível 3 substitui montagem; `renderPagination={null}` esconde toolbar PDF inteira.

### Arquivos lib alterados em v0.4.1 (master)

- `FileViewer.tsx`, `PdfViewer.tsx`, `ImageViewer.tsx`
- `customization-types.ts`, `config.ts`, `index.ts`
- `utils/compose-extra-actions-area.tsx` (novo)
- `styles/toolbar.css`
- `CHANGELOG.md`, `README.md`, `package.json`

---

## RULES

### Workspace Rules

*(Nenhum `.cursor/rules/*.mdc` no repositório file-viewer.)*

**Agent requestable (Prisma plugin):** migration-best-practices, schema-conventions — não aplicáveis a este repo (sem Prisma).

---

### User Rules (resumo fiel integral)

#### Git / commits
- **Só commitar quando pedido explicitamente**
- Protocolo: git status + diff + log; HEREDOC para mensagem; nunca `--no-verify`, force push main, amend exceto condições estritas
- **Não push** sem pedido

#### PRs
- Usar `gh` para GitHub; corpo com Summary + Test plan

#### Comunicação
- Code citations: ` ```startLine:endLine:filepath ` em linha própria
- Markdown links completos; prosa clara; sem engagement baiting
- Mermaid/ascii quando útil para fluxos complexos

#### Código
- **NUNCA `any`** — usar `unknown`, generics, Record
- **Aliases semânticos** em array callbacks (nunca `e`, `d`, `i`)
- Minimize scope — diff mínimo; não fazer o não pedido
- Match convenções existentes; comments só se não óbvio
- Tests só se pedidos ou meaningful

#### Tailwind / data attributes
- **Não** concatenar variáveis em `className` para estados — usar `data-*` + modifiers
- **Não** cores arbitrárias `bg-[#...]` — tokens do projeto
- Preferir escala Tailwind; REM se inevitável
- `group` + `group-data-[...]` para DRY

#### Estado / UX
- Debounce em busca; feedback loading/error; aria-labels

#### API
- Hooks customizados para queries; DTOs; TanStack Query pattern quando aplicável

#### TypeScript (dev-rules)
- Rodar `npx tsc --noEmit` ao finalizar
- ESLint limpo

#### Componentização
- Extrair só com repetição/complexidade/reuso; config objects; `cn()` para classes

#### DRY
- Processar valores uma vez antes de map; nomes semânticos; hooks com prefixo `use`

#### dev-rules (alwaysApply)
- Nunca `any`
- Nunca fazer o não pedido (perguntar se incompleto)
- Aliases semânticos em arrays

---

### Agent / Skill Rules

#### save-session (esta exportação)
- Sobrescrever `SESSION.md` no caminho informado (default: workspace root)
- Conteúdo extenso: metadados, projeto, histórico, pendências, rules, código crítico
- Não commitar SESSION.md automaticamente
- Não editar plan files ao exportar

#### Outras skills disponíveis (não usadas nesta sessão)
- project-manager, pw2c-knowledge-base, prisma-*, shadcn, superpowers (brainstorming, verification-before-completion, etc.)

---

## Documentos de referência

| Documento | Path | Notas |
|-----------|------|-------|
| Plano toolbar API | `.cursor/plans/toolbar_extra_actions_api_dfc72bdb.plan.md` | v0.4.1 — implementado em master |
| Plano docs playground | `.cursor/plans/interactive_docs_playground_702f1e74.plan.md` | Implementado em feat/0001-many-files |
| CHANGELOG | `CHANGELOG.md` | 0.4.1 additive |
| README npm | `README.md` | Header + toolbar customization |
| Transcript | `agent-transcripts/c3685bec-8966-420f-8d55-c52d61f5b251/` | Histórico completo |

### Comandos de retomada

```bash
cd /home/s4s-01/Desktop/file-viewer
git checkout feat/0001-many-files   # docs playground
npm run dev                          # http://localhost:5173
npx tsc --noEmit
npm run build                        # playground-dist
npm run build:lib                    # dist npm package
```

### API pública npm (referência rápida)

**Componentes:** `FileViewer`, `PdfViewer`, `ImageViewer`, `FileViewerTooltip`, `FileViewerTooltipProvider`

**Funções:** `configureFileViewerPdfWorker`, `setFileViewerDefaults`, `getFileViewerDefaults`, `resetFileViewerDefaults`, `getFileViewerTranslations`, …

**Versão publicada:** `0.4.1`

---

*Fim do export — ~450 linhas, workspace `/home/s4s-01/Desktop/file-viewer/SESSION.md`*
