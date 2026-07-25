import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import api from '../utils/api'

// Fix Leaflet default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const categoryColor = {
  pothole:     '#f59e0b',
  manhole:     '#fb7185',
  water:       '#60a5fa',
  electricity: '#fbbf24',
  road:        '#9ca3af',
  other:       '#a78bfa',
}

const categoryEmoji = {
  pothole: '🕳️', manhole: '🚧', water: '💧',
  electricity: '⚡', road: '🛣️', other: '♻️',
}

const statusColor = {
  open: '#f59e0b', in_progress: '#6b7280',
  resolved: '#4ade80', rejected: '#fb7185',
}

// Custom colored marker icon
function makeIcon(category) {
  const color = categoryColor[category] || '#f59e0b'
  const svg = `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22s14-12.67 14-22C28 6.27 21.73 0 14 0z"
            fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  })
}

const CATEGORIES = ['all', 'pothole', 'manhole', 'water', 'electricity', 'road', 'other']
const STATUSES   = ['all', 'open', 'in_progress', 'resolved', 'rejected']

// Fly to user location helper
function LocateControl({ onLocate }) {
  const map = useMap()
  const locate = () => {
    map.locate({ setView: true, maxZoom: 15 })
    map.once('locationfound', e => onLocate?.(e.latlng))
  }
  return (
    <div style={{ position: 'absolute', bottom: '100px', right: '10px', zIndex: 999 }}>
      <button onClick={locate} style={{
        width: '34px', height: '34px', borderRadius: '4px',
        background: 'white', border: '1px solid rgba(0,0,0,0.2)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} title="Find my location">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
      </button>
    </div>
  )
}

export default function MapView() {
  const [issues,     setIssues]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [catFilter,  setCatFilter]  = useState('all')
  const [statFilter, setStatFilter] = useState('all')
  const [selected,   setSelected]   = useState(null)
  const [sidebarOpen,setSidebarOpen]= useState(true)
  const [search,     setSearch]     = useState('')

  useEffect(() => {
    api.get('/issues')
      .then(r => setIssues(r.data.issues || []))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = issues.filter(i => {
    if (catFilter  !== 'all' && i.category !== catFilter)  return false
    if (statFilter !== 'all' && i.status   !== statFilter) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !i.address?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }} className="map-wrapper">

        {/* ── Sidebar ── */}
        <div style={{
          width: sidebarOpen ? '340px' : '0px',
          minWidth: sidebarOpen ? '340px' : '0px',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column',
          transition: 'all 0.3s var(--ease-out)',
          zIndex: 10,
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            {/* Search */}
            <input
              className="form-input"
              placeholder="Search issues…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: '12px' }}
            />

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  background: catFilter === c ? 'var(--amber-500)' : 'var(--bg-elevated)',
                  color:      catFilter === c ? '#0a0a0a' : 'var(--text-muted)',
                  border:     catFilter === c ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  transition: 'all 0.15s',
                }}>
                  {c === 'all' ? 'All' : categoryEmoji[c]}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatFilter(s)} style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  background: statFilter === s
                    ? (s === 'all' ? 'var(--amber-500)' : statusColor[s] + '33')
                    : 'var(--bg-elevated)',
                  color: statFilter === s
                    ? (s === 'all' ? '#0a0a0a' : statusColor[s])
                    : 'var(--text-muted)',
                  border: statFilter === s
                    ? `1px solid ${s === 'all' ? 'transparent' : statusColor[s] + '55'}`
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.15s',
                }}>
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Issue list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading issues…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No issues found.
              </div>
            ) : filtered.map(issue => (
              <Link key={issue.id}
                to={`/issues/${issue.id}`}
                onClick={() => setSelected(issue)}
                style={{
                  display: 'block',
                  padding: '12px', borderRadius: 'var(--radius-md)',
                  marginBottom: '4px', cursor: 'pointer',
                  background: selected?.id === issue.id ? 'rgba(251,191,36,0.08)' : 'transparent',
                  border: `1px solid ${selected?.id === issue.id ? 'rgba(251,191,36,0.2)' : 'transparent'}`,
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                onMouseEnter={e => {
                  if (selected?.id !== issue.id) e.currentTarget.style.background = 'var(--bg-elevated)'
                }}
                onMouseLeave={e => {
                  if (selected?.id !== issue.id) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span>{categoryEmoji[issue.category]}</span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: statusColor[issue.status],
                      }}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.3', marginBottom: '4px' }}>
                      {issue.title}
                    </div>
                    {issue.address && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        📍 {issue.address}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: '700', color: 'var(--amber-400)',
                    }}>▲ {issue.vote_count}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {timeAgo(issue.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer count */}
          <div style={{
            padding: '10px 16px', borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0,
          }}>
            {filtered.length} issue{filtered.length !== 1 ? 's' : ''} shown
          </div>
        </div>

        {/* ── Toggle sidebar button ── */}
        <button onClick={() => setSidebarOpen(v => !v)} style={{
          position: 'absolute', left: sidebarOpen ? '340px' : '0px',
          top: '50%', transform: 'translateY(-50%)',
          zIndex: 1000, width: '20px', height: '48px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderLeft: sidebarOpen ? 'none' : '1px solid var(--border-subtle)',
          borderRadius: sidebarOpen ? '0 6px 6px 0' : '0 6px 6px 0',
          cursor: 'pointer', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'left 0.3s var(--ease-out)',
        }}>
          {sidebarOpen ? '‹' : '›'}
        </button>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map(issue => {
              const [lng, lat] = issue.coordinates || [0, 0]
              if (!lat || !lng) return null
              return (
                <Marker
                  key={issue.id}
                  position={[lat, lng]}
                  icon={makeIcon(issue.category)}
                  eventHandlers={{ click: () => setSelected(issue) }}
                >
                  <Popup>
                    <div style={{ minWidth: '200px', fontFamily: 'Inter, sans-serif' }}>
                      <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.9rem' }}>
                        {categoryEmoji[issue.category]} {issue.title}
                      </div>
                      {issue.address && (
                        <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '6px' }}>
                          📍 {issue.address}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '999px',
                          background: statusColor[issue.status] + '22',
                          color: statusColor[issue.status],
                          fontSize: '0.72rem', fontWeight: '600',
                        }}>
                          {issue.status.replace('_', ' ')}
                        </span>
                        <Link to={`/issues/${issue.id}`}
                          style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '600' }}>
                          View →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            <LocateControl />
          </MapContainer>

          {/* Report button overlay */}
          <Link to="/report" style={{
            position: 'absolute', bottom: '24px', right: '24px', zIndex: 999,
            display: 'flex', alignItems: 'center', gap: '8px',
          }} className="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Report Issue
          </Link>
        </div>
      </div>
      <style>{`
  @media (max-width: 640px) {
    .map-wrapper {
      flex-direction: column !important;
    }
    .map-wrapper > div:first-child {
      width: 100% !important;
      min-width: 100% !important;
      max-height: 50vh;
      border-right: none !important;
      border-bottom: 1px solid var(--border-subtle);
    }
    .map-wrapper > div:last-child {
      height: 50vh;
      overflow-y: auto;
    }
    .map-wrapper > button {
      display: none !important;
    }
  }
`}</style>
    </div>
  )
}