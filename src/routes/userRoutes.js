import { registerUser, loginUser } from '../controllers/userController.js';

const router = Router();

// POST /api/users/register - User registration
router.post('/register', registerUser);

// POST /api/users/login - User login
router.post('/login', loginUser);

export default router;