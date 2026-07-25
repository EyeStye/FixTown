import { Router } from 'express'
import { getMyIssues, getAnalytics, getPublicStats } from '../controllers/dashboardController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

// Citizen: my reported issues
router.get('/my-issues',  authenticate, getMyIssues)

// Officer: full analytics
router.get('/analytics',  authenticate, requireRole('officer'), getAnalytics)

router.get('/public-stats', getPublicStats)

export default router