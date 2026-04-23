import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createReservationController, completeReservationController, getReservationsController, getActiveReservationsController } from '../controllers/donation.controller.js';

const router = express.Router();

// público (doadores)
router.post('/', createReservationController);

// para confirmação do abrigo
router.get('/', auth, getReservationsController);
router.get('/active', auth, getActiveReservationsController);
router.put('/:id/complete', auth, completeReservationController);

export default router;