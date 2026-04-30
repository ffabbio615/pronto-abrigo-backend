import {
  createEntity,
  searchEntitiesPublic,
  getEntityPublicById,
  getEntitiesByShelter,
  getEntityPrivateById,
  updateEntity
} from '../services/entity.service.js';

/**
 * CREATE
 */
export const createEntityController = async (req, res) => {
  try {
    const entity = await createEntity(req.body, req.user.id);
    return res.status(201).json(entity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar registro' });
  }
};

/**
 * PUBLIC SEARCH
 */
export const searchEntitiesController = async (req, res) => {
  try {
    const entities = await searchEntitiesPublic(req.query || {});
    return res.json(entities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar registros' });
  }
};

/**
 * PUBLIC BY ID
 */
export const getEntityPublicController = async (req, res) => {
  try {
    const { id } = req.params;

    const entity = await getEntityPublicById(id);

    if (!entity) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    return res.json(entity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar registro' });
  }
};

/**
 * SHELTER LIST
 */
export const getEntitiesByShelterController = async (req, res) => {
  try {
    const data = await getEntitiesByShelter(req.user.id);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar entidades' });
  }
};

/**
 * PRIVATE BY ID
 */
export const getEntityPrivateController = async (req, res) => {
  try {
    const { id } = req.params;

    const entity = await getEntityPrivateById(id, req.user.id);

    if (!entity) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    return res.json(entity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar registro' });
  }
};

/**
 * UPDATE
 */
export const updateEntityController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateEntity(id, req.body, req.user.id);

    return res.json(updated);
  } catch (err) {
    console.error(err);

    const errors = {
      EXIT_REASON_REQUIRED: 400,
      CANNOT_REVERT_STATUS: 400,
      INVALID_STATUS: 400,
      NOT_FOUND: 404
    };

    if (errors[err.message]) {
      return res.status(errors[err.message]).json({
        error: err.message
      });
    }

    return res.status(500).json({
      error: 'Erro ao atualizar registro'
    });
  }
};