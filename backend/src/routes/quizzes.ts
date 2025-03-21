import { Router } from 'express';
import {
    getAllQuizzes,
    getQuizById,
} from '../controllers/quizzesControllers.js';

const router = Router();

router.route('/').get(getAllQuizzes);
router.route('/:id').get(getQuizById);

export default router;
