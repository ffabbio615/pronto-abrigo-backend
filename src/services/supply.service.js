import db from '../database/db.js';

export const createSupply = async (data, shelterId) => {
  const { name, min_quantity, max_quantity, current_quantity = 0 } = data;

  const result = await db.query(
    `INSERT INTO supplies 
    (name, min_quantity, max_quantity, current_quantity, shelter_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [name, min_quantity, max_quantity, current_quantity, shelterId]
  );

  return result.rows[0];
};

export const getSupplies = async (shelterId) => {
  const result = await db.query(
    `SELECT * FROM supplies WHERE shelter_id = $1`,
    [shelterId]
  );

  return result.rows;
};

export const updateSupply = async (id, data, shelterId) => {
  // 1. Buscar supply atual
  const result = await db.query(
    `SELECT * FROM supplies WHERE id = $1 AND shelter_id = $2`,
    [id, shelterId]
  );

  const supply = result.rows[0];

  if (!supply) {
    throw new Error('SUPPLY_NOT_FOUND');
  }

  const {
    min_quantity = supply.min_quantity,
    max_quantity = supply.max_quantity,
    current_quantity = supply.current_quantity,
    name = supply.name
  } = data;

  // 2. VALIDAÇÕES

  // min não pode ser maior que max
  if (min_quantity > max_quantity) {
    throw new Error('MIN_GREATER_THAN_MAX');
  }

  // current não pode ser negativo
  if (current_quantity < 0) {
    throw new Error('CURRENT_NEGATIVE');
  }

  // current não pode ser maior que max
  if (current_quantity > max_quantity) {
    throw new Error('CURRENT_GREATER_THAN_MAX');
  }

  // REGRA MAIS IMPORTANTE
  // max NÃO pode ser menor que current existente
  if (max_quantity < supply.current_quantity) {
    throw new Error('MAX_LESS_THAN_CURRENT');
  }

  // 3. UPDATE DINÂMICO
  const updated = await db.query(
    `
    UPDATE supplies
    SET
      name = $1,
      min_quantity = $2,
      max_quantity = $3,
      current_quantity = $4
    WHERE id = $5 AND shelter_id = $6
    RETURNING *
    `,
    [name, min_quantity, max_quantity, current_quantity, id, shelterId]
  );

  return updated.rows[0];
};

export const deleteSupply = async (id, shelterId) => {
  await db.query(
    `DELETE FROM supplies WHERE id = $1 AND shelter_id = $2`,
    [id, shelterId]
  );
};