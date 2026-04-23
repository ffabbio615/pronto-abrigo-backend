import express from 'express';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createSupplySchema } from '../validators/supplyValidator.js';
import { createSupplyController, getSuppliesController, updateSupplyController, deleteSupplyController } from '../controllers/supply.controller.js';

const router = express.Router();

router.post('/', auth, validate(createSupplySchema), createSupplyController);
router.get('/', auth, getSuppliesController);
router.put('/:id', auth, updateSupplyController);
router.delete('/:id', auth, deleteSupplyController);

export default router;