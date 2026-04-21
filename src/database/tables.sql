-- =========================================
-- ENUMS
-- =========================================

CREATE TYPE shelter_type AS ENUM ('human', 'animal');

CREATE TYPE shelter_status AS ENUM ('open', 'full', 'closed');

CREATE TYPE entity_type AS ENUM ('person', 'animal');

CREATE TYPE entity_status AS ENUM (
  'in_shelter',
  'looking_for_family',
  'reunited',
  'released'
);

CREATE TYPE reservation_status AS ENUM ('active', 'completed', 'expired');


-- =========================================
-- SHELTERS (COM LOGIN)
-- =========================================

CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    type shelter_type NOT NULL,
    status shelter_status DEFAULT 'open',

    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,

    photo_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- SUPPLIES (MANTIMENTOS)
-- =========================================

CREATE TABLE supplies (
    id SERIAL PRIMARY KEY,
    shelter_id INTEGER REFERENCES shelters(id) ON DELETE CASCADE,

    name TEXT NOT NULL,

    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER NOT NULL,
    current_quantity INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- DONATION RESERVATIONS
-- =========================================

CREATE TABLE donation_reservations (
    id SERIAL PRIMARY KEY,

    shelter_id INTEGER REFERENCES shelters(id) ON DELETE CASCADE,
    supply_id INTEGER REFERENCES supplies(id) ON DELETE CASCADE,

    quantity INTEGER NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    status reservation_status DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- REGISTERED ENTITIES (PESSOAS / ANIMAIS)
-- =========================================

CREATE TABLE registered_entities (
    id SERIAL PRIMARY KEY,

    shelter_id INTEGER REFERENCES shelters(id) ON DELETE CASCADE,

    type entity_type NOT NULL,

    name TEXT,

    birth_date DATE,
    estimated_age INTEGER,

    species TEXT,
    breed TEXT,

    description TEXT,

    photo_url TEXT,
    allow_public_photo BOOLEAN DEFAULT false,

    status entity_status DEFAULT 'in_shelter',

    exit_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- ÍNDICES (PERFORMANCE)
-- =========================================

CREATE INDEX idx_shelters_location 
ON shelters(latitude, longitude);

CREATE INDEX idx_supplies_shelter 
ON supplies(shelter_id);

CREATE INDEX idx_reservations_shelter 
ON donation_reservations(shelter_id);

CREATE INDEX idx_entities_name 
ON registered_entities(name);


-- =========================================
-- VIEW (CÁLCULO DE MANTIMENTOS)
-- =========================================

CREATE VIEW supplies_status AS
SELECT 
    s.id,
    s.name,
    s.shelter_id,

    s.min_quantity,
    s.max_quantity,
    s.current_quantity,

    COALESCE(SUM(r.quantity), 0) AS reserved_quantity,

    (s.current_quantity + COALESCE(SUM(r.quantity), 0)) AS total_with_reservations,

    (s.max_quantity - (s.current_quantity + COALESCE(SUM(r.quantity), 0))) AS missing_quantity

FROM supplies s
LEFT JOIN donation_reservations r
    ON s.id = r.supply_id AND r.status = 'active'
GROUP BY s.id;