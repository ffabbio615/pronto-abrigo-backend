import express from 'express';
import { loginShelter, registerShelter, updateShelterController, listShelters, getShelter, getMyShelter } from '../controllers/shelter.controller.js';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerShelterSchema, updateShelterSchema } from '../validators/shelterValidator.js';

const router = express.Router();

// privado (precisa vir antes senão o Node pensa que a rota é um id)
router.get('/me', auth, getMyShelter);

// público
router.get('/', listShelters);
router.get('/:id', getShelter);

// cadastro e atualização
router.post('/register', validate(registerShelterSchema), registerShelter);
router.put('/update', auth, validate(updateShelterSchema), updateShelterController);

//login
router.post('/login', loginShelter);

export default router;