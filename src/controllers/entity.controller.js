import { createEntity, searchEntitiesPublic, getEntityPublicById, getEntitiesByShelter, getEntityPrivateById, updateEntity } from '../services/entity.service.js';


// CREATE (pessoa ou animal inserido(a) no abrigo)
export const createEntityController = async (req, res) => {
  try {
    const entity = await createEntity(req.body, req.user.id);

    res.status(201).json(entity);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar registro' });
  }
};


// GET LIST (público com filtros)
export const searchEntitiesController = async (req, res) => {
  try {
    const entities = await searchEntitiesPublic(req.query);

    res.json(entities);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
};


// GET BY ID (público - limitado LGPD)
export const getEntityPublicController = async (req, res) => {
  try {
    const { id } = req.params;

    const entity = await getEntityPublicById(id);

    if (!entity) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json(entity);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar registro' });
  }
};


// GET BY ID (privado - completo)
export const getEntitiesByShelterController = async (req, res) => {
  try {
    const shelterId = req.user.id;

    const data = await getEntitiesByShelter(shelterId);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar entidades' });
  }
};

export const getEntityPrivateController = async (req, res) => {
  try {
    const { id } = req.params;

    const entity = await getEntityPrivateById(id, req.user.id);

    if (!entity) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json(entity);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar registro' });
  }
};


// UPDATE (abrigo)
export const updateEntityController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateEntity(id, req.body, req.user.id);

    res.json(updated);

  } catch (err) {

    if (err.message === 'EXIT_REASON_REQUIRED') {
      return res.status(400).json({
        error: 'Motivo é obrigatório ao finalizar atendimento'
      });
    }

    if (err.message === 'CANNOT_REVERT_STATUS') {
      return res.status(400).json({
        error: 'Não é possível alterar status após saída'
      });
    }

    if (err.message === 'INVALID_STATUS') {
      return res.status(400).json({
        error: 'Status inválido'
      });
    }

    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({
        error: 'Registro não encontrado'
      });
    }

    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
};