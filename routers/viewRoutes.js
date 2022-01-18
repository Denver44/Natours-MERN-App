import express from 'express';
import {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
} from '../controllers/viewController.js';
import { checkLoggedIn, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We pu this checkLoggedIn in all the route

router.get('/', checkLoggedIn, getOverview);
router.get('/tour/:slug', checkLoggedIn, getTour); // Adding slug like is using (:) is called URL Parameters
router.get('/login', checkLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);

export default router;
