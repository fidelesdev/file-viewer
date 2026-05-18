export function resolveOption<T>(
  instance: T | undefined,
  global: T | undefined,
  builtIn: T,
): T {
  if (instance !== undefined) {
    return instance
  }
  if (global !== undefined) {
    return global
  }
  return builtIn
}

export function resolveHideCloseButton(
  instance: boolean | undefined,
  global: boolean | undefined,
  mode: 'inline' | 'modal',
): boolean {
  if (instance !== undefined) {
    return instance
  }
  if (global !== undefined) {
    return global
  }
  return mode === 'inline'
}
