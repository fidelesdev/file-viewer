export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export type TooltipPlacement = {
  top: number
  left: number
  side: TooltipSide
}

type ComputeTooltipPlacementInput = {
  triggerRect: DOMRect
  contentWidth: number
  contentHeight: number
  preferredSide: TooltipSide
  sideOffset: number
  padding?: number
  viewportWidth?: number
  viewportHeight?: number
}

type ResolveSideInput = ComputeTooltipPlacementInput & {
  padding: number
  viewportWidth: number
  viewportHeight: number
}

function resolveSide({
  preferredSide,
  triggerRect,
  contentWidth,
  contentHeight,
  sideOffset,
  padding,
  viewportWidth,
  viewportHeight,
}: ResolveSideInput): TooltipSide {
  const spaceAbove = triggerRect.top - padding
  const spaceBelow = viewportHeight - triggerRect.bottom - padding
  const spaceLeft = triggerRect.left - padding
  const spaceRight = viewportWidth - triggerRect.right - padding
  const neededVertical = contentHeight + sideOffset
  const neededHorizontal = contentWidth + sideOffset

  const canPlace = (side: TooltipSide): boolean => {
    switch (side) {
      case 'top':
        return spaceAbove >= neededVertical
      case 'bottom':
        return spaceBelow >= neededVertical
      case 'left':
        return spaceLeft >= neededHorizontal
      case 'right':
        return spaceRight >= neededHorizontal
      default:
        return false
    }
  }

  if (canPlace(preferredSide)) {
    return preferredSide
  }

  const fallbacks: Record<TooltipSide, TooltipSide[]> = {
    top: ['bottom', 'right', 'left'],
    bottom: ['top', 'right', 'left'],
    left: ['right', 'top', 'bottom'],
    right: ['left', 'top', 'bottom'],
  }

  for (const side of fallbacks[preferredSide]) {
    if (canPlace(side)) {
      return side
    }
  }

  const spaces: Array<{ side: TooltipSide; space: number }> = [
    { side: 'top', space: spaceAbove },
    { side: 'bottom', space: spaceBelow },
    { side: 'left', space: spaceLeft },
    { side: 'right', space: spaceRight },
  ]

  spaces.sort((sideA, sideB) => sideB.space - sideA.space)
  return spaces[0]?.side ?? preferredSide
}

export function computeTooltipPlacement(
  input: ComputeTooltipPlacementInput,
): TooltipPlacement {
  const padding = input.padding ?? 8
  const viewportWidth = input.viewportWidth ?? window.innerWidth
  const viewportHeight = input.viewportHeight ?? window.innerHeight

  const side = resolveSide({
    ...input,
    padding,
    viewportWidth,
    viewportHeight,
  })

  let top = 0
  let left = 0

  if (side === 'top') {
    top = input.triggerRect.top - input.sideOffset - input.contentHeight
    left =
      input.triggerRect.left +
      input.triggerRect.width / 2 -
      input.contentWidth / 2
  } else if (side === 'bottom') {
    top = input.triggerRect.bottom + input.sideOffset
    left =
      input.triggerRect.left +
      input.triggerRect.width / 2 -
      input.contentWidth / 2
  } else if (side === 'left') {
    top =
      input.triggerRect.top +
      input.triggerRect.height / 2 -
      input.contentHeight / 2
    left = input.triggerRect.left - input.sideOffset - input.contentWidth
  } else {
    top =
      input.triggerRect.top +
      input.triggerRect.height / 2 -
      input.contentHeight / 2
    left = input.triggerRect.right + input.sideOffset
  }

  const maxLeft = viewportWidth - padding - input.contentWidth
  if (left < padding) {
    left = padding
  } else if (left > maxLeft) {
    left = Math.max(padding, maxLeft)
  }

  const maxTop = viewportHeight - padding - input.contentHeight
  if (top < padding) {
    top = padding
  } else if (top > maxTop) {
    top = Math.max(padding, maxTop)
  }

  return { top, left, side }
}
