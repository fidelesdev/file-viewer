import { IconBase, type IconProps } from './icon'

export function PanelRightOpen(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
      <path d="m10 9-3 3 3 3" />
    </IconBase>
  )
}
