import express from 'express'
import * as authenticateController from '../controllers/authenticate.controller'
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get("/auth", authenticate, authenticateController.getAuthenticate)
router.get("/logout", authenticateController.destroyAuthenticate);

export = router;