import express from 'express';
import { getTour, getOverview } from '../controllers/viewController.js';

const router = express.Router();

router.get('/', getOverview);

// Adding slug like is using (:) is called URL Parameters
router.get('/tour/:slug', getTour);

export default router;
