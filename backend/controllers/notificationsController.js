import { query } from '../config/db.js'

/* GET /api/notifications */
export async function getNotifications(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const result = await query(
      `SELECT n.*, i.title AS issue_title
       FROM notifications n
       JOIN issues i ON i.id = n.issue_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT $2`,
      [req.user.id, limit]
    )
    const unread = result.rows.filter(n => !n.is_read).length
    res.json({ notifications: result.rows, unread })
  } catch (err) {
    console.error('getNotifications error:', err)
    res.status(500).json({ error: 'Failed to fetch notifications.' })
  }
}

/* PATCH /api/notifications/:id/read */
export async function markRead(req, res) {
  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ message: 'Marked as read.' })
  } catch (err) {
    console.error('markRead error:', err)
    res.status(500).json({ error: 'Failed to mark as read.' })
  }
}

/* PATCH /api/notifications/read-all */
export async function markAllRead(req, res) {
  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [req.user.id]
    )
    res.json({ message: 'All marked as read.' })
  } catch (err) {
    console.error('markAllRead error:', err)
    res.status(500).json({ error: 'Failed to mark all as read.' })
  }
}