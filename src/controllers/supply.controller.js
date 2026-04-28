import { createSupply, getSupplies, getNearbySuppliesService, updateSupply, deleteSupply } from '../services/supply.service.js';

// Cria um supply (suprimento) e define as quantidades necessárias para evitar desperdícios.
export const createSupplyController = async (req, res) => {
  try {
    const { min_quantity, max_quantity, current_quantity = 0 } = req.body;

    if (min_quantity > max_quantity) {
      return res.status(400).json({ error: 'Min não pode ser maior que max' });
    }

    if (current_quantity > max_quantity) {
      return res.status(400).json({ error: 'Current não pode ser maior que max' });
    }

    const supply = await createSupply(req.body, req.user.id);

    res.status(201).json(supply);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar supply' });
  }
};


// GET (todos os supplies do abrigo logado).
export const getSuppliesController = async (req, res) => {
  try {
    const shelterId = req.user.id;

    const supplies = await getSupplies(shelterId);

    res.json(supplies);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar supplies' });
  }
};


export const getNearbySuppliesController = async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: "Latitude e longitude são obrigatórias"
    });
  }

  try {
    const supplies = await getNearbySuppliesService(
      Number(lat),
      Number(lng),
      Number(radius)
    );

    return res.status(200).json(supplies);

  } catch (error) {
    console.error("Erro ao buscar mantimentos:", error);
    return res.status(500).json({
      error: "Erro ao buscar mantimentos"
    });
  }
};


// PUT com as regras de negócio aplicadas.
export const updateSupplyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { min_quantity, max_quantity, current_quantity } = req.body;

    // Regras de validação
    if (min_quantity && max_quantity && min_quantity > max_quantity) {
      return res.status(400).json({ error: 'Min não pode ser maior que max' });
    }

    if (current_quantity !== undefined && current_quantity < 0) {
      return res.status(400).json({ error: 'Current não pode ser negativo' });
    }

    const updated = await updateSupply(id, req.body, req.user.id);

    res.json(updated);

  } catch (err) {
    if (err.message === 'MAX_LESS_THAN_CURRENT') {
      return res.status(400).json({
        error: 'Não é possível reduzir o máximo abaixo do estoque atual'
      });
    }

    if (err.message === 'SUPPLY_NOT_FOUND') {
        return res.status(404).json({ error: 'Supply não encontrado' });
    }

    res.status(500).json({ error: 'Erro ao atualizar supply' });
  }
};


// DELETE, caso o abrigo não trabalhe mais com o item em questão.
export const deleteSupplyController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteSupply(id, req.user.id);

    res.json({ message: 'Supply deletado com sucesso' });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar supply' });
  }
};