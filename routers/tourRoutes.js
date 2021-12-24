import express from "express"
import { getATour, getAllTours, createATour, updateATour, deleteATour } from '../controllers/tourController.js'

const router = express.Router()

router.route('/').get(getAllTours).post(createATour)
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour)

export default router