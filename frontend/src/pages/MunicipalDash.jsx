import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const categoryEmoji = { pothole:'🕳️', manhole:'🚧', water:'💧', electricity:'⚡', road:'🛣️', other:'♻️' }
const statusColor   = { open:'#f59e0b', in_progress:'#6b7280', resolved:'#4ade80', rejected:'#fb7185' }
const statusLabel   = { open:'Open', in_progress:'In Progress', resolved:'Resolved', rejected:'Rejected' }
const CATEGORIES    = ['all','pothole','manhole','water','electricity','road','other']
const STATUSES      = ['all','open','in_progress','resolved','rejected']

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="card" style={{ padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
      <div style={{ fontSize: '1.4rem' }}>{icon}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: '800', color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
  </div>
)

export default function MunicipalDash() {
  const { user } = useAuth()

  const [issues,      setIssues]      = useState([])
  const [analytics,   setAnalytics]   = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [catFilter,   setCatFilter]   = useState('all')
  const [statFilter,  setStatFilter]  = useState('all')
  const [sortBy,      setSortBy]      = useState('votes')
  const [search,      setSearch]      = useState('')
  const [updating,    setUpdating]    = useState(null)   // issue id being updated
  const [statusNote,  setStatusNote]  = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/analytics'),
      api.get('/issues?limit=200&sort=votes'),
    ]).then(([a, i]) => {
      setAnalytics(a.data)
      setIssues(i.data.issues || [])
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const filtered = issues
    .filter(i => {
      if (catFilter  !== 'all' && i.category !== catFilter)  return false
      if (statFilter !== 'all' && i.status   !== statFilter) return false
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
          !i.address?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => sortBy === 'votes'
      ? b.vote_count - a.vote_count
      : new Date(b.created_at) - new Date(a.created_at)
    )

  const handleStatusUpdate = async (issue, newStatus) => {
    try {
      await api.patch(`/issues/${issue.id}/status`, { status: newStatus, note: statusNote })
      setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: newStatus } : i))
      setUpdating(null)
      setStatusNote('')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.')
    }
  }

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="page-wrapper" style={{ padding: '80px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2>Municipal Dashboard</h2>
              <span style={{
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.06em',
                textTransform: 'uppercase', background: 'rgba(251,191,36,0.12)',
                color: 'var(--amber-400)', border: '1px solid rgba(251,191,36,0.2)',
              }}>Officer</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Welcome, <span style={{ color: 'var(--amber-400)', fontWeight: '600' }}>{user?.name}</span>
            </p>
          </div>
          <Link to="/map" className="btn btn-secondary btn-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            View Map
          </Link>
        </div>

        {/* Analytics cards */}
        {analytics && (
          <div className="muni-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
            <StatCard icon="📋" label="Total Issues"     value={analytics.total}       color="var(--amber-400)" />
            <StatCard icon="🔴" label="Open"             value={analytics.open}        color="#f59e0b"
              sub={`${analytics.in_progress} in progress`} />
            <StatCard icon="✅" label="Resolved"         value={analytics.resolved}    color="#4ade80"
              sub="this month" />
            <StatCard icon="⚡" label="Avg Resolution"   value={analytics.avg_days ? `${analytics.avg_days}d` : '—'}
              color="#a78bfa" sub="average days" />
          </div>
        )}

        {/* Category breakdown */}
        {analytics?.by_category && (
          <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Issues by Category
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analytics.by_category.map(cat => (
                <div key={cat.category} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  flex: '1', minWidth: '120px',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{categoryEmoji[cat.category]}</span>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '700' }}>{cat.count}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{cat.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-input"
            placeholder="Search issues…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '220px', padding: '7px 12px', fontSize: '0.85rem' }}
          />

          <select className="form-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ maxWidth: '140px', padding: '7px 12px', fontSize: '0.85rem' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>

          <select className="form-select" value={statFilter} onChange={e => setStatFilter(e.target.value)}
            style={{ maxWidth: '140px', padding: '7px 12px', fontSize: '0.85rem' }}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : statusLabel[s]}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
            {['votes', 'recent'].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
                background: sortBy === s ? 'var(--amber-500)' : 'var(--bg-elevated)',
                color:      sortBy === s ? '#0a0a0a' : 'var(--text-muted)',
                border:     sortBy === s ? '1px solid transparent' : '1px solid var(--border-subtle)',
                transition: 'all 0.15s',
              }}>
                {s === 'votes' ? '▲ Votes' : '🕐 Recent'}
              </button>
            ))}
          </div>
        </div>

        {/* Issues count */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Showing {filtered.length} issue{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Issues table */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading issues…</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
            <h4>No issues found</h4>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(issue => (
              <div key={issue.id} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}>
                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', flexWrap: 'wrap' }}>
                  {/* Category */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    {categoryEmoji[issue.category]}
                  </div>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <Link to={`/issues/${issue.id}`} style={{
                      fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)',
                      textDecoration: 'none', display: 'block', marginBottom: '3px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--amber-400)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                      {issue.title}
                    </Link>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {issue.address && <span>📍 {issue.address}</span>}
                      <span>👤 {issue.user?.name || '—'}</span>
                      <span>🕐 {timeAgo(issue.created_at)}</span>
                    </div>
                  </div>

                  {/* Votes */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--amber-400)' }}>▲ {issue.vote_count}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>votes</div>
                  </div>

                  {/* Status badge */}
                  <span style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: '0.04em', flexShrink: 0,
                    background: statusColor[issue.status] + '18',
                    color: statusColor[issue.status],
                    border: `1px solid ${statusColor[issue.status]}33`,
                  }}>
                    {statusLabel[issue.status]}
                  </span>

                  {/* Update status button */}
                  <button
                    onClick={() => setUpdating(updating === issue.id ? null : issue.id)}
                    style={{
                      padding: '5px 12px', borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
                      background: updating === issue.id ? 'rgba(251,191,36,0.1)' : 'var(--bg-elevated)',
                      border: `1px solid ${updating === issue.id ? 'rgba(251,191,36,0.3)' : 'var(--border-subtle)'}`,
                      color: updating === issue.id ? 'var(--amber-400)' : 'var(--text-muted)',
                      transition: 'all 0.15s', flexShrink: 0,
                    }}>
                    {updating === issue.id ? 'Cancel' : 'Update'}
                  </button>
                </div>

                {/* Inline status update panel */}
                {updating === issue.id && (
                  <div style={{
                    padding: '14px 16px', borderTop: '1px solid var(--border-subtle)',
                    background: 'var(--bg-elevated)',
                    animation: 'fadeInUp 0.15s var(--ease-out)',
                  }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {STATUSES.filter(s => s !== 'all' && s !== issue.status).map(s => (
                        <button key={s} onClick={() => handleStatusUpdate(issue, s)} style={{
                          padding: '5px 14px', borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
                          background: statusColor[s] + '18',
                          border: `1px solid ${statusColor[s]}44`,
                          color: statusColor[s], transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = statusColor[s] + '33'}
                        onMouseLeave={e => e.currentTarget.style.background = statusColor[s] + '18'}>
                          → {statusLabel[s]}
                        </button>
                      ))}
                    </div>
                    <input
                      className="form-input"
                      placeholder="Add a note (optional)…"
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .muni-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .muni-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}