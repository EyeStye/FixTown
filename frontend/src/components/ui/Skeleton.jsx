/* Reusable skeleton loading components */

export function SkeletonBox({ width = '100%', height = '20px', radius = 'var(--radius-md)', style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
  )
}

export function IssueCardSkeleton() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px', borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
    }}>
      <SkeletonBox width="40px" height="40px" radius="var(--radius-md)" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBox width="60%" height="16px" />
        <SkeletonBox width="40%" height="12px" />
      </div>
      <SkeletonBox width="70px" height="24px" radius="var(--radius-full)" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <SkeletonBox width="48px" height="48px" radius="var(--radius-lg)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBox width="50%" height="28px" />
        <SkeletonBox width="70%" height="12px" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '8px' }}>
        {[...Array(5)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      {[...Array(4)].map((_, i) => <IssueCardSkeleton key={i} />)}
    </div>
  )
}