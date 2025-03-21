import { Router } from 'express';
import usersRouter from './users.js';
import quizzesRouter from './quizzes.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/quizzes', quizzesRouter);

export default router;
