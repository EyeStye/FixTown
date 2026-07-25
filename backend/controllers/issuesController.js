import { query } from '../config/db.js'

/* ── helpers ── */
const formatIssue = (row) => ({
  ...row,
  coordinates: row.lng_lat ? [parseFloat(row.lng_lat.x), parseFloat(row.lng_lat.y)] : null,
  lng_lat: undefined,
})

/* ── GET /api/issues ── */
export async function getIssues(req, res) {
  try {
    const { category, status, lat, lng, radius = 10000, sort = 'votes', limit = 100 } = req.query

    let conditions = []
    let params     = []
    let idx        = 1

    if (category && category !== 'all') {
      conditions.push(`i.category = $${idx++}`)
      params.push(category)
    }
    if (status && status !== 'all') {
      conditions.push(`i.status = $${idx++}`)
      params.push(status)
    }

    // Geospatial radius filter
    if (lat && lng) {
      conditions.push(
        `ST_DWithin(i.location::geography, ST_SetSRID(ST_MakePoint($${idx++}, $${idx++}), 4326)::geography, $${idx++})`
      )
      params.push(parseFloat(lng), parseFloat(lat), parseFloat(radius))
    }

    const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderBy = sort === 'votes' ? 'i.vote_count DESC, i.created_at DESC' : 'i.created_at DESC'

    params.push(parseInt(limit))

    const result = await query(`
      SELECT
        i.*,
        ST_AsGeoJSON(i.location)::json->'coordinates' AS coords,
        json_build_object('id', u.id, 'name', u.name) AS user
      FROM issues i
      JOIN users u ON u.id = i.user_id
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${idx}
    `, params)

    const issues = result.rows.map(row => ({
      ...row,
      coordinates: row.coords,
      coords: undefined,
    }))

    res.json({ issues, total: issues.length })
  } catch (err) {
    console.error('getIssues error:', err)
    res.status(500).json({ error: 'Failed to fetch issues.' })
  }
}

/* ── GET /api/issues/:id ── */
export async function getIssue(req, res) {
  try {
    const result = await query(`
      SELECT
        i.*,
        ST_AsGeoJSON(i.location)::json->'coordinates' AS coords,
        json_build_object('id', u.id, 'name', u.name, 'created_at', u.created_at) AS user
      FROM issues i
      JOIN users u ON u.id = i.user_id
      WHERE i.id = $1
    `, [req.params.id])

    if (!result.rows.length)
      return res.status(404).json({ error: 'Issue not found.' })

    const row   = result.rows[0]
    const issue = { ...row, coordinates: row.coords, coords: undefined }

    // Get status logs
    const logs = await query(`
      SELECT sl.*, u.name AS changed_by_name
      FROM status_logs sl
      JOIN users u ON u.id = sl.changed_by
      WHERE sl.issue_id = $1
      ORDER BY sl.created_at ASC
    `, [row.id])

    // Check if requesting user voted
    let userVoted = false
    if (req.user) {
      const vote = await query(
        'SELECT id FROM votes WHERE user_id = $1 AND issue_id = $2',
        [req.user.id, row.id]
      )
      userVoted = vote.rows.length > 0
    }

    res.json({ issue, status_logs: logs.rows, user_voted: userVoted })
  } catch (err) {
    console.error('getIssue error:', err)
    res.status(500).json({ error: 'Failed to fetch issue.' })
  }
}

/* ── POST /api/issues ── */
export async function createIssue(req, res) {
  try {
    const { title, description, category, lat, lng, address } = req.body
    const image_url = req.file?.path || null

    if (!title || !category || !lat || !lng)
      return res.status(400).json({ error: 'Title, category and location are required.' })

    const result = await query(`
      INSERT INTO issues (title, description, category, location, address, image_url, user_id)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7, $8)
      RETURNING *,
        ST_AsGeoJSON(location)::json->'coordinates' AS coords
    `, [
      title.trim(),
      description?.trim() || null,
      category,
      parseFloat(lng),
      parseFloat(lat),
      address || null,
      image_url,
      req.user.id,
    ])

    const row   = result.rows[0]
    const issue = { ...row, coordinates: row.coords, coords: undefined }

    res.status(201).json({ issue })
  } catch (err) {
    console.error('createIssue error:', err)
    res.status(500).json({ error: 'Failed to create issue.' })
  }
}

/* ── PATCH /api/issues/:id/status  (officer only) ── */
export async function updateStatus(req, res) {
  try {
    const { status, note } = req.body
    const validStatuses = ['open', 'in_progress', 'resolved', 'rejected']

    if (!validStatuses.includes(status))
      return res.status(400).json({ error: 'Invalid status.' })

    // Get current issue
    const current = await query('SELECT * FROM issues WHERE id = $1', [req.params.id])
    if (!current.rows.length)
      return res.status(404).json({ error: 'Issue not found.' })

    const old_status = current.rows[0].status
    if (old_status === status)
      return res.status(400).json({ error: 'Status is already ' + status })

    // Update issue
    const result = await query(
      'UPDATE issues SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    )

    // Log the status change
    await query(
      'INSERT INTO status_logs (issue_id, old_status, new_status, changed_by, note) VALUES ($1,$2,$3,$4,$5)',
      [req.params.id, old_status, status, req.user.id, note || null]
    )

    // Notify the issue reporter
    const notifMsg = `Your issue "${current.rows[0].title}" status changed from ${old_status.replace('_',' ')} to ${status.replace('_',' ')}.`
    await query(
      'INSERT INTO notifications (user_id, issue_id, message) VALUES ($1,$2,$3)',
      [current.rows[0].user_id, req.params.id, notifMsg]
    )

    res.json({ issue: result.rows[0] })
  } catch (err) {
    console.error('updateStatus error:', err)
    res.status(500).json({ error: 'Failed to update status.' })
  }
}

/* ── DELETE /api/issues/:id  (owner or officer) ── */
export async function deleteIssue(req, res) {
  try {
    const result = await query('SELECT user_id FROM issues WHERE id = $1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Issue not found.' })

    const isOwner   = result.rows[0].user_id === req.user.id
    const isOfficer = req.user.role === 'officer'
    if (!isOwner && !isOfficer) return res.status(403).json({ error: 'Forbidden.' })

    await query('DELETE FROM issues WHERE id = $1', [req.params.id])
    res.json({ message: 'Issue deleted.' })
  } catch (err) {
    console.error('deleteIssue error:', err)
    res.status(500).json({ error: 'Failed to delete issue.' })
  }
}