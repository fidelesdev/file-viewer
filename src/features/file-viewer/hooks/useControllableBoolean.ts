import { useCallback, useState } from 'react'

type UseControllableBooleanOptions = {
  value?: boolean
  defaultValue?: boolean
  onChange?: (value: boolean) => void
}

export function useControllableBoolean({
  value,
  defaultValue = false,
  onChange,
}: UseControllableBooleanOptions) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = useCallback(
    (nextValue: boolean) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, onChange],
  )

  return [currentValue, setValue] as const
}
