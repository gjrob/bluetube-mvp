// ui/Button.js
import { button } from '../styles/styles'

export default function Button({ children, variant = 'base', style, ...props }) {
  const btnStyle = variant === 'secondary' ? button.secondary : button.base

  return (
    <button style={{ ...btnStyle, ...style }} {...props}>
      {children}
    </button>
  )
}
