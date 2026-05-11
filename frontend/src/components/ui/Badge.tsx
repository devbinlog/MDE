import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'demo'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-fmd-surface border-fmd-border text-fmd-muted',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    demo: 'bg-fmd-purple/10 border-fmd-purple/25 text-fmd-purple',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border',
      variants[variant]
    )}>
      {children}
    </span>
  )
}
