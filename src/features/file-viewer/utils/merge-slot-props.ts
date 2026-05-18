import type { CSSProperties } from 'react'

export function mergeClassNames(
  ...classNames: (string | undefined)[]
): string {
  return classNames.filter(Boolean).join(' ')
}

export function mergeStyles(
  ...styles: (CSSProperties | undefined)[]
): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean))
}

export function mergeSlotClassNames<T extends Record<string, string | undefined>>(
  ...layers: (Partial<T> | undefined)[]
): Partial<T> {
  const result: Partial<T> = {}
  for (const layer of layers) {
    if (!layer) continue
    for (const key of Object.keys(layer) as (keyof T)[]) {
      const value = layer[key]
      if (value !== undefined) {
        result[key] = mergeClassNames(result[key], value) as T[keyof T]
      }
    }
  }
  return result
}

export function mergeSlotStyles<T extends Record<string, CSSProperties | undefined>>(
  ...layers: (Partial<T> | undefined)[]
): Partial<T> {
  const result: Partial<T> = {}
  for (const layer of layers) {
    if (!layer) continue
    for (const key of Object.keys(layer) as (keyof T)[]) {
      const value = layer[key]
      if (value !== undefined) {
        result[key] = mergeStyles(result[key], value) as T[keyof T]
      }
    }
  }
  return result
}
