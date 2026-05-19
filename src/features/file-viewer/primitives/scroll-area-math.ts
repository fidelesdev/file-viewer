export type ScrollAreaSizes = {
  content: number
  viewport: number
  scrollbar: {
    size: number
    paddingStart: number
    paddingEnd: number
  }
}

export function getThumbRatio(viewportSize: number, contentSize: number): number {
  const ratio = viewportSize / contentSize
  return Number.isNaN(ratio) ? 0 : ratio
}

export function getThumbSize(sizes: ScrollAreaSizes): number {
  const ratio = getThumbRatio(sizes.viewport, sizes.content)
  const scrollbarPadding =
    sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio
  return Math.max(thumbSize, 18)
}

export function hasScrollAreaThumb(sizes: ScrollAreaSizes): boolean {
  if (sizes.viewport <= 0 || sizes.content <= 0 || sizes.scrollbar.size <= 0) {
    return false
  }
  return sizes.content > sizes.viewport + 1
}

function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(value, min), max)
}

function linearScale(
  input: readonly [number, number],
  output: readonly [number, number],
): (value: number) => number {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}

export function getThumbOffsetFromScroll(
  scrollPos: number,
  sizes: ScrollAreaSizes,
): number {
  const thumbSizePx = getThumbSize(sizes)
  const scrollbarPadding =
    sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd
  const scrollbarTrack = sizes.scrollbar.size - scrollbarPadding
  const maxScrollPos = sizes.content - sizes.viewport
  const maxThumbPos = scrollbarTrack - thumbSizePx
  const scrollWithoutMomentum = clamp(scrollPos, [0, maxScrollPos])
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos])
  return interpolate(scrollWithoutMomentum)
}

export function getScrollPositionFromPointer(
  pointerPos: number,
  pointerOffset: number,
  sizes: ScrollAreaSizes,
): number {
  const thumbSizePx = getThumbSize(sizes)
  const thumbCenter = thumbSizePx / 2
  const offset = pointerOffset || thumbCenter
  const thumbOffsetFromEnd = thumbSizePx - offset
  const minPointerPos = sizes.scrollbar.paddingStart + offset
  const maxPointerPos =
    sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd
  const maxScrollPos = sizes.content - sizes.viewport
  const interpolate = linearScale([minPointerPos, maxPointerPos], [0, maxScrollPos])
  return interpolate(pointerPos)
}
