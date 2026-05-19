import { IconBase, type IconProps } from './icon'

export function Maximize2(props: IconProps) {
  return (
    <IconBase {...props}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </IconBase>
  )
}
