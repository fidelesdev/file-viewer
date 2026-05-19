export type TooltipSide = 'top' | 'bottom'

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
  viewportHeight: number
}

function resolveSide({
  preferredSide,
  triggerRect,
  contentHeight,
  sideOffset,
  padding,
  viewportHeight,
}: ResolveSideInput): TooltipSide {
  const spaceAbove = triggerRect.top - padding
  const spaceBelow = viewportHeight - triggerRect.bottom - padding
  const needed = contentHeight + sideOffset

  if (preferredSide === 'top') {
    if (spaceAbove >= needed) return 'top'
    if (spaceBelow >= needed) return 'bottom'
    return spaceBelow > spaceAbove ? 'bottom' : 'top'
  }

  if (spaceBelow >= needed) return 'bottom'
  if (spaceAbove >= needed) return 'top'
  return spaceAbove > spaceBelow ? 'top' : 'bottom'
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
    viewportHeight,
    viewportWidth,
  })

  const top =
    side === 'top'
      ? input.triggerRect.top - input.sideOffset - input.contentHeight
      : input.triggerRect.bottom + input.sideOffset

  let left =
    input.triggerRect.left +
    input.triggerRect.width / 2 -
    input.contentWidth / 2

  const maxLeft = viewportWidth - padding - input.contentWidth
  if (left < padding) {
    left = padding
  } else if (left > maxLeft) {
    left = Math.max(padding, maxLeft)
  }

  let clampedTop = top
  const maxTop = viewportHeight - padding - input.contentHeight
  if (clampedTop < padding) {
    clampedTop = padding
  } else if (clampedTop > maxTop) {
    clampedTop = Math.max(padding, maxTop)
  }

  return { top: clampedTop, left, side }
}
