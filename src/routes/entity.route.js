import express from 'express';
import { createEntityController, searchEntitiesController, getEntityPublicController, getEntitiesByShelterController, getEntityPrivateController, updateEntityController } from '../controllers/entity.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// PRIVADO (abrigo)
router.post('/', auth, createEntityController);
router.get('/private', auth, getEntitiesByShelterController);
router.get('/private/:id', auth, getEntityPrivateController);
router.put('/:id', auth, updateEntityController);



// PÚBLICO
router.get('/', searchEntitiesController);
router.get('/:id', getEntityPublicController);

export default router;