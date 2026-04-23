import db from '../database/db.js';

// Cria uma reserva para uma doação que o abrigo esteja precisando. O status aparece como "Active" quando for criado e pode ser alterado para "Completed", se a instituição confirmar e "Expired", caso o
//doador não leve em até 24h.


export const createReservation = async (supplyId, quantity) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Buscar supply
    const supplyRes = await client.query(
      `SELECT * FROM supplies WHERE id = $1`,
      [supplyId]
    );

    const supply = supplyRes.rows[0];

    if (!supply) throw new Error('SUPPLY_NOT_FOUND');

    // 2. Validar limite e quantidade correta
    if (supply.current_quantity + quantity > supply.max_quantity) {
      throw new Error('EXCEEDS_MAX');
    }

    if(quantity <= 0){
      throw new Error('INCORRECT_NUMBER');
    }

    // 3. Atualizar estoque (RESERVA já conta!)
    await client.query(
      `UPDATE supplies
       SET current_quantity = current_quantity + $1
       WHERE id = $2`,
      [quantity, supplyId]
    );

    // 4. Criar reservation
    const reservation = await client.query(
      `
      INSERT INTO donation_reservations
      (supply_id, quantity, status, expires_at)
      VALUES ($1, $2, 'active', NOW() + INTERVAL '2 minutes')
      RETURNING *
      `,
      [supplyId, quantity]
    );

    await client.query('COMMIT');

    return reservation.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};



//Obtém todas as reservas de doações por abrigo por ordem da mais atual para a menos atual
export const getReservationsByShelter = async (shelterId) => {
  const result = await db.query(
    `
    SELECT 
      dr.*,
      s.name AS supply_name
    FROM donation_reservations dr
    JOIN supplies s ON s.id = dr.supply_id
    WHERE s.shelter_id = $1
    ORDER BY dr.created_at DESC
    `,
    [shelterId]
  );

  return result.rows;
};



//Obtém todas as reservas de doações ativas do abrigo por ordem da mais atual para a menos atual
export const getActiveReservations = async (shelterId) => {
  const result = await db.query(
    `
    SELECT 
      dr.*,
      s.name AS supply_name
    FROM donation_reservations dr
    JOIN supplies s ON s.id = dr.supply_id
    WHERE s.shelter_id = $1
    AND dr.status = 'active'
    ORDER BY dr.created_at DESC
    `,
    [shelterId]
  );

  return result.rows;
};



export const completeReservation = async (id, shelterId) => {
  const reservation = await db.query(
    `
    SELECT dr.*, s.shelter_id
    FROM donation_reservations dr
    JOIN supplies s ON s.id = dr.supply_id
    WHERE dr.id = $1
    `,
    [id]
  );

  const data = reservation.rows[0];

  if (!data) throw new Error('NOT_FOUND');
  if (data.shelter_id !== shelterId) throw new Error('UNAUTHORIZED');

  await db.query(
    `UPDATE donation_reservations
     SET status = 'completed'
     WHERE id = $1`,
    [id]
  );

  return { message: 'Doação confirmada' };
};



export const expireReservations = async () => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Buscar reservas expiradas
    const expired = await client.query(
      `
      SELECT * FROM donation_reservations
      WHERE status = 'active'
      AND expires_at < NOW()
      `
    );

    for (const r of expired.rows) {
      // 2. Reverter estoque
      await client.query(
        `
        UPDATE supplies
        SET current_quantity = current_quantity - $1
        WHERE id = $2
        `,
        [r.quantity, r.supply_id]
      );

      // 3. Marcar como expired
      await client.query(
        `
        UPDATE donation_reservations
        SET status = 'expired'
        WHERE id = $1
        `,
        [r.id]
      );
    }

    await client.query('COMMIT');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao expirar reservas:', err);
  } finally {
    client.release();
  }
};