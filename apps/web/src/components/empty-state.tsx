import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 text-4xl opacity-50">{icon}</div>
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-4">
          {actionHref ? (
            <a href={actionHref} className={cn(buttonVariants())}>
              {actionLabel}
            </a>
          ) : (
            <button onClick={onAction} className={cn(buttonVariants())}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
