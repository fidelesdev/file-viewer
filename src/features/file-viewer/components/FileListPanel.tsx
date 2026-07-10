import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useRef,
} from 'react'
import { PanelRightClose, PanelRightOpen } from './icons'
import { FileViewerTooltip } from './FileViewerTooltip'
import type {
  FileListHeaderContext,
  FileListItemRenderProps,
  FileListRenderProps,
  MultiFileViewerClassNames,
  MultiFileViewerLayout,
  MultiFileViewerStyles,
} from '../customization-types'
import type { MultiFileViewerTranslations } from '../translations'
import { resolveFormattedMessage } from '../translations'
import {
  FileListItem,
  FILE_LIST_ITEM_DEFAULT,
  FILE_LIST_ITEM_ICON_DEFAULT,
  FILE_LIST_ITEM_LABEL_DEFAULT,
} from './FileListItem'
import { mergeClassNames, mergeStyles } from '../utils/merge-slot-props'

const FILE_LIST_SHELL_DEFAULT = 'fv-multi-file-list-shell'
const FILE_LIST_TOOLBAR_DEFAULT = 'fv-multi-file-list-toolbar'
const FILE_LIST_DEFAULT = 'fv-multi-file-list'
const FILE_LIST_HEADER_DEFAULT = 'fv-multi-file-list-header'
const FILE_LIST_COLLAPSE_BUTTON_DEFAULT = 'fv-multi-file-list-collapse-button'
const FILE_LIST_ITEM_WRAP_DEFAULT = 'fv-multi-file-list-item-wrap'

export type ViewerFileListItem = {
  id?: string
  name: string
  extension: string
  url: string
}

