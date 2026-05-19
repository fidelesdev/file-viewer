import {
  cloneElement,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'

function assignRef<T>(ref: Ref<T> | undefined, value: T): void {
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  if (ref && typeof ref === 'object') {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (value: T) => void {
  return (value: T) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
}

export function renderAsChild(
  asChild: boolean | undefined,
  child: ReactNode,
  props: Record<string, unknown>,
): ReactNode {
  if (!asChild) {
    return child
  }

  if (!isValidElement(child)) {
    return child
  }

  const element = child as ReactElement<{
    className?: string
    style?: React.CSSProperties
    onClick?: (event: MouseEvent) => void
    ref?: Ref<HTMLElement>
  }>

  const mergedClassName = [props.className, element.props.className]
    .filter(Boolean)
    .join(' ')

  const mergedStyle = {
    ...(props.style as React.CSSProperties | undefined),
    ...element.props.style,
  }

  const propsOnClick = props.onClick as ((event: MouseEvent) => void) | undefined
  const propsRef = props.ref as Ref<HTMLElement> | undefined

  return cloneElement(element, {
    ...props,
    ...element.props,
    className: mergedClassName || undefined,
    style: Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined,
    ref: mergeRefs(propsRef, element.props.ref),
    onClick: (event: MouseEvent) => {
      propsOnClick?.(event)
      element.props.onClick?.(event)
    },
  })
}
