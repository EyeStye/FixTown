import { Router } from 'express'
import { getNotifications, markRead, markAllRead } from '../controllers/notificationsController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/',              authenticate, getNotifications)
router.patch('/read-all',    authenticate, markAllRead)
router.patch('/:id/read',    authenticate, markRead)

export default router