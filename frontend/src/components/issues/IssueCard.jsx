import { Link } from 'react-router-dom'

const categoryEmoji = {
  pothole:     '🕳️',
  manhole:     '🚧',
  water:       '💧',
  electricity: '⚡',
  road:        '🛣️',
  other:       '♻️',
}

const statusColor = {
  open:        '#f59e0b',
  in_progress: '#6b7280',
  resolved:    '#4ade80',
  rejected:    '#fb7185',
}

const UpvoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function IssueCard({ issue, onVote, voted = false }) {
  const {
    id, title, category, status, address,
    image_url, vote_count, created_at, user,
  } = issue

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 60)   return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s var(--ease-out)',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = ''
      e.currentTarget.style.transform = ''
      e.currentTarget.style.boxShadow = ''
    }}>

      {/* Image */}
      {image_url && (
        <Link to={`/issues/${id}`} style={{ display: 'block', height: '160px', overflow: 'hidden' }}>
          <img src={image_url} alt={title} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
          />
        </Link>
      )}

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Top row: category + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
          }}>
            {categoryEmoji[category]} {category}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', borderRadius: 'var(--radius-full)',
            fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: statusColor[status] + '18',
            color: statusColor[status],
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: statusColor[status],
              boxShadow: status === 'open' ? `0 0 5px ${statusColor[status]}` : 'none',
            }} />
            {status.replace('_', ' ')}
          </span>
        </div>

        {/* Title */}
        <Link to={`/issues/${id}`} style={{ textDecoration: 'none' }}>
          <h4 style={{
            fontSize: '0.95rem', fontWeight: '700', lineHeight: '1.4',
            color: 'var(--text-primary)',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {title}
          </h4>
        </Link>

        {/* Address */}
        {address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <PinIcon /> {address}
          </div>
        )}

        {/* Footer: votes + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => onVote?.(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: 'var(--radius-full)',
              background: voted ? 'rgba(251,191,36,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${voted ? 'rgba(251,191,36,0.3)' : 'var(--border-subtle)'}`,
              color: voted ? 'var(--amber-400)' : 'var(--text-muted)',
              fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!voted) {
                e.currentTarget.style.background = 'rgba(251,191,36,0.08)'
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'
                e.currentTarget.style.color = 'var(--amber-400)'
              }
            }}
            onMouseLeave={e => {
              if (!voted) {
                e.currentTarget.style.background = 'var(--bg-elevated)'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }
            }}
          >
            <UpvoteIcon /> {vote_count ?? 0}
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {timeAgo(created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}