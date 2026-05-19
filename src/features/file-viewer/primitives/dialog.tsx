import {
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { renderAsChild } from './as-child'

type DialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
  titleId: string
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(`${component} must be used within Dialog.Root`)
  }
  return context
}

export function Root({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const titleId = useId()

  return (
    <DialogContext.Provider value={{ open, onOpenChange, titleId }}>
      {children}
    </DialogContext.Provider>
  )
}

export function Portal({ children }: { children: ReactNode }) {
  const { open } = useDialogContext('Dialog.Portal')

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(children, document.body)
}

type DialogContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Content({
  children,
  className,
  style,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: DialogContentProps) {
  const { open, onOpenChange, titleId } = useDialogContext('Dialog.Content')
  const contentRef = useRef<HTMLDivElement>(null)

  useFocusTrap(contentRef, open)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  if (!open) {
    return null
  }

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={ariaDescribedBy}
      data-visible={open ? 'true' : 'false'}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

type DialogCloseChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export function Close({
  asChild,
  children,
}: {
  asChild?: boolean
  children: ReactElement<DialogCloseChildProps>
}) {
  const { onOpenChange } = useDialogContext('Dialog.Close')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    children.props.onClick?.(event)
    onOpenChange(false)
  }

  if (asChild) {
    return renderAsChild(true, children, { onClick: handleClick })
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}

export function Title({
  asChild,
  children,
}: {
  asChild?: boolean
  children: ReactElement | ReactNode
}) {
  const { titleId } = useDialogContext('Dialog.Title')

  if (asChild && isValidElement(children)) {
    return renderAsChild(true, children, { id: titleId })
  }

  return <p id={titleId}>{children}</p>
}
