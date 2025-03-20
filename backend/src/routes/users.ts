import { Router } from 'express';
import {
    createNewUser,
    getAllUsers,
    getUserById,
} from '../controllers/usersControllers.js';

const router = Router();

router.route('/').get(getAllUsers).post(createNewUser);
router.route('/:id').get(getUserById);

export default router;