type FileListPanelProps = {
  files: readonly ViewerFileListItem[]
  activeIndex: number
  layout: MultiFileViewerLayout
  onSelect: (index: number) => void
  translations: MultiFileViewerTranslations
  classNames?: Partial<MultiFileViewerClassNames>
  styles?: Partial<MultiFileViewerStyles>
  extraFileListHeader?:
    | ReactNode
    | ((context: FileListHeaderContext) => ReactNode)
  renderFileListItem?: (props: FileListItemRenderProps) => ReactNode
  renderFileList?: (props: FileListRenderProps) => ReactNode
  collapsible?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

function resolveListModifier(layout: MultiFileViewerLayout): string {
  if (layout === 'sidebar') {
    return `${FILE_LIST_DEFAULT}--sidebar`
  }

  return `${FILE_LIST_DEFAULT}--stack`
}

function resolveListRole(layout: MultiFileViewerLayout): 'listbox' | 'tablist' {
  return layout === 'stack' ? 'tablist' : 'listbox'
}

function resolveItemOrientation(
  layout: MultiFileViewerLayout,
): 'vertical' | 'horizontal' {
  return layout === 'stack' ? 'horizontal' : 'vertical'
}

function resolveSidebarShellStyle(
  styles?: Partial<MultiFileViewerStyles>,
): React.CSSProperties | undefined {
  const listWidth = styles?.fileList?.width

  return mergeStyles(
    listWidth !== undefined
      ? ({ '--fv-multi-file-list-width': listWidth } as React.CSSProperties)
      : undefined,
    styles?.fileListShell,
  )
}

export function FileListPanel({
  files,
  activeIndex,
  layout,
  onSelect,
  translations,
  classNames,
  styles,
  extraFileListHeader,
  renderFileListItem,
  renderFileList,
  collapsible = false,
  collapsed = false,
  onCollapsedChange,
}: FileListPanelProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const listModifier = resolveListModifier(layout)
  const listRole = resolveListRole(layout)
  const itemOrientation = resolveItemOrientation(layout)
  const isSidebarCollapsed = layout === 'sidebar' && collapsed
  const showCollapsedTooltips = isSidebarCollapsed

  const headerContext: FileListHeaderContext = {
    files,
    activeIndex,
    layout,
    fileListCollapsed: collapsed,
  }

  const renderExtraHeader = () => {
    if (!extraFileListHeader || isSidebarCollapsed) {
      return null
    }

    const content =
      typeof extraFileListHeader === 'function'
        ? extraFileListHeader(headerContext)
        : extraFileListHeader

    if (!content) {
      return null
    }

    return (
      <div
        className={mergeClassNames(
          FILE_LIST_HEADER_DEFAULT,
          classNames?.fileListHeader,
        )}
        style={mergeStyles(styles?.fileListHeader)}
      >
        {content}
      </div>
    )
  }

  const renderCollapseButton = () => (
    <FileViewerTooltip content={translations.fileListToggleTooltip}>
      <button
        type="button"
        className={mergeClassNames(
          FILE_LIST_COLLAPSE_BUTTON_DEFAULT,
          classNames?.fileListCollapseButton,
        )}
        style={styles?.fileListCollapseButton}
        aria-expanded={!collapsed}
        aria-label={
          collapsed
            ? translations.fileListExpandAriaLabel
            : translations.fileListCollapseAriaLabel
        }
        onClick={() => onCollapsedChange?.(!collapsed)}
      >
        {collapsed ? (
          <PanelRightClose className="fv-icon fv-icon--sm" aria-hidden />
        ) : (
          <PanelRightOpen className="fv-icon fv-icon--sm" aria-hidden />
        )}
      </button>
    </FileViewerTooltip>
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (files.length === 0) {
        return
      }

      const isHorizontal = layout === 'stack'

      const movePrevious = () => {
        onSelect(Math.max(activeIndex - 1, 0))
      }

      const moveNext = () => {
        onSelect(Math.min(activeIndex + 1, files.length - 1))
      }

      switch (event.key) {
        case 'ArrowUp':
          if (!isHorizontal) {
            event.preventDefault()
            movePrevious()
          }
          break
        case 'ArrowDown':
          if (!isHorizontal) {
            event.preventDefault()
            moveNext()
          }
          break
        case 'ArrowLeft':
          if (isHorizontal) {
            event.preventDefault()
            movePrevious()
          }
          break
        case 'ArrowRight':
          if (isHorizontal) {
            event.preventDefault()
            moveNext()
          }
          break
        case 'Home':
          event.preventDefault()
          onSelect(0)
          break
        case 'End':
          event.preventDefault()
          onSelect(files.length - 1)
          break
        default:
          break
      }
    },
    [activeIndex, files.length, layout, onSelect],
  )

  const listItems = files.map((file, index) => {
    const isActive = index === activeIndex
    const ariaLabel = resolveFormattedMessage(
      translations.fileListItemAriaLabel,
      {
        name: file.name,
        index,
        total: files.length,
      },
    )

    const itemProps = {
      name: file.name,
      extension: file.extension,
      isActive,
      ariaLabel,
      orientation: itemOrientation,
      onSelect: () => onSelect(index),
      tooltip: showCollapsedTooltips ? file.name : undefined,
      tooltipSide: showCollapsedTooltips ? ('right' as const) : undefined,
      tooltipOpenOnHover: showCollapsedTooltips,
      className: mergeClassNames(
        FILE_LIST_ITEM_DEFAULT,
        classNames?.fileListItem,
      ),
      style: styles?.fileListItem,
      iconClassName: mergeClassNames(
        FILE_LIST_ITEM_ICON_DEFAULT,
        classNames?.fileListItemIcon,
      ),
      iconStyle: styles?.fileListItemIcon,
      labelClassName: mergeClassNames(
        FILE_LIST_ITEM_LABEL_DEFAULT,
        classNames?.fileListItemLabel,
      ),
      labelStyle: styles?.fileListItemLabel,
    }

    const defaultItem = <FileListItem {...itemProps} />

    const itemNode = renderFileListItem
      ? renderFileListItem({
          file,
          index,
          isActive,
          select: () => onSelect(index),
          defaultItem,
        })
      : defaultItem

    return (
      <div
        key={file.id ?? file.url ?? String(index)}
        id={`fv-file-list-item-${index}`}
        className={mergeClassNames(
          FILE_LIST_ITEM_WRAP_DEFAULT,
          classNames?.fileListItemWrap,
        )}
        style={styles?.fileListItemWrap}
      >
        {itemNode}
      </div>
    )
  })

  const listScroll = (
    <div
      ref={listRef}
      role={listRole}
      aria-label={translations.fileListAriaLabel}
      aria-activedescendant={
        files.length > 0 ? `fv-file-list-item-${activeIndex}` : undefined
      }
      tabIndex={0}
      className={mergeClassNames(
        FILE_LIST_DEFAULT,
        listModifier,
        classNames?.fileList,
      )}
      style={styles?.fileList}
      onKeyDown={handleKeyDown}
    >
      {listItems}
    </div>
  )

  const sidebarShell =
    layout === 'sidebar' && collapsible ? (
      <div
        className={mergeClassNames(
          FILE_LIST_SHELL_DEFAULT,
          classNames?.fileListShell,
        )}
        style={resolveSidebarShellStyle(styles)}
        data-collapsed={collapsed}
        data-layout={layout}
      >
        <div
          className={mergeClassNames(
            FILE_LIST_TOOLBAR_DEFAULT,
            classNames?.fileListToolbar,
          )}
          style={styles?.fileListToolbar}
        >
          {renderExtraHeader()}
          {renderCollapseButton()}
        </div>
        {listScroll}
      </div>
    ) : null

  const stackShell =
    layout === 'stack' && collapsible ? (
      <div
        className={mergeClassNames(
          FILE_LIST_SHELL_DEFAULT,
          classNames?.fileListShell,
        )}
        style={styles?.fileListShell}
        data-collapsed={collapsed}
        data-layout={layout}
      >
        <div
          className={mergeClassNames(
            FILE_LIST_TOOLBAR_DEFAULT,
            classNames?.fileListToolbar,
          )}
          style={styles?.fileListToolbar}
        >
          {renderExtraHeader()}
          {renderCollapseButton()}
        </div>
        {listScroll}
      </div>
    ) : null

  const defaultList =
    sidebarShell ??
    stackShell ??
    (layout === 'sidebar' ? (
      <div
        className={mergeClassNames(
          FILE_LIST_SHELL_DEFAULT,
          `${FILE_LIST_SHELL_DEFAULT}--static`,
          classNames?.fileListShell,
        )}
        style={mergeStyles(styles?.fileListShell)}
        data-layout={layout}
      >
        {renderExtraHeader() ? (
          <div
            className={mergeClassNames(
              FILE_LIST_TOOLBAR_DEFAULT,
              classNames?.fileListToolbar,
            )}
            style={styles?.fileListToolbar}
          >
            {renderExtraHeader()}
          </div>
        ) : null}
        {listScroll}
      </div>
    ) : (
      listScroll
    ))

  if (renderFileList) {
    return renderFileList({
      files,
      activeIndex,
      onSelect,
      defaultList,
      layout,
      fileListCollapsed: collapsed,
    })
  }

  return defaultList
}

export {
  FILE_LIST_SHELL_DEFAULT,
  FILE_LIST_TOOLBAR_DEFAULT,
  FILE_LIST_DEFAULT,
  FILE_LIST_HEADER_DEFAULT,
  FILE_LIST_COLLAPSE_BUTTON_DEFAULT,
  FILE_LIST_ITEM_WRAP_DEFAULT,
}
