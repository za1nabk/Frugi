import { useEffect } from 'react'

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#1D9E75',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, zIndex: 999
    }}>
      <div className="fade-up">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {/* Body */}
          <ellipse cx="50" cy="65" rx="34" ry="26" fill="#085041"/>
          {/* Eyes bulge */}
          <ellipse cx="28" cy="42" rx="14" ry="12" fill="#085041"/>
          <ellipse cx="72" cy="42" rx="14" ry="12" fill="#085041"/>
          {/* Eye whites */}
          <ellipse cx="28" cy="40" r="7" fill="#E1F5EE" opacity="0.9"/>
          <ellipse cx="72" cy="40" r="7" fill="#E1F5EE" opacity="0.9"/>
          {/* Pupils */}
          <circle cx="29" cy="39" r="4" fill="#085041"/>
          <circle cx="73" cy="39" r="4" fill="#085041"/>
          {/* Shine */}
          <circle cx="31" cy="37" r="1.5" fill="#E1F5EE"/>
          <circle cx="75" cy="37" r="1.5" fill="#E1F5EE"/>
          {/* Smile */}
          <path d="M38 68 Q50 76 62 68" stroke="#E1F5EE" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          {/* Legs */}
          <ellipse cx="30" cy="86" rx="12" ry="6" fill="#085041"/>
          <ellipse cx="70" cy="86" rx="12" ry="6" fill="#085041"/>
          {/* Toes */}
          <ellipse cx="20" cy="90" rx="5" ry="3" fill="#085041"/>
          <ellipse cx="30" cy="92" rx="5" ry="3" fill="#085041"/>
          <ellipse cx="40" cy="90" rx="5" ry="3" fill="#085041"/>
          <ellipse cx="60" cy="90" rx="5" ry="3" fill="#085041"/>
          <ellipse cx="70" cy="92" rx="5" ry="3" fill="#085041"/>
          <ellipse cx="80" cy="90" rx="5" ry="3" fill="#085041"/>
        </svg>
      </div>

      <div className="fade-up-delay" style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 600,
          color: '#E1F5EE', letterSpacing: '0.02em'
        }}>frugi</div>
        <div style={{ fontSize: 13, color: '#9FE1CB', marginTop: 6 }}>
          smart grocery savings
        </div>
      </div>

      <div className="fade-up-delay-2" style={{
        position: 'absolute', bottom: 40,
        display: 'flex', gap: 6
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === 0 ? '#E1F5EE' : 'rgba(255,255,255,0.3)',
            animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
    </div>
  )
}
