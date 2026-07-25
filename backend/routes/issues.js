import { Router } from 'express'
import { getIssues, getIssue, createIssue, updateStatus, deleteIssue } from '../controllers/issuesController.js'
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

// Public
router.get('/',    getIssues)
router.get('/:id', optionalAuth, getIssue)   // also accepts optional auth for user_voted flag

// Citizen: create issue (with optional image upload)
router.post('/', authenticate, upload.single('image'), createIssue)

// Officer: update status
router.patch('/:id/status', authenticate, requireRole('officer'), updateStatus)

// Owner or officer: delete
router.delete('/:id', authenticate, deleteIssue)

export default router