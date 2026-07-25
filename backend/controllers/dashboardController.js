import { query } from '../config/db.js'

/* ── GET /api/dashboard/my-issues  (citizen) ── */
export async function getMyIssues(req, res) {
  try {
    const result = await query(`
      SELECT
        i.*,
        ST_AsGeoJSON(i.location)::json->'coordinates' AS coords
      FROM issues i
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
    `, [req.user.id])

    const issues = result.rows.map(row => ({
      ...row,
      coordinates: row.coords,
      coords: undefined,
    }))

    res.json({ issues })
  } catch (err) {
    console.error('getMyIssues error:', err)
    res.status(500).json({ error: 'Failed to fetch your issues.' })
  }
}

/* ── GET /api/dashboard/analytics  (officer) ── */
export async function getAnalytics(req, res) {
  try {
    // Total counts by status
    const statusCounts = await query(`
      SELECT status, COUNT(*)::int AS count
      FROM issues
      GROUP BY status
    `)

    const counts = { total: 0, open: 0, in_progress: 0, resolved: 0, rejected: 0 }
    statusCounts.rows.forEach(row => {
      counts[row.status] = row.count
      counts.total += row.count
    })

    // Resolved this month
    const resolvedThisMonth = await query(`
      SELECT COUNT(*)::int AS count
      FROM status_logs
      WHERE new_status = 'resolved'
        AND created_at >= date_trunc('month', NOW())
    `)

    // Average resolution time in days
    const avgResolution = await query(`
      SELECT ROUND(AVG(
        EXTRACT(EPOCH FROM (sl.created_at - i.created_at)) / 86400
      )::numeric, 1)::float AS avg_days
      FROM status_logs sl
      JOIN issues i ON i.id = sl.issue_id
      WHERE sl.new_status = 'resolved'
    `)

    // Issues by category
    const byCategory = await query(`
      SELECT category, COUNT(*)::int AS count
      FROM issues
      GROUP BY category
      ORDER BY count DESC
    `)

    // Issues reported per day last 7 days
    const last7Days = await query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*)::int    AS count
      FROM issues
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    // Top voted open issues
    const topVoted = await query(`
      SELECT id, title, category, vote_count, address
      FROM issues
      WHERE status = 'open'
      ORDER BY vote_count DESC
      LIMIT 5
    `)

    res.json({
      ...counts,
      resolved_this_month: resolvedThisMonth.rows[0]?.count || 0,
      avg_days:            avgResolution.rows[0]?.avg_days  || null,
      by_category:         byCategory.rows,
      last_7_days:         last7Days.rows,
      top_voted:           topVoted.rows,
    })
  } catch (err) {
    console.error('getAnalytics error:', err)
    res.status(500).json({ error: 'Failed to fetch analytics.' })
  }
}

export async function getPublicStats(req, res) {
  try {
    const [counts, avgRes, citizens] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='resolved')::int AS resolved FROM issues`),
      query(`SELECT ROUND(AVG(EXTRACT(EPOCH FROM (sl.created_at - i.created_at))/86400)::numeric,1)::float AS avg_days FROM status_logs sl JOIN issues i ON i.id=sl.issue_id WHERE sl.new_status='resolved'`),
      query(`SELECT COUNT(*)::int AS total FROM users WHERE role='citizen'`),
    ])
    res.json({
      total:      counts.rows[0].total,
      resolved:   counts.rows[0].resolved,
      citizens:   citizens.rows[0].total,
      avg_days:   avgRes.rows[0].avg_days,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' })
  }
}