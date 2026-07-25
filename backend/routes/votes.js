import { Router } from 'express'
import { addVote, removeVote } from '../controllers/votesController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router({ mergeParams: true }) // gets :id from parent

router.post('/',   authenticate, addVote)
router.delete('/', authenticate, removeVote)

export default router