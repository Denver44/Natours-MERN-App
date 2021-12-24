import express from "express"
import { getATour, getAllTours, createATour, updateATour, deleteATour, checkId, checkBody } from '../controllers/tourController.js'

const router = express.Router()
router.param('id', checkId)

router.route('/').get(getAllTours).post(checkBody, createATour)
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour)

export default router