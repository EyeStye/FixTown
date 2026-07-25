import { query } from '../config/db.js'

/* POST /api/issues/:id/vote */
export async function addVote(req, res) {
  try {
    const { id: issue_id } = req.params
    const user_id = req.user.id

    // Check issue exists
    const issue = await query('SELECT id FROM issues WHERE id = $1', [issue_id])
    if (!issue.rows.length) return res.status(404).json({ error: 'Issue not found.' })

    // Insert vote (unique constraint handles duplicates)
    await query(
      'INSERT INTO votes (user_id, issue_id) VALUES ($1, $2)',
      [user_id, issue_id]
    )

    const updated = await query('SELECT vote_count FROM issues WHERE id = $1', [issue_id])
    res.status(201).json({ vote_count: updated.rows[0].vote_count })
  } catch (err) {
    if (err.code === '23505') // unique violation
      return res.status(409).json({ error: 'Already voted.' })
    console.error('addVote error:', err)
    res.status(500).json({ error: 'Failed to vote.' })
  }
}

/* DELETE /api/issues/:id/vote */
export async function removeVote(req, res) {
  try {
    const { id: issue_id } = req.params
    const user_id = req.user.id

    const result = await query(
      'DELETE FROM votes WHERE user_id = $1 AND issue_id = $2',
      [user_id, issue_id]
    )

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Vote not found.' })

    const updated = await query('SELECT vote_count FROM issues WHERE id = $1', [issue_id])
    res.json({ vote_count: updated.rows[0].vote_count })
  } catch (err) {
    console.error('removeVote error:', err)
    res.status(500).json({ error: 'Failed to remove vote.' })
  }
}