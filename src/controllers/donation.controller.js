import { createReservation, completeReservation, getReservationsByShelter, getActiveReservations } from '../services/donation.service.js';


// CRIAR RESERVA (público)
export const createReservationController = async (req, res) => {
  try {
    const { supply_id, quantity } = req.body;

    const reservation = await createReservation(supply_id, quantity);

    res.status(201).json(reservation);

  } catch (err) {
    if (err.message === 'EXCEEDS_MAX') {
      return res.status(400).json({
        error: 'Quantidade excede o limite do abrigo'
      });
    }

    if (err.message === 'INCORRECT_NUMBER'){
      return res.status(400).json({
        error: 'Quantidade informada está incorreta ou não é aceita'
      });
    }

    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
};


// OBTÉM TODAS
export const getReservationsController = async (req, res) => {
  try {
    const shelterId = req.user.id;

    const data = await getReservationsByShelter(shelterId);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
};


// OBTÉM SOMENTE AS ATIVAS
export const getActiveReservationsController = async (req, res) => {
  try {
    const shelterId = req.user.id;

    const data = await getActiveReservations(shelterId);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reservas ativas' });
  }
};


// CONFIRMAR (abrigo)
export const completeReservationController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await completeReservation(id, req.user.id);

    res.json(result);

  } catch (err) {
    if (err.message === 'UNAUTHORIZED') {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    res.status(500).json({ error: 'Erro ao confirmar doação' });
  }
};