export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#fafaf9' }}>
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >

        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>M</span>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f0f14' }}>MDE</p>
            <p style={{ fontSize: '11px', color: '#b0b0c8' }}>Music Direction Engine</p>
          </div>
        </div>

        {/* 카피라이트 */}
        <p style={{ fontSize: '12px', color: '#c0c0d0' }}>
          © 2026 MDE
        </p>

      </div>
    </footer>
  )
}
