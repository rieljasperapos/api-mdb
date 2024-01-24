import express from 'express'
import * as userControllers from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get("/users", authenticate, userControllers.getUsers);
router.post("/register-user", userControllers.registerUser);
router.post("/login-user", userControllers.loginUser);

export = router;