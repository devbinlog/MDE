'use client'

interface Example {
  id: string
  label: string
  text: string
  tags: string[]
}

interface ExamplePromptListProps {
  examples: Example[]
  onSelect: (text: string) => void
  disabled?: boolean
}

export function ExamplePromptList({ examples, onSelect, disabled }: ExamplePromptListProps) {
  return (
    <div>
      <p style={{
        fontSize: '12px', color: '#b0b0c8',
        marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
        예시로 시작해보세요
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {examples.map(example => (
          <button
            key={example.id}
            onClick={() => !disabled && onSelect(example.text)}
            disabled={disabled}
            style={{
              padding: '7px 14px',
              borderRadius: '100px',
              border: '1px solid #e8e8f0',
              background: '#ffffff',
              color: '#6b6b8a',
              fontSize: '13px',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              if (!disabled) {
                e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)'
                e.currentTarget.style.color = '#7c5cfc'
                e.currentTarget.style.background = 'rgba(124,92,252,0.04)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e8e8f0'
              e.currentTarget.style.color = '#6b6b8a'
              e.currentTarget.style.background = '#ffffff'
            }}
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  )
}
