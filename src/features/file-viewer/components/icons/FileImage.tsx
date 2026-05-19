import { IconBase, type IconProps } from './icon'

export function FileImage(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <circle cx="10" cy="13" r="2" />
      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
    </IconBase>
  )
}
