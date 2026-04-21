import db from '../database/db.js';

export const createShelter = async (data) => {
  const query = `
    INSERT INTO shelters (name, address, email, password, type, capacity)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    data.name,
    data.address,
    data.email,
    data.password,
    data.type,
    data.capacity
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

export const findShelterByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM shelters WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

export const getAllShelters = async () => {
  const result = await db.query(`
    SELECT 
      id,
      name,
      address,
      latitude,
      longitude,
      type,
      capacity,
      current_occupancy,
      photo_url,
      
      CASE
        WHEN current_occupancy >= capacity THEN 'full'
        ELSE status
      END AS status

    FROM shelters
  `);

  return result.rows;
};


export const getShelterById = async (id) => {
  const result = await db.query(
    `
    SELECT 
      id,
      name,
      address,
      latitude,
      longitude,
      type,
      capacity,
      current_occupancy,
      photo_url,

      CASE
        WHEN current_occupancy >= capacity THEN 'full'
        ELSE status
      END AS status

    FROM shelters
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export const updateShelter = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    fields.push(`${key} = $${index}`);
    values.push(data[key]);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE shelters
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};