import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[200px] sm:min-h-[300px] flex-col items-center justify-center gap-3 sm:gap-4 rounded-lg border border-dashed p-4 sm:p-8 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm px-2">{description}</p>
      </div>
      {action && <div className="mt-1 sm:mt-2">{action}</div>}
    </div>
  )
}
