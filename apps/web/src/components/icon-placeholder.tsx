import * as React from 'react'

// Dynamic icon placeholder that uses hugeicons by default
// Can be extended to support multiple icon libraries
interface IconPlaceholderProps extends React.SVGAttributes<SVGElement> {
  lucide?: string
  tabler?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
}

export function IconPlaceholder({
  hugeicons,
  className,
  ...props
}: IconPlaceholderProps) {
  // For now, render a simple placeholder SVG
  // In production, this would dynamically load from @hugeicons/react
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
