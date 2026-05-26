import type { CSSProperties, ReactNode } from 'react'
import type { ViewerExtraActionsSide } from '../customization-types'

export type ComposeExtraActionsAreaOptions = {
  side: ViewerExtraActionsSide
  builtins: ReactNode
  extra: ReactNode | null
  builtinsClassName: string
  extraClassName: string
  builtinsStyle?: CSSProperties
  extraStyle?: CSSProperties
}

export function composeExtraActionsArea({
  side,
  builtins,
  extra,
  builtinsClassName,
  extraClassName,
  builtinsStyle,
  extraStyle,
}: ComposeExtraActionsAreaOptions): ReactNode {
  const builtinsNode = (
    <span className={builtinsClassName} style={builtinsStyle}>
      {builtins}
    </span>
  )

  if (!extra) {
    return builtinsNode
  }

  const extraWrapper = (
    <span
      className={extraClassName}
      style={extraStyle}
      data-extra-side={side}
    >
      {extra}
    </span>
  )

  if (side === 'left') {
    return (
      <>
        {extraWrapper}
        {builtinsNode}
      </>
    )
  }

  return (
    <>
      {builtinsNode}
      {extraWrapper}
    </>
  )
}
