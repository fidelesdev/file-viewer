import {
  cloneElement,
  isValidElement,
  type FocusEvent,
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

function mergeHandlers<Event>(
  handlerA?: (event: Event) => void,
  handlerB?: (event: Event) => void,
): ((event: Event) => void) | undefined {
  if (!handlerA && !handlerB) {
    return undefined
  }

  if (!handlerA) {
    return handlerB
  }

  if (!handlerB) {
    return handlerA
  }

  return (event: Event) => {
    handlerA(event)
    handlerB(event)
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
    onMouseEnter?: (event: MouseEvent) => void
    onMouseLeave?: (event: MouseEvent) => void
    onFocus?: (event: FocusEvent) => void
    onBlur?: (event: FocusEvent) => void
    ref?: Ref<HTMLElement>
  }>

  const mergedClassName = [props.className, element.props.className]
    .filter(Boolean)
    .join(' ')

  const mergedStyle = {
    ...(props.style as React.CSSProperties | undefined),
    ...element.props.style,
  }

  const propsRef = props.ref as Ref<HTMLElement> | undefined

  return cloneElement(element, {
    ...element.props,
    ...props,
    className: mergedClassName || undefined,
    style: Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined,
    ref: mergeRefs(propsRef, element.props.ref),
    onClick: mergeHandlers(
      props.onClick as ((event: MouseEvent) => void) | undefined,
      element.props.onClick,
    ),
    onMouseEnter: mergeHandlers(
      props.onMouseEnter as ((event: MouseEvent) => void) | undefined,
      element.props.onMouseEnter,
    ),
    onMouseLeave: mergeHandlers(
      props.onMouseLeave as ((event: MouseEvent) => void) | undefined,
      element.props.onMouseLeave,
    ),
    onFocus: mergeHandlers(
      props.onFocus as ((event: FocusEvent) => void) | undefined,
      element.props.onFocus,
    ),
    onBlur: mergeHandlers(
      props.onBlur as ((event: FocusEvent) => void) | undefined,
      element.props.onBlur,
    ),
  })
}
