import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { FileViewerTooltip } from './FileViewerTooltip'
import { FileImage, FileQuestion, FileText } from './icons'
import {
  isImageExtension,
  isPdfExtension,
} from '../utils/viewer-file-utils'

const FILE_LIST_ITEM_DEFAULT = 'fv-multi-file-list-item'
const FILE_LIST_ITEM_ICON_DEFAULT = 'fv-multi-file-list-item-icon'
const FILE_LIST_ITEM_LABEL_DEFAULT = 'fv-multi-file-list-item-label'

type FileListItemProps = {
  name: string
  extension: string
  isActive: boolean
  ariaLabel: string
  orientation: 'vertical' | 'horizontal'
  onSelect: () => void
  tooltip?: string
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right'
  tooltipOpenOnHover?: boolean
  className?: string
  style?: CSSProperties
  iconClassName?: string
  iconStyle?: CSSProperties
  labelClassName?: string
  labelStyle?: CSSProperties
  renderOverride?: (props: {
    defaultItem: ReactNode
    select: () => void
  }) => ReactNode
}

function resolveFileIcon(extension: string) {
  if (isPdfExtension(extension)) {
    return FileText
  }

  if (isImageExtension(extension)) {
    return FileImage
  }

  return FileQuestion
}

export const FileListItem = forwardRef<HTMLButtonElement, FileListItemProps>(
  function FileListItem(
    {
      name,
      extension,
      isActive,
      ariaLabel,
      orientation,
      onSelect,
      tooltip,
      tooltipSide = 'top',
      tooltipOpenOnHover = false,
      className,
      style,
      iconClassName,
      iconStyle,
      labelClassName,
      labelStyle,
      renderOverride,
    },
    ref,
  ) {
    const Icon = resolveFileIcon(extension)

    const itemRole = orientation === 'horizontal' ? 'tab' : 'option'

    const button = (
      <button
        ref={ref}
        type="button"
        role={itemRole}
        data-active={isActive}
        aria-selected={isActive}
        aria-label={ariaLabel}
        className={className ?? FILE_LIST_ITEM_DEFAULT}
        style={style}
        onClick={onSelect}
      >
        <span
          className={iconClassName ?? FILE_LIST_ITEM_ICON_DEFAULT}
          style={iconStyle}
          aria-hidden
        >
          <Icon className="fv-icon fv-icon--sm" />
        </span>
        <span
          className={labelClassName ?? FILE_LIST_ITEM_LABEL_DEFAULT}
          style={labelStyle}
          aria-hidden
        >
          {name}
        </span>
      </button>
    )

    const itemWithTooltip = tooltip ? (
      <FileViewerTooltip
        content={tooltip}
        side={tooltipSide}
        sideOffset={8}
        openOnHover={tooltipOpenOnHover}
      >
        {button}
      </FileViewerTooltip>
    ) : (
      button
    )

    if (renderOverride) {
      return renderOverride({ defaultItem: itemWithTooltip, select: onSelect })
    }

    return itemWithTooltip
  },
)

export {
  FILE_LIST_ITEM_DEFAULT,
  FILE_LIST_ITEM_ICON_DEFAULT,
  FILE_LIST_ITEM_LABEL_DEFAULT,
}

export type { FileListItemProps }
