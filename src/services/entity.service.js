import db from '../database/db.js';

/**
 * CREATE ENTITY
 * Status padrão SEMPRE controlado pelo backend
 */
export const createEntity = async (data, shelterId) => {
  const result = await db.query(
    `
    INSERT INTO registered_entities
    (type, name, birth_date, estimated_age, species, breed, description, photo_url, allow_public_photo, status, shelter_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
    `,
    [
      data.type,
      data.name,
      data.birth_date,
      data.estimated_age,
      data.species,
      data.breed,
      data.description,
      data.photo_url,
      data.allow_public_photo,
      data.status ?? 'in_shelter',
      shelterId
    ]
  );

  return result.rows[0];
};

/**
 * PUBLIC SEARCH
 * Apenas pessoas em busca da família
 */
export const searchEntitiesPublic = async () => {

  const result = await db.query(`
    SELECT 
      id,
      shelter_id,
      type,
      name,
      estimated_age,
      species,
      breed,
      description,
      status,
      created_at,
      
    CASE
      WHEN allow_public_photo = true THEN photo_url
      ELSE NULL
    END AS photo_url

    FROM registered_entities
    WHERE status = 'looking_for_family'
    ORDER BY created_at DESC
  `);

  return result.rows;
};

/**
 * SHELTER LIST
 */
export const getEntitiesByShelter = async (shelterId) => {
  const result = await db.query(
    `
    SELECT *
    FROM registered_entities
    WHERE shelter_id = $1
    ORDER BY created_at DESC
    `,
    [shelterId]
  );

  return result.rows;
};

/**
 * PRIVATE BY ID
 */
export const getEntityPrivateById = async (id, shelterId) => {
  const result = await db.query(
    `
    SELECT *
    FROM registered_entities
    WHERE id = $1 AND shelter_id = $2
    `,
    [id, shelterId]
  );

  return result.rows[0];
};

/**
 * UPDATE ENTITY
 */
export const updateEntity = async (id, data, shelterId) => {
  const result = await db.query(
    `
    SELECT * FROM registered_entities
    WHERE id = $1 AND shelter_id = $2
    `,
    [id, shelterId]
  );

  const entity = result.rows[0];

  if (!entity) throw new Error('NOT_FOUND');

  const {
    name = entity.name,
    birth_date = entity.birth_date,
    estimated_age = entity.estimated_age,
    species = entity.species,
    description = entity.description,
    photo_url = entity.photo_url,
    allow_public_photo = entity.allow_public_photo,
    status = entity.status,
    exit_reason = entity.exit_reason
  } = data;

  const allowedStatus = [
    'in_shelter',
    'looking_for_family',
    'reunited',
    'released'
  ];

  if (!allowedStatus.includes(status)) {
    throw new Error('INVALID_STATUS');
  }

  if (
    (status === 'reunited' || status === 'released') &&
    (!exit_reason || exit_reason.trim() === '')
  ) {
    throw new Error('EXIT_REASON_REQUIRED');
  }

  if (
    (entity.status === 'reunited' || entity.status === 'released') &&
    status !== entity.status
  ) {
    throw new Error('CANNOT_REVERT_STATUS');
  }

  const updated = await db.query(
    `
    UPDATE registered_entities
    SET
      name = $1,
      birth_date = $2,
      estimated_age = $3,
      species = $4,
      description = $5,
      photo_url = $6,
      allow_public_photo = $7,
      status = $8,
      exit_reason = $9
    WHERE id = $10 AND shelter_id = $11
    RETURNING *
    `,
    [
      name,
      birth_date,
      estimated_age,
      species,
      description,
      photo_url,
      allow_public_photo,
      status,
      exit_reason,
      id,
      shelterId
    ]
  );

  return updated.rows[0];
};