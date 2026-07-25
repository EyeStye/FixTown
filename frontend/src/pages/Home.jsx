import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../utils/api'

/* ── Icon components ── */
const Icon = ({ d, size = 24, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const categories = [
  { emoji: '🕳️', label: 'Potholes',       color: '#f59e0b',  desc: 'Road damage' },
  { emoji: '🚧', label: 'Open Manholes',   color: '#fb7185',   desc: 'Safety hazards' },
  { emoji: '💧', label: 'Water Issues',    color: '#60a5fa',           desc: 'Leaks & flooding' },
  { emoji: '⚡', label: 'Electricity',     color: '#fbbf24',  desc: 'Power outages' },
  { emoji: '🛣️', label: 'Road Damage',    color: '#cbd5e1',  desc: 'Cracks & erosion' },
  { emoji: '♻️', label: 'Other Issues',   color: '#a78bfa',           desc: 'Any civic problem' },
]

const features = [
  {
    icon: '📍',
    title: 'Geo-Tagged Reports',
    desc: 'Pin issues precisely on the map. Every report is tied to an exact location using PostGIS geospatial technology.',
    color: '#f59e0b',
  },
  {
    icon: '📸',
    title: 'Image Uploads',
    desc: 'Attach photos to your reports. Images are optimized and served via CDN for fast loading everywhere.',
    color: '#6b7280',
  },
  {
    icon: '⬆️',
    title: 'Community Voting',
    desc: 'Upvote critical issues to push them to the top. Municipalities prioritize by community demand.',
    color: '#60a5fa',
  },
  {
    icon: '📊',
    title: 'Status Tracking',
    desc: 'Follow every issue from "Open" to "Resolved". Get notified the moment your report gets attention.',
    color: '#a78bfa',
  },
  {
    icon: '🗺️',
    title: 'Interactive Maps',
    desc: 'Browse all reported issues on a live map. Identify hotspot zones and track clusters in your area.',
    color: '#fb7185',
  },
  {
    icon: '🏛️',
    title: 'Municipal Dashboard',
    desc: 'Officers get a dedicated analytics dashboard — filter, prioritize, update statuses, and view resolution analytics.',
    color: '#fbbf24',
  },
]




const steps = [
  {
    num: '#1',
    title: 'Spot a Problem',
    desc: 'Notice a pothole, exposed wire, or broken manhole? Open FixTown on your phone.',
    color: '#f59e0b',
  },
  {
    num: '#2',
    title: 'Pin & Report',
    desc: 'Drop a pin on the map, take a photo, choose a category, and submit in under 60 seconds.',
    color: '#6b7280',
  },
  {
    num: '#3',
    title: 'Community Votes',
    desc: 'Neighbours upvote the issue. High-vote issues bubble up to the top of the municipal queue.',
    color: '#60a5fa',
  },
  {
    num: '#4',
    title: 'Get It Fixed',
    desc: 'Municipal officers see and act on your report. You get notified as the status changes to Resolved.',
    color: '#a78bfa',
  },
]

export default function Home() {
  const [stats, setStats] = useState([
    { value: '2400+', label: 'Issues Reported' },
    { value: '840', label: 'Resolved This Month' },
    { value: '12000+', label: 'Active Citizens' },
    { value: '3.2 days', label: 'Avg Resolution Time' },
  ])

  // useEffect(() => {
  //   api.get('/dashboard/public-stats')
  //     .then(r => {
  //       const d = r.data
  //       setStats([
  //         { value: d.total    ?? '—', label: 'Issues Reported' },
  //         { value: d.resolved ?? '—', label: 'Resolved' },
  //         { value: d.citizens ?? '—', label: 'Active Citizens' },
  //         { value: d.avg_days ? `${d.avg_days}d` : '—', label: 'Avg Resolution Time' },
  //       ])
  //     })
  //     .catch(() => {})
  // }, [])
  return (
    <div className="page-wrapper">

      {/* ── Hero Section ── */}
      <section style={{
        padding: '60px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow behind hero text */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          {/* Eyebrow */}
          {/* <div className="animate-fade-up" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: '600',
            color: 'var(--amber-400)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--amber-500)',
              boxShadow: '0 0 8px var(--amber-400)',
              animation: 'pulse-glow 2s infinite',
            }} />
            Civic Tech Platform
          </div> */}

          {/* Headline */}
          <h1 className="animate-fade-up stagger-1" style={{
            maxWidth: '60%',
            marginBottom: '24px',
            lineHeight: '1.1',
          }}>
            {/* Your city has problems.{' '} */}
            Does your city has problems?{' '}
            <span style={{
              color: 'var(--amber-500)',
              position: 'relative',
            }}>
              Let's fix them.
            </span>
          </h1>

          {/* Subhead */}
          <p className="animate-fade-up stagger-2" style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '100%',
            marginBottom: '40px',
            lineHeight: '1.7',
          }}>
            Report potholes, open manholes, water leaks, and electrical hazards.
            Track every issue from submission to resolution — with community voting
            and real-time municipal accountability.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up stagger-3" style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <Link to="/report" className="btn btn-primary btn-lg">
              Report an Issue
              <ArrowRightIcon />
            </Link>
            <Link to="/map" className="btn btn-secondary btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              Explore the Map
            </Link>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-up stagger-4 stats-bar" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            marginTop: '72px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            maxWidth: '100%',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface)',
                padding: '20px 16px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: i % 2 === 0 ? 'var(--amber-400)' : '#12e82b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: '500',
                  marginTop: '4px',
                  letterSpacing: '0.02em',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section-sm" >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Issue Categories
            </p>
          </div>
          <div className="categories-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
          }}>
            {categories.map((cat, i) => (
              <Link
                to="/map"
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#00000000'
                  e.currentTarget.style.background = cat.color + '25'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}18`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#00000000'
                  e.currentTarget.style.background = 'var(--bg-surface)'
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{cat.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: cat.color, lineHeight: 1.3 }}>{cat.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: '56px', maxWidth: '800px' }}>
            <p style={{ color: 'var(--amber-500)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              How It Works
            </p>
            <h2 style={{ marginBottom: '16px' }}>
              From problem to fix in 4 steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              FixTown streamlines civic reporting so issues don't fall through the cracks.
            </p>
          </div>

          <div className="steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            position: 'relative',
          }}>
            {/* Connecting line */}
            {/* <div style={{
              position: 'absolute',
              top: '48px', left: '12.5%', right: '12.5%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--border-default), var(--border-default), transparent)',
              zIndex: 0,
            }} /> */}

            {steps.map((step, i) => (
              <div key={i} style={{
                position: 'relative',
                zIndex: 1,
                padding: '0 16px',
                paddingTop: '0',
              }}>
                {/* Number bubble */}
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: step.color + '25',
                  border: `0px solid ${step.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  position: 'relative',
                }}>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: step.color,
                    letterSpacing: '-0.02em',
                  }}>{step.num}</span>
                </div>
                <h4 style={{ marginBottom: '8px', fontSize: '1rem', fontWeight: '700' }}>{step.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="section" >
        <div className="container">
          <div style={{ marginBottom: '56px', textAlign: 'center' }}>
            <p style={{ color: 'var(--civic-400)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Platform Features
            </p>
            <h2 style={{ maxWidth: '700px', margin: '0 auto 16px' }}>
              Everything your community needs
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              Built for citizens who care and municipalities that want to deliver.
            </p>
          </div>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}40`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Glow corner */}
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  width: '80px', height: '80px',
                  background: `radial-gradient(circle at top right, ${f.color}14, transparent)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  fontSize: '1.6rem',
                  marginBottom: '14px',
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: f.color + '16',
                  borderRadius: 'var(--radius-md)',
                }}>
                  {f.icon}
                </div>
                <h4 style={{ marginBottom: '8px', fontSize: '1rem', fontWeight: '700' }}>{f.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-sm" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="cta-banner" style={{
            background: 'linear-gradient(135deg, var(--navy-800) 0%, var(--navy-900) 100%)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background accent */}
            <div style={{
              position: 'absolute',
              right: '-80px', top: '-80px',
              width: '320px', height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251,191,36,0.08), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', maxWidth: '480px' }}>
              <h2 style={{ marginBottom: '12px' }}>
                Ready to fix your city?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Join thousands of citizens making their neighbourhoods better —
                one report at a time.
              </p>
            </div>
            <div className="cta-buttons" style={{ display: 'flex', gap: '12px', flexShrink: 0, position: 'relative' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Account
                <ArrowRightIcon />
              </Link>
              <Link to="/map" className="btn btn-secondary btn-lg">
                Browse Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 0',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="FixTown" style={{ width: '24px', height: '24px' }} />
            <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>FixTown</span>
            <span>— Making cities better, together.</span>
          </div>
          <div>© {new Date().getFullYear()} FixTown. Open-source civic tech.</div>
        </div>
      </footer>

      {/* ── Responsive styles ── */}
      <style>{`
        /* ≤ 900px — tablet landscape */
        @media (max-width: 900px) {
          .features-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .categories-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }

        /* ≤ 768px — tablet portrait */
        @media (max-width: 768px) {
          .stats-bar       { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .cta-banner      { flex-direction: column !important; padding: 32px !important; }
          .cta-buttons     { flex-wrap: wrap; }
          h1               { max-width: 100% !important; }
        }

        /* ≤ 480px — mobile */
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid   { grid-template-columns: 1fr !important; }
          .steps-grid      { grid-template-columns: 1fr !important; }
          .steps-grid { gap: 24px !important; }
          .cta-buttons a   { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}