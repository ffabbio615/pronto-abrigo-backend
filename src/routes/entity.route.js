import express from 'express';
import { createEntityController, searchEntitiesController, getEntityPublicController, getEntityPrivateController, updateEntityController } from '../controllers/entity.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();


// PÚBLICO
router.get('/', searchEntitiesController);
router.get('/:id', getEntityPublicController);


// PRIVADO (abrigo)
router.post('/', auth, createEntityController);
router.get('/private/:id', auth, getEntityPrivateController);
router.put('/:id', auth, updateEntityController);


export default router;