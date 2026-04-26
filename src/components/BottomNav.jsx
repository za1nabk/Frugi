import { useApp } from '../AppContext'

const tabs = [
  {
    id: 'list', label: 'list',
    icon: (active) => (
      <svg viewBox="0 0 22 22" fill="none">
        <path d="M4 7h14M4 11h9M4 15h6" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'map', label: 'map',
    icon: (active) => (
      <svg viewBox="0 0 22 22" fill="none">
        <circle cx="10" cy="10" r="5.5" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8"/>
        <path d="M16 16l-3.5-3.5" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'cart', label: 'cart',
    icon: (active) => (
      <svg viewBox="0 0 22 22" fill="none">
        <rect x="3" y="6" width="16" height="13" rx="2.5" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8"/>
        <path d="M8 6V5a3 3 0 016 0v1" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8"/>
      </svg>
    )
  },
  {
    id: 'meals', label: 'meals',
    icon: (active) => (
      <svg viewBox="0 0 22 22" fill="none">
        <path d="M4 18l4-9 4 4.5 3-6 3 10.5" stroke={active ? '#1D9E75' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
]

export default function BottomNav() {
  const { activeTab, setActiveTab, cart } = useApp()

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon(activeTab === tab.id)}
          <span style={{ position: 'relative' }}>
            {tab.label}
            {tab.id === 'cart' && cart.length > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -10,
                background: '#1D9E75', color: '#fff',
                fontSize: 9, fontWeight: 600, borderRadius: '50%',
                width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cart.length}</span>
            )}
          </span>
        </button>
      ))}
    </nav>
  )
}
