export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

export function deepMergePartial<T extends object>(
  base: T,
  patch: DeepPartial<T> | undefined,
): T {
  if (!patch) {
    return { ...base }
  }

  const result = { ...base }
  const patchRecord = patch as Record<string, unknown>
  const resultRecord = result as Record<string, unknown>
  const baseRecord = base as Record<string, unknown>

  for (const key of Object.keys(patchRecord)) {
    const patchValue = patchRecord[key]
    if (patchValue === undefined) {
      continue
    }

    const baseValue = baseRecord[key]

    if (
      typeof patchValue === 'object' &&
      patchValue !== null &&
      !Array.isArray(patchValue) &&
      typeof baseValue === 'object' &&
      baseValue !== null &&
      !Array.isArray(baseValue)
    ) {
      resultRecord[key] = deepMergePartial(
        baseValue as object,
        patchValue as DeepPartial<object>,
      )
      continue
    }

    resultRecord[key] = patchValue
  }

  return result
}
