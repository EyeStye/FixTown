import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const categoryEmoji = { pothole:'🕳️', manhole:'🚧', water:'💧', electricity:'⚡', road:'🛣️', other:'♻️' }

const statusColor = {
  open:        '#f59e0b',
  in_progress: '#6b7280',
  resolved:    '#4ade80',
  rejected:    '#fb7185',
}

const statusLabel = {
  open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', rejected: 'Rejected',
}

const StatCard = ({ icon, label, value, color }) => (
  <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
      background: color + '18', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: '800', color, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '2px' }}>{label}</div>
    </div>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [issues,  setIssues]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    api.get('/dashboard/my-issues')
      .then(r => setIssues(r.data.issues || []))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? issues : issues.filter(i => i.status === filter)

  const stats = {
    total:      issues.length,
    open:       issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved:   issues.filter(i => i.status === 'resolved').length,
    totalVotes: issues.reduce((sum, i) => sum + (i.vote_count || 0), 0),
  }

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="page-wrapper" style={{ padding: '80px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ marginBottom: '6px' }}>My Dashboard</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Welcome back, <span style={{ color: 'var(--amber-400)', fontWeight: '600' }}>{user?.name}</span>
            </p>
          </div>
          <Link to="/report" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Report New Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px' }}>
          <StatCard icon="📋" label="Total Reported"  value={stats.total}      color="var(--amber-400)" />
          <StatCard icon="🔴" label="Open"            value={stats.open}       color="#f59e0b" />
          <StatCard icon="🔄" label="In Progress"     value={stats.inProgress} color="#6b7280" />
          <StatCard icon="✅" label="Resolved"        value={stats.resolved}   color="#4ade80" />
          <StatCard icon="⬆️" label="Votes Received"  value={stats.totalVotes} color="#a78bfa" />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all', 'open', 'in_progress', 'resolved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '5px 14px', borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
              textTransform: s === 'all' ? 'capitalize' : 'capitalize',
              background: filter === s
                ? (s === 'all' ? 'var(--amber-500)' : statusColor[s] + '22')
                : 'var(--bg-elevated)',
              color: filter === s
                ? (s === 'all' ? '#0a0a0a' : statusColor[s])
                : 'var(--text-muted)',
              border: filter === s
                ? `1px solid ${s === 'all' ? 'transparent' : statusColor[s] + '44'}`
                : '1px solid var(--border-subtle)',
              transition: 'all 0.15s',
            }}>
              {s === 'all' ? 'All Issues' : statusLabel[s]}
            </button>
          ))}
        </div>

        {/* Issues list */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your issues…
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
              {filter === 'all' ? '📋' : '🔍'}
            </div>
            <h4 style={{ marginBottom: '8px' }}>
              {filter === 'all' ? "You haven't reported any issues yet" : `No ${statusLabel[filter]?.toLowerCase()} issues`}
            </h4>
            {filter === 'all' && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                Help your community by reporting infrastructure problems.
              </p>
            )}
            {filter === 'all' && (
              <Link to="/report" className="btn btn-primary btn-sm">Report Your First Issue</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(issue => (
              <Link key={issue.id} to={`/issues/${issue.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface)', border: '0px solid var(--border-subtle)',
                textDecoration: 'none', color: 'inherit',
                transition: 'all 0.15s var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateX(3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}
              >
                {/* Category icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0,
                }}>
                  {categoryEmoji[issue.category]}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.925rem', marginBottom: '4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {issue.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {issue.address && <span>📍 {issue.address}</span>}
                    <span>🕐 {timeAgo(issue.created_at)}</span>
                  </div>
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    background: statusColor[issue.status] + '18',
                    color: statusColor[issue.status],
                    border: `1px solid ${statusColor[issue.status]}33`,
                  }}>
                    {statusLabel[issue.status]}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--amber-400)', fontWeight: '600' }}>
                    ▲ {issue.vote_count || 0} votes
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}