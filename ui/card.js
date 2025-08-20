// ui/Card.js
import { card } from '../styles/styles'

export default function Card({ children, style }) {
  return (
    <div style={{ ...card.base, ...style }}>
      {children}
    </div>
  )
}
