import db from '../database/db.js';

export const createShelter = async (data) => {
  const query = `
    INSERT INTO shelters (name, nickname, description, address, email, password, latitude, longitude, type, capacity, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const values = [
    data.name,
    data.nickname,
    data.description,
    data.address,
    data.email,
    data.password,
    data.latitude,
    data.longitude,
    data.type,
    data.capacity,
    data.photo_url
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
      nickname,
      description,
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

export const getNearbyShelters = async (lat, lng, radius = 20) => {
  const query = `
    SELECT
      id,
      name,
      nickname,
      description,
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
      END AS status,

      (
        6371 * acos(
          cos(radians($1))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians($2))
          + sin(radians($1))
          * sin(radians(latitude))
        )
      ) AS distance

    FROM shelters

    WHERE (
      6371 * acos(
        cos(radians($1))
        * cos(radians(latitude))
        * cos(radians(longitude) - radians($2))
        + sin(radians($1))
        * sin(radians(latitude))
      )
    ) <= $3

    ORDER BY distance ASC;
  `;

  const result = await db.query(query, [lat, lng, radius]);

  console.log("LAT:", lat);
console.log("LNG:", lng);
console.log("RADIUS:", radius);

console.table(
  result.rows.map(r => ({
    name: r.name,
    distance: r.distance
  }))
);

  return result.rows;
};

export const getShelterById = async (id) => {
  const result = await db.query(
    `
    SELECT 
      id,
      name,
      nickname,
      description,
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