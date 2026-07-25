import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

const safeUser = (u) => ({
  id: u.id, name: u.name, email: u.email,
  role: u.role, avatar_url: u.avatar_url, created_at: u.created_at,
})

/* ── POST /api/auth/register ── */
export async function registerUser(req, res) {
  try {
    const { name, email, password, role = 'citizen' } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })

    if (!['citizen', 'officer'].includes(role))
      return res.status(400).json({ error: 'Invalid role.' })

    // Check duplicate email
    const exists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists.' })

    const hash = await bcrypt.hash(password, 12)

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), email.toLowerCase(), hash, role]
    )

    const user  = result.rows[0]
    const token = signToken(user)

    res.status(201).json({ token, user: safeUser(user) })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
}

/* ── POST /api/auth/login ── */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' })

    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    const user   = result.rows[0]

    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const token = signToken(user)
    res.json({ token, user: safeUser(user) })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
}

/* ── GET /api/auth/me ── */
export async function getMe(req, res) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [req.user.id])
    const user   = result.rows[0]
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ user: safeUser(user) })
  } catch (err) {
    console.error('GetMe error:', err)
    res.status(500).json({ error: 'Failed to fetch user.' })
  }
}