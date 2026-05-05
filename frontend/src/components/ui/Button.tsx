import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, style, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-fmd-purple focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none'

    const variants: Record<string, string> = {
      primary:
        'text-white active:scale-[0.97] hover:opacity-88',
      secondary:
        'bg-white text-fmd-text active:scale-[0.97] hover:bg-fmd-surface',
      ghost:
        'text-fmd-muted hover:text-fmd-text hover:bg-black/[0.04] active:scale-[0.97]',
      danger:
        'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.97]',
    }

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-sm px-5 py-2.5',
    }

    const secondaryStyle =
      variant === 'secondary'
        ? {
            border: '1px solid rgba(0,0,0,0.15)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            ...style,
          }
        : undefined

    const primaryStyle =
      variant === 'primary'
        ? {
            background: 'linear-gradient(135deg, #7c5cfc, #9373fd)',
            ...style,
          }
        : secondaryStyle ?? style

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        style={primaryStyle}
        {...props}
      >
        {loading && (
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
