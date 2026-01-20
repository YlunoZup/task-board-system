import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="flex min-h-[250px] sm:min-h-[400px] flex-col items-center justify-center gap-3 sm:gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function LoadingBoardCard() {
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-6 shadow-sm">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse rounded-lg bg-muted flex-shrink-0" />
        <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
          <div className="h-4 sm:h-5 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 sm:h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex gap-1.5 sm:gap-2 flex-wrap">
        <div className="h-5 sm:h-6 w-14 sm:w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-5 sm:h-6 w-16 sm:w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 sm:h-6 w-12 sm:w-14 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  )
}

export function LoadingTaskCard() {
  return (
    <div className="rounded-lg border bg-card p-3 sm:p-4 shadow-sm">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 sm:h-4 w-16 sm:w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-4 sm:h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3.5 sm:h-4 w-full animate-pulse rounded bg-muted" />
        <div className="flex gap-1.5 sm:gap-2">
          <div className="h-5 sm:h-6 w-14 sm:w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 sm:h-6 w-16 sm:w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}
