import { useCallback, useState } from 'react'

type UseControllableIndexOptions = {
  value?: number
  defaultValue?: number
  onChange?: (index: number) => void
  maxIndex: number
}

export function useControllableIndex({
  value,
  defaultValue = 0,
  onChange,
  maxIndex,
}: UseControllableIndexOptions) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultValue)
  const isControlled = value !== undefined
  const rawIndex = isControlled ? value : uncontrolledIndex
  const activeIndex =
    maxIndex <= 0 ? 0 : Math.min(Math.max(rawIndex, 0), maxIndex - 1)

  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      const clamped =
        maxIndex <= 0 ? 0 : Math.min(Math.max(nextIndex, 0), maxIndex - 1)

      if (!isControlled) {
        setUncontrolledIndex(clamped)
      }

      onChange?.(clamped)
    },
    [isControlled, maxIndex, onChange],
  )

  return [activeIndex, setActiveIndex] as const
}
