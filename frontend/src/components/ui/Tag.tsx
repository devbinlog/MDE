import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  color?: 'purple' | 'teal' | 'blue' | 'rose' | 'amber' | 'default'
  size?: 'sm' | 'md'
}

export function Tag({ label, color = 'default', size = 'md' }: TagProps) {
  const colors = {
    purple: 'bg-fmd-purple/10 text-fmd-purple border-fmd-purple/25',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    default: 'bg-fmd-surface text-fmd-muted border-fmd-border',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-lg border font-medium',
      colors[color],
      sizes[size]
    )}>
      {label}
    </span>
  )
}
